/**
 * Created by Administrator on 2017/7/19.
 */
//定时任务模块
var db_tool=require('../db/sqlite');
var express = require('express');
var router = express.Router();
var time_transform_tool=require('../module/time_transform');
var sort=require('../module/sort');
var date_tool=require('../module/date');
//获得当前用户的可见方案列表
function schema_list(req,res,next) {
    let uid="";
    let ulevel="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        uid = req.params.uid;
        ulevel = req.params.ulevel;
    }
    if (req.body != null && !uid) {
        uid = req.body.uid;
        ulevel = req.body.ulevel;
        // ulevel = req.body.ulevel;
    }
    ulevel=parseInt(ulevel);
    if (ulevel == 0) {
        db_tool.selectAll({table_name: 't_schema', where_connect: 'none'})
            .then(function (rows) {
                if (rows) {
                    console.log(rows);
                    return res.json({success:true,data:rows});
                }
            }, function (err) {
                return res.json({success:false,err:err});
            });
    } else {
        db_tool.selectAll({table_name: 't_schema', where_list:new Map([['uid',uid]]),where_connect: 'and'})
            .then(function (rows) {
                if (rows) {
                    console.log(rows);
                    return res.json({success:true,data:rows});
                }
            }, function (err) {
                return res.json({success:false,err:err});
            });
    }
}
//获得方案基本信息
function schema_info(req,res,next) {
    let sid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        sid = req.params.sid;
    }
    if (req.body != null && !sid) {
        sid = req.body.sid;
        // ulevel = req.body.ulevel;
    }
    db_tool.selectFirst({table_name: 't_schema',where_list:new Map([['iid',parseInt(sid)]]), where_connect: 'and'})
        .then(function (row) {
            if (row) {
                console.log(row);
                return res.json({success:true,data:row});
            }
        }, function (err) {
            return res.json({success:false,err:err});
        });
}
//新建方案
function insert_schema(req,res,next) {
    let uid="",sactive='',scaption='';
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.query) {
        uid = req.query.uid;
        sactive = req.query.sactive;
        scaption = req.query.scaption;
    }
    if (req.body != null && !uid) {
        uid = req.body.uid;
        sactive = req.body.sactive;
        scaption = req.body.scaption;
    }
    let map_insert=new Map([['uid',uid],['sactive',parseInt(sactive)],['scaption',scaption]]);
    let obj_insert={table_name:'t_schema',param_list:map_insert};
    db_tool.insert(obj_insert)
        .then(function () {
            console.log('插入成功-----------promise');
            db_tool.get_last_row('t_schema','iid',{key:'uid',value:uid})
                .then(function (row) {
                    return res.json({success:true,data:row});
                },function (err) {
                    return res.json({success:false,err:err});
                });
            },function (err) {
            return res.json({success:false,err:err});
        }
    );
}
//删除方案  删除方案表、任务表，方案任务内容表信息，依层级删除，并给出不同情况的处理结果
function delete_schema(req,res,next) {
    let sid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        sid = req.params.sid;
    }
    if (req.body != null && !sid) {
        sid = req.body.sid;
        // ulevel = req.body.ulevel;
    }
    //批量删除方案预留代码，考虑到方案数量的可控和操作的相对原子性，暂不执行此部分，以备后续需求
    // let arr_map=[];
    // let arr_ports=sids.split('&');
    // for(let index in arr_ports){
    //     if(!arr_map.length){
    //         arr_map.push(['sid',parseInt(arr_ports[index])]);
    //     }else {
    //         arr_map.push(['sid'+index,parseInt(arr_ports[index])]);
    //     }
    // }
    sid=parseInt(sid);
    db_tool.selectAll({table_name:'t_taskplan',where_list:new Map([['sid',sid]]),where_connect:'and'})
        .then(function (rows) {
            if(rows.length){
                db_tool.del({table_name:'t_taskplan',where_list:new Map([['sid',sid]]),where_connect:'and'})
                    .then(function () {
                        console.log('删除成功---------------------');
                        db_tool.del({table_name:'t_schema',where_list:new Map([['iid',sid]]),where_connect:'and'})
                            .then(function () {
                                console.log('删除成功---------------------');
                                delele_task_content(sid,{success:true,data:'删除方案及其任务成功'});
                            },function (err) {
                                return res.json({success:false,err:err});
                            });
                    });
            }else {
                db_tool.selectAll({table_name:'t_schema',where_list:new Map([['iid',sid]]),where_connect:'and'})
                    .then(function (row) {
                        if(row.length){
                            db_tool.del({table_name:'t_schema',where_list:new Map([['iid',sid]]),where_connect:'and'})
                                .then(function () {
                                    console.log('删除成功---------------------');
                                    delele_task_content(sid,{success:true,data:'删除空方案成功'});
                                },function (err) {
                                    return res.json({success:false,err:err});
                                });
                        }else {
                            delele_task_content(sid,{success:false,err:'该方案不存在，请确认操作为最新数据'});
                        }
                    },function (err) {
                        return res.json({success:false,err:err});
                    });
            }
        },function (err) {
            console.log('----------err0------------------'+err);
            return res.json({success:false,err:err});
        });
    function delele_task_content(sid,data_json) {
        db_tool.selectAll({table_name:'t_taskcontent',where_list:new Map([['sid',sid]]),where_connect:'and'})
            .then(function (rows) {
                if(rows.length){
                    db_tool.del({table_name:'t_taskcontent',where_list:new Map([['sid',sid]]),where_connect:'and'})
                        .then(function () {
                            console.log('----------------删除任务内容成功--------------');
                            if(data_json.data){
                                data_json.data+='，删除了该任务里面的内容';
                            }else {
                                data_json.err+='，不过删除了该任务里面的内容';
                            }
                            return res.json(data_json);
                        },function (err) {
                            return res.json({success:false,err:err});
                        })
                }else {
                    if(data_json.data){
                        data_json.data+='，删除了该任务里面的内容';
                    }else {
                        data_json.err+='，不过删除了该任务里面的内容';
                    }
                    return res.json(data_json);
                }
            },function (err) {
                return res.json({success:false,err:err});
            })
    }
}
//修改方案的基本信息
function update_schema(req,res,next) {
    let sid="",uid='',sactive='',scaption='';
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        sid = req.params.sid;
    }
    if (req.body != null && !sid) {
        sid = req.body.sid;
        // ulevel = req.body.ulevel;
    }
    if (req.query) {
        uid = req.query.uid;
        sactive = req.query.sactive;
        scaption = req.query.scaption;
    }
    if (req.body != null && !uid) {
        uid = req.body.uid;
        sactive = req.body.sactive;
        scaption = req.body.scaption;
    }
    sid=parseInt(sid);
    sactive=parseInt(sactive);
    db_tool.update({table_name:'t_schema',param_list:new Map([['uid',uid],['sactive',sactive],['scaption',scaption]])
        ,where_list:new Map([['iid',sid]]),where_connect:'and'})
        .then(function () {
            console.log('更新成功--------------');
            return res.json({success:true,data:'update_schema_success'});
        },function (err) {
            console.log('更新失败--------------'+err);
            return res.json({success:false,err:err});
        });
}
//获得选定方案的任务列表
function task_list(req,res,next) {
    let sid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        sid = req.params.sid;
    }
    if (req.body != null && !sid) {
        sid = req.body.sid;
        // ulevel = req.body.ulevel;
    }
        db_tool.selectAll({table_name: 't_taskplan',where_list:new Map([['sid',sid]]), where_connect: 'and'})
            .then(function (rows) {
                if (rows) {
                    console.log(rows);
                    for (let row of rows){
                        let num=parseInt(row.ttime);
                        let time=time_transform_tool.numTo_time(num);
                        row.ttime=time;
                        let day_interval=row.tcycledate-2440588;//查库中间隔天数
                        let date_end=date_tool.interval_todate(day_interval,'1970-01-01');
                        row.tcycledate=date_end;
                    }
                    return res.json({success:true,data:rows});
                }
            }, function (err) {
                return res.json({success:false,err:err});
            });
}
//获得任务常规参数
function get_task_info(req,res,next) {
    let tid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        tid = req.params.tid;
    }
    if (req.body != null && !tid) {
        tid = req.body.tid;
        // ulevel = req.body.ulevel;
    }
    db_tool.selectFirst({table_name: 't_taskplan',where_list:new Map([['iid',parseInt(tid)]]), where_connect: 'and'})
        .then(function (row) {
            if (row) {
                console.log(row);
                let num=parseInt(row.ttime);
                let time=time_transform_tool.numTo_time(num);
                row.ttime=time;
                let day_interval=row.tcycledate-2440588;//查库中间隔天数
                let date_end=date_tool.interval_todate(day_interval,'1970-01-01');
                row.tcycledate=date_end;
                return res.json({success:true,data:row});
            }
        }, function (err) {
            return res.json({success:false,err:err});
        });
}
function insert_task_info(req,res) {
    let data=parse_json_request(req);

}
//获得任务内容
function get_task_content(req,res,next) {
    let tid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        tid = req.params.tid;
    }
    if (req.body != null && !tid) {
        tid = req.body.tid;
        // ulevel = req.body.ulevel;
    }
    db_tool.selectFirst({table_name: 't_taskplan',where_list:new Map([['iid',parseInt(tid)]]), where_connect: 'and'})
        .then(function (row) {
            if (row) {
                console.log(row);
                let arr_program=row.tnote1.split('[');
                arr_program.shift();
                arr_program=arr_program.map(function (value) {
                   return '['+value;
                });
                let uid=row.uid;
                let sid=row.sid;
                db_tool.selectAll({table_name:'s_aosrc',where_list:new Map([['uid',uid]]),where_connect:'and'})
                    .then(function (rows) {
                        if(rows){
                            let len=rows.length;
                            console.log('-------------len-------'+len);
                            let arr_content=new Array(len);
                            console.log('----------------arr_content0--------');
                            console.log(arr_content);
                            let times=0;
                            for(var i=0;i<rows.length;i++){
                                for(var j=0;j<rows.length-1-i;j++){
                                    if(parseInt(rows[j].aoid)>parseInt(rows[j+1].aoid)){//如果前面的数据比后面的大就交换
                                        var temp=rows[j+1];
                                        rows[j+1]=rows[j];
                                        rows[j]=temp;
                                    }
                                    console.log("第"+(++times)+"次排序后："+rows);
                                }
                            }
                            db_tool.selectFirst({table_name:'t_taskcontent',where_list:new Map([
                                ['sid',sid],['tid',tid],['ttype',0]]), where_connect: 'and'})
                                .then(function (row) {
                                    if(row){
                                        if(row.tcontent){
                                            let arr_index=row.tcontent.split(',');
                                            arr_index.pop();
                                            arr_index.map(function (value) {
                                                return parseInt(value);
                                            });
                                            if(arr_program.length==arr_index.length){
                                                for(let program of arr_program){
                                                    let index=arr_index.shift();
                                                    arr_content[index-1]=program;
                                                    console.log('----------------index--------'+(index-1));
                                                    console.log(arr_index);
                                                    console.log('----------------arr_content0--------');
                                                    console.log(arr_content);
                                                }
                                                console.log('-----------arr_index------------'+arr_index);
                                                // return res.json({success:true,data:arr_content});
                                                if(arr_content.length==rows.length){
                                                    for (let i=0;i<rows.length;i++){
                                                        if(arr_content[i]){
                                                            rows[i].content=arr_content[i];
                                                        }else {
                                                            rows[i].content='<点击选择>';
                                                        }
                                                    }
                                                }
                                            }

                                        }else {
                                           for(let ro of rows){
                                               ro.content='<点击选择>';
                                           }
                                        }
                                        return res.json({success:true,data:rows});
                                    }
                                });
                        }
                    });
                // return res.json(row);
            }
        }, function (err) {
            return res.json({success:false,err:err});
        });
}
//获得分组控制列表
function get_task_group(req,res,next) {
    let tid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        tid = req.params.tid;
    }
    if (req.body != null && !tid) {
        tid = req.body.tid;
        // ulevel = req.body.ulevel;
    }
    db_tool.selectFirst({table_name: 't_taskplan',where_list:new Map([['iid',parseInt(tid)]]), where_connect: 'and'})
        .then(function (row) {
            if (row) {
                console.log(row);
                let uid = row.uid;
                let sid = parseInt(row.sid);
                tid=parseInt(tid);
                db_tool.selectFirst({table_name:'t_taskcontent',where_list:new Map([['sid',sid],['tid',tid],
                    ['ttype',99],['tcontent','3200']]),where_connect:'and'})
                    .then(function (row) {
                        let str_on=row.tnote1;
                        let str_off=row.tnote2;
                        let arr_match=row.tnote3.split(',');
                        arr_match.pop();
                        db_tool.selectAll({table_name:'t_channels',where_list:new Map([['uid',uid],
                            ['cmodel','3200']]),where_connect:'and'})
                            .then(function (rows) {
                                let arr_group=sort.rows_sort(rows,'corder');
                                if(str_on.length==str_off.length&&str_off.length==arr_match.length&&
                                    arr_group.length==arr_match.length){
                                    let arr_data=[];
                                    for(let group of arr_group){
                                        arr_data.push({group:group});
                                    }
                                    db_tool.selectAll({table_name:'s_aosrc',where_list:new Map([
                                        ['uid',uid]],['atype',1])})
                                        .then(function (rows) {
                                            let arr_program=sort.rows_sort(rows,'aoid');
                                            let max=parseInt(arr_program[arr_program.length-1].aoid);
                                            let arr_program_src=new Array(max);
                                            for(let program of arr_program){
                                                let index=parseInt(program.aoid)-7000;
                                                arr_program_src[index]=program;
                                            }
                                            for(let i=0;i<arr_data.length;i++){
                                                let match=parseInt(arr_match[i]);
                                                let program=arr_program_src[match];
                                                let auto_on=parseInt(str_on.charAt(i));
                                                let auto_off=parseInt(str_off.charAt(i));
                                                arr_data[i].auto_on=auto_on;
                                                arr_data[i].auto_off=auto_off;
                                                arr_data[i].program=program;
                                            }
                                            return res.json({success:true,data:arr_data});
                                        });
                                }
                            });
                    });
            }
        },function (err) {
            return res.json({success:false,err:err});
        });

}
//获得终端控制列表
function get_task_terminal(req,res,next) {
    let tid="";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        tid = req.params.tid;
    }
    if (req.body != null && !tid) {
        tid = req.body.tid;
        // ulevel = req.body.ulevel;
    }
    db_tool.selectFirst({table_name: 't_taskplan',where_list:new Map([['iid',parseInt(tid)]]), where_connect: 'and'})
        .then(function (row) {
            if (row) {
                console.log(row);
                let uid = row.uid;
                let sid = parseInt(row.sid);
                tid=parseInt(tid);
                db_tool.selectFirst({table_name:'t_taskcontent',where_list:new Map([['sid',sid],['tid',tid],
                    ['ttype',99],['tcontent','3290']]),where_connect:'and'})
                    .then(function (row) {
                        let str_on=row.tnote1;
                        let str_off=row.tnote2;
                        let arr_match=row.tnote3.split(',');
                        arr_match.pop();
                        db_tool.selectAll({table_name:'t_channels',where_list:new Map([['uid',uid],
                            ['cmodel','3290']]),where_connect:'and'})
                            .then(function (rows) {
                                //完成对所有终端依次序（端口偏移量递增）排序，作为结果数组key
                                let arr_terminal=sort.rows_sort(rows,'corder');
                                if(str_on.length==str_off.length&&str_off.length==arr_match.length&&
                                    arr_terminal.length==arr_match.length){
                                    let arr_data=[];
                                    for(let terminal of arr_terminal){
                                        arr_data.push({terminal:terminal});
                                    }
                                    db_tool.selectAll({table_name:'s_aosrc',where_list:new Map([
                                        ['uid',uid]],['atype',1])})
                                        .then(function (rows) {
                                            //完成端口偏移量与节目源名的映射关系
                                            let arr_program=sort.rows_sort(rows,'aoid');
                                            let max=parseInt(arr_program[arr_program.length-1].aoid);
                                            let arr_program_src=new Array(max);
                                            for(let program of arr_program){
                                                let index=parseInt(program.aoid)-7000;
                                                arr_program_src[index]=program;
                                            }
                                            for(let i=0;i<arr_data.length;i++){
                                                let match=parseInt(arr_match[i]);
                                                let program=arr_program_src[match];
                                                let auto_on=parseInt(str_on.charAt(i));
                                                let auto_off=parseInt(str_off.charAt(i));
                                                arr_data[i].auto_on=auto_on;
                                                arr_data[i].auto_off=auto_off;
                                                arr_data[i].program=program;
                                            }
                                            return res.json({success:true,data:arr_data});
                                        });
                                }
                            });
                    });
            }
        },function (err) {
            return res.json({success:false,err:err});
        });

}
//测试接受application/json形式的req数据解析
// function insert_test_json(req,res) {
//     res.json(parse_json_request(req));
// }
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
router
    //-----------------------------------------get--------select-----------------------------------------
    //根据用户id获得方案列表
    .get('/schema_list/uid/:uid/ulevel/:ulevel',schema_list)
    //根据方案id获得方案基本信息和包含的任务列表
    .get('/schema/info/:sid',schema_info)
    .get('/schema/task_list/:sid',task_list)
    //根据任务id获得任务常规参数、任务内容、分组控制、终端控制
    .get('/schema/task/info/:tid',get_task_info)
    .get('/schema/task/content/:tid',get_task_content)
    .get('/schema/task/group/:tid',get_task_group)
    .get('/schema/task/terminal/:tid',get_task_terminal)
//------------------------------------------------------post-------insert--------------------------------------
    .post('/schema/info',insert_schema)
    .post('/schema/task/info',insert_task_info)
    // .post('/schema/test/json',insert_test_json)
//------------------------------------------------------delete-----delete--------------------------------------
    .delete('/schema/info/:sid',delete_schema)
//-------------------------------------------------------put--------update-------------------------------------
    .put('/schema/info/:sid',update_schema)
    // .delete()
;
    // .post('/',aosrc'_insert)
    // .delete('/:ports',aosrc_delete);
module.exports = router;