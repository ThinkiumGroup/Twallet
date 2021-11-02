<template>
	<view class="content">
		<view  v-if="!hasDefaultWallet">
			<CustomBar />
			<NoDefaultWallet></NoDefaultWallet>
		</view>

		<!-- <allRadio></allRadio> -->
		<!-- <allBtn title="123" :btnMethods='btnMethods' :home='this'></allBtn> -->
		<!-- <image class="logo" src="/static/logo.png"/>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view @click="toDemo">
			Go to demo
		</view> -->
		<view v-else class="myCont">
			<view class="myTop">
			<view class="top">
				<view class="topImg">
					<image src="../../static/image/my/tx.png"></image>
				</view>
				<view class="topTxt">
					<view class="topTxt_top">{{Object.keys(defaultWallet).length > 0 ? defaultWallet.name : $lan('noWalletCreated')}}</view>
					<view class="topTxt_bottom" v-if="Object.keys(defaultWallet).length > 0">
						<image src="../../static/image/my/icon_top.png"></image>
						<text>{{$toTHAddress(defaultWallet.address)}}</text>
					</view>
				</view>
			</view>

		</view>
		<view class="myNav">
			<view class="nav" @tap="toImportWallet">
				<image src="../../static/image/my/icon-drqb.png"></image>
				<text>{{$lan('importWallet')}}</text>
			</view>
			<view class="nav" @tap="toCreateWallet">
				<image src="../../static/image/my/icon-cjqb.png"></image>
				<text>{{$lan('createWallet')}}</text>
			</view>
			<view class="nav"  @tap="toDeleteWallet">
				<image src="../../static/image/my/icon-scqb.png"></image>
				<text>{{$lan('deleteWallet')}}</text>

			</view>
			<uni-popup ref="popup1" type="center" :mask-click="false">
				<view  class="popupCenter">
				<view class="center_title">{{$lan('prompt')}}</view>
				<view class="center_content">{{$lan('deleteWalletTips')}}</view>
				<view class="center_button">
					<view class="btn1" @click="toPrivateKeyTip(defaultWallet.type=='mnemonic' ? '1' : '2')" >{{$lan( defaultWallet.type=='mnemonic' ? 'backupMnemonic' : 'backupPrivateKey' )}}</view>
					<view class="btn2" @click="deleteWalletAndSetDefault">{{$lan('IhaveBackedUpDeleteMyWallet')}}</view>
				</view>
				</view>
			</uni-popup>
		</view>
		<view class="myMain" >
			<view class="main" @tap="toChangeWalletName">
				<uni-popup ref="popup3" type="center" :mask-click="false">
					<view class="popupCenters">
						<view class="center_title">

							<text>{{$lan('pleaseEnterANewWalletName')}}</text>


						</view>
						<view class="center_content">

							<input type="text" v-model="newName" :placeholder="this.$lan('pleaseEnterANewWalletName')">


						</view>
						<!-- <text class="center_txt"> *Username must not exceed 20 characters</text> -->
						<view class="center_button">

							<view class="btn1" @click="cancel1">{{$lan('cancel')}}</view>
							<view class="btn2" @click="changeWalletName">{{$lan('save')}}</view>
						</view>
					</view>
				</uni-popup>
				<view class="main_left">
					<image src="../../static/image/my/icon-dzb.png"></image>
					<text>{{$lan('walletName')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"  @tap="toChangePwd">
				<uni-popup ref="popup2" type="center" :mask-click="false"><view  class="popupsCenter">
					<view class="center_title"  v-model="changePswData.changePswModel"
					:closable="false"
					:mask-closable="false"
					:title="this.$lan('changePassword')"
					>{{$lan('changePassword')}}</view>
					<!-- @on-ok="changePswOk"
					@on-cancel="changePswCancel" -->
					<view class="center_text">
						<!--  -->
						<!--  -->
						<!--  -->
					<input type="password" :value="changePswData.oldPsw"   :placeholder="this.$lan('pleaseEnterPassword')" @input="oldPaw($event,'oldPsw')">
					<input type="password" :value="changePswData.newPsw"   :placeholder="this.$lan('pleaseEnterANewPassword')"  @input="newPsw($event,'newPsw')">
					<input type="password" :value="changePswData.againNewPsw"  :placeholder="this.$lan('confirmNewPasswordAgain')"  @input="againNewPsw($event,'againNewPsw')">

					</view>
					<view class="center_button">
						<view class="btn1" @click="cancel">{{$lan('cancel')}}</view>
						<view class="btn2" @click="preservation">{{$lan('save')}}</view>
					</view>

					</view>
				</uni-popup>
				<view class="main_left">
					<image src="../../static/image/my/icon-xgmm.png"></image>
					<text>{{$lan('changePassword')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"  v-if="defaultWallet.type=='mnemonic'" @tap="toPrivateKeyTip(1)">
				<view class="main_left">
					<image src="../../static/image/my/icon-dczjc.png"></image>
					<text>{{$lan('exportMnemonic')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"   @tap="toPrivateKeyTip(2)">
				<view class="main_left">
					<image src="../../static/image/my/icon-dcsy.png"></image>
					<text>{{$lan('exportPrivateKey')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<!-- forsage -->
			<!--
			<view class="main"   @click="goForsage">
				<view class="main_left">
					<image src="../../static/image/my/icon-dcsy.png"></image>
					<text>{{$lan('game')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			-->
			<!-- forsage -->
		</view>
		<view class="myMain">
			<view class="main" @click="toAddressList">
				<view class="main_left">
					<image src="../../static/image/my/icon-dzbb.png"></image>
					<text>{{$lan('addressBook')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>

		</view>

		</view>
		<systemManagement/>
	</view>
</template>

<script>
import CustomBar from "../../components/CustomBar";
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
// import {deleteWalletAndSetDefault,changePassword} from "../../utils/businessCommon"
import {aboutWallet} from "../../utils/businessCommon"
import {mapState, mapGetters} from 'vuex';

import systemManagement from "../../components/systemManagement";

	import
		NoDefaultWallet
     from "../../components/NoDefaultWallet";
	export default {
		data() {
			return {
				// oldPwd:'123456',
				//  pwdVal:"",
				//  newPwd:"",
				//  confirmPwd:"",
				// title: 'Hello'
				newName:"",

				// walletList: {},
				 changePswData: {
                    changePswModel: false,
                    oldPsw: '',
                    oldPsw_pswLog_noBlank:this.$lan('passwordCannotBeEmpty') ,
                    oldPsw_pswLog_noBlank_Flag: 'none',

                    newPsw: '',
                    newPsw_pswLog_noBlank:this.$lan('passwordCannotBeEmpty') ,
                    newPsw_pswLog_noBlank_Flag: 'none',
                    pswLog_pattern:this.$lan('passwordConsistsOf5_20DigitsAndLetters'),
                    pswLog_pattern_Flag: 'none',

                    againNewPsw: '',
                    againNewPsw_pswLog_noBlank:this.$lan('passwordCannotBeEmpty') ,
                    againNewPsw_pswLog_noBlank_Flag: 'none',
                    pswLog_equality:this.$lan('thTwoPasswordsAreInconsistent3'),
                    pswLog_equality_Flag: 'none'
                }


			}
		},



		computed: {
			...mapState(['defaultWallet']),
            ...mapGetters(['hasDefaultWallet']),
		},
		//  onShow(){
        //     uni.setTabBarItem({
        //     index: 3,
        //     text:this.$lan('mine')
        // });
        // },
		methods: {
			// toDemo(){
			// 	uni.navigateTo({ url: `/pages/demo/index`})
			// },
			toImportWallet() {
				uni.navigateTo({ url: `/pages/wallet/importWallet`})
			},
			toCreateWallet() {
				uni.navigateTo({ url: `/pages/wallet/createWallet`})
			},
			toAddressList(){
				uni.navigateTo({ url: `/pages/transaction/addressBook`})
			},
			//Delete Wallet
			toDeleteWallet() {
				this.$refs.popup1.open()
			},
			//Backup mnemonics
			// toPrivateKeyTip(){

			// 	this.$refs.popup1.close()
			// 	console.log("backupMnemonic")
			// 	// uni.navigateTo({ url: `/pages/privateKey/tip`})

			// },
			//Wallet backup removed
			deleteWalletAndSetDefault(){
				// console.log("Deleted wallet has been backed up")
				this.$refs.popup1.close()
				console.log('this.defaultWallet',this.defaultWallet,this.walletList);
				aboutWallet.deleteWalletAndSetDefault(this.defaultWallet.address);
				// deleteWalletAndSetDefault(this.defaultWallet)
					uni.showToast({
					title:this.$lan('successfullyDeleted'),
					icon: 'none',
					duration: 2000
				});


			},
			//Change Password
			toChangePwd(){
				console.log(this.changePswData.oldPsw,this.changePswData.newPsw,this.changePswData.againNewPsw)
				this.changePswData.oldPsw=''
				this.changePswData.newPsw=''
				this.changePswData.againNewPsw=''
				this.$refs.popup2.open()
				this.changePswModel = true;
			},

			// Change Password
             preservation() {
				 console.log('123123');
				let self = this;

				// console.log(self.validPsw())
				// console.log(this.defaultWallet.address)
				// console.log(self.changePswData.oldPsw)
				if(!aboutWallet.checkPassword(this.defaultWallet.address,self.changePswData.oldPsw)){
					uni.showToast({
					title:this.$lan('Old password error!'),
					icon: 'none',
					duration: 2000
					})
					this.changePswData.oldPsw=''
					console.log('Verify old password');
					return;
				}
				console.log('333333');
                if(self.changePswData.oldPsw  ===  self.changePswData.newPsw){
					uni.showToast({
					title:this.$lan('Verify old password and new password!'),
					icon: 'none',
					duration: 2000
					})
					console.log('Verify old password and new password');
					return;
				}

				 if(self.changePswData.newPsw==self.changePswData.againNewPsw){
					uni.showToast({
					title:this.$lan('successfullyChangePassword'),
					icon: 'none',
					duration: 2000
					})
					this.$refs.popup2.close()
					aboutWallet.changePassword(this.defaultWallet.address,self.changePswData.oldPsw,self.changePswData.newPsw)

                }else{
					uni.showToast({
					title:this.$lan('passwordModificationFailedTips'),
					icon: 'none',
					duration: 2000
				});
					this.changePswData.oldPsw=''
					this.changePswData.newPsw=''
					this.changePswData.againNewPsw=''
                }
            },
			//change password cancel
			cancel(){
				this.$refs.popup2.close()
			},
			//游戏
			goForsage(){
				uni.navigateTo({ url: `/pages/browser/forsage`})
			},
			// preservation(){
			// 	console.log("old password",this.pwdVal)
			// 	console.log("new password",this.newPwd)
			// 	console.log("confirm password",this.confirmPwd)

			// },
			// toPrivateKeyTip() {
			// 	// uni.navigateTo({ url: `/pages/privateKey/tip`})
			// },
			//Change wallet name
			toChangeWalletName(){
				console.log("Change wallet name")
				console.log(this.defaultWallet.address)
				// console.log('this.defaultWallet',this.walletList);
				// console.log('this.walletList',this.walletList);
				console.log('this.defaultWallet',this.defaultWallet);
				console.log('this.walletList',this.walletList);
				this.$refs.popup3.open()
			},
			//Modify wallet name cancel
			cancel1(){
				this.$refs.popup3.close()
			},
			//Modify wallet name confirmation
			changeWalletName(){
				console.log("name",this.newName)
				aboutWallet.changeWalletName(this.defaultWallet.address,this.newName);
				uni.showToast({
					title:this.$lan('successfullyModifiedTheWalletName'),
					icon: 'none',
					duration: 2000
				});
				this.newName=''
				this.$refs.popup3.close()
			},
			toPrivateKeyTip(type) {

				this.$refs.popup1.close()
				console.log("type",type)
				uni.navigateTo({ url: `/pages/privateKey/tip?type=${type}`})
			},
			oldPaw(e,flag){
				switch(flag){
					case 'oldPsw':{
						setTimeout(()=>{
							this.changePswData.oldPsw = e.target.value
							console.log("Old password 111",this.changePswData.oldPsw)
						},0)
						break;
					}
				}

			},
			newPsw(a,flag){
				switch(flag){
					case 'newPsw':{
						setTimeout(()=>{
							this.changePswData.newPsw = a.target.value
							console.log("New password 111",this.changePswData.newPsw)
						},0)
						break;
					}
				}
			},
			againNewPsw(b,flag){
				switch(flag){
					case 'againNewPsw':{
						setTimeout(()=>{
							this.changePswData.againNewPsw = b.target.value
							console.log("0 new password 111",this.changePswData.againNewPsw)
						},0)
						break;
					}
				}
			},


		},
		 components: {
        uniPopup,
        uniPopupMessage,
		uniPopupDialog,
		NoDefaultWallet,
		CustomBar,
			 systemManagement
    	},

		}

</script>

<style lang="scss" scoped>
	.content{
		width: 750rpx;
		height: 100%;
		// background-color: #FFFFFF;
		.myCont{
			width: 100%;
		height: 100%;
		}
		.myTop {
			width: 100%;
			height: 455rpx;
			margin: 0 auto;
			// margin-bottom: 16rpx;
			/* border-radius: 28rpx; */
			background-image: url(../../static/image/my/myBanner.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			color: #FFFFFF;
			display: flex;
			// justify-content: center;
			// align-items: center;

			.top {
				// width: 88%;
				margin: 150rpx 126rpx 176rpx 48rpx;
				height: 129rpx;
				line-height: 129rpx;
				/* margin-bottom: 14rpx; */
				display: flex;
				// justify-content: flex-start;
				// justify-content: space-around;
				// align-items: center;

				.topImg {
					background-color: #FFFFFF;
					width: 129rpx;
					height: 129rpx;
					border-radius: 50%;
					margin-left: 16rpx;
					margin-right: 28rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}

				.topTxt {

					display: flex;
					// flex: 1;
					// width: 72%;
					// margin-left: 28rpx;
					flex-direction: column;
					// justify-content: flex-start;
					// align-items: center;
					// width: 130rpx;
					height: 129rpx;

					.topTxt_top {
						// width: 100%;
						max-width: 169rpx;
						min-height: 28rpx;
						line-height: 28rpx;
						// margin: 0 auto;
						display: flex;
						justify-content: flex-start;
						font-size: 36rpx;
						margin: 9rpx 250rpx 38rpx 0rpx;
						// margin-bottom: 20rpx;
						// text-align: center;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
					}

					.topTxt_bottom {
						display: flex;
						align-items: center;
						height: 40rpx;
						line-height: 40rpx;
						// margin-top: 10rpx;

						margin-bottom: 14rpx;
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 16rpx;
						}

						text {
							font-size: 28rpx;
							width: 362rpx;
							height: 27rpx;
							line-height: 27rpx;
							font-size: 28rpx;
							font-family: PingFang SC;
							font-weight: 300;
							color: #FFFFFF;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}

			}
		}

		.myNav {
			width: 686rpx;
			height: 180rpx;
			margin: 0 32rpx;
			margin-top: -95rpx;
			margin-bottom: 32rpx;
			display: flex;
			border-radius: 20rpx;
			justify-content: space-around;


			// align-items: center;
			background-color: #FFFFFF;
			.nav{
				// width: 117rpx;
				height: 98rpx;
				line-height: 98rpx;
				margin-top:49rpx;
				margin-bottom:35rpx;
				display: flex;
				flex-direction: column;
				// justify-content: space-between;
				align-items: center;
				image{
					// margin-bottom: 10rpx;
					width: 40rpx;
					height: 40rpx;
				}
				text{
					height: 29rpx;
					line-height: 29rpx;
					margin-top: 27rpx;
					color: #333333;
					font-size: 30rpx;
					}
			}
		}
		.myMain,.myMains{
			border-radius: 12rpx;
			width: 686rpx;
			margin: 0rpx 32rpx;
			// margin-top: 30rpx;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-around;
			// align-items: center;
			background-color: #FFFFFF;
			font-size: 30rpx;
			color: #343434;
			.main{
				margin-left: 52rpx;
				// width: 550rpx;
				height: 40rpx;
				line-height: 40rpx;
				padding: 35rpx 0rpx;


				// margin: 35rpx 32rpx 35rpx 52rpx;
				// padding-right: 40rpx;
				// margin-right: -2rpx;

				// padding-bottom: 18rpx;
				display: flex;
				// flex-direction: column;
				// justify-content: space-between;
				// align-items: center;
				.main_left{
					height: 40rpx;
					line-height: 40rpx;
					display: flex;
					// flex-direction: column-reverse;
					// justify-content: space-between;
					align-items: center;
					// margin-left: 52rpx;
					image{
						width: 40rpx;
						height: 40rpx;
						margin-right: 32rpx;
					}
					text{
						min-width: 147rpx;
						height: 28rpx;
						line-height: 28rpx;
						padding-right: 371rpx;
					}
				}
				.main_right{

					image{

						width: 14rpx;
						height: 26rpx;
					}
				}
			}
			.main+.main{
				border-top: 1rpx solid #dddddd;
			}

		}
		.myMains{
			border-radius: 12rpx;
			width: 686rpx;
			height: 200rpx;
			margin: 0rpx auto;
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			background-color: #FFFFFF;


		}
	}
	.popupCenter,.popupsCenter,.popupCenters{
		position: fixed;
		top: 34%;
		left:10%;
		right:50%;
		width: 600rpx;
		margin: 0 auto;
		// height: 360rpx;
		border-radius: 20rpx;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		.center_title{
			width: 100%;
			text-align: center;
			margin: 20rpx auto;
			font-size: 36rpx;
			color: #333333;
			font-weight:700;
		}
		.center_content{
			width: 80%;
			text-align: center;
			margin: 20rpx auto;
			margin-bottom: 34rpx;
			// font-size: 38rpx;
		}
		.center_button{
			width: 98%;
			height: 100rpx;
			margin: 0 auto;
			margin-top: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #ffffff;
			// border-top: #dddddd;
			button{
				background: #ffffff;

				width: 48%;
				font-size: 34rpx;
				// border:#FFFFFF solid 1rpx;
			}
			.btn1{
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
				background: #ffffff;
				width: 100%;
				border-top:#ddd solid 1rpx;
				// border-right:#ddd solid 1rpx;
				border-bottom-left-radius: 20rpx;
			}
			.btn2{
				overflow: hidden;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
				background: #ffffff;
				width: 100%;
				border-top:#ddd solid 1rpx;
				border-left:#ddd solid 1rpx;
				border-bottom-right-radius: 20rpx;
				color: #634DFF;
			}
		}

	}
	.popupsCenter{
		width: 600rpx;
		// height: 690rpx;
		top: 20%;
		left:10%;
		right:50%;
		.center_title{
			width: 100%;
			text-align: center;
			margin: 0 auto;
			margin-top: 30rpx;
			margin-bottom: 14rpx;
			font-size: 38rpx;
			color: #333333;
		}
		.center_text{
			width: 100%;
			// height: 70%;
			margin: 60rpx auto;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			input{
				width: 80%;
				margin: 0 auto;
				font-size: 30rpx;
				color: #AAAAAA;
				height: 120rpx;
				border-bottom: 1rpx solid #ddd;
			}
		}
	}
	// .popupCenters{
	// 	// height: 290rpx;
	// }
</style>
