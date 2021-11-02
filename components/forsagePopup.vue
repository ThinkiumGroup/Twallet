<template>
	<!-- <view></view> -->
	<UniPopup ref="forsagePopup" type="center" @click.self="closeforsagePopup">
		<!-- :maskClick="maskClick" -->
		<view class="forsage-popup">
			<view class="forsage-popup-container">
				<view class="forsage-popup-title">
					<view class="titleTop">
						<view class="titleTopText">

							<view>UNREGISTERED</view>
						</view>
						<view class="titleTopBorder"></view>
					</view>
					<view class="titleBottom">
						The specified user is not registered in the project, in case of an error, please contact.
					</view>
				</view>

			</view>
			<view class="forsage-popup-footer">
				<view class="forsage-popup-input">
					<input type="text" style="
font-size: 24rpx;
font-family: PingFang SC;
font-weight: 400;
color: #F3E4CF;
line-height: 40rpx;
opacity: 0.36;"
					 maxlength="50" :placeholder="placeholder" v-model="invitationCode">
				</view>
				<view class="forsage-popup-btn" id="testdiv" @click="submit">

				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :mask-click="false">
			<view class="popupsCenter">
				<view class="popupCenter">
					<view class="center_title">
						<image src="../static/image/forsage/popupTitle.png"></image>
					</view>
					<view class="center_content">
						Forsage is asking for your private key signature payment function for transaction?
					</view>
					<view class="center_button">
						<view class="rejectBtn" @click="reject">Reject</view>
						<view class="confirmBtn" @click="confirm">confirm</view>
					</view>
				</view>


			</view>
		</uni-popup>
		<PasswordPopup ref="passwordPopup" />
		<TransferLoading ref="TransferLoading"/>
	</UniPopup>

	<!-- <UniPopup ref="forsagePopup" type="center" @click.self="closeforsagePopup" :maskClick="maskClick">
		<view class="forsage-popup-container">
			<view class="forsage-popup-title">{{title}}</view>
			<view class="forsage-popup-input">
				<input type="password" :placeholder="placeholder" v-model="password">
			</view>
			<view class="forsage-popup-footer">
				<view
					v-if="isCancel"
					class="forsage-popup-btn"
					style="border-right: 1px solid #ddd;"
					@click="cancel"
				>
					{{cancelText}}
				</view>
				<view
					class="forsage-popup-btn"
					style="color: #243FFF"
					@click="saveSubmit"
				>
					{{sureText}}
				</view>
			</view>
		</view>
	</UniPopup> -->
</template>

