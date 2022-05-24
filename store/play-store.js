import {HYEventStore} from 'hy-event-store'
import {getSongDetail,getSongLyric} from '../service/api_player'
import {parseLyric} from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playStore = new HYEventStore({
  state:{
   id:0,
   songsInfo:{},
   durationTime:0,//总时长
   lyricInfos:[],//当前歌词信息

   currentTime:0,//当前播放的事件
   currentLyricIndex:0,//当前歌词的index
   currentLyric:'',//当前歌词

   playModeIndex:0, //0:循环播放  1：单曲循环  2：随机播放
   isPlaying:false,
   isStopping:false,//解决点击x，再点击播放

   playListSongs:[],
   playListIndex:0,
   isFirstPlay:true,//是否第一次播放

  },
  actions:{
    playMusicWithSongIdAction(ctx, { id,isRefresh = false }) {
      if (ctx.id == id && !isRefresh) {
        this.dispatch('changeMusicStatusAction',true)
        return
      }
      console.log(12345)

      //0.修改播放的状态
      ctx.isPlaying = true
      ctx.songsInfo={},
      ctx.durationTime=0,//总时长
      ctx.lyricInfos=[],//当前歌词信息
      ctx.currentTime=0,//当前播放的事件
      ctx.currentLyricIndex=0,//当前歌词的index
      ctx.currentLyric='',//当前歌词

      console.log(999,ctx.durationTime)

      //1.存id
      ctx.id = id
      //2.发送歌曲和歌词请求
      getSongDetail(id).then(res=>{
        // this.setData({songsInfo:res.songs[0],durationTime:res.songs[0].dt})
        ctx.songsInfo = res?.songs[0]
        ctx.durationTime = res?.songs[0].dt 
        audioContext.title = res.songs[0].name//拿到详情再用name
      })
      getSongLyric(id).then(res=>{
        const lyric = res.lrc.lyric
        const lyrics =  parseLyric(lyric)
        console.log(lyrics)
        // this.setData({lyricInfos:lyrics})
        ctx.lyricInfos = lyrics
      })

      // 2.播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id //先用id占位
      audioContext.autoplay = true

      //3.监听audioContext的一些事件(只在第一次监听)
      if(ctx.isFirstPlay){
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }

      //4.监听音乐播放、暂停、停止
      audioContext.onPlay(()=>{
        ctx.isPlaying = true
      })
      audioContext.onPause(()=>{
        ctx.isPlaying = false
      })
      audioContext.onStop(()=>{
        ctx.isPlaying = false
        ctx.isStopping = true
      })
    },

    setupAudioContextListenerAction(ctx) {

      //1.监听歌曲怎么播放
      audioContext.onCanplay(()=>{
        audioContext.play()
      })

      //2.获取歌曲播放的当前时间
      audioContext.onTimeUpdate(()=>{
        //1.获取当时间
        const currentTime = audioContext.currentTime*1000
  
        //2.修改currentTime的值
        ctx.currentTime = currentTime
  
        //3.根据当前时间去匹配歌词
        const lyricInfos = ctx.lyricInfos
        if(!lyricInfos.length) return
        for(let i = 0;i<lyricInfos.length;i++){
          let lyricInfo = lyricInfos[i]
          if(currentTime<lyricInfo.time){
            const currentIndex = i -1
            //此次判断是防止重复打印
            if(ctx.currentLyricIndex !== currentIndex){
              const currentLyricInfo = lyricInfos[currentIndex]
              // console.log(currentLyricInfo.text)
              ctx.currentLyricIndex = currentIndex
              ctx.currentLyric = currentLyricInfo.text
            }
            break
          }
        }
      })

      //3.监听歌曲播放完成
      audioContext.onEnded(()=>{
        this.dispatch('changeMusicAction')
      })
    },

    //播放暂停
    changeMusicStatusAction(ctx,isPlaying = true){
      ctx.isPlaying = isPlaying
      if(ctx.isStopping && ctx.isPlaying){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
      audioContext.title = ctx.songsInfo.name
      ctx.isStopping = false
      }
      ctx.isPlaying ? audioContext.play():audioContext.pause()
    },

    //切换歌曲逻辑
    changeMusicAction(ctx,isNext = true){
      //1.获取当前索引
      let index = ctx.playListIndex

      //2.根据不同的播放模式，获取下一首歌的索引
      switch(ctx.playModeIndex){
        case 0://顺序播放
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = ctx.playListSongs.length - 1
          if(index === ctx.playListSongs.length) index = 0
          break
        case 1://单曲播放
          break
        case 2://随机播放
          index = Math.floor(Math.random()*ctx.playListSongs.length)
          break
      }

      //3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong){
        currentSong = ctx.songsInfo

      }else{
        //记录最新的索引
        ctx.playListIndex = index
      }

      //4.播放最新的歌曲
      this.dispatch('playMusicWithSongIdAction',{id:currentSong.id,isRefresh : true})
    }
  }
   
  
})

export{
  audioContext,
  playStore
}