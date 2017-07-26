/**
 * Created by Administrator on 2017/7/25.
 */
//循环遍历一个数组，其中每一个元素作为一个promise的参数，前后promise串行执行，到最后一个执行完结束
function promise_for_each(arr, cb) {
    let realResult = [];
    let result = Promise.resolve();
    arr.forEach((a, index) => {
        result = result.then(() => {
            return cb(a).then((res) => {
                realResult.push(res)
            })
        })
    });

    return result.then(() => {
        return realResult
    })
}
//------------------------------src study and demo-------------------------------------------------------------
// var db_tool=require('../db/sqlite');
// const list = [];
// for (let i = 0; i < 100; ++i) {
//     list.push(i);
// }
// let arr_mpath=['/12国歌(演奏版).mp3','/test/demo1','/broad/By2 - 勇敢.mp3','/broad','/test/demo2/纯音乐 - 火警警报声.mp3',
//     '/test/demo3/02 七彩阳光 1.mp3', '/林俊杰-女儿情 (Live).mp3', '/流行/信乐团-海阔天空.mp3', '/流行/任贤齐 - 天涯.mp3' ];
// function PromiseForEach(arr, cb) {
//     let realResult = []
//     let result = Promise.resolve()
//     arr.forEach((a, index) => {
//         result = result.then(() => {
//             return cb(a).then((res) => {
//                 realResult.push(res)
//             })
//         })
//     })
//
//     return result.then(() => {
//         return realResult
//     })
// }
//
// PromiseForEach(arr_mpath, (mpath) => {
//
//     return new Promise((resolve, reject) => {
//         // setTimeout(() => {
//         //     console.log(number);
//         //     return resolve(number);
//         // }, 100);
//         db_tool.selectFirst({table_name:'t_musicdir',where_list:new Map([['mcontent',mpath]]),where_connect:'and'})
//             .then(function (row) {
//                 console.log('------------------test es6 for promise success---------------');
//                 console.log(row);
//                 return resolve(row.iid);
//             })
//     })
// }).then((data) => {
//     console.log("成功");
//     console.log(data);
// }).catch((err) => {
//     console.log("失败");
//     console.log(err)
// });
//-----------------------------------------------------------------------------------------------------------------
module.exports={
    promise_for_each:promise_for_each
};