<template>
	<view class="page-wrap">
		<nav-bar :title="type == 1 ? $lan('backupMnemonic'): $lan('exportPrivateKey')" style="position: fixed;top:0;z-index: 999"></nav-bar>
		<view class="content-wrap" v-if="type == 1">
			<image class="private-key-img" src="../../static/image/wallet/privateKey.png" mode=""></image>
			<text class="tip-label">{{$lan('prompt')}}</text>
			<view class="tip-value">
				{{$lan('theUseOfMnemonics')}}
			</view>
			<view class="tip-title">
				{{$lan('backupMnemonic')}}
			</view>
			<view class="tip-content">
				{{$lan('copyTheMnemonicWordsOnPaper2')}}
			</view>
			<view class="tip-title">
				{{$lan('keepMnemonicWords')}}

			</view>
			<view class="tip-content">
				{{$lan('pleaseKeepTheMnemonicPhraseProperly')}}
			</view>
			<view class="tip-footer">
				{{$lan('WonotAskForPrivateKey')}}
			</view>
			<view class="next-btn" @click="handleNextBtnClick">
				{{$lan('nextStep')}}
			</view>
		</view>
		<view class="content-wrap" v-if="type == 2">
			<image class="private-key-img" src="../../static/image/wallet/privateKey.png" mode=""></image>
			<text class="tip-label">{{$lan('prompt')}}</text>
			<view class="tip-value">
				{{$lan('theUseOfPrivateKeys')}}
			</view>
			<view class="tip-title">
				{{$lan('backupPrivateKey')}}
			</view>
			<view class="tip-content">
				{{$lan('pleaseCopyThePrivateKeyOnPaper')}}
			</view>
			<view class="tip-title">
				{{$lan('keepPrivateKey')}}
			</view>
			<view class="tip-content">
				{{$lan('pleaseKeepThePrivateKeyProperly')}}
			</view>
			<view class="tip-footer">
				{{$lan('willNotAskForPrivateKey')}}
			</view>
			<view class="next-btn" @click="handleNextBtnClick">
				{{$lan('nextStep')}}
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
				type: '', // 1 mnemonic word, 2 private key
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
         throw new Error('The type attribute is missing in the link')
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
