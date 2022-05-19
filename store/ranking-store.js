import {HYEventStore} from 'hy-event-store'

import {getRankings} from '../service/api_music'
const rankingMap = { 0: "newRanking", 1: "hotRanking", 2: "originRanking", 3: "upRanking" }

const rankingStore = new HYEventStore({
  state:{
    newRanking: {}, // 0: 新歌
    hotRanking: {}, // 1: 热门
    originRanking: {}, // 2: 原创
    upRanking: {} // 3: 飙升
  },
  actions:{
    getRankingDataAction(ctx){
      // getRankings(1).then(res=>{
      //   console.log(res)
      //   ctx.hotRanking = res.playlist
      // })
      // 0: 新歌榜 1: 热门榜 2: 原创榜 3: 飙升榜
      for(let i = 0;i<4;i++){
        getRankings(i).then(res=>{
          const rankName = rankingMap[i]
          ctx[rankName] = res.playlist
        })
      }
    }
  }
})

export {rankingStore,rankingMap}