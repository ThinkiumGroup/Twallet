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
	export default {
		props: {
			title: {
				type: String,
				default: '输入密码'
			},
			placeholder: {
				type: String,
				default: '请输入您的密码'
			},
			cancelText: {
				type: String,
				default: '取消'
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
				default: '确定'
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
				//获取今日0点的时间戳
				const toDayTimes = new Date(new Date().toLocaleDateString()).getTime();
				//判断是否冻结
				if(toDayTimes < this.defaultWallet.lastPassWordTime) {
						this.$showToast('您的钱包已被冻结，请明天操作!')
						return
				}

				const passwordCheckResult = aboutWallet.checkPassword(this.defaultWallet.address, this.password)
				if(!passwordCheckResult){
					this.password = ''
					this.$store.commit('setPasswordErrorNum', ++this.defaultWallet.passwordErrorNum)

					if(this.defaultWallet.passwordErrorNum < 3) {
						this.$showToast(`密码错误请重新输入,您还有${3-this.defaultWallet.passwordErrorNum}次机会, `)
					} else {
						this.$showToast('您的钱包已被冻结，请明天操作')
					}

					//判断输入错误次数是否累计3次
					if(this.defaultWallet.passwordErrorNum == 3) {
						const times = new Date().getTime(); //记录最后一次提交时间
						this.$store.commit('setLastPassWordTime', times)
						this.a_fail && this.a_fail();
					}

					return
				}

				//密码正确操作
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
