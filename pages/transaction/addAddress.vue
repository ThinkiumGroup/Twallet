<template>
	<view class="add-address-container">
		<nav-bar :title="title" >

		</nav-bar>
		<view class="add-address-body">
			<view class="add-address-form">
				<view class="form-item">
					<view class="form-item-label">{{$lan('addressName')}}</view>
					<input
						type="text"
						:placeholder="this.$lan('pleaseEnterTheAddressNameRemark')"
						class="form-item-input"
						v-model="formData.name"
					>
				</view>
				<view class="form-item">
					<view class="form-item-label">{{$lan('address')}}</view>
					<input
						type="text"
						:placeholder="this.$lan('pleaseEnterTheWalletAddress')"

						class="form-item-input"
						v-model="formData.address"
					>
				</view>
				<view class="form-item">
					<view class="form-item-label">{{$lan('phoneNumber')}}</view>
					<input
						type="text"
						:placeholder="this.$lan('pleaseEnterYourPhoneNumber ')"

						class="form-item-input"
						v-model="formData.phone"
					>
				</view>
				<view class="form-item-remark">
					<view class="dot"></view>
					<text>{{$lan('mobilePhoneNumberFunction')}}</text>
				</view>
			</view>
			<view
				class="addAddress-submit"
				@click="saveSubmit"
			>
			{{$lan('save')}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		aboutWallet
	} from '@/utils/businessCommon'
	export default {
		data() {
			return {
				title:this.$lan('addAddress'),
				formData: {
					name: '',
					address: '',
					phone: ''
				}
			}
		},
		methods: {
			saveSubmit() {
				const { name, address, phone } = this.formData
				if(name == '') {
					this.$showToast(this.$lan('nameIsRequired'))
					return
				}
				if(address == '' || !aboutWallet.checkAddress(address)) {
					this.$showToast(this.$lan('PleaseEnterTheCorrectAddress'))
					return
				}
				if(phone == '' ||  !/^1[3456789]\d{9}$/.test(phone)) {
					this.$showToast(this.$lan('pleaseEnterTheCorrectPhoneNumber'))
					return
				}
				this.$store.commit('setAddressList', [this.formData])
				this.$showToast(this.$lan('addedSuccessfully'))
				uni.navigateBack()


			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-address-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		.add-address-body {
			flex: 1;
			overflow: auto;
			padding: 20rpx 32rpx;
			box-sizing: border-box;
			.add-address-form {
				padding:39rpx 32rpx ;
				padding-right: 0;
				border-radius: 20rpx;
				background: #fff;
				.form-item {
					margin-bottom: 40rpx;
					.form-item-label {
						font-size: 34rpx;
						font-weight: 500;
						margin-bottom: 39rpx;
					}
					.form-item-input{
						font-size: 26rpx;
						border-bottom: 1px solid #ddd;
						padding-bottom: 16rpx;
					}
				}
				.form-item-remark {
					font-size: 24rpx;
					color: #666;
					display: flex;
					align-items: center;
					.dot {
						width: 14rpx;
						height: 14rpx;
						border-radius: 50%;
						background: #243FFF;
						margin-right: 18rpx;
					}
				}
			}
			.addAddress-submit {
				padding: 15rpx 0;
				text-align: center;
				box-sizing: border-box;
				border-radius: 20rpx;
				margin-top: 122rpx;
				background: #243FFF;
				color: #fff;
				font-weight: 500;
				font-size: 32rpx;
			}
		}
	}
</style>
