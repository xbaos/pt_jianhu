/**
 * Created by Administrator on 2017/7/8.
 */
var fs = require('fs');
var tcpReq=require('../tcp/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='E:\\work_zx\\jianhu_pt\\pt_cs\\bin\\tmp\\TerminalInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
let fromMusicFolder='E:\\work_zx\\jianhu_pt\\pt_cs\\bin\\musics\\';
const toMusicFolder = "D:\\Program Files\\ibcs_t\\bin\\musics\\broad\\";
//停止点播的音乐
function stop_music(req,res) {
    // let mpath='';
    // //android  x-www-form-urlencoded key-value;
    // if(req.body != null){
    //     mpath = req.body.mpath;
    // }else{
    //     mpath = req.query.mpath;
    // }
    // // let iid=req.body.iid;
    // console.log('-------------mpath'+mpath);
    // // if(iid.length<2){
    // //     iid='0'+iid;
    // // }
    // // let cmd='CCT09'+mpath;
    // // console.log(cmd);
    // fs.readdir(toMusicFolder, function(err, files) {
    //     if (err) console.log(err);
    //     if (files) {
    //         files.map(function (file) {
    //             fs.unlinkSync(toMusicFolder + file);
    //         })
    //     }
    //     let src=fromMusicFolder + mpath;
    //     let dest=toMusicFolder + mpath.split('\\').pop();
    //     console.log('src------------'+src);
    //     console.log('dest-----------'+dest);
    //     copyFile(src, dest);
        tcpReq.sendCmd('CCT04',function (result) {
            console.log('-------------CCT04停止点播音乐'+result);
            // if(result=='do_music success'){
            res.status(200);
            res.json({stop_music:'success'});
            // }else {
            //     res.status(200);
            //     res.json({do_music_result:'fail'});
            // }
        });
    // });
}
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
module.exports={
    stop_music:stop_music
};