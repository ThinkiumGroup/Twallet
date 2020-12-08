import request from "../utils/request";

  /**
	 * @param {Number} userId  用户id
	 * */
 export function getAddress(data) {
    return request({
      url: '/v1/addressDetails',
      methods: 'POST',
      data,
    })
  }
  export function getAddressList(data) {
     return request({
       url: '/v1/tokenHoldingsForWallet',
       methods: 'POST',
       data,
     })
   }

