import ZzRequest from './index'


/******
 * 热门搜索
 * ***/
export function hotSearch(){
  return ZzRequest.get('/search/hot')
}

/******
 * 搜索建议
 * ***/
export function getSearchSuggest(keywords){
  return ZzRequest.get('/search/suggest',{
    keywords,
    type:"mobile"
  })
}

/******
 * 搜索接口
 * ***/
export function getSearchResult(keywords){
  return ZzRequest.get('/search',{
    keywords
  })
}

