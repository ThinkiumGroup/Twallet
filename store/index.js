import Vue from 'vue'
import Vuex from 'vuex'
import walletApi from "../apis/walletApi";
import decentralizedTransactionsApi from "../apis/decentralizedTransactionsApi";
import {contractIndexEnum} from "../utils/data/enums";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		defaultWallet: uni.getStorageSync('defaultWallet'),
		walletList:  uni.getStorageSync('walletList'),
		addressList: uni.getStorageSync('addressList') || [],
		signParams:uni.getStorageSync('signParams'),
		walletName: '',
		password: '',
		mnemonicWords: '',
		_contractAddress: {},
},
	getters:{
		hasDefaultWallet(state){
			return !!(state.defaultWallet && state.defaultWallet.address)
			  },
	},
	mutations: {
		// Set the current default wallet
		setDefaultWallet(state, walletData) {
			uni.setStorageSync('defaultWallet',walletData);
			state.defaultWallet = walletData;
		},
		setWalletList(state, walletList){
			uni.setStorageSync('walletList', walletList);
			state.walletList = walletList;
		},
		setAddressList(state, addressList) {
			uni.setStorageSync('addressList', [...addressList, ...state.addressList])
			state.addressList = [...addressList, ...state.addressList];
		},
		saveNameAndPassword(state, nameAndPassword) {
			state.walletName = nameAndPassword.walletName
			state.password = nameAndPassword.password
		},
		setMnemonicWords(state, mnemonicWords) {
			state.mnemonicWords = mnemonicWords
		},
		setLastPassWordTime(state, lastPassWordTime) {
			uni.setStorageSync('defaultWallet', { ...state.defaultWallet, ...{ lastPassWordTime } })
			state.defaultWallet.lastPassWordTime = lastPassWordTime
		},
		setLastPassWordTime(state, lastPassWordTime) {
			uni.setStorageSync('defaultWallet', { ...state.defaultWallet, ...{ lastPassWordTime } })
			state.defaultWallet.lastPassWordTime = lastPassWordTime
		},
		setSignParams(state, signParams = {}){
			// console.log('signParams', signParams);
			uni.setStorageSync('signParams')
			state.signParams = signParams;
		},
		setContractAddresses(state, contractAddresses = {}){
			const addresses= {
				// CONTRACT_ROUTER: '0x5658Dc1dcd9243b12DDa05a9422184b1d5Faf18F',
				// CONTRACT_FLASH_SWAP: '0x9175dFC02BCE770F5f4385Dc83543672D2FA4BF2',
				// CONTRACT_WTKM: '0x16cB6Ea4aD8442d64988286838AAc4f89124A521',
				// // CONTRACT_FLASH_SWAP_POOL: '0xE9393A8e7b65D2384D5CfDcC073e8a55469d2651'
				// CONTRACT_FLASH_SWAP_POOL: '0x2584d642ad583278D714aB53ed44eAE3954E2Ac4'
				// // CONTRACT_ROUTER: '0x3bE7B92A2d064654AC17D9428945b6dDeca3F7Ae',
			}
			const addresses2 = Object.assign({}, contractAddresses, addresses)
			uni.setStorageSync('_contractAddress', addresses2);
			state._contractAddress = addresses2;
		}
	},
	actions: {
		async getContractAddresses({ commit, state, dispatch }){
			console.log('Go get ContractAddresses');
			let address = state.defaultWallet.address && state.defaultWallet.address.toLowerCase();
			if(!address){
				return;
			}
			let params = {
				accountAddress: address,
				contractAddress: '',
				page: 1,
				rows: 10000,
				xtoName: '',
			};
			let result = await decentralizedTransactionsApi.getTokenList(params) || {};
			let tokenList = result.data.data || [];

			let contractAddresses = {}
			tokenList.map((item) => {
				Object.keys(contractIndexEnum).map((key) => {
					if(contractIndexEnum[key] == item.index){
						contractAddresses['CONTRACT_' + key] = item.contractAddress
					}
				})
			});

			commit('setContractAddresses', contractAddresses);
		}
	}
});

export default store
