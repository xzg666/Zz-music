// pages/detail-search/index.js
import {hotSearch,getSearchSuggest,getSearchResult} from '../../service/api_search'
import debounce from '../../utils/debounce'

const getSearchSuggestDebounce  = debounce(getSearchSuggest,300)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots:[],
    allMatch:[],
    allMatchNode:[],//node节点来渲染rich-text
    searchValue:'',
    resSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    hotSearch().then(res=>{
      this.setData({hots:res.result.hots})
    })
  },
  onUnload() {

  },
  handleSearchChange(event){
    
    const searchValue = event.detail
    this.setData({searchValue})
    if(!searchValue){
      this.setData({allMatch:[],searchValue:'',resSongs:[]})
      getSearchSuggestDebounce.cancel()
      return
    }

    getSearchSuggestDebounce(searchValue).then(res=>{
      console.log(123,res.result.allMatch)
      //1.获取关键字所匹配到的歌曲信息
      this.setData({allMatch:res.result.allMatch})

      //2.转成node节点,进行渲染rich-text
      const allMatchKeyWord = this.data.allMatch.map(item=>item.keyword)
      const allMatchNode = []
      
      allMatchKeyWord.forEach(item=>{
        const nodes = []
        //startsWith 判断是不是以什么开头
        if(item.toUpperCase().startsWith(searchValue.toUpperCase())){
          //拆成2部分然后转成node
          const key1 = item.slice(0,searchValue.length)
          const node1 = {
            name:'span',
            attrs:{style:"color:#1AAD19"},
            children:[{type:"text",text:key1}]
          }
          nodes.push(node1)
          const key2 = item.slice(searchValue.length)
          const node2 = {
            name:'span',
            attrs:{style:"color:'#fff'"},
            children:[{type:"text",text:key2}]
          }
          nodes.push(node2)
        }else{
          const node = {
            name:'span',
            attrs:{style:"color:'#fff'"},
            children:[{type:"text",text:item}]
          }
          nodes.push(node)
        }
        allMatchNode.push(nodes)
      })
      this.setData({allMatchNode})
    })
  },
  //enter进入搜索
  handleSearchAction(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res=>{
      console.log(res.result.songs)
      this.setData({resSongs:res.result.songs})
    })
  },

  handleKeywordItemClik(event){

    //1.获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword

    //2.将关键字设置到searchValue中
    this.setData({searchValue:keyword})

    //3.发送请求
    this.handleSearchAction()

  },
  // //点击推荐
  // handleSuggestItemClick(event){
  //   //1.获取点击的关键字
  //   const index = event.currentTarget.dataset.index
  //   const keyword = this.data.allMatch[index].keyword
  //   console.log(keyword)

  //   //2.将关键字设置到searchValue中
  //   this.setData({searchValue:keyword})

  //   //3.发送请求
  //   this.handleSearchAction()
  // },

  // //点击热门搜索
  // handleHotClick(event){

  //   //1.获取点击的关键字
  //   const keyword = event.currentTarget.dataset.keyword

  //   //2.将关键字设置到searchValue中
  //   this.setData({searchValue:keyword})

  //   //3.发送请求
  //   this.handleSearchAction()

  // }
  
})