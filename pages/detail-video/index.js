// pages/detail-video/index.js
import {getMvUrl,getRelatedVideo,getMVDetail} from '../../service/api_video'

Page({
  data: {
    mvUrl:{},
    mvDetail:{},
    relativeVideo:{},
    danmuList:
    [{
      text: '哇！太帅了吧',
      color: '#ff0000',
      time: 1
    }, {
      text: '老公！！！',
      color: '#ff00ff',
      time: 3
    }]//数据应该请求拿到此格式
  },
  onLoad(options) {

    //1.获取传入的id
    const id = options.id

    //2.请求数据
    this.getPageData(id)

    //3.其他
    
  },
  getPageData(id){
    //1.请求播放地址
    getMvUrl(id).then(res=>{
      this.setData({mvUrl:res.data})
    })
  //2.请求视频信息
    getMVDetail(id).then(res=>{
      this.setData({mvDetail:res.data})
    })
  //3.请求相关视频
    getRelatedVideo(id).then(res=>{
      this.setData({relativeVideo:res.data})
    })
  }

  
})