
import store from 'store'
import { getBaseUrl } from './host'
import { getLanguage } from '../Framework/language/index'

let request = ({
                 url,
                 methods,
                 data,
                 header,
                 noToken,
                 baseUrl
               }) => {
  return new Promise((resolve, reject) => {
    console.log('调用了request');
    if(baseUrl || getBaseUrl()){
      uni.request({
        url: (baseUrl || getBaseUrl()) + url,
        method: methods,
        data,
        header: header || {
          'content-type': 'application/json',
          'token': !noToken ? (uni.getStorageSync('token') || '') : '',
          // 设置请求的语言
          'locale': getLanguage(),
        },
        success: (res) => {
		  // #ifdef APP-PLUS
		  console.log('######请求接口 ', url);
		  console.log('######请求参数 ', JSON.stringify(data));
		  console.log('######返回数据 ', JSON.stringify(res.data));
		  // #endif

          if (res.data.code == 200) {
            resolve(res.data)
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          console.log('###request失败');
          reject(err)
        }
      })
    }

  })
}

export default request;
