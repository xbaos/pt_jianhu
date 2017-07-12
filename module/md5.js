/**
 * Created by Administrator on 2017/7/11.
 */
function md5(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}
// console.log(md5('1'));
module.exports={
  md5:md5
};