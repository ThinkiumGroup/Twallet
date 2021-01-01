import { getRpcUrl } from '../utils/host'
var Web3 = require('thinkium-web3js');
import uniprovider from "../utils/uniprovider";

let rpcUrl = getRpcUrl();          //rpc proxy
var web3 = new Web3(new uniprovider(rpcUrl));

const bip39 = require('bip39');
const hdkey = require('hdkey');
var util = require('ethereumjs-util');


export default {
  // 创建 助记词
  async createMnemonicWords() {
    let mnemonicWords = await bip39.generateMnemonic();
    console.log('createMnemonicWords', mnemonicWords)
    return mnemonicWords;
  },
  // 根据助记词获得私钥
  async getPrivateKeyFromMnemonicWords(mnemonicWords) {
    if (!mnemonicWords) {
      throw new Error("传入的助记词无效");
    }
    let seed = await bip39.mnemonicToSeed(mnemonicWords);
    //  使用 seed 产生 HD Wallet。如果要说更明确，就是产生 Master Key 并记录起来。
    let hdWallet = hdkey.fromMasterSeed(seed);
    let key1 = hdWallet.derive("m/44'/60'/0'/0/0");
    let privateKey = '0x' + key1._privateKey.toString('hex');
    console.log('privateKey', privateKey);
    return privateKey
  },
  // 获得公钥
  getPublicKeyFromPrivateKey(privateKey) {
    if(!privateKey){
      throw new Error("传入的私钥无效");
    }
    let publicKey = util.bufferToHex(util.privateToPublic(util.toBuffer(privateKey)));
    console.log('publicKey', publicKey)
    return publicKey;
  },
  // 获得地址
  getAddressFromPublicKey(publicKey) {
    //  使用 keypair 中的公钥产生 address。
    var address = util.pubToAddress(util.toBuffer(publicKey), true);
    //  基于BIP55协议对地址进行再次编码，获取最终ETH地址
    address = util.toChecksumAddress('0x' + address.toString('hex')).toLowerCase();
    console.log('address', address)
    return address
  },
  /**
   * 获取账户余额
   * @param chainId
   * @param address
   * @returns {*}
	 *
	 * response:
			{
			"address": "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23",
			"balance": 9.99999985e+26,
			"codeHash": null,
			"nonce": 43,
			"storageRoot": null
			}
   */

  getAccount(chainId, address) {
    return web3.thk.GetAccount(chainId, address)
  },

  /**
   * 交易(发布合约、调合约方法、链内转账)
   * @param chainId
   * @param fromChainId
   * @param toChainId
   * @param from
   * @param to
   * @param nonce
   * @param value
   * @param input
   * @param extra
   * @param privateKey
   * @returns {*}
   */
  sendTx({chainId, fromChainId, toChainId, from, to, nonce, value, input, extra, privateKey}) {
    let obj = {
      chainId,
      fromChainId,
      toChainId,
      from,
      to,
      nonce: nonce.toString(),
      value: value.toString(),
      input,
      useLocal: false,
      extra: ''
    };
		console.log(obj, 99999999)
		this.setVal(null)
    //签名参数
		privateKey && web3.thk.signTransaction(obj, privateKey);
    return web3.thk.SendTx(obj)
  },

  /**
   * 通过hash获取交易详情
   * @param chainId
   * @param txHash
   * @returns {*}
   */
  getTransactionByHash(chainId, txHash) {
    return web3.thk.GetTransactionByHash(chainId, txHash)
  },

	/**
	 * 获取块高
	 * @param toChainId 目标链id
	 */
	async getExpireHeight(toChainId) {
		let expireAfter = 200
		const { currentheight } = await web3.thk.GetStats(toChainId)
		return (currentheight + expireAfter)
	},

	/**
	*  生成支票input
	* @param  FromChain,
	* @param  FromAddress,
	*	@param  Nonce,
	* @param  ToChain,
	* @param  ToAddress,
	* @param  Amount,
	* @param  ExpireHeight,
	 */
	cashCheque(data) {

		return web3.CashCheque.encode(data)
	},

  /**
   * 初始化web3的数据，
   * @param privateKey  Buffer类型
   * @param address
   * @param chainId
   */
  init(privateKey, address, chainId){
    web3.setProvider(new uniprovider(rpcUrl));
    web3.thk.defaultPrivateKey = privateKey;
    web3.thk.defaultAddress = address.toLowerCase();
    web3.thk.defaultChainId = chainId.toString();
  },
  /**
   * 调用合约
   * @param contractAbi
   * @param contractAddress
   * @param privateKey
   * @param address
   * @param chainId
   */
  callContract({contractAbi, contractAddress, privateKey, address, chainId}) {
  	if(privateKey){
      // 初始化私钥、地址、链id
			this.init(privateKey, address, chainId);
		}else{
			web3.thk.defaultAddress = address.toLowerCase();
			web3.thk.defaultChainId = chainId;
		}
    // 获取合约对象，通过该对象可以调用合约内的方法
    return web3.thk.contract(contractAbi).at(contractAddress, null);
  },
  /**
   * 设置主币
   * @param value
   */
  setVal(value){
    web3.thk.setVal(value);
  },


	/**
	*  生成支票证明input
	* @param 	chainId,
	* @param  fromChain,
	* @param  fromAddress,
	*	@param  nonce,
	* @param  toChain,
	* @param  toAddress,
	* @param  value,
	* @param  expireheight,
	 */
	rpcMakeVccProof(data) {
		return web3.thk.RpcMakeVccProof(data)
	},

	/**
	 * 撤销支票证明参数
	 * @param input
	 *
	 */
	decodeInput(input) {
		return web3.CashCheque.decode(input)
	},
	/**
	*  撤销支票证明input
	* @param 	chainId,
	* @param  fromChain,
	* @param  fromAddress,
	*	@param  nonce,
	* @param  toChain,
	* @param  toAddress,
	* @param  value,
	* @param  expireheight,
	 */
	makeCCCExistenceProof(data) {
		return web3.thk.MakeCCCExistenceProof(data)
	},
	/**
	 * 调用合约
	 * transfer(address,uint):(uint256) 方法
	 * 0x113 地址
	 * .... 参数
	 * */
	simpleEncode(...data) {
		return web3.ABI.simpleEncode(...data)
	},


}



