<template>
	<view class="forsageHome">
		<!-- <CustomBar class="topBar" :styles="{background: '#fff'}"/> -->
		<!-- <view></view> -->
		<!-- <text></text> -->
		<view class="homeTop">
			<image src="../../static/image/forsage/homeTop.png"></image>
			<view class="topText">
				<image src="../../static/image/forsage/homeImg1.png"></image>
			</view>
			<view class="topIcon">
				<appNavigation />
			</view>

			<view class="topYuan">

			</view>

		</view>
		<view class="top">
			<!-- <view class="topThe">
				<view class="topText">THE WORLD'S FIRST</view>
				<view class="topBorder"></view>
			</view>
			<view class="midThe">
				<view class="midText">100% DECENTRALIZED</view>
				<view style="margin-top:19rpx;" class="midText">MATRIX PLATFOEM</view>
			</view> -->
			<view class="botThe">
				<view style="margin-right:8px;" class="botTextLeft">{{usersPlaying}}</view>
				<view class="botTextRight"> people are participating in the game</view>
			</view>
		</view>
		<view class="homeButton">
			<image src="../../static/image/forsage/homeButton.png" @click="startGame"></image>
			<view class="buttonYuan">

			</view>
		</view>
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="popupsCenter">
				<view class="popupCenter">
					<view class="center_title">
						<image src="../../static/image/forsage/popupTitle.png"></image>
					</view>
					<view class="center_content">
						Forsage is asking for your wallet address,confirm to make your wallet address public to this site?
					</view>
					<view class="center_button">
						<view class="rejectBtn" @click="reject">Reject</view>
						<view class="confirmBtn" @click="confirm">confirm</view>
					</view>
				</view>


			</view>
		</uni-popup> -->
		<view class="homeNums">
			<view class="homeNum homeNumL">
				<view class="homeTotal">Total accounts</view>
				<view class="homeNumBottomLeft">
					<text class="homeTotalNum">{{totalAccounts}}</text>
					<text class="homeTotalTkm">TKM</text>
				</view>
			</view>
			<view class="homeNum homeNumR">
				<view class="homeTotal">New per day</view>
				<view class="homeNumBottomRight">
					<text class="homeTotalNum">{{newPerDay}}</text>
					<text class="homeTotalTkm">TKM</text>
				</view>
			</view>

		</view>
		<view class="homeExplain">
			<view class="homeExplainTitle">
				<view class="titleTop">
					<view class="titleTopText">COMMISSION PAYOUT SYSTEM
						<view class="explainYuan titleTopYuan"></view>
					</view>
					<view class="titleTopBorder"></view>

				</view>
				<view class="titlebottom">
					<view class="titlebottomText"> X3 AND X4 PARTNER INCOME EXPLAINED
						<view class="explainYuan titlebottomYuan"></view>
					</view>

				</view>
			</view>
			<view class="homeExplainRuleX3">
				<image src="../../static/image/forsage/x3.png"></image>
				<!-- <view  class="homeExplainRuleBorder">
                    <view  class="homeExplainRuleX3Title">
                        FORSAGE X3
                    </view>
                </view> -->
			</view>
			<view class="homeExplainRuleX4">
				<image src="../../static/image/forsage/x4.png"></image>
				<view class="explainYuan homeExplainRuleYuan">

				</view>
				<!-- <view  class="homeExplainRuleBorder">
                    <view  class="homeExplainRuleX3Title">
                        FORSAGE X3
                    </view>
                </view> -->
			</view>
		</view>
		<view style="margin-top:100rpx;margin-bottom:40rpx;" class="homeButton">
			<image src="../../static/image/forsage/homeButton.png" @click="startGame"></image>
			<view class="buttonYuan ExplainButtonYuan">

			</view>
		</view>
		<view class="homeBottom">
			<image src="../../static/image/forsage/homeBottom.png"></image>
		</view>

		<forsagePopup ref="forsagePopup" :homeForsageAddress="homeForsageAddress" />
		<!-- <PasswordPopup ref="passwordPopup" /> -->
		<TransferLoading ref="TransferLoading" />


	</view>
