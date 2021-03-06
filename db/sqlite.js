/**
 * Created by Administrator on 2017/7/3.
 */
//-----------------------test01-------简单的创建，插入，查询语句-----------------------
// var sqlite3 = require('sqlite3');
// var db = new sqlite3.Database('data/100.db',function() {
//     db.run("create table test(name varchar(15))",function(){
//         db.run("insert into test values('hello,world')",function(){
//             db.all("select * from test",function(err,res){
//                 if(!err)
//                     console.log(JSON.stringify(res));
//                 else
//                     console.log(err);
//             });
//         })
//     });
// });
//    -----------------test02-------------比较复杂的npm标准示例方式
// var fs = require("fs");
// var file = __dirname + "/data/" + "101.db";
// var exists = fs.existsSync(file);
// if(!exists) {
//     console.log("Creating DB file.");
//     fs.openSync(file, "w");
// }
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database(file);
// db.serialize(function() {
//     if(!exists) {
//         db.run("CREATE TABLE Stuff (thing TEXT)");
//     }
//
//     var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
//
//     //Insert random data
//     var rnd;
//     for (var i = 0; i < 10; i++) {
//         rnd = Math.floor(Math.random() * 10000000);
//         stmt.run("Thing #" + rnd);
//     }
//
//     stmt.finalize();
//     db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
//         console.log(row.id + ": " + row.thing);
//     });
// });
//
// db.close();
//-----------------------test03较为全面的增删改查接口---------------------
let SQLite3 = require('sqlite3').verbose();
var sort_tool=require('../module/sort');
let db=new SQLite3.Database('D:\\Program Files\\ibcs_t\\bin\\lib\\ibcs.db');
function createTable(obj) {
    let param_array=[],param_string;
    obj.param_list.forEach(function (value, key) {
        param_array.push(key+' '+value);
    });
    param_string=param_array.join(',');
    db.run("CREATE TABLE "+obj.table_name+" ("+param_string+")",function (err) {
        if(err){
            console.log('建表失败！！！');
            console.log('-------------err'+err);
        }else {
            console.log('建表'+obj.table_name+'成功---');
        }
    });
}
// let param_map=new Map([['cardId','varchar (255)'],['cardName','varchar (255)'],['vouchNo','varchar (255)'],['vouchLab','varchar (255)'],
//     ['createTime','varchar (255)'],['updateTime','varchar (255)'],['status','varchar (255)']]);
// let obj_create={table_name:'CardType',param_list:param_map};
// createTable(obj_create);
// 增
function insert(obj) {
    if (!obj) {
        // callback && callback('params error');
        console.log('插入失败，传参为空----------');
        return ;
    } else{
        let param_key=[],param_val=[],str_key='',str_mark='';
        obj.param_list.forEach(function (value, key) {
            param_key.push(key);
            param_val.push(value);
        });
        str_key=param_key.join(',');
        for (let i=0;i<param_key.length;i++){
            str_mark+='?';
            if(i!=(param_key.length-1)){
                str_mark+=',';
            }
        }
        let pro=new Promise(function (rej, res) {
            db.run("insert into "+obj.table_name+"("+str_key+") values("+str_mark+")",
                param_val,
                function(err) {
                    if (err) {
                        console.log('fail on add ' + err);
                        // callback && callback(err);
                    } else {
                        rej();
                        // callback && callback();
                    }
                });
        });
        return pro;
    }
}
// let map_insert=new Map([['uid','admin'],['sactive',0],['scaption','有点吊']]);
// let obj_insert={table_name:'t_schema',param_list:map_insert};
// insert({table_name:'t_taskplan',param_list:new Map([['uid','admin'],['sid',12],['tstatus',0],['tcaption',
//     'xbao_test'], ['ttime',41220],['tlevel',0],['tcycle',0],['tcycleweek','1,2,0,4,5,6,7,'],['tcycledate',
//     2457933],['ttasktype', 0],['tsleep',200],['tctrlarea',1], ['tnote1',
//     '[文件] 广播应急1.mp3 [文件] 任贤齐 - 天涯.mp3 [文件] 谭咏麟 - 讲不出再见.mp3 ']
//     ,['tnote2','001110111011']])}).then(function () {
//         get_last_row('t_taskplan','iid',{key:'uid',value:'admin'})
//             .then(function (row) {
//                 console.log('------------------get insert row------------------');
//                 console.log(row);
//             });
//         console.log('插入成功-----------promise');
//     },function (err) {
//         console.log(err);
//     }
// );
// 改
function update(obj) {
    if (!obj) {
        // callback && callback('params error');
        return ;
    }else {
        let param_key=[],param_val=[],arr_where=[],str_key='',str_where='';
        obj.param_list.forEach(function (value, key) {
            param_key.push(key);
            param_val.push(value);
        });
        str_key=param_key.join(' = ?, ');
        obj.where_list.forEach(function (value, key) {
            arr_where.push(key);
            param_val.push(value)
        });
        if(obj.where_connect=='or'){
            for (let index in param_key){
                if(index!=0){
                    param_key[index]=param_key[0];
                }
            }
        }
        if(arr_where.length>1){
            str_where=arr_where.join(' = ? '+obj.where_connect+' ');
        }
        // if(arr_where.length>1){
        //     str_where=arr_where.join(' = ? and ');
        // }
        else str_where=arr_where[0];
        let pro=new Promise(function (rej, res) {
            let sql="update "+obj.table_name+" set "+str_key+" = ? where "+str_where+" = ?;";
            console.log(sql);
            console.log(param_val);
            db.run(sql,
                param_val,
                function(err) {
                    if (err) {
                        console.log('fail on add ' + err);
                        // callback && callback(err);
                    } else {
                        rej();
                        // callback && callback();
                    }
                });
        });
        return pro;
    }
};
//--------------------------------同时更新多条记录demo----------------------------
// let map_update=new Map([['ucontent','0']]);
// let where_update=new Map([['uid','user01'],['ulabel','finish_new']]);
// let obj_update={table_name:'s_usersconfig',param_list:map_update,where_list:where_update,where_connect:'and'};
// update({table_name:'s_config',param_list:new Map([['ccontent','xbao--100']]),where_list:new Map([['clabel','product']])})
//     .then(function () {
//         console.log('更新1成功-----------promise');
//         update({table_name:'s_config',param_list:new Map([['ccontent','1.1.2']]),where_list:new Map([['clabel','version']])})
//             .then(function () {
//                 console.log('更新2成功-----------promise');
//                 update({table_name:'s_config',param_list:new Map([['ccontent','www.xbao.com']]),where_list:new Map([['clabel','logo_url']])})
//                     .then(function () {
//                         console.log('更新3成功-----------promise');
//                     });
//             });
//     });
//--------------------------------更新单条记录demo----------------------------
// update({table_name:'t_schema',param_list:new Map([['uid','user01'],['sactive',1],['scaption','牛魔王']])
//     ,where_list:new Map([['iid',29]]),where_connect:'and'})
//     .then(function () {
//         console.log('更新成功--------------');
//     },function (err) {
//         console.log('更新失败--------------'+err);
//     });
//--------------------------------更新定时任务demo--------------------------------
// update({table_name:'t_taskplan',param_list:new Map([['uid','admin'],['sid',12],['tstatus',0],['tcaption',
//     'omggagag'], ['ttime',12345],['tlevel',1],['tcycle',0],['tcycleweek','1,2,3,4,0,6,7,'],['tcycledate',
//     2457933],['ttasktype', ttasktype],['tsleep',200],['tctrlarea',1], ['tnote1',
//     '[文件] 任贤齐 - 天涯.mp3 [文件] 任贤齐 - 天涯.mp3 '],['tnote2','110001001111']]),where_list:new Map([['iid',137]]),where_connect:'and'})
//     .then(function () {
//
//     });
//---------------------------------------------------------------------------------
// 查询（只获取第一条记录）单条记录
function selectFirst(obj) {
    if(!obj){
        console.log('查找失败，参数不能为空');
        return;
    }else{
        let param_key=[],param_val=[],str_key='',str_where='';
        obj.where_list.forEach(function (value, key) {
            param_key.push(key);
            param_val.push(value);
        });
        if(obj.where_connect=='or'){
            for (let index in param_key){
                if(index!=0){
                    param_key[index]=param_key[0];
                }
            }
        }
        if(param_key.length>1){
            str_where=param_key.join(' = ? '+obj.where_connect+' ');
        }else {
            str_where=param_key[0];
        }
        let pro=new Promise(function (resolve, reject) {
            console.log("select * from "+obj.table_name+" where "+str_where+" = ?;");
            console.log(param_val);
            db.get("select * from "+obj.table_name+" where "+str_where+" = ?;",
                param_val,
                function(err,row) {
                    if (err) {
                        console.log('fail on add ' + err);
                    } else {
                        if(row){
                            console.log(row);
                            resolve(row);
                        }else {
                            console.log('没有查到该用户，请确认信息');
                            reject();
                        }
                    }
                });
        });
        return pro;
    }
}
// let map_selectFirst=new Map([['ccontent','大黄蜂'],['cnote1','坏人']]);
// let where_selectFirst=new Map([['uid','admin'],['ulabel','netpriority']]);
// let obj_selectFirst={table_name:'s_usersconfig',where_list:where_selectFirst,where_connect:'and'};
// selectFirst(obj_selectFirst).then(function (row) {
//         console.log('查找成功-----------promise');
//         console.log('-----------'+row.uid+'--------'+row.ucontent);
//     }
// );
// 查询多条记录
function selectAll(obj) {
    if(!obj){
        console.log('查找失败，参数不能为空');
        return;
    }else{
        if(obj.where_connect=='none'){
            let pro=new Promise(function (rej, res) {
                console.log("select * from "+obj.table_name+";");
                db.all("select * from "+obj.table_name+";",
                    function(err,row) {
                        if (err) {
                            console.log('fail on add ' + err);
                            // callback && callback(err);
                        } else {
                            console.log(row);
                            // console.log('回调里面-------------'+row.clabel+'$$$$'+row.ccontent);
                            rej(row);
                            // callback && callback();
                        }
                    });
            });
            return pro;
        }else {
            let param_key=[],param_val=[],str_key='',str_where='';
            obj.where_list.forEach(function (value, key) {
                param_key.push(key);
                param_val.push(value);
            });
            if(obj.where_connect=='or'){
                for (let index in param_key){
                    if(index!=0){
                        param_key[index]=param_key[0];
                    }
                }
            }
            if(param_key.length>1){
                str_where=param_key.join(' = ? '+obj.where_connect+' ');
            }else {
                str_where=param_key[0];
            }
            let pro=new Promise(function (rej, res) {
                console.log("select * from "+obj.table_name+" where "+str_where+" = ?;");
                console.log(param_val);
                db.all("select * from "+obj.table_name+" where "+str_where+" = ?;",
                    param_val,
                    function(err,row) {
                        if (err) {
                            console.log('fail on add ' + err);
                            // callback && callback(err);
                        } else {
                            console.log(row);
                            // console.log('回调里面-------------'+row.clabel+'$$$$'+row.ccontent);
                            rej(row);
                            // callback && callback();
                        }
                    });
            });
            return pro;
        }
    }
}
// selectAll({table_name:'s_aosrc',where_list:new Map([['adefault','0']]), where_connect:'and'})
//     .then(function (rows) {
//         for(
//
//
// let row of rows){
//             console.log('音源名称-----------'+row.acaption+'音源号--------'+row.aoid);
//         }
//     });
// 查询部分记录
// function listTest(obj, callback) {
//     var sql = "select * from CardType";
//     var whereSql = "";
//     var params = [];
//     if (obj) {
//         if (obj.cardId) {
//             whereSql += ' cardId=?';
//             params.push(obj.cardId);
//         }
//         if (obj.vouchLab) {
//             whereSql += ((whereSql) ? ' and ' : ' ') + "vouchLab like '%'||?||'%'";
//             params.push(obj.vouchLab);
//         }
//         if (obj.cardName) {
//             whereSql += ((whereSql) ? ' and ' : ' ') + "cardName like '%'||?||'%'";
//             params.push(obj.cardName);
//         }
//     }
//     if (whereSql) {
//         sql += (" where" + whereSql);
//     }
//     console.log("sql> " + sql);
//     db.all(sql, params,
//         function(err, rows) {
//             if (err) {
//                 console.log('fail on list ' + err);
//                 callback && callback(err);
//             } else {
//                 callback && callback(rows);
//             }
//         });
// }
// listTest({cardId:'04',vouchLab:'ard',cardName:'测试'},function (rows) {
//     for(let row of rows){
//         console.log('查找全部-----------'+row.cardName+'--------'+row.updateTime+'------------'+row.vouchLab);
//     }
// });
// 删
function del(obj){
    if (!obj) {
        console.log('删除失败---传了空参');
        // callback && callback('params error');
        return ;
    }else{
        let param_key=[],param_val=[],str_key='',str_where='';
        obj.where_list.forEach(function (value, key) {
            param_key.push(key);
            param_val.push(value);
        });
        let connect=obj.where_connect.split(',');
        if(connect.length==1){
            if(obj.where_connect=='or'){
                for (let index in param_key){
                    if(index!=0){
                        param_key[index]=param_key[0];
                    }
                }
            }
            if(param_key.length>1){
                str_where=param_key.join(' = ? '+obj.where_connect+' ');
            }else {
                str_where=param_key[0];
            }
        }
        //为批量删除，多级条件嵌套预留方案
        // else if(connect.length>1){
        //
        // }
        let pro=new Promise(function (rej, res) {
            console.log("delete from "+obj.table_name+" where "+str_where+" = ?;");
            console.log(param_val);
            db.run("delete from "+obj.table_name+" where "+str_where+" = ?;",
                param_val,
                function(err) {
                    if (err) {
                        console.log('fail on add ' + err);
                        // callback && callback(err);
                    } else {
                        console.log('删除了-------------'+param_val[0]);
                        rej();
                        // callback && callback();
                    }
                });
        });
        return pro;
    }
    // db.run("delete from "+obj.table_name+" where cardId = ?",
    //     [id],
    //     function(err) {
    //         if (err) {
    //             console.log('fail on add ' + err);
    //             callback && callback(err);
    //         } else {
    //             callback && callback();
    //         }
    //     });
}
// selectAll({table_name:'t_taskplan',where_list:new Map([['sid',24]])})
//     .then(function (rows) {
//         if(rows){
//             del({table_name:'t_taskplan',where_list:new Map([['sid',24]]),where_connect:'and'})
//                 .then(function () {
//                     console.log('删除成功---------------------');
//                     del({table_name:'t_schema',where_list:new Map([['iid',24]]),where_connect:'and'})
//                         .then(function () {
//                             console.log('删除成功---------------------');
//
//                         });
//                 });
//         }else {
//             del({table_name:'t_schema',where_list:new Map([['iid',24]]),where_connect:'and'})
//                 .then(function () {
//                     console.log('删除成功---------------------');
//
//                 });
//         }
//     },function (err) {
//         console.log('----------err0------------------'+err);
//     });

