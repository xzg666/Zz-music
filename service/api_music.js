import ZzRequest from './index'

/**
 * 轮播图
 * /banner?type=2
 * 0: pc 1: android 2: iphone 3: ipad
 * **/
export function getBanners(){
  return ZzRequest.get('/banner',{
    type:2
  })
}

/***
 * 歌曲排行 0 飙升 1 热门 2 新歌 3 原创
 * /top/list?idx=0
 * ***/
export function getRankings(idx){
  return ZzRequest.get('/top/list',{
    idx
  })
}

export function getSongMenu(cat="全部",limit=6,offset=0){
  return ZzRequest.get('/top/playlist',{
    cat,limit,offset
  })
}

/**
 * 歌单详情
 * /playlist/detail/dynamic?id=6954660951
 * ***/
export function getSongMenuDetail(id){
  return ZzRequest.get('/playlist/detail/dynamic',{
    id
  })
}