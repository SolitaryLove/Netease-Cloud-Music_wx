// pages/login/login.js
/* 
    登录说明：
    1.收集表单项数据
    2.前端验证
        1)验证用户信息是否合法（格式）
        2)验证不通过需要提示用户内容不合法，不需要发送请求进行后端验证
        3)前端验证通过，发送请求进行后端验证
    3.后端验证
        1)验证当前用户是否存在
        2)如果该用户不存在，直接返回登录失败
        3)该用户存在，需要验证密码是否正确
        4)密码不正确，返回给前端，并提示密码不正确
        5)密码正确，返回登录成功数据
*/
import request from '../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone:"",   
        password:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    // 表单项事件回调
    handleInput(event){
        // 收集表单项数据
        let type=event.currentTarget.id;
        this.setData({[type]:event.detail.value,});
    },
    // 登陆的回调
    async login(){
        let {phone,password}=this.data;
        // 前端格式校验
        if(!phone){wx.showToast({title:'手机号不能为空',icon:'error'});return}
        let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
        if(!phoneReg.test(phone)){wx.showToast({title:'无效手机号',icon:'error'});return}
        if(!password){wx.showToast({title:'密码不能为空',icon:'error'});return};
        // 后端验证（isLogin判断当前是否为登录请求，用于在request中进行保存cookie操作）
        let result=await request('/login/cellphone',{phone,password,isLogin:true});
        if(result.code===200){
            wx.showToast({title:'登录成功',icon:'success'});
            // 将用户信息存储到本地
            wx.setStorageSync('userInfo',result.profile);
            // 跳转到个人中心
            wx.reLaunch({url:'/pages/personal/personal'});
        }
        else if(result.code===400){wx.showToast({title:'手机号错误',icon:'error'})}
        else if(result.code===502){wx.showToast({title:'密码错误',icon:'error'})}
        else{wx.showToast({title:'网络繁忙',icon:'error'})};
        console.log(result);
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