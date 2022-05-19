import ZzRequest from './index'

/******
 * 歌曲详情
 * ***/
export function getSongDetail(ids){
  return ZzRequest.get('/song/detail',{
    ids
  })
}


/******
 * 歌词信息
 * ***/
export function getSongLyric(id){
  return ZzRequest.get('/lyric',{
    id
  })
}