import Vue from 'vue'
import enums from "./utils/data/enums";
import lan from './Framework/language/index'
import values from './utils/data/value'
import { aboutWallet } from "./utils/businessCommon";

Vue.prototype.$showToast = function showToast(title, iconStatus = 'none') {
	uni.showToast({
		title,
		duration: 2000,
		icon: iconStatus
	});
}


Vue.prototype.$enums = enums;

Vue.prototype.$lan = lan;

Vue.prototype.$to0xAddress = aboutWallet.toAddress;
Vue.prototype.$toTHAddress = aboutWallet.toTHAddress;


Vue.prototype.MAIN_COIN = values.MAIN_COIN;