</template>
<script>
	import appNavigation from '@/components/appNavigation'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import forsagePopup from "../../components/forsagePopup";
	// import PasswordPopup from "@/components/PasswordPopup";
	import CustomBar from "../../components/CustomBar";
	import NoDefaultWallet from "../../components/NoDefaultWallet";
	import {aboutWallet,getTransactionResultByHashCircularly} from "../../utils/businessCommon";
	import TransferLoading from "../../components/TransferLoading";
	import {mapState,mapGetters,mapActions} from 'vuex';
	import walletApi from "../../apis/walletApi";
	import _ from 'lodash'
	import { ChainIdEnum } from '@/utils/data/enums'
	const SmartMatrixForsageAbi = require('../../utils/abis/SmartMatrixForsage');
	const forsageChainId = ChainIdEnum.ACCOUNT_CHAIN;
	export default {

		data() {
			return {
				usersPlaying: 12358,
				totalAccounts: 2051386,
				newPerDay: 1201,
				forsageContractAddress: "0x7a0df03a751a84c64563ca50d5722380328d38b1",
				// forsageAddress:0xc1ec694522bf577775c6e704f0ad479dba0ad436,
				forsageAddress: '',
				forsageModel: false,
				isRegistered: false,
				nonce: '',
				encoded: '',
				obj: {},
				signdata: {},
				homeForsageAddress: ''
			};
		},
		onShow() {

		},
		mounted() {
			window.addEventListener("message", this.getSigndata, false);
		},
		onReady() {

		},
		onLoad(data) {
			if (!this.forsageAddress) {
				//向app发送消息
				console.log("向app请求钱包地址")
				window.parent.postMessage({
					action: 'Request wallet address',
					data: {
						obj: 'Request wallet address',
						type: 'request'
					},
				}, "*");
				console.log("向app请求成功")
				window.addEventListener("message", this.agreeRequest, false);
				setTimeout(()=>{
					window.addEventListener("message", this.getAddress, false);
				},3000)
			}else{
				console.log("已有地址")
				window.addEventListener("message", this.getAddress, false);
			}
				
			

			// window.addEventListener("message", this.getAddress, false);

			// setTimeout(() => {
			// if (!this.forsageAddress) {
			// 	console.log("66666data", getQuery(data));
			// 	this.forsageAddress = data.data
			// 	console.log("接受到地址111", this.forsageAddress)
			// 	function getQuery(name) {
			// 	console.log("22222", name)
			// 	return name;
			// }


			// 	this.getPeopleAreParticipatingInTheGame()
			// 	this.getSignParams()
			// 	this.getAccount()
			// }
			// //取url中的参数值

			// 	}, 2000)

			// if (option.src) this.src = option.src;
		},

		computed: {
			...mapState(['defaultWallet', '_contractAddress']),
			...mapGetters(["hasDefaultWallet"])
		},
		components: {
			CustomBar,
			NoDefaultWallet,
			forsagePopup,
			// PasswordPopup,
			appNavigation,
			TransferLoading

		},
		methods: {
			getAddress(event) {
				console.log("---address数据接收到", event.data.address);
				this.forsageAddress = event.data.address || ''
				setTimeout(()=>{
					this.getPeopleAreParticipatingInTheGame()
				},1000)
				

			},
			agreeRequest(e) {
				console.log("发送请求经过同意", e);
			},
			//点击开始游戏按钮，弹出弹框
			async startGame() {

				//判断用户是否注册
				// console.log("1111")
				let param = {
					contractAbi: SmartMatrixForsageAbi,
					contractAddress: this.forsageContractAddress,
					address: this.forsageAddress,
					chainId: forsageChainId
				};
				// console.log("111122222")
				const contractObj = await walletApi.ethCallContract(param);
				// console.log("11112222233333")
				;
				// console.log("1111222223333344444")
				this.isRegistered = await contractObj.isUserExists(this.forsageAddress)
				let owner = await contractObj.owner(this.forsageAddress)
				console.log('用户是否已经注册', this.isRegistered);
				console.log('用户是否已经查询', owner);
				// console.log("111122222333334444455555")
				// 如果未注册则弹出弹窗，确认之后进入到注册输入邀请码
				if (!this.isRegistered) {
					console.log("未注册哟", this.forsageAddress)
					this.$refs.forsagePopup.showforsagePopup()
					this.homeForsageAddress = this.forsageAddress
					console.log("接受到地址", this.homeForsageAddress)
					// 如果已经注册则进入到游戏板块
				} else {
					console.log("已经注册可以开始游戏了", this.forsageAddress)
					// setTimeout(()=>{
					// this.$refs.forsagePopup.open()

					uni.navigateTo({
						url: '/pages/forsage/registered?dataItem=' + this.forsageAddress
					})

					// },3000)
					// this.$refs.forsagePopup.closeforsagePopup()
				}
			},
			async getSignParams() {

				this.nonce = await walletApi.ethGetNonce( this.$enums.ChainIdEnum.ACCOUNT_CHAIN,this.forsageAddress)
				console.log("000000000000this.nonce", this.nonce)

			},
			async getAccount() {
				let account = await walletApi.getAccount(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.forsageAddress);
				console.log('account', account);
			},

			// 查看有多少人在玩该游戏
			async getPeopleAreParticipatingInTheGame() {
				// console.log("2222")
				let params = {
					contractAbi: SmartMatrixForsageAbi,
					contractAddress: this.forsageContractAddress,
					address: this.forsageAddress,
					chainId: forsageChainId
				};
				// console.log("3333")
				const contractObj = await walletApi.ethCallContract(params);
				// console.log("333344")
				;
				// console.log("33335555home数据", contractObj)

				this.usersPlaying = await contractObj.usercount();
				this.totalAccounts = await contractObj.totalValue()
				//  var nowDate = parseFloat((new Date().getTime())/1000)
				console.log("33336666")
				let timestamp = Date.parse(new Date());
				timestamp = timestamp / 1000;
				let timestamp1 = Number(timestamp - timestamp % 86400)
				console.log("33336666Time", timestamp, timestamp1)
				this.newPerDay = await contractObj.newPerDay(timestamp1)
				// console.log("33337777")
				// console.log('正在参与的玩家', this.usersPlaying);
				// console.log('总金额', this.totalAccounts);
				// console.log('今日新增', this.newPerDay);
				return this.usersPlaying;
			},
		}
	}
