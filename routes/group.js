var db = require("../db/sqlite").db;
function getAllGroup(req,res){
    let sql = "select * from t_channels where uid = '"+req.query.uid + "' and cmodel = 3200 ";
    db.all( sql,function(err,result){
        if(err){
            res.json({success:false,err:err});
            console.log(sql+"==>"+err);
            res.end();
        }else{
            res.json({
                success:true,
                data:result
            });
        }
    } )
}

function getTerminalByGroup(req,res){
    let sql = "select * from t_correlation where uid = '"+req.query.uid + "' and cgroup = " + req.query.cgroup;
    db.all( sql,function(err,result){
        if(err){
            res.json({success:false,err:err});
            console.log(sql+"==>"+err);
            res.end();
        }else{
            res.json({
                success:true,
                data:result
            });
        }
    } )
}

function addGroup(req,res){
    console.log(req.body);
    let sql = 'begin transaction;\r\n';
    sql += "insert into t_channels (uid,cmodel,corder,ccaption,cdevno,cport,cactive,cvolume) values ('" + req.body.uid+"',3200,"+req.body.corder+",'"+req.body.ccaption+"',1,0,1,50);\r\n";
    req.body.checkedList.map(item=>{
        sql += "insert into t_correlation (uid,cmodel,cgroup,cpoint) values ('"+ req.body.uid+"',3200,"+req.body.corder+","+item.devnum+");\r\n";
    })
    sql += 'commit;'
    console.log(sql);
    db.exec(sql,function(err,result){
        if(err){
            res.json({success:false,err:err});
            console.log(sql+"==>"+err);
            res.end();
        }else{
            res.json({
                success:true
            });
        }
    })
}

function deleteGroup(req,res){
    console.log(req.query.gid);
    let sql = 'begin transaction;\r\n';
    sql += "delete from t_channels where uid='"+req.query.uid +"' and cmodel =3200 and corder ="+req.query.gid+';\r\n';
    sql += "delete from t_correlation where uid='"+req.query.uid +"' and cmodel =3200 and cgroup ="+req.query.gid+';\r\n';
    sql += 'commit;'
    db.exec(sql,function(err,result){
                if(err){
                    res.json({success:false,err:err});
                    console.log(sql+"==>"+err);
                    res.end();
                }else{
                    res.json({
                        success:true
                    });
                }
            })
}

function editGroup(req,res){
    console.log(req.body);
    let sql = 'begin transaction;\r\n';
    if(req.body.ccaption){
        sql+= "update t_channels set ccaption = '" + req.body.ccaption + "' where cmodel = 3200 and uid = '"+req.body.uid+"' and corder = "+req.body.corder + ";\r\n";
    }
    sql += "delete from t_correlation where uid='"+req.body.uid +"' and cmodel =3200 and cgroup ="+req.body.corder+';\r\n'; 
    req.body.checkedList.map(item=>{
                sql += "insert into t_correlation (uid,cmodel,cgroup,cpoint) values ('"+ req.body.uid+"',3200,"+req.body.corder+","+(item.devnum||item.cpoint)+");\r\n";
            })
    sql += 'commit;'
    console.log(sql);
     db.exec(sql,function(err,result){
                if(err){
                    res.json({success:false,err:err});
                    console.log(sql+"==>"+err);
                    res.end();
                }else{
                    res.json({
                        success:true
                    });
                }
            })
}

module.exports ={
    getAllGroup:getAllGroup,
    getTerminalByGroup:getTerminalByGroup,
    addGroup:addGroup,
    deleteGroup:deleteGroup,
    editGroup:editGroup
}