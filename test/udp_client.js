/**
 * Created by Administrator on 2017/7/14.
 */
//demo 信息烧写
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");
var fs=require('fs');
socket.bind(56788,function () {
    socket.setBroadcast(true);
});
let message = new Buffer([0x29,0x07,0x00,0x18,0x00,0x01,0x1b,0x58,0xc0,0xa8,0x01,0x22,0xff,0xff,0xff,0x00,0xc0,0xa8,0x01,0x01,0x00,0x00,0x00,0x00,0xe0,0x01,0x01,0x01]);
let message1=new Buffer([0x29,0x09,0x00,0x08,0x00,0x00,0x1b,0x58,0x05,0x00,0x8b,0xf5]);
let arr_msg=[message1,message];
console.log(arr_msg);
for (let index in arr_msg){
    socket.send(arr_msg[index], 6003, '255.255.255.255', function(err, bytes) {
        console.log('烧写'+index+'号-------------->');
        console.log(arr_msg[index]);
        if(index==(arr_msg.length-1)){
            console.log('index----------'+index);
            console.log('arr_msg.length----------'+(arr_msg.length-1));
            socket.close();
        }
    });
}
// setTimeout(function () {
//     socket.close();
// },7000);