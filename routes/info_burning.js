/**
 * Created by Administrator on 2017/7/14.
 */
//对终端进行信息烧写，包括ip，掩码，网关和时钟
var udp_tool=require('../module/udp_client');
function info_burning(req,res) {
    let ip='',mask='',gateway='',week='',time='';
    let arr_data=[];
    //ionic
    if(req.query){
        ip = req.query.ip;
        mask = req.query.mask;
        gateway = req.query.gateway;
        week = req.query.week;
        time = req.query.time;
    }
    //android  x-www-form-urlencoded key-value;
    if(req.body!=null && !ip){
        ip = req.body.ip;
        mask = req.body.mask;
        gateway = req.body.gateway;
        week = req.body.week;
        time = req.body.time;
    }
    // let iid=req.body.iid;
    console.log('-------------ip'+ip+'---mask--'+mask+'---gateway--'+gateway);
    console.log('-------------week'+week+'---time--'+time);
    // res.json({info_burning:'success',ip:ip,mask:mask,gateway:gateway,week:week,time:time})
    if(week){
        let num_time = 3600*time.split(':')[0]+ 60*time.split(':')[1] +1*time.split(':')[2];
        let date = [0x29,0x09,0x00,0x08,0x00,0x00,0x1b,0x58,0x00,0x00,0x00,0x00];
        date[8] = parseInt(week);
        date[9] = parseInt(num_time/65536),date[10] = parseInt(num_time%65536/256),date[11] = parseInt(num_time%256);
        arr_data.push(new Buffer(date));
    }
    if(ip){
        let address = [0x29,0x07,0x00,0x18,0x00,0x01,0x1b,0x58,0xc0,0xa8,0x01,0x0b,0xff,0xff,0xff,0x00,0xc0,0xa8,0x01,0x01,0x00,0x00,0x00,0x00,0xe0,0x01,0x01,0x01];
        let arr_ip = ip.split('.'),arr_mask= mask.split('.'),arr_gateway = gateway.split('.');
        for (let i=0;i<4;i++){
            address[8+i] = arr_ip[i],address[12+i] = arr_mask[i],address[16+i] = arr_gateway[i];
        }
        arr_data.push(new Buffer(address));
    }
    udp_tool.sendUdp(arr_data).then(function (socket) {
        console.log('--------promise------success');
        return res.json({info_burning:'success',ip:ip,mask:mask,gateway:gateway,week:week,time:time});
        socket.close();
    },function () {
        console.log('--------promise------fail');
        return res.json({info_burning:'fail'});
    });
}
module.exports={
  info_burning:info_burning
};