// pages/recommendSong/recommendSong.js
import request from '../../utils/request';
import PubSub from 'pubsub-js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        month:'',
        recommendList:[],// 每日推荐歌曲数据
        index:0,// 当前正在播放的歌曲在列表中的序号
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 动态获取当前日期
        this.setData({
            day:new Date().getDate(),
            month:new Date().getMonth()+1,
        });
        this.getRecommendList();
        // 订阅songDetail发布的type消息
        PubSub.subscribe('switchType',(msg,switchType)=>{
            let {recommendList,index}=this.data;
            if(switchType==='prev'){// 切换上一首
                // index临界值处理
                (index===0)&&(index=recommendList.length);
                index-=1;
            }else{// 切换下一首
                (index===recommendList.length-1)&&(index=-1);
                index+=1;
            }
            // 获取切换后的musicId
            let musicId=recommendList[index].id;
            // 更新index的状态
            this.setData({index});
            // 发布musicId消息给songDetail页面
            PubSub.publish('musicId',musicId);
        });
    },
    // 获取每日推荐歌曲数据
    async getRecommendList(){
        try{
            let result=await request('/recommend/songs');
            this.setData({recommendList:result.data.dailySongs});
        }catch(error){
            console.log(error.message);
        }
    },
    // 跳转至songDetail页面
    toSongDetail(event){
        let {musicid,index}=event.currentTarget.dataset;
        // 更新记录歌曲序号
        this.setData({index});
        // 路由跳转传参 query
        wx.navigateTo({
            url:'/pages/songDetail/songDetail?musicId='+musicid,
        })
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