// pages/music-player/index.js
import {audioContext,playStore} from '../../store/play-store'

const playModeNames = ['order', 'repeat', 'random']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    songsInfo:[],
    currentPage:0,
    durationTime:0,

    currentTime:0,//当前播放的事件
    currentLyricIndex:0,//当前歌词的index
    currentLyric:'',//当前歌词

    contentHeight:256,
    deviceRadio:getApp().globalData.deviceRadio,
    sliderValue:0,
    isSliderChanging:false,//设置一个滑动中判断值
    lyricInfos:[],//歌词
    lyricScrollTop:0,

    playModeIndex:0,
    playModeName:'order',// order repeat  random

    isPlaying:false,
    playingName:'pause',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //0.获取id
    const id = options.id
    this.setData({id})

    // 1.网络请求
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    
    //2.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight  = globalData.statusBarHeight
    //还需要navBar的高度
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight})

    //3.创建播放器
    // audioContext.stop()//停止上一次播放
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`


    //4.监听audio
    // this.setupAudioContextListener()
  },
  // =================================网络请求=======================================
  // getPageData(id){
  //   getSongDetail(id).then(res=>{
  //     this.setData({songsInfo:res.songs[0],durationTime:res.songs[0].dt})
  //   })
  //   getSongLyric(id).then(res=>{
      
  //     const lyric = res.lrc.lyric
  //     const lyrics =  parseLyric(lyric)
  //     console.log(lyrics)
  //     this.setData({lyricInfos:lyrics})
  //   })
  // },
  // ========================   数据监听   ======================== 
  setupPlayerStoreListener: function() {
    // 1.监听songsInfo/durationTime/lyricInfos
    playStore.onStates(["songsInfo", "durationTime", "lyricInfos"], ({
      songsInfo,
      durationTime,
      lyricInfos
    }) => {
      if (songsInfo) this.setData({ songsInfo })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })


     // 2.监听currentTime/currentLyricIndex/currentLyric
     playStore.onStates(["currentTime", "currentLyricIndex", "currentLyric"], ({
      currentTime,
      currentLyricIndex,
      currentLyric
    }) => {
      // console.log(currentTime,
      //   currentLyricIndex,
      //   currentLyric)
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      // console.log(currentLyric)
      if (currentLyric) {
        
        this.setData({ currentLyric })
      }
    })

    //3.监听播放模式相关的数据
    playStore.onStates(['playModeIndex','isPlaying'],({playModeIndex,isPlaying})=>{
      if(playModeIndex !== undefined){
        this.setData({playModeIndex,playModeName:playModeNames[playModeIndex]})
      }

      if(isPlaying !== undefined){
        this.setData({
          isPlaying,
          playingName:isPlaying?'pause':'resume'
        })
      }
      
    })
  },
  // =================================audio监听=======================================
  // setupAudioContextListener(){
  //   audioContext.onCanplay(()=>{
  //     audioContext.play()
  //   })
  //   //获取歌曲播放的当前时间
  //   audioContext.onTimeUpdate(()=>{
  //     //1.获取当时间
  //     const currentTime = audioContext.currentTime*1000

  //     //2.只有在不滑动才修改sliderValue,currentTime的值
  //     if(!this.data.isSliderChanging){
  //       //及时更新sliderValue值，让progress自动动
  //       const sliderValue = currentTime/this.data.durationTime *100
  //       this.setData({sliderValue,currentTime})
  //     }

  //     //3.根据当前时间去匹配歌词
  //     const lyricInfos = this.data.lyricInfos
  //     for(let i = 0;i<lyricInfos.length;i++){
  //       let lyricInfo = lyricInfos[i]
  //       if(currentTime<lyricInfo.time){
  //         const currentIndex = i -1
  //         //此次判断是防止重复打印
  //         if(this.data.currentLyricIndex !== currentIndex){
  //           const currentLyricInfo = lyricInfos[currentIndex]
  //           console.log(currentLyricInfo?.text)
  //           this.setData({
  //             currentLyric:currentLyricInfo.text,
  //             currentLyricIndex:currentIndex,
  //             lyricScrollTop:currentIndex*35
  //           });
  //         }
  //         break
  //       }
  //     }
  //   })
  // },
  // =================================事件监听=======================================
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
    // audioContext.pause()
    audioContext.seek(currentTime/1000)

    //4.记录最新的sliderValue
    this.setData({sliderValue,isSliderChanging:false})
  },
  //slider滑动event
  handleSliderChanging(event){
    const sliderValue = event.detail.value
    const currentTime = this.data.durationTime *sliderValue/100
    this.setData({isSliderChanging:true,currentTime})
  },
  //上一首按钮
  handlePreBtnClick(){
    playStore.dispatch('changeMusicAction',false)
  },//一首按钮
  handleNextBtnClick(){
    playStore.dispatch('changeMusicAction')
  },
  // =================================operation监听=======================================

  //切换播放模式
  handleModeBtnClick(){
    let playModeIndex = this.data.playModeIndex+1
    if(playModeIndex === 3 ) playModeIndex = 0

    //存到playStore
    playStore.setState("playModeIndex",playModeIndex)
  },

  //播放暂停
  handlePlayBtnClick(){
    playStore.dispatch('changeMusicStatusAction',!this.data.isPlaying)
  }
  
})