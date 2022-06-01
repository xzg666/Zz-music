// app.js
import {getLoginCode,codeToToken,chechToken,checkSession} from './service/api_login'
import {TOKEN_KEY} from './constants/token-const'

App({
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    navBarHeight:44,
    deviceRadio:0
  },
  onLaunch(){
    // 1.获取了设备信息
    const info = wx.getSystemInfoSync()
    // console.log(123,info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    console.log(info.screenHeight/info.screenWidth)
    this.globalData.deviceRadio = info.screenHeight/info.screenWidth

    // 2.让用户默认进行登录
    this.handleLogin()
    
  },
  async handleLogin(){
    const token = wx.getStorageSync(TOKEN_KEY)
    //token有没有过期
    const checkRes = await chechToken()
    console.log(777,checkRes)
    //判断session是否过期
    const isSessionExpire = await checkSession()
    if(!token || checkRes.errorCode || !isSessionExpire){
      this.loginAction()
    }
  },
  async loginAction(){
    //1.获取code
    const code = await getLoginCode()
    // //2.将code发送给服务器
    const res = await codeToToken(code)
    console.log(123,code,res)
    const token = res.token
    wx.setStorageSync(TOKEN_KEY,token)
  }

 

})
