import request from "../utils/request";

 /**
	 * @param {String} address  默认钱包地址
	 * @param {Number} page  页数
	 * @param {Number} rows  条数
	 * @param {String} timeStamp  每页的最后一条的时间戳
	 * @param {String} timeStamp  每页的最后一条的时间戳
	 * @param {Number} parentType  根据类型变化的参数 转入转出 3 跨链 7
	 * */
	 
	export function getTradingList(data) {
    return request({
      url: '/v1/tradingList',
      methods: 'post',
      data,
    })
  }
	
	/**
		 * @param {String} chainId  链id
		 * @param {String} chainId  用户地址
		 * @param {String} contractAddress  合约地址
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
		 * @param {String} address 地址
		 * @param {String} orderType  
		 * @param {String} timeStamp  合约地址
		 * @param {Object} tables  
		 * @param {String} contractAddresss 合约地址
		 * @param {Number} transType  0 转出 1 转入  “”或null 则为全部记录
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
	
	
	