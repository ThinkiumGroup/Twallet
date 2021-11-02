
import Web3 from 'thinkium-web3js';
import { ethers } from 'ethers';
import { getRpcUrl } from '../utils/host'
import Uniprovider from "../utils/uniprovider";


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
    if (!privateKey) {
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

  async signTransaction(obj, privateKey) {
    const web3 = new Web3();
    web3.thk.defaultPrivateKey = privateKey;
    // web3.thk.defaultAddress = address.toLowerCase();
    // web3.thk.defaultChainId = chainId.toString();
    // web3.thk.setVal(obj.value || '0');
    const signTransaction = web3.thk.signTransaction(obj, privateKey);
    return signTransaction;
  },

  /**
   * Transaction (issuing contract, adjusting contract method, intra chain transfer)
   */
  sendTx(obj) {
    let rpc = getRpcUrl('thk');
    const web3 = new Web3(new Uniprovider(rpc));
    return web3.thk.SendTx(obj)
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
    const web3 = new Web3();
    return web3.CashCheque.encode(data)
  },

  /**
 * Get block height
 * @param toChainId
 */
  async getCurrentHeight(toChainId) {
    let rpc = getRpcUrl('thk');
    const web3 = new Web3(new Uniprovider(rpc));
    const { currentheight } = await web3.thk.GetStats(toChainId)
    return currentheight
  },

  /**
  * Get transaction details through hash
  * @param chainId
  * @param txHash
  * @returns {*}
  */
  getTransactionByHash(chainId, txHash) {
    let rpc = getRpcUrl('thk');
    const web3 = new Web3(new Uniprovider(rpc));
    return web3.thk.GetTransactionByHash(chainId, txHash)
  },


  async getAccount(chainId, address) {
    let rpc = getRpcUrl('thk');
    var web3 = new Web3(new Uniprovider(rpc));
    return web3.thk.GetAccount(chainId, address)
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
    let rpc = getRpcUrl('thk');
    var web3 = new Web3(new Uniprovider(rpc));
    return web3.thk.RpcMakeVccProof(data)
  },

  /**
   * Revocation of check proof parameters
   * @param input
   *
   */
  decodeInput(input) {
    let rpc = getRpcUrl('thk');
    var web3 = new Web3(new Uniprovider(rpc));
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
    let rpc = getRpcUrl('thk');
    var web3 = new Web3(new Uniprovider(rpc));
    return web3.thk.MakeCCCExistenceProof(data)
  },
  /**
   * Call contract
   * transfer(address,uint):(uint256) method
   * 0x113 address
   * .... parameter
   * */
  simpleEncode(...data) {
    const web3 = new Web3();
    return web3.ABI.simpleEncode(...data)
  },






  /**
   * Get account balance
   * @param chainId
   * @param address
   * @returns {*}
   *
   */
  async ethGetAccount(chainId, address) {
    let rpc = getRpcUrl(chainId);
    let currentProvider = new Uniprovider(rpc);
    let provider = new ethers.providers.Web3Provider(currentProvider);
    const balance = await provider.getBalance(address);
    return balance.toString();
  },

  async ethGetNonce(chainId, address) {
    let rpc = getRpcUrl(chainId);
    let currentProvider = new Uniprovider(rpc);
    let provider = new ethers.providers.Web3Provider(currentProvider);
    return provider.getTransactionCount(address);
  },

  // 同链转账
  ethSendTransaction(chainId, transaction = {}, privateKey) {
    if (!transaction.to || !transaction.value) {
    }
    let rpc = getRpcUrl(chainId);
    let currentProvider = new Uniprovider(rpc);
    let provider = new ethers.providers.Web3Provider(currentProvider);
    let wallet = new ethers.Wallet(privateKey, provider);
    // Send the transaction
    return wallet.sendTransaction(transaction)
  },

  /**
   * Get transaction details through hash
   * @param chainId
   * @param txHash
   * @returns {*}
   */
  ethGetTransactionReceipt(chainId, txHash) {
    let rpc = getRpcUrl(chainId);
    let currentProvider = new Uniprovider(rpc);
    let provider = new ethers.providers.Web3Provider(currentProvider);
    console.log('-----getTransactionReceipt', txHash)
    return provider.getTransactionReceipt(txHash)
  },

  /**
   * Call contract
   * @param contractAbi
   * @param contractAddress
   * @param privateKey
   * @param chainId
   */
  ethCallContract({ contractAbi, contractAddress, privateKey, chainId }) {
    let rpc = getRpcUrl(chainId);
    let currentProvider = new Uniprovider(rpc);
    let provider = new ethers.providers.Web3Provider(currentProvider);
    let wallet;
    if (privateKey) {
      wallet = new ethers.Wallet(privateKey, provider);
    }
    return new ethers.Contract(contractAddress, contractAbi, wallet || provider);
  },
}



