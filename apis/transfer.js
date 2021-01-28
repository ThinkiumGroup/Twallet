import request from "../utils/request";

 /**
	 * @param {String} address  Default wallet address
	 * @param {Number} page
	 * @param {Number} rows
	 * @param {String} timeStamp  The timestamp of the last entry on each page
	 * @param {Number} parentType
	 * */

	export function getTradingList(data) {
    return request({
      url: '/v1/tradingList',
      methods: 'post',
      data,
    })
  }

	/**
		 * @param {String} chainId
		 * @param {String} accountAddress
		 * @param {String} contractAddress
		 * @param {Number} page
		 * @param {Number} rows
		 * */
	export function getTokenHoldingsForWallet(data) {
    return request({
      url: '/v1/tokenHoldingsForWallet',
      methods: 'post',
      data,
    })
  }

	/**
		 * @param {String} address
		 * @param {String} orderType
		 * @param {String} timeStamp
		 * @param {Object} tables
		 * @param {String} contractAddresss
		 * @param {Number} transType
		 * @param {Number} rows
		 * @param {Number} page
		 * */
	export function getTraingListInOneZeroThree(data) {
	  return request({
	    url: '/v1/traingListInOneZeroThree',
	    methods: 'post',
	    data,
	  })
	}


