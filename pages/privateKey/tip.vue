<template>
	<view class="page-wrap">
		<nav-bar :title="type == 1 ? $lan('备份助记词'): $lan('导出私钥')" style="position: fixed;top:0;z-index: 999"></nav-bar>
		<view class="content-wrap" v-if="type == 1">
			<image class="private-key-img" src="../../static/image/wallet/privateKey.png" mode=""></image>
			<text class="tip-label">{{$lan('提示')}}</text>
			<view class="tip-value">
				{{$lan('拥有助记词可用于备份和生成整个钱包，拥有助记词等于拥有钱包资产所有权。')}}
			</view>
			<view class="tip-title">
				{{$lan('备份助记词')}}
			</view>
			<view class="tip-content">
				{{$lan('请按顺序将助记词抄写在纸上并妥善保管，如果您的设备丢失、损坏、被盗等，拥有助记词可以随时恢复您的资产。')}}
			</view>
			<view class="tip-title">
				{{$lan('保管助记词')}}

			</view>
			<view class="tip-content">
				{{$lan('请在线下妥善保管助记词至隔离网络的安全地方，请勿将助记词在联网环境下分享及存储，例如社交应用、邮箱、相册等，请勿截屏分享和存储，防止资产损失。')}}
			</view>
			<view class="tip-footer">
				{{$lan('注：官方客服不会以任何形式索要您的助记词')}}
			</view>
			<view class="next-btn" @click="handleNextBtnClick">
				{{$lan('下一步')}}
			</view>
		</view>
		<view class="content-wrap" v-if="type == 2">
			<image class="private-key-img" src="../../static/image/wallet/privateKey.png" mode=""></image>
			<text class="tip-label">{{$lan('提示')}}</text>
			<view class="tip-value">
				{{$lan('拥有私钥可用于备份和生成整个钱包，拥有私钥等于拥有钱包资产所有权')}}
			</view>
			<view class="tip-title">
				{{$lan('备份私钥')}}
			</view>
			<view class="tip-content">
				{{$lan('请将私钥抄写在纸上并妥善保管，如果您的设备丢失、损坏、被盗等，拥有私钥可以随时恢复您的资产')}}
			</view>
			<view class="tip-title">
				{{$lan('保管私钥')}}
			</view>
			<view class="tip-content">
				{{$lan('请在线下妥善保管私钥至隔离网络的安全地方，请勿将私钥在联网环境下分享及存储，例如社交应用、邮箱、相册等，请勿截屏分享和存储，防止资产损失')}}
			</view>
			<view class="tip-footer">
				{{$lan('注：官方客服不会以任何形式索要您的私钥')}}
			</view>
			<view class="next-btn" @click="handleNextBtnClick">
				{{$lan('下一步')}}
			</view>
		</view>

		<PasswordPopup ref="passwordPopup"/>

	</view>
</template>

<script>
	import {aboutWallet} from "../../utils/businessCommon";
	import { mapState } from "vuex";
	import PasswordPopup from "../../components/PasswordPopup";

	export default {
		components: { PasswordPopup },
		data() {
			return {
				type: '', // 1 助记词， 2 私钥
			}
		},
		computed: {
			...mapState(['defaultWallet'])
		},
		methods: {
			handleNextBtnClick(){
				this.$refs.passwordPopup.showPasswordPopup({
					cancel: () => {

					},
					success: async (password) => {
						let walletAddress = this.defaultWallet.address;
						if(this.type == 1){
							uni.navigateTo({
								url: `/pages/privateKey/exportMnemonic?address=${walletAddress}&password=${password}`
							})
						}else if(this.type == 2){
							uni.navigateTo({
								url: `/pages/privateKey/exportPrivateKey?address=${walletAddress}&password=${password}`
							})
						}
					},
					fail: () => {

					},
				});

			},
		},
		onLoad(option){
			if(!option.type){
         throw new Error(this.$lan('链接中缺少type属性'))
			}
			this.type = option.type
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
		// height: 100%;
		.content-wrap {
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 110rpx;
			background-color: #FFFFFF;
			width: 100%;
			// height: 100%;
			.private-key-img {
				width: 217rpx;
				height: 186rpx;
				// margin-top: 83rpx;
				padding-top: 83rpx;
			}
			.tip-label {
				font-size: 30rpx;
				line-height: 30rpx;
				font-weight: 500;
				color: $main-color;
				padding-top: 57rpx;
				padding-bottom: 18rpx;
			}
			.tip-value {
				width: 650rpx;
				text-align: center;
				color: #333333;
				font-size: 26rpx;
				line-height: 44rpx;
				font-weight: 300;
				margin-bottom: 82rpx;
			}
			.tip-title {
				width: 686rpx;
				color: #333333;
				font-size: 30rpx;
				line-height: 30rpx;
				display: flex;
				align-items: center;
				margin-top: 44rpx;
				margin-bottom: 31rpx;
				&::before {
					content: '';
					display: inline-block;
					position: relative;
					margin-right: 24rpx;
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background-color: $main-color;
				}
			}
			.tip-content {
				width: 678rpx;
				word-break: break-all;
				color: #999999;
				font-size: 26rpx;
				line-height: 38rpx;
				font-weight: 300;
			}
			.tip-footer {
				width: 678rpx;
				color: #999999;
				font-size: 26rpx;
				line-height: 26rpx;
				font-weight: 300;
				padding-top: 35rpx;
			}
			.next-btn {
				width: 686rpx;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-size: 32rpx;
				line-height: 32rpx;
				font-weight: 500;
				// background-color: #243FFF;
				background-color: $main-color;
				margin-top: 80rpx;
				// margin-bottom: 80rpx;
				border-radius: 20rpx;
			}
		}
	}
</style>
