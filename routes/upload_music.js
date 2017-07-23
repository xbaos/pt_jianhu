/**
 * Created by Administrator on 2017/7/6.
 */
var fs = require("fs");
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
function upload_music(req,res) {
    console.log(req);
    console.log(req.files);
    let file=req.files.file;
    let path='D:\\Program Files\\ibcs_t\\bin\\musics\\'+file.name;
    copyFile(file.path,path);
    res.json({upload_music:'success'});
}
module.exports={
  upload_music:upload_music
};