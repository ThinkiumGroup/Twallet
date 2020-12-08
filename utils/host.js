

export const baseUrlListByEnv = {
  pro: 'https://browser.thinkium.io',
  dev: 'http://browser.chainopen.cn',
};

// 用于本地调试
const baseUrlListByHost = {
  'localhost:8080': 'http://cert-test.chainopen.cn',
  'localhost:8081': 'http://cert-test.chainopen.cn',
  'localhost:8082': 'http://cert-test.chainopen.cn',
  'localhost:8083': 'http://cert-test.chainopen.cn',
  'localhost:8084': 'http://cert-test.chainopen.cn',
  '192.168.0.110:9001': '/browser',    //配置了代理，位置 mainfest.json
  'localhost:9001': '/browser',    //配置了代理，位置 mainfest.json
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
  baseUrl = (baseUrlFromStorage  || baseUrlListByEnv[env] || baseUrlListByHost[location.host] || location.protocol + '//' + location.host) + '/browser-api';
  // #endif

  return baseUrl;
}

export function setEnv(env){
  uni.setStorageSync('env', env);
}

export function getEnv(){
  let env;
  let baseUrl = getBaseUrl();
  console.log('baseUrl', baseUrl);
  Object.keys(baseUrlListByEnv).map((key) => {
    console.log('key', key);
    if( baseUrl.indexOf(baseUrlListByEnv[key]) > -1){
      env = key;
    }
  });
  return env || 'other'
}


export const rpcUrlByEnv = {
  pro: 'http://rpcproxy.thinkium.org',
  dev: 'http://rpctest.thinkium.org',
};

// 用于本地调试
const rpcUrlListByHost = {
  'localhost:8080': rpcUrlByEnv.dev,
  'localhost:8081': rpcUrlByEnv.dev,
  'localhost:8082': rpcUrlByEnv.dev,
  'localhost:8083': rpcUrlByEnv.dev,
  '192.168.0.110:9001': '/api',    //配置了代理，位置 mainfest.json
  'localhost:9001': '/api',    //配置了代理，位置 mainfest.json
};


export function getRpcUrl() {
  let rpcUrl;
  const rpcUrlFromStorage = uni.getStorageSync('rpcUrl');
  const env = uni.getStorageSync('env') || '';
  // const env = uni.getStorageSync('env'); // dev, pro;

  // #ifndef H5
  rpcUrl = rpcUrlFromStorage  || rpcUrlByEnv[env] || rpcUrlByEnv.dev;

  // #endif

  // #ifdef H5
  rpcUrl = rpcUrlFromStorage  || rpcUrlByEnv[env] || rpcUrlListByHost[location.host] || rpcUrlByEnv.dev;
  // #endif

  console.log('rpcUrl', rpcUrl);

  return rpcUrl;
}


