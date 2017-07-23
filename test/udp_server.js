/**
 * Created by Administrator on 2017/7/14.
 */
//模拟接受信息烧写
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var db_tool=require('../db/sqlite');
var fs=require('fs');
var copy_tool=require('../module/copy');
var tcpReq=require('../module/tcpClient');
var log_tool=require('../module/do_log');
var delete_tool=require('../module/delete');
var iconv = require("iconv-lite");
let musicFolder='D:\\Program Files\\ibcs_t\\bin\\musics';
let db_path='D:\\Program Files\\ibcs_t\\bin\\lib\\ibcs.db';
server.on("error", function (err) {

    console.log("server error:\n" + err.stack);

    server.close();

});
let arr_group=new Array(12);//保存分组信息的数组
let arr_music=[];//保存6个音源名
let count=0;//记录客户端发送次数
server.on("message", function (msg, rinfo) {
    // msg = iconv.decode(msg, 'GBK');
    console.log(msg);
    // log_tool.do_log(log_content+'\n');
    console.log("server from " + rinfo.address + ":" + rinfo.port);
    // if(msg.slice(0,5)=='CCT09'){
    //     let vid=(msg.slice(5,7));//节目源id
    //     console.log('vid-----------'+vid);
    //     let group=msg.slice(7,19);//分组信息6位
    //     console.log('group---------'+group);
    //     let music_name=msg.slice(19);//音乐文件名
    //     console.log('music_name----------'+music_name);
    //     arr_music.push(music_name);
    //     if(vid.slice(0,1)=='0'){
    //         vid=parseInt(vid.slice(1));
    //     }else {
    //         vid=parseInt(vid);
    //     }
    //     if(vid>0&&vid<=12&&count<12){
    //         for(let i=0;i<group.length;i++){
    //             // let char_group=String.fromCharCode(group[i]);
    //             let char_group=group[i];
    //             console.log('group['+i+']-----------'+char_group);
    //             if(char_group=='1'){
    //                 arr_group[i]=vid;
    //             }
    //         }
    //         console.log('arr_group------------'+arr_group);
    //         if(vid==12){
    //             let str_group=arr_group.join(',')+',';
    //             console.log('end of 12 ------------------'+str_group);
    //             db_tool.update({table_name:'t_taskcontent',param_list:new Map([['tnote3',str_group]]),
    //                 where_list:new Map([['sid','14'],['tid','93'],['tcontent','3200']])}).then(
    //                 function () {
    //                     console.log('-----------更新成功--------------');
    //                     console.log('----------arr_music---------'+arr_music);
    //                     let arr_walk=walk(musicFolder,arr_music,'test');
    //                     let arr_musicpath=new Array(12);
    //                     for(let i=0;i<arr_music.length;i++){
    //                         for(let j=0;j<arr_walk.length;j++){
    //                             if(arr_walk[j]){
    //                                 let name=arr_walk[j].split('\\').pop();
    //                                 if(name==arr_music[i]){
    //                                     arr_musicpath[i]=arr_walk[j];
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     console.log('--------------arr_musicpath-------------'+arr_musicpath);
    //                     for(let i=0;i<12;i++){
    //                         let toMusicFolder=musicFolder+'\\test\\demo'+(i+1);
    //                         if(arr_musicpath[i]){
    //                             console.log('src-------------'+arr_musicpath[i]);
    //                             console.log('dest------------'+toMusicFolder+'------------');
    //                             copy_tool.copy(arr_musicpath[i],toMusicFolder).then(function () {
    //                                 console.log('---------------send tcp CCT03 to Tcp server-----------------');
    //                             },function () {
    //                                 console.log('----------------err of copy--------------');
    //                             });
    //                         }else {
    //                             delete_tool.delete_file_indir(toMusicFolder).then(function () {
    //                                 console.log('src----------删除成功---'+toMusicFolder);
    //                             },function () {
    //                                 console.log('----------------删除失败-------------------');
    //                             });
    //                         }
    //                     }
    //                     tcpReq.sendCmd('CCT03',function (result) {
    //                         console.log('-------------CCT03点播音乐'+result);
    //                         // if(result=='do_music success'){
    //                         console.log('--------success--------'+result);
    //                         // res.status(200);
    //                         // res.json({do_music_result:'success'});
    //                         // }else {
    //                         //     console.log('--------fail-----------');
    //                         //     // res.status(200);
    //                         //     // res.json({do_music_result:'fail'});
    //                         // }
    //                     });
    //                     count=0;
    //                     arr_music=[];
    //                     arr_group=new Array(12);
    //                 },
    //                 function () {
    //                     console.log('-------------更新失败-------------------------');
    //                 }
    //             ).catch(function () {
    //                 console.log("Promise Rejected");
    //             });
    //         }else {
    //             count++;
    //         }
    //     }
    // }
});
server.on("listening", function () {

    var address = server.address();
    console.log("server listening " +

        address.address + ":" + address.port);

});
server.bind(41234,'192.168.9.108');
function walk(dir,arr,miss_dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        let file0=file.slice(0);
        file = dir + '\\' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()&&file0!=miss_dir) {
            console.log('---------------目录名---------------------------'+file0);
            results = results.concat(walk(file,arr,miss_dir));
        }else {
            // console.log(name);
            let arr_f=file.split('\\');
            let file_name=arr_f[arr_f.length-1];
            for(let i=0;i<arr.length;i++){
                if(file_name==arr[i]){
                    results.push(file);
                }
            }
        }
    });
    return results
}
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
// console.log(walk(fromMusicFolder,arr_music));