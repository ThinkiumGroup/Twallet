
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
    console.log('Request is called');
    if(baseUrl || getBaseUrl()){
      uni.request({
        url: (baseUrl || getBaseUrl()) + url,
        method: methods,
        data,
        header: header || {
          'content-type': 'application/json',
          'token': !noToken ? (uni.getStorageSync('token') || '') : '',
          // Set the requested language
          'locale': getLanguage(),
        },
        success: (res) => {
		  // #ifdef APP-PLUS
		  console.log('######interface ', url);
		  console.log('######parameter', JSON.stringify(data));
		  console.log('######Return data', JSON.stringify(res.data));
		  // #endif

          if (res.data.code == 200) {
            resolve(res.data)
          } else {
            reject(res.data);
          }
        },
        fail: (err) => {
          console.log('###request failure');
          reject(err)
        }
      })
    }

  })
}

export default request;
