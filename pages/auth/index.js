// pages/auth/index.js
// 授权
/* 
  由于我的AppId没有被企业微信绑定开发者，所以就算写好了代码，也拿不到用户的token


*/
import {
  login
} from '../../utils/asyncWx'
import {
  runtime
} from '../../lib/runtime/runtime'
import {
  request
} from '../../request/index.js'
Page({
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      //点击按钮 从事件对象中e.detail获取参数  encryptedData iv rawData signature  
      const {encryptedData, iv, rawData,signature} = e.detail

      // 2 获取小程序登录成功后的code
      //从微信内置登录函数获取 code
      const {code } = await login()
      console.log(code);
      const loginParams = { encryptedData, iv,rawData,signature, code}
      // 3 发送请求 获取用户的token
      // 发送请求 获取用户token
      const { token } = await request({url: '/users/wxlogin', data: loginParams,   method: "post" })
      console.log(token);
      // 4 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }

  }
})