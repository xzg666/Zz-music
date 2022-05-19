// pages/music-player/index.js

import {getSongDetail,getSongLyric} from '../../service/api_player'
import {audioContext} from '../../store/play-store'
import {parseLyric} from '../../utils/parse-lyric'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    songsInfo:[],
    currentPage:0,
    contentHeight:256,
    deviceRadio:getApp().globalData.deviceRadio,
    currentTime:0,
    durationTime:0,
    sliderValue:0,
    isSliderChanging:false,//设置一个滑动中判断值
    lyricInfos:[],//歌词
    currentLyric:'',
    currentLyricIndex:0,
    lyricScrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //0.获取id
    const id = options.id
    this.setData({id})

    // 1.网络请求
    this.getPageData(id)
    
    //2.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight  = globalData.statusBarHeight
    //还需要navBar的高度
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight})

    //3.创建播放器
    audioContext.stop()//停止上一次播放
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    //解码好再播放
    audioContext.onCanplay(()=>{
      audioContext.play()
    })
    //获取歌曲播放的当前时间
    audioContext.onTimeUpdate(()=>{
      //1.获取当时间
      const currentTime = audioContext.currentTime*1000

      //2.只有在不滑动才修改sliderValue,currentTime的值
      if(!this.data.isSliderChanging){
        //及时更新sliderValue值，让progress自动动
        const sliderValue = currentTime/this.data.durationTime *100
        this.setData({sliderValue,currentTime})
      }

      //3.根据当前时间去匹配歌词
      // const lyricInfos = this.data.lyricInfos
      // lyricInfos.map((item,index)=>{
        
      //   if(currentTime<item.time){
      //     const currentIndex = index -1
      //     const currentLyricInfo = lyricInfos[currentIndex]
      //     console.log(currentLyricInfo?.text)
      //     if(this.data.currentLyricIndex !== index){
      //       this.setData({currentLyric:currentLyricInfo.text,currentLyricIndex:index});
      //     }
          
      //   }
      // })
      const lyricInfos = this.data.lyricInfos
      for(let i = 0;i<lyricInfos.length;i++){
        let lyricInfo = lyricInfos[i]
        if(currentTime<lyricInfo.time){
          const currentIndex = i -1
          //此次判断是防止重复打印
          if(this.data.currentLyricIndex !== currentIndex){
            const currentLyricInfo = lyricInfos[currentIndex]
            console.log(currentLyricInfo?.text)
            this.setData({
              currentLyric:currentLyricInfo.text,
              currentLyricIndex:currentIndex,
              lyricScrollTop:currentIndex*35
            });
          }
          break
        }
      }
    })
  },
  // 网络请求================================================
  getPageData(id){
    getSongDetail(id).then(res=>{
      this.setData({songsInfo:res.songs[0],durationTime:res.songs[0].dt})
    })
    getSongLyric(id).then(res=>{
      
      const lyric = res.lrc.lyric
      const lyrics =  parseLyric(lyric)
      console.log(lyrics)
      this.setData({lyricInfos:lyrics})
    })
  },
  //监听content swiper 滑动
  handleSwiperChange(event){
    console.log(event)
    const currentPage = event.detail.current
    this.setData({currentPage})
  },
  //返回
  handleBackClick(){
    wx.navigateBack()
  },
  //点击到slider某一个位置
  handleSliderChange(event){
    console.log(event.detail.value)//0-100
    //1.获取到slider变化的value值
    const sliderValue = event.detail.value

    //2.计算要播放的currentTime
    const currentTime = this.data.durationTime*sliderValue/100
    console.log(currentTime)

    //3.设置context播放的音乐时间
    audioContext.pause()
    audioContext.seek(currentTime/1000)

    //4.记录最新的sliderValue
    this.setData({sliderValue,isSliderChanging:false})
  },
  //slider滑动event
  handleSliderChanging(event){
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime *sliderValue/100
    this.setData({isSliderChanging:true,currentTime,sliderValue})
  }
  
})