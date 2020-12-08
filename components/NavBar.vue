<template>
	<view class="nav-bar-container" :style="{...containerStyle, paddingTop: customBar + 27 + 'rpx'}">
		  <view v-if="isgoBack" @click="goBack" class="nav-bar-placeholder-left">
				<icon-font src="return" width="17rpx" height="32rpx"/>
			</view>
			<view v-if="$slots.leftBtn" class="nav-bar-placeholder-left" >
				<slot  name="leftBtn"/>
			</view>
			<view  v-if="$slots.title">
					<slot name="title"></slot>
			</view>
			<text v-else class="nav-bar-title">{{title}}</text>
			<view v-if="$slots.rightBtn" class="nav-bar-placeholder-right" >
				<slot  name="rightBtn"></slot>
			</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			isgoBack: {
				type: Boolean,
				default: true
			},
			confirm: {
				type: Boolean,
				default: false
			},
			containerStyle: {
				type: Object,
				default: function () {
					return {}
				}
			}
			
		},
		data() {
			return {
				// #ifndef H5
				customBar: plus.navigator.getStatusbarHeight(),
				// #endif
				// #ifdef H5
				customBar: 0,
				// #endif

			}
		},
		methods: {
			goBack() {
				this.confirm ? this.$emit('customizeBack') : uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar-container {
		width: 100%;
		display: flex;
		font-size: 36rpx;
		align-items: center;
		justify-content: center;
		padding: 27rpx 32rpx;
		background: #fff;
		box-sizing: border-box;
		box-shadow: 0rpx 4rpx 10rpx 0rpx #E8EBEF;
		position: relative;
		.nav-bar-placeholder-left {
			position: absolute;
			left: 32rpx;
		}
		.nav-bar-placeholder-right {
			position: absolute;
			right: 32rpx;
		}
		.nav-bar-title{
			font-size: 36rpx;
			font-weight: 600;
			color: #343434;
		}
	}
</style>
