/**
 * 用户管理路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema.js')
const util = require('./../utils/util.js')
const jwt = require('jsonwebtoken')
// 二级路由
router.prefix('/users')

router.post('/login',async (ctx, next) => {
  try {
    // 解构参数
    // post 请求的参数在 request.body 中
    const { userName,userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    },'userId userName userEmail state role deptId roleList')
    const data = res._doc
    const token = jwt.sign({data:data},'imooc',{expiresIn:'1h'})
    if(res){
      data.token = token;
      ctx.body = util.success(data)
    }else{
      ctx.body = util.fail("账号或密码不正确")
    }
  } catch (error) {
    ctx.body = util.fail(error)
  }
  
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
