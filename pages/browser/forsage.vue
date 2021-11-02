<template>
	<view class="app">
		<CustomBar class="topBar" :styles="{background: '#fff'}" />
		<NoDefaultWallet v-if="!hasDefaultWallet"></NoDefaultWallet>
		<!-- <web-view v-else
			:webview-styles="webviewStyles"
			src="http://localhost:9001/#/?userData=' + JSON.stringify(userData)"
			@message="handleMessage">
		
	</web-view> -->
		<!-- <web-view v-else :src="url" ref="iframe" id="iframe" @onLoad="onLoad" @message="getMessage" @onPostMessage="getPostMessage"> -->
		<iframe v-else :src="url" ref="iframe" id="iframe" @onLoad="onLoad" @message="getMessage" @onPostMessage="getPostMessage"
		 style="width: 100%; min-height:1340rpx;"></iframe>
		<!-- </web-view> -->
		<PasswordPopup ref="passwordPopup" />
		<uni-popup ref="popup" type="bottom" :mask-click="false">
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
		</uni-popup>

	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import CustomBar from "../../components/CustomBar";
	import NoDefaultWallet from "../../components/NoDefaultWallet";
	import {
		aboutWallet
	} from '@/utils/businessCommon.js'
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex';
	import walletApi from "../../apis/walletApi";
	import PasswordPopup from "../../components/PasswordPopup";
	import _ from 'lodash'
	export default {
		data() {
			return {
				src: "https://browser.thinkium.io/phone?public",
				url: 'http://localhost:9001/#/',
				webviewStyles: {
					progress: false //Must be set to false
				},
				signParams: {},
				obj: {},
				iframeWin: null,
				forsageModel: false,
			};
		},
		onShow() {
			// this.isGetAddress()


			// 		 var pages = getCurrentPages();
			// var page = pages[pages.length - 1];
			// console.log("page",page)
			// console.log("pages",pages)

			// var currentWebview=page.$getAppWebview();
			// console.log("currentWebview",currentWebview)
			// setTimeout(function(){
			//   var web_view= currentWebview.children();
			//   console.log("111",web_view)
			//   var w=plus.nativeUI.showWaiting();
			//   console.log("222",w)
			// 	web_view[0].addEventListener("loading",function(){
			// 		w.show();
			// 	},false);

			// 	web_view[0].addEventListener("loaded",function(){
			// 		w.close();
			// 		w=null;
			// 	},false);
			// },600)

		},
		onReady() {

		},
		mounted() {
			window.addEventListener("message", this.getPostMessage, false);
			// this.iframeWin = this.$refs.iframe.contentWindow;
			// 接受子页面发来的信息
			// window.addEventListener("接受子页面发来的信息message", this.getPostMessage());
		},
		onLoad(data) {
			// console.log("123455")
			// this.isGetAddress()
		},
		// 		onLoad(option) {
		// 		if(option.src) this.src = option.src;

		// 		const currentWebview = this.$mp.page.$getAppWebview(); //Get the current web view
		// 		setTimeout(function() {
		// 		const wv = currentWebview.children()[0];
		// 		wv.setStyle({ //Set the distance between the web view and the top and your own height in PX
		// 			top: uni.getSystemInfoSync().statusBarHeight,
		// 		})
		// 		}, 1000);


		//   },
		//  onShow(){
		//           uni.setTabBarItem({
		//           index: 2,
		//           text:this.$lan('browser')
		//       });
		//       },
		computed: {
			...mapState(["defaultWallet"]),
			...mapGetters(["hasDefaultWallet"])
		},
		components: {
			CustomBar,
			NoDefaultWallet,
			PasswordPopup
		},
		methods: {
			isGetAddress() {
				setTimeout(() => {
					this.$refs.popup.open()
					this.forsageModel = true;
				}, 0)
			},
			reject() {
				console.log("拒绝")
				// this.$refs.popup.close()
				// this.forsageModel = false;
				uni.showToast({
					title: "Access has been denied and you will not be able to access the game",
					icon: "none",
					// position: 'bottom'
				})
				//         setTimeout(() => {
				// this.$refs.popup.open()
				// this.forsageModel = true;
				// 	}, 0)
			},
			confirm() {
				console.log("确认")
				uni.showLoading({
					title: 'Getting your wallet address'
				});
				let iframe = document.getElementById('iframe');
				let params = {
					address: this.defaultWallet.address
				}
				iframe.contentWindow.postMessage(params, '*');
				console.log("同意发送地址", params)
				setTimeout(() => {
					uni.hideLoading()
				}, 1000)
				
				this.$refs.popup.close()
				this.forsageModel = false;
			},
			ReceiveMessage(event) {
				console.log("ReceiveMessage$$$", event);

				// if (event.data && event.data.data && event.data.data.arg) {
				//   console.log("iframe 参数 event.data:", event.data.data.arg);
				// }
			},
			getMessage(event) {
				console.log("@message 接收成功", event)
				// uni.showModal({
				// 	content: JSON.stringify(e.detail),
				// 	// content: 'haha',
				// 	showCancel: false
				// })
			},
			getPostMessage(event) {
				console.log("@onPostMessage 接收成功", event.data)
				if (event.data.data.type == 'toSign') {
					let obj = _.get(event, 'data.data.obj');
					console.log('------------obj', obj)
					this.toSign(obj)
				} else {
					setTimeout(() => {
					this.isGetAddress()
				}, 1000)
				}

				// uni.showModal({
				// 	content: JSON.stringify(e.detail),
				// 	// content: 'haha',
				// 	showCancel: false
				// })
			},
			toSign(obj) {
				this.$refs.passwordPopup.showPasswordPopup({
					cancel: () => {},
					success: async (password) => {
						console.log(password)
						let walletAddress = this.defaultWallet.address;
						const privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, password);
						console.log('00---privateKey ', privateKey)
						console.log('----obj', obj)
						this.signParams = await walletApi.signTransaction(obj, privateKey);
						console.log('----signParams', this.signParams)
						let iframe = document.getElementById('iframe');
						let data = {
							params: this.signParams
						}
						iframe.contentWindow.postMessage(data, '*');
						console.log("向h5传值成功")
					},
					fail: () => {

					},
				});
			},
			sendTx() {
				if (this.signParams && Object.keys(this.signParams).length) {
					walletApi.sendTx(this.signParams);
				}
			},
		},

	};
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
