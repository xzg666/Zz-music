// pages/home-profile/index.js
import {getUserInfo} from '../../service/api_login'
Page({
  data: {

  },
  onLoad(options) {

  },
  async handleGetUser(){
    const res = await getUserInfo()
    console.log(res)
  },
  handleGetPhoneNumber(e){
    console.log(e)
  }
  
})