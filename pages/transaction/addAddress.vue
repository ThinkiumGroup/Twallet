<template>
	<view class="add-address-container">
		<nav-bar :title="title" >
		
		</nav-bar>
		<view class="add-address-body">
			<view class="add-address-form">
				<view class="form-item">
					<view class="form-item-label">{{$lan('地址名称')}}</view>
					<input 
						type="text" 
						:placeholder="this.$lan('请输入地址名称备注(必填)')"
						class="form-item-input"
						v-model="formData.name"
					>
				</view>
				<view class="form-item">
					<view class="form-item-label">{{$lan('地址')}}</view>
					<input 
						type="text" 
						:placeholder="this.$lan('请输入钱包地址(必填)')"
						
						class="form-item-input"
						v-model="formData.address"
					>
				</view>
				<view class="form-item">
					<view class="form-item-label">{{$lan('手机号')}}</view>
					<input 
						type="text" 
						:placeholder="this.$lan('请输入手机号(必填)')"
						
						class="form-item-input"
						v-model="formData.phone"
					>
				</view>
				<view class="form-item-remark">
					<view class="dot"></view>
					<text>{{$lan('手机号可用于获取转账确认短信')}}</text>
				</view>
			</view>
			<view
				class="addAddress-submit"
				@click="saveSubmit"
			>
			{{$lan('保存')}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:this.$lan('添加地址'),
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
					this.$showToast(this.$lan('名称不能为空'))
					return
				}
				if(address == '') {
					this.$showToast(this.$lan('地址不能为空'))
					return
				}
				if(phone == '') {
					this.$showToast(this.$lan('手机号不能为空'))
					return
				}
				this.$store.commit('setAddressList', [this.formData])
				this.$showToast(this.$lan('添加成功'))
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
