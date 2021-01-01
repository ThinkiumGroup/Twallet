<template>
	<view class="home-container">
		<CustomBar />
		<NoDefaultWallet v-if="!hasDefaultWallet"></NoDefaultWallet>
		<!-- 头部 -->
		<view v-else class="home-cont">
			<view class="h_top">
				<view class="top_left" @click="toWalletManage">
					<view class="top_left_top">
						<view class="left_img">
							<image src="../../static/image/home/icon_mc.png"></image>
						</view>
						<view class="left_text">
							<text>{{defaultWallet.name}}</text>
						</view>
					</view>



				</view>
				<!-- h5端暂不支持扫码 -->
				<!-- #ifndef H5-->
				<view class="top_right" @click="searchCode">
					<image src="../../static/image/home/icon_sys.png"></image>
				</view>
				<!-- #endif -->
			</view>
			<!-- banner -->
			<view class="banner" @click="goRece">
				<!-- <view class="banner-cont"> -->
					<view class="ban_top">
						<text>{{$lan('总资产')}}</text>
					</view>
					<view class="ban_mid">

						<!-- {{ item.currencyAmount }} -->
						<text v-for="item in homeList">{{ item.currencyAmount | $formatAmountToKeepSix }}</text>
					</view>
					<view class="ban_bottom">
						<text class="ban_bottom_cont">{{ $toTHAddress(defaultWallet.address) }}</text>
						<view @click="copyData($toTHAddress(defaultWallet.address))">{{$lan('复制')}}</view>
					</view>
				<!-- </view> -->

			</view>
			<!-- 收款，转账 -->
			<view class="banner_bottom">
				<view class="sk" @click="goReceiveMoney">
					<image src="../../static/image/home/icon_sk.png" mode=""></image>
					<text>{{$lan('收款')}}</text>
				</view>
				<view class="zj" @click="goTransfer">
					<image src="../../static/image/home/icon_zj.png" mode=""></image>
					<text>{{$lan('转账')}}</text>
				</view>
			</view>
			<!-- 资产列表 -->
			<view  class="zclbTop">
				<text class=zclb_topTxt>{{$lan('资产列表')}}</text>
				<image class=zclb_topImg src="../../static/image/home/icon_lb.png"></image>
			</view>
				
				<view class="zclb">
				<view class="zclb_box1"  @tap="goTransactionRecord(0)">
					<view class="tkm">
						<view class="tkm_left">
							<image src="../../static/image/home/icon_tkm.png"></image>
							<text>TKM</text>
						</view>
						<view class="tkm_right">
							<view class="t_r_t1">{{ zong |$formatAmountToKeepSix  }}</view>
							<!-- <view class="t_r_t2">-1366.23</view> -->
						</view>
					</view>
					<view class="zcl1">
						<view class="zcl1_cont" v-for="(item,index) in tkmList" :key="index">
							<view class="zcl1_left">
								<image v-if="item.taskChain=='title.trading_chain'" src="../../static/image/home/icon_jll2.png"></image>
								<image v-else-if="item.taskChain=='title.pos_reward_chain'" src="../../static/image/home/icon_jll.png"></image>
								<image v-else src="../../static/image/home/icon_zhl.png"></image>
								<text>{{ item.taskChain | transformChainType }}</text>
							</view>
							<view class="zcl1_right">
								<view class="l_r_t1">{{ item.currencyAmount  |$formatAmountToKeepSix  }}</view>
							</view>
						</view>
					</view>
				</view>
			
			
				
				
			</view>
				<view
					class="zclb_box2"
					v-for="(item,index) in addList"
					:key="index"
					@tap="goTransactionRecord(index+1)"
				>
					<view class="rje">
						<view class="rje_left">
							<image :src="item.iconUrl"></image>
							<text>{{ item.tokenName }}</text>
						</view>
						<view class="rje_right">
							<view class="r_r_t1">{{ item.amount | $toRegularNumber }}</view>
						</view>
					</view>
				</view>
				
				
		</view>

	</view>
</template>

