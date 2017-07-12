/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../module/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='E:\\work_zx\\jianhu_pt\\pt_cs\\bin\\tmp\\TerminalInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
//执行终端控制
function terminal_control(req,res) {
    // let tid=req.query.tid;
    // let cmd=req.query.cmd;
    //android  x-www-form-urlencoded key-value;
    let tvolume = '';
    // let cmd = '';
    if(req.query){
        tvolume = req.query.tvolume;
        // cmd = req.body.cmd;
    }
    if(req.body!=null&&!tvolume){
        tvolume = req.body.tvolume;
        // cmd =req.query.cmd;
    }
    console.log('-------------cmd'+cmd+'---------tid'+tid);
    // if(iid.length<2){
    //     iid='0'+iid;
    // }
    let cmd0='CCT08'+tvolume;
    console.log(cmd0);
    tcpReq.sendCmd(cmd0,function (result) {
        console.log('-------------CCT08'+result);
        // if(result=='terminal_control success'){
            res.status(200);
            res.json({terminal_control:'success'});
        // }else {
        //     res.status(200);
        //     res.json({terminal_control:'fail'});
        // }
    });
}
module.exports={
    terminal_control:terminal_control
};