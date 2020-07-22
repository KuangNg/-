// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中拿收藏数组数据
    let collect = wx.getStorageSync("collect") || [];
    // 修改data 中的collect 
    this.setData({
      collect
    })
  },
  // 切换Tabs
  handleTabsItemChange(e){
    let {index} = e.detail
    const {tabs} = this.data
    tabs.forEach(v => v.isActive = v.id === index? true : false );
    this.setData({
      tabs
    })
  }

})