// pages/login/index.js
Page({

  handleGetUserInfo(e){
    // console.log(e);
    //1 从事件对象中获取 用户信息
    const {userInfo} = e.detail

    // 2 将用户信息存到本地缓存中
    wx.setStorageSync("userinfo", userInfo);

    // 3 回到上一页
    wx.navigateBack({
      delta: 1
    });
  }
})