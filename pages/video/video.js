// pages/video/video.js
import request from '../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList:[],// 导航标签数据
        navId:'',// 导航标签的id标识
        videoList:[],// 视频列表数据
        videoId:'',// video标识
        isTriggered:false,// 下拉刷新状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 记录实时播放的时间
        this.videoUpdatTimeMap=new Map();
        this.getVideoGroupList();
    },
    // 获取导航标签数据
    async getVideoGroupList(){
        let result=await request('/video/group/list');
        this.setData({
            videoGroupList:result.data.slice(0,14),
            navId:result.data[0].id
        });
        this.getVideoList(this.data.navId);
    },
    // 获取视频列表数据的功能函数
    async getVideoList(navId){
        let result=await request('/video/group',{id:navId});
        if(!result.datas) return;
        // 添加唯一标识
        let index=0;
        let videoList=result.datas.map(item=>{item.id=index++; return item});
        // console.log(result);
        // 获取视频播放地址，从/video/group获取vid，请求/video/url获取urls
        // let videoInfos=[];
        videoList.forEach(async(item)=>{
            let videoInfo=await request('/video/url',{id:item.data.vid});
            // videoInfos.push(videoInfo);
            // 替换urlInfo
            // item.data.urlInfo=videoInfo.urls[0].url;
            item.videoUrl=videoInfo.urls[0].url;
            // console.log('1')
            this.setData({videoList,isTriggered:false});
        });
        /* 解决：异步请求完成后更新this.data页面未响应
        console.log(videoList)
        this.setData({videoList}); */
        // 关闭消息加载效果
        wx.hideLoading();
    },
    // 点击导航切换的回调
    changeNav(event){
        let navId=event.currentTarget.id;// 会自动将Number=>String
        // 或者使用data-xxx传递参数
        /* 位移运算符
        将目标数据先转换成二进制，然后云移动指定的位数，移出的舍弃，不够的用0补齐
        位移零位会强制转换数据类型为Number */
        // 显示正在加载
        wx.showLoading({title:'正在加载'})
        // 获取切换后的视频列表数据
        this.setData({
            navId:navId>>>0,
            videoList:[],
        });
        this.getVideoList(this.data.navId);
    },
    // 点击播放/继续播放的回调
    handlePlay(event){
        /* 需求：当播放新的视频的时候关掉之前播放的视频
        思路：1.找到关闭视频的方法 wx.createVideoContext(string id,Object this);2.必须找到上一个视频的实例对象，然后暂停
        设计模式：单例模式
        1.需要创建多个对象的情况下，使用一个变量来保存
        2.当创建新的对象时就会把之前的对象覆盖 */
        let vid=event.currentTarget.id;
        /* this.videoContext → undefined||某一个视频的上下文对象
        this.vid!==vid 说明点击的不是同一个视频
        this.videoContext && this.vid!==vid && this.videoContext.stop();
        this.vid=vid; */
        /* 性能优化：image列表，选中时将image替换成video */
        // 将当前点击的vid更新至data.videoId
        this.setData({videoId:vid});
        // 创建视频的上下文对象
        this.videoContext=wx.createVideoContext(vid);
        // 判断当前视频是否有播放记录
        // 如果有，则跳转到播放记录的时间位置
        if(this.videoUpdatTimeMap.has(vid)){
            this.videoContext.seek(this.videoUpdatTimeMap.get(vid));
        }
        // 播放当前视频
        // this.videoContext.play();
        // 解决播放bug
        setTimeout(()=>{
            this.videoContext.play();
        },200);
    },
    // 视频播放进度实时变化的回调
    handleTimeUpdate(event){
        /* 思路：判断videoUpdateTime中是否已经有当前视频的播放记录，利用map数据结构的特性
        1）如果有，更新相应的播放时长
        2）如果没有，添加当前视频的播放时长记录 */
        this.videoUpdatTimeMap.set(event.currentTarget.id,event.detail.currentTime);
    },
    // 当前视频播放结束的回调
    handleEnded(event){
        // 将当前视频的播放记录从 videoUpdateTimeMap 中移除
        this.videoUpdatTimeMap.delete(event.currentTarget.id);
    },
    // 下拉刷新的回调
    handleRefresher(){
        this.getVideoList(this.data.navId);
    },
    // 上拉触底的回调
    handleTolower(){
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        console.log('触发分享');
        /* return {
            title:'网易云音乐',
            page:'/pages/video/video',
            imageUrl:'/static/images/nvsheng.jpg'
        } */
    }
})