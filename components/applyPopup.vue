<template>
	<UniPopup ref="applyPopup" type="center">
		<view class="apply-wrap">
			<text class="title">申请公证确认</text>
			<p class="content">公证提供方：长治互联网公证处预估费用：￥600.00~1200.00</p>
			<text class="tip">公证费用及公证时间将由公证处线下与您联系</text>
			<view class="btn-wrap">
				<view class="btn" @tap="closeApplyPopup">
					暂不申请
				</view>
				<view class="btn apply-btn" @tap="applyConfirm()">
					确认申请
				</view>
			</view>
		</view>
	</UniPopup>
</template>

<script>
	import UniPopup from '@/components/uni-popup/uni-popup.vue'
	import { applyNotarization } from '@/apis/cert.js'
	export default {
		props: {
			certId: {
				type: Number,
				default: 124
			}
		},
		components: {
			UniPopup
		},
		data() {
			return {}
		},
		methods: {
			showApplyPopup() {
				this.$refs.applyPopup.open()
			},
			closeApplyPopup() {
				this.$refs.applyPopup.close()
			},
			async applyConfirm() {
				// let data = {
				// 	certId: Number(this.certId)
				// }
				let res = await applyNotarization(this.certId)
				if(res.code == 200 ) {
					this.closeApplyPopup()
					let parent = this.$parent.$parent
					console.log(parent,'我是你爸爸')
					//这是处理父组件列表情况下的逻辑
					if(parent.pageIndex) {
						//假设修改的是第三页的数据，保留前二十条数据，然后请求修改的页数的数据push进去
						const INDEX = parent.dataList.findIndex(element => element.id == this.certId)
						parent.pageIndex = parseInt(INDEX / 10) + 1
						parent.pullUpOn = true
						parent.isMoreData = true
						if(parent.pageIndex == 1) {
							parent.dataList = []
						} else if(parent.pageIndex > 1) {
							parent.dataList = parent.dataList.slice(0, (parent.pageIndex - 1) * 10)
						}
					}
					parent.getData()
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.apply-wrap {
		width: 530rpx;
		height: 683rpx;
		background: url(@/static/image/global/popupBg.png) no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			padding-top: 348rpx;
			color: #0B1431;
			font-size: 38rpx;
			line-height: 38rpx;
			font-weight: bold;
		}
		.content {
			color: #0B1431;
			font-size: 32rpx;
			line-height: 45rpx;
			width: 450rpx;
			margin-top: 40rpx;
			margin-bottom: 18rpx;
		}
		.tip {
			color: #555555;
			font-size: 22rpx;
			line-height: 22rpx;
		}
		.btn-wrap {
			width: 382rpx;
			display: flex;
			margin-top: 28rpx;
			.btn {
				width: 158rpx;
				height: 56rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #445E85;
				border-radius: 6rpx;
				color: #FFFFFF;
				font-size: 30rpx;
				
			}
			.apply-btn {
				margin-left: 66rpx;
				background-color: #2B4469;
			}
		}
	}
</style>
