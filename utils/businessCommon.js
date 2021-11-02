import walletApi from "../apis/walletApi";
import store from "../store";
import dataCrypto from "./dataCrypto";
import {
  BigNumber
} from 'bignumber.js';
import _ from 'lodash'
var Web3 = require('thinkium-web3js');
var web3 = new Web3();



export const aboutWallet = {
  /**
   * Set default wallet
   * @param walletAddress
   * @returns {Promise<{msg: string, status: number}>}
   */
  async setDefaultWallet(walletAddress){
    const walletList = uni.getStorageSync('walletList') || [];
    let walletData = walletList.find((item) => {
      return item.address === walletAddress
    }) || {};
    if (Object.keys(walletData).length) {
      uni.setStorageSync('defaultWallet', walletData);
      store.commit('setDefaultWallet', walletData);
      return {
        status: 1,
        msg: 'Set successfully'
      };
    } else {
      return {
        status: 0,
        msg: 'The wallet is not stored'
      };
    }
  },
  /**
   * Add new wallet
   * @param newWallet  newWallet={name, mnemonic, privateKey, address} mnemonic, privateKey, address传任何一个就行，按地址导入的，只能查看数据，不能进行交易
   * @param passWord
   * @param method  1. Add wallet, 2. Replace existing wallet
   * @returns {Promise<{msg: string, status: number}|{status: number}>}
   */
  async addNewWallet( newWallet, passWord, method = 1){
    if(!newWallet.name){
      return {status: 0, msg: 'Please pass in the wallet name'};
    }
    passWord += '';
    let privateKey, publicKey, address, type;
    if (newWallet.mnemonic) {
      type = 'mnemonic';
      privateKey = await walletApi.getPrivateKeyFromMnemonicWords(newWallet.mnemonic.trim());
      publicKey = walletApi.getPublicKeyFromPrivateKey(privateKey);
      address = walletApi.getAddressFromPublicKey(publicKey);
    } else if (newWallet.privateKey) {
      type = 'privateKey';
      privateKey = newWallet.privateKey.trim();
      publicKey = walletApi.getPublicKeyFromPrivateKey(privateKey);
      address = walletApi.getAddressFromPublicKey(publicKey);
    } else if (newWallet.address) {
      type = 'address';
      newWallet.name += '-byAddress';
      address = newWallet.address.trim();
    } else {
      return {status: 0, msg: 'Please pass in the mnemonic/private key/address'};
    }

    let walletList = uni.getStorageSync('walletList') || [];
    let walletIndex;
    for (let key in walletList) {
      if (type !== 'address' && walletList[key] && walletList[key].address === address) {
        if (method == 1) {
          console.log('Deposited in this wallet');
          return {
            status: 0,
            msg: 'The wallet has been imported'
          };
        } else if (method == 2) {
          walletIndex = key
        }
      }
    }

    let iv = dataCrypto.getRandomIV();
    let key = dataCrypto.formatPasswordToKey(passWord, iv);
    let randomStrEncrypted = '';
    if (type === 'mnemonic' || type === 'privateKey') {
      randomStrEncrypted = dataCrypto.encryptData(newWallet.mnemonic || newWallet.privateKey, passWord, iv, 'aes-256-cbc');
    }

    let walletData = {
      name: newWallet.name,
      passHash: key,
      address,
      asset: 0,
      type,
      passwordErrorNum: 0,
      lastPassWordTime: '',
    };


    let obj = {
      type,
      IV: iv,
      randomStrEncrypted,
    };

    if (method == 1) {
      walletList.push(walletData);
    } else if (method == 2) {
      walletList.splice(walletIndex, 1, walletData);
    }

    uni.setStorageSync('walletList', walletList);
    uni.setStorageSync(address, obj);
    store.commit('setWalletList', walletList);
    return {status: 1};
  },
  /**
   * Verify password
   * @param walletAddress
   * @param passWord
   * @returns {boolean}
   */
  checkPassword(walletAddress, passWord){
    passWord += '';
    const walletList = uni.getStorageSync('walletList') || [];
    let walletData = walletList.find((item) => {
      return item.address === walletAddress
    }) || {};
    let walletSecretInfo = uni.getStorageSync(walletAddress) || {}
    let key = dataCrypto.formatPasswordToKey(passWord, walletSecretInfo.IV);
    return key === walletData.passHash;
  },
  /**
   * Obtain the wallet private key, which is used for transactions. Output Buffer format
   * @param walletAddress
   * @param password
   * @returns {Promise<Buffer>}
   */
  async getWalletPrivateKey(walletAddress, password){
    password += '';
    let walletInfo = await this.getWalletInfo(walletAddress, password) || {};
    let privateKey = walletInfo.privateKey;
    privateKey = new Buffer.from(privateKey.substring(2, 67), 'hex')
    console.log(privateKey, 90000);
    return privateKey;
  },
  /**
   * Get wallet mnemonic, private key, public key, address
   * @param walletAddress
   * @param password
   * @returns {Promise<{}>}
   */
  async getWalletInfo(walletAddress, password){
    password += '';
    let obj = {};
    const walletList = uni.getStorageSync('walletList') || [];
    let walletData = walletList.find((item) => {
      return item.address === walletAddress
    }) || {};
    let walletSecretInfo = uni.getStorageSync(walletAddress) || {};
    if (walletData.type === 'mnemonic') {
      obj.mnemonic = dataCrypto.decryptData(walletSecretInfo.randomStrEncrypted, password, walletSecretInfo.IV);
      obj.privateKey = await walletApi.getPrivateKeyFromMnemonicWords(obj.mnemonic);
    } else if (walletData.type === 'privateKey') {
      obj.privateKey = dataCrypto.decryptData(walletSecretInfo.randomStrEncrypted, password, walletSecretInfo.IV);
    }
    obj.publicKey = walletApi.getPublicKeyFromPrivateKey(obj.privateKey);
    obj.address = walletAddress;
    return obj;
  },

  /**
   * Delete wallet
   * @param walletAddress
   * @returns {Promise<{status: number}>}
   */
  async deleteWallet(walletAddress){
    let walletList = uni.getStorageSync('walletList') || [];
    walletList = walletList.filter((item) => {
      return item.address !== walletAddress
    });
    uni.removeStorageSync(walletAddress);
    uni.setStorageSync('walletList', walletList);
    store.commit('setWalletList', walletList);
    return {
      status: 1
    };
  },
  /**
   * Delete the wallet and set the default wallet
   * @param walletAddress
   * @returns {Promise<void>}
   */
  async deleteWalletAndSetDefault(walletAddress){
    await this.deleteWallet(walletAddress);
    let walletList = uni.getStorageSync('walletList') || [];
    if (walletList.length) {
      this.setDefaultWallet(walletList[0].address);
    }else{
      store.commit('setDefaultWallet', {});
    }
  },
  /**
   * change the password
   * @param walletAddress
   * @param oldPassword
   * @param newPassword
   * @returns {Promise<{status: number}>}
   */
  async changePassword(walletAddress, oldPassword, newPassword){
    oldPassword += '';
    newPassword += '';
    let walletInfo = await this.getWalletInfo(walletAddress, oldPassword) || {};
    let walletList = uni.getStorageSync('walletList') || [];
    let walletData = walletList.find((item) => {return item.address === walletAddress}) || {};
    let {mnemonic, privateKey, address} = walletInfo;
    let result = await this.addNewWallet({mnemonic, privateKey, address, name: walletData.name}, newPassword, 2);
    if(result.status == 1){
      return { status: 1 };
    }
  },
  /**
   * Change wallet name
   * @param walletAddress
   * @param newName
   * @returns {Promise<{status: number}>}
   */
  async changeWalletName(walletAddress, newName){
    if(!walletAddress){
      throw new Error('Change wallet name, wallet address is missing');
    }
    if (!newName) {
      throw new Error('Change wallet name, new wallet name is missing');
    }

    let walletList = uni.getStorageSync('walletList') || [];
    let index = walletList.findIndex((item) => {
      return item.address === walletAddress
    });
    let wallet = walletList[index];
    wallet.name = newName;
    walletList.splice(index, 1, wallet);
    store.commit('setWalletList', walletList);

    let defaultWallet = uni.getStorageSync('defaultWallet') || {};
    if (walletAddress === defaultWallet.address) {
      store.commit('setDefaultWallet', wallet);
    }
    return { status: 1 };
  },
  /**
   * Convert to 0x address
   * @param address
   * @returns {string}
   */
	toAddress(address) {
		return web3.Iban.toAddress(address).toLowerCase()
	},
  /**
   * Convert to TH address
   * @param THaddress
   * @returns {string}
   */
  toTHAddress(THaddress){
    return web3.Iban.toIban(THaddress)
  },
  /**
   * Increase number, output string
   * @param nums
   * @returns {string}
   */
	toBigNumber(nums) {
    nums -= 0;
		return new BigNumber(`${nums}`).multipliedBy('1e+18').toString(10)
	},
	//Increase the number
	toBigNumber16(nums) {
		return new BigNumber(`${nums}`).multipliedBy('1e+18').toString(16)
	},
  /**
   * Large numbers become regular numbers
   * @param number
   * @param type (ceil, floor, origin, auto 默认auto)
   * @param n 保留位数
   * @returns {number}
   */
	toRegularNumber(number, type = 'floor', n = 6){
	  if(!number){
	    return 0;
	  }
    if(number instanceof Array){
      return 0;
    }
    number = number.toString();
    let bigNumber = new BigNumber(number).div("1e+18");
	  let regularNumber = bigNumber.toString(10);

    if (type === 'origin') {

    }
    if (type === 'auto') {
      regularNumber =  parseFloat((regularNumber - 0).toFixed(n))
    }


    if (type === 'ceil') {
      regularNumber *= Math.pow(10, n);
      regularNumber = Math.ceil(regularNumber);
      regularNumber =  parseFloat(regularNumber / Math.pow(10, n))
    }
    if (type === 'floor') {
      regularNumber *= Math.pow(10, n);
      regularNumber = Math.floor(regularNumber);
      regularNumber =  parseFloat(regularNumber / Math.pow(10, n))
    }


    if(!bigNumber.isEqualTo(0) && !bigNumber.isGreaterThan(Math.pow(0.1, n))){
      regularNumber = bigNumber.toString()
    }

    if(regularNumber - 999999999 > 0){
      regularNumber = regularNumber.toExponential(n);
    }

    console.log('---regularNumber', regularNumber);
    return regularNumber;
  },
	/**
	 * Check address
	 * @param address
	 */
	checkAddress(address) {
		return web3.Iban.isValid(address)
	}
};

