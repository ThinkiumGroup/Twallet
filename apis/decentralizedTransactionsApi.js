import request from "../utils/request";

export default {
  /**
   * 查看通证列表
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
   * 获得兑换对列表
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
   * 获得钱包添加过的兑换对列表
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
