// pages/detail-songs/index.js
import {rankingStore} from '../../store/ranking-store'
import {getSongMenuDetail} from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    ranking:'',
    songsInfo:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({type:options.type})
    if(this.data.type === 'menu'){
      //歌单数据
      console.log(options.id)
      getSongMenuDetail(options.id).then(res=>{
        console.log(1,res)
        this.setData({songsInfo:res.playlist})
      })
    }else{
      //榜单数据
       //拿到榜单name
      const ranking = options.ranking
      this.setData({ranking})
      //获取对应的数据
      rankingStore.onState(ranking,res=>{
        this.setData({songsInfo:res})
      })
    }
  },
  onUnload() {
    
  }
})