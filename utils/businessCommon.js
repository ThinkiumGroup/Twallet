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
   * 设置默认钱包
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
        msg: '设置成功'
      };
    } else {
      return {
        status: 0,
        msg: '没有存储该钱包'
      };
    }
  },
  /**
   * 添加新钱包
   * @param newWallet  newWallet={name, mnemonic, privateKey, address} mnemonic, privateKey, address传任何一个就行，按地址导入的，只能查看数据，不能进行交易
   * @param passWord
   * @param method  1,添加钱包，2，更换已有钱包
   * @returns {Promise<{msg: string, status: number}|{status: number}>}
   */
  async addNewWallet( newWallet, passWord, method = 1){
    if(!newWallet.name){
      return {status: 0, msg: '请传入钱包名称'};
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
      return {status: 0, msg: '请传入助记词/私钥/地址'};
    }

    let walletList = uni.getStorageSync('walletList') || [];
    let walletIndex;
    for (let key in walletList) {
      if (type !== 'address' && walletList[key] && walletList[key].address === address) {
        if (method == 1) {
          console.log('已存入该钱包');
          return {
            status: 0,
            msg: '已导入过该钱包'
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
   * 校验密码
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
   * 获取钱包私钥，用来进行交易 输出 Buffer 格式
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
   * 获取钱包助记词、私钥、公钥、地址
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
    obj.punlicKey = walletApi.getPublicKeyFromPrivateKey(obj.privateKey);
    obj.address = walletAddress;
    return obj;
  },

  /**
   * 删除钱包
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
   * 删除钱包，并设置默认钱包
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
   * 更改密码
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
   * 更改钱包名称
   * @param walletAddress
   * @param newName
   * @returns {Promise<{status: number}>}
   */
  async changeWalletName(walletAddress, newName){
    if(!walletAddress){
      throw new Error('更改钱包名称， 缺少钱包地址');
    }
    if (!newName) {
      throw new Error('更改钱包名称， 缺少钱包新名称');
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
   * 转换为0x地址
   * @param address
   * @returns {string}
   */
	toAddress(address) {
		return web3.Iban.toAddress(address).toLowerCase()
	},
  /**
   * 转换为TH地址
   * @param THaddress
   * @returns {string}
   */
  toTHAddress(THaddress){
    return web3.Iban.toIban(THaddress)
  },
  /**
   * 变大数字, 输出字符串
   * @param nums
   * @returns {string}
   */
	toBigNumber(nums) {
    nums -= 0;
		return new BigNumber(`${nums}`).multipliedBy('1e+18').toString(10)
	},
	//变大数字
	toBigNumber16(nums) {
		return new BigNumber(`${nums}`).multipliedBy('1e+18').toString(16)
	},
  /**
   * 大数变成常规数字
   * @param number
   * @param type (ceil, floor, origin, auto 默认auto)
   * @param n 保留位数
   * @returns {number}
   */
	toRegularNumber(number, type = 'auto', n = 6){
	  if(!(number - 0)){
	    return 0;
	  }
	  let regularNumber = new BigNumber(number).div("1e+18").toString(10);

    if (type === 'origin') {
      return regularNumber;
    }
    if (type === 'auto') {
      return parseFloat((regularNumber - 0).toFixed(n))
    }

    regularNumber *= Math.pow(10, n);
    if (type === 'ceil') {
      regularNumber = Math.ceil(regularNumber);
      return parseFloat(regularNumber / Math.pow(10, n))
    }
    if (type === 'floor') {
      regularNumber = Math.floor(regularNumber);
      return parseFloat(regularNumber / Math.pow(10, n))
    }
  }
};

/**
 * 格式化助记词
 * @param mnemonicWords
 * @returns {string}
 */
export function formatMnemonicWords(mnemonicWords = ''){
  if(!mnemonicWords.trim()){
    console.log('传入的助记词为空');
    return;
  }
  let reg = /[^a-zA-Z]+/g
  let mnemonicWordsNew = mnemonicWords.replace(reg, ' ');
  return mnemonicWordsNew.toLowerCase().trim();
}

/**
 * 循环查询交易状态
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
      let result = await walletApi.getTransactionByHash(chainId, hash) || {};
      console.log('status', result.status);
      if (result.status == 1 || cycTimes >= 8) {
        clearInterval(interval);
        interval = null;
        if (result.status != 1) {
          console.log('交易失败，hash：', hash);
        }
        resolve(result.status == 1);
      } else {
        cycTimes++
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
        if(!Object.values(resiltObj)[0]){ //扫不到东西的时候，重新打开相机
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
        console.log('出错啦啦啦啦');
      }
    });
  })

}
