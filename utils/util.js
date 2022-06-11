/**
 * 通用工具函数
 */
 const log4js = require('./log4j')
 const CODE  = {
     SUCCESS: 200,
     PARAM_ERROR: 10001, // 参数错误
     USER_ACCOUNT_ERROR: 20001, //账号或密码错误
     USER_LOGIN_ERROR: 30001, // 用户未登录
     BUSINESS_ERROR: 40001, //业务请求失败
     AUTH_ERROR: 500001, // 认证失败或TOKEN过期
 }
 module.exports = {
     /**
      * 分页结构封装
      * 
      * @param {number} pageNum 第几页
      * @param {number} pageSize 一页多少条数据
      */
     pager({pageNum=1,pageSize=10}){
         pageNum*=1;
         pageSize*=1;
         const skipIndex = (pageNum-1)*pageSize;//计算出下一个索引，如第2页的数据起始值为 2-1=1*10=10 从10开始
         return {
             page:{
                 pageNum,
                 pageSize
             },
             skipIndex
         }
     },
     success(data='',msg='',code=CODE.SUCCESS){
         log4js.debug(data);
         return {
             code,data,msg
         }
     },
     fail(msg='',code=CODE.BUSINESS_ERROR,data=''){
         log4js.debug(msg);
         return {
             code,data,msg
         }
     },
     CODE
 }