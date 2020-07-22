// pages/search/index.js
/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
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
    // 搜索商品对象
    goods:[],
    // 检测输入框
    inpValue: '',
    // 控制取消按钮的显示或隐藏
    isFocus: false
  },
  // 定时器
  Timer: -1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleInput(e){
    // 1 获取输入框的值
    const {value} = e.detail;
    // 2 检查值的合法性
    if(!value.trim()){
      // 空字符串
      this.setData({
        goods:[],
        isFocus: false,
        
      })
      
      return
    }
    clearTimeout(this.Timer)
    this.Timer =  setTimeout(()=>{
    // 3 发送请求
    this.GetSearchContent(value)
    },1000)
    this.setData({
      isFocus: true
    })
  },

  // 获取搜索内容 请求
  async GetSearchContent(query){
      let res = await request({url: '/goods/qsearch', data: {query}})
      this.setData({
        goods: res
      })
  },
  // 点击取消按钮
  handleCancel(){
    this.setData({
      goods: [],
      inpValue: '',
      isFocus: false
    })
  }

  
})