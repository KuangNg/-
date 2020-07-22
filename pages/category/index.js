// pages/category/index.js

import {
  request
} from "../../request/index.js"
import {
  runtime
} from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧大菜单数据
    leftMemuList: [],
    // 右侧内容数据
    rightContents: [],
    // 被点击的菜单
    currentIndex: 0,
    // 重置滚动scroll-view滚动到顶部的距离
    scrollTop: 0

  },
  // 存储接口数据
  cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了 
        存取值方式
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
      2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1 先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求 
    3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
     */

    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync('Cates');
    if (!Cates) {
      // 没有本地缓存，获取请求
      this.getCategotyList()
    } else {
      // 有本地缓存
      /* 判断本地缓存有没有过期 定义一个过期时间 测试时间10s 一般为5分钟  单位毫秒*/
      if (Date.now() - Cates.time > 1000 * 300) {
        // 过期时间 需重新发送请求
        this.getCategotyList()
      } else {
        // 没有过期，则用本地缓存的数据
        this.cates = Cates.data
        // 拿到缓存数据，重新赋值
        let leftMemuList = this.cates.map(v => v.cat_name)
        let rightContents = this.cates[0].children
        this.setData({
          // 左侧大菜单数据
          leftMemuList,
          rightContents
        })
      }
    }
  },

  // 1. 发送异步请求获取数据
  async getCategotyList() {
    // request({
    //     url: '/categories'
    //   })
    //   .then((result) => {

    //     this.cates = result.data.message
    //     // 拿到数据，将数据存储在本地缓存
    //    wx.setStorageSync('Cates', {time:Date.now(),data:this.cates});
    //     // console.log(this.cates);
    //     // 构造左侧的大菜单数据
    //     let leftMemuList = this.cates.map(v => v.cat_name)
    //     // 构造右侧的商品数据
    //     let rightContents = this.cates[0].children
    //     this.setData({
    //       // 左侧大菜单数据
    //       leftMemuList,
    //       rightContents
    //     })

    //   })
    // 使用es7 的async await 发送异步请求
    const result = await request({url: '/categories'})

    this.cates = result
    // 拿到数据，将数据存储在本地缓存
    wx.setStorageSync('Cates', {
      // Date.now() 获取当前日期毫秒数
      time: Date.now(),
      data: this.cates
    });
    // console.log(this.cates);
    // 构造左侧的大菜单数据
    let leftMemuList = this.cates.map(v => v.cat_name)
    // 构造右侧的商品数据
    let rightContents = this.cates[0].children
    this.setData({
      // 左侧大菜单数据
      leftMemuList,
      rightContents
    })
  },
  handleChangeTab(e) {
    // 1.从点击事件中，获取自定义属性的index值，然后赋值给data中的currentIndex，从而改变tab切换
    // 2.tab切换，右侧的商品也要根据改变，只要改变cates的索引就可以了
    const {
      index
    } = e.currentTarget.dataset
    let rightContents = this.cates[index].children
    this.setData({
      currentIndex: index,
      rightContents,
      scrollTop: 0
    })
  }

})