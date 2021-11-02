import enums from "./data/enums";
import {BigNumber} from 'bignumber.js';

const aboutPay = (method, data) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: method, // alipay wxpay
			orderInfo: data, //WeChat, Alipay order data
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
//Copy applicable H5
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

// save Picture
export function saveHeadImgFile(base64, quality) {
	const bitmap = new plus.nativeObj.Bitmap("test");
	const time = new Date().getTime()
	return new Promise((resolve, reject) => {
		// Load Bitmap image from local
		bitmap.loadBase64Data(base64, function() {
			const url = "_doc/" + time + ".png"; //url is the time stamp naming method
			bitmap.save(url, {}, (i) => {
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function() {
						resolve({
							code: 0,
							msg: 'Saved successfully',
							filePath: url
						});
					}
				});
			}, (e) => {
				reject('Failed to save picture：' + JSON.stringify(e));
			});
		}, (e) => {
			reject('Failed to load image：' + JSON.stringify(e));
		});
	})
}

//Shuffle the array
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

//Group object values into array
export function groupObjValToList(obj = {}){
  return Object.keys(obj).map((item) => {
  	return obj[item];
	})
}

// Anti-shake
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

//Throttling
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

// Sort the entered numbers
export function clearNoNum(number, type) {
	if(!(number - 0)){
     return 0;
	}
	number += '';
	if(type === 'int'){
		return parseInt(number);
	}
	number = number.replace(/[^\d.]/g, ""); //Clear characters other than "number" and "."
	number = number.replace(/\.{2,}/g, "."); //Keep only the first one. Clear the extra
	number = number.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	// number = number.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //Only two decimals can be entered
	if (number.indexOf(".") < 0 && number != "") { //The above has been filtered, and what is controlled here is that if there is no decimal point, the first place cannot be an amount similar to 01, 02
		number = parseFloat(number);
	}

	return number;
}

// Sort the numbers
export function arrangeNum(number, type = 'auto', n = 6){
	if(!(number - 0)){
		return 0;
	}

	let numberReturn;
	if(type === 'auto' || !type){
		numberReturn =  parseFloat((number - 0).toFixed(n))
	}


	if(type === 'ceil'){
		number *= Math.pow(10, n);
		number = Math.ceil(number);
		numberReturn =  parseFloat(number/Math.pow(10, n))
	}
	if(type === 'floor'){
		number *= Math.pow(10, n);
		number = Math.floor(number);
		numberReturn =  parseFloat(number/Math.pow(10, n))
	}
	if(numberReturn - 999999999 > 0){
		numberReturn = numberReturn.toExponential(n);
	}

	return numberReturn
}

// Get the percentage, using num2 as the base
export function getPercentage(num1, num2, type, n = 2){
	console.log(num1, num2);
  let ratio = (num1 - num2)/num2;
  let percentage;

  if(type === 'positive'){  // Get a positive number
		percentage =  (Math.abs(ratio)*100).toFixed(n);
	}else{
		percentage =  (ratio*100).toFixed(n);
	}

	if(ratio - 999999999 > 0){
		percentage = ratio.toExponential(n);
	}

	return percentage + '%'
}

/**
 * Check if it has expired
 * @param lastTime Last recorded time in milliseconds
 * @param range Expiration time
 */
export function isTimeInvalid(lastTime, range){
	let currentTime = new Date().getTime();
  return currentTime - lastTime - range  > 0
};


// Determine whether it is a very small number
export function isMinimalNumber(number){
	number = new BigNumber(number);
	return !number.isEqualTo(0) && !number.isGreaterThan(0.00000000001);
};


