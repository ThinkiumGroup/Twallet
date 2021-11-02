import request from "../utils/request";

export default {
  /**
   * View the list of token
   * accountAddress
   * contractAddress
   * page
   * rows
   * xtoName
   */
  getTokenList(data) {
    return request({
      url: '/v1/tokenHoldingsByAddress',
      methods: 'POST',
      data,
    })
  },

  /**
   * Get a list of exchange pairs
   * @param data
   * @returns {Promise | Promise<unknown>}
   */
  getTransactionPairList(data){
    return request({
      url: '/v1/getPair',
      methods: 'POST',
      data,
    })
  },
  /**
   * Get the list of exchange pairs added by Wallet
   * @param data
   * @returns {Promise | Promise<unknown>}
   */
  getTransactionPairListForAddress(data){
    return request({
      url: '/v1/getPairForAddress',
      methods: 'POST',
      data,
    })
  },
}
