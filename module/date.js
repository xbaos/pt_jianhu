/**
 * Created by Administrator on 2017/7/12.
 */
//获得当前日期，形如XX-XX-XX
function getdate(date01) {
    var date;
    if(date01){
        date=date01;
    }else {
        date = new Date();
    }
    var mon = date.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
    if (mon <= 9) {                                     //如果小于9的话，则需要加上0
        mon = "0" + mon;
     }
    var day = date.getDate();                   //getdate()返回的是1-31，则不需要加1
    if (day <= 9) {                                     //如果小于9的话，则需要加上0
        day = "0" + day;
    }
    return date.getFullYear()+'-'+mon+'-'+day;
}
// 计算两个日期的间隔天数
//pt v15版本，处理指定日期触发，使用2440588+当前日期距1970年1月1日的天数间隔进行存库
function getday_interval(sDate1, sDate2){ //sDate1和sDate2是2002-12-18格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2002格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24); //把相差的毫秒数转换为天数
    return iDays
}
//根据天数间隔和起始日期计算结束日期
function interval_todate(idays,date) {
    let aDate, oDate1;
    aDate = date.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2002格式
    let num_ms_start=oDate1.getTime();
    let num_ms_end=num_ms_start+(idays*1000*60*60*24);
    let date_end=new Date(num_ms_end);
    return getdate(date_end);
}
// console.log(getdate(new Date('12-18-2002')));
// console.log(getday_interval('2017-07-06','1970-01-01'));
console.log(interval_todate('17353','1970-01-01'));
module.exports={
    getdate:getdate,
    getday_interval:getday_interval,
    interval_todate:interval_todate
};