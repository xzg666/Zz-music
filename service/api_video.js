import ZzRequest from './index'


export function getTopMv(offset,limit = 10){
  return ZzRequest.get('/top/mv',{
    offset,
    limit
  })
}

/**
 * mv播放地址
 * /mv/url?id=5436712
 * **/
export function getMvUrl(id){
  return ZzRequest.get(`/mv/url?id=${id}`)
}


/**
 * mv数据
 * /mv/detail?mvid=5436712
 * **/
export function getMVDetail(mvid){
  return ZzRequest.get(`/mv/detail`,{
    mvid
  })
}

/**
 * 相关视频
 * /related/allvideo?id=89ADDE33C0AAE8EC14B99F6750DB954D
 * **/
export function getRelatedVideo(id){
  return ZzRequest.get(`/related/allvideo`,{
    id
  })
}