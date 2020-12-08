// import Vue from 'vue'
// import { chainList } from "../../utils/data/enums";
import lan from '@/Framework/language/index'

export const transferTypeUrl = {
		0: require('@/static/icon/transferIn.png'), //转入
		1: require('@/static/icon/transferOut.png'), //转出
		2: require('@/static/icon/exchange.png'), //闪兑
		3: require('@/static/icon/crossChain.png'), //跨链
}

export const gasCost = {
	USER_CHAIN_TRANSFER: 0.01,
	CROSS_CHAIN_TRANSFER: 1,
}

export const chainList = [
	{
		value: lan('账户链'),
		id: '1'
	},
	{
		value: lan('奖励链'),
		id: '2'
	},
	{
		value: lan('商业链'),
		id: '103'
	},
]


export const contractIndexEnum = {
	WTKM: -1,             //WTKM
	FLASH_SWAP: -2,       //闪兑 结算凭证
	FLASH_SWAP_POOL: -3,  //闪兑池
	ROUTER: -1000,        //路由
	FACTORY: -1001,       //工厂
};
