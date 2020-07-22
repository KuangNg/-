/* 
  1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 

4  在支付页面 通过获取上一页的路径 来判断用户是立即购买 还是在购物车页面进入的
 */

import {
  requestPayment,
  showToast
} from '../../utils/asyncWx'
import {
  runtime
} from '../../lib/runtime/runtime'

import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress: [],
    // 购物车列表
    cart: [],

    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
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
    let cart = []
    let pages = getCurrentPages();

    // 支付页面的上一页
    let preCurrentPage = pages[pages.length - 2].route
    // console.log(preCurrentPage);

    // 1 获取缓存中的收货地址信息
    let Address = wx.getStorageSync("Address");

    // 判断用户的跳转方式  一 、立即购买 二、购物车页面
    if (preCurrentPage === "pages/goods_detail/index") {
      // 到这一步的话，说明是点击了立即购买
      //  1 获取缓存中的立即购买商品数据
     cart = wx.getStorageSync("nowPay");
     
    } else {
      // 到这一步的话，说明是从购物车中点击结算
      //  1 获取缓存中的购物车商品数据
      cart = wx.getStorageSync("cart");
      // 过滤出checked = true 的商品
      cart = cart.filter(v=> v.checked)
    }
    
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num
        totalNum += v.num
      }
    });

    this.setData({
      userAddress: Address,
      cart,
      totalPrice,
      totalNum
    })
  },
  // 点击支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token 
      const token = wx.getStorageSync('token')
      const {
        userAddress
      } = this.data
      // 判断有没收货地址
      if (!userAddress.userName) {
        await showToast({
          title: "您还没添加收货地址"
        })
        return
      }
      // 2. 判断
      if (!token) {
        // 没有token, 跳转授权页面
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return

      }
      // 3 创建订单
      // 3.1 准备 请求头参数
      // const header = { Authorization: token}
      // 3.2 准备 获取请求参数
      const consignee_addr = this.data.userAddress.All;
      const order_price = this.data.totalPrice
      const {
        cart
      } = this.data
      let goods = []
      cart.forEach(v => {
        return goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      // 将所有参数放在一起
      const orderParams = {
        consignee_addr,
        order_price,
        goods
      }

      //  4 准备发送请求 创建订单 获取订单编号
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        data: orderParams,
        method: "POST"
      })

      // 5 发起 预支付接口    

      const { pay } = await request({
        url: '/my/orders/req_unifiedorder',
        data: {
          order_number
        },
        method: "POST"
      })
      console.log(pay);
      /*  
      发起 预支付接口后，拿到的pay
      "pay": {
      "timeStamp": "1564730510",
      "nonceStr": "SReWbt3nEmpJo3tr",
      "package": "prepay_id=wx02152148991420a3b39a90811023326800",
      "signType": "MD5",
      "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
    }, */
    
      // 6 发起微信支付 
      await requestPayment(pay);

      // 7 查询后台 订单的支付状态
      var res = await request({
        url: '/my/orders/chkOrder',
        data: {
          order_number
        },
        method: "POST"
      })
      // console.log(res);
      await showToast({
        title: "支付成功"
      });
      // 8 支付成功后 需要在购物车去掉该商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync("cart", newCart);
      // 8.1 支付成功了 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });

    } catch (error) {
      await showToast({
        title: "支付失败"
      })
      console.log(error);
    }
  }

})