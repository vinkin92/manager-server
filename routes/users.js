/**
 * 用户管理路由
 */
const router = require('koa-router')()
const User = require('./../models/userSchema.js')
const util = require('./../utils/util.js')
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
    })
    if(res){
      ctx.body = util.success(res)
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
