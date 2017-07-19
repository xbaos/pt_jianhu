/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../tcp/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='E:\\work_zx\\jianhu_pt\\pt_cs\\bin\\tmp\\TerminalInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
//执行任务
function do_task(req,res) {
    //android  x-www-form-urlencoded key-value;
    let uid = '';
    let iid = '';
    if(req.query){
        uid = req.query.uid;
        iid =req.query.iid;
    }
    if(req.body.uid&&!uid){
        uid = req.body.uid;
        iid = req.body.iid;
    }
    console.log('-------------iid'+iid);
    if(iid.length<2){
        iid='0'+iid;
    }
    let cmd='CCT07'+iid+uid;
    console.log(cmd);
    tcpReq.sendCmd(cmd,function (result) {
        console.log('-------------007'+result);
            res.status(200);
            res.json({doTask_result:'success'});
        // }else {
        //     res.status(200);
        //     res.json({doTask_result:'fail'});
        // }
    });
}
module.exports={
    do_task:do_task
};