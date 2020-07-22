/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */

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
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待发货",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ],
    orders: []
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 没有开发者权限，没法获取用户token,无法验证 ；等到可以验证就需要打开
    // 1 判断 用户token 
    // const {token} = wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   })
    //   return
    // }
    // 2 获取当前的小程序的页面栈-数组 长度最大是10页面 
    let pages = getCurrentPages();

    // 当前页
    let currentPage = pages[pages.length - 1]

    // 3 获取options 下页面传的 type值
    const {
      type
    } = currentPage.options
    // 4 激活选中页面标题 当 type=1 index=0 
    this.changeTitleByIndex(type - 1);

    this.getOrders(type)

  },
  async getOrders(type) {
    const res = await request({
      url: '/my/orders/all',
      data: {
        type
      }
    })
    // console.log(res);
    var orders = res.orders
    orders = orders.map(v => ({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    this.setData({
      orders
    })
  },
  // 根据标题索引来激活选中 标题数组
  // 点击 个人中心 的标题  ： 全部 ， 待发货 ... 跳转到订单详情对应的tab上
  changeTitleByIndex(index) {
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => {
      return i === index ? v.isActive = true : v.isActive = false;
    });
    this.setData({
      tabs
    })
  },
  // tab 点击事件
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail
    this.changeTitleByIndex(index)
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index + 1);
  },
})