// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    collectNum: 0
  },

  onShow(){
    const userinfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync('collect')
    let collectNum = collect.length
    this.setData({
      userinfo,
      collectNum
    })
  }
  
})