
-----------------------------------------basic---pt_v15 B/S通用接口-------------------------------
//登录
POST http://192.168.9.108:3000/login/
uid=admin&upwd=1

//音乐文件上传
POST http://192.168.9.108:3000/upload_music/
file=xxx.mp3  multipart/form-data

//今日任务列表
POST http://192.168.9.108:3000/task_list/
uid=admin

//手动执行作息项
POST http://192.168.9.108:3000/do_task/
uid=admin&iid=96

//获取终端信息列表
GET http://192.168.9.108:3000/terminal_list/

//获取终端状态
GET http://192.168.9.108:3000/terminal_state/

//获取音乐目录及文件列表
GET http://192.168.9.108:3000/music_list/

//音乐点播
POST http://192.168.9.108:3000/do_music/
mpath=流行\谭咏麟 - 讲不出再见.mp3   [目录名\](一个或多个)文件名（一个）

//停止播放音乐，针对执行作息项和点播
POST http://192.168.9.108:3000/stop_music/

//终端控制开关
POST http://192.168.9.108:3000/terminal_control/
tvolume=XXX    注：tvolume为音量值，全局控音量，预留借口

-----------------------建湖pt新增----------------------------------------------


//完成文字引导新手教程后更新数据库
PUT http://192.168.9.108:3000/init/
finish_new=1

//控制台系统设置信息上传
POST http://192.168.9.108:3000/upload_config/
file=xxx.png multipart/form-data
product=xxxx广播系统
version=x.x.x

//信息烧写，烧ip和时钟
POST http://192.168.1.102:3000/info_burning/
ip=192.168.1.70
mask=255.255.255.0
gateway=192.168.1.1
week=6
time=20:10:40

//控终端，控开关，音量，节目源
POST http://192.168.1.100:3000/terminal_control/
//全控开关
upriority=1 //用户的网络优先级  
tvolume=lose
on_off=off_all/on_all
tprogram=lose

//点控开关
upriority=1  
tvolume=lose
on_off=1,2,4,7   注：此参数为逗号分隔此次控制开启的终端号
tprogram=lose

//控音量（全控）
upriority=1  
tvolume=40
on_off=lose
tprogram=lose

//控节目源
upriority=1  
tvolume=lose
on_off=lose
tprogram=2p11,4p8,7p2  注：此参数为逗号分隔此次控制开启的终端号，及对应终端此次选择的节目源

//节目源管理，restful风格

//获得节目源记录列表
GET http://192.168.9.108:3000/aosrc/0
0为ulevel，用户等级，只有admin的0等级可以管理节目源，注意和上面的网络优先级区分

//删除节目源记录，单删或批量删
DELETE http://192.168.9.108:3000/aosrc/11,12
参数为逗号分隔的串，表示端口的偏移量，这种写法有待完善

//获得用户列表
GET http://192.168.9.108:3000/user_list

//获得可用的端口列表
GET http://192.168.9.108:3000/port_list/

//插入一条或多条新音源记录
POST http://192.168.9.108:3000/aosrc/
uid=admin
ports=7001,7002,7003,7004  端口号

-------------------定时任务模块---------------------------------------

---------------------------------GET----------------------------------

//获得指定用户可见的方案列表
GET http://192.168.9.123:3000/timer/schema_list/uid/admin/ulevel/0
: uid 用户名 
：ulevel 用户等级，只有0等级可见所有方案，其他用户只可见自己方案
//获得指定方案的基本信息
GET http://192.168.9.123:3000/timer/schema/info/12
：sid 方案id   注：sid值为上面schema_list结果中的iid，即方案id

//获得指定方案的所有作息项任务
GET http://192.168.9.123:3000/timer/schema/task_list/12
：sid 方案id   注：sid值为上面schema_list结果中的iid，即方案id

//对指定任务作息项，获得常规参数，包含名称，触发时间点，优先级，周期
GET http://192.168.9.123:3000/timer/schema/task/info/96
：tid 任务id，即作息项id，tid值为上面task_list结果中的iid

//对指定任务作息项，获得任务内容，即本地默认音源加所有路网络节目源及其对应的音乐文件名或目录名
GET http://192.168.9.123:3000/timer/schema/task/content/96
：tid 任务id，即作息项id，tid值为上面task_list结果中的iid
注：在content结果中为该用户所有的可用端口生产的节目源名称对应的当前作息项的节目源内容
注： 结果中tcaption 为节目源名，content为节目源内容 <点击选择>表示无内容

//对指定任务作息项，获得分组控制信息
GET http://192.168.9.123:3000/timer/schema/task/group/96
：tid 同上  注：对所有用分组依corder进行递增排序，并根据节目源端口偏移量完成的与节目源名映射关系进行与分组名的匹配

//对指定任务作息项，获得终端控制信息
GET http://192.168.9.123:3000/timer/schema/task/terminal/95
：tid 同上  注：对所有用终端依corder进行递增排序，并根据节目源端口偏移量完成的与节目源名映射关系进行与终端名的匹配



-------------------------------POST-----------------------------------------

//根据填写的基本信息创建一条新方案
POST http://192.168.9.123:3000/timer/schema/info
uid=admin  用户id
sactive=1  方案是否启用，0不启用，1启用
scaption=斋心桥方案  方案名

------------------------------DELETE-------------------------------------------

//根据方案id删除删除一条方案
//首先判断该方案是否存在，若不存在则给出提示，若存在，判断该方案是否存在任务，若不存在，则删除空方案，若存在任务，则先级联删除方案下所有任务，再删除该方案
//此处暂只支持但方案删除，同步C/S,并考虑到方案处理的原子性
DELETE http://192.168.9.123:3000/timer/schema/info/28

------------------------------PUT----------------------------------------------

//对指定方案id的方案，根据填写的新的基本信息进行修改
PUT http://192.168.9.123:3000/timer/schema/info/29
uid=user01
sactive=1
scaption=春风十里

----------------------------------------------------------------------------------------------


TCP命令

//查询终端信息列表
CCT01

//查询终端状态
CCT02

//音乐点播
CCT03

//停止播放
CCT04

//任务信息列表
CCT05+uid

//查询音乐目录及文件列表
CCT06

//执行任务
CCT07+iid（两位）+uid

//执行终端的开关控制命令
CCT08+tvolume（全局音量）

-----------------------------------------------------------------------------------------------------


ios文件夹安装位置---->E:\work_zx\ios

ibcs_t文件夹安装位置----->D:\Program Files\ibcs_t

0---->安装node环境，版本 v6.11.0，下载地址-->https://nodejs.org/en/,步骤自行百度

1---->进D:\Program Files\ibcs_t\bin目录，双击ibcst.exe，登录启动c/s软件

2---->进E:\work_zx\ios目录，按住shift键，右击鼠标，点击在此处打开命令行窗口，进入cmd后，输入node app.js，敲回车




------------ios webservice from xbao---2017-07-11