</script>

<style scoped lang="scss">
	.forsageHome {
		width: 750rpx;

		.homeTop {
			width: 100%;
			height: 387rpx;
			margin-bottom: 45rpx;
			position: relative;

			image {
				width: 358rpx;
				height: 349rpx;
				// margin-left: 285rpx;
			}

			.topIcon {
				position: absolute;
				top: 123rpx;
				left: 661rpx;
			}

			.topText {
				position: absolute;
				top: 289rpx;
				left: 107rpx;
				width: 100%;

				// margin: 0 auto;
				// text-align: center;
				image {
					width: 537rpx;
					height: 60rpx;
				}

				// font-size: 90rpx;

				// font-family: yixinzhanjiahei;
				// font-weight: 900;
				// font-style: italic;
				// color: #FFFFFF;
				// line-height: 58rpx;

				// background: linear-gradient(0deg, #F8D9AD 0.146484375%, #D6A364 100%);
				// -webkit-background-clip: text;
				// -webkit-text-fill-color: transparent;

			}

			.topYuan {
				position: absolute;
				top: 372rpx;
				left: 68rpx;
				bottom: 18rpx;
				width: 6rpx;
				height: 6rpx;
				background: linear-gradient(90deg, #F8D9AD, #D6A364);
				border-radius: 50%;
				box-shadow: 1rpx 1rpx 10rpx 1rpx #F8D9AD;
				//                 image{
				// width: 5rpx;
				// 				height: 5rpx;
				//                 }
			}
		}

		.top {
			margin: 0 auto;
			margin-bottom: 100rpx;
			width: 690rpx;
			height: 400rpx;
			background-image: url(../../static/image/forsage/homeTopImg1.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			// background: linear-gradient(90deg, #303145, #44495E);
			// box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);
			// border-radius: 30rpx;

			// .topThe {
			// 	width: 100%;
			// 	margin: 0 auto;
			// 	padding-bottom: 72rpx;

			// 	.topText {
			// 		margin: 0 auto;
			// 		padding-top: 70rpx;
			// 		width: 437rpx;
			// 		text-align: center;
			// 		height: 30rpx;
			// 		font-size: 40rpx;
			// 		font-family: PingFang SC;
			// 		font-weight: 400;
			// 		color: #F3CF9E;
			// 		line-height: 36rpx;
			// 	}

			// 	.topBorder {
			// 		margin: 0 auto;
			// 		width: 328rpx;
			// 		height: 14rpx;
			// 		background: #252531;
			// 		border-radius: 5rpx;
			// 	}
			// }

			// .midThe {
			// 	width: 100%;
			// 	margin: 0 auto;
			// 	padding-bottom: 78rpx;

			// 	.midText {
			// 		width: 437rpx;

			// 		text-align: center;
			// 		margin: 0 auto;
			// 		height: 32rpx;
			// 		font-size: 36rpx;
			// 		font-family: eryakuheiti;
			// 		font-weight: 400;
			// 		color: #F3CF9E;
			// 		line-height: 36rpx;
			// 	}
			// }

			.botThe {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 90%;
				margin: 0 auto;
				padding-top: 332rpx;
				padding-bottom: 34rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #CF9B5A;
				line-height: 36rpx;

				.botTextRight {

					// width: 342rpx;
					color: #F8EDDE;
				}
			}

		}

		.homeButton {

			position: relative;
			text-align: center;
			margin: 0 auto;
			width: 508rpx;
			height: 100rpx;

			image {
				width: 508rpx;
				height: 100rpx;
			}

			// background: linear-gradient(90deg, #F8D9AD, #E9B87A);
			// border-radius: 50rpx;
			// font-size: 44rpx;
			// font-family: eryakuheiti;
			// font-weight: 800;
			// color: #373A4E;
			// line-height: 100rpx;

			.buttonYuan {
				position: absolute;
				bottom: 117rpx;
				right: 15rpx;
				left: 476rpx;
				width: 12rpx;
				height: 12rpx;
				background: linear-gradient(90deg, #D6A364, #F8D9AD);
				border-radius: 50%;
				box-shadow: 1rpx 1rpx 20rpx 1rpx #F8D9AD;
			}

			.ExplainButtonYuan {
				width: 10rpx;
				height: 10rpx;
				bottom: -31rpx;
				left: 486rpx;
			}
		}

		.homeNums {
			// width: 100%;
			display: flex;
			// align-items: center;
			justify-content: space-between;

			margin: 110rpx auto;
			width: 750rpx;
			height: 136rpx;
			background: linear-gradient(90deg, #303145, #44495E);
			box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);

			.homeNum {
				margin-top: 22rpx;

				.homeTotal {
					display: flex;
					// width: 100%;
					margin: 0 auto;
					align-items: center;
					justify-content: center;
					height: 19rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F8F1E9;
					line-height: 19rpx;
				}

				.homeNumBottomLeft,
				.homeNumBottomRight {
					display: flex;
					// width: 100%;
					// margin: 0 auto;
					align-items: center;
					// justify-content:center;
					margin-top: 33rpx;

					.homeTotalNum {
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						margin-right: 17rpx;
						width: 187rpx;
						height: 39rpx;
						font-size: 36rpx;
						font-family: eryakuheiti;
						font-weight: 400;
						color: #F3CF9E;
						line-height: 39rpx;
					}

					.homeTotalTkm {
						// width: 53rpx;
						height: 19rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #F8F1E9;
						line-height: 20rpx;
					}
				}
			}

			.homeNumR {
				margin-right: 92rpx;
			}

			.homeNumL {
				margin-left: 57rpx;
			}
		}

		.homeExplain {
			width: 100%;
			margin: 0 auto;
			margin-bottom: 50rpx;

			.explainYuan {
				position: absolute;
				background: linear-gradient(90deg, #D6A364, #F8D9AD);
				border-radius: 50%;
				box-shadow: 1rpx 1rpx 20rpx 1rpx #F8D9AD;
			}

			.homeExplainTitle {
				width: 100%;
				margin: 0 auto;
				text-align: center;

				.titleTop {
					margin: 0 auto;

					.titleTopText {
						position: relative;
						// width: 627rpx;
						height: 30rpx;
						font-size: 40rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #F3CF9E;
						line-height: 36rpx;

						.titleTopYuan {
							width: 6rpx;
							height: 6rpx;
							top: -32rpx;
							left: 698rpx;
						}
					}

					.titleTopBorder {
						margin: 0 auto;
						width: 328rpx;
						height: 14rpx;
						background: #3D4055;
						border-radius: 5rpx;
						margin-bottom: 23rpx;
					}

				}

				.titlebottom {
					.titlebottomText {
						position: relative;
						height: 23rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #F3CF9E;
						line-height: 30rpx;

						.titlebottomYuan {
							width: 10rpx;
							height: 10rpx;
							top: -4rpx;
							left: 50rpx;
						}
					}
				}
			}

			.homeExplainRuleX3,
			.homeExplainRuleX4 {
				// display: flex;
				// justify-content: center;
				// align-items: center;
				// margin: 50rpx auto;
				width: 690rpx;
				height: 667rpx;
				margin: 50rpx auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.homeExplainRuleX4 {
				width: 690rpx;
				height: 778rpx;
				margin: 0 auto;
				position: relative;

				.homeExplainRuleYuan {
					width: 12rpx;
					height: 12rpx;
					top: 334rpx;
					left: -24rpx;
				}
			}
		}

		.homeBottom {
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 348rpx;
				height: 187rpx;
				margin: 0 auto;
				margin-bottom: 27rpx;
			}
		}

		.popupsCenter {
			margin: 0 auto;
			width: 690rpx;
			height: 499rpx;
			background: #FFFFFF;
			border-radius: 30px 30px 0 0;

			.center_title {
				margin: 0 auto;
				margin-left: 169rpx;
				padding-top: 48rpx;
				padding-bottom: 27rpx;

				image {

					width: 350rpx;
					height: 66rpx;
					margin: 0 auto;
				}

			}

			.center_content {
				margin: 0 auto;
				width: 645rpx;
				height: 75rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #3F3D39;
				line-height: 48rpx;
				padding-bottom: 103rpx;
			}

			.center_button {
				width: 100%;
				height: 100rpx;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #ffffff;

				.rejectBtn {
					text-align: center;
					line-height: 91rpx;
					width: 281rpx;
					height: 91rpx;
					font-size: 40rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #243FFF;
					// line-height: 36px;
					border: 1px solid #243FFF;
					border-radius: 10px;
					margin-left: 30rpx;
				}

				.confirmBtn {
					text-align: center;
					line-height: 90rpx;
					width: 280rpx;
					height: 90rpx;
					background: #243FFF;
					border-radius: 10px;
					font-size: 42rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FEFEFF;
					margin-right: 30rpx;
				}
			}
		}

	}
</style>
