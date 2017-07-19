/**
 * Created by Administrator on 2017/7/7.
 */
var fs = require('fs');
var tcpReq=require('../tcp/tcpClient');
var util=require('util');
let filePath='E:\\work_zx\\json\\test_task.json';
let path1='E:\\work_zx\\jianhu_pt\\pt_cs\\bin\\tmp\\TerminalInfo.json';
let path0='E:\\work_zx\\ios\\json\\test_task.json';
let fromMusicFolder='D:\\Program Files\\ibcs_t\\bin\\musics\\';
const toMusicFolder = 'D:\\Program Files\\ibcs_t\\bin\\musics\\broad\\';
//执行音乐点播
function do_music(req,res) {
    let mpath='';
    //ionic
    if(req.query){
        mpath = req.query.mpath;
    }
    //android  x-www-form-urlencoded key-value;
    if(req.body!=null && !mpath){
        mpath = req.body.mpath;
    }
    // let iid=req.body.iid;
    console.log('-------------mpath'+mpath);
    // if(iid.length<2){
    //     iid='0'+iid;
    // }
    // let cmd='CCT09'+mpath;
    // console.log(cmd);
    fs.readdir(toMusicFolder, function(err, files) {
        if (err) console.log(err);
        if (files) {
            files.map(function (file) {
                fs.unlinkSync(toMusicFolder + file);
            })
        }
        let src=fromMusicFolder + mpath;
        let dest=toMusicFolder + mpath.split('\\').pop();
        console.log('src------------'+src);
        console.log('dest-----------'+dest);
        copyFile(src, dest);
        tcpReq.sendCmd('CCT03',function (result) {
            console.log('-------------CCT03点播音乐'+result);
            // if(result=='do_music success'){
                res.status(200);
                res.json({do_music_result:'success'});
            // }else {
            //     res.status(200);
            //     res.json({do_music_result:'fail'});
            // }
        });
    });
}
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
module.exports={
    do_music:do_music
};