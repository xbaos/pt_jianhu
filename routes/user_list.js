/**
 * Created by Administrator on 2017/7/18.
 */
//节目源管理
var db_tool=require('../db/sqlite');
var express = require('express');
var router = express.Router();
let user_list=function (req,res,next) {
    console.log('-----------------------------------------------------------------');
    db_tool.selectAll({table_name:'s_users',where_list:new Map([['uactive','1']]),where_connect:'and'})
        .then(function (rows) {
                console.log('查找用户成功---------------------');
                let user_list=[];
                for(let row of rows){
                    user_list.push(row.uid);
                }
                return res.json({user_list:user_list});
            },
            function () {
                console.log('删除失败---------------------');
                return res.json({user_list:'fail'});
            });
};
router
    .get('/',user_list);
module.exports = router;