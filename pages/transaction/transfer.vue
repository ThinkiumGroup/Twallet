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
					{{$lan('transferMoneyToOthers')}}
				</text>
				<!-- v-if="false" -->
				<text
					v-if="tokenType == 0"
					class="transfer-type-item"
					:class="transferType == 2 && 'transfer-type-item-active'"
					@click="transferTypeChange"
				>
					{{$lan('crossChainTransfer')}}
				</text>
			</view>
		</view>
		<view class="transfer-body">
			<!-- TransferAmount -->
			<view class="transfer-content block">
				<view class="transfer-cross-chain" v-if="transferType == 2">
					<view class="cross-chain-item">
						<text class="cross-chain-title">{{$lan('chainTransferredOut')}}</text>
						<Select
							:list="fromChainList"
							v-model="chainId"
							@selectChange="chainChangeOut"
						/>
					</view>
					<view class="cross-chain-item" style="margin-bottom: 44rpx;">
						<text class="cross-chain-title">{{$lan('chainTransferredIn')}}</text>
						<Select
							:list="toChainList"
							v-model="toChainId"
							@selectChange="chainChangeIn"
						/>
					</view>
				</view>

				<view class="transfer-moeny-title title">
					<text>{{$lan('TransferAmount')}}</text>
					<text v-if="transferType == 1" class="transfer-moeny-remark">{{$lan('restrictionsOnTransferringMoneyToOthers')}}</text>
				</view>

				<view class="transfer-frame">
					<input
						class="transfer-input"
						:placeholder="this.$lan('pleaseEnterTheAmount')"
						type="text"
						v-model="amount"
					/>
					<text class="transfer-btn" @click="amount = balanceActrul">{{$lan('All')}}</text>
				</view>

				<view class="transfer-balance">
					{{$lan('balance')}}：
					{{balanceActrul}}
					{{transferType == 2 ? 'TKM' : getToken.text}}
				</view>
				<view class="gas-remark">{{$lan('estimatedHandlingFeeGAS')}}：{{gasPrice}} TKM
				</view>
			</view>
			<!-- receiving Address -->
			<view class="block">
				<template v-if="transferType == 1">
					<view class="title">
						<text>{{$lan('receivingAddress')}}</text>
					</view>
					<view class="transfer-frame" style="margin-bottom: 30rpx;">
						<input
							class="transfer-input"
							:placeholder="this.$lan('pleaseEnterTheAddress')"
							type="text"
							v-model="toAddress"
						/>
						<view @click="goAddressBook">
							<icon-font src="address" width="30rpx" height="33rpx" />
						</view>
					</view>
				</template>
				<view class="transaction-note">{{$lan('note')}}</view>
				<view class="transaction-note">
					1、{{$lan('gasFeeDesc')}}
				</view>
				<view class="transaction-note">
					2、{{$lan('gasConsumptionPlace')}}
				</view>
			</view>
			<view
				class="transaction-submit"
				:class="isEmpty && 'transaction-submit-disabled'"
				@click="transferSubmit"
			>
				{{$lan('transfer')}}
			</view>
		</view>
		<PasswordPopup ref="passwordPopup" @click="popupChange"></PasswordPopup>
		<AgainPasswordPopup
			:placeholder="this.$lan('pleaseContinueTheTransaction')"
			ref="againPasswordPopup"
			@click="againpopupChange"
			:isCancel="false"
			:maskClick="false"
		 ></AgainPasswordPopup>
	</view>
</template>

