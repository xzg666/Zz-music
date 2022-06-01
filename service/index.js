import {TOKEN_KEY} from '../constants/token-const'

const BASE_URL = "http://123.207.32.32:9001"
// 用我已经部署好的
const LOGIN_BASE_URL = "http://123.207.32.32:3000"

const token = wx.getStorageSync(TOKEN_KEY)

class ZZRequest {
  constructor(baseUrl,authHeader={}){
    this.baseUrl = baseUrl
    this.authHeader = authHeader
  }

  request(url,method,params,isAuth=false,header={}){
    const finalHeader = isAuth? {...this.authHeader,header} : header

    return new Promise((resolve,reject)=>{
      wx.request({
        url: this.baseUrl+url,
        method,
        header:finalHeader,
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
  get(url,params,isAuth,header){
    return this.request(url,'GET',params,isAuth,header)
  }

  post(url,data,isAuth,header){
    return this.request(url,'POST',data,isAuth,header)
  }
}

const ZzRequest = new ZZRequest(BASE_URL)

const ZzLoginRequest = new ZZRequest(LOGIN_BASE_URL,{
  token
})

export default ZzRequest

export {
  ZzLoginRequest
}

