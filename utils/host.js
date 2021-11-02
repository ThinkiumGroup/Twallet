import { ChainIdEnum } from './data/enums'

export const baseUrlListByEnv = {
  pro: 'https://browser.thinkium.io',
  dev: 'http://browser.chainopen.cn',
};



export const rpcUrlDev = {
  [ChainIdEnum.MAIN_CHAIN]: '',
  [ChainIdEnum.ACCOUNT_CHAIN]: 'http://43.247.184.48:32021',
  [ChainIdEnum.POS_CHAIN]: 'http://43.247.184.49:32016',
  [ChainIdEnum.BUSINESS_CHAIN]: 'http://43.247.184.49:32021',
  'thk': 'http://test.thinkiumrpc.net',
};


export const rpcUrlPro = {
  [ChainIdEnum.MAIN_CHAIN]: '',
  [ChainIdEnum.ACCOUNT_CHAIN]: '',
  [ChainIdEnum.BUSINESS_CHAIN]: '',
  [ChainIdEnum.BUSINESS_CHAIN]: '',
  'thk': '',
};

// For local debugging
const baseUrlListByHost = {
  'localhost:8080': 'http://cert-test.chainopen.cn',
  'localhost:8081': 'http://cert-test.chainopen.cn',
  'localhost:8082': 'http://cert-test.chainopen.cn',
  'localhost:8083': 'http://cert-test.chainopen.cn',
  'localhost:8084': 'http://cert-test.chainopen.cn',
  '192.168.0.110:9001': '/browser',    //Proxy is configured, location mainfest.json
  'localhost:9001': '/browser',    //Proxy is configured, location mainfest.json
  'localhost:9002': '/browser',
};


export function getBaseUrl() {
  const baseUrlFromStorage = uni.getStorageSync('baseUrl');
  const env = uni.getStorageSync('env') || '';

  let baseUrl;

  // #ifndef H5
  baseUrl = (baseUrlFromStorage || baseUrlListByEnv[env] || baseUrlListByEnv.dev) + '/browser-api';
  // #endif

  // #ifdef H5
  baseUrl = (baseUrlFromStorage || baseUrlListByEnv[env] || baseUrlListByHost[location.host] || location.protocol + '//' + location.host) + '/browser-api';
  // #endif

  return baseUrl;
}

export function setEnv(env) {
  uni.setStorageSync('env', env);
}

export function getEnv() {
  let env;
  let baseUrl = getBaseUrl();
  Object.keys(baseUrlListByEnv).map((key) => {
    if (baseUrl.indexOf(baseUrlListByEnv[key]) > -1) {
      env = key;
    }
  });
  return env || 'dev'
}



export function getRpcUrl(key = '1') {
  const env = getEnv();
  console.log('---env', env)
  let rpcUrls = rpcUrlPro;
  if(env === 'dev') rpcUrls = rpcUrlDev;
  return rpcUrls && rpcUrls[key];
}


