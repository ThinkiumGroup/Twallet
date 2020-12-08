<template>
	<div class="page-wrap">
		<nav-bar :title="this.$lan('创建钱包')" ></nav-bar>
		<view class="password-wrap">
			<input type="text" v-model="walletName" :placeholder="this.$lan('请输入钱包名称')"  />
			<input type="password"  v-model="password" :placeholder="this.$lan('请设置钱包密码（不少于6位）')"  />
			<input type="password"  v-model="repeatPassword" :placeholder="this.$lan('重复密码')" />
		</view>
		<view class="create-btn" @tap="beginCreate">
			{{$lan('开始创建')}}
		</view>
		<view class="tip-wrap">
			<text>{{$lan('温馨提示：')}}</text>
			<view>
				{{$lan('Twallet不会存储用户密码，无法提供密码找回功能和重置功能，请合理设置密码强度，并妥善保管密码')}}
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
						title:this.$lan("请输入钱包名称"),
						icon: "none"
					})
					return false
				}
				if(!this.password || this.password.length < 6) {
					uni.showToast({
						title:this.$lan("请输入钱包密码且不少于6位"),
						icon: "none"
					})
					return false
				}
				if(!this.repeatPassword) {
					uni.showToast({
						title:this.$lan("请再次输入钱包密码"),
						icon: "none"
					})
					return false
				}
				if(this.password != this.repeatPassword) {
					uni.showToast({
						title:this.$lan("两次密码不一致,请重新输入"),
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
