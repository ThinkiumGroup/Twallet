<template>
	<view class="transfer-contariner">
		<view class="transfer-header">
			<nav-bar :containerStyle="{boxShadow: '0 0'}">
				<!-- transfer-swiper -->
					<ms-dropdown-menu slot="title" v-if="transferType == 1 && list.length > 1">
						<ms-dropdown-item v-model="tokenType" :list="list" />
					</ms-dropdown-menu>
					<text slot="title" v-else>TKM</text>
			</nav-bar>
			<view class="transfer-type">
				<text
					class="transfer-type-item"
					:class="transferType == 1 && 'transfer-type-item-active'"
					@click="transferTypeChange"
				>
					{{$lan('给他人转账')}}
				</text>
				<!-- v-if="false" -->
				<text
					v-if="tokenType == 0"
					class="transfer-type-item"
					:class="transferType == 2 && 'transfer-type-item-active'"
					@click="transferTypeChange"
				>
					{{$lan('跨链转账')}}
				</text>
			</view>
		</view>
		<view class="transfer-body">
			<!-- 转账金额 -->
			<view class="transfer-content block">
				<view class="transfer-cross-chain" v-if="transferType == 2">
					<view class="cross-chain-item">
						<text class="cross-chain-title">{{$lan('转出链')}}</text>
						<Select
							:list="fromChainList"
							v-model="chainId"
							@selectChange="chainChangeOut"
						/>
					</view>
					<view class="cross-chain-item" style="margin-bottom: 44rpx;">
						<text class="cross-chain-title">{{$lan('转入链')}}</text>
						<Select
							:list="toChainList"
							v-model="toChainId"
							@selectChange="chainChangeIn"
						/>
					</view>
				</view>

				<view class="transfer-moeny-title title">
					<text>{{$lan('转账金额')}}</text>
					<text v-if="transferType == 1" class="transfer-moeny-remark">{{$lan('| 给他人转账仅支持在账户链内进行')}}</text>
				</view>

				<view class="transfer-frame">
					<input
						class="transfer-input"
						:placeholder="this.$lan('请输入金额')"
						type="text"
						v-model="amount"
					/>
					<text class="transfer-btn" @click="amount = getToken.amount">{{$lan('全部')}}</text>
				</view>

				<view class="transfer-balance">
					{{$lan('余额：')}}
					{{this.balance}}
					{{transferType == 2 ? 'TKM' : getToken.text}}
				</view>
				<view class="gas-remark">{{$lan('预估手续费用GAS：')}}{{gasPrice}} TKM
				</view>
			</view>
			<!-- 收款地址 -->
			<view class="block">
				<template v-if="transferType == 1">
					<view class="title">
						<text>{{$lan('收款地址')}}</text>
					</view>
					<view class="transfer-frame" style="margin-bottom: 30rpx;">
						<input
							class="transfer-input"
							:placeholder="this.$lan('请输入地址')"
							type="text"
							v-model="toAddress"
						/>
						<view @click="goAddressBook">
							<icon-font src="address" width="30rpx" height="33rpx" />
						</view>
					</view>
				</template>
				<view class="transaction-note">{{$lan('注意：')}}</view>
				<view class="transaction-note">
					{{$lan('1、gas费用为本交易预估的最高收费，实际gas费用由实际交易情况收取，会略低于显示值')}}
				</view>
				<view class="transaction-note">
					{{$lan('2、gas费用需要您在对应发起链账户中有足够的TKM才能支付，否则您将不能交易')}}
				</view>
			</view>
			<view
				class="transaction-submit"
				:class="isEmpty && 'transaction-submit-disabled'"
				@click="transferSubmit"
			>
				{{$lan('转账')}}
			</view>
		</view>
		<PasswordPopup ref="passwordPopup" @click="popupChange"></PasswordPopup>
		<AgainPasswordPopup
			:placeholder="this.$lan('上笔交易未完成,请继续交易')"
			ref="againPasswordPopup"
			@click="againpopupChange"
			:isCancel="false"
			:maskClick="false"
		 ></AgainPasswordPopup>
	</view>
