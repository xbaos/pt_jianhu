
/**
 * Created by Administrator on 2017/7/4.
 */
//文字引导，初始化路由
var express = require('express');
var router = express.Router();
var db_tool=require('../db/sqlite');
//用户完成文字引导后，发put请求，包含finish参数true，更新后台数据库完成状态----UPDATE
router
    .put('/',function(req, res,next) {
        console.log('------------------------------------test---------init------------------------------------');
        console.log(req.body);
        console.log('------------------------------------test---------end------------------------------------');
        let uid='';
        let finish_new='';
        //ionic
        if(req.query){
            uid = req.query.uid;
            finish_new = req.query.finish_new;
        }
        //android  x-www-form-urlencoded key-value;
        if(req.body!=null && !uid){
            uid = req.body.uid;
            finish_new = req.body.finish_new;
        }
        // let finish_new = req.body.finish_new;  // 从request取出name参数的值然后设置bear的name字段
        db_tool.update({table_name:'s_usersconfig',param_list:new Map([['ucontent',finish_new]]),where_list:new Map([
        ['uid',uid],['ulabel','finish_new']]),where_connect:'and'})
        .then(function () {
            console.log('更新成功');
            res.json({ update_finish: 'success' });
            // db_tool
        })
        .then(function () {
            console.log('更新失败');
            res.json({ update_finish: 'fail' });
        });
    })
;
module.exports = router;