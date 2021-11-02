<template>
	<view class="receive-money-container">
		<nav-bar>
			<ms-dropdown-menu slot="title" v-if="list.length > 1">
				<ms-dropdown-item v-model="value" :list="list" />
			</ms-dropdown-menu>
			<text slot="title" v-else>TKM</text>
		</nav-bar>
		<view class="receive-money-body">
			<view class="receive-money-content">
				<image class="token-icon" src="../../static/image/home/shoukuan.png" ></image>
				<text class="token-address-title">{{$lan('walletAddress')}}</text>
				<text class="token-address">{{$toTHAddress(defaultWallet.address)}}</text>
				<view class="copy-address" @click="copyStr($toTHAddress(defaultWallet.address))">{{this.$lan('copyAddress')}}</view>
				<view class="canvas-box">
					<canvas canvas-id="qrcode" style="width: 300rpx;height: 300rpx;" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import uQRCode from '@/utils/uqrcode.js'
	import { copy, saveHeadImgFile } from '@/utils/common.js'
	import {	mapState } from 'vuex'
	import { getTokenHoldingsForWallet } from '@/apis/transfer'
	export default {
		components: {
			msDropdownMenu,
			msDropdownItem
		},
		data() {
			return {
				value: 0,
				list: [{
						text: 'TKM',
						value: 0
					},
					{
						text: 'item2',
						value: 1
					},
					{
						text: 'item3',
						value: 2
					}
				],
				img: '',
			}
		},
		computed: {
			...mapState(['defaultWallet']),
		},
		onShow() {
			this.getTokenList()
		},
		mounted() {
			this.make()
		},
		watch: {
			value(val) {
				this.make()
			}
		},
		methods: {
			//Get token list
			async getTokenList() {
				const obj = {
					chainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN,
					accountAddress: this.defaultWallet.address,
					contractAddress: "",
					page: 1,
					rows: 1000
				}
				const { data } = await getTokenHoldingsForWallet(obj)
				const list = data.data.map((v, index) => {
					return {
						text: v.tokenName,
						value: index + 1,
					}
				})
				list.unshift({
					text: 'TKM',
					value: 0,
				})
				this.list = list
			},
			//Making QR code
			async make() {
				const {windowWidth, windowHeight} = uni.getSystemInfoSync();
				let size = 300 * windowWidth / 750;
				const address = this.$toTHAddress(this.defaultWallet.address)
				let text = encodeURIComponent(`type=transfer&address=${address}&tokenType=${this.value}`)
			// Synchronization waiting
				const res = await uQRCode.make({
					text,
					canvasId: 'qrcode',
					componentInstance: this,
					size,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.errorCorrectLevel.H
				})
				this.img = res

			},
			copyStr(data) {
				copy(data)
				uni.showToast({
					title: this.$lan('copySuccessfully'),
					icon: 'none',
					duration: 2000
				});
			},
			saveImg() {
				saveHeadImgFile(this.img, 1000)
					.then(res => {
						this.$showToast(this.$lan('savedSuccessfully'))
					})
					.catch(err => {
						console.log(err,222)
					})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.receive-money-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		.receive-money-body {
			flex: 1;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			.receive-money-content {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-top: 42rpx;
				padding-bottom: 96rpx;
				background: #fff;
				border-radius: 10rpx;
				.token-icon {
					width: 100rpx;
					height: 100rpx;
					margin-bottom: 34rpx;
				}
				.token-address-title {
					margin-bottom: 69rpx;
					color: #999999;
				}
				.token-address {
					font-size: 26rpx;
					font-weight: 500;
					color: #333333;
					margin-bottom: 40rpx;
				}
				.copy-address {
					width: 300rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					font-weight: 500;
					color: #243FFF;
					background: #EEF0F6;
				}
				.canvas-box {
					display: flex;
					justify-content: center;
					margin-top: 20rpx;
				}
			}
		}
	}
</style>
