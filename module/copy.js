/**
 * Created by Administrator on 2017/7/11.
 */
var fs=require('fs');
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
// let fromMusicFolder='D:\\Program Files\\ibcs_t\\bin\\musics\\常用铃声\\04新版眼保健操.mp3';
// let toMusicFolder='D:\\Program Files\\ibcs_t\\bin\\musics\\demo1';
// copyFile('D:\\Program Files\\ibcs_t\\bin\\musics\\常用铃声\\04新版眼保健操.mp3',
//     'D:\\Program Files\\ibcs_t\\bin\\musics\\broad');
function copy(fromMusicFolder,toMusicFolder,new_name) {
    let pro=new Promise(function (resolve, reject) {
        fs.readdir(toMusicFolder, function(err, files) {
            if (err){
                reject();
                console.log(err);
            }else {
                if (files) {
                    files.map(function (file) {
                        fs.unlinkSync(toMusicFolder +'\\'+ file);
                    })
                }
                let dest=toMusicFolder + '\\';
                if(new_name){
                    dest+=new_name;
                }else {
                    dest+=fromMusicFolder.split('\\').pop();
                }
                console.log('src------------'+fromMusicFolder);
                console.log('dest-----------'+dest);
                copyFile(fromMusicFolder, dest);
                resolve();
            }
        });
    });
    return pro;
}
// fs.readdir(toMusicFolder, function(err, files) {
//     if (err) console.log(err);
//     if (files) {
//         files.map(function (file) {
//             fs.unlinkSync(toMusicFolder + file);
//         })
//     }
//     // let src=fromMusicFolder + mpath;
//     let dest=toMusicFolder + '\\'+fromMusicFolder.split('\\').pop();
//     console.log('src------------'+fromMusicFolder);
//     console.log('dest-----------'+dest);
//     copyFile(fromMusicFolder, dest);
//     // tcpReq.sendCmd('CCT03',function (result) {
//     //     console.log('-------------CCT03点播音乐'+result);
//     //     // if(result=='do_music success'){
//     //     res.status(200);
//     //     res.json({do_music_result:'success'});
//     //     // }else {
//     //     //     res.status(200);
//     //     //     res.json({do_music_result:'fail'});
//     //     // }
//     // });
// });
module.exports={
    copy:copy
};