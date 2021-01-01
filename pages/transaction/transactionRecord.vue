<template>
	<view class="transfer-contariner">
		<view class="transfer-header">
			<nav-bar :containerStyle="{boxShadow: '0 0'}">
				<ms-dropdown-menu slot="title" v-if="tokenList.length > 1">
					<ms-dropdown-item v-model="tokenType" :list="tokenList" />
				</ms-dropdown-menu>
				<text slot="title" v-else>TKM</text>
			</nav-bar>

			<view class="tab-bar">
				<text
					v-for="(item, index) in tabList"
					:key="item.id"
					class="tab-bar-item"
					:class="index == tabIndex && 'tab-bar-item-active'"
					@click="switchTab(index)"
				>
					{{item.name}}
				</text>
			</view>
		</view>
		<swiper class="transfer-swiper" :current="tabIndex" @change="swiperChange">
			<swiper-item  v-for="(page, index) in tabList" :key="index">
				<scroll-view
					class="swiper-item"
					scroll-y="true"
					@scrolltolower="scrollMonitor"
					:lower-threshold="20"
				>
					<view
						class="transfer-list-item"
						v-for="(item, key) in pageData"
						:key="key"
					>
						<image class="transfer-list-item-type" :src="typeImgUrl[index]" mode=""></image>
						<view class="transfer-list-item-content">
							<text @click="copyData(item.tradingHash)" class="transfer-list-item-hash">{{item.tradingHash}}</text>
							<!-- <text class="transfer-list-it em-hash">{{chainInfo[item]}}</text> -->
							<text class="transfer-list-item-time">{{item.timeStamp | formatDate}}</text>
						</view>
						<!-- <image class="transfer-list-item-status" src="../../static/icon/transferSuccess.png" mode=""></image> -->
						<view class="transfer-list-item-money" :style="{color: index == 0 && '#34CE9A'}">
							<view class="transfer-list-item-money-top">
								<text class="transfer-list-money-num">
									{{index == 0 ? '+' : '-' }} {{ tokenType ? numberChange(item.tokenNum || 0) : numberChange(item.currencyAmount)}}
								</text>
								<text class="transfer-list-money-token">{{tokenNname}}</text>
							</view>
							<view class="transfer-list-item-money-btm">交易成功</view>
						</view>
					</view>
					<view class="transfer-list-item" v-if="isMore">{{$lan('正在加载...')}}</view>
					<view  class="transfer-list-item" v-if="noMore">{{$lan('没有更多了')}}</view>
				</scroll-view>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item'
	import { transferTypeUrl } from '@/utils/data/enums.js'
	import { mapState } from 'vuex'
	import { aboutWallet } from '@/utils/businessCommon.js'
	import { copy } from "@/utils/common.js"
	import {
		getTokenHoldingsForWallet,
		getTraingListInOneZeroThree,
		getTradingList
	} from '@/apis/transfer'
	import {
		getAddressList
	} from '@/apis/home.js'
	import _ from 'lodash'
	export default {
		components: {
			msDropdownMenu,
			msDropdownItem,
		},
		data() {
			return {
				title:this.$lan('TKM的交易记录'),
				tabList: [{
						id: 0,
						parentType: 3,
						childType: 302,
						name:this.$lan('转入'),
					},
					{
						id: 1,
						parentType: 3,
						childType: 301,
						name:this.$lan('转出'),
					},
					{
						id: 2,
						parentType: 2,
						childType: '',
						name:this.$lan('闪兑'),

					},
					{
						id: 3,
						parentType: 7,
						childType: null,
						name:this.$lan('跨链'),
					}
				],
				tabListClone: [],
				tabIndex: 0,
				typeImgUrl: transferTypeUrl,
				parentType: 3,
				childType: 302,
				timeStamp: '',
				page: 1,
				rows: 15,
				total: 0,
				pageData: [],
				isMore: false,
				noMore: false,
				tables: [],
				tokenList: [],
				tokenType: 0,
				contractAddress: '',
				chainInfo: {
					1: this.$lan('账户链'),
					2: this.$lan('奖励连'),
					103: this.$lan('商业链'),
				},
				tokenNname: 'TKM',
			}
		},
		watch: {
			//切换通证
			async tokenType(newVal) {
				if(!this.tokenList.length) {
					await this.getTokenList()
				}
				// 0代表主币
				const tokenItem = this.tokenList.find(v => v.value == newVal)
				this.contractAddress = tokenItem && tokenItem.contractAddress
				this.tokenNname = tokenItem && tokenItem.text
				if(newVal) {
					this.tabList = this.tabListClone.filter(v => v.id != 2 && v.id != 3)
					this.clearData()
					//tkm切换到token时 如果选中的为 闪对或者跨链重置为转入展示
					//否则直接继承
					if(this.tabIndex == 2 || this.tabIndex == 3) {
						this.tabIndex = 0
					} else {
						this.getTokenTransferList({ transType: this.tabIndex })
					}
				} else {
					this.tabList = this.tabListClone
					this.clearData()
					this.getData()
				}


			}
		},
		onLoad({ tokenType }) {
			this.tokenType = Number(tokenType)
			this.contractAddress = [this._contractAddress.CONTRACT_ROUTER, this._contractAddress.CONTRACT_FLASH_SWAP, this._contractAddress.CONTRACT_FLASH_SWAP_POOL];
		},
		onShow() {
			if(!this.tokenType) {
				this.getTokenList()
				this.getData()
			}
			this.tabListClone = _.cloneDeep(this.tabList)
		},
		computed: {
			...mapState(['defaultWallet', '_contractAddress']),
		},
		methods: {
			copyData(data) {
				copy(data)
				uni.showToast({
					title: this.$lan('复制成功'),
					icon: 'none',
					duration: 2000
				});
			
			},
			
			numberChange(nums) {
				return aboutWallet.toRegularNumber(nums)
			},

			switchTab(index) {
				this.tabIndex = index
			},

			//页面类型切换时
			swiperChange(e) {
				//获取对应的type
				this.tabIndex = e.target.current
				this.parentType = this.tabList[this.tabIndex].parentType
				this.childType = this.tabList[this.tabIndex].childType
				this.clearData()
				//通证交易记录和tkm交易记录
				if(this.tokenType) {
					const transType =  this.tabIndex ? 0 : 1
					this.getTokenTransferList({ transType })
				} else {
					this.getData()
				}

			},

			clearData() {
				console.log(99999992)
				//每次切换页面清空数据
				this.pageData  = []
				this.page = 1
				this.timeStamp = ''
				this.noMore = false //隐藏没有更多
			},

			//滚动到底部
			scrollMonitor() {
				if(this.total > this.pageData.length) {
					this.getData()
				} else {
					this.noMore = true //打开没有更多
					this.isMore = false //隐藏正在加载loading
				}
			},

			//获取主币交易记录数据
			async getData() {
				 let data = {
					parentType: this.parentType,
					page: this.page,
					rows: this.rows,
					timeStamp: this.timeStamp,
					address: this.defaultWallet.address,
					childType: this.childType,
					tables: this.tables,
				}
				//获取闪兑记录 添加参数
				if(this.tabIndex === 2) {
					const paramsData = {
						contractAddresss: this.contractAddress,
						chainId: 103,
					}
					data = { ...data, ...paramsData }
				}

				this.getDataFn(data, getTradingList)
			},



			//获取token列表
			async getTokenList() {
				const paramsData = {
					chainId: 103,
					accountAddress: this.defaultWallet.address,
					contractAddress: "",
					page: 1,
					rows: 1000
				}
				const { data } = await getAddressList(paramsData)
				const tokenList = data.data.map((v, index) => {
					return {
						text: v.tokenName,
						value: index + 1,
						contractAddress: v.contractAddress,
					}
				})
				tokenList.unshift({
					text: 'TKM',
					value: 0,
					contractAddress: [this._contractAddress.CONTRACT_ROUTER, this._contractAddress.CONTRACT_FLASH_SWAP, this._contractAddress.CONTRACT_FLASH_SWAP_POOL]
				})
				if(this._contractAddress) {
					// this._contractAddress.CONTRACT_ROUTER
					console.log(this._contractAddress)
					console.log(this._contractAddress.CONTRACT_ROUTER, 99999)
				}
				
				this.tokenList = tokenList
				console.log(this.tokenList , 9000)
			},

			//获取token交易记录
			async getTokenTransferList({ transType }) {
				const data = {
					address: this.defaultWallet.address,
					orderType: '',
					transType,
					tables: this.tables,
					timeStamp: this.timeStamp,
					contractAddresss: [this.contractAddress],
				}
				this.getDataFn(data, getTraingListInOneZeroThree)
			},

			async getDataFn(paramsData, asyncFn ) {

				this.isMore = true
				this.page++
				this.tables = _.cloneDeep(this.pageData.slice(this.pageData.length -10, this.pageData.length))
				this.tables = this.tables.map(item => item = {chainId:item.chainId, tableName:item.tableName, tableId:item.tableId})
				const { data } = await asyncFn(paramsData)
				const list = data.data

				this.total = data.total
				this.pageData = [...this.pageData, ...list ]
				this.timeStamp = list.length && list[list.length -1].timeStamp
				if(this.total <= this.rows) { //数据比较少不足一屏幕 无法触发滚动事件时
					this.isMore = false //隐藏正在加载loading
					this.noMore = true //打开没有更多
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.transfer-contariner {
		height: 100%;
		display: flex;
		flex-direction: column;

		.transfer-header {
			.tab-bar {
				display: flex;

				height: 100rpx;
				background: #fff;
				margin: 20rpx 0;
				.tab-bar-item {
					width: 25%;
					text-align: center;
					line-height: 100rpx;
					position: relative;
				}

				.tab-bar-item-active {
					color: #243FFF;
					font-weight: 600;
				}

				.tab-bar-item-active:after {
					content: '';
					width: 24rpx;
					height: 5rpx;
					background: #243FFF;
					position: absolute;
					bottom: 0;
					right: 45%;

				}
			}
		}
		.transfer-swiper {
			flex: 1;
			.swiper-item {
				height: 100%;
				.transfer-list-item {
					display: flex;
					align-items: center;
					justify-content: center;
					padding:23rpx 0 ;
					padding-left: 42rpx;
					padding-right: 21rpx;
					box-sizing: border-box;
					border-bottom: 1px solid #EEEEEE;
					background: #fff;
					.transfer-list-item-type {
						width: 37rpx;
						height: 36rpx;

						margin-right: 33rpx;
					}
					.transfer-list-item-content {
						display: flex;
						flex-direction: column;
						margin-right: 50rpx;
						.transfer-list-item-hash {
						width: 282rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						font-size: 26rpx;
						}
						.transfer-list-item-time {
							color: #999999;
							font-size: 22rpx;
						}
					}
					.transfer-list-item-status {
						width: 73rpx;
						height: 66rpx;

					}
					.transfer-list-item-money {
						width: 273rpx;
						color: #FF4A4A;
						text-align: right;

						.transfer-list-item-money-top {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							.transfer-list-money-num {
								font-size: 30rpx;
								font-weight: 500;
								text-align: right;
							}
							.transfer-list-money-token {
								font-size: 22rpx;
								margin-left: 10rpx;

							}
						}
						.transfer-list-item-money-btm {
							font-size: 22rpx;
							color: #999;
						}

					}

				}
			}
		}

	}
</style>
