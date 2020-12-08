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
}
