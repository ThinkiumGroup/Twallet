// import Vue from 'vue'
// import { chainList } from "../../utils/data/enums";
import lan from '@/Framework/language/index'

export const transferTypeUrl = {
	0: require('@/static/icon/transferIn.png'), //transferIn
	1: require('@/static/icon/transferOut.png'), //transferOut
	2: require('@/static/icon/exchange.png'), //flashRedemption
	3: require('@/static/icon/crossChain.png'), //crossChain
}
export const ChainIdEnum = {
	MAIN_CHAIN: '100007',
	ACCOUNT_CHAIN: '100008',
	POS_CHAIN: '100009',
	BUSINESS_CHAIN: '100110',
}

export const ChainIdOldEnum = {
	MAIN_CHAIN: '0',
	ACCOUNT_CHAIN: '1',
	POS_CHAIN: '2',
	BUSINESS_CHAIN: '103',
}


export const gasCost = {
	USER_CHAIN_TRANSFER: 0.01,
	CROSS_CHAIN_TRANSFER: 1,
}

export const chainList = [
	{
		value: lan('accountChain'),
		id: ChainIdOldEnum.ACCOUNT_CHAIN
	},
	{
		value: lan('rewardChain'),
		id: ChainIdOldEnum.POS_CHAIN
	},
	{
		value: lan('businessChain'),
		id: ChainIdOldEnum.BUSINESS_CHAIN
	},
]


export const contractIndexEnum = {
	WTKM: -1,             //WTKM
	FLASH_SWAP: -2,       //flashRedemption Settlement voucher
	FLASH_SWAP_POOL: -3,  //Flash pool
	ROUTER: -1000,        //routing
	FACTORY: -1001,       //factory
};
