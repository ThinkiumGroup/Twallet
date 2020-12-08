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
					<view class="topTxt_top">{{Object.keys(defaultWallet).length > 0 ? defaultWallet.name : '未创建钱包'}}</view>
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
				<text>{{$lan('导入钱包')}}</text>
			</view>
			<view class="nav" @tap="toCreateWallet">
				<image src="../../static/image/my/icon-cjqb.png"></image>
				<text>{{$lan('创建钱包')}}</text>
			</view>
			<view class="nav"  @tap="toDeleteWallet">
				<image src="../../static/image/my/icon-scqb.png"></image>
				<text>{{$lan('删除钱包')}}</text>

			</view>
			<uni-popup ref="popup1" type="center" :mask-click="false">
				<view  class="popupCenter">
				<view class="center_title">{{$lan('提示')}}</view>
				<view class="center_content">{{$lan('您正在删除钱包，删除后只能通过助记词和私钥重新导入，请在删除前务必确认已备份住几次或私钥')}}</view>
				<view class="center_button">
					<view class="btn1" @click="toPrivateKeyTip(defaultWallet.type=='mnemonic' ? '1' : '2')" >{{$lan( defaultWallet.type=='mnemonic' ? '备份助记词' : '备份私钥' )}}</view>
					<view class="btn2" @click="deleteWalletAndSetDefault">{{$lan('我已备份，删除钱包')}}</view>
				</view>
				</view>
			</uni-popup>
		</view>
		<view class="myMain" >
			<view class="main" @tap="toChangeWalletName">
				<uni-popup ref="popup3" type="center" :mask-click="false">
					<view class="popupCenters">
						<view class="center_title">

							<text>{{$lan('请输入新的钱包名称')}}</text>


						</view>
						<view class="center_content">

							<input type="text" v-model="newName" :placeholder="this.$lan('请输入新的钱包名称')">


						</view>
						<!-- <text class="center_txt"> *用户名不得超过20个字符</text> -->
						<view class="center_button">

							<view class="btn1" @click="cancel1">{{$lan('取消')}}</view>
							<view class="btn2" @click="changeWalletName">{{$lan('保存')}}</view>
						</view>
					</view>
				</uni-popup>
				<view class="main_left">
					<image src="../../static/image/my/icon-dzb.png"></image>
					<text>{{$lan('钱包名称')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"  @tap="toChangePwd">
				<uni-popup ref="popup2" type="center" :mask-click="false"><view  class="popupsCenter">
					<view class="center_title"  v-model="changePswData.changePswModel"
					:closable="false"
					:mask-closable="false"
					:title="this.$lan('修改密码')"
					>{{$lan('修改密码')}}</view>
					<!-- @on-ok="changePswOk"
					@on-cancel="changePswCancel" -->
					<view class="center_text">
						<!--  -->
						<!--  -->
						<!--  -->
					<input type="password" :value="changePswData.oldPsw"   :placeholder="this.$lan('请输入密码')" @input="oldPaw($event,'oldPsw')">
					<input type="password" :value="changePswData.newPsw"   :placeholder="this.$lan('请输入新密码')"  @input="newPsw($event,'newPsw')">
					<input type="password" :value="changePswData.againNewPsw"  :placeholder="this.$lan('再次确认新密码')"  @input="againNewPsw($event,'againNewPsw')">

					</view>
					<view class="center_button">
						<view class="btn1" @click="cancel">{{$lan('取消')}}</view>
						<view class="btn2" @click="preservation">{{$lan('保存')}}</view>
					</view>

					</view>
				</uni-popup>
				<view class="main_left">
					<image src="../../static/image/my/icon-xgmm.png"></image>
					<text>{{$lan('修改密码')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"  v-if="defaultWallet.type=='mnemonic'" @tap="toPrivateKeyTip(1)">
				<view class="main_left">
					<image src="../../static/image/my/icon-dczjc.png"></image>
					<text>{{$lan('导出助记词')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
			<view class="main"   @tap="toPrivateKeyTip(2)">
				<view class="main_left">
					<image src="../../static/image/my/icon-dcsy.png"></image>
					<text>{{$lan('导出私钥')}}</text>
				</view>
				<view class="main_right"><image  src="../../static/image/my/icon-yjt.png"></image></view>
			</view>
		</view>
		<view class="myMain">
			<view class="main" @click="toAddressList">
				<view class="main_left">
					<image src="../../static/image/my/icon-dzbb.png"></image>
					<text>{{$lan('地址簿')}}</text>
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
                    oldPsw_pswLog_noBlank:this.$lan('密码不能为空，请重新输入') ,
                    oldPsw_pswLog_noBlank_Flag: 'none',

                    newPsw: '',
                    newPsw_pswLog_noBlank:this.$lan('密码不能为空，请重新输入') ,
                    newPsw_pswLog_noBlank_Flag: 'none',
                    pswLog_pattern:this.$lan('密码由5-20位数字字母组成，请重新输入'),
                    pswLog_pattern_Flag: 'none',

                    againNewPsw: '',
                    againNewPsw_pswLog_noBlank:this.$lan('密码不能为空，请重新输入') ,
                    againNewPsw_pswLog_noBlank_Flag: 'none',
                    pswLog_equality:this.$lan('两次输入密码不相等，请重新输入'),
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
        //     text:this.$lan('我的')
        // });
        // },
		methods: {
			// toDemo(){
			// 	console.log('去 demo 页');
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
			//删除钱包
			toDeleteWallet() {
				this.$refs.popup1.open()
			},
			//备份助记词
			// toPrivateKeyTip(){

			// 	this.$refs.popup1.close()
			// 	console.log("备份助记词")
			// 	// uni.navigateTo({ url: `/pages/privateKey/tip`})

			// },
			//已备份删除钱包
			deleteWalletAndSetDefault(){
				// console.log("已备份删除钱包")
				this.$refs.popup1.close()
				console.log('this.defaultWallet',this.defaultWallet,this.walletList);
				aboutWallet.deleteWalletAndSetDefault(this.defaultWallet.address);
				// deleteWalletAndSetDefault(this.defaultWallet)
					uni.showToast({
					title:this.$lan('删除成功'),
					icon: 'none',
					duration: 2000
				});


			},
			//修改密码
			toChangePwd(){
				console.log(this.changePswData.oldPsw,this.changePswData.newPsw,this.changePswData.againNewPsw)
				this.changePswData.oldPsw=''
				this.changePswData.newPsw=''
				this.changePswData.againNewPsw=''
				this.$refs.popup2.open()
				this.changePswModel = true;
			},


			// 修改密码
             preservation() {
				 console.log('123123');
				let self = this;

				// console.log(self.validPsw())
				// console.log(this.defaultWallet.address)
				// console.log(self.changePswData.oldPsw)
				if(!aboutWallet.checkPassword(this.defaultWallet.address,self.changePswData.oldPsw)){
					uni.showToast({
					title:this.$lan('旧密码错误!'),
					icon: 'none',
					duration: 2000
					})
					this.changePswData.oldPsw=''
					console.log('校验旧密码');
					return;
				}
				console.log('333333');
                if(self.changePswData.oldPsw  ===  self.changePswData.newPsw){
					uni.showToast({
					title:this.$lan('校验旧密码与新密码!'),
					icon: 'none',
					duration: 2000
					})
					console.log('校验旧密码与新密码');
					return;
				}
				console.log('4444444');

				 if(self.changePswData.newPsw==self.changePswData.againNewPsw){
					uni.showToast({
					title:this.$lan('修改密码成功!'),
					icon: 'none',
					duration: 2000
					})
					this.$refs.popup2.close()
					aboutWallet.changePassword(this.defaultWallet.address,self.changePswData.oldPsw,self.changePswData.newPsw)

                }else{
					uni.showToast({
					title:this.$lan('修改密码失败，请重新修改!'),
					icon: 'none',
					duration: 2000
				});
					this.changePswData.oldPsw=''
					this.changePswData.newPsw=''
					this.changePswData.againNewPsw=''
                }
            },
			//修改密码 取消
			cancel(){
				this.$refs.popup2.close()
			},
			//修改密码 保存
			// preservation(){
			// 	console.log("原密码",this.pwdVal)
			// 	console.log("新密码",this.newPwd)
			// 	console.log("确认密码",this.confirmPwd)

			// },
			// toPrivateKeyTip() {
			// 	// uni.navigateTo({ url: `/pages/privateKey/tip`})
			// },
			//修改钱包名称
			toChangeWalletName(){
				console.log("修改钱包")
				console.log(this.defaultWallet.address)
				// console.log('this.defaultWallet',this.walletList);
				// console.log('this.walletList',this.walletList);
				console.log('this.defaultWallet',this.defaultWallet);
				console.log('this.walletList',this.walletList);
				this.$refs.popup3.open()
			},
			//修改钱包名称取消
			cancel1(){
				this.$refs.popup3.close()
			},
			//修改钱包名称确认
			changeWalletName(){
				console.log("名称",this.newName)
				aboutWallet.changeWalletName(this.defaultWallet.address,this.newName);
				uni.showToast({
					title:this.$lan('修改钱包名称成功'),
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
							console.log("旧密码111",this.changePswData.oldPsw)
						},0)
						break;
					}
				}
				// console.log("旧密码",)
				// console.log("e",e.detail)
				// this.changePswData.oldPsw = e.detail
				// console.log("旧密码111",this.changePswData.oldPsw)

			},
			newPsw(a,flag){
				switch(flag){
					case 'newPsw':{
						setTimeout(()=>{
							this.changePswData.newPsw = a.target.value
							console.log("新密码111",this.changePswData.newPsw)
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
							console.log("0新密码111",this.changePswData.againNewPsw)
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
		width: 100%;
		height: 100%;
		// background-color: #FFFFFF;
		.myCont{
			width: 100%;
		height: 100%;
		}
		.myTop {
			width: 100%;
			height: 400rpx;
			margin: 0 auto;
			margin-bottom: 16rpx;
			/* border-radius: 28rpx; */
			background-image: url(../../static/image/my/myBanner.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;

			.top {
				width: 88%;
				margin: 0px auto;
				height: 130rpx;
				/* margin-bottom: 14rpx; */
				display: flex;
				// justify-content: flex-start;
				justify-content: space-around;
				align-items: center;

				.topImg {
					background-color: #FFFFFF;
					width: 130rpx;
					height: 130rpx;
					border-radius: 50%;
					image{
						width: 100%;
						height: 100%;
					}
				}

				.topTxt {

					display: flex;
					// flex: 1;
					width: 72%;
					margin-left: 28rpx;
					flex-direction: column;
					justify-content: flex-start;
					// align-items: center;
					// width: 130rpx;
					height: 130rpx;

					.topTxt_top {
						width: 100%;
						margin: 0 auto;
						display: flex;
						font-size: 36rpx;
						margin-top: 4rpx;
						margin-bottom: 20rpx;

						text-align: center;
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
					}

					.topTxt_bottom {
						display: flex;
						margin-top: 10rpx;

						// margin-bottom: 4rpx;
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 16rpx;
						}

						text {
							font-size: 28rpx;
							width: 362rpx;
							height: 40rpx;
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
			margin: 0 auto;
			margin-top: -100rpx;
			margin-bottom: 20rpx;
			display: flex;
			border-radius: 20rpx;
			justify-content: space-around;
			align-items: center;
			background-color: #FFFFFF;
			.nav{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				image{
					// margin-bottom: 10rpx;
					width: 40rpx;
					height: 40rpx;
				}
				text{
					margin-top: 24rpx;
					color: #333333;
					font-size: 30rpx;
					}
			}
		}
		.myMain,.myMains{
			border-radius: 12rpx;
			width: 686rpx;
			margin: 0rpx auto;
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			background-color: #FFFFFF;
			font-size: 30rpx;
			color: #343434;
			.main{
				width: 88%;
				height: 100rpx;
				margin: 0 auto;
				padding-right: 40rpx;
				margin-right: -2rpx;

				// padding-bottom: 18rpx;
				display: flex;
				// flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.main_left{
					height: 100rpx;
					display: flex;
					// flex-direction: column-reverse;
					justify-content: space-between;
					align-items: center;
					image{
						width: 40rpx;
						height: 40rpx;
						margin-right: 14rpx;
					}

				}
				.main_right{
					image{

						width: 16rpx;
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
