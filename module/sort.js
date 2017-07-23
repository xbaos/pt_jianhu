/**
 * Created by Administrator on 2017/7/20.
 */
//排序模块
//对结果集对象根据某一属性值进行递增排序
function rows_sort(rows,property) {
    if(typeof(property)=='string'){
        property=parseInt(property);
    }
    let times=0;
    for(var i=0;i<rows.length;i++){
        for(var j=0;j<rows.length-1-i;j++){
            if(parseInt(rows[j][property])>parseInt(rows[j+1][property])){//如果前面的数据比后面的大就交换
                var temp=rows[j+1];
                rows[j+1]=rows[j];
                rows[j]=temp;
            }
            // console.log("第"+(++times)+"次排序后："+rows);
        }
    }
    console.log('---------------------module_rows----------------');
    console.log(rows);
    return rows;
}
// let obj= [
//     {
//         "iid": 110,
//         "uid": "admin",
//         "atype": 0,
//         "aoid": "00",
//         "adefault": 1,
//         "acaption": "默认音源",
//         "acontent": "0",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 162,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7001",
//         "adefault": 0,
//         "acaption": "节目源1",
//         "acontent": "7001",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null,
//         "content": "[文件] 周杰伦 - 龙卷风.mp3 "
//     },
//     {
//         "iid": 166,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7002",
//         "adefault": 0,
//         "acaption": "节目源2",
//         "acontent": "7002",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 165,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7004",
//         "adefault": 0,
//         "acaption": "节目源4",
//         "acontent": "7004",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 163,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7005",
//         "adefault": 0,
//         "acaption": "节目源5",
//         "acontent": "7005",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 169,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7007",
//         "adefault": 0,
//         "acaption": "节目源7",
//         "acontent": "7007",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 164,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7008",
//         "adefault": 0,
//         "acaption": "节目源8",
//         "acontent": "7008",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 150,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7009",
//         "adefault": 0,
//         "acaption": "节目源9",
//         "acontent": "7009",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null,
//         "content": "[文件] 广播应急1.mp3 "
//     },
//     {
//         "iid": 151,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7010",
//         "adefault": 0,
//         "acaption": "节目源10",
//         "acontent": "7010",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null
//     },
//     {
//         "iid": 152,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7011",
//         "adefault": 0,
//         "acaption": "节目源11",
//         "acontent": "7011",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null,
//         "content": "[文件] 测试1.mp3 "
//     },
//     {
//         "iid": 153,
//         "uid": "admin",
//         "atype": 1,
//         "aoid": "7012",
//         "adefault": 0,
//         "acaption": "节目源12",
//         "acontent": "7012",
//         "adata": "0",
//         "anote1": null,
//         "anote2": null,
//         "anote3": null,
//         "content": "[文件] 2487.mp3 "
//     }
// ];
// let arr=rows_sort(obj,'iid');
// console.log('----------arr-----------');
// console.log(arr);
module.exports={
  rows_sort:rows_sort
};