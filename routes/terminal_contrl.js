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
    // let tid='';
    let upriority='';
    let tvolume = '';
    let on_off='';
    let tprogram='';
    // let cmd = '';
    if(req.query){
        // tid = req.query.tid;
        upriority=req.query.upriority;
        tprogram = req.query.tprogram;
        tvolume = req.query.tvolume;
        on_off = req.query.on_off;
        // cmd = req.body.cmd;
    }
    if(req.body!=null&&!upriority){
        // tid = req.body.tid;
        upriority=req.body.upriority;
        tvolume = req.body.tvolume;
        tprogram = req.body.tprogram;
        on_off = req.body.on_off;
        // cmd =req.query.cmd;
    }
    console.log('-------------tvolume'+tvolume+'---------upriority'+upriority);
    console.log('-------------tprogram'+tprogram+'---------on_off'+on_off);
    //控音量
    if(tvolume!='lose'){
        let arr_buf=[];
        let arr_hex=[0x29, 0x04, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];
        let priority=parseInt(upriority);
        arr_hex[5]=priority;
        let volume=parseInt(tvolume);
        for(let i=0;i<240;i++){
            arr_hex.push(volume);
        }
        arr_buf.push(new Buffer(arr_hex));
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            console.log('音量修改成功-------------promise');
            return res.json({control_volume:'success',volume:volume});
            socket.close();
        },function () {
            console.log('音量修改失败-------------promise');
            return res.json({control_volume:'fail'});
        })
    }
    //控节目源
    if(tprogram!='lose'){
        let arr_buf = [],arr_map=[];
        let arr_cmd=tprogram.split(',');//对终端开关的控制命令，参数为执行当前命令后开的终端号，格式为[x,x,x,...]
        //若拆分后数组第一个元素为'on_all'或'off_all'，则为全开或全关命令，每次点控或全局控都需发全关全开协议置位
        for(let cmd of arr_cmd){
            let index=parseInt(cmd.split('p')[0]);
            let program=parseInt(cmd.split('p')[1]);
            arr_map.push([index,program]);
        }
        let map_program=new Map(arr_map);
        let off_all = [0x29, 0x00, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];//全关协议
        let on_all = [0x29, 0x01, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];//全开协议
        let priority = parseInt(upriority);
        off_all[5] = priority;
        on_all[5]=priority;
        for (let i = 0; i < 240; i++) {
            off_all.push(1);
            on_all.push(0);
        }
        for (let [key,value] of map_program){
            off_all[7+key]=0;
            on_all[7+key]=value;
        }
        arr_buf.push(new Buffer(off_all));
        arr_buf.push(new Buffer(on_all));
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            console.log('音量控开关成功-------------promise');
            return res.json({control_on_off:'success'});
            socket.close();

        }, function () {
            console.log('音量控开关失败-------------promise');
            return res.json({control_on_off:'fail'});
        })
    }
    //控开关
    if(on_off!='lose') {
        let arr_buf = [];
        let arr_cmd=on_off.split(',');//对终端开关的控制命令，参数为执行当前命令后开的终端号，格式为[x,x,x,...]
        //若拆分后数组第一个元素为'on_all'或'off_all'，则为全开或全开命令，每次点控或全局控都需发全关全开协议置位
        let off_all = [0x29, 0x00, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];//全关协议
        let on_all = [0x29, 0x01, 0x00, 0xf4, 0x00, 0x01, 0x1b, 0x58];//全开协议
        let priority = parseInt(upriority);
        off_all[5] = priority;
        on_all[5]=priority;
        for (let i = 0; i < 240; i++) {
            off_all.push(1);
            on_all.push(0);
        }
        if(arr_cmd[0]=='on_all'){
            for (let i = 0; i < 240; i++) {
                off_all[i+8]=0;
                on_all[i+8]=1;
            }
        }else if(arr_cmd[0]=='off_all'){
            //不置位，默认全关全开
        }else {
            for (let index of arr_cmd) {
                off_all[parseInt(index)+7]=0;
                on_all[parseInt(index)+7]=1;
            }
        }
        arr_buf.push(new Buffer(off_all));
        arr_buf.push(new Buffer(on_all));
        if(arr_cmd[0]=='on_all'){
            for(let i=0;i<10;i++){
                arr_buf.push(new Buffer(off_all));
                arr_buf.push(new Buffer(on_all));
            }
        }
        udp_tool.sendUdp(arr_buf).then(function (socket) {
            console.log('音量控开关成功-------------promise');
            return res.json({control_on_off
                :'success'});
            socket.close();

        }, function () {
            console.log('音量控开关失败-------------promise');
            return res.json({control_on_off:'fail'});
        })
    }
}
module.exports={
    terminal_control:terminal_control
};