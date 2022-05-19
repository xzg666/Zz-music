// pages/home-vedio/index.js
import {getTopMv} from '../../service/api_video' 

Page({

  data: {
    topMv:[],
    hasMore:true//上拉刷新值判断
  },
  onLoad(options) {
    getTopMv(0).then(res=>{
      this.setData({topMv:res.data})
    })
    
  },
  onPullDownRefresh:async function(){
    const res = await getTopMv(0)
    this.setData({topMv:res.data})
  },
  /***
   * 监听到底部滚动**/
  onReachBottom: async function() {
    if(!this.data.hasMore) return
    const res = await getTopMv(this.data.topMv.length)
    this.setData({topMv:this.data.topMv.concat(res.data),hasMore:res.hasMore})
  },
  onUnload() {

  },
  handleVideoItemClick:function(event){
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/detail-video/index?id='+id,
    })

  }
})