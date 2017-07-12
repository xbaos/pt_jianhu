/**
 * Created by Administrator on 2017/7/6.
 */
var fs = require('fs');
var tcpReq=require('../module/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='D:\\Program Files\\ibcs_t\\bin\\tmp\\TaskInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
//查询任务列表
function task_list(req,res) {
    console.log(req);
    console.log("++++++++++++++++++++++++++++++++++++++");
    //android  x-www-form-urlencoded key-value;
    let uid = "";
    // let upwd = "";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    // if(req.body != null){
    //     uid = req.body.uid;
    //     upwd = req.body.upwd;
    // }else{
    if(req.query){
        uid = req.query.uid;
        // upwd =req.query.upwd;
    }
    if(req.body!=null && !uid){
        console.log('-----------------------body------------------------');
        uid = req.body.uid;
        // upwd = req.body.upwd;
    }
    console.log('--------test_xbao-----------------CCT05'+uid);
    tcpReq.sendCmd('CCT05'+uid,function (result) {
        console.log('-------------005'+result);
        let task_all=JSON.parse(fs.readFileSync(path1)).slice(0,1)[0].plan;
        console.log(task_all);
        let task_today=[];
        let week_today=new Date().getDay();
        let week;
        for(let plan of task_all){
            week=plan.week.split(',');
            if(week[week_today-1]==week_today){
                console.log(plan);
                task_today.push(plan);
            }
        }
        if(task_today.length>0){
            // obj={test:"success"}

            res.json(JSON.parse(JSON.stringify(task_today)));
            res.end();
        }else {
            // obj={test:"failed"}
            res.json({today_task:null});
            res.end();
        }

    });
    // tcpReq.sendCmd0('CCT05').then(function (chunk) {
    //
    // })
    // if(obj){
    //     return res.json(obj);
    // }else {
    //     return res.json({today_task:'fail'});
    // }
}
// let task_all=JSON.parse(fs.readFileSync(filePath));
// let task_arr=task_all.slice(0,1)[0].plan;
// console.log(util.inspect(task_arr, true, null));
// let week_now=new Date().getDay();
// let week;
// let test=[];
// for(let plan of task_arr){
//     week=plan.week.split(',');
//     if(week[week_now-1]==week_now){
//         console.log('---------------------success');
//         console.log(plan);
//         test.push(plan);
//     }
// }
// console.log(JSON.stringify(test));
// let task_all=JSON.parse(fs.readFileSync(path0)).slice(0,1)[0].plan;
// console.log(task_all);
module.exports={
    task_list:task_list
};