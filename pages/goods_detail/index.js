/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
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
    // 商品详情
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  /* 为了方便取数据 定义一个全局的对象 商品对象 */
  goodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   const { goods_id } = options;
  //   this.getGoodsDetail(goods_id);
  // },

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      goods_id
    } = options;

    // 1 获取缓存中的立即购买商品数据
    let nowPay = wx.getStorageSync("nowPay") || [];

    // 当用户点击立即购买，跳转到支付后，突然不想要，返回到商品详情页面，我们需要清空nowPay
    nowPay =[]
    wx.setStorageSync("nowPay", nowPay);
    this.getGoodsDetail(goods_id);
  },
  // 发送请求
  async getGoodsDetail(goods_id) {
    var goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    this.goodsInfo = goodsObj
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id);

    this.setData({
      goodsObj: {
        pics: goodsObj.pics,
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg")
      },
      isCollect
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // console.log(e);
    // 1 先构造要预览的图片数组 
    var urls = this.goodsInfo.pics.map(v => v.pics_mid),
      // 2 接收传递过来的图片url
      current = e.currentTarget.dataset.imgsrc
    wx.previewImage({
      current,
      urls
    });
  },

  // 添加购物车 1 添加点击事件
  handleCartAdd() {

    // 2 从缓存区获取商品数据   没有数据就定义为[]
    let cart = wx.getStorageSync("cart") || [];
    // 3.判断商品是否有添加
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)

    if (index === -1) {
      //4  不存在 第一次添加
      this.goodsInfo.num = 1;
      // 商品在购物车中的选择状态
      this.goodsInfo.checked = false;
      cart.push(this.goodsInfo);
    } else {
      //存在
      cart[index].num++
    }

    // // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 提示用户
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });

  },
  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    //  1 从缓存中拿到 collect 数组
    let collect = wx.getStorageSync("collect") || [];

    // // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    // 3 当index！=-1表示 已经收藏过
    if (index !== -1) {
      // 该商品已收藏
      collect.splice(index, 1)
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      })
    } else {
      // 该商品没有被收藏
      collect.push(this.goodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }

    // 4 把数组存入到缓存中
    wx.setStorageSync('collect', collect)
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })
  },

  //点击 立即购买
  handlePay() {
    // 2 从缓存区获取商品数据   没有数据就定义为[]
    let nowPay = wx.getStorageSync("nowPay") || [];
    // 3.判断商品是否有添加
    let index = nowPay.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      //4  不存在 第一次添加
      this.goodsInfo.num = 1;
      // 商品在购物车中的选择状态
      this.goodsInfo.checked = true;
      nowPay.push(this.goodsInfo);
    }

    wx.setStorageSync("nowPay", nowPay);
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }

})