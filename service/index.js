const BASE_URL = "http://123.207.32.32:9001"

class ZZRequest {
  request(url,method,params){
    return new Promise((resolve,reject)=>{
      wx.request({
        url: BASE_URL+url,
        method,
        data:params,
        success:function(res){
          resolve(res.data)
        },
        fail:function(err){
          reject(err)
        }
      })
    })
  }

  //封装get
  get(url,params){
    return this.request(url,'GET',params)
  }

  post(url,data){
    return this.request(url,'POST',data)
  }
}

const ZzRequest = new ZZRequest()

export default ZzRequest

