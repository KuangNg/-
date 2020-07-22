//Page Object

import {
  request
} from "../../request/index.js";

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航栏数据
    cateList: [],
    // 楼层区数据,
    floorList: [],

  },
  //options(Object)
  onLoad: function (options) {

    // 轮播图
    this.getSwiperList();

    // 导航栏
    this.getCateList();

    // 楼层区
    this.getFloorList()
  },

  // 1. 发送异步请求获取轮播图数据
  getSwiperList() {
    request({
        url: '/home/swiperdata'
      })
      .then((result) => {

        // 由于接口返回的 navigator_ur的跳转路径与我们自己的路径名不一样，所有我们需要修改
        result.forEach(v => {
          return v.newNavigator_url = v.navigator_url.replace(/main/g,'index')
        });

        this.setData({
          swiperList: result
        })

      })

  },
  // 导航栏数据请求
  getCateList() {
    request({
        url: '/home/catitems'
      })
      .then((result) => {
        // console.log(result);
        this.setData({
          cateList: result
        })
        // console.log(this.cateList);
      })
  },
  //楼层区数据请求
  getFloorList() {
    request({
        url: '/home/floordata'
      })
      .then((result) => {
        // console.log(result);
        result.forEach(v=>{
          v.product_list.forEach(item =>{
            item.newNavigator_url = item.navigator_url.replace(/goods_list/g,'goods_list/index')
          })
        })
        this.setData({
          floorList: result
        })
        // console.log(result.data.message);
      })
  }

});