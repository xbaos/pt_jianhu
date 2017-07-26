/**
 * Created by Administrator on 2017/7/13.
 */
var fs = require("fs");
var copy=require('../module/copy');
var db_tool=require('../db/sqlite');
var ip_tool=require('../module/get_ip');
function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
}
function upload_config(req,res) {
    // console.log(req);
    // let file=req.files.file;
    // let ip=ip_tool.getIPAdress();
    // let logo_url='http://'+ip+':3000/images/'+file.name;
    // let product=req.body.product;
    // let version=req.body.version;
    // let path='E:\\node_work\\pt_jianhu\\public\\images';
    // // copyFile(file.path,path);
    // copy.copy(file.path,path,file.name).then(function () {
    //     db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',product]]),where_list:new Map([['clabel','product']])})
    //         .then(function () {
    //             console.log('更新1成功-----------promise');
    //             db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',version]]),where_list:new Map([['clabel','version']])})
    //                 .then(function () {
    //                     console.log('更新2成功-----------promise');
    //                     db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',logo_url]]),where_list:new Map([['clabel','logo_url']])})
    //                         .then(function () {
    //                             console.log('更新3成功-----------promise');
    //                             res.json({upload_config:'success',product:product,version:version,logo_url:logo_url});
    //                         });
    //                 });
    //         });
    // },function () {
    //     res.json({upload_config:'fail'});
    // });
    console.log(req);
    let file=req.files.file;
    let ip=ip_tool.getIPAdress();
    let logo_url = '';
    if(file){
        logo_url='http://'+ip+':3000/images/'+file.name;
    }else{
        logo_url=req.body.logo_url;
    }
    let product=req.body.product;
    let version=req.body.version;
    let path='E:\\node_work\\pt_jianhu\\public\\images';
    // let path='D:\\dogLin\\Desktop\\work\\pt_jianhu\\public\\images';
    // copyFile(file.path,path);
    if(file){
        copy.copy(file.path,path,file.name).then(function () {
            db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',product]]),where_list:new Map([['clabel','product']])})
                .then(function () {
                    console.log('更新1成功-----------promise');
                    db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',version]]),where_list:new Map([['clabel','version']])})
                        .then(function () {
                            console.log('更新2成功-----------promise');
                            db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',logo_url]]),where_list:new Map([['clabel','logo_url']])})
                                .then(function () {
                                    console.log('更新3成功-----------promise');
                                    res.json({upload_config:'success',product:product,version:version,logo_url:logo_url});
                                });
                        });
                });
        },function (err) {
            console.log(err);
            res.json({upload_config:'fail'});
        });
    }else{
        db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',product]]),where_list:new Map([['clabel','product']])})
            .then(function () {
                console.log('更新1成功-----------promise');
                db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',version]]),where_list:new Map([['clabel','version']])})
                    .then(function () {
                        console.log('更新2成功-----------promise');
                        db_tool.update({table_name:'s_config',param_list:new Map([['ccontent',logo_url]]),where_list:new Map([['clabel','logo_url']])})
                            .then(function () {
                                console.log('更新3成功-----------promise');
                                res.json({upload_config:'success',product:product,version:version,logo_url:logo_url});
                            });
                    });
            });
    }
}
module.exports={
    upload_config:upload_config
};