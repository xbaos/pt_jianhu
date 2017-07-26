/**
 * Created by Administrator on 2017/7/18.
 */
//节目源管理
var db_tool=require('../db/sqlite');
var tcpReq=require('../tcp/tcpClient');
var express = require('express');
var router = express.Router();
let aosrc_list=function (req,res,next) {
    // let uid = "";
    let ulevel = "";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        // uid = req.params.uid;
        ulevel = req.params.ulevel;
    }
    if (req.body != null && !ulevel) {
        // uid = req.body.uid;
        ulevel = req.body.ulevel;
    }
    if (ulevel == '0') {
        db_tool.selectAll({table_name: 's_aosrc', where_list: new Map([['adefault', '0']]), where_connect: 'and'})
            .then(function (rows) {
                if (rows) {
                    let times=0;
                    for(var i=0;i<rows.length;i++){
                        for(var j=0;j<rows.length-1-i;j++){
                            if(parseInt(rows[j].aoid)>parseInt(rows[j+1].aoid)){//如果前面的数据比后面的大就交换
                                var temp=rows[j+1];
                                rows[j+1]=rows[j];
                                rows[j]=temp;
                            }
                            console.log("第"+(++times)+"次排序后："+rows);
                        }
                    }
                    return res.json(rows);
                }
            }, function () {
                return res.json({aosrc_list: 'fail'});
            })
    } else {
        return res.json({aosrc_list: 'fail'});
    }
};
let aosrc_delete=function (req,res,next) {
    let cmd='CCT08'+'src';
    let ports = "";
    // console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        ports = req.params.ports;
    }
    if (req.body != null && !ports) {
        ports = req.body.ports;
    }
    let arr_map=[];
    let arr_ports=ports.split(',');
    for(let index in arr_ports){
        if(!arr_map.length){
            arr_map.push(['aoid',''+(7000+parseInt(arr_ports[index]))]);
        }else {
            arr_map.push(['aoid'+index,''+(7000+parseInt(arr_ports[index]))]);
        }
    }
    db_tool.del({table_name:'s_aosrc',where_list:new Map(arr_map),where_connect:'or'})
        .then(function () {
            console.log('删除成功---------------------');
                tcpReq.sendCmd(cmd,function (result) {
                    console.log('-------------get tcp_server res'+result);
                    return res.json({aosrc_delete:'success'});
                });
                // return res.json({aosrc_delete:'success'});
        },
            function () {
                console.log('删除失败---------------------');
                return res.json({aosrc_delete:'success'});
        });
};
let aosrc_insert=function (req,res,next) {
    let cmd='CCT08'+'src';
    let uid="";
    let ports = "";
    // console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.query) {
        uid = req.query.uid;
        ports = req.query.ports;
    }
    if (req.body != null && !ports) {
        uid = req.body.uid;
        ports = req.body.ports;
    }
    let arr_ports=[],maps=[];
    arr_ports=ports.split(',');
    for(let port of arr_ports){
        if(port){
            let num=parseInt(port)-7000;
            maps.push(new Map([['uid',uid],['atype','1'],['aoid',port],['adefault','0'],
                ['acaption','节目源'+num],['acontent',port],['adata','0']]));
        }
    }
    for(let map of maps){
        let obj_insert={table_name:'s_aosrc',param_list:map};
        db_tool.insert(obj_insert)
            .then(function () {
                    console.log('插入成功-----------promise');
                    if(maps.indexOf(map)==(maps.length-1)){
                        tcpReq.sendCmd(cmd,function (result) {
                            console.log('-------------get tcp_server res'+result);
                            return res.json({aosrc_insert:'success'});
                        });
                        // return res.json({aosrc_insert:'success'});
                    }
                }, function () {
                    console.log('插入失败-----------promise');
                    return res.json({aosrc_insert:'fail'});
                }
            );
    }
    // return res.json({aosrc_insert:'success'});
};
router
        .get('/:ulevel',aosrc_list)
        .post('/',aosrc_insert)
        .delete('/:ports',aosrc_delete);
module.exports = router;