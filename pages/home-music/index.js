import {getBanners,getSongMenu} from '../../service/api_music.js'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

import { rankingStore,rankingMap, playStore} from '../../store/index.js'


const throttleQueryRect = throttle(queryRect,500,{trailing:true})

Page({
  data: {
    banners:[],
    swiperHeight:0,
    recommendSongs:[],
    hotSongMenu:[],
    recommendSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },
    songsInfo:{},
    isPlaying:false
  },
  onLoad(options) {
    //获取数据
    this.getPageData()

    //共享数据
    rankingStore.dispatch('getRankingDataAction')

    //从store获取共享的数据
    rankingStore.onState('hotRanking',res=>{
      //歌曲推荐歌曲数据
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      console.log('recommendSongs',recommendSongs)
      this.setData({recommendSongs})
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))
    playStore.onStates(["songsInfo","isPlaying"], ({songsInfo,isPlaying})=>{
      if(songsInfo !== undefined){this.setData({songsInfo})}
      if(isPlaying !== undefined){this.setData({isPlaying})}
    })
  },
  getPageData(){
    getBanners().then(res=>{
      this.setData({banners:res.banners})
    })
    getSongMenu().then(res=>{
      this.setData({hotSongMenu:res.playlists})
    })
    getSongMenu("华语").then(res=>{
      this.setData({recommendSongMenu:res.playlists})
    })
    
  },
  //其他函数
  handleSearchClick:function(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded(){
    //获取图片的高度
    throttleQueryRect('.image').then(res=>{
      const rect = res[0]
      this.setData({swiperHeight:rect.height})
    })
  },
  //巅峰榜数据处理
  getRankingHandler(idx){
    return (res)=>{
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}
      this.setData({ 
        rankings: newRankings
      })
    }
  },
  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  handleMoreClick(){
    this.navigateToDetailSongsPage('hotRanking')
  },
  handleRankingItemClick(event){
   const idx = event.currentTarget.dataset.idx
   const name = rankingMap[idx]
   this.navigateToDetailSongsPage(name)
  },
  handleSongItemClick(event){
    const index = event.currentTarget.dataset.index
    playStore.setState('playListSongs',this.data.recommendSongs)
    playStore.setState('playListIndex',index)
  },
  //点击playBar的播放和暂停
  handlePlayBtnClick(){
    playStore.dispatch("changeMusicStatusAction",!this.data.isPlaying)
  },
  handlePlayBarClick(){
    console.log(1)
    wx.navigateTo({
      url: '/pages/music-player/index?id='+this.data.songsInfo.id,
    })
  }
})