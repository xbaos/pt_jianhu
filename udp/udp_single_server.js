/**
 * Created by Administrator on 2017/7/27.
 */
//udp单播服务端
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('close',()=>{
    console.log('socket已关闭');
});

server.on('error',(err)=>{
    console.log(err);
});

server.on('listening',()=>{
    console.log('socket正在监听中...');
});

server.on('message',(msg,rinfo)=>{
    console.log('receive message from '+rinfo.address+':'+rinfo.port);
    console.log('-----------------get msg from client-------------');
    console.log(msg);
    server.send('exit',rinfo.port,rinfo.address)
});

server.bind('8060');