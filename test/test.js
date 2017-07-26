// /**
//  * Created by Administrator on 2017/7/19.
//  */
// // for issued tasks and musics
//
// var myudp    = require('dgram');
// var fs       = require('fs');
// var bluebird = require('bluebird');
// var client   = myudp.createSocket('udp4');
// var standard = new Buffer('DATA'),end_sign = new Buffer("ENDS"),res = new Buffer("RESP");
// var next = false,add = false, pos = 0,send = 0;
// var date1,date2;//超时重传
//
// process.on('message',function(data){
//         bluebird.reduce(data.detail,function (total, group) {
//             return new Promise(fu+nction (resolve, reject) {
//                 pos = 0;
//                 var message = new Buffer('STAT' + group.id + '.MP3');
//                 client.send(message, 0, message.length, '23130', data.address, function (err, bytes) {
//                     if (err) {
//                         reject(err);
//                         clearInterval(p);
//                     }
//                 });
//                 client.on('message', function (msg, rinfo) {
//                     if (msg.equals(res)) {
//                         next = true;
//                         if (add) {
//                             pos++;
//                         } else if (pos == 0) {
//                             add = true;
//                         }
//                     }
//                 });
//                 var p = setInterval(function () {
//                     if (pos && pos % 500 == 0) {
//                         process.send(pos);
//                     }
//                     if (pos == group.data.length) {
//                         client.send(end_sign, 0, end_sign.length, '23130', data.address, function (err, bytes) {
//                             if (err) {
//                                 reject(err);
//                             } else {
//                                 resolve();
//                             }
//                             clearInterval(p);
//                         })
//                     }
//                     else if (next && pos < group.data.length) {
//                         var message = Buffer.concat([standard, Buffer(group.data[pos].data)], group.data[pos].data.length + 4);
//                         date2 = new Date();
//                         client.send(message, 0, message.length, '23130', data.address, function (err, bytes) {
//                             if (err) {
//                                 console.log(err);
//                                 reject(err);
//                                 clearInterval(p);
//                             } else {
//                                 next = false;
//                                 date1 = new Date();
//                             }
//                         });
//                     } else if (date2 - date1 < 500 && pos < group.data.length) {
//                         date2 = new Date();
//                         var message = Buffer.concat([standard, Buffer(group.data[pos].data)], group.data[pos].data.length + 4);
//                         client.send(message, 0, message.length, '23130', data.address, function (err, bytes) {
//                             if (err) {
//                                 reject(err);
//                                 clearInterval(p);
//                             } else {
//                                 next = false;
//                             }
//                         });
//                     } else {
//                         reject("send timeout");
//                         clearInterval(p);
//                     }
//                 }, 20)
//
//             })
//         },0).then(function () {
//             process.exit(0);
//         },function(err){
//             console.log(err);
//             process.exit(2);
//         })
//     });
//获得某张表内（可选：某一属性范围内）最新插入数据行
// var db_tool=require('../db/sqlite');
// //----------------------------------------------------module test-------------------------------------------------------
// db_tool.get_last_row('t_taskplan','iid')
//     .then(function (row) {
//         console.log('-----------------------get the last of table with xbao---------------------');
//         console.log(row);
//     },function (err) {
//         console.log(err);
//     }
//     );
//----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------function src--------------------------------------------------------
// var sort_tool=require('../module/sort');
// function get_last_row(table_name,key_sort,property_select) {
//     let obj_select;
//     if(property_select){
//         obj_select={table_name:table_name,where_list:new Map([[property_select.key,property_select.value]]),where_connect:'and'}
//     }else {
//         obj_select={table_name:table_name,where_connect:'none'}
//     }
//     db_tool.selectAll(obj_select).then(function (rows) {
//         if(rows.length){
//             rows=sort_tool.rows_sort(rows,key_sort);
//             console.log('---------------------------------------------test sqlite last row-------------------------');
//             console.log(rows[rows.length-1]);
//         }
//     });
// }
// get_last_row('t_taskplan','iid');
//-------------------------------------------------------------------------------------------------------------------
//---------------es7-----------async/await-------------------------------------
// var i = 0;
// //函数返回promise
// function sleep(ms) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             console.log('我执行好了');
//             i++;
//             if (i >= 2) reject(new Error('i>=2'));
//             else resolve(i);
//         }, ms);
//     })
// }
//
// (async function () {
//     try {
//         var val;
//         val = await sleep(1000);
//         console.log(val);
//         val = await sleep(1000);
//         console.log(val);
//         val = await sleep(1000);
//         console.log(val);
//     }
//     catch (err) {
//         console.log('出错啦:'+err.message);
//     }
// } ());
// console.log('-----------主程序没有被阻塞---------------');
//-------------------node 6.X不支持es7 async/await-----------依然使用es6 promise解决for循环异步转同步-----------
var db_tool=require('../db/sqlite');
var fs=require('fs');
var parse_tool=require('../module/parse');
var dir_root='D:/Program Files/ibcs_t/bin/musics';
const list = [];
for (let i = 0; i < 100; ++i) {
    list.push(i);
}
let arr_mpath=['/12国歌(演奏版).mp3','/流行/中华门/林俊杰-爱 (Live).mp3','/流行/玄武门','/broad','/test/demo2/纯音乐 - 火警警报声.mp3',
    '/流行/鸡鸣寺/RADWIMPS (ラッドウィンプス)-夢灯籠.mp3', '/林俊杰-女儿情 (Live).mp3', '/流行/信乐团-海阔天空.mp3', '/流行/任贤齐 - 天涯.mp3' ];