/**
 * Format mnemonic
 * @param mnemonicWords
 * @returns {string}
 */
export function formatMnemonicWords(mnemonicWords = ''){
  if(!mnemonicWords.trim()){
    console.log('The incoming mnemonic is empty');
    return;
  }
  let reg = /[^a-zA-Z]+/g
  let mnemonicWordsNew = mnemonicWords.replace(reg, ' ');
  return mnemonicWordsNew.toLowerCase().trim();
}

/**
 * Cycle query transaction status
 * @param chainId
 * @param hash
 * @param delay
 * @returns {Promise<unknown>}
 */
export async function getTransactionResultByHashCircularly(chainId, hash, delay){
  let cycTimes = 0;
  let interval;
  return new Promise((resolve, reject) => {
    interval = setInterval(async () => {
      let result = await walletApi.ethGetTransactionReceipt(chainId, hash) || {};
      console.log('status', result.status);
      if (cycTimes >= 8 || (result && result.status == 1)) {
        clearInterval(interval);
        interval = null;
        resolve(true);
      } else if(cycTimes < 8) {
        cycTimes++
      } else{
        resolve(false);
      }
    }, delay || 1000);
  })
}


/**
 *
 */
export function searchCode(method){
  return new Promise((resolve, reject) => {
    uni.scanCode({
      success(res) {
        let result = decodeURIComponent(res.result);
        const resultArr = result.split('&')
        const resiltObj = resultArr.reduce((obj, item) => {
          obj[item.split('=')[0]] = item.split('=')[1]
          return obj
        }, {})
        if(!Object.values(resiltObj)[0]){  //When nothing can be scanned, turn on the camera again
          searchCode(method).then((res) => {
            resolve(res);
          });
          return;
        }
        const { type, address, tokenType, privateKey } = resiltObj
        let url;
        switch (type) {
          case 'transfer':
            url = `/pages/transaction/transfer?address=${address}&tokenType=${tokenType}`;
            break;
          case 'importWallet':
            url = `/pages/wallet/importWallet?privateKey=${privateKey}`;
            break;
        }
        if(!method){
          uni.navigateTo({
            url,
          })
        }else{
          resolve(resiltObj);
        }
      },
      fail(err){
        console.log('Something went wrong');
      }
    });
  })

}
