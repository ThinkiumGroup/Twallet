<template>
	<view class="page-wrap">
		<nav-bar :title="this.$lan('导入钱包')">
			<!-- h5端暂不支持扫码 -->
			<!-- #ifndef H5 -->
			<view class="top_right" @click="searchCode" slot="rightBtn" v-show="selected == 2">
				<image src="../../static/image/home/icon_sys.png"></image>
			</view>
			<!-- #endif -->
		</nav-bar>
		<view class="content-wrap">
			<view class="import-pattern-wrap">
				<view class="import-tab">
					<view class="tab-item" :class="{active: selected == 1}" @tap="selectClick(1)">
						{{$lan('助记词导入')}}
					</view>
					<view class="tab-item" :class="{active: selected == 2}" @tap="selectClick(2)">
						{{$lan('私钥导入')}}
					</view>
				</view>
				<textarea class="import-content" v-model="mnemonic" :placeholder="this.$lan('请输入助记词，用空格分隔')"  v-show="selected == 1"/>
				<textarea class="import-content" v-model="privateKey" :placeholder="this.$lan('请输入私钥')"  v-show="selected == 2"/>
			</view>
			<view class="password-wrap">
				<input type="text" v-model="walletName"  :placeholder="this.$lan('请输入钱包名称')"  />
				<input type="password"  v-model="password" :placeholder="this.$lan('请设置钱包密码（不少于6位）')"  />
				<input type="password"  v-model="repeatPassword" :placeholder="this.$lan('重复密码')" />
			</view>
			<view class="imort-btn" @click="importWallet">
				{{$lan('开始导入')}}
			</view>
			<EasyDialog ref="EasyDialog"/>
		</view>
	</view>
</template>

<script>
	import { aboutWallet, formatMnemonicWords} from "../../utils/businessCommon";
  import { mapState, mapGetters } from 'vuex';
  import EasyDialog from "../../components/EasyDialog";
	import {
		searchCode
	} from "../../utils/businessCommon";
	export default {
		components: { EasyDialog },
		name: 'importWallet',
		data() {
			return {
				selected: 1, //1是助记词导入， 2是私钥导入
				mnemonic: '',
				privateKey: '',
				walletName: '',
				password: '',
				repeatPassword: ''
			}
		},
		computed: {
			...mapState(['walletList']),
			...mapGetters(['hasDefaultWallet']),
		},
		methods: {
			selectClick(val) {
				this.selected = val
			},
			async importWallet(){
				console.log('walletList', this.walletList);
				if(this.selected == 1 && !this.mnemonic.trim()){
          this.$showToast(this.$lan('请填写助记词'));
          return;
				}
				if(this.selected == 2 && !this.privateKey.trim()){
					this.$showToast(this.$lan('请填写私钥'));
					return;
				}

				if(!this.walletName){
					this.$showToast(this.$lan('请填写钱包名称'));
					return;
				}
				if(!this.password){
					this.$showToast(this.$lan('请设置钱包密码'));
					return;
				}
				if(!this.repeatPassword){
					this.$showToast(this.$lan('请重复密码'));
					return;
				}

				if(this.password !==this.repeatPassword){
					this.$showToast(this.$lan('两次密码输入的值不一致，请重新填写'));
					this.password = '';
					this.repeatPassword = '';
					return;
				}

				uni.showLoading({
					title: '',
					mask: true,
				});


				let params;
        if(this.selected == 1){
					let mnemonic = formatMnemonicWords(this.mnemonic);
					params = {
						mnemonic,
						name: this.walletName,
					}
				}else{
					params = {
						privateKey: this.privateKey.trim().toLowerCase(),
						name: this.walletName
					}
				}
        let result = await aboutWallet.addNewWallet(params, this.password);
				uni.hideLoading();
        if(result.status === 1){
        	if(this.hasDefaultWallet){
						this.$refs.EasyDialog.showDialog({
							title:this.$lan('导入完成'),
							text:this.$lan('您的钱包已导入完成，现在可以使用了，快去看看吧'),
							okText:this.$lan('开始使用'),
							cancelText:this.$lan('暂时不用'),
							ok: () => {
								setTimeout(() => {
									let address = this.walletList[this.walletList.length - 1].address;
									console.log('address', address);
									aboutWallet.setDefaultWallet(address);
									uni.navigateBack();
								})
							},
							cancel: () => {
								uni.navigateBack();
							},
						});
					}else{
						console.log('walletList', this.walletList);
        		setTimeout(() => {
							let address = this.walletList[0].address;
							aboutWallet.setDefaultWallet(address);
							this.$showToast(this.$lan('钱包导入成功'));
						})
						setTimeout(() => {
							uni.navigateBack();
						}, 1000)
					}
				}else{

					this.$showToast(result.msg);
				}
			},
			async searchCode(){
				let obj = await searchCode(1);
				this.privateKey = obj.privateKey;
			},
		},
		onLoad(option){
			if(option.privateKey){
				this.selected = 2;
				this.privateKey = option.privateKey;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.content-wrap {

		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 0 32rpx;
		.import-pattern-wrap {
			// width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			margin-top: 20rpx;
			padding-top: 42rpx;
			padding-bottom: 38rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			.import-tab {
				display: flex;
				justify-content: space-around;
					align-items: center;
				width: 100%;
				.tab-item {
					min-width: 215rpx;
					min-height: 50rpx;

					display: flex;
					justify-content: center;
					align-items: center;
					color: #999999;
					font-size: 26rpx;
					line-height: 26rpx;
					border-radius: 25rpx;
					// padding: 10rpx;
				}
				.active {
					// background-color: #243FFF;
					background-color: $main-color;
					color: #FFFFFF;
					font-weight: 500;
				}
			}
			.import-content {
				height: 210rpx;
				margin-top: 54rpx;
				background-color: #F5F6F8;
				padding-top: 28rpx;
				padding-left: 32rpx;
				border-radius: 10rpx;
				.textarea-placeholder {
					color: #AAAAAA;
					font-size: 30rpx;
					font-weight: 300;
				}
			}
		}

		.password-wrap {
			background-color: #FFFFFF;
			border-radius: 20rpx;
			width: calc(100% - 68rpx);
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

		.imort-btn {
			width: 100%;
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
	}
	.top_right {
		width: 36rpx;
		height: 36rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: #FFFFFF;

		image {
			width: 35rpx;
			height: 35rpx;
		}
	}
</style>
