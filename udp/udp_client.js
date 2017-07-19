//多节目源的配合演示项目udp客户端
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");
var fs=require('fs');
socket.bind(56789,function () {
    socket.setBroadcast(true);
});
let vid=1;//节目源id  1-6
let fromMusicFolder='D:\\Program Files\\ibcs_t\\bin\\musics';
let db_path='D:\\Program Files\\ibcs_t\\bin\\lib\\ibcs.db';
//六个分组的节目源信息，分组4-->节目源1，分组6-->节目源2，分组1-->节目源3，分组3-->节目源3，分组2-->节目源4，分组5-->节目源6
let arr_vsrc=['000000001000','000000100000','010000000000','100000000001','000000000100','000010000000',
    '000000000000','000100000000','000000000000','000001000000','001000010000','000000000010'];// 4,3,11,8,6,10,2,11,1,5,12,4,
let arr_music=
    ['25熄灯号.mp3','19音乐盒舞曲(音乐).mp3','25熄灯号.mp3','30早操结束.mp3','周杰伦 - 龙卷风.mp3','you were my everything.mp3',
        '15颁奖曲.mp3','周杰伦 - 龙卷风.mp3', '911 - I Do.mp3','任贤齐 - 天涯.mp3','广播应急1.mp3','信乐团-海阔天空.mp3'];
let timer=setInterval(function () {
    if(vid<=12){
        let v_id;
        if(vid<10){
            v_id='0'+vid;
        }else {
            v_id=vid;
        }
        var message = new Buffer("CCT09"+v_id+arr_vsrc[vid-1]+arr_music[vid-1]);
        socket.send(message, 0, message.length, 41234, '192.168.11.255', function(err, bytes) {
            // socket.close();
        });
    }
    vid++;
},500);
setTimeout(function () {
    clearInterval(timer);
    socket.close();
},7000);