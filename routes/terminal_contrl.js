/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var udp_tool=require('../module/udp_client');
var util=require('util');
//执行终端控制
function terminal_control(req,res) {
    // let tid=req.query.tid;
    // let cmd=req.query.cmd;
    //android  x-www-form-urlencoded key-value;
    let tid='';
    let ulevel='';
    let tvolume = '';
    let on_off='';
    let tprogram='';
    // let cmd = '';
    if(req.query){
        tid = req.query.tid;
        ulevel=req.query.ulevel;
        tprogram = req.query.tprogram;
        tvolume = req.query.tvolume;
        on_off = req.query.on_off;
        // cmd = req.body.cmd;
    }
    if(req.body!=null&&!tid){
        tid = req.body.tid;
        ulevel=req.body.ulevel;
        tvolume = req.body.tvolume;
        tprogram = req.body.tprogram;
        on_off = req.body.on_off;
        // cmd =req.query.cmd;
    }
    console.log('-------------tvolume'+tvolume+'---------tid'+tid);
    console.log('-------------tprogram'+tprogram+'---------on_off'+on_off);
    //控音量
    if(tvolume!='lose'){
        let arr_buf=[];
        let arr_hex=[0x29, 0x04, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];
        let level=parseInt(ulevel);
        arr_hex[5]=level;
        let volume=parseInt(tvolume);
        for(let i=0;i<240;i++){
            arr_hex.push(volume);
        }
        arr_buf.push(new Buffer(arr_hex));
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            socket.close();
            console.log('音量修改成功-------------promise');
        },function () {
            console.log('音量修改失败-------------promise');
        })
    }
    //控节目源
    if(tprogram!='lose'){
        let arr_buf=[];
        let arr_hex=[0x29, 0x04, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];
        let level=parseInt(ulevel);
        arr_hex[5]=level;
        let volume=parseInt(tvolume);
        for(let i=0;i<240;i++){
            arr_hex.push(volume);
        }
        arr_buf.push(new Buffer(arr_hex));
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            socket.close();
            console.log('音量修改成功-------------promise');
        },function () {
            console.log('音量修改失败-------------promise');
        })
    }
    //控开关
    if(on_off!='lose') {
        let arr_buf = [];
        let arr_hex = [0x29, 0x04, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];
        let level = parseInt(ulevel);
        arr_hex[5] = level;
        if(on_off=='on'){
            arr_hex[1]=1;
        }else if(on_off=='off'){
            arr_hex[1]=0;
        }
        let volume = parseInt(tvolume);
        for (let i = 0; i < 240; i++) {
            arr_hex.push(volume);
        }
        arr_buf.push(new Buffer(arr_hex));
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            socket.close();
            console.log('音量修改成功-------------promise');
        }, function () {
            console.log('音量修改失败-------------promise');
        })
    }
    // if(iid.length<2){
    // }
    // let cmd0='CCT08'+tvolume;
    // console.log(cmd0);
    // tcpReq.sendCmd(cmd0,function (result) {
    //     console.log('-------------CCT08'+result);
    //     // if(result=='terminal_control success'){
    //         res.status(200);
    //         res.json({terminal_control:'success'});
    //     // }else {
    //     //     res.status(200);
    //     //     res.json({terminal_control:'fail'});
    //     // }
    // });
}
module.exports={
    terminal_control:terminal_control
};