<script>
	// type="text/javascript" src="https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js"
	import UniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {aboutWallet, getTransactionResultByHashCircularly} from "@/utils/businessCommon"
	// import {mapState,mapGetters,mapActions} from 'vuex';
	import PasswordPopup from "@/components/PasswordPopup";
	import CustomBar from "@/components/CustomBar";
	import NoDefaultWallet from "@/components/NoDefaultWallet";
	// import {mapState, mapGetters, mapActions} from 'vuex';
	import walletApi from "@/apis/walletApi";
	import TransferLoading from "@/components/TransferLoading";
	import _ from 'lodash'
	import { ChainIdEnum } from '@/utils/data/enums'
	const SmartMatrixForsageAbi = require('@/utils/abis/SmartMatrixForsage');
	const forsageChainId = ChainIdEnum.ACCOUNT_CHAIN;
	const gasFee = 1;
	import {
		mapState,
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				forsageContractAddress: "0x7a0df03a751a84c64563ca50d5722380328d38b1",
				// forsageAddress:0xc1ec694522bf577775c6e704f0ad479dba0ad436,
				forsageAddress: '',
				forsageModel: false,
				nonce: '',
				encoded: '',
				obj: {},
				signdata: {},
			};
		},
		props: {
			title: {
				type: String,
				default: 'Please enter address of your inviter...'
			},
			placeholder: {
				type: String,
				default: 'Please enter address of your inviter...'
			},
			cancelText: {
				type: String,
				default: 'cancel'
			},
			isCancel: {
				type: Boolean,
				default: true
			},
			maskClick: {
				type: Boolean,
				default: true
			},
			sureText: {
				type: String,
				default: 'sure'
			},
			homeForsageAddress: {
				type: String,
				default: ''
			}
		},
		components: {
			UniPopup,
			PasswordPopup,
			TransferLoading
		},
		data() {
			return {
				invitationCode: '',
				forsageContractAddress: "0x7a0df03a751a84c64563ca50d5722380328d38b1",
				// forsageAddress:0xc1ec694522bf577775c6e704f0ad479dba0ad436,
				forsageAddress: '',
				cost: 0.05,
				balance:0,
				nonce: '',
				encoded: '',
				obj: {},
				signdata: {},
				// referrerAddress:''
			}
		},
		onShow(){
			
		// 	let signdata = uni.getStorageSync('signParams');//取数据
		// console.log("-----------signdata",signdata)
		},
		mounted() {
			window.addEventListener("message", this.getSigndata, false);
		},
		onLoad() {
			this.homeForsageAddress = this.forsageAddress
			this.getAccount()
			this.getSignParams()
			
			// window.addEventListener("message", this.getAddress, false);
			// console.log("6666677data", getQuery(data));
			// if (!this.homeForsageAddress) {
			// 	this.homeForsageAddress = data.data
			// }
			// console.log("555577this")
			// //取url中的参数值
			// function getQuery(name) {
			// 	console.log("2222277", name.data)

			// 	return name;
			// }
		},

		computed: {
			...mapState(['defaultWallet']),
		},

		// 在使用到的页面 添加如下代码
		
		methods: {
			showforsagePopup({
				cancel,
				success,
				fail
			} = {}) {
				if (cancel) this.a_success = success;
				if (success) this.a_cancel = cancel;
				if (fail) this.a_fail = fail;
				this.$refs.forsagePopup.open();
			},
			// showforsagePopup() {
			// 	this.$refs.forsagePopup.open();
			// },
			closeforsagePopup() {
				this.$refs.forsagePopup.close()
				this.invitationCode = ''
			},
			async submit() {
				console.log("邀请码",this.invitationCode)
				// console.log("16邀请码",this.to_16_decimal(this.invitationCode))
				
				//推荐人地址不为空
				if (!this.invitationCode.trim()) {
					uni.showToast({
						title: 'Please enter address of your inviter...',
						icon: "none"
					})
					this.invitationCode = ''
					return false
				}
				// //推荐人地址填写正确
				if (!this.isTHAddress(this.invitationCode.trim())) {
					uni.showToast({
						title: 'Incorrect recommender address entered',
						icon: "none"
					})
					this.invitationCode = ''
					return false
				}
				this.invitationCode = this.to_16_decimal(this.invitationCode)
				console.log("1234566666",this.invitationCode)
				this.$refs.popup.open()
				this.forsageModel = true;
				console.log("123456",this.homeForsageAddress)
				console.log("22221111")
			},
		
			reject() {
				uni.showToast({
	                title: "Access has been denied and you will not be able to access the game",
	                icon: "none",
	                // position: 'bottom'
              })
				
			},
			 async confirm() {
				console.log("确认")
				
				this.nonce = await walletApi.ethGetNonce(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.homeForsageAddress);
				const balance = await walletApi.getAccount(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.homeForsageAddress)
				this.balance = aboutWallet.toRegularNumber(balance)
				this.nonce = this.nonce.nonce
				console.log("000000000000this.nonce", this.nonce)
				console.log("000000000000this.balance",this.balance)
				console.log("000000000000this.gasFee",gasFee)
				console.log("000000000000this.xCost",this.cost)
				if ((gasFee + this.cost) > this.balance) {
						uni.showToast({
								title: 'The account balance is insufficient！',
								duration: 2000,
								icon: "none"
							})
							return false
					}
				// this.encoded = walletApi.simpleEncode("pledge()")
				// this.encoded = walletApi.simpleEncode("buyNewLevel(address,uint8):(address)",this.forsageAddress,this.xIndex);
				console.log("邀请人地址",this.invitationCode)
				this.encoded = walletApi.simpleEncode("registrationExt(address)",this.invitationCode);
				// this.encoded = walletApi.simpleEncode("registrationExt(uint8,uint8):(uint8,uint8)",this.cost, this.invitationCode);
				console.log("this.encoded",this.encoded)
				this.obj = {
					chainId: forsageChainId,
					fromChainId: forsageChainId,
					toChainId: forsageChainId,
					from: this.homeForsageAddress,
					to: this.forsageContractAddress, //合约地址
					nonce: this.nonce.toString(),
					value: '50000000000000000',
					input: '0x' + this.encoded.toString("hex"),
					extra: '',
				};
				//向app发送消息
				console.log("调用uni.postMessage，开始发送",this.obj)
				window.parent.postMessage({
					action: 'postMessage hh',
					data: {
						obj: this.obj,
						type: 'toSign'
					},
				}, "*");
				//   window.postMessage({
				//     data: {
				//       action: 'postMessage hh'
				//     }
				//   });

				console.log("22221111")

				// setTimeout(() => {

				// 	// this.$refs.forsagePopup.open()
				// 	this.$refs.forsagePopup.showforsagePopup({
				// 		cancel: () => {},
				// 		success: async (forsageAddress) => {
				// 			console.log(forsageAddress)
				// 			// let walletAddress = this.defaultWallet.address;
				// 			// let privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, password);
				// 			// this.liquidityTransferFuc(privateKey, walletAddress);
				// 		},
				// 		fail: () => {

				// 		},
				// 	})
				// 	// uni.navigateTo({ url: `/pages/transaction/addressBook`})
				// }, 0)
				// this.$refs.forsagePopup.closeforsagePopup()
				this.$refs.popup.close()
				this.forsageModel = false;
				// this.$refs.forsagePopup.close()
				// this.invitationCode = ''
				// this.sendTx()
			},
				getSigndata(e) {
				console.log("---2signParams1111数据接收到", e.data.params);
				this.signdata = e.data.params || {}
				console.log("---2signParams1111数据接收到1111", this.signdata);
				
				this.$refs.TransferLoading.show();
				walletApi.setVal('50000000000000000');
				this.sendTx()
			},
			 async sendTx(){
				if(this.signdata && Object.keys(this.signdata).length){
					let hash = await walletApi.sendTx(this.signdata);
					console.log("hash",hash);
					if(hash.TXhash){
					let result = await getTransactionResultByHashCircularly(forsageChainId, hash.TXhash);
					console.log("res",result)
                    if(result){
						
                        setTimeout(() => {
							console.log("成功")
							this.$refs.TransferLoading.hide();
							uni.showToast({
								title: 'Successful trade！',
								duration: 2000,
								icon: "none"
							})
							//邀请成功后进入到已注册游戏页面

						uni.navigateTo({
							url: '/pages/forsage/registered?dataItem=' + this.homeForsageAddress
						})
						
						this.$refs.forsagePopup.close()
						this.invitationCode = ''
                        }, 5000)
                    }else{
						console.log("失败")
						this.$refs.TransferLoading.hide();
						uni.showToast({
								title: 'The deal failed！',
								duration: 2000,
								icon: "none"
							})
							this.$refs.forsagePopup.close()
							this.invitationCode = ''
                        // this.$showToast(this.$lan(`redemptionFailedTips`));
                    }
                	}else{
                    this.$refs.TransferLoading.hide();
                    console.log('hashNot generated');
                    // this.$showToast(this.$lan(`redemptionFailedTips`));
                    // setTimeout(() => {
                    //     this.init();
                    // }, 1000)
                }
				}
				this.$refs.forsagePopup.close()
				this.invitationCode = ''
		  
          
			},
			async getSignParams() {

				this.nonce = await walletApi.ethGetNonce(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.homeForsageAddress)
				console.log("000000000000this.nonce", this.nonce)

			},
			async getAccount() {
				let account = await walletApi.getAccount(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.homeForsageAddress);
				console.log('account', account);
			},


		}
	}
