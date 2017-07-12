/**
 * Created by Administrator on 2017/6/26.
 */
const net = require('net');
var PORT = 56789;
var HOST = '192.168.10.245';
var PORT1 = 3000;
var HOST1 = '127.0.0.1';
var PORT2 = 56789;
var HOST2 = '127.0.0.1';
let client = net.connect({host:HOST2,port: PORT2});
client.on('connect', () => {
    console.log("连接成功");
});
function sendCmd(cmd,call) {
    var result;
    client.write(cmd);
    console.log("sendCmd调用");
    client.once('data', (chunk) => {
        result=chunk.toString();
        console.log(result+"...");
        call(result);
    });
}
function sendCmd0(cmd) {
    // var result;
    // client.write(cmd);
    // console.log("sendCmd调用");
    // client.on('db', (chunk) => {
    //     result=chunk.toString();
    //     console.log(result+"...");
    //     // call(result);
    // });
    let pro=new Promise(function (resolve, reject) {
        client.write(cmd);
        console.log("sendCmd调用");
        client.on('data', (chunk) => {
            if(chunk){
                result=chunk.toString();
                console.log(result+"...");
                resolve(result);
            }else {
                reject();
            }
        });
    });
    return pro;
}
client.on('end', () => {
    console.log('disconnected from server');
});
// function stringToHex0(str){
//     var val="";
//     for(var i = 0; i < str.length; i++){
//         if(val == "")
//             val = str.charCodeAt(i).toString(16);
//         else
//             val += "," + str.charCodeAt(i).toString(16);
//     }
//     return val;
// }
// function stringToHex(str) {
//     var arr = [];
//     for (var i = 0; i < str.length; i++) {
//         arr[i] = ('0x'+str.charCodeAt(i).toString(16));
//     }
//     return arr;
// }
// let cmd=stringToHex('CCT01');
// console.log('客户端传入命令'+cmd);
// // console.log('得到的反馈为:'+);
// let arr=[0x43,0x43,0x54,0x30,0x31];
// let buffer=new Buffer('CCT01',['hex']);
// sendCmd(buffer,function (res) {
//     console.log("res:---------"+res);
// });
module.exports={
    sendCmd:sendCmd
};