export default function(selector){
  return new Promise((resolve)=>{
     //获取图片rect
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec((res)=>{
      resolve(res)
    })
  })
}