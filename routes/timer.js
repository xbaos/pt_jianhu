/**
 * Created by Administrator on 2017/7/19.
 */
//定时任务模块
var db_tool=require('../db/sqlite');
var express = require('express');
var router = express.Router();
var tcpReq=require('../tcp/tcpClient');
var time_transform_tool=require('../module/time_transform');
var sort=require('../module/sort');
var fs=require('fs');
var parse_tool=require('../module/parse');
var promise_tool=require('../module/promise');
var dir_root='D:/Program Files/ibcs_t/bin/musics';
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
    let cmd='CCT08'+'plan';
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
                    // tcpReq.sendCmd(cmd,function (result) {
                    //     console.log('-------------get tcp_server res'+result);
                    //     return res.json({success:true,data:row});
                    // });
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
    let cmd='CCT08'+'plan';
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
                            // tcpReq.sendCmd(cmd,function (result) {
                            //     console.log('-------------get tcp_server res'+result);
                            //     return res.json(data_json);
                            // });
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
                    // tcpReq.sendCmd(cmd,function (result) {
                    //     console.log('-------------get tcp_server res'+result);
                    //     return res.json(data_json);
                    // });
                    return res.json(data_json);
                }
            },function (err) {
                return res.json({success:false,err:err});
            })
    }
}
//修改方案的基本信息
function update_schema(req,res,next) {
    let cmd='CCT08'+'plan';
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
            // tcpReq.sendCmd(cmd,function (result) {
            //     console.log('-------------get tcp_server res'+result);
            //     return res.json({success:true,data:'update_schema_success'});
            // });
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
//获得该用户可获得的所有节目源，包括本地节目源和网络节目源
function program_list(req,res,next) {
    let uid = "";
    // let ulevel = "";
    console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        uid = req.params.uid;
        // ulevel = req.params.ulevel;
    }
    if (req.body != null && !uid) {
        uid = req.body.uid;
        // ulevel = req.body.ulevel;
    }
    // if (ulevel == '0') {
        db_tool.selectAll({table_name: 's_aosrc', where_list: new Map([['uid', uid]]), where_connect: 'and'})
            .then(function (rows) {
                if (rows) {
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
                    return res.json({success:true,data:rows});
                }
            }, function (err) {
                return res.json({success:true,data:err});
            })
    // } else {
    //     return res.json({aosrc_list: 'fail'});
    // }
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
//新建定时任务-----插入---------
function insert_task(req,res) {
    let cmd='CCT08'+'plan';
    let uid='',sid='';
    // console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        uid = req.params.uid;
        sid = req.params.sid;
    }
    if (req.body != null && !uid) {
        uid = req.body.uid;
        sid = req.body.sid;
        // ulevel = req.body.ulevel;
    }
    let data=parse_json_request(req);
    //t_taskplan表中所有字段
    let tstatus=0,
        tcaption=data.info.tcaption,
        ttime=time_transform_tool.timeTo_num(data.info.ttime),
        tlevel=data.info.tlevel,
        tcycle=data.info.tcycle,
        tcycleweek=data.info.tcycleweek,
        tcycledate=date_tool.getday_interval(data.info.tcycledate,'1970-01-01')+2440588,
        ttasktype=data.info.ttasktype,
        tsleep=200,
        tctrlarea=1,
        tnote1,//tnote1-->内容名字集合
        tnote2;//tnote2-->分组是否全开标记
    let arr_content_name=[];
    //第二张表t_taskcontent的字段
    let arr_schema_id=[],arr_schema_active=[];//对应切换方案,方案id及是否启用    第一条记录 1-arr_schema_id
    let str_schema_id='',str_schema_active='';
    let arr_program_index=[],arr_musicdir_id=[],arr_mpath=[],delay='',play_type='';//对应播放音频，节目源排序后序号及作息项资源id  第一条记录 0-arr_program_index
    let str_program_index='',str_musicdir_id='';
    let arr_group=[],arr_group_on=[],arr_group_off=[],arr_group_program=[];// 第二条记录 99-3200
    let str_group_on='',str_group_off='',str_group_program='';
    let arr_terminal=[],arr_terminal_on=[],arr_terminal_off=[],arr_terminal_program=[]; //第三条记录 99-3290
    let str_terminal_on='',str_terminal_off='',str_terminal_program='';
    let str_area_on_off='';//分区控开关--------3400-----预留借口，此处默认插入全开全关分区，只查询某用户的分区数
    if(ttasktype==0){
        delay+=data.content.delay;
        play_type+=data.content.play_type;
        for(let music of data.content.music_list){
            if(music.content!='<点击选择>'){
                arr_content_name.push(music.content);
                arr_program_index.push(data.content.music_list.indexOf(music)+1);
                arr_mpath.push(music.mpath);
            }
        }
        str_program_index=arr_program_index.join(',')+',';
    }else if(ttasktype==1){
        arr_content_name.push('切换方案');
        for(let schema of data.content.schema_list){
            arr_schema_id.push(schema.sid);
            arr_schema_active.push(schema.sactive);
        }
        str_schema_id=arr_schema_id.join(',')+',';
        str_schema_active=arr_schema_active.join(',')+',';
    }
    tnote1=arr_content_name.join(' ')+' ';
    for(let dev of data.dev_control){
        switch (dev.dev_model){
            case '3200':
                arr_group.push(dev);
                break;
            case '3290':
                arr_terminal.push(dev);
                break;
        }
    }
    arr_group=sort.rows_sort(arr_group,'dev_order');
    arr_terminal=sort.rows_sort(arr_terminal,'dev_order');
    for(let group of arr_group){
        arr_group_on.push(group.auto_on);
        arr_group_off.push(group.auto_off);
        arr_group_program.push((parseInt(group.aoid)-7000));
    }
    str_group_on+=arr_group_on.join('');
    tnote2=str_group_on;
    str_group_off+=arr_group_off.join('');
    str_group_program+=arr_group_program.join(',')+',';
    for(let terminal of arr_terminal){
        arr_terminal_on.push(terminal.auto_on);
        arr_terminal_off.push(terminal.auto_off);
        arr_terminal_program.push((parseInt(terminal.aoid)-7000));
    }
    str_terminal_on+=arr_terminal_on.join('');
    str_terminal_off+=arr_terminal_off.join('');
    str_terminal_program+=arr_terminal_program.join(',')+',';
    //------------------------------------------------最难的部分，promise循环查表，解析音乐文件比特率，插表，取作息项资源
    //----------------id列表，完成音乐资源关联----太特么绕了---------------------------------------------
    promise_tool.promise_for_each(arr_mpath, (mpath) => {

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
                    let mtype,mcaption,mcontent,mvolume=100,mtime=0,mmaxtime=0,mbitrate=0;
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
                                        mbitrate=parseInt(music_info.bitRate)*1000;
                                        mmaxtime=parseInt(music_info.maxTime)*1000;
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
        arr_musicdir_id=data;
        str_musicdir_id=arr_musicdir_id.join(',')+',';
        db_tool.insert({table_name:'t_taskplan',param_list:new Map([['uid',uid],['sid',sid],['tstatus',0],['tcaption',
            tcaption], ['ttime',ttime],['tlevel',tlevel],['tcycle',tcycle],['tcycleweek',tcycleweek],['tcycledate',
            tcycledate],['ttasktype', ttasktype],['tsleep',200],['tctrlarea',1], ['tnote1',
            tnote1],['tnote2',tnote2],['tnote3','']])}).then(function () {
                db_tool.get_last_row('t_taskplan','iid',{key:'uid',value:'admin'})
                    .then(function (row) {
                        let tid=row.iid;
                        let num=parseInt(row.ttime);
                        let time=time_transform_tool.numTo_time(num);
                        row.ttime=time;
                        let day_interval=row.tcycledate-2440588;//查库中间隔天数
                        let date_end=date_tool.interval_todate(day_interval,'1970-01-01');
                        row.tcycledate=date_end;
                        let row_res=row;//返回给用户，新插入的数据行
                        console.log('------------------to res row who insert------------------');
                        console.log(row_res);
                        db_tool.selectCount({table_name:'t_channels',where_list:new Map([['uid',uid],
                            ['cmodel','3400']]),where_connect:'and'})
                            .then(function (obj) {
                                let count=obj.cnt;
                                for(let i=0;i<count;i++){
                                    str_area_on_off+='1';
                                }
                                let obj_insert01;
                                if(ttasktype==1){
                                    obj_insert01={table_name:'t_taskcontent',param_list:new Map([
                                        ['sid',sid],['tid',tid],['ttype',ttasktype],['tcontent',str_schema_id],
                                        ['tnote1',str_schema_active]
                                    ])}
                                }else if(ttasktype==0){
                                    obj_insert01={table_name:'t_taskcontent',param_list:new Map([
                                        ['sid',sid],['tid',tid],['ttype',ttasktype],['tcontent',str_program_index],
                                        ['tnote1',str_musicdir_id],['tnote2',play_type],['tnote3',delay],
                                        ['tnote4',''],['tnote5','']
                                    ])}
                                }
                                db_tool.insert(obj_insert01)
                                    .then(function (result001) {
                                        console.log('----------------insert in to t_taskcontent---001-----------'+result001);
                                        db_tool.insert({table_name:'t_taskcontent',param_list:new Map([
                                            ['sid',sid],['tid',tid],['ttype',99],['tcontent','3400'],
                                            ['tnote1',str_area_on_off],['tnote2',str_area_on_off],['tnote3','']
                                            ,['tnote4',''],['tnote5','']
                                        ])})
                                            .then(function (result002) {
                                                console.log('----------------insert in to t_taskcontent-----002---------'+result002);
                                                db_tool.insert({table_name:'t_taskcontent',param_list:new Map([
                                                    ['sid',sid],['tid',tid],['ttype',99],['tcontent','3200'],
                                                    ['tnote1',str_group_on],['tnote2',str_group_off],['tnote3',str_group_program],
                                                    ['tnote4',''],['tnote5','']
                                                ])})
                                                    .then(function (result003) {
                                                        console.log('----------------insert in to t_taskcontent-----003---------'+result003);
                                                        db_tool.insert({table_name:'t_taskcontent',param_list:new Map([
                                                            ['sid',sid],['tid',tid],['ttype',99],['tcontent','3290'],
                                                            ['tnote1',str_terminal_on],['tnote2',str_terminal_off],['tnote3',str_terminal_program],
                                                            ['tnote4',''],['tnote5','']
                                                        ])})
                                                            .then(function (result004) {
                                                                console.log('----------------insert in to t_taskcontent-----004---------'+result004);
                                                                tcpReq.sendCmd(cmd,function (result) {
                                                                    console.log('-------------get tcp_server res'+result);
                                                                    return res.json({success:true,data:row_res});
                                                                });
                                                                // return res.json({success:true,data:row_res});
                                                            },function (err) {
                                                                console.log(err);
                                                                return res.json({success:false,err:err});
                                                            });
                                                    },function (err) {
                                                        console.log(err);
                                                        return res.json({success:false,err:err});
                                                    });
                                            },function (err) {
                                                console.log(err);
                                                return res.json({success:false,err:err});
                                            });
                                    },function (err) {
                                        console.log(err);
                                        return res.json({success:false,err:err});
                                    });
                            });
                    });
                console.log('插入成功-----------promise');
            },function (err) {
                console.log(err);
                return res.json({success:false,err:err});
            }
        );
    }).catch((err) => {
        console.log("失败");
        console.log(err);
        return res.json({success:false,err:err});
    });
    //----------------------------------------------------------end  of promises to get t_musicdir_id------------------------
}
//----------------------------------------------------------更新定时任务------update-----------------------------------
function update_task(req,res) {
    let cmd='CCT08'+'plan';
    let uid='',sid='',tid='';
    // console.log(req);
    console.log('-----------------------------------------------------------------');
    if (req.params) {
        // uid = req.params.uid;
        // sid = req.params.sid;
        tid = req.params.tid;
    }
    if (req.body != null && !tid) {
        // uid = req.body.uid;
        // sid = req.body.sid;
        tid = req.body.tid;
    }
    let data=parse_json_request(req);
    //t_taskplan表中所有字段
    // let tid=data.tid;
    let tstatus=0,
        tcaption=data.info.tcaption,
        ttime=time_transform_tool.timeTo_num(data.info.ttime),
        tlevel=data.info.tlevel,
        tcycle=data.info.tcycle,
        tcycleweek=data.info.tcycleweek,
        tcycledate=date_tool.getday_interval(data.info.tcycledate,'1970-01-01')+2440588,
        ttasktype=data.info.ttasktype,
        tsleep=200,
        tctrlarea=1,
        tnote1,//tnote1-->内容名字集合
        tnote2;//tnote2-->分组是否全开标记
    let arr_content_name=[];
    //第二张表t_taskcontent的字段
    let arr_schema_id=[],arr_schema_active=[];//对应切换方案,方案id及是否启用    第一条记录 1-arr_schema_id
    let str_schema_id='',str_schema_active='';
    let arr_program_index=[],arr_musicdir_id=[],arr_mpath=[],delay='',play_type='';//对应播放音频，节目源排序后序号及作息项资源id  第一条记录 0-arr_program_index
    let str_program_index='',str_musicdir_id='';
    let arr_group=[],arr_group_on=[],arr_group_off=[],arr_group_program=[];// 第二条记录 99-3200
    let str_group_on='',str_group_off='',str_group_program='';
    let arr_terminal=[],arr_terminal_on=[],arr_terminal_off=[],arr_terminal_program=[]; //第三条记录 99-3290
    let str_terminal_on='',str_terminal_off='',str_terminal_program='';
    let str_area_on_off='';//分区控开关--------3400-----预留借口，此处默认插入全开全关分区，只查询某用户的分区数
    if(ttasktype==0){
        delay+=data.content.delay;
        play_type+=data.content.play_type;
        for(let music of data.content.music_list){
            if(music.content!='<点击选择>'){
                arr_content_name.push(music.content);
                arr_program_index.push(data.content.music_list.indexOf(music)+1);
                arr_mpath.push(music.mpath);
            }
        }
        str_program_index=arr_program_index.join(',')+',';
    }else if(ttasktype==1){
        arr_content_name.push('切换方案');
        for(let schema of data.content.schema_list){
            arr_schema_id.push(schema.sid);
            arr_schema_active.push(schema.sactive);
        }
        str_schema_id=arr_schema_id.join(',')+',';
        str_schema_active=arr_schema_active.join(',')+',';
    }
    tnote1=arr_content_name.join(' ')+' ';
    for(let dev of data.dev_control){
        switch (dev.dev_model){
            case '3200':
                arr_group.push(dev);
                break;
            case '3290':
                arr_terminal.push(dev);
                break;
        }
    }
    arr_group=sort.rows_sort(arr_group,'dev_order');
    arr_terminal=sort.rows_sort(arr_terminal,'dev_order');
    for(let group of arr_group){
        arr_group_on.push(group.auto_on);
        arr_group_off.push(group.auto_off);
        arr_group_program.push((parseInt(group.aoid)-7000));
    }
    str_group_on+=arr_group_on.join('');
    tnote2=str_group_on;
    str_group_off+=arr_group_off.join('');
    str_group_program+=arr_group_program.join(',')+',';
    for(let terminal of arr_terminal){
        arr_terminal_on.push(terminal.auto_on);
        arr_terminal_off.push(terminal.auto_off);
        arr_terminal_program.push((parseInt(terminal.aoid)-7000));
    }
    str_terminal_on+=arr_terminal_on.join('');
    str_terminal_off+=arr_terminal_off.join('');
    str_terminal_program+=arr_terminal_program.join('' +
            ',')+',';
    db_tool.selectFirst({table_name:'t_taskplan',where_list:new Map([['iid',tid]]),where_connect:'and'})
        .then(function (row) {
            if(row){
                uid=row.uid;
                sid=row.sid;
                promise_tool.promise_for_each(arr_mpath, (mpath) => {

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
                                let mtype,mcaption,mcontent,mvolume=100,mtime=0,mmaxtime=0,mbitrate=0;
                                let mpath_full=dir_root+mpath;
                                let stat=fs.lstatSync(mpath_full);
                                mcaption=mpath.split('/').pop();
                                mcontent=mpath;
                                if(stat.isDirectory()){
                                    mtype=1;  //作息项中音乐资源类型-------------1-->目录
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
                                    mtype=2;  //----------------音乐资源类型--------1--->文件
                                    fs.exists(mpath_full,function (exist) {
                                        if(exist){
                                            parse_tool.parse_music(mpath_full)
                                                .then(function (music_info) {
                                                    mbitrate=parseInt(music_info.bitRate)*1000;
                                                    mmaxtime=parseInt(music_info.maxTime)*1000;
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
                    arr_musicdir_id=data;
                    str_musicdir_id=arr_musicdir_id.join(',')+',';
                    db_tool.update({table_name:'t_taskplan',param_list:new Map([['uid',uid],['sid',sid],['tstatus',0],['tcaption',
                        tcaption], ['ttime',ttime],['tlevel',tlevel],['tcycle',tcycle],['tcycleweek',tcycleweek],['tcycledate',
                        tcycledate],['ttasktype', ttasktype],['tsleep',200],['tctrlarea',1], ['tnote1',
                        tnote1],['tnote2',tnote2],['tnote3','']]),where_list:new Map([['iid',tid]]),where_connect:'and'})
                        .then(function () {
                                db_tool.selectFirst({table_name:'t_taskplan',where_list:new Map([['iid',tid]]),where_connect:'and'})
                                    .then(function (row) {
                                        let tid=row.iid;
                                        let num=parseInt(row.ttime);
                                        let time=time_transform_tool.numTo_time(num);
                                        row.ttime=time;
                                        let day_interval=row.tcycledate-2440588;//查库中间隔天数
                                        let date_end=date_tool.interval_todate(day_interval,'1970-01-01');
                                        row.tcycledate=date_end;
                                        let row_res=row;//返回给用户，新插入的数据行
                                        console.log('------------------to res row who insert------------------');
                                        console.log(row_res);
                                        db_tool.selectCount({table_name:'t_channels',where_list:new Map([['uid',uid],
                                            ['cmodel','3400']]),where_connect:'and'})//获得该用户拥有的分区数，并默认全开全关
                                            .then(function (obj) {
                                                let count=obj.cnt;
                                                for(let i=0;i<count;i++){
                                                    str_area_on_off+='1';
                                                }
                                                let obj_insert01;
                                                if(ttasktype==1){
                                                    obj_insert01={table_name:'t_taskcontent',param_list:new Map([
                                                        ['sid',sid],['tid',tid],['ttype',ttasktype],['tcontent',str_schema_id],
                                                        ['tnote1',str_schema_active]
                                                    ]),where_list:new Map([['sid',sid],['tid',tid],['ttype',ttasktype]])
                                                        ,where_connect:'and'}
                                                }else if(ttasktype==0){
                                                    obj_insert01={table_name:'t_taskcontent',param_list:new Map([
                                                        ['sid',sid],['tid',tid],['ttype',ttasktype],['tcontent',str_program_index],
                                                        ['tnote1',str_musicdir_id],['tnote2',play_type],['tnote3',delay],
                                                        ['tnote4',''],['tnote5','']
                                                    ]),where_list:new Map([['sid',sid],['tid',tid],['ttype',ttasktype]])
                                                        ,where_connect:'and'}
                                                }
                                                db_tool.update(obj_insert01)
                                                    .then(function (result001) {
                                                        console.log('----------------update in to t_taskcontent---001-----------'+result001);
                                                        db_tool.update({table_name:'t_taskcontent',param_list:new Map([
                                                            ['sid',sid],['tid',tid],['ttype',99],['tcontent','3400'],
                                                            ['tnote1',str_area_on_off],['tnote2',str_area_on_off],['tnote3','']
                                                            ,['tnote4',''],['tnote5','']
                                                        ]),where_list:new Map([['tid',tid],['sid',sid],['ttype',99],['tcontent','3400']])
                                                            ,where_connect:'and'})
                                                            .then(function (result002) {
                                                                console.log('----------------update in to t_taskcontent-----002---------'+result002);
                                                                db_tool.update({table_name:'t_taskcontent',param_list:new Map([
                                                                    ['sid',sid],['tid',tid],['ttype',99],['tcontent','3200'],
                                                                    ['tnote1',str_group_on],['tnote2',str_group_off],['tnote3',str_group_program],
                                                                    ['tnote4',''],['tnote5','']
                                                                ]),where_list:new Map([['tid',tid],['sid',sid],['ttype',99],['tcontent','3200']])
                                                                    ,where_connect:'and'})
                                                                    .then(function (result003) {
                                                                        console.log('----------------update in to t_taskcontent-----003---------'+result003);
                                                                        db_tool.update({table_name:'t_taskcontent',param_list:new Map([
                                                                            ['sid',sid],['tid',tid],['ttype',99],['tcontent','3290'],
                                                                            ['tnote1',str_terminal_on],['tnote2',str_terminal_off],['tnote3',str_terminal_program],
                                                                            ['tnote4',''],['tnote5','']
                                                                        ]),where_list:new Map([['tid',tid],['sid',sid],['ttype',99],['tcontent','3290']])
                                                                            ,where_connect:'and'})
                                                                            .then(function (result004) {
                                                                                console.log('----------------update in to t_taskcontent-----004---------'+result004);
                                                                                tcpReq.sendCmd(cmd,function (result) {
                                                                                    console.log('-------------get tcp_server res'+result);
                                                                                    return res.json({success:true,data:row_res});
                                                                                });
                                                                                // return res.json({success:true,data:row_res});
                                                                            },function (err) {
                                                                                console.log(err);
                                                                                return res.json({success:false,err:err});
                                                                            });
                                                                    },function (err) {
                                                                        console.log(err);
                                                                        return res.json({success:false,err:err});
                                                                    });
                                                            },function (err) {
                                                                console.log(err);
                                                                return res.json({success:false,err:err});
                                                            });
                                                    },function (err) {
                                                        console.log(err);
                                                        return res.json({success:false,err:err});
                                                    });
                                            });
                                    });
                                console.log('更新成功-----------promise');
                            },function (err) {
                                console.log(err);
                                return res.json({success:false,err:err});
                            }
                        );
                }).catch((err) => {
                    console.log("失败");
                    console.log(err);
                    return res.json({success:false,err:err});
                });
            }
        },function (err) {
            return res.json({success:false,err:err});
        });
    //------------------------------------------------最难的部分，promise循环查表，解析音乐文件比特率，插表，取作息项资源
    //----------------id列表，完成音乐资源关联----太特么绕了---------------------------------------------

    //----------------------------------------------------------end  of promises to get t_musicdir_id------------------------
}
//-------------------------------------------------start delete timer task---------------------------------------------------
function delete_task(req,res) {
    let cmd='CCT08'+'plan';
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
    db_tool.del({table_name:'t_taskplan',where_list:new Map([['iid',tid]]),where_connect:'and'})
        .then(function () {
            db_tool.del({table_name:'t_taskcontent',where_list:new Map([['tid',tid]]),where_connect:'and'})
                .then(function () {
                    tcpReq.sendCmd(cmd,function (result) {
                        console.log('-------------get tcp_server res'+result);
                        return res.json({success:true,data:{tid:tid,info:'delete_task_success'}});
                    });

                },function (err) {
                    return res.json({success:false,err:err});
                });
        },function (err) {
        return res.json({success:false,err:err});
    });
}
//-------------------------------------------------end of delete timer task--------------------------------------------------
//-----------------------------------------------------------end of update timer task-----------------------------------
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
                let ttype=row.ttasktype;
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
                                ['sid',sid],['tid',tid],['ttype',ttype]]), where_connect: 'and'})
                                .then(function (row) {
                                    if(ttype==0){
                                        if(row){
                                            let play_type=parseInt(row.tnote2);//播放类型
                                            let delay=parseInt(row.tnote3);//延时
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
                                                        return res.json({success:true,
                                                            data:{content:{delay:delay,play_type:play_type,music_list:rows}}});
                                                    }
                                                }

                                            }else {
                                                for(let ro of rows){
                                                    ro.content='<点击选择>';
                                                }
                                                return res.json({success:true,
                                                    data:{content:{delay:delay,play_type:play_type,music_list:rows}}});
                                            }
                                        }
                                    }else if(ttype==1){
                                        if(row){
                                            let schema_list=[];
                                            let arr_sid=row.tcontent.split(',');
                                            arr_sid.pop();
                                            let arr_sactive=row.tnote1.split(',');
                                            arr_sactive.pop();
                                            if(arr_sid.length==arr_sactive.length){
                                                for(let i=0;i<arr_sid.length;i++){
                                                    schema_list.push({sid:arr_sid[i],sactive:arr_sactive[i]});
                                                }
                                                return res.json({success:true,
                                                    data:{content:{schema_list:schema_list}}});
                                            }

                                        }
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
                                        ['uid',uid],['atype',1]]),where_connect:'and'})
                                        .then(function (rows) {
                                            let arr_program=sort.rows_sort(rows,'aoid');
                                            let max=parseInt(arr_program[arr_program.length-1].aoid)-7000;
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
    .get('/program_list/:uid',program_list)
    //根据任务id获得任务常规参数、任务内容、分组控制、终端控制
    .get('/task/info/:tid',get_task_info)
    .get('/task/content/:tid',get_task_content)
    .get('/task/group/:tid',get_task_group)
    .get('/task/terminal/:tid',get_task_terminal)
//------------------------------------------------------post-------insert--------------------------------------
    .post('/schema/info',insert_schema)
    .post('/task/user/:uid/schema/:sid',insert_task)
    // .post('/schema/test/json',insert_test_json)
//------------------------------------------------------delete-----delete--------------------------------------
    .delete('/schema/info/:sid',delete_schema)
    .delete('/task/:tid',delete_task)
//-------------------------------------------------------put--------update-------------------------------------
    .put('/schema/info/:sid',update_schema)
    .put('/task/:tid',update_task)
    // .delete()
;
    // .post('/',aosrc'_insert)
    // .delete('/:ports',aosrc_delete);
module.exports = router;