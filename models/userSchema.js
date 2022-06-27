/**
 * 创建用户 mongo 中的模型
 */
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    "userId":Number,
    "userName":String, //用户名称类型
    "userPwd":String,
    "userEmail":String,
    "mobile":String,
    "sex":Number,  // 性别 0：男 1：女
    "deptId":[],   //部门
    "job":String,  // 岗位
    "state":{
        type:Number,
        default:1
    },  //1:在职  2：离职 3：试用期  ,默认为1
    "role":{
        type:Number,
        default:1
    }, //用户角色    0:系统管理员  1:普通用户
    "createTime":{
        type:Date,
        default:Date.now()
    }, //创建时间
    "lastLoginTime":{
        type:Date,
        default:Date.now()
    }// 最后一次登录时间
})
module.exports = mongoose.model("users",userSchema,"users")