</template>

<script>
	// 注意参数类型
	/*
	跨链转账流程-先取款生成支票，再使用支票跨链存款
	    ① 生成支票
					1.  生成支票信息input     web3.CashCheque.encode
	        2.  取款参数签名          web3.thk.signTransaction；
	        3.  取款交易              web3.thk.SendTx；
	        4.  查询取款hash结果      web3.thk.GetTransactionByHash;

	    ② 兑现支票
					6.  生成支票证明input      web3.thk.RpcMakeVccProof；
	        7.  存款参数签名          web3.thk.signTransaction；
					8.  存款交易              web3.thk.SendTx；
	        9.  查询存款hash结果      web3.thk.GetTransactionByHash;
	    ③ 撤销支票，若存款失败执行退款流程
	        10.  撤销支票证明          web3.thk.MakeCCCExistenceProof；
	        11.  退款参数签名          web3.thk.signTransaction；
	        12.  退款交易              web3.thk.SendTx；
	        13.  查询退款hash结果     web3.thk.GetTransactionByHash;
	*/
	/* 继续交易或退款流程
	    判断支票是否是否过期（超过指定块高）终止交易或继续存款交易
	    终止交易
	    1.  获取取消支票证明          web3.thk.MakeCCCExistenceProof
	    2.  退款参数签名          web3.thk.signTransaction；
	    3.  退款交易              web3.thk.SendTx；
	    4.  查询退款hash结果     web3.thk.GetTransactionByHash;

	    继续交易
	    1.  获取存款证明       web3.thk.RpcMakeVccProof；
	    5.  存款参数签名          web3.thk.signTransaction；
	    6.  存款交易              web3.thk.SendTx；
	    7.  查询存款hash结果      web3.thk.GetTransactionByHash;
	*/
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item'
	import PasswordPopup from '@/components/PasswordPopup'
	import AgainPasswordPopup from '@/components/PasswordPopup'
	import xflSelect from '@/components/xfl-select/xfl-select';
	import Select from '@/components/Select'
	import walletApi from "@/apis/walletApi";
	import { getTokenHoldingsForWallet } from '@/apis/transfer'
	import {
		aboutWallet
	} from '@/utils/businessCommon'
	import {
		mapState
	} from 'vuex'
	import {
		gasCost,
		chainList
	} from '@/utils/data/enums'
	export default {
		components: {
			msDropdownMenu,
			msDropdownItem,
			xflSelect,
			PasswordPopup,
			AgainPasswordPopup,
			Select
		},
		data() {
			return {
				tokenType: 0,
				list: [],
				fromChainList:chainList,
				toChainList:chainList,
				transferType: 1, //1给他人转账 2跨链转账
				balance: 0, //余额
				chainId: '1', //转出方链id
				toChainId: '1',
				toChaininitValue:this.$lan('奖励链'),
				nonce: '',
				amount: '', //余额
				toAddress: '', //目标地址
				withdrawalToAddress: '0x0000000000000000000000000000000000020000',
				saveToAddress: '0x0000000000000000000000000000000000030000',
				returnToAddress: '0x0000000000000000000000000000000000040000',
				expireHeight: '', //块高
				privateKey: '' ,//私钥
			}
		},

		computed: {
			...mapState(['defaultWallet']),
			//给他人转账 跨链转账 验证输入不为空
			isEmpty() {
				if (this.transferType == 1) {
					return this.toAddress == '' || this.amount == ''
				} else {
					return this.amount == ''
				}

			},
			//预估gas费用
			gasPrice() {
				return this.transferType == 1 ? gasCost['USER_CHAIN_TRANSFER'] : gasCost['CROSS_CHAIN_TRANSFER']
			},
			//获取当前token信息
		 getToken() {
				//TKM余额重新获取
				if(this.tokenType == 0) {
					 this.getAccount()
				}
				const item =  this.list.length && this.list.find(v => v.value == this.tokenType)
				this.balance = item.amount
				return item
			}
		},
		onLoad({
			address = '',
			transferAmount = '',
			tokenType = 0
		}) {
			this.toAddress = address
			this.amount = transferAmount
			this.tokenType = tokenType
		},
		mounted() {
			//判断是否有未执行完成的跨链交易如果有继续交易
			const input = uni.getStorageSync('input')
			if (input) {
				this.transferType = 2
				this.toChainId = uni.getStorageSync('toChainId')
				this.chainId = uni.getStorageSync('chainId')
				this.$refs.againPasswordPopup.showPasswordPopup()
			}
		},
		onShow() {
			this.getAccount()
			this.getTokenList()
		},
		watch: {
			transferType() {
				//对应的跨链可选择的链
				this.toChainList = chainList.filter(v => v.id != '1')
			}
		},
		methods: {

			// 切换交易类型 (跨链 普通)
			transferTypeChange() {
				if(this.transferType == 1 && this.tokenType == 0) {
					this.transferType = 2
					this.toChainId = '2'
				} else {
					this.transferType = 1
					this.toChainId = '1'

				}
			},

			//获取token列表
			async getTokenList() {
				const obj = {
					chainId: 103,
					accountAddress: this.defaultWallet.address,
					contractAddress: "",
					page: 1,
					rows: 10
				}
				const { data } = await getTokenHoldingsForWallet(obj)
				const list = data.data.map((v, index) => {
					return {
						text: v.tokenName,
						amount: aboutWallet.toRegularNumber(v.amount),
						value: index + 1,
						contractAddress: v.contractAddress,
					}
				})
				list.unshift({
					text: 'TKM',
					amount: this.balance,
					value: 0,
				})
				this.list = list
			},

			//转出链切换
			chainChangeOut(e) {
				this.chainId = e.id
				this.getAccount()
					//对应的跨链可选择的链
				if(this.chainId == '2' || this.chainId == '103') {
					this.toChainId = '1'
					this.toChainList = chainList.filter(v => v.id == '1')
				} else {
					this.toChainId = '2'
					this.toChainList = chainList.filter(v => v.id != '1')
				}
			},

			//转入链切换
			chainChangeIn(e) {
				this.toChainId = e.id
			},

			//获取账户余额
			async getAccount() {
				const {	balance, nonce } = await walletApi.getAccount(this.chainId, this.defaultWallet.address)
				this.balance = aboutWallet.toRegularNumber(balance)
				this.nonce = nonce
			},

			//提交并校验输入参数
			async transferSubmit() {
				if (this.isEmpty) {
					return
				}
				const reg = /^\d+(\.\d+)?$/;
				if(!reg.test(this.amount)){
					this.$showToast('请输入正确格式金额')
					return;
				}
				if(this.amount.indexOf('.')!==-1 && this.amount.split('.')[1].length > 6){
					this.$showToast('输入金额小数点后不得超过六位')
					return;
				}
				if(Number(this.amount) <= 0){
					this.$showToast('转账金额不得小于零，请输入正确的金额')
					return;
				}

				//type为xto时查询商业链的tkm余额是否大于手续费
				if(this.tokenType) {
					const { balance } = await walletApi.getAccount('103', this.defaultWallet.address)
					if (this.gasPrice > balance) {
						this.$showToast(this.$lan('商业链余额不足手续费用'))
						return
					}
					if ((this.amount * 1) > this.balance) {
						this.$showToast(this.$lan('余额不足'))
						return
					}
				} else {
					if ((this.amount * 1 + this.gasPrice) > this.balance) {
						this.$showToast(this.$lan('余额不足'))
						return
					}
				}

				console.log(aboutWallet.checkAddress(this.toAddress))

				//地址校验
				if(this.transferType == 1 && !aboutWallet.checkAddress(this.toAddress)) {
					this.$showToast(this.$lan('输入地址不正确'))
					return
				}

				this.$refs.passwordPopup.showPasswordPopup()
			},

			//接收弹框组件组件点击的是取消还是继续返回的状态
			async popupChange({ status,	password }) {
				if (!status) {
					return
				}
				await this.getPrivateKey(password) //获取私钥

				if (this.transferType == 1) {
					//给他人转账分为TKM和xto转账
					this.tokenType == 0 ? this.userChaintransfer() : this.xtoTransfer()
				} else {
					this.crossChainTransfer()
				}
			},

			//继续交易密码弹框
			async againpopupChange({ password }) {
				await this.getPrivateKey(password)
				uni.showLoading({
					title:this.$lan('转账中...')
				});
				//根据块高判断 继续存款或者退款
				const input = uni.getStorageSync('input')
				const currentHeight = await walletApi.getExpireHeight(this.toChainId) - 200
				const cheque = walletApi.decodeInput(input);
				console.log(currentHeight, cheque.ExpireHeight, 999999999)
				currentHeight > cheque.ExpireHeight ? this.returnTransfer(input) : this.saveTransfer(input)
			},

			//获取私钥
			async getPrivateKey(password) {
				this.privateKey = await aboutWallet.getWalletPrivateKey(this.defaultWallet.address, password)
			},

			//给他人链内转账
			async userChaintransfer() {
				//转账交易参数
				const obj = {
					chainId: this.chainId,
					fromChainId: this.chainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: aboutWallet.toAddress(this.toAddress),
					nonce: this.nonce,
					value: aboutWallet.toBigNumber(this.amount),
					input: '',
					privateKey: this.privateKey,
				}

				uni.showLoading({
					title:this.$lan('转账中...')
				});
				const {
					TXhash
				} = await walletApi.sendTx(obj)
				const {
					status
				} = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, TXhash))
				uni.hideLoading()
				this.getAccount()
				this.getTokenList()
				if(!status) {
					this.$showToast(this.$lan('转账失败'))
					return
				}
				this.$showToast(this.$lan('转账成功'))
				this.goHome()

			},

			//给他人转账xto转账
			async xtoTransfer() {
				uni.showLoading({
					title: '转账中...'
				});
				//获取103链nonce
				const { nonce } = await walletApi.getAccount('103', this.defaultWallet.address)
				uni.setStorageSync('amounts', this.getToken.amount)
				const amount = aboutWallet.toBigNumber(this.amount)
				const address = aboutWallet.toAddress(this.toAddress)
				const encoded = walletApi.simpleEncode('transfer(address,uint):(uint256)', address, amount)
				const obj = {
					chainId: '103',
					fromChainId: '103',
					toChainId: '103',
					from: this.defaultWallet.address,
					to: this.getToken.contractAddress, //合约地址
					nonce,
					value: '0',
					input: '0x' + encoded.toString("hex"),
					extra: new Buffer.from(JSON.stringify({ gas:6000000 })).toString('hex'),
					privateKey: this.privateKey,
				};
				walletApi.setVal('0')
				const { TXhash } = await walletApi.sendTx(obj)
				const { status } = await this.asyncTask(() => walletApi.getTransactionByHash('103', TXhash))
			 //账户xto余额查询会有延时
				let	num = 0
				let timeTask = null
				const befaultAmount = uni.getStorageSync('amounts')
				timeTask = setInterval(async () => {
					num++
					await this.getTokenList()
					if(num > 7 || this.getToken.amount != befaultAmount) {
						clearInterval(timeTask)
						uni.removeStorageSync('amounts')
						uni.hideLoading()
						if(!status) {
							this.$showToast(this.$lan('转账失败'))
							return
						}
						this.$showToast(this.$lan('转账成功'))
						this.goHome()
					}
				},1000)
			},

			//跨链转账
			async crossChainTransfer() {
				uni.showLoading({
					title:this.$lan('转账中...')
				});

				//------取款-------
				this.expireHeight = await walletApi.getExpireHeight(this.toChainId) //获取快高
				const cashCheque = { //生成支票参数
					FromChain: this.chainId,
					FromAddress: this.defaultWallet.address,
					Nonce: this.nonce,
					ToChain: this.toChainId,
					ToAddress: this.defaultWallet.address,
					Amount: aboutWallet.toBigNumber16(this.amount),
					ExpireHeight: this.expireHeight,
				}
				console.log(cashCheque, 999992)
				const input = walletApi.cashCheque(cashCheque) //生成input
				//取款交易参数
				const withdrawlObj = {
					chainId: this.chainId,
					fromChainId: this.chainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: this.withdrawalToAddress,
					nonce: this.nonce,
					value: '0',
					input,
					privateKey: this.privateKey,
				}

				//发起交易以及查询结果
				const withdrawlHash = await walletApi.sendTx(withdrawlObj)
				const withdrawlReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, withdrawlHash.TXhash))
				if (withdrawlReturn.status != 1) {
					this.$showToast(this.$lan('转账失败'))
					uni.hideLoading()
					console.log(this.$lan('取款失败---------------'))
					return
				}
				//----取款成功----

				//取款成功后 将input缓存起来 重新打开继续交易 继续执行
				uni.setStorageSync('input', withdrawlReturn.tx.input)
				uni.setStorageSync('chainId', this.chainId)
				uni.setStorageSync('toChainId', this.toChainId)
				//传入取款生成支票的input
				const saveResult = await this.saveTransfer(input)
				if (saveResult) {
					return
				}
				//退款
				await this.returnTransfer(input)
			},

			//存款
			async saveTransfer(input) {
				//-----存款-----
				const cheque = walletApi.decodeInput(input);
				console.log(cheque, 90000008)
				const proofParam = {
					chainId: cheque.FromChain,
					from: cheque.FromAddress,
					to: cheque.ToAddress,
					fromChainId: cheque.FromChain,
					toChainId: cheque.ToChain,
					value: cheque.Amount.toString(),
					expireheight: cheque.ExpireHeight.toString(),
					nonce: cheque.Nonce.toString()
				}
				//生成支票证明
				const proofResult = await this.asyncTask(() => walletApi.rpcMakeVccProof(proofParam), 5)
				if (!proofResult || proofResult.errMsg) { //支票证明生成错误
					this.$showToast(this.$lan('转账失败'))
					uni.hideLoading()
					return
				}
				//获取目标链的nonce
				const { nonce } = await walletApi.getAccount(this.toChainId, this.defaultWallet.address)
				const saveObj = { //存款交易参数
					chainId: this.toChainId,
					fromChainId: this.toChainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: this.saveToAddress,
					nonce,
					value: '0',
					input: proofResult.input,
					privateKey: this.privateKey,
				}

				console.log(saveObj, 9999999998)
				const saveHash = await walletApi.sendTx(saveObj)
				const saveReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.toChainId, saveHash.TXhash))
				if (saveReturn.status == 1) {
					uni.hideLoading()
					this.clearSotrage()
					this.$showToast(this.$lan('转账成功'))
					this.getAccount()
					this.goHome()
					console.log(this.$lan('存款成功---------------'))
					return true
				}
				return false
			},

			//退款
			async returnTransfer(input) {
				console.log(input, 999239293)
				const cheque = walletApi.decodeInput(input);
				const cancelProofParam = {
					chainId: cheque.ToChain,
					from: cheque.FromAddress,
					to: cheque.ToAddress,
					fromChainId: cheque.FromChain,
					toChainId: cheque.ToChain,
					value: cheque.Amount.toString(),
					expireheight: cheque.ExpireHeight.toString(),
					nonce: cheque.Nonce.toString()
				}
				console.log(cheque, 90000288888)
				const proofCancel = await walletApi.makeCCCExistenceProof(cancelProofParam)
				if (proofCancel && !proofCancel.errMsg) { //退款生成支票成功,执行退款流程
					await this.getAccount() //重新获取账户的noce值
					const cancelObj = {
						chainId: this.chainId,
						fromChainId: this.chainId,
						toChainId: this.chainId,
						from: this.defaultWallet.address,
						to: this.returnToAddress,
						nonce: this.nonce,
						value: '0',
						input: proofCancel.input,
						privateKey: this.privateKey,
					}

					const cancelHash = await walletApi.sendTx(cancelObj)
					const cancelReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, cancelHash.TXhash))
					if (cancelReturn.status == 1) {
						uni.hideLoading()
						this.clearSotrage()
						this.$showToast(this.$lan('转账失败'))
						this.getAccount()
						console.log(this.$lan('退款成功---------------'))
					}
				}
			},

			//清除存储的值
			clearSotrage() {
				uni.removeStorageSync('input')
				uni.removeStorageSync('toChainId')
				uni.removeStorageSync('chainId')
			},

			//异步任务
			asyncTask(fn, n = 7) {
				const promise = new Promise((resolve, reject) => {
					let timeOut = null
					let num = 0
					timeOut = setInterval(async () => {
						num++
						const response = await fn()
						if (num > n || response && response.status) {
							resolve(response)
							clearInterval(timeOut)
						}
					}, 1000)
				})
				return promise
			},

			//通往地址簿
			goAddressBook() {
				uni.navigateTo({
					url: `/pages/transaction/addressBook?amount=${this.amount}&tokenType=${this.tokenType}`
				})
			},

			goHome() {

				setTimeout(() => {
					console.log(80000)
					uni.switchTab({
						url: '/pages/home/index'
					})
					console.log(900000)
				}, 2000)

			},

		}
	}