<script>
	import {
		copy
	} from "../../utils/common.js"
	import {
		$formatAmountToFee
	} from "../../filters/index.js"
	import {
		getAddress,
		getAddressList
	} from '@/apis/home.js'
	import CustomBar from "../../components/CustomBar";
	import {
		searchCode
	} from "../../utils/businessCommon";

	import {mapState, mapGetters, mapActions} from 'vuex';
	import
	NoDefaultWallet
	from "../../components/NoDefaultWallet";

	export default {
		data() {
			return {
				homeText: this.$lan('这是首页'),
				data: "", //复制的内容
				accountAddress: "",
				contractAddress: "",
				page: 1,
				rows: 10,
				total: 0,
				// address:"",
				homeList: [],
				tkmList: {},
				sum: 0,
				zong:0,
				addList: [],
				xtoList: [],

				contentText: {
					contentdown: this.$lan('上拉显示更多'),
					contentrefresh: this.$lan('正在加载...'),
					contentnomore: this.$lan('没有更多数据了')
				}
			}
		},
		onShow() {

			if(this.defaultWallet!=''){
				this.page=1
				uni.showLoading({
				        title: '加载中',
				        mask: true,
					});
				this.getHomeDate()
				this.BottomFun()
				}else{
					// console.log("暂无钱包")
					return
				}

			// this.defaultWallet = uni.getStorageSync('defaultWallet')
			// console.log("defaultWallet",this.defaultWallet)

    // uni.setNavigationBarColor({
    //   frontColor: "#ffffff",
    //   backgroundColor: "#ff0000",
    //   animation: {
    //     duration: 400,
    //     timingFunc: "easeIn"
    //   }
    // });

		},
		onReady(){
			// uni.setNavigationBarTitle({
      		// 	title: "新的标题"
    		// });
		},
		computed: {

            ...mapState(['defaultWallet']),
            ...mapGetters(['hasDefaultWallet']),

			totalSumAll() {
				let sum = 0;
				this.dataInfo.map((item) => {
					sum += item.totalSum
				})
				return sum
			},

		},
		onLoad: function (options) {

    },
		 onPullDownRefresh() {

		console.log('下拉刷新11');
		setTimeout(function () {
			// uni.showLoading({
            //         title: '加载中',
            //         mask: true,
			// 	});
			 uni.startPullDownRefresh();
        }, 1000);
		this.getHomeDate()
		this.BottomFun()
    },
		// onPullDownRefresh() {
		// 	console.log('下拉刷新2');
		// 	setTimeout(function () {
		//     uni.stopPullDownRefresh();
		// }, 1000);
		// },

		onReachBottom() {
			if(this.defaultWallet==''){

			}else{
				console.log("触底加载")
			this.BottomFun()
			}
		},


		components: {
			CustomBar,
			NoDefaultWallet,
		},
		methods: {


			BottomFun() {

				if (this.total <= this.addList.length) {
					// if(this.total==0){
					// 	uni.showToast({
					// 	title: this.$lan('暂无数据'),
					// 	duration: 2000
					// });
					// }else{
					// 	uni.showToast({
					// 	title: this.$lan('已是最新'),
					// 	duration: 2000
					// });
					// return
					// }
          		return;

				}
				this.page = 1
				this.page++
				console.log("page3", this.page)
				getAddressList({
					"chainId": 103,
					"accountAddress": this.defaultWallet.address,
					"contractAddress": "",
					"page": this.page,
					"rows": this.rows
				}).then(res => {
					this.page = 1
					// this.addList = res.data.data;
					console.log("page1", this.page)

					this.addList = this.addList.concat(res.data.data)

					// for(var i=res.data.data.length;i<res.data.data.total;i++){
					// xtoList =this.xtoList.concat(res.data.data[i-1]);//将数据拼接在一起
					// }
					console.log("首页xto数据", res.data)
				});
			},
			goTransactionRecord(tokenType){
				uni.navigateTo({
					url: `/pages/transaction/transactionRecord?tokenType=${tokenType}`
				})
			},
			getHomeDate() {
				this.page=1
				//首页banner区的数据
				getAddress({
					address: this.defaultWallet.address
				}).then(res => {

				 uni.hideLoading();
					this.homeList = res;
					this.data = res.data.address
					this.tkmList = res.data.taskChains
					let len = res.data.taskChains.length
					let numArr = []
					// let zong = 0
					// console.log("00000000000000",len)
					for (let i = 0; i < len; i++) {
						let num = Number(res.data.taskChains[i].currencyAmount)
						numArr.push(num)
						// console.log("iii", i, num)
						// console.log("11iii",i, numArr)
					}
					// console.log("数组",numArr)
					 this.zong = numArr.reduce(function(accumulator, currentValue, currentIndex, array){
							  return  accumulator + currentValue;
						});
						// console.log("总数",this.zong)
					// this.sum = Number(num) + Number(this.sum)
					// console.log("每个数", typeof(this.sum),this.sum)
					// console.log("111sum", this.sum)
					// console.log("首页banner数据", res)
					// console.log("首页TKM数据", res.data.taskChains)
				}).catch(() => {
					uni.hideLoading()
				});
				//资产列表下的数据
				getAddressList({
					"chainId": 103,
					"accountAddress": this.defaultWallet.address,
					"contractAddress": "",
					"page": this.page,
					"rows": this.rows
				}).then(res => {
					this.page=1
					this.addList = res.data.data;
					this.total = res.data.total
					console.log("page2", this.page)

					console.log("111首页xto数据", res.data)
				});
			},
			copyData(data) {
				copy(data)
				uni.showToast({
					title: this.$lan('复制成功'),
					icon: 'none',
					duration: 2000
				});

			},
			goRece() {
				// pages/home/receiveMoney
			},
			goReceiveMoney() {
				uni.navigateTo({
					url: `/pages/transaction/receiveMoney`
				})
			},
			goTransfer() {
				uni.navigateTo({
					url: `/pages/transaction/transfer`
				})
			},
			searchCode() {
				searchCode();
			},
			toWalletManage() {
				uni.navigateTo({
					url: '/pages/wallet/walletManagement'
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	*{
		box-sizing: border-box;
	}
	.home-container {
		min-height: 1624rpx;
		overflow-y: auto;
		background-color: #FBFBFB;
		display: flex;
		font-family: PingFang SC;
		flex-direction: column;

		.home-cont {
			min-height: 1624rpx;
			overflow-y: auto;
			background-color: #FBFBFB;
			display: flex;
			font-family: PingFang SC;
			flex-direction: column;
		}

		//头部
		.h_top {
			width: 704rpx;
			margin:0 22rpx;
			height: 74rpx;
			margin-top: 36rpx;
			margin-bottom: 46rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.top_right {
				width: 36rpx;
				height: 36rpx;
				margin-right: 11rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				background-color: #FFFFFF;

				image {
					width: 35rpx;
					height: 35rpx;
				}
			}
			.top_left {
				margin-left: 22rpx;
				width: 266rpx;
				height: 74rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #FFFFFF;
				border-radius: 37rpx;
				box-shadow: 0px 3rpx 10rpx 0px rgba(185, 196, 231, 0.3);
				.top_left_top{
					width:100%;
					margin: 0 39rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					.left_img {
						// width: 28%;
						display: flex;
						justify-content: center;
						align-items: center;

						image {
							width: 22rpx;
							height: 32rpx;
						}
					}

					.left_text {
						width: 144rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;

						text {
							
							
							// height: 20rpx;
							// line-height: 20rpx;
							// margin-left: -12rpx;
							// display: flex;
							
							padding-left: 21rpx;
							// text-align: left;
							white-space:nowrap;
							overflow:hidden;
							text-overflow:ellipsis;
						}
					}
				}


			}

			
		}

		//总资产模块
		.banner {
			width: 704rpx;
			height: 363rpx;
			margin: 0 auto;
			border-radius: 28rpx;
			background-image: url(../../static/image/home/home_banner.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			color: #FFFFFF;

			// .banner-cont {
			// 	width: 704rpx;
			// height: 363rpx;
			// margin: 0 auto;
				.ban_top {
					// width:100%;
					padding-left: 60rpx;
					line-height: 31rpx;
					font-size: 32rpx;
					// margin: 0 60rpx;
					margin-top: 66rpx;
					margin-bottom: 60rpx;
				}

				.ban_mid {
					padding-left: 60rpx;
					font-size: 60rpx;
					line-height: 45rpx;
					// color: #000000;
					margin: 0 auto;
					// margin-bottom: 63rpx;
				}

				.ban_bottom {
					padding-left: 60rpx;
					// margin: 0 auto;
					margin-top: 63rpx;
					line-height: 36rpx;
					// margin-bottom: 73rpx;
					display: flex;
					// justify-content: space-between;
					align-items: center;

					view {
						width: 95rpx;
						height: 36rpx;
						font-size: 22rpx;
						display: flex;
					justify-content: center;
					align-items: center;
						// text-align: center;

						line-height: 21rpx;
						border-radius: 18rpx;
						margin-left: 40rpx;
						border: 1px solid #ffffff;
						background: rgba(192, 223, 255, 0.2);
					}

					.ban_bottom_cont {
						// width: 90%;
						width: 451rpx;
						font-size: 24rpx;
						overflow: hidden;
						white-space: nowrap; //取消自动换行
						text-overflow: ellipsis;

					}
				}
			// }

		}

		// 收款，转账
		.banner_bottom {
			width: 704rpx;
			margin: 0rpx 22rpx;
			// padding: 0rpx 22rpx;
			margin-top: 33rpx;
			margin-bottom:55rpx ;
			font-size: 30rpx;
			height: 100rpx;
			display: flex;
			color: #333333;		
			font-weight: 500;
			// justify-content: space-between;

			.sk {
				width: 320rpx;
				height: 100rpx;
				margin-left: 10rpx;
				margin-right: 46rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-sizing: border-box;
				box-shadow: 0px 3rpx 10rpx 0px rgba(185, 196, 231, 0.3);
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 50rpx;
					height: 37rpx;
					margin-right: 33rpx;
				}
			}

			.zj {
				width: 320rpx;
				height: 100rpx;
				margin-right: 8rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-sizing: content-box;
				box-shadow: 0px 3rpx 10rpx 0px rgba(185, 196, 231, 0.3);
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 50rpx;
					height: 37rpx;
					margin-right: 24rpx;
				}
			}

		}

		// 资产列表
		.zclbTop{
			width: 686rpx;
			margin: 0rpx 32rpx;
			margin-bottom: 35rpx;
			line-height: 35rpx;
			.zclb_topTxt {
				font-size: 36rpx; 
				font-weight: bold;;
				// margin-bottom: 35rpx;
				color: #555555;
			}

			.zclb_topImg {
				width: 20rpx;
				height: 23rpx;
				margin-left: 26rpx;
				// margin: 6rpx 0rpx 6rpx 26rpx;
			}

		}
		.zclb {
			width: 686rpx;
			margin: 0rpx 32rpx;
			overflow: auto;
			background-color: #FFFFFF;
			// margin-top: 56rpx;
			margin-bottom: 20rpx;
			// display: flex;
			// justify-content: flex-start;
			// align-items: center;
			// box-shadow: 0px 3rpx 10rpx 0rpx rgba(185, 196, 231, 0.3);
			border-radius: 10rpx;
			box-shadow: 0px 3rpx 10rpx 0px rgba(185, 196, 231, 0.3);
			
			.zclb_box1 {
				width: 100%;
				min-height: 402rpx;
				// margin: 0 auto;
				// margin-top: 35rpx;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				box-sizing: content-box;
				margin-bottom: 20rpx;
				// box-shadow: 0px 3rpx 10rpx 0rpx rgba(185, 196, 231, 0.3);
			}

			.tkm {
				// width: 100%;
				margin: 0 39rpx 48rpx 45rpx;
				// padding-top: 47rpx;
				background-color: #FFFFFF;
				// margin-bottom: 37rpx;
				padding: 47rpx 0rpx 37rpx 0rpx;
				// height: 70rpx;
				line-height: 50rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #DEDEDE;
				

				.tkm_left {
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 34rpx;
						color: #333333;	
						font-weight: bold;
						font-family: PingFang SC;
						// font-weight: 700;
					}

					image {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}

				.tkm_right {
					.t_r_t1 {
						font-size: 30rpx;
						font-weight: 500;
						text-align: end;
						color: #333333;
					}

					.t_r_t2 {
						font-size: 20rpx;
						text-align: end;
						color: #999999;
					}
				}

			}

			.zcl1 {
				width: 100%;
				// min-height: 266rpx;
				margin-bottom: 20rpx;
				// margin: 0 45rpx 0 39rpx;
				// padding-bottom: 33rpx;
				height: 70rpx;
				

				.zcl1_cont {
					// width: 100%;
					// height: 100%;
					line-height: 31rpx;
					padding: 0 46rpx 50rpx 42rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.zcl1_left {
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 30rpx;
						font-weight: 400;
						color: #666666;

					}

					image {
						width: 34rpx;
						height: 34rpx;
						margin-right: 34rpx;
					}
				}

				.zcl1_right {
					.l_r_t1 {
						font-size: 30rpx;
						font-weight: 400;
						color: #666666;
					}
				}
			}

			

		}
		.zclb_box2 {
				// width: 100%;
				width: 686rpx;
				margin: 0rpx 32rpx;
				height: 140rpx;
				// margin: 20rpx auto;
				// margin-bottom: 20rpx;
				background-color: #FFFFFF;
				box-sizing: content-box;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 10rpx;
				box-shadow: 0px 3rpx 10rpx 0px rgba(185, 196, 231, 0.3);

				.rje {
					width: 100%;
					// padding: 47rpx 45rpx 44rpx 41rpx;
					margin: 46rpx 45rpx 44rpx 41rpx;
					line-height: 50rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #FFFFFF;
					border-radius: 10rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.rje_left {
						display: flex;
						justify-content: space-between;
						align-items: center;
						text {
							font-size: 34rpx;
						color: #333333;	
						font-weight: bold;
						font-family: PingFang SC;
							// font-weight: 700;
						}
						image {
							width: 50rpx;
							height: 50rpx;
							margin-right: 20rpx;
						}
					}
					.rje_right {
						.r_r_t1 {
							font-size: 30rpx;
							font-weight: 500;
							color: #333333;
							text-align: end;
						}
						.r_r_t2 {
							font-size: 20rpx;
							color: #999999;
							text-align: end;
						}
					}
				}
			}
	}
</style>
