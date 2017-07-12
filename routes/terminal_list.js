/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../module/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='D:\\Program Files\\ibcs_t\\bin\\tmp\\TerminalInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
//查询音乐信息列表
function terminal_list(req,res) {
    // console.log(req);
    console.log("++++++++++++++++++++++++++++++++++++++");
    let obj;
    tcpReq.sendCmd('CCT01', function (result) {
        console.log('-------------CCT01' + result);
        let terminal_all = JSON.parse(fs.readFileSync(path1));
        console.log(terminal_all);
        res.json(JSON.parse(JSON.stringify(terminal_all)));
    });
}
module.exports={
    terminal_list:terminal_list
};