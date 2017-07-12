/**
 * Created by Administrator on 2017/7/6.
 */
var fs = require("fs");
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
function upload(req,res) {
    console.log(req);
    let file=req.files.file;
    let path='D:\\Program Files\\ibcs_t\\bin\\musics\\'+file.name;
    copyFile(file.path,path);
    res.json({upload:'success'});
}
module.exports={
  upload:upload
};