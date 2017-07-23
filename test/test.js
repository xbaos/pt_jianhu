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