<template>
	<view class="page-wrap">
		<nav-bar :title="this.$lan('verificationMnemonic')"></nav-bar>
		<view class="content-wrap">
			<view class="please">
				{{$lan('pleaseSelectMnemonicWordsInOrder')}}
				<view class="error-text" v-if="selectError">
					{{$lan('mnemonicWordsIsIncorrectTips')}}
				</view>
			</view>

			<view class="mnemonicWords-wrap-border">
				<view class="mnemonicWords-wrap">
					<view class="mnemonicWords-item" v-for="(item, index) in mnemonicList" @click="deleteItem(index)">
						{{item}}
					</view>
				</view>
			</view>
			<view class="rodomWords-wrap-box">
				<view class="rodomWords-wrap">
					<view class="rodomWords-item-wrap" v-for="(item, index) in rodomList">
						<view class="rodomWords-item" :key="index" @click="deleteRodomItem(index)">
							{{item}}
						</view>
					</view>
				</view>
			</view>
			<button class="btn-confirm"
				  @click="confirmClick"
							:disabled="!(mnemonicList.length == wordList.length && !selectError)"
				      :class="{active: mnemonicList.length == wordList.length && !selectError}"
				  >
				{{$lan('determine')}}
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { randomArraySort } from '../../utils/common.js'
	import walletApi from '../../apis/walletApi.js'
	import {aboutWallet} from "../../utils/businessCommon"
	export default {
		name: 'verifyMnemonicWord',
		data() {
			return {
				type: '',  // '' or 1 from the wallet creation, 2 from the exported mnemonic
				mnemonicList: [],
				wordList: [],
				rodomList: [],
				selectError: false,
				privateKey: '',
				publicKey: '',
				address: ''
			}
		},
		methods: {
			deleteItem(index) {
				let item = this.mnemonicList.splice(index, 1)
				this.rodomList.push(...item)
				this.selectError = this.compareArrays(this.mnemonicList,this.wordList)
			},
			deleteRodomItem(index) {
				let item = this.rodomList.splice(index, 1)
				this.mnemonicList.push(...item)
				this.selectError = this.compareArrays(this.mnemonicList,this.wordList)
			},
			compareArrays(array1,array2){
				let lens = array1.length;
				let selectError = false;
				for(let i = 0; i < lens; i++){
					if(array1[i] !== array2[i]){
						selectError = true;
						break;
					}
				}
				return selectError
			},
			async addWalletToList(){

				uni.showLoading({
					title: '',
					mask: true,
				});

			  // set password
				let password = this.password;
				let walletData = {
						mnemonic: this.mnemonicWords,
						name: this.walletName,
				};
				let result = await aboutWallet.addNewWallet(walletData, password);
				uni.hideLoading();
				if(result.status == 1){
					let privateKey = await walletApi.getPrivateKeyFromMnemonicWords(this.mnemonicWords.trim());
					let publicKey = walletApi.getPublicKeyFromPrivateKey(privateKey);
					let address = walletApi.getAddressFromPublicKey(publicKey);
					aboutWallet.setDefaultWallet(address);
					uni.showToast({
						title:this.$lan("createdSuccessfully")
					})
					setTimeout(() => {
						uni.switchTab({
							url: "/pages/my/index"
						})
					}, 1500)
				}else{
					uni.showToast({
						title:this.$lan("creationFailed")
					})
				}
			},
			async confirmClick() {
				if(this.type == 2){
          this.$showToast(this.$lan('verifiedSuccessfully'));
          setTimeout(() => {
						uni.switchTab({
							url: "/pages/my/index"
						})
					}, 1500);

				}else{
					this.addWalletToList()
				}

			}
		},
		computed: {
			...mapState(['mnemonicWords','password','walletName'])
		},
		onLoad(option) {
			this.type = option.type;
			this.wordList = this.mnemonicWords.split(" ")
			console.log('this.wordList', this.wordList);
			this.rodomList = randomArraySort(this.wordList)
		}
	}
</script>

<style lang="scss" scoped>
	.content-wrap {
		display: flex;
		flex-direction: column;
		padding: 0 32rpx;
		.please {
			color: #333333;
			font-size: 26rpx;
			line-height: 26rpx;
			margin-top: 44rpx;
			margin-bottom: 54rpx;
			display: flex;
			align-items: center;
			position: relative;
			&::before {
				content: '';
				display: inline-block;
				position: relative;
				margin-right: 24rpx;
				width: 14rpx;
				height: 14rpx;
				border-radius: 50%;
				background-color: $main-color;
			}
		}
		.error-text {
			// text-align: center;
			color: red;
			font-size: 28rpx;
			line-height: 28rpx;
			// padding: 13rpx 0;
			position: absolute;
			bottom: -41rpx;
		}
	}
	.mnemonicWords-wrap-border {
		width: 686rpx;
		height: 300rpx;
		border: 2rpx solid #B0B0B4;
		border-radius: 10rpx;
	}
	.mnemonicWords-wrap {
		padding: 10rpx 0;
		display: flex;
		flex-wrap: wrap;
		.mnemonicWords-item {
			margin-left: 20rpx;
			margin-top: 10rpx;
			padding: 10rpx 20rpx;
			border-radius: 10rpx;
			background-color: #EDEEF4;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #333333;
			font-size: 30rpx;
			font-weight: 500;
		}
	}

	.rodomWords-wrap-box {
		// height: 400rpx;
		padding-top: 50rpx;
	}
	.rodomWords-wrap {
		display: flex;
		flex-wrap: wrap;
		width: 686rpx;
		.rodomWords-item-wrap {
			margin-bottom: 40rpx;
			display: flex;
			&:not(:nth-child(3n)) {
				margin-right: 40rpx;
			}
		}
		.rodomWords-item {
			width: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10rpx 0rpx;
			background-color: #EDEEF4;
			border-radius: 10rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
		}
	}

	.btn-confirm {
		width: 686rpx;
		height: 90rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
		margin: 0 auto;
		position: absolute;
		bottom: 140rpx;
		border-radius: 20rpx;
	}
	.active {
		background-color: $main-color;
	}
</style>
