import languagePackage from './package/index'
import Cookies from 'js-cookie'

// 获取系统语言
export const getLanguage = () => {
  var langFromStorage = uni.getStorageSync('lang');
  if(langFromStorage) return langFromStorage;
  var lang = 'zh'
  try {
    const res = uni.getSystemInfoSync();
    lang = res.language

  } catch (e) {
    console.log('error='+e)
  }

  for (const locale of Object.keys(languagePackage)) {
    if (lang.toLowerCase().indexOf(locale) > -1) {
      return locale
    }
  }
  return lang
};


// 设置系统语言
export const setLanguage = (lang) => {
  uni.setStorageSync('lang',lang);
};

let lan = (key) => {
  if (getLanguage() === 'zh') {
    return key
  } else {
    return lan[key] || ''
  }
}


Object.assign(lan, languagePackage[getLanguage()]);
lan.getLanguage = getLanguage;
lan.setLanguage = setLanguage;
export default lan

