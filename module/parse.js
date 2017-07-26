/**
 * Created by Administrator on 2017/7/24.
 */
var spawn    = require('child_process').spawn;
function parse_music(music_path) {
    return new Promise(function(resolve,reject){
        let result={};
        var rs = spawn("D:/Program Files/ibcs_t/bin/mplayer/mplayer.exe",['-identify','-endpos','0.1','-af','volume=-200',music_path]);
        var str= '';

        rs.stdout.on('data',function(data){
            str += data;
        });
        rs.stderr.on('data',function(err){
        });
        rs.on('exit',function(code) {
            console.log("child process exited with code "+code);
            var result1 = (/ID_AUDIO_BITRATE=[0-9]+/g).exec(str);
            var result2 = (/ID_LENGTH=[0-9]+/g).exec(str);
            result.bitRate = parseInt(result1[0].substr(17) / 1000);
            result.maxTime = parseInt(result2[0].substr(10));
            resolve(result);
        });
    });
}
function parse_json_request(req) {
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        return req.body.data;
        // res.send({"status": "json_head_success", "name": req.body.data.name, "url": req.body.data.url});
    } else {
        //不能正确解析json 格式的post参数
        var body = '', jsonStr;
        req.on('data', function (chunk) {
            body += chunk; //读取参数流转化为字符串
        });
        req.on('end', function () {
            //读取参数流结束后将转化的body字符串解析成 JSON 格式
            try {
                jsonStr = JSON.parse(body);
            } catch (err) {
                jsonStr = null;
            }
            let data;
            jsonStr ? data=jsonStr.data : data={success:false,err:'fail to parse json with stream'};
            return data;
        });
    }
}
// parse_music('D:\\Program Files\\ibcs_t\\bin\\musics\\林俊杰-女儿情 (Live).mp3')
//     .then(function (result) {
//         console.log(result);
//     },function (err) {
//         console.log(err);
//     });
module.exports={
    parse_music:parse_music,
    parse_json_request:parse_json_request
};