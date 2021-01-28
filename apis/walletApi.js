import { getRpcUrl } from '../utils/host'
var Web3 = require('thinkium-web3js');
import uniprovider from "../utils/uniprovider";

let rpcUrl = getRpcUrl();          //rpc proxy
var web3 = new Web3(new uniprovider(rpcUrl));

const bip39 = require('bip39');
const hdkey = require('hdkey');
var util = require('ethereumjs-util');


export default {
  // Creating mnemonics
  async createMnemonicWords() {
    let mnemonicWords = await bip39.generateMnemonic();
    console.log('createMnemonicWords', mnemonicWords)
    return mnemonicWords;
  },
  // Get the private key according to the mnemonic words
  async getPrivateKeyFromMnemonicWords(mnemonicWords) {
    if (!mnemonicWords) {
      throw new Error("Invalid mnemonic passed in");
    }
    let seed = await bip39.mnemonicToSeed(mnemonicWords);
		/*  Use seed to generate HD wallet. If we want to be more specific,
		we need to generate the master key and record it.*/
    let hdWallet = hdkey.fromMasterSeed(seed);
    let key1 = hdWallet.derive("m/44'/60'/0'/0/0");
    let privateKey = '0x' + key1._privateKey.toString('hex');
    console.log('privateKey', privateKey);
    return privateKey
  },
  // Get public key
  getPublicKeyFromPrivateKey(privateKey) {
    if(!privateKey){
      throw new Error("The private key passed in is invalid");
    }
    let publicKey = util.bufferToHex(util.privateToPublic(util.toBuffer(privateKey)));
    console.log('publicKey', publicKey)
    return publicKey;
  },
  // Get the address
  getAddressFromPublicKey(publicKey) {
    //  Use the public key in keypair to generate the address.
    var address = util.pubToAddress(util.toBuffer(publicKey), true);
    //  Based on bip55 protocol, the address is encoded again to obtain the final eth address
    address = util.toChecksumAddress('0x' + address.toString('hex')).toLowerCase();
    console.log('address', address)
    return address
  },
  /**
   * Get account balance
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
   * Transaction (issuing contract, adjusting contract method, intra chain transfer)
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
    //Signature parameters
		privateKey && web3.thk.signTransaction(obj, privateKey);
    return web3.thk.SendTx(obj)
  },

  /**
   * Get transaction details through hash
   * @param chainId
   * @param txHash
   * @returns {*}
   */
  getTransactionByHash(chainId, txHash) {
    return web3.thk.GetTransactionByHash(chainId, txHash)
  },

	/**
	 * Get block height
	 * @param toChainId
	 */
	async getExpireHeight(toChainId) {
		let expireAfter = 200
		const { currentheight } = await web3.thk.GetStats(toChainId)
		return (currentheight + expireAfter)
	},

	/**
	* Generate check input
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
   * Initialize the data of Web3,
   * @param privateKey  Buffer type
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
   * Call contract
   * @param contractAbi
   * @param contractAddress
   * @param privateKey
   * @param address
   * @param chainId
   */
  callContract({contractAbi, contractAddress, privateKey, address, chainId}) {
  	if(privateKey){
      // Initialize private key, address and Chain ID
			this.init(privateKey, address, chainId);
		}else{
			web3.thk.defaultAddress = address.toLowerCase();
			web3.thk.defaultChainId = chainId;
		}
    // Gets the contract object through which the methods in the contract can be called
    return web3.thk.contract(contractAbi).at(contractAddress, null);
  },
  /**
   * Setting the primary currency
   * @param value
   */
  setVal(value){
    web3.thk.setVal(value);
  },


	/**
	*  Generate check proof input
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
	 * Revocation of check proof parameters
	 * @param input
	 *
	 */
	decodeInput(input) {
		return web3.CashCheque.decode(input)
	},
	/**
	*  Cancellation of check certificate input
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
	 * Call contract
	 * transfer(address,uint):(uint256) method
	 * 0x113 address
	 * .... parameter
	 * */
	simpleEncode(...data) {
		return web3.ABI.simpleEncode(...data)
	},


}



