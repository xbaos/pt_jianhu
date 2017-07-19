/**
 * Created by Administrator on 2017/7/18.
 */
//节目源管理
var db_tool=require('../db/sqlite');
var express = require('express');
var router = express.Router();
let port_list=function (req,res,next) {
    console.log('-----------------------------------------------------------------');
    db_tool.selectAll({table_name: 's_aosrc', where_list: new Map([['adefault', '0']]), where_connect: 'and'})
        .then(function (rows) {
            if(rows){
                let port_used=[],port_free=[];
                for(let row of rows){
                    port_used.push(parseInt(row.aoid));
                }
                console.log('----------被占用的端口----------');
                console.log(port_used);
                let len=port_used.length;
                console.log('----------length--------'+len);
                for(let i=7001;i<=7240;i++){
                    // if(len>0){
                    // }else {
                    //     port_free.push(i);
                    // }
                    if(port_used.indexOf(i)==-1){
                        port_free.push(i);
                    }
                    if(i==7240){
                        return res.json({port_list: port_free});
                    }
                }
            }
        }, function () {
            return res.json({port_list: 'fail'});
        });
};
router
    .get('/',port_list);
module.exports = router;