/**
 * 数据库连接
 */
const config = require('./index.js')
const log4js = require('./../utils/log4j.js')
const mongoose = require('mongoose')
mongoose.connect(config.url)

const db = mongoose.connection;
db.on('error',()=>{
    log4js.error('****** 数据库连接失败 ******')
})
db.on('open',()=>{
    log4js.info('****** 数据库连接成功 ******')
})