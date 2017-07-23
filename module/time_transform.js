/**
 * Created by Administrator on 2017/7/20.
 */
//时间点与秒数进行转换的方法
function timeTo_num(time) {
    return 3600*time.split(':')[0]+ 60*time.split(':')[1] +1*time.split(':')[2];
}
function numTo_time(num) {
    let hour=parseInt(num/3600);
    if(hour<10){
        hour='0'+hour;
    }
    let minute=parseInt(num%3600/60);
    if(minute<10){
        minute='0'+minute;
    }
    let second=parseInt(num%60);
    if(second<10){
        second='0'+second;
    }
    return hour+':'+minute+':'+second;
}
// console.log(timeTo_num('15:00:01'));
// console.log(numTo_time(54001));
module.exports={
    numTo_time:numTo_time,
    timeTo_num:timeTo_num
};