/**
 * Created by Administrator on 2017/7/27.
 */
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.on('close',()=>{
    console.log('socket已关闭');
});

client.on('error',(err)=>{
    console.log(err);
});
client.on('message',(msg,rinfo)=>{
    if(msg=='exit') client.close();
    console.log('-----------------get msg from server-------------');
    console.log(msg);
    console.log('receive message from '+rinfo.address+':'+rinfo.port);
});
client.send('hello',8060,'192.168.9.123');