</script>

<style lang="scss" scoped>
	.transfer-contariner {
		height: 100%;
		display: flex;
		flex-direction: column;

		.transfer-type {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;

			.transfer-type-item {
				width: 215rpx;
				height: 88rpx;
				line-height: 80rpx;
				text-align: center;
				border-bottom: 4rpx solid #fff;
				color: #999999;
				font-size: 26rpx;
			}

			.transfer-type-item-active {
				color: #333333;
				border-bottom: 4rpx solid #333333;
			}
		}

		.transfer-body {
			flex: 1;
			overflow: auto;
			padding: 51rpx 32rpx;
			box-sizing: border-box;

			.block {
				padding: 41rpx 35rpx;
				box-sizing: border-box;
				background: #FFFFFF;
				border-radius: 20rpx;
				margin-bottom: 25rpx;
			}

			.title {
				font-size: 34rpx;
				font-weight: 500;
				margin-bottom: 80rpx;
			}

			.transfer-frame {
				display: flex;
				justify-content: space-between;
				padding-bottom: 20rpx;
				border-bottom: 1px solid #aaa;

				.transfer-input {
					flex: 1;
					font-size: 30rpx;
					padding-right: 15rpx;
				}

				.transfer-btn {
					font-size: 30rpx;
					color: #243FFF;
				}
			}

			.transfer-content {
				.transfer-cross-chain {
					border-bottom: 1px solid #DDDDDD;
					margin-bottom: 44rpx;

					.cross-chain-item {
						display: flex;
						justify-content: space-between;
						margin-bottom: 57rpx;

						.cross-chain-title {
							font-size: 26rpx;
							font-weight: 500;
						}
					}
				}

				.transfer-moeny-title {
					.transfer-moeny-remark {
						font-size: 26rpx;
						color: #666666;
						margin-left: 10rpx;
					}
				}

				.transfer-balance {
					font-size: 26rpx;
					color: #666666;
					margin: 41rpx 0;
				}

				.gas-remark {
					color: #aaa;
					font-size: 26rpx;
					font-weight: 300;
				}
			}

			.transaction-note {
				color: #999999;
				line-height: 50rpx;
				font-size: 24rpx;
			}

			.transaction-submit {
				padding: 15rpx 0;
				text-align: center;
				box-sizing: border-box;
				border-radius: 20rpx;
				margin-top: 100rpx;
				background: #243FFF;
				color: #fff;
				font-weight: 500;
				font-size: 32rpx;
			}

			.transaction-submit-disabled {
				background: #ccc;
			}

		}
	}
</style>
