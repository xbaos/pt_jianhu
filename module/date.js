/**
 * Created by Administrator on 2017/7/12.
 */
function getdate() {
    var date = new Date();
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
// console.log(getdate());
module.exports={
    getdate:getdate
};