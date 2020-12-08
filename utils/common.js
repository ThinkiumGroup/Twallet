import enums from "./data/enums";

const aboutPay = (method, data) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: method, // alipay wxpay
			orderInfo: data, //微信、支付宝订单数据
			success: function(res) {
				console.log('success:' + JSON.stringify(res));
				resolve();
			},
			fail: function(err) {
				console.log('fail:' + JSON.stringify(err));
				reject(JSON.stringify(err))
			}
		});
	})
}


export const toPay = (payType, data) => {
	console.log('payType', payType);
	if (payType === enums.payModeTypeEnum.ALI_APP) {
		return aboutPay('alipay', data.body);
	} else if (payType === enums.payModeTypeEnum.WEI_CHAT_APP) {
		let appSignature = data.appSignature || {}
		let params = {
			"appid": appSignature.appId,
			"noncestr": appSignature.nonce,
			"package": appSignature.pack,
			"partnerid": data.partnerId,
			"prepayid": data.prepayId,
			"timestamp": appSignature.timestamp,
			"sign": appSignature.signature
		}
		return aboutPay('wxpay', params);
	}
};
//复制适用H5
export function copyToClipboard(content) {
  if (window.clipboardData) {
    window.clipboardData.setData('text', content);
  } else {
    (function (content) {
      document.oncopy = function (e) {
        e.clipboardData.setData('text', content);
        e.preventDefault();
        document.oncopy = null;
      }
    })(content);
    document.execCommand('Copy');
  }
}

export function copy(data) {
	// #ifdef H5
	copyToClipboard(data)
	// #endif

	// #ifndef H5
	console.log("copy")
	uni.setClipboardData({
		data,
		success: function() {
			console.log('copy success');
		}
	});
	// #endif

}

// 保存图片
export function saveHeadImgFile(base64, quality) {
	const bitmap = new plus.nativeObj.Bitmap("test");
	const time = new Date().getTime()
	return new Promise((resolve, reject) => {
		// 从本地加载Bitmap图片
		bitmap.loadBase64Data(base64, function() {
			const url = "_doc/" + time + ".png"; // url为时间戳命名方式
			bitmap.save(url, {}, (i) => {
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function() {
						resolve({
							code: 0,
							msg: '保存成功',
							filePath: url
						});
					}
				});
			}, (e) => {
				reject('保存图片失败：' + JSON.stringify(e));
			});
		}, (e) => {
			reject('加载图片失败：' + JSON.stringify(e));
		});
	})
}

//打乱数组
export function randomArraySort (array){
    let len = array.length;
    let arr = [...array];
    for(let i=len-1;i>=0;i--){
      let randomIndex = Math.floor(Math.random() * (i+1));
      let itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
}

//将对象值组成数组
export function groupObjValToList(obj = {}){
  return Object.keys(obj).map((item) => {
  	return obj[item];
	})
}

// 防抖
export function _debounce(fn, delay) {

	var delay = delay || 200;
	var timer;
	return function (value) {
		var th = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(function () {
			timer = null;
			fn.apply(th, args);
		}, delay);
	};
}

// 节流
export function _throttle(fn, interval) {
	var last;
	var timer;
	var interval = interval || 200;
	return function () {
		var th = this;
		var args = arguments;
		var now = +new Date();
		if (last && now - last < interval) {
			clearTimeout(timer);
			timer = setTimeout(function () {
				last = now;
				fn.apply(th, args);
			}, interval);
		} else {
			last = now;
			fn.apply(th, args);
		}
	}
}

// 整理输入的数字
export function clearNoNum(number, type) {
	if(!(number - 0)){
     return 0;
	}
	number += '';
	if(type === 'int'){
		return parseInt(number);
	}
	number = number.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
	number = number.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
	number = number.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	// number = number.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
	if (number.indexOf(".") < 0 && number != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
		number = parseFloat(number);
	}

	return number;
}

// 整理数字
export function arrangeNum(number, type = 'auto', n = 6){
	if(!(number - 0)){
		return 0;
	}

	if(type === 'auto' || !type){
		return parseFloat((number - 0).toFixed(n))
	}

	number *= Math.pow(10, n);
	if(type === 'ceil'){
		number = Math.ceil(number);
		return parseFloat(number/Math.pow(10, n))
	}
	if(type === 'floor'){
		number = Math.floor(number);
		return parseFloat(number/Math.pow(10, n))
	}
}

// 获得百分比, 以num2 为基数
export function getPercentage(num1, num2, type, n = 2){
	console.log(num1, num2);
  let percentage = (num1 - num2)/num2;
  if(type === 'positive'){  // 获得正数
     return  (Math.abs(percentage)*100).toFixed(n) + '%';
	}else{
		 return (percentage*100).toFixed(n) + '%';
	}
}

/**
 * 查看是否过期
 * @param lastTime 上次记录的时间 毫秒
 * @param range 过期时长
 */
export function isTimeInvalid(lastTime, range){
	let currentTime = new Date().getTime();
  return currentTime - lastTime - range  > 0
};