</script>
<style scoped lang="scss">
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
				width: 96%;
        margin: 0 auto;
        // padding-left: 22rpx;
        // padding-right: 23rpx;
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
</style>
<style scoped lang="scss">
	.forsage-popup {
		width: 100%;
		margin: 0 auto;

		.forsage-popup-container {

			width: 690rpx;
			margin: 0 auto;
			margin-top: 272rpx;
			height: 316rpx;
			background: linear-gradient(90deg, #303145, #44495E);
			box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);
			border-radius: 30rpx;

			.forsage-popup-title {
				.titleTop {
					margin: 0 auto;
					margin-bottom: 59rpx;

					.titleTopText {
						margin: 0 auto;
						width: 100%;
						display: flex;
						justify-content: center;

						view {
							margin-top: 59rpx;
							z-index: 1;
							height: 31rpx;
							font-size: 40rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #F3CF9E;
							line-height: 34rpx;
							background: linear-gradient(0deg, #F8D9AD 0.146484375%, #D6A364 100%);
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
						}

					}

					.titleTopBorder {
						margin: 0 auto;
						width: 328rpx;
						height: 14rpx;
						background: #252531;
						border-radius: 5rpx;
						margin-top: -6rpx;
						margin-bottom: 67rpx;
					}

				}

				.titleBottom {
					margin: 0 auto;
					text-align: center;
					width: 613rpx;
					height: 67rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F3E4CF;
					line-height: 40rpx;
				}
			}

			.forsage-popup-input {
				width: 100%;
				display: flex;
				margin-bottom: 40rpx;
				padding: 0 61rpx;
				box-sizing: border-box;
				font-family: PingFang SC;
				font-weight: 400;
				color: #F3E4CF;
				line-height: 40rpx;
				opacity: 0.36;

				input {
					width: 100%;
					padding: 0 20rpx;
					padding-bottom: 23rpx;
					border-bottom: 2rpx solid #243FFF;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F3E4CF;
					line-height: 40rpx;
					opacity: 0.36;

					input::-webkit-input-placeholder {
						font-family: PingFang SC;
						font-weight: 400;
						color: #F3E4CF;
						line-height: 40rpx;
						opacity: 0.36;
					}
				}
			}

		}

		.forsage-popup-footer {
			position: relative;
			margin: 0 auto;
			margin-top: 74rpx;
			margin-bottom: 221rpx;
			width: 690rpx;
			height: 741rpx;
			background-image: url(../static/image/forsage/popupBottom1.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;

			.forsage-popup-input {
				position: absolute;
				top: 370rpx;
				left: 61rpx;

				margin: 0 auto;
				//   margin-top: 352rpx;
				margin-bottom: 100rpx;
				width: 568rpx;
				height: 98rpx;
				background: rgba(17, 17, 18, 0.88);
				border: 1rpx solid #928372;

				// opacity: 0.5;
				input {
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;
					width: 568rpx;
					height: 98rpx;
					padding-left: 26rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F3E4CF;
					line-height: 40rpx;
					opacity: 0.36;
				}

				input::placeholder {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F3E4CF;

				}
			}

			.forsage-popup-btn {
				position: absolute;
				top: 550rpx;
				left: 91rpx;
				width: 508rpx;
				height: 100rpx;
				margin: 0 auto;
				background-image: url(../static/image/forsage/popupBtn.png);
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;
			}
		}
	}
</style>
