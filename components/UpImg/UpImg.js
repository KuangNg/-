// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type:String,
      value:""
    },
    index:{
      type:Number,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeImg(e){
      let index = e.currentTarget.dataset.index;
      this.triggerEvent("RemoveImg",index)
    }
  }
})