// 记录条数查询
function selectCount(obj) {
    if(!obj){
        console.log('查找失败，参数不能为空');
        return;
    }else{
        let param_key=[],param_val=[],str_key='',str_where='';
        obj.where_list.forEach(function (value, key) {
            param_key.push(key);
            param_val.push(value);
        });
        if(obj.where_connect=='or'){
            for (let index in param_key){
                if(index!=0){
                    param_key[index]=param_key[0];
                }
            }
        }
        if(param_key.length>1){
            str_where=param_key.join(' = ? '+obj.where_connect+' ');
        }else {
            str_where=param_key[0];
        }
        let pro=new Promise(function (rej, res) {
            db.get("select count(*) as cnt from "+obj.table_name+" where "+str_where+" = ?;",
                param_val,
                function(err,obj) {
                    if (err) {
                        console.log('fail on add ' + err);
                        // callback && callback(err);
                    } else {
                        rej(obj);
                        // callback && callback();
                    }
                });
        });
        return pro;
    }
}
// selectCount({table_name:'t_channels',where_list:new Map([['uid','admin'],['cmodel','3400']]),where_connect:'and'}).then(function (obj) {
//     console.log('一共有'+obj.cnt+'条数据');
// });
function get_last_row(table_name,key_sort,property_select) {
    let obj_select;
    if(property_select){
        obj_select={table_name:table_name,where_list:new Map([[property_select.key,property_select.value]]),where_connect:'and'}
    }else {
        obj_select={table_name:table_name,where_connect:'none'}
    }
    let pro=new Promise(function (res,rej) {
        selectAll(obj_select)
            .then(function (rows) {
                if(rows.length){
                    rows=sort_tool.rows_sort(rows,key_sort);
                    console.log('---------------------------------------------test sqlite last row-------------------------');
                    console.log(rows[rows.length-1]);
                    res(rows[rows.length-1]);
                }
                },function (err) {
                rej(err);
            });
    });
    return pro;
}
module.exports={
    insert:insert,//table_name:'s_config',param_list:map_insert[['clabel','room'],['ccontent','三次元'],['cnote1','员工宿舍']]
    update:update, //{table_name:'s_config',param_list:map_update,where_list:where_update}
    del:del,//{table_name:'s_config',where_list:new Map([['clabel','team01'],['cnote1','坏人']])}
    selectFirst:selectFirst,//{table_name:'s_config',where_list:where_selectFirst}
    selectAll:selectAll,//{table_name:'s_config',where_list:new Map([['clabel','team01'],['cnote1','坏人']])}
    selectCount:selectCount,//table
    createTable:createTable,
    get_last_row:get_last_row,
    db:db
};