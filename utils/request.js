/* 注意事项
    1.封装功能函数
        1）功能点明确
        2）函数内部保留固定的代码（静态代码）
        3）将动态的数据抽取出来，由使用者提供最终的数据，以形参的形式提取
        4）一个良好的功能函数应该设置形参的默认值
    2.封装功能组件
        1)功能点明确
        2）组件内部应该保留静态代码
        3）将动态的数据提取成props参数，由使用者提供最终的数据
        4）一个良好的功能组件应该设置组件props数据的必要性以及数据类型
        <el-button type="danger"></el-button>
        props:{
            type:{
                required:true,
                default:'primary',
                type:String
            }
        }
*/
import config from './config';
// 封装发送 ajax 请求的功能函数
export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        // console.log(wx.getStorageSync('cookie'))
        if(wx.getStorageSync('cookie')){
            wx.request({
                url:config.host+url,
                // url:config.mobileHost+url,
                data,
                method,
                header: {cookie:wx.getStorageSync('cookie')},
                success:(res)=>{
                    resolve(res.data);
                },
                fail:(err)=>{
                    reject(err);
                },
            });
        }else{
            wx.request({
                url:config.host+url,
                // url:config.mobileHost+url,
                data,
                method,
                header: {"cookie": "NMTID=111; __remember_me=true; MUSIC_U=111;  __csrf=111"},
                success:(res)=>{
                    // 登录请求,将用户cookie保存至本地
                    if(data.isLogin){
                        // 将用户cookie存储到本地
                        wx.setStorageSync('cookie',res.data.cookie);
                    }
                    resolve(res.data);
                },
                fail:(err)=>{
                    reject(err);
                },
            });
        }
    });
}