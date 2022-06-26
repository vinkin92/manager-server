/**
 * 用户管理路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema.js')
const util = require('./../utils/util.js')
const jwt = require('jsonwebtoken')
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
  if(userId)params.userId;
  if(userName)params.userName;
  if(state && state !='0')params.state;
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

module.exports = router
