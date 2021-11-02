<template>
	<view class="forsageFAQ">
		<!-- <CustomBar class="topBar" :styles="{background: '#fff'}"/> -->
		<!-- <view></view> -->
		<!-- <text></text> -->
		<view class="FAQTop">
			<image src="../../static/image/forsage/registeredTop.png"></image>
			<view class="FAQTopTitle">
				<view class="titleTop">
					<view class="titleTopText">
						<image src="../../static/image/forsage/homeImg1.png">
					</view>
				</view>

			</view>
			<view class="topYuan">

			</view>
		</view>
		<view class="registeredNews">
			<view class="registeredNewsTop">
				<image style="width:50rpx;height:50rpx;margin-left:36rpx;margin-right:23rpx;" src="../../static/image/forsage/TH.png">
					<view class="registeredNewsTopText">
						{{ THdata }}
					</view>
			</view>
			<!-- <view class="registeredNewsBottom">
				<image style="width:50rpx;height:50rpx;margin-left:36rpx;margin-right:23rpx;" src="../../static/image/forsage/TKM.png">
					<view class="registeredNewsBottomText">
						Profit:
						<view style="margin-left:32rpx;" class="registeredNewsBottomTextData">
							{{ ProfitTkm }}
							<view style="margin-left:13rpx;" class="registeredNewsBottomText">
								TKM
							</view>
						</view>
					</view>
			</view> -->
		</view>
		<view class="registeredX3">
			<view class="titleTop">
				<view class="titleTopText">
					<image style="width:233rpx;height:32rpx;" src="../../static/image/forsage/FX3.png"></image>

				</view>
				<view class="titleTopBorder"></view>
				<view class="Yuan"></view>
			</view>

		</view>
		<view class="registeredX3Slides">
			<swiper class="registeredX3Slide" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000"
			 indicator-active-color="#9A8877" indicator-color="#23222A" >
			 <!-- :dots-styles="dotsStyles" -->
				<swiper-item style="width:100%;height:790rpx;display:flex;" class="slideItem" v-for="(item,index) in filingList" :key="index">
					<image style="width:594rpx;height:790rpx;margin-left:80rpx;" src="../../static/image/forsage/regX3.png"></image>
					<view class="slideNum">{{ item.filingFee }}</view>
					<view>
						<view  v-if="item.x3IsActivate" class="slideSum">
							<view class="slideSumTop">
								<image style="width:34rpx;height:32rpx;margin-right:18rpx;" src="../../static/image/forsage/ren.png"></image>
								<view>{{ renSum }}</view>
							</view>
							<view class="slideSumTop">
								<image style="width:34rpx;height:32rpx;margin-right:20rpx;margin-left:82rpx;" src="../../static/image/forsage/qian.png"></image>
								<view>{{ qianSum }}</view>
							</view>
						</view>
						<view v-else>
							<view style="margin-top:0rpx;margin-bottom:0rpx;" @click="x3Activate(item)"  class="homeButton">
								<view>ACTIVATION</view>

							</view>
						</view>
					</view>
				</swiper-item>
				
			</swiper>
		</view>
        <view class="registeredX3">
			<view class="titleTop">
				<view class="titleTopText">
					<image style="width:233rpx;height:32rpx;" src="../../static/image/forsage/FX4.png"></image>

				</view>
				<view class="titleTopBorder"></view>
				<!-- <view class="Yuan"></view> -->
			</view>

		</view>
		<view class="registeredX4Slides">
			<swiper class="registeredX4Slide" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000"
			 indicator-active-color="#9A8877" indicator-color="#23222A" >
			 <!-- :dots-styles="dotsStyles" -->
				<swiper-item style="width:100%;display:flex;" class="slideItem" v-for="(item,index) in filingList" :key="index">
					<image style="width:594rpx;height:860rpx;margin-left:80rpx;" src="../../static/image/forsage/regX4.png"></image>
					<view class="slideNum">{{ item.filingFee }}</view>
					<view>
						<view v-if="item.x4IsActivate" class="slideSum">
							<view class="slideSumTop">
								<image style="width:34rpx;height:32rpx;margin-right:18rpx;" src="../../static/image/forsage/ren.png"></image>
								<view>{{ renSum }}</view>
							</view>
							<view class="slideSumTop">
								<image style="width:34rpx;height:32rpx;margin-right:20rpx;margin-left:82rpx;" src="../../static/image/forsage/qian.png"></image>
								<view>{{ qianSum }}</view>
							</view>
						</view>
						<view v-else>
							<view style="margin-top:0rpx;margin-bottom:0rpx;" @click="x4Activate(item)" class="homeButton">
								<view>ACTIVATION</view>

							</view>
						</view>
					</view>
				</swiper-item>
				
			</swiper>
		</view>
		<uni-popup ref="popup" type="bottom" :mask-click="false">
			<view class="popupsCenter">
				<view class="popupCenter">
					<view class="center_title">
						<image src="../../static/image/forsage/popupTitle.png"></image>
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
	</view>





