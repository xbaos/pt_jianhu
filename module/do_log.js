
/**
 * Created by Administrator on 2017/7/12.
 */
var fs=require('fs');
var date_tool=require('./date');
const log_path='D:\\Program Files\\ibcs_t\\bin\\log';
function do_log(msg) {
    let arr_log=fs.readdirSync(log_path);
    let log_now=date_tool.getdate();
    console.log('----------当前实时的日期-----------'+log_now);
    if(!arr_log.length){
        fs.writeFileSync(log_path+'\\'+log_now+'.log',msg);
    }else if(arr_log.length==1){
        let log_file=arr_log[0];
        let stat=fs.statSync(log_path+
            '\\'+log_file);
        if(stat&&!stat.isDirectory()){
            let log_name=log_file.split('.')[0];
            console.log('--------log目录里的日期--------------'+log_name);
            if(log_now!=log_name){
                fs.renameSync(log_path+'\\'+log_name+'.log',log_path+'\\'+log_now+'.log');
                console.log('-----------have modify the file------------');
            }
            fs.writeFileSync(log_path+'\\'+log_now+'.log',msg,{flag:'a'});
        }
    }
}
module.exports={
  do_log:do_log
};
// let arr=['hi chaomeng\n','i hate you\n','for an hour\n','you you da\n'];
// for (let a of arr){
//     do_log(a);
// }