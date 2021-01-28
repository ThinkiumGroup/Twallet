import request from "../utils/request";

  /**
	 * @param {Number} userId 
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

