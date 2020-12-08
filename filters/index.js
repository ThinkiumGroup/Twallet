import Vue from "vue"
import lan from '@/Framework/language/index'
import {aboutWallet} from "../utils/businessCommon";

//转换时间
Vue.filter("formatDate", (date_time, format) => {
    let date_time_ls = parseInt(date_time);
    if (date_time_ls == date_time) date_time = date_time_ls;
    let date = new Date(date_time * 1000)
    let formatDate = format || "yyyy-MM-dd hh:mm:ss"
    if (/(y+)/.test(formatDate)) {
        formatDate = formatDate.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(formatDate)) {
            let str = o[k] + ''
            formatDate = formatDate.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
        }
    }
    return formatDate
});

//转换存证类型
Vue.filter("transformCertType", (val) => {
	return val = val == 1 ? "录音存证" : val == 2 ? "拍照存证" : val == 3 ? "录像存证" : val == 4 ? "文件存证" : val == 5 ? "内容存证" : "未匹配，请检查"
})

Vue.filter("sliceHash", function (e) {
      if (e == '' || e == null || e == undefined) {
        return ''
      } else {
        let a = e.slice(0, 4)
        let b = e.substring(e.length - 4)
        let c = a + ' *** ' + b
        return c
      }
    })

Vue.filter('$formatAmountToFee', function(amount){

    if(!amount){
      return 0;
    }
    return parseFloat((amount/100).toFixed(2));

})
//保留六位小数
Vue.filter('$formatAmountToKeepSix', function(val){

  if(!val){
    return val;
  }
  return parseFloat((val/1).toFixed(6));
  if(!val){
    //toFixed(n)实现保留n位小数
       return (val/1).toFixed(6)
    }else{
       return val
    }

})
//保留六位小数
Vue.filter('$formatAmountToKeepSix1', function(val){

  if(val>0){
    //toFixed(n)实现保留n位小数
       return (val).toFixed(6)
    }else{
       return val
    }

})
//保留六位小数
Vue.filter('$formatAmountToKeepSixs', function(value){

  if(value>0){
    //toFixed(n)实现保留n位小数
       return (value).toFixed(6)
    }else{
       return value
    }

})
//链类型转换
Vue.filter('transformChainType', function(data){

    if(data=="title.trading_chain"){

      return lan('交易链') ;
    }else if (data=="title.pos_reward_chain"){
		return lan('奖励链')
	}else{
		return lan('商业链')
	}



})

Vue.filter('$toRegularNumber', function(data){
  if(!data){
    return 0;
  }
  console.log("data",data)
  return aboutWallet.toRegularNumber(data)
})


Vue.filter('$toTHAddress', function(data){
  if(!data){
    return 0;
  }
  console.log("data",data)
  return aboutWallet.toTHAddress(data)
})


Vue.filter('$hiddenString', function(string, front = 0, behind = 0){
  if(!string || (string.lenght <= front + behind)){
    return '';
  }

  console.log('string', string);
  string += '';
  return string.substring(0, front) + '...' + string.substring(string.length - behind)
})

