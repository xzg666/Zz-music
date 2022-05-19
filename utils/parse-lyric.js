//正则
//[00:58。65]
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString){

  const lyricStrings = lyricString.split('\n')
  const lyricInfos = []

  //item   "[00:00.000] 作词 : 桃德李Todd Li"
  lyricStrings.forEach(function(item){
    const timeRes = timeRegExp.exec(item)
    if(!timeRes)return

    //1.获取时间
    const minute = timeRes[1]*60*1000
    const second = timeRes[2]*1000
    const millsecondTime = timeRes[3]
    const millsecond = millsecondTime.length === 2 ? millsecondTime*10 :millsecondTime*1
    const time = minute + second + millsecond

    //2.获取歌词文
    const text = item.replace(timeRegExp,'')

    lyricInfos.push({time,text})
  })
  return lyricInfos
}