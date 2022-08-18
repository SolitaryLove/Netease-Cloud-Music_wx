// pages/songDetail/songDetail.js
import request from '../../utils/request';
import PubSub from 'pubsub-js';
import moment from 'moment';
// 获取全局app实例
let appInstance=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay:false,// 标识音乐是否在播放
        song:{},// 音乐详情数据
        musicId:'',// 音乐id标识
        musicLink:'',// 音乐播放链接
        currentTime:'00:00',// 音乐实时播放的时间
        durationTime:'00:00',// 音乐总时长
        currentWidth:0,// 实时进度条长度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // options：用来接收路由跳转的参数，默认值是空对象
        // 注意：原生小程序url有长度限制，如果传参内容过长会自动截取掉
        let musicId=options.musicId;
        this.setData({musicId});
        // 获取当前页面音乐数据
        this.getMusicInfo(musicId);
        // 判断当前页面音乐是否在播放
        if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId===musicId){this.setData({isPlay:true})};
        // 生成背景音频的实例
        this.backgroundAudioManager=wx.getBackgroundAudioManager();
        // 监听音乐播放/暂停/停止事件(系统任务栏)
        this.backgroundAudioManager.onPlay(()=>{
            this.changeIsPlaystate(true,musicId);
        });
        this.backgroundAudioManager.onPause(()=>{
            this.changeIsPlaystate(false);
        });
        this.backgroundAudioManager.onStop(()=>{
            this.changeIsPlaystate(false);
        });
        // 监听音乐实时播放事件
        this.backgroundAudioManager.onTimeUpdate(()=>{
            // 格式化实时播放的时间
            let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss");
            // 实时进度条长度
            let currentWidth=(this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration)*450;
            this.setData({currentTime,currentWidth});
        });
        // 监听音乐自然播放结束事件
        this.backgroundAudioManager.onEnded(()=>{
            // 切换到下一首
            PubSub.publish('switchType','next');
            // 还原状态
            this.setData({
                currentTime:'00:00',
                durationTime:'00:00',
                currentWidth:'0',
            });
        });
        // 订阅recommendSong发布的musicId信息
        PubSub.subscribe('musicId',(msg,musicId)=>{
            // 获取切换后的音乐详情数据
            this.getMusicInfo(musicId);
            // 自动播放音乐
            this.musicControl(true,musicId);
        });
    },
    // 更新音乐播放状态
    changeIsPlaystate(isPlay,musicId=''){
        this.setData({isPlay});
        appInstance.globalData.isMusicPlay=isPlay;
        appInstance.globalData.musicId=musicId;
    },
    // 获取音乐详情
    async getMusicInfo(musicId){
        let result=await request('/song/detail',{ids:musicId});
        // 获取当前歌曲总时长
        let durationTime=moment(result.songs[0].dt).format('mm:ss');
        this.setData({song:result.songs[0],durationTime});
        // 动态修改窗口的标题
        wx.setNavigationBarTitle({title:this.data.song.name});
    },
    // 点击播放/暂停按钮的回调
    handleMusicPlay(){
        let isPlay=!this.data.isPlay;
        this.setData({isPlay});
        let {musicId,musicLink}=this.data;
        this.musicControl(isPlay,musicId,musicLink);
    },
    // 控制音乐播放/暂停
    async musicControl(isPlay,musicId,musicLink=''){
        if(isPlay){
            // 性能优化，避免重复发送请求获取播放链接
            if(!musicLink){
                // 获取音乐的播放链接
                let result=await request('/song/url',{id:musicId});
                let musicLink=result.data[0].url;
                // 将获取的音乐链接更新到data中
                this.setData({musicLink});
            }
            // 当设置了新的src时，会自动开始播放
            this.backgroundAudioManager.src=this.data.musicLink;
            this.backgroundAudioManager.title=this.data.song.name;
            /* // 更新全局数据中的播放状态标识
            appInstance.globalData.isMusicPlay=true;
            appInstance.globalData.musicId=musicId; */
        }else{
            // 暂停音乐播放
            this.backgroundAudioManager.pause();
            // appInstance.globalData.isMusicPlay=false;
        }
    },
    // 点击切换歌曲的回调
    handleSwitch(event){
        let type=event.currentTarget.id;
        // 停止当前音乐播放
        this.backgroundAudioManager.stop();
        // 发布切换歌曲的类型给recommendSong页面
        PubSub.publish('switchType',type);
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

    }
})