/**
 * Created by Administrator on 2017/7/12.
 */
var fs=require('fs');
function delete_file_indir(fromMusicFolder) {
    let pro=new Promise(function (resolve, reject) {
        fs.readdir(fromMusicFolder, function(err, files) {
            if (err){
                reject();
                console.log(err);
            }else {
                if (files) {
                    files.map(function (file) {
                        fs.unlinkSync(fromMusicFolder +'\\'+ file);
                    })
                }
                console.log('delete success----------------');
                resolve();
            }
        });
    });
    return pro;
}
module.exports={
    delete_file_indir:delete_file_indir
};