var express = require('express');
//---------------------------------------自带及npm模块
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipart_middleware=multipart();//文件上传中间件
// var multer=require('multer');
var util = require('util');
//-------------------------------------------自定义模块
var tcpReq=require('./module/tcpClient');
var md5=require('./module/md5');
var db_tool=require('./db/sqlite');
//--------------------------------------------路由模块
var index = require('./routes/index');
var users = require('./routes/users');
var init = require('./routes/init');
var upload=require('./routes/upload');
var task_list=require('./routes/task_list');
var do_task=require('./routes/do_task');
var terminal_list=require('./routes/terminal_list');
var terminal_state=require('./routes/terminal_state');
var terminal_info=require('./routes/terminal_info');
var terminal_control=require('./routes/terminal_contrl');
var music_list=require('./routes/music_list');
var do_music=require('./routes/do_music');
var stop_music=require('./routes/stop_music');
var group = require('./routes/group');
//------------------------------------------------
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/', index);
app.use('/users', users);
app.use('/init', init);
app.post('/login',function (req,res,next) {

    //android  x-www-form-urlencoded key-value;
    let uid = "";
    let upwd = "";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    // if(req.body != null){
    //     uid = req.body.uid;
    //     upwd = req.body.upwd;
    // }else{
    if(req.query){
        uid = req.query.uid;
        upwd =req.query.upwd;
    }
    if(req.body!=null && !uid){
        console.log('-----------------------body------------------------');
        uid = req.body.uid;
        upwd = req.body.upwd;
    }
    // }
    //IOS Native
    // if(!req.body.params){
    //     var str = JSON.parse(req.body[""]);
    //     req.body.params = str.params;
    // }

    //android  x-www-form-urlencoded key-value;
    // let uid = "";
    // let upwd = "";
    // if(req.body != {}){
    //     uid = req.body.uid;
    //     upwd = req.body.upwd;
    //     if(req.body.params!=null){
    //         //IONIC
    //         uid = req.body.params.uid;
    //         upwd =req.body.params.upwd;
    //     }
    // }

    // var user = req.body.params.userName;
    // var paw  = req.body.params.userPassword;
    upwd=md5.md5(upwd);
    db_tool.selectFirst({table_name:'s_users',where_list:new Map([['uid',uid],['upwd',upwd]]),
        where_connect:'and'})
        .then(function (row) {
            console.log('----uid'+row.uid+'----upwd'+row.upwd+ '登录成功');
            let ulevel=row.ulevel;
            // role=row.uid;
            res.status(200);
            return res.json({login:'success',uid:uid,upwd:upwd,ulevel:ulevel});
        },function () {
            console.log('---------------err-----------------------');
            res.status(200);
            return res.json({login:'fail'});
        });
});
app.post('/do_task',do_task.do_task);
app.post('/terminal_control',terminal_control.terminal_control);
//文件上传test01----------------multer
// app.post('/file_upload', function (req, res) {
//
//     console.log(req.files[0]);  // 上传的文件信息
//
//     var des_file = __dirname + "/music" + req.files[0].originalname;
//     fs.readFile( req.files[0].path, function (err, data) {
//         fs.writeFile(des_file, data, function (err) {
//             if( err ){
//                 console.log( err );
//             }else{
//                 response = {
//                     message:'File uploaded successfully',
//                     filename:req.files[0].originalname
//                 };
//             }
//             console.log( response );
//             res.end( JSON.stringify( response ) );
//         });
//     });
// });
// 单文件上传获取信息
// app.post('/upload-single',upload.single('myfile'),function(req,res,next){
//     var file=req.file;
//     // console.log("名称：%s",file.originalname);
//     // console.log("mime：%s",file.mimetype);
// //以下代码得到文件后缀
//     name=file.originalname;
//     nameArray=name.split('');
//     var nameMime=[];
//     l=nameArray.pop();
//     nameMime.unshift(l);
//     while(nameArray.length!=0&&l!='.'){
//         l=nameArray.pop();
//         nameMime.unshift(l);
//     }
// //Mime是文件的后缀
//     Mime=nameMime.join('');
//     console.log(Mime);
//     res.send("done");
// //重命名文件 加上文件后缀
//     fs.renameSync('./upload/'+file.filename,'./upload/'+file.filename+Mime);
//
// });
app.post('/task_list',task_list.task_list);
app.get('/terminal_list',terminal_list.terminal_list);
app.get('/terminal_state',terminal_state.terminal_state);
app.get('/terminal_info',terminal_info.terminal_info);
app.get('/music_list',music_list.music_list);
app.post('/do_music',do_music.do_music);
app.post('/stop_music',stop_music.stop_music);
app.post('/upload',multipart_middleware,upload.upload);


app.get("/getAllGroup",group.getAllGroup);
app.get("/getTerminalByGroup",group.getTerminalByGroup);
app.post('/addGroup',group.addGroup);
app.delete('/group',group.deleteGroup);
app.patch('/group',group.editGroup);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
