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
		// 设置当前默认钱包
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
		setPasswordErrorNum(state, passwordErrorNum) {
			uni.setStorageSync('defaultWallet', { ...state.defaultWallet, ...{ passwordErrorNum } })
			state.defaultWallet.passwordErrorNum = passwordErrorNum
		},
		setContractAddresses(state, contractAddresses = {}){
			console.log('_contractAddress', contractAddresses);
			uni.setStorageSync('_contractAddress', contractAddresses);
			state._contractAddress = contractAddresses;
		}
	},
	actions: {
		async getContractAddresses({ commit, state, dispatch }){
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
