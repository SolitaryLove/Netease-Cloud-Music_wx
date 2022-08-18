// pages/personal/personal.js
import request from '../../utils/request';
let startY=0;// 起始坐标
let moveY=0;// 移动实时的坐标
let moveDistance=0;// 移动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:'translateY(0)',// cover变换参数
        coverTransition:'',// cover过渡参数
        userInfo:{},// 用户信息
        recentPlayList:[],// 用户最近播放记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 读取本地存储的用户信息
        let userInfo=wx.getStorageSync('userInfo');
        if(userInfo){// 用户已登录
            this.setData({userInfo});
            // 获取最近播放记录
            this.getRecentPlayData(this.data.userInfo.userId);
        }
    },
    // 获取最近播放记录
    async getRecentPlayData(userId){
        let result=await request('/user/record',{uid:userId,type:1});
        // 截取并加工数组（为wx:key准备参数）
        let index=0;
        let recentPlayList=result.weekData.slice(0,10).map(item=>{
            item.id=index++;
            return item;
        });
        this.setData({recentPlayList});
    },
    // 手指点击事件
    handleTouchStart(event){
        // 重置cover移动过渡效果
        this.setData({coverTransition:''});
        // 获取起始坐标
        startY=event.touches[0].clientY;
    },
    handleTouchMove(event){
        // 获取移动实时的坐标
        moveY=event.touches[0].clientY;
        // 移动的距离
        moveDistance=moveY-startY;
        // 控制cover移动
        if(moveDistance<0) return;
        if(moveDistance>=80){moveDistance=80;}
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        });
    },
    handleTouchEnd(){
        //cover位置复原
        this.setData({
            coverTransform:`translateY(0)`,
            coverTransition:'transform 1s ease-out'
        });
    },
    // 跳转至login页面
    toLogin(){
        // 判断用户是否已登录
        if(this.data.userInfo.nickname) return;
        wx.navigateTo({
            url:'/pages/login/login',
        });
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