</template>
<script>
	import UniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {aboutWallet, getTransactionResultByHashCircularly} from "../../utils/businessCommon"
	// import {mapState,mapGetters,mapActions} from 'vuex';
	import PasswordPopup from "@/components/PasswordPopup";
	import CustomBar from "../../components/CustomBar";
	import NoDefaultWallet from "../../components/NoDefaultWallet";
	// import {mapState, mapGetters, mapActions} from 'vuex';
	import walletApi from "../../apis/walletApi";
	import TransferLoading from "../../components/TransferLoading";
	import _ from 'lodash'
	const SmartMatrixForsageAbi = require('../../utils/abis/SmartMatrixForsage');
	const forsageChainId = this.$enums.ChainIdEnum.ACCOUNT_CHAIN;
	const gasFee = 1;
	import {
		mapState,
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				THdata: 'TH5897897979794554545',
				ProfitTkm: 51800,
				forsageAddress:'',
				forsageContractAddress:"0x7a0df03a751a84c64563ca50d5722380328d38b1",
				renSum: 3914,
				nonce: '',
				balance:0,
				encoded: '',
				obj: {},
				signdata: {},
				qianSum: 1257,
				filingFee:0.025,
				xIndex:0,
				matrix:0,
				xCost:25000000000000000,
				xCosts:0.025,
				// X4Index:0,
				filingList:[
					{
						index:0,
						filingFee:0.025,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:1,
						filingFee:0.05,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:2,
						filingFee:0.1,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:3,
						filingFee:0.2,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:4,
						filingFee:0.4,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:5,
						filingFee:0.8,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:6,
						filingFee:1.6,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:7,
						filingFee:3.2,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:8,
						filingFee:6.4,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:9,
						filingFee:12.8,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:10,
						filingFee:25.6,
						x3IsActivate:false,
						x4IsActivate:false
					},
					{
						index:11,
						filingFee:51.2,
						x3IsActivate:false,
						x4IsActivate:false
					},
				],
				//    dotsStyles: {
				// 			// backgroundColor: 'rgba(83, 200, 249,0.3)',
				// 			// border: '1px rgba(83, 200, 249,0.3) solid',
				// 			// color: '#fff',
				// 			// selectedBackgroundColor: 'rgba(83, 200, 249,0.9)',
				// 			// selectedBorder: '1px rgba(83, 200, 249,0.9) solid',
				// 			bottom:100
				// },

				options: [{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		onShow() {

		},
		computed(){

		},
		mounted() {
			window.addEventListener("message", this.getSigndata, false);
			// this.isActivateX3()
			// this.isActivateX4()
		},
		onReady() {
			this.profitData()
			// this.isActivateX3()
			// this.isActivateX4()
			this.THdata = this.to_32_decimal(this.forsageAddress)

		},
		onLoad(option) {
			console.log("88888option",option);
			this.forsageAddress = option.dataItem
			console.log("9999option",this.forsageAddress);
			this.getSignParams()
			this.isActivateX3()
			this.isActivateX4()
			this.getAccount()
		},

		computed: {
			...mapState(["defaultWallet"]),
			...mapGetters(["hasDefaultWallet"])
		},
		components: {
			CustomBar,
			NoDefaultWallet,
			PasswordPopup,
			TransferLoading
			// uniCollapse
			// ,uniCollapseItem
		},
		methods: {
			changeContent(index) { //通过index拿到当前值
				this.list[index].showContent = !this.list[index].showContent;
			},
			changeContentInfo(index, indexMsg) {
				console.log(index, indexMsg)
			},
			async profitData(){
				let params = {
                    contractAbi: SmartMatrixForsageAbi,
					contractAddress:this.forsageContractAddress,
                    address:this.forsageAddress,
                    chainId: forsageChainId
				};
				console.log("3333")
				const contractObj = await walletApi.ethCallContract(params);
				console.log("333344")
				
				console.log("33335555")
				console.log("数据",contractObj)
				console.log("33336666")
				this.ProfitTkm = await contractObj.isUserExists(this.forsageAddress);
				console.log("33337777")
                console.log('已注册', this.ProfitTkm);
                return this.ProfitTkm;
			},
			async isActivateX3(){
				let params = {
                    contractAbi: SmartMatrixForsageAbi,
					contractAddress:this.forsageContractAddress,
                    address:this.forsageAddress,
                    chainId: forsageChainId
				};
				const contractObj = await walletApi.ethCallContract(params);
				// walletApi.setVal(this.xCost);
				this.filingList[0].x3IsActivate = true
				this.filingList[1].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,2);
				this.filingList[2].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,3);
				this.filingList[3].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,4);
				this.filingList[4].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,5);
				this.filingList[5].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,6);
				this.filingList[6].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,7);
				this.filingList[7].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,8);
				this.filingList[8].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,9);
				this.filingList[9].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,10);
				this.filingList[10].x3IsActivate = await contractObj.usersActiveX3Levels(this.forsageAddress,11);
				this.filingList[11].x3IsActivate= await contractObj.usersActiveX3Levels(this.forsageAddress,12);
				console.log("listX3",this.filingList)
			},
			async isActivateX4(){
				let params = {
                    contractAbi: SmartMatrixForsageAbi,
					contractAddress:this.forsageContractAddress,
                    address:this.forsageAddress,
                    chainId: forsageChainId
				};
				const contractObj = await walletApi.ethCallContract(params);
				// walletApi.setVal(this.xCost);
				this.filingList[0].x4IsActivate = true
				this.filingList[1].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,2);
				this.filingList[2].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,3);
				this.filingList[3].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,4);
				this.filingList[4].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,5);
				this.filingList[5].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,6);
				this.filingList[6].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,7);
				this.filingList[7].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,8);
				this.filingList[8].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,9);
				this.filingList[9].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,10);
				this.filingList[10].x4IsActivate = await contractObj.usersActiveX6Levels(this.forsageAddress,11);
				this.filingList[11].x4IsActivate= await contractObj.usersActiveX6Levels(this.forsageAddress,12);
				console.log("listX4",this.filingList)
			},
			async x3Activate(i){
				console.log("indexX3",aboutWallet.toBigNumber(i.filingFee))
				this.xCosts = i.filingFee
				this.xCost = aboutWallet.toBigNumber(i.filingFee)
				this.xIndex = (i.index)+1
				this.matrix = 1
				console.log("indexX3花费",this.xCosts)
				console.log("indexX3游戏等级",this.matrix)
				console.log("indexX3哪个模块",this.xIndex)
				
				this.$refs.popup.open()
				this.forsageModel = true;
			
				
			},
			async x4Activate(i){
				console.log("indexX4",aboutWallet.toBigNumber(i.filingFee))
				this.xCosts = i.filingFee
				this.xCost = aboutWallet.toBigNumber(i.filingFee)
				this.xIndex = (i.index)+1
				this.matrix = 2
				console.log("indexX4花费",this.xCosts)
				console.log("indexX4游戏等级",this.matrix)
				console.log("indexX4哪个模块",this.xIndex)
				this.$refs.popup.open()
				this.forsageModel = true;
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
				this.nonce = await walletApi.ethGetNonce(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.forsageAddress)
				const balance = await walletApi.getAccount(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.forsageAddress)
				this.balance = aboutWallet.toRegularNumber(balance)
				this.nonce = this.nonce.nonce
				console.log("000000000000this.nonce", this.nonce)
				console.log("000000000000this.balance",this.balance)
				console.log("000000000000this.gasFee",gasFee)
				console.log("000000000000this.xCost",this.xCosts)
				if ((gasFee + this.xCosts) > this.balance) {
						uni.showToast({
								title: 'The account balance is insufficient！',
								duration: 2000,
								icon: "none"
							})
							return false
					}
				this.encoded = walletApi.simpleEncode("buyNewLevel(uint8,uint8)",this.matrix,this.xIndex);
				console.log("this.encoded",this.encoded)
				console.log("this.xCost",this.xCost)
				this.obj = {
					chainId: forsageChainId,
					fromChainId: forsageChainId,
					toChainId: forsageChainId,
					from: this.forsageAddress,
					to: this.forsageContractAddress, //合约地址
					nonce: this.nonce.toString(),
					value: this.xCost,
					input: '0x' + this.encoded.toString("hex"),
					extra: '',
				};
				//向app发送消息
				console.log("调用uni.postMessage，开始发送")
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
				// this.sendTx()
			},
				getSigndata(e) {
				console.log("---1signParams1111数据接收到", e.data.params);
				this.signdata = e.data.params || {}
				console.log("---1signParams1111数据接收到1111", this.signdata);
				this.$refs.TransferLoading.show();
				walletApi.setVal(this.xCost);
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
							this.isActivateX3()
							this.isActivateX4()
                            // this.$showToast(this.$lan(`successfulRedemption`));
                            // this.jumpPage('/pages/decentralizedTransactions/transactionRecord')
                        }, 5000)
                    }else{
						console.log("失败")
						this.$refs.TransferLoading.hide();
						uni.showToast({
								title: 'The deal failed！',
								duration: 2000,
								icon: "none"
							})
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
		  
          
			},
			async getSignParams() {

				this.nonce = await walletApi.ethGetNonce(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.forsageAddress)
				console.log("000000000000this.nonce", this.nonce)

			},
			async getAccount() {
				let account = await walletApi.getAccount(this.$enums.ChainIdEnum.ACCOUNT_CHAIN, this.forsageAddress);
				console.log('account', account);
			},
		}
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
<style scoped lang="scss">
	.forsageFAQ {
		width: 750rpx;

		.FAQTop {
			position: relative;
			width: 740rpx;

			// margin-bottom: 45rpx;
			image {
				width: 100%;
				height: 295rpx;
			}

			.topYuan {
				position: absolute;
				top: 310rpx;
				left: 68rpx;
				// bottom: -15rpx;
				width: 6rpx;
				height: 6rpx;
				background: linear-gradient(90deg, #F8D9AD, #D6A364);
				border-radius: 50%;
				box-shadow: 1rpx 1rpx 10rpx 1rpx #F8D9AD;
			}

			.FAQTopTitle {
				width: 750rpx;
				margin: 0 auto;
				text-align: center;
				position: absolute;
				top: 212rpx;

				.titleTop {
					margin: 0 auto;

					.titleTopText {
						margin: 0 auto;

						image {
							width: 537rpx;
							height: 60rpx;
						}
					}
				}

			}
		}

		.registeredNews {
			margin: 0 auto;
			margin-top: 57rpx;
			margin-bottom: 120rpx;
			width: 750rpx;
			height: 186rpx;
			background: linear-gradient(90deg, #303145, #44495E);
			box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);

			.registeredNewsTop {
				display: flex;
				align-items: center;
				padding-top: 28rpx;
				padding-bottom: 30rpx;

				.registeredNewsTopText {

					height: 50rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F8F1E9;
					line-height: 50rpx;
				}
			}

			.registeredNewsBottom {
				display: flex;
				align-items: center;

				.registeredNewsBottomText {
					display: flex;
					align-items: center;
					height: 22rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #F8F1E9;
					line-height: 36rpx;

					.registeredNewsBottomTextData {
						display: flex;
						align-items: flex-end;
						height: 36rpx;
						font-size: 40rpx;
						font-family: eryakuheiti;
						font-weight: 400;
						color: #F3CF9E;
						line-height: 30rpx;
					}
				}
			}
		}

		.registeredX3 {
			margin: 0 auto;

			.titleTop {
				position: relative;
				margin: 0 auto;

				.Yuan {
					position: absolute;
					background: linear-gradient(90deg, #D6A364, #F8D9AD);
					border-radius: 50%;
					box-shadow: 1rpx 1rpx 20rpx 1rpx #F8D9AD;
					width: 10rpx;
					height: 10rpx;
					top: 20rpx;
					right: 140rpx;
				}

				.titleTopText {
					margin: 0 auto;
					width: 100%;
					display: flex;
					justify-content: center;

					// // height: 53rpx;
					// font-size: 44rpx;
					// font-family: eryakuheiti;
					// font-weight: 900;
					// color: #F3CF9E;
					// line-height: 22rpx;
					image {
						margin: 0 auto;

					}
				}

				.titleTopBorder {
					margin: 0 auto;
					width: 272rpx;
					height: 14rpx;
					background: #3D4055;
					border-radius: 5rpx;
					margin-top: -8rpx;
					margin-bottom: 50rpx;
				}

			}

		}

		.registeredX3Slides,
		.registeredX4Slides {
			width: 100%;
			// width: 594rpx;
			margin: 0 auto;
            display: flex;
            // margin-top: 134rpx;
			// padding-bottom: 134rpx;

			//    overflow-x: auto;
			.registeredX3Slide,.registeredX4Slide {
				width: 100%;
				// width: 594rpx;
				// height: 790rpx;
				height: 880rpx;
				margin: 0 auto;
				display: flex;
            }
            .registeredX4Slide{
                // height: 860rpx;
				height: 940rpx;
            }
			.slideItem {
				position: relative;
				width: 100%;
				margin: 0 auto;
				// width: 594rpx;
				height: 100%;

				//    height:790rpx;
				.slideNum {
					position: absolute;
					top: 126rpx;
					// left: 340rpx;
					left:39%;
					width: 166rpx;
					text-align: center;
					height: 37rpx;
					font-size: 40rpx;
					font-family: eryakuheiti;
					font-weight: 400;
					color: #F3CF9E;
					line-height: 36rpx;
				}

				.slideSum {
					position: absolute;
					display: flex;
					top: 504rpx;
					left: 152rpx;

					.slideSumTop {
						display: flex;

						view {

							height: 21rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #EDC087;
							// line-height: 48rpx;
						}
					}
				}

				.homeButton {
					position: absolute;
					top: 624rpx;
					left: 192rpx;
					text-align: center;
					margin: 0 auto;
					width: 380rpx;
					height: 86rpx;
					background: linear-gradient(90deg, #F8D9AD, #E9B87A);
					border-radius: 50rpx;

					view {

						height: 30rpx;
						font-size: 40rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #373A4E;
						line-height: 86rpx;
					}



				}

				// background: linear-gradient(90deg, #F8D9AD, #E9B87A);
				// border-radius: 50rpx;
				// font-size: 44rpx;
				// font-family: eryakuheiti;
				// font-weight: 800;
				// color: #373A4E;
				// line-height: 100rpx;



			}
        }
         .registeredX3Slide {
            
            // height: 860rpx;
            padding-bottom: 64rpx;
		}
        .registeredX4Slide {
            // height: 860rpx;
            padding-bottom: 134rpx;
            .slideItem {
				position: relative;
				width: 100%;
				margin: 0 auto;
				height: 100%;

				//    height:790rpx;
				.slideNum {
					position: absolute;
					top: 116rpx;
					// left: 340rpx;
					left:39%;
					width: 166rpx;
					text-align: center;
					height: 37rpx;
					font-size: 40rpx;
					font-family: eryakuheiti;
					font-weight: 400;
					color: #F3CF9E;
					line-height: 36rpx;
				}

				.slideSum {
					position: absolute;
					display: flex;
					top: 574rpx;
					left: 152rpx;

					.slideSumTop {
						display: flex;

						view {

							height: 21rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #EDC087;
							// line-height: 48rpx;
						}
					}
				}

				.homeButton {
					position: absolute;
					top: 694rpx;
					left: 192rpx;
					text-align: center;
					margin: 0 auto;
					width: 380rpx;
					height: 86rpx;
					background: linear-gradient(90deg, #F8D9AD, #E9B87A);
					border-radius: 50rpx;

					view {

						height: 30rpx;
						font-size: 40rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #373A4E;
						line-height: 86rpx;
					}



				}

				// background: linear-gradient(90deg, #F8D9AD, #E9B87A);
				// border-radius: 50rpx;
				// font-size: 44rpx;
				// font-family: eryakuheiti;
				// font-weight: 800;
				// color: #373A4E;
				// line-height: 100rpx;



			}
		}
		

		.titleTop {
			margin: 0 auto;

			.titleTopText {

				// // height: 53rpx;
				// font-size: 44rpx;
				// font-family: eryakuheiti;
				// font-weight: 900;
				// color: #F3CF9E;
				// line-height: 22rpx;
				image {
					width: 587rpx;
					height: 53rpx;
				}
			}

			.titleTopBorder {
				margin: 0 auto;
				width: 328rpx;
				height: 14rpx;
				background: #3D4055;
				border-radius: 5rpx;
				margin-top: -24rpx;
				margin-bottom: 21rpx;
			}

		}

	}
</style>
