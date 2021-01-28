<template>
	<div class="page-wrap">
		<nav-bar :title="this.$lan('createWallet')" ></nav-bar>
		<view class="password-wrap">
			<input type="text" v-model="walletName" :placeholder="this.$lan('pleaseEnterTheWalletName')"  />
			<input type="password"  v-model="password" :placeholder="this.$lan('pleaseSetWalletPassword2')"  />
			<input type="password"  v-model="repeatPassword" :placeholder="this.$lan('repeatPassword')" />
		</view>
		<view class="create-btn" @tap="beginCreate">
			{{$lan('startCreating')}}
		</view>
		<view class="tip-wrap">
			<text>{{$lan('tips')}}</text>
			<view>
				{{$lan('setThePasswordLengthReasonably')}}
			</view>
		</view>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		name: 'createWallet',
		data() {
			return {
				walletName: '',
				password: '',
				repeatPassword: ''
			}
		},
		methods: {
			...mapMutations(['saveNameAndPassword']),
			beginCreate() {
				if(!this.walletName) {
					uni.showToast({
						title:this.$lan("pleaseEnterTheWalletName"),
						icon: "none"
					})
					return false
				}
				if(!this.password || this.password.length < 6) {
					uni.showToast({
						title:this.$lan("noLessThan6Digits"),
						icon: "none"
					})
					return false
				}
				if(!this.repeatPassword) {
					uni.showToast({
						title:this.$lan("pleaseEnterTheWalletPasswordAgain"),
						icon: "none"
					})
					return false
				}
				if(this.password != this.repeatPassword) {
					uni.showToast({
						title:this.$lan("thTwoPasswordsAreInconsistent"),
						icon: "none"
					})
					return false
				}
				let data = {
					walletName: this.walletName,
					password: this.password
				}
				this.saveNameAndPassword(data)
				uni.navigateTo({
					url: "/pages/wallet/backupMnemonic"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.password-wrap {
			width: 618rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 10rpx 34rpx;
			margin-top: 20rpx;
			input {
				padding: 32rpx 0;
			}
			input:not(:last-child) {
				border-bottom: 1px solid #DDDDDD;
			}
			.input-placeholder {
				color: #AAAAAA;
				font-size: 30rpx;
				font-weight: 400;
			}
		}

		.create-btn {
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
			margin-top: 122rpx;
			border-radius: 20rpx;
		}

		.tip-wrap {
			width: 686rpx;
			margin-top: 122rpx;
			color: #999999;
			// font-size: 28rpx;
		}
	}
</style>
