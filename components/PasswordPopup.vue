<template>
	<UniPopup ref="passwordPopup" type="center" :maskClick="maskClick">
		<view class="password-popup-container">
			<view class="password-popup-title">{{title}}</view>
			<view class="password-popup-input">
				<input type="password" :placeholder="placeholder" v-model="password">
			</view>
			<view class="password-popup-footer">
				<view
					v-if="isCancel"
					class="password-popup-btn"
					style="border-right: 1px solid #ddd;"
					@click="cancel"
				>
					{{cancelText}}
				</view>
				<view
					class="password-popup-btn"
					style="color: #243FFF"
					@click="saveSubmit"
				>
					{{sureText}}
				</view>
			</view>
		</view>
	</UniPopup>
</template>

<script>
	import UniPopup from '@/components/uni-popup/uni-popup.vue'
	import { aboutWallet } from '@/utils/businessCommon.js'
	import { mapState } from 'vuex'
	import lan from '../Framework/language'
	export default {
		props: {
			title: {
				type: String,
				default: lan('inputPassword')
			},
			placeholder: {
				type: String,
				default: lan('pleaseEnterYourPassword')
			},
			cancelText: {
				type: String,
				default: lan('cancel')
			},
			isCancel: {
				type: Boolean,
				default: true
			},
			maskClick: {
				type: Boolean,
				default: true
			},
			sureText: {
				type: String,
				default: lan('determine')
			}
		},
		components: {
			UniPopup
		},
		data() {
			return {
				password: '',
			}
		},
		computed: {
			...mapState(['defaultWallet']),
		},
		methods: {
			showPasswordPopup({cancel, success, fail} = {}) {
				if(cancel) this.a_success = success;
				if(success) this.a_cancel = cancel;
				if(fail) this.a_fail = fail;
				this.$refs.passwordPopup.open();
			},
			closePasswordPopup() {
				this.$refs.passwordPopup.close()
				this.password = ''
			},
			cancel() {
				this.a_cancel && this.a_cancel();
			  this.closePasswordPopup()
				this.$emit('click', {status: false, password: this.password })
			},
			saveSubmit() {
				//Get the time stamp of 0:00 today
				const toDayTimes = new Date(new Date().toLocaleDateString()).getTime();
				//Judge whether to freeze or not
				if(toDayTimes < this.defaultWallet.lastPassWordTime) {
						this.$showToast(this.$lan('walletHasBeenFrozen'))
						return
				}

				const passwordCheckResult = aboutWallet.checkPassword(this.defaultWallet.address, this.password)
				if(!passwordCheckResult){
					this.password = ''
					this.$store.commit('setPasswordErrorNum', ++this.defaultWallet.passwordErrorNum)

					if(this.defaultWallet.passwordErrorNum < 3) {
						this.$showToast(this.$lan('opportunityToEnterPassword').replace('$remainingTimes', 3-this.defaultWallet.passwordErrorNum))
					} else {
						this.$showToast(this.$lan('walletHasBeenFrozen'))
					}

					//Judge whether the number of input errors is accumulated for 3 times
					if(this.defaultWallet.passwordErrorNum == 3) {
						const times = new Date().getTime(); //Record the last submission time
						this.$store.commit('setLastPassWordTime', times)
						this.a_fail && this.a_fail();
					}

					return
				}

				//Correct password operation
				this.a_success && this.a_success(this.password);
				this.$emit('click', {status: true, password: this.password })
				this.closePasswordPopup()
				this.$store.commit('setPasswordErrorNum', 0)
				this.$store.commit('setLastPassWordTime', 0)
			}

		}
	}
</script>

<style scoped lang="scss">
	.password-popup-container {
		width: 600rpx;
		height: 380rpx;
		background: #fff;
		border-radius: 20rpx;
		padding-top: 39rpx;
		box-sizing: border-box;
		.password-popup-title {
			font-size: 36rpx;
			font-weight: 500;
			margin-bottom: 80rpx;
			text-align: center;
		}
		.password-popup-input {
			width: 100%;
			display: flex;
			margin-bottom: 40rpx;
			padding:0 61rpx ;
			box-sizing: border-box;
			input {
				width: 100%;
				padding: 0 20rpx;
				padding-bottom: 23rpx;
				border-bottom: 2rpx solid #243FFF;
			}
		}
		.password-popup-footer {
			display: flex;
			border-top: 1px solid #ddd;
			height: 100rpx;
			font-size: 34rpx;
			color: #999;
			.password-popup-btn {
				flex: 1;
				text-align: center;
				line-height: 100rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
