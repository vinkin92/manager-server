/**
 * 用户管理路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema.js')
const Counter = require('./../models/counterSchema.js')
const util = require('./../utils/util.js')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
// 二级路由
router.prefix('/users')

// 用户登录
router.post('/login',async (ctx, next) => {
  try {
    // 解构参数
    // post 请求的参数在 request.body 中
    const { userName,userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role deptId roleList')
    if(res){
      const data = res._doc
      const token = jwt.sign({data:data},'imooc',{expiresIn:'10h'})
      data.token = token;
      ctx.body = util.success(data)
    }else{
      ctx.body = util.fail("账号或密码不正确")
    }
  } catch (error) {
    ctx.body = util.fail(error)
  }
  
})

// 用户列表
router.get('/list', async (ctx)=>{
  // 获取查询的 userId,userName,state
  const {userId,userName,state} = ctx.request.query;
  // 通过工具函数获取当前页码和起始数据
  const {page,skipIndex} = util.pager(ctx.request.query)
  let params = {}
  //如果有用户id，或有用户名称 或则用户状态，则赋值给 params ,用来通过这几个参数查询数据库并返回内容
  if(userId)params.userId=userId;
  if(userName)params.userName=userName;
  if(state && state != 0)params.state=state;
  try {
    // 根据查询条件，获取数据库的内容，不返回 id 和 userPwd
    const query = User.find(params,{_id:0,userPwd:0})
    // skip 表示从第几条开始查询，limit 表示查询返回的数量
    const list = await query.skip(skipIndex).limit(page.pageSize)
    // 获取查询出来的总数量
    const total = await User.countDocuments(params);
    ctx.body=util.success({
      page:{...page,total},
      list
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常:${error.stack}`)
  }
})



/**
 * 用户删除/批量删除，根据用户传递的id数组，来修改用户是否离职
 */
router.post('/delete',async(ctx,next)=>{
  // 获取待更改的用户数组
  const {userIds} = ctx.request.body
  // 更新数据库中的数据，更新条件为 userId 字段,$in 表示在userIds 中的数组值，把state更新为2
  const res =await User.updateMany({userId:{$in:userIds}},{state:2})
  if(res.modifiedCount){
    ctx.body = util.success(res,`共删除成功${res.modifiedCount}条数据`)
    return;
  }
  ctx.body=util.fail('删除失败')

})

/**
 * 用户新增
 */
router.post('/operate',async (ctx)=>{
  const {userId,userName,userEmail,mobile,job,state,roleList,deptId,action} = ctx.request.body
  //如果点击的是添加用户
  if(action == 'add'){
    if(!userName || !userEmail || !deptId){
      ctx.body = util.fail('参数错误',util.CODE.PARAM_ERROR)
      return
    }
    // 查找
    // new：true 表示把最新的值返回回来
    const doc = await Counter.findOneAndUpdate({_id:'userId'},{$inc:{sequence_value:1}},{new:true})
    const res = await User.findOne({$or:[{userName},{userEmail}]},'_id userName userEmail')
    if(res){
      ctx.body = util.fail(`系统用户重复${res.userName}-${res.userEmail}`)
    }else {
      try {
        const  user = new User({
          userId:doc.sequence_value,
          role:1,
          userPwd:md5('123456'),
          userName,userEmail,mobile,job,state,roleList,deptId
        })
        user.save()
        ctx.body = util.success({code:0},'用户创建成功')
      } catch (error) {
        ctx.body = util.fail(`用户创建失败:${error}`)
      }
    }
  }else{
    if(!deptId){
      ctx.body = util.fail('部门不能为空',util.CODE.PARAM_ERROR)
      return;
    }
    const res =await User.findOneAndUpdate({userId},{mobile,job,state,roleList,deptId})
    if(res){
      ctx.body = util.success(res,'更新成功')
      return
    }
    ctx.body = util.fail('更新失败')
  }
})
module.exports = router
