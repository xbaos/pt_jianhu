/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../module/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='D:\\Program Files\\ibcs_t\\bin\\tmp\\TerminalInfo.json';
let path0='D:\\Program Files\\ibcs_t\\bin\\tmp\\TerminalState.json';
//查询音乐信息列表
function terminal_info(req,res) {
    // console.log(req);
    console.log("++++++++++++++++++++++++++++++++++++++");
    tcpReq.sendCmd('CCT01', function (result) {
        console.log('-------------CCT01' + result);
        let terminal_all = JSON.parse(fs.readFileSync(path1));
        tcpReq.sendCmd('CCT02', function (result) {
            console.log('-------------CCT02' + result);
            let terminal_state = JSON.parse(fs.readFileSync(path0));
            terminal_state.map(function(item,index){
                terminal_all[index].state = item.state;
            })
            res.json(terminal_all);
        });
    });
}


module.exports={
    terminal_info:terminal_info
};