function PromiseForEach(arr, cb) {
    let realResult = [];
    let result = Promise.resolve();
    arr.forEach((a, index) => {
        result = result.then(() => {
            return cb(a).then((res) => {
                realResult.push(res)
            })
        })
    });

    return result.then(() => {
        return realResult
    })
}

PromiseForEach(arr_mpath, (mpath) => {

    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //     console.log(number);
        //     return resolve(number);
        // }, 100);
        db_tool.selectFirst({table_name:'t_musicdir',where_list:new Map([['mcontent',mpath]]),where_connect:'and'})
            .then(function (row) {
                console.log('------------------test es6 for promise success---------------');
                console.log(row);
                return resolve(row.iid);
            },function () {
                console.log('---------------------------------开始解析比特率插入数据库表喽，哼-----------------------');
                //往作息项资源表里增加一条记录
                let uid='admin',mtype,mcaption,mcontent,mvolume=100,mtime=0,mmaxtime=0,mbitrate=0;
                let mpath_full=dir_root+mpath;
                let stat=fs.lstatSync(mpath_full);
                mcaption=mpath.split('/').pop();
                mcontent=mpath;
                if(stat.isDirectory()){
                    mtype=1;
                    fs.exists(mpath_full,function (exist) {
                        if(exist){
                            db_tool.insert({table_name:'t_musicdir',param_list:new Map([
                                ['uid',uid],['mtype',mtype],['mcaption',mcaption],['mcontent',mcontent],
                                ['mvolume',mvolume],['mtime',mtime],['mmaxtime',mmaxtime],['mbitrate',mbitrate]
                            ])})
                                .then(
                                    function () {
                                        console.log('------------------insert to t_musicdir success----------');
                                        db_tool.get_last_row('t_musicdir','iid',{key:'uid',value:uid})
                                            .then(function (row) {
                                                console.log('------------------what is the inserted row--------------');
                                                console.log(row);
                                                console.log('------------------what is i wanted iid--------------');
                                                console.log(row.iid);
                                                return resolve(row.iid);
                                            });
                                    });
                        }
                    })
                }else {
                    mtype=2;
                    fs.exists(mpath_full,function (exist) {
                        if(exist){
                            parse_tool.parse_music(mpath_full)
                                .then(function (music_info) {
                                    mbitrate=music_info.bitRate;
                                    mmaxtime=music_info.maxTime;
                                    mtime=mmaxtime;
                                    db_tool.insert({table_name:'t_musicdir',param_list:new Map([
                                        ['uid',uid],['mtype',mtype],['mcaption',mcaption],['mcontent',mcontent],
                                        ['mvolume',mvolume],['mtime',mtime],['mmaxtime',mmaxtime],['mbitrate',mbitrate]
                                    ])})
                                        .then(
                                            function () {
                                                console.log('------------------insert to t_musicdir success----------');
                                                db_tool.get_last_row('t_musicdir','iid',{key:'uid',value:uid})
                                                    .then(function (row) {
                                                        console.log('------------------what is the inserted row--------------');
                                                        console.log(row);
                                                        console.log('------------------what is i wanted iid--------------');
                                                        console.log(row.iid);
                                                        return resolve(row.iid);
                                                    });
                                            });
                                },function (err) {
                                    console.log(err);
                                })
                        }
                    })
                }
            })
    })
}).then((data) => {
    console.log("成功");
    console.log(data);
}).catch((err) => {
    console.log("失败");
    console.log(err)
});