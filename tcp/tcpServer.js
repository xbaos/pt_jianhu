/**
 * Created by Administrator on 2017/6/26.
 */
var net = require('net');

var PORT = 56789;
var HOST = '127.0.0.1';
var PORT1 = 45678;
var HOST1 = '127.0.0.1';
// tcp服务端
var server = net.createServer(function(socket){
    console.log('服务端：收到来自客户端的请求');
    socket.on('data', function(data){
        // let arr=[];
        // let cmd0=[67,67,84,48,49];
        console.log('服务端：收到客户端数据，内容为{'+ data +'}');
        switch (data.toString()){
            case 'CCT05':
                socket.write('任务列表更新，请查看json文件');
                break;
            case 'CCT0661user01':
                socket.write('success');
                break;
            case 'CCT01':
                socket.write('terminal_list success');
                break;
            case 'CCT02':
                socket.write('terminal_state success');
                break;
            case 'CCT07':
                socket.write('任务列表更新，请查看json文件');
                break;
            case 'CCT0661user01':
                socket.write('success');
                break;
            case 'CCT03':
                socket.write('do_music success');
                break
        }
        // 给客户端返回数据 
        // for (let d of data){
        //     // data[index]=data[index].toString(16);
        //     arr.push(d);
        //     console.log('------------'+d+'-------------');
        // }
        // if(arrCompare(arr,cmd0)){
        //     socket.write('终端信息查询成功');
        // }else {
        //     socket.write('查询失败');
        //     // console.log(data);
        // }
    });
    socket.on('close', function(){
        console.log('服务端：客户端连接断开');
    });
});
server.listen(PORT, HOST, function(){
    console.log('TCP服务端：开始监听来自客户端的请求');
});
function arrCompare(arr0,arr1) {
    for(let index in arr0){
        if(arr0[index]!=arr1[index]){
            return false;
        }
    }
    return true;
}