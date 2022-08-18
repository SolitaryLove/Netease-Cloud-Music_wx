// index.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],// 轮播图数据
    recommendList:[],// 推荐歌曲数据
    topList:[],// 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
  },
    // 初始化
    async getInitData(){
        // 获取轮播图数据
        let result=await request('/banner',{type:2});
        this.setData({banners:result.banners});
        // 获取推荐歌曲数据
        result=await request('/personalized');
        this.setData({recommendList:result.result});
        // 推荐排行榜数据
        // idx:0-20 需求：0-4
        let index=0;
        /* id=19723756，云音乐飙升榜
            id=3779629，云音乐新歌榜
            id=3778678，云音乐热歌榜
            id=2250011882，抖音排行榜 */
        let rankId=[19723756,3779629,3778678,2250011882]
        let resultArr=[];
        while(index<4){
            result=await request('/playlist/detail',{id:rankId[index++]});
            resultArr.push({name:result.playlist.name,tracks:result.playlist.tracks.splice(0,3)});
            /* 实时更新（两种方式作取舍）
            优点：用户等待时间较短，缺点：多次更新页面 */
            this.setData({topList:resultArr});
        }
        /* 统一更新topList状态数据
        优点：减少更新的次数，缺点：网络较差时用户等待时间过长，可能会看到白屏
        this.setData({topList:resultArr}); */
    },
    // 跳转到每日推荐页面
    toRecommend(){
        wx.navigateTo({url:'/pages/recommendSong/recommendSong'});
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
