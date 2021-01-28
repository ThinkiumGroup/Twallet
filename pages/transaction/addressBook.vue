<template>
	<view class="address-book-container">
		<nav-bar :title="title" >
			<view slot="rightBtn" @click="goAddAddress">+</view>
		</nav-bar>
		<view class="address-book-body">
			<view class="address-search-container">
				<view class="address-search-input">
					<icon-font src="search" width="40rpx" height="40rpx"/>
					<input
						style="margin-left: 16rpx;"
						type="text"
						:placeholder="this.$lan('pleaseEnterKeywordsToSearch')"

						v-model="searchValue"
					/>
				</view>
				<view class="address-search-btn" @click="searchAddress">
						<icon-font src="filter" width="40rpx" height="40rpx"/>
						<text style="margin-left: 14rpx;">{{$lan('filter')}}</text>
				</view>
			</view>
			<view
				v-for="(item, index) in addressData"
				class="address-item"
				:key="index"
				@click="toTransfer(item.address)"
			>
				<text>{{item.name}}</text>
				<view>{{item.address}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title:this.$lan('addressBook'),
				addressData: [],
				searchValue: '',
				transferAmount: 0,
				tokenType: 0,
			}
		},
		onLoad({ amount, tokenType }) {
			this.transferAmount = amount
			this.tokenType = tokenType
		},
		onShow() {
			this.addressData = this.addressList
		},
		computed: {
			...mapState(['addressList']),
		},
		methods: {
			goAddAddress() {
				uni.navigateTo({
					url: '/pages/transaction/addAddress'
				})
			},
			searchAddress() {
				this.addressData = this.addressList.filter(v => v.name.includes(this.searchValue))
			},
			toTransfer(address) {
				uni.navigateTo({
					url: `/pages/transaction/transfer?address=${address}&transferAmount=${this.transferAmount}&tokenType=${this.tokenType}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.address-book-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		.address-book-body {
			flex: 1;
			overflow: auto;
			padding: 38rpx 32rpx;
			box-sizing: border-box;
			.address-search-container {
				display: flex;
				justify-content: space-between;
				height: 80rpx;

				.address-search-input {
					flex: 1;
					background: #fff;
					border-radius: 40rpx;
				}
				.address-search-input {
					display: flex;
					align-items: center;
					box-sizing: border-box;
					margin-right: 19rpx;
					padding: 0 26rpx;
				}
				.address-search-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 167rpx;
					color: #243FFF;
					background: #fff;
					box-sizing: border-box;
					border-radius: 40rpx;
				}

			}
			.address-item {
				padding: 37rpx 0 37rpx 48rpx;
				box-sizing: border-box;
				background: #fff;
				border-radius: 20rpx;
				margin-top: 26rpx;
				text {
					font-weight: 500;
				}
				view {
					width: 560rpx;
					overflow: hidden;
					white-space: normal;
					text-overflow: ellipsis;
					color: #999999;
					margin-top: 10rpx;
					font-size: 26rpx;
				}
			}
		}
	}
</style>
