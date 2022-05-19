// components/nav-bar/index.js
const globalData = getApp().globalData
Component({
  options:{
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:globalData.statusBarHeight,
    navBarHeight:globalData.navBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick(){
      this.triggerEvent('click')
    }
  }
})
