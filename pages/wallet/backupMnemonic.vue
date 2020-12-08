<template>
	<view class="page-wrap">
		<nav-bar :title="this.$lan('备份助记词')" style="position: fixed;top:0;z-index: 999"></nav-bar>
		<view class="content-wrap" v-if="pageType == 1">
			<image class="private-key-img" src="../../static/image/wallet/mnemonic.png" mode=""></image>
			<text class="tip-label">{{$lan('提示')}}</text>
			<view class="tip-value">
				{{$lan('拥有助记词可用于备份和生成整个钱包，拥有助记词等于拥有钱包资产所有权')}}
			</view>
			<view class="tip-title">
				{{$lan('备份助记词')}}
			</view>
			<view class="tip-content">
				{{$lan('请按顺序将助记词抄写在纸上并妥善保管，如果您的设备丢失、损坏、被盗等，拥有助记词可以随时恢复您的资产')}}
			</view>
			<view class="tip-title">
				{{$lan('保管助记词')}}
			</view>
			<view class="tip-content">
				{{$lan('请在线下妥善保管助记词至隔离网络的安全地方，请勿将私钥在联网环境下分享及存储，例如社交应用、邮箱、相册等，请勿截屏分享和存储，防止资产损失')}}
			</view>
			<view class="tip-footer">
				{{$lan('注：官方客服不会以任何形式索要您的助记词')}}
			</view>
			<view class="next-btn" @tap="createMnemonicWord">
				{{$lan('下一步')}}
			</view>
		</view>
		<view class="content-wrap-2" v-if="pageType == 2">
			<view class="warning-wrap">
				<view><image class="warning-img" src="../../static/image/wallet/warning.png" mode=""></image></view>
				<text>{{$lan('请勿将助记词在联网环境下分享及储存，例如社交应用、邮箱、相册等')}}</text>
			</view>
			<view class="please">
				{{$lan('请按照顺序将助记词抄写在纸上并妥善保管')}}
			</view>
			<view class="mnemonicWords-wrap">
					<view class="mnemonicWords-item" v-for="item in mnemonicWordsList">
						{{item}}
					</view>
			</view>
			<view class="last-tip">{{$lan('注：官方客服不会以任何形式索要您的助记词')}}</view>
			<view class="next-btn" @tap="saveMnemonicWords" style="position: absolute;bottom: 140rpx;">
				{{$lan('下一步')}}
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from "vuex"
	import walletApi from "../../apis/walletApi.js"
	export default {
		data() {
			return {
				pageType: 1,
				mnemonicWordsList: []
			}
		},
		methods: {
			...mapMutations(['setMnemonicWords']),
			async createMnemonicWord() {
				this.mnemonicWords = await walletApi.createMnemonicWords();
				this.mnemonicWordsList = this.mnemonicWords.split(' ')
				this.pageType = 2
			},
			saveMnemonicWords() {
				this.setMnemonicWords(this.mnemonicWords)
				uni.navigateTo({
					url: "/pages/wallet/verifyMnemonicWord"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
		margin: 0 auto;
		margin-top: 80rpx;
		// margin-bottom: 140rpx;
		border-radius: 20rpx;
	}
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
				height: 195rpx;
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
		}
		.content-wrap-2 {
			margin-top: 110rpx;
			padding: 32rpx;
			.warning-wrap {
				display: flex;
				padding-bottom: 42rpx;
				border-bottom: 2rpx solid #DDDDDD;
				.warning-img {
					width: 28rpx;
					height: 25rpx;
					margin-right: 18rpx;
					margin-top: 12rpx;
				}
				text {
					color: #243FFF;
					font-size: 26rpx;
					line-height: 44rpx;
					font-weight: 300;
				}
			}
			.please {
				color: #333333;
				font-size: 26rpx;
				line-height: 26rpx;
				margin-top: 48rpx;
				margin-bottom: 54rpx;
				&::before {
					content: "";
					display: inline-block;
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					margin-right: 24rpx;
					background-color: $main-color;
					position: relative;
					left: 0;
					bottom: 5rpx;
				}
			}
			.mnemonicWords-wrap {
				display: flex;
				flex-wrap: wrap;
				width: calc(100% - 50rpx);
				border: 2rpx solid #B0B0B4;
				// padding-top: 32rpx;
				// padding-left: 46rpx;
				padding: 32rpx 0 22rpx 46rpx;
				.mnemonicWords-item {
					margin-bottom: 10rpx;
					margin-right: 10rpx;
					color: #666666;
					font-size: 30rpx;
					line-height: 30rpx;
				}
			}
			.last-tip {
				color: #999999;
				font-size: 26rpx;
				line-height: 26rpx;
				font-weight: 300;
				padding-top: 29rpx;
			}
		}
	}
</style>