<script>
	// Note the parameter type
	/*
	Cross chain transfer process - withdraw money to generate a check, and then use the check to cross chain deposit
	    ① Generate check
					1.  Generate check information input     web3.CashCheque.encode
	        2.  Signature of withdrawal parameters   web3.thk.signTransaction；
	        3.  Withdrawal transaction               web3.thk.SendTx；
	        4.  Query withdrawal hash result         web3.thk.GetTransactionByHash;

	    ② Cash a check
					6.  Generate check proof input           web3.thk.RpcMakeVccProof；
	        7.  Deposit parameter signature          web3.thk.signTransaction；
					8.  Deposit transaction                  web3.thk.SendTx；
	        9.  Query deposit hash result      	     web3.thk.GetTransactionByHash;
	    ③ Cancel the check. If the deposit fails, 	 execute the refund process
	        10.  Cancellation of check certificate   web3.thk.MakeCCCExistenceProof；
	        11.  Refund parameter signature          web3.thk.signTransaction；
	        12.  Refund transaction              		 web3.thk.SendTx；
	        13.  Query refund hash result     			 web3.thk.GetTransactionByHash;
	*/
	/* Continue the transaction or refund process

	   Judge whether the check is overdue (beyond the specified block height) to
		 terminate the transaction or continue the deposit transaction
	    Termination of transaction
	    1.  Obtain proof of cancellation          	web3.thk.MakeCCCExistenceProof
	    2.  Refund parameter signature         			web3.thk.signTransaction；
	    3.  Refund transaction              				web3.thk.SendTx；
	    4.  Query refund hash result        				web3.thk.GetTransactionByHash;

	    Keep trading
	    1.  Obtain certificate of deposit       		web3.thk.RpcMakeVccProof；
	    5.  Deposit parameter signature          		web3.thk.signTransaction；
	    6.  Deposit transaction              				web3.thk.SendTx；
	    7.  Query deposit hash result      					web3.thk.GetTransactionByHash;
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
				transferType: 1, //1 transfer to others 2 cross chain transfer
				balance: 0, //balance
				chainId: this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN, //Transfer out party Chain ID
				toChainId: this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN,
				toChaininitValue:this.$lan('rewardChain'),
				nonce: '',
				amount: '', //balance
				toAddress: '', //Destination address
				withdrawalToAddress: '0x0000000000000000000000000000000000020000',
				saveToAddress: '0x0000000000000000000000000000000000030000',
				returnToAddress: '0x0000000000000000000000000000000000040000',
				expireHeight: '', //Block height
				privateKey: '' ,//Private key
			}
		},

		computed: {
			...mapState(['defaultWallet']),
			//Transfer to others cross chain transfer verification input is not empty
			isEmpty() {
				if (this.transferType == 1) {
					return this.toAddress == '' || this.amount == ''
				} else {
					return this.amount == ''
				}

			},
			//Estimated gas cost
			gasPrice() {
				return this.transferType == 1 ? gasCost['USER_CHAIN_TRANSFER'] : gasCost['CROSS_CHAIN_TRANSFER']
			},
			//Get the current token information
		 getToken() {
				//TKM balance recapture
				if(this.tokenType == 0) {
					 this.getAccount()
				}
				const item =  this.list.length && this.list.find(v => v.value == this.tokenType)
				this.balance = item.amount
				return item
			},
			balanceActrul(){
				let number = this.balance - this.gasPrice;
				if(!number || number < 0) number = 0;
				return number.toString()
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
			//Judge whether there is an unfinished cross chain transaction, and if so, continue the transaction
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
				//Corresponding cross chain optional chain
				this.toChainList = chainList.filter(v => v.id != this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN)
			}
		},
		methods: {

			// Switch transaction type (cross chain common)
			transferTypeChange() {
				if(this.transferType == 1 && this.tokenType == 0) {
					this.transferType = 2
					this.toChainId = this.$enums.ChainIdOldEnum.POS_CHAIN
				} else {
					this.transferType = 1
					this.chainId = this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN
					this.toChainId = this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN
					this.getAccount()
				}
				this.amount = '' //Clear input amount
			},

			//Get token list
			async getTokenList() {
				const obj = {
					chainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN,
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

			//Transfer out chain switching
			chainChangeOut(e) {
				this.chainId = e.id
				this.getAccount()
					//Corresponding cross chain optional chain
				if(this.chainId == this.$enums.ChainIdOldEnum.POS_CHAIN || this.chainId == this.$enums.ChainIdOldEnum.BUSINESS_CHAIN) {
					this.toChainId = this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN
					this.toChainList = chainList.filter(v => v.id == this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN)
				} else {
					this.toChainId = this.$enums.ChainIdOldEnum.POS_CHAIN
					this.toChainList = chainList.filter(v => v.id != this.$enums.ChainIdOldEnum.ACCOUNT_CHAIN)
				}
			},

			//Transfer in chain switching
			chainChangeIn(e) {
				this.toChainId = e.id
			},

			//Get account balance
			async getAccount() {
				const {	balance, nonce } = await walletApi.getAccount(this.chainId, this.defaultWallet.address)
				console.log('---balance', balance)
				this.balance = aboutWallet.toRegularNumber(balance)
				this.nonce = nonce
			},

			//Submit and verify input parameters
			async transferSubmit() {
				if (this.isEmpty) {
					return
				}
				const reg = /^\d+(\.\d+)?$/;
				if(!reg.test(this.amount)){
					this.$showToast('pleaseEnterTheCorrectFormatAmount')
					return;
				}
				if(this.amount.indexOf('.')!==-1 && this.amount.split('.')[1].length > 6){
					this.$showToast(this.$lan('amountWithNoMoreThanSixDecimalPlaces'))
					return;
				}
				if(Number(this.amount) <= 0){
					this.$showToast(this.$lan('transferAmountCannotBeLessThanZero'))
					return;
				}

				//When type is XTO, query whether the TKM balance of the e-commerce chain is greater than the handling charge
				if(this.tokenType) {
					const { balance } = await walletApi.getAccount(this.$enums.ChainIdOldEnum.BUSINESS_CHAIN, this.defaultWallet.address)
					if (this.gasPrice > balance) {
						this.$showToast(this.$lan('ecommerceChainBalanceIsInsufficient'))
						return
					}
					if ((this.amount * 1) > this.balance) {
						this.$showToast(this.$lan('insufficientBalance'))
						return
					}
				} else {
					if ((this.amount * 1 + this.gasPrice) > this.balance) {
						this.$showToast(this.$lan('insufficientBalance'))
						return
					}
				}

				console.log(aboutWallet.checkAddress(this.toAddress))

				//Address verification
				if(this.transferType == 1 && !aboutWallet.checkAddress(this.toAddress)) {
					this.$showToast(this.$lan('IncorrectAddressEntered'))
					return
				}

                console.log('---123ss')
				this.$refs.passwordPopup.showPasswordPopup()
			},

			//Receive the status of "Cancel" or "continue to return" that the pop-up component clicks
			async popupChange({ status,	password }) {
				if (!status) {
					return
				}
				await this.getPrivateKey(password) //Get private key

				if (this.transferType == 1) {
					//Transfer to others is divided into TKM and XTO transfer
					this.tokenType == 0 ? this.userChaintransfer() : this.xtoTransfer()
				} else {
					this.crossChainTransfer()
				}
			},

			//Continue trading password pop-up box
			async againpopupChange({ password }) {
				await this.getPrivateKey(password)
				uni.showLoading({
					title:this.$lan('transferring')
				});
				//Continue to deposit or refund according to the block height
				const input = uni.getStorageSync('input')
				const currentHeight = await walletApi.getCurrentHeight(this.toChainId)
				const cheque = walletApi.decodeInput(input);
				console.log(currentHeight, cheque.ExpireHeight, 999999999)
				currentHeight > cheque.ExpireHeight ? this.returnTransfer(input) : this.saveTransfer(input)
			},

			//Get private key
			async getPrivateKey(password) {
				this.privateKey = await aboutWallet.getWalletPrivateKey(this.defaultWallet.address, password)
			},

			//Transfer to others within the chain
			async userChaintransfer() {
				//Transfer transaction parameters
				const obj = {
					chainId: this.chainId,
					fromChainId: this.chainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: aboutWallet.toAddress(this.toAddress),
					nonce: this.nonce.toString(),
					value: aboutWallet.toBigNumber(this.amount),
					input: '',
				}

				uni.showLoading({
					title:this.$lan('transferring')
				});
				const signTransaction = await walletApi.signTransaction(obj, this.privateKey);
				const {
					TXhash
				} = await walletApi.sendTx(signTransaction)
				const {
					status
				} = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, TXhash))
				uni.hideLoading()
				this.getAccount()
				this.getTokenList()
				if(!status) {
					this.$showToast(this.$lan('transferFailed'))
					return
				}
				this.$showToast(this.$lan('successfulTransfer'))
				this.goHome()

			},

			//Transfer to others XTO transfer
			async xtoTransfer() {
				uni.showLoading({
					title: this.$lan('transferring')
				});
				//Get BUSINESS_CHAIN chain nonce
				const { nonce } = await walletApi.getAccount(this.$enums.ChainIdOldEnum.BUSINESS_CHAIN, this.defaultWallet.address)
				uni.setStorageSync('amounts', this.getToken.amount)
				const amount = aboutWallet.toBigNumber(this.amount)
				const address = aboutWallet.toAddress(this.toAddress)
				const encoded = walletApi.simpleEncode('transfer(address,uint):(uint256)', address, amount)
				const obj = {
					chainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN,
					fromChainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN,
					toChainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN,
					from: this.defaultWallet.address,
					to: this.getToken.contractAddress, //contract address
					nonce: nonce.toString(),
					value: '0',
					input: '0x' + encoded.toString("hex"),
					extra: new Buffer.from(JSON.stringify({ gas:6000000 })).toString('hex'),
				};
				const signTransaction = await walletApi.signTransaction(obj, this.privateKey);
				const { TXhash } = await walletApi.sendTx(signTransaction)
				const { status } = await this.asyncTask(() => walletApi.getTransactionByHash(this.$enums.ChainIdOldEnum.BUSINESS_CHAIN, TXhash))
			 //Account XTO balance query will be delayed
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
							this.$showToast(this.$lan('transferFailed'))
							return
						}
						this.$showToast(this.$lan('successfulTransfer'))
						this.goHome()
					}
				},1000)
			},

			//Cross chain transfer
			async crossChainTransfer() {
				uni.showLoading({
					title:this.$lan('transferring')
				});

				//------withdraw money-------
				this.expireHeight = await walletApi.getCurrentHeight(this.toChainId) + 200 //Get fast high
				const cashCheque = { //Generate check parameters
					FromChain: this.chainId,
					FromAddress: this.defaultWallet.address,
					Nonce: this.nonce,
					ToChain: this.toChainId,
					ToAddress: this.defaultWallet.address,
					Amount: aboutWallet.toBigNumber16(this.amount),
					ExpireHeight: this.expireHeight,
				}
				console.log('---cashCheque', JSON.stringify(cashCheque))
				const input = walletApi.cashCheque(cashCheque) //generate input

				console.log('---input', input)
				//Withdrawal transaction parameters
				const withdrawlObj = {
					chainId: this.chainId,
					fromChainId: this.chainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: this.withdrawalToAddress,
					nonce: this.nonce.toString(),
					value: '0',
					input,
				}

				const signTransaction = await walletApi.signTransaction(withdrawlObj, this.privateKey);
				console.log('---signParams',  JSON.stringify(signTransaction));
				//Initiate transactions and query results
				const withdrawlHash = await walletApi.sendTx(signTransaction)
				console.log('--withdrawlHash', withdrawlHash)
				const withdrawlReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, withdrawlHash.TXhash))
				if (withdrawlReturn.status != 1) {
					this.$showToast(this.$lan('transferFailed'))
					uni.hideLoading()
					console.log(this.$lan('Withdrawal failed---------------'))
					return
				}
				//----Successful withdrawal----

				//After the withdrawal is successful, the input will be cached and reopened to continue the transaction
				uni.setStorageSync('input', withdrawlReturn.tx.input)
				uni.setStorageSync('chainId', this.chainId)
				uni.setStorageSync('toChainId', this.toChainId)
				//Input of check generated by incoming withdrawal
				const saveResult = await this.saveTransfer(input)
				if (saveResult) {
					return
				}
				//refund
				await this.returnTransfer(input)
			},

			async saveTransfer(input) {
				//-----deposit-----
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
				//Generate check proof
				const proofResult = await this.asyncTask(() => walletApi.rpcMakeVccProof(proofParam), 5)
				if (!proofResult || proofResult.errMsg) { //Check proof generation error
					this.$showToast(this.$lan('transferFailed'))
					uni.hideLoading()
					return
				}
				//Get the nonce of the target chain
				const { nonce } = await walletApi.getAccount(this.toChainId, this.defaultWallet.address)
				const saveObj = {  //Deposit transaction parameters
					chainId: this.toChainId,
					fromChainId: this.toChainId,
					toChainId: this.toChainId,
					from: this.defaultWallet.address,
					to: this.saveToAddress,
					nonce: nonce.toString(),
					value: '0',
					input: proofResult.input,
				}

				console.log(saveObj, 9999999998)
				const signTransaction = await walletApi.signTransaction(saveObj, this.privateKey);
				const saveHash = await walletApi.sendTx(signTransaction)
				const saveReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.toChainId, saveHash.TXhash))
				if (saveReturn.status == 1) {
					uni.hideLoading()
					this.clearSotrage()
					this.$showToast(this.$lan('successfulTransfer'))
					this.getAccount()
					this.goHome()
					console.log('Successful deposit-------')
					return true
				}
				return false
			},

			//Refund
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
				if (proofCancel && !proofCancel.errMsg) { //The refund is successfully generated, and the refund process is executed
					await this.getAccount() //Re-obtain the noce value of the account
					const cancelObj = {
						chainId: this.chainId,
						fromChainId: this.chainId,
						toChainId: this.chainId,
						from: this.defaultWallet.address,
						to: this.returnToAddress,
						nonce: this.nonce.toString(),
						value: '0',
						input: proofCancel.input,
					}
					const signTransaction = await walletApi.signTransaction(cancelObj, this.privateKey);
					const cancelHash = await walletApi.sendTx(signTransaction)
					console.log('---cancelHash', cancelHash)
					const cancelReturn = await this.asyncTask(() => walletApi.getTransactionByHash(this.chainId, cancelHash.TXhash))
					if (cancelReturn.status == 1) {
						uni.hideLoading()
						this.clearSotrage()
						this.$showToast(this.$lan('transferFailed'))
						this.getAccount()
						console.log('Refund successfully---------------')
					}
				}
			},

			//Clear stored value
			clearSotrage() {
				uni.removeStorageSync('input')
				uni.removeStorageSync('toChainId')
				uni.removeStorageSync('chainId')
			},

			//Asynchronous task
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

			//To the address book
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
