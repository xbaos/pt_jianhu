
/**
 * Created by Administrator on 2017/7/4.
 */
//文字引导，初始化路由
var express = require('express');
var router = express.Router();
var db_tool=require('../data/sqlite');
//用户完成文字引导后，发put请求，包含finish参数true，更新后台数据库完成状态----UPDATE
router
    .put('/',function(req, res,next) {
    let finish = req.body.finish;  // 从request取出name参数的值然后设置bear的name字段
    db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',finish]]),where_list:new Map([['clabel','finish']])})
        .then(function () {
            console.log('更新成功');
            // res.json({ message: '更新成功！！！' });
            db_tool
        })
        .then(function () {

        });
    })
;

module.exports = router;