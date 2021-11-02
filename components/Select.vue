<template>
	<view class="select-contanier">
		<view class="select-active" @click="isShowDropDown = !isShowDropDown">
			<text class="select-active-text">{{activeValue}}</text>
			<icon-font :src="isShowDropDown ? 'up' : 'down' " width="20rpx" height="10rpx"/>
		</view>
		<view class="drop-down" v-show="isShowDropDown">
			<view
				class="drop-down-item"
				:class="item.value == activeValue && 'drop-down-item-active'"
				v-for="(item, index) in list"
				:key="index"
				@click="handelClick(item)"
			>
				{{item.value}}
			</view>
		</view>
		<view v-if="isShowDropDown" class="select-mask" @click="maskClick">
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => ([])
			},
			value: {
				type: String,
				default: '1',
			}
		},
		watch: {
			value(val) {
				this.activeValue = this.list.find(v => v.id == val).value
			}
		},
		data() {
			return {
				activeValue: '',
				isShowDropDown: false
			}
		},
		created () {
			this.activeValue = this.list.length && this.list[0].value
		},
		methods: {
			handelClick(e) {
				this.isShowDropDown = false
				this.$emit('selectChange', e)
				this.$emit('input', e.id)
			},
			maskClick() {
				this.isShowDropDown = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-contanier {
		// width: 160rpx;
		position: relative;
		color: #606266;
		.select-active {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.select-active-text {
				margin:0 10rpx;
			}
		}
		.select-mask {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 1;
			background: rgba(0,0,0,0);

		}
		.drop-down {
			width: 160rpx;
			position: absolute;
			z-index: 10;
			top: 45rpx;
			border-radius: 8rpx;
			padding: 10rpx 0;
			background: #fff;
			border: 1px solid #dcdfe6;
		}
		.drop-down-item {
			padding: 0 5%;
		}
		.drop-down-item-active {
			color: #409eff;
			background-color: #f5f7fa;
		}
	}
</style>
