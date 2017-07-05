
/**
 * Created by Administrator on 2017/7/4.
 */
//文字引导，初始化路由
var express = require('express');
var router = express.Router();
var db_tool=require('../data/sqlite');
router
    .post('/',function(req, res,next) {
    let finish = req.body.finish;  // 从request取出name参数的值然后设置bear的name字段
    db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',finish]]),where_list:new Map([['clabel','finish']])})
        .then(function () {
            console.log('更新成功');
            res.json({ message: 'Bear created!' });
        });
    })
    .get('/',function () {

    })
;

module.exports = router;