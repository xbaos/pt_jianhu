/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../tcp/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='D:\\Program Files\\ibcs_t\\bin\\tmp\\MusicInfo.json';
let path0='E:\\work_zx\\json\\MusicInfo.json';
//查询音乐目录及文件列表
function music_list(req,res) {
    // console.log(req);
    console.log("++++++++++++++++++++++++++++++++++++++");
    let obj;
    tcpReq.sendCmd('CCT06', function (result) {
        console.log('-------------CCT06' + result);
        let terminal_state = JSON.parse(fs.readFileSync(path1));
        console.log(terminal_state);
        res.json(JSON.parse(JSON.stringify(terminal_state)));
    });
}
// let terminal_state = JSON.parse(fs.readFileSync(path1));
// console.log(terminal_state);
module.exports={
    music_list:music_list
};