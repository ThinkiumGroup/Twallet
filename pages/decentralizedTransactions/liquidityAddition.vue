<template>
    <view class="app">
        <nav-bar :title="this.$lan('提供兑换池')"/>
        <view class="_block" style="margin-top: 21rpx;">
            <template>
                <view class="trade-type-description" v-if="transferType === 'stable'">
                    {{$lan('采用市场定价策略时，提供兑换池仅需提供TKM。')}}
                </view>
                <view class="trade-type-description" v-else-if="pairStatus === 2">
                    {{$lan('恭喜您成为该兑换池第一个通证提供者，您将设置初始兑换比例，一旦您对比例满意，请单击按钮进行添加。')}}
                </view>
            </template>
            <view class="transaction-select">
                <view class="transaction-direction transaction-from">
                    <view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                        <view class="transaction-direction-text">{{$lan('添加')}}</view>
                        <view
                            class="tips-for-not-enough"
                            v-show="checkIfBalanceIsExceeded(dataA, 'A')"
                            @click="toTransfer">
                            {{$lan('您的dataBTokenName不足,请先跨链转入').replace('dataBTokenName', dataA.tokenName)}}
                        </view>
                    </view>
                    <view class="input-area">
                        <input
                            v-model="dataA.amountsInput"
                            @input="handleAmountInput1('A')"
                            :placeholder="dataA.type && !disabledEdit('A') ? $lan('请输入数量') : ''"
                            type="number"
                            class="amounts-input"
                            :disabled="disabledEdit('A')"
                            :class="{'amounts-input-disabled': disabledEdit('A')}"/>
                        <view class="nav-row-start-center data-type" @click="showTokenSelector('A')">
                            <view v-if="dataA.type" class="nav-row-start-center">
                                <image class="TZ-image" :src="dataA.iconUrl" v-show="dataA.iconUrl"/>
                                <text class="TZ-name">{{dataA.tokenName}}</text>
                            </view>
                            <text v-else class="TZ-name">{{$lan('选择通证')}}</text>
                            <icon-font icon="thk-s-right-arrow" style="margin-left: 13rpx"/>
                        </view>
                    </view>
                </view>
                <view class="transaction-direction transaction-to">
                    <view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                        <view class="transaction-direction-text">{{$lan('添加为')}}</view>
                        <view
                            class="tips-for-not-enough"
                            v-show="checkIfBalanceIsExceeded(dataB, 'B')"
                            @click="toTransfer">
                            {{$lan('您的dataBTokenName不足,请先跨链转入').replace('dataBTokenName', dataB.tokenName)}}
                        </view>
                    </view>
                    <view class="input-area">
                      <input
                          v-model="dataB.amountsInput"
                          @input="handleAmountInput1('B')"
                          :placeholder="dataB.type && !disabledEdit('B') ? $lan('请输入数量') : ''"
                          type="number"
                          class="amounts-input"
                          :disabled="disabledEdit('B')"
                          :class="{'amounts-input-disabled': disabledEdit('B')}"/>
                      <view class="nav-row-start-center data-type" @click="showTokenSelector('B')">
                        <view v-if="dataB.type" class="nav-row-start-center">
                          <image class="TZ-image" :src="dataB.iconUrl" v-show="dataB.iconUrl"/>
                          <text class="TZ-name">{{dataB.tokenName}}</text>
                        </view>
                        <text v-else class="TZ-name">{{$lan('选择通证')}}</text>
                        <icon-font icon="thk-s-right-arrow" style="margin-left: 13rpx"/>
                      </view>
                    </view>
                </view>
            </view>
            <view class="description" v-if="pairStatus === 1 && pairPriceText">
                <view class="description-item">
                    <view class="label">
                        {{$lan('当前兑换比例')}}
                    </view>
                    <view class="value">
                        {{pairPriceText}}
                    </view>
                </view>
                <view class="description-item">
                    <view class="label">
                        {{$lan('gas费')}}
                    </view>
                    <view class="value">
                        {{gasFeeNeeded}}TKM
                    </view>
                </view>
            </view>
        </view>

        <allBtn :text="this.$lan('确定添加')" @click="toAddLiquidity" :containerStyle="{width: '686rpx', height: '84rpx', marginTop: '120rpx'}" :disabled="!addLiquidityValid()"/>

        <!-- 通证选择器-->
        <tokenSelector ref="tokenSelector" @select="handleTokenSelect"/>
        <TransferLoading ref="TransferLoading"/>
        <PasswordPopup ref="passwordPopup"/>
    </view>
</template>
<script>
    import allBtn from "../../components/common/allBtn";
    import tokenSelector from "./components/tokenSelector";
    import decentralizedTransactionsApi from "../../apis/decentralizedTransactionsApi";
    import {mapState} from 'vuex';
    import walletApi from "../../apis/walletApi";
    import {groupObjValToList, _debounce, clearNoNum, arrangeNum} from "../../utils/common"
    import { aboutWallet, getTransactionResultByHashCircularly } from "../../utils/businessCommon"
    import TransferLoading from "../../components/TransferLoading";
    import PasswordPopup from "../../components/PasswordPopup";
    import {BigNumber} from "bignumber.js";
    import {contractIndexEnum} from "../../utils/data/enums";

    const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
    const ERC20Abi = require('../../utils/abis/ERC20');
    const flashSwapPool = require('../../utils/abis/flashSwapPool');

    // const tokenTestAddress = '0x8565a1fb09b87c36de5064deff11e1766ca5519b';
    const liquidChainId = '103';       // 兑换池的链id
    const gasFeeApprove = 0.7;         // 进行申请的gas费
    const gasFeeAddTKMToFlashSwapPool = 0.7;    // 向闪兑池加TKM的gas费
    const gasFeeAddLiquidity = 0.8;    // 添加兑换池的gas费

    export default {
        components: { allBtn, tokenSelector, TransferLoading, PasswordPopup },
        data() {
            return {
                dataA: {
                    contractAddress: '',
                    iconUrl: '',
                    tokenName: '',
                    type: '',
                    amount: '',
                    amountsInput: '',
                },
                dataB: {
                    contractAddress: '',
                    iconUrl: '',
                    tokenName: '',
                    type: '',
                    amount: '',
                    amountsInput: '',
                },
                inputType: '',  // A,B
                priceBToOneA: 0,  // 1个A对应的B的兑换比例
                priceAToOneB: 0,  // 1个B对应的A的兑换比例
                xtoList: [],
                otherTokenList: [
                    {   contractAddress: '',
                        iconUrl: '',
                        tokenName: 'TKM',
                        type: 'main',    // 主币
                        amount: '',
                    }
                ],
                pairPriceTextOrigin: '',
                pairPriceText: '',
                pairStatus: '',   // 1是兑换池兑换对, 2非兑换池兑换对
                transferType: '', // 兑换类型
                checkTokenInterval: '',
                hashResult: '',
                handleAmountInputDebounce: _debounce(() => {this.handleAmountInput()}, 500),
                toRegularNumber: aboutWallet.toRegularNumber,
                accountBalance: 0, // 账户余额，big
                gasFeeNeeded: '',
            }
        },
        computed: {
            ...mapState(['defaultWallet', '_contractAddress']),
        },
        methods: {
            async init(type = 1){
                let address = this.defaultWallet.address;
                if(!address){
                    return;
                }
                if(type == 1){

                }else if(type == 2){
                    this.dataA = {};
                    this.dataB = {};
                    this.pairStatus = '';
                    this.transferType = '';
                }
                await this.getData();
            },
            getData(){
                uni.showLoading({
                    title: '',
                    mask: true,
                });
                return Promise.all([this.getTokenList(), this.getAccount()]).then(() => {
                    uni.hideLoading();
                });
            },
            getTransferType(dataA, dataB){
                if(dataA.contractAddress && dataB.contractAddress && dataA.contractAddress !== dataB.contractAddress){
                    if((dataA.coinType == 1 && dataB.type === 'main') || (dataB.coinType == 1 && dataA.type === 'main')){
                        return 'stable'   // 结算凭证兑换
                    }else if(dataA.type === 'xto' && dataB.type !== 'xto'){
                        return 'xtoOut'   // 兑出xto
                    }else if(dataA.type !== 'xto' && dataB.type === 'xto'){
                        return 'xtoIn'    // 兑入xto
                    }else if(dataA.type !== 'xto' && dataB.type !== 'xto'){
                        return 'other'    // 其他兑换
                    }
                }else{
                    return '';
                }

            },
            getGasFeeNeeded(transferType){
                if(!transferType){
                    return ''
                }
                if(transferType ===  'stable'){
                    return gasFeeAddTKMToFlashSwapPool;
                }else{
                    return gasFeeApprove + gasFeeAddLiquidity;
                }
            },
            async transform(){
                let {dataA, dataB, pairStatus, inputType, transferType} = this;
                if(!(transferType === 'stable' || pairStatus === 1)){
                    this.pairPriceText = '';
                    return;
                }

                let data0,data1;
               if(inputType === 'A' && dataA.amountsInput > 0){
                   data0 = dataA;
                   data1 = dataB;
                }else if(inputType === 'B' && dataB.amountsInput > 0){
                   data0 = dataB;
                   data1 = dataA;
                }else{
                    dataA.amountsInput = '';
                    dataB.amountsInput = '';
                    this.pairPriceText = '';
                    return;
                }

                if(transferType === 'stable'){
                    let data0new, data1new;
                    if(data0.type === 'main'){
                        data0new = data0;
                        data1new = data1;
                    }else{
                        data0new = data1;
                        data1new = data0;
                    }
                    data1new.amountsInput = '';
                    this.pairPriceText = '';
                }else{
                    let amount = await this.getPurePairPrice(data0.amountsInput, data0.contractAddress, data1.contractAddress);
                    data1.amountsInput = aboutWallet.toRegularNumber(amount, 'ceil', 5);
                    let price = arrangeNum(data1.amountsInput / data0.amountsInput, '', 8);
                    this.pairPriceText = `1${data0.tokenName} ≈ ${price}${data1.tokenName}`;
                }
                this.$forceUpdate();
            },
            // 查看可用余额
            checkAvailableBalance(data, type){
                if(!data.contractAddress){
                    return 0;
                }
                let availableBalance;
                if(this.transferType === 'stable'){
                    if(data.type === 'main'){
                        availableBalance = data.amount - this.gasFeeNeeded;
                    }else{
                        availableBalance = data.amount
                    }

                }else{
                    let gasFeeNeed = 0;
                    if(data.type === 'main'){
                        gasFeeNeed = this.gasFeeNeeded;
                    }
                    if(type === this.inputType){
                        availableBalance = data.amount  - gasFeeNeed;
                    }else{
                        availableBalance = data.amount - gasFeeNeed;
                    }
                }
                return availableBalance >= 0 ? availableBalance : 0;

            },
            // 查看输入值是否超出余额
            checkIfBalanceIsExceeded(data, type){
                console.log(data);
                if(data.amountInput <= 0 || !data.contractAddress){
                    return false
                }
                return data.amountsInput - this.checkAvailableBalance(data, type) > 0;
            },
            disabledEdit(type){
                let {dataA, dataB, pairStatus, transferType} = this;
                if(type === 'A'){
                    return  (pairStatus !== 2 && dataB.type === 'xto') || (transferType === 'stable' && dataB.type === 'main')
                }else if(type === 'B'){
                    return (pairStatus !== 2 && dataA.type === 'xto') || (transferType === 'stable' && dataA.type === 'main')
                }
            },
            handleAmountInput1(type){
                this.$nextTick(() => {
                    if (this.dataA.type === 'xto') {
                        this.$set(this.dataA, 'amountsInput', clearNoNum(this.dataA.amountsInput, 'int') || '')
                    }
                    if (this.dataB.type === 'xto') {
                        this.$set(this.dataB, 'amountsInput', clearNoNum(this.dataB.amountsInput, 'int') || '');
                    }
                    this.inputType = type;
                    this.handleAmountInputDebounce();
                });
            },
            async handleAmountInput(){
                this.transform()
            },
            async getTokenList() {
                let address = this.defaultWallet.address && this.defaultWallet.address.toLowerCase();
                if(!address){
                    return;
                }

                let params = {
                    accountAddress: address,
                    contractAddress: '',
                    page: 1,
                    rows: 10000,
                    xtoName: '',
                };
                let result = await decentralizedTransactionsApi.getTokenList(params);
                let tokenList = result && result.data.data || [];

                this.xtoList = tokenList.filter((item) => {
                    return item.index > 0;
                }).map((item) => {
                    item.type = 'xto';
                    item.amount = aboutWallet.toRegularNumber(item.amount);
                    return item;
                });

                this.otherTokenList = tokenList.filter((item) => {
                    return item.index == 0 || item.index == contractIndexEnum.WTKM || item.index == contractIndexEnum.FLASH_SWAP;
                }).map((item) => {
                    if (item.index == contractIndexEnum.WTKM) {
                        item.type = 'main';
                    } else {
                        item.type = 'other';
                    }

                    if( item.index == contractIndexEnum.FLASH_SWAP ){
                        item.coinType = 1;
                    }
                    item.amount = aboutWallet.toRegularNumber(item.amount);
                    return item;
                });


                console.log('xtoList', this.xtoList);
                console.log('otherTokenList', this.otherTokenList);


            },
            showTokenSelector(source){  // 可以传入A B
                let index = this.otherTokenList.findIndex((item) => { return item.type === 'main'});
                if(this.otherTokenList[index]){
                    this.otherTokenList[index].amountBig = this.accountBalance;
                    this.otherTokenList[index].amount = aboutWallet.toRegularNumber(this.accountBalance);
                }

                let xtoTokenData = {
                    name: 'MTO/BTO',
                    list: this.xtoList,
                    method: 'xto',
                };

                let otherTokenData = {
                    name: this.$lan('其他通证'),
                    list: this.otherTokenList,
                    method: 'other',
                };

                console.log('xtoTokenData', xtoTokenData);
                console.log('otherTokenData', otherTokenData);

                let data;
                if((source === 'A' && this.dataB.type === 'xto') || (source === 'B' && this.dataA.type === 'xto')){
                    data = [otherTokenData];
                }else {
                    data = [xtoTokenData, otherTokenData]
                }
                this.$refs.tokenSelector.showPop(data, source);
            },
            async handleTokenSelect(e){
                if(e.source === 'A'){
                    this.dataA = Object.assign({}, this.dataA, e.data);

                }else if (e.source === 'B'){
                    this.dataB = Object.assign({}, this.dataB,  e.data);
                }

                if(this.dataA.type === 'xto'){
                    this.inputType = 'A';
                    this.dataA.amountsInput = clearNoNum(this.dataA.amountsInput, 'int') || '';
                }
                if(this.dataB.type === 'xto'){
                    this.inputType = 'B';
                    this.dataB.amountsInput = clearNoNum(this.dataB.amountsInput, 'int') || '';
                }

                let {dataA, dataB} =this;
                this.transferType = this.getTransferType(dataA, dataB);
                this.gasFeeNeeded = this.getGasFeeNeeded(this.transferType);
                if(this.transferType && this.transferType !== 'stable'){
                    let price = await this.getPurePairPrice('1', dataA.contractAddress, dataB.contractAddress);
                    this.pairStatus = price <= 0 ? 2 : 1;
                    console.log('选择兑换对后查询是否有兑换池兑换对', this.pairStatus);
                }else{
                    this.pairStatus = '';
                }

                this.transform();
                this.$forceUpdate();
            },
            // 查看 tkm余额
            async getAccount(){
                let address = this.defaultWallet.address && this.defaultWallet.address.toLowerCase();
                if(!address){
                    return;
                }
                let result = await walletApi.getAccount(liquidChainId, address);
                this.accountBalance = result.balance;
            },
            // 查看token余额
            checkTokenBalance(){

            },
            // 获得对价(去除掉兑换费用及溢价)
            async getPurePairPrice(amounts, tokenA, tokenB){
                if(!amounts){
                    return '';
                }
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    address: this.defaultWallet.address.toLowerCase(),
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                walletApi.setVal('0');
                let price =  await contractObj.quote(aboutWallet.toBigNumber(amounts), tokenA, tokenB );
                console.log(this.$lan('原始对价'), aboutWallet.toRegularNumber(price));
                return price;
            },
            // 查看对价
            async getPairPrice(amounts, tokenA, tokenB, type = 'out'){
                if(!amounts){
                  return '';
                }
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    address: this.defaultWallet.address.toLowerCase(),
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                let price;
                walletApi.setVal('0');
                if(type === 'in'){
                    price =  await contractObj.getAmountIn(aboutWallet.toBigNumber(amounts), tokenA, tokenB );
                }else {
                    console.log('lalal', amounts, tokenA, tokenB);
                    price =  await contractObj.getAmountOut(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                }
                return aboutWallet.toRegularNumber(price);
            },
            // 去转账
            toTransfer(){
                uni.navigateTo({
                    url: '/pages/transaction/transfer'
                })
            },
            // 判断是否可以进行添加
            addLiquidityValid(){
                if(!this.dataA.contractAddress || !this.dataB.contractAddress){
                    // this.$showToast('请选择需要添加的兑换对！');
                    return false;
                }
                if(this.dataA.contractAddress === this.dataB.contractAddress){
                    // this.$showToast('您选择的兑换对合约相同，请重新选择！');
                    return false;
                }

                if(this.transferType === 'stable'){
                    let data0,data1;
                    if(this.dataB.type === 'main'){
                        data0 = this.dataB;
                        data1 = this.dataA;
                    }else{
                        data0 = this.dataA;
                        data1 = this.dataB;
                    }
                    if(!data0.amountsInput){
                        // this.$showToast('请输入通证数量！');
                        return false;
                    }
                    if(this.checkIfBalanceIsExceeded(data0)){
                        // this.$showToast(`您的${this.dataA.tokenName}不足,请先跨链转入`);
                        return false;
                    }
                }else{
                    if(!this.dataA.amountsInput || !this.dataB.amountsInput){
                        // this.$showToast('请输入通证数量！');
                        return false;
                    }
                    if(this.checkIfBalanceIsExceeded(this.dataA, 'A')){
                        // this.$showToast(`您的${this.dataA.tokenName}不足,请先跨链转入`);
                        return false;
                    }

                    if(this.checkIfBalanceIsExceeded(this.dataB, 'B')){
                        // this.$showToast(`您的${this.dataB.tokenName}不足,请先跨链转入`);
                        return false;
                    }
                }

                if(aboutWallet.toRegularNumber(this.accountBalance) - this.gasFeeNeeded < 0){
                    // this.$showToast(`您的账户余额不足以支付gas费，请先跨链转入`);
                    return false;
                }
                return true;
            },
            // 去添加兑换池
            toAddLiquidity(){
                this.$refs.passwordPopup.showPasswordPopup({
                    cancel: () => {

                    },
                    success: async (password) => {
                        console.log(password)
                        let walletAddress = this.defaultWallet.address;
                        let privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, password);
                        this.addLiquidityGroupFuc(privateKey, walletAddress);
                        },
                    fail:  () => {

                    },
                });
            },
            // 添加兑换池（组合方法）
            async addLiquidityGroupFuc( privateKey, walletAddress){
                this.$refs.TransferLoading.show({text: '兑换池添加中，预计将于1分钟内完成，为避免添加未完成造成财产损失，完成前请勿关闭app', show: true,});

                let addResult;
                console.log('transferType', this.transferType );
                if(this.transferType === 'stable' ){
                    addResult = await this.addStableCoin(privateKey, walletAddress, this.dataA, this.dataB);
                }else{
                    // 查看是否approve过
                    if(this.dataA.type !== 'main'){
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataA.contractAddress, this.dataA.amountsInput);
                        if(result !== 'isOk'){
                            this.$refs.TransferLoading.hide();
                            this.$showToast(`申请${this.dataA.tokenName}额度失败，请稍后再试`);
                            return;
                        }
                    }
                    if(this.dataB.type !== 'main'){
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataB.contractAddress, this.dataB.amountsInput);
                        if(result !== 'isOk'){
                            this.$refs.TransferLoading.hide();
                            this.$showToast(`申请${this.dataB.tokenName}额度失败，请稍后再试`);
                            return;
                        }
                    }

                    // 进行添加兑换池
                    addResult = await this.addLiquidity(privateKey, walletAddress, this.dataA, this.dataB);
                }


                // 查hash
                if(addResult.TXhash){
                    let result = await getTransactionResultByHashCircularly(liquidChainId, addResult.TXhash);
                    if(result){
                        this.$showToast(this.$lan(`兑换池添加成功`));
                        setTimeout(() => {
                            this.init(2);
                        }, 1000)
                    }else{
                        this.$showToast(this.$lan(`兑换池添加失败，请稍后再试`));
                    }
                }else{
                    console.log(this.$lan('hash没有生成'));
                    this.$showToast(this.$lan(`兑换池添加失败，请稍后再试`));
                    setTimeout(() => {
                        this.init();
                    }, 1000)

                }

                this.$refs.TransferLoading.hide();

            },
            // 查看是否批准、进行批准(组合方法)
            async checkAndApproved(privateKey, walletAddress, tokenAddress, amounts ){
                if(!await this.checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts)){
                    await this.toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts);
                    let result = await this.checkTokenIfApprovedCircularly(privateKey, walletAddress, tokenAddress, amounts);
                    if(result){
                        return 'isOk';
                    }else{
                        return 'isNotOk';
                    }
                }else{
                    return 'isOk';
                }
            },
            // 查有没有批准,返回 boolean
            async checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts){
                let params = {
                    contractAbi: ERC20Abi,
                    contractAddress: tokenAddress,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract( params );
                console.log('11111-----', tokenAddress);
                walletApi.setVal('0');
                const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
                console.log('approve-check', aboutWallet.toRegularNumber(result));
                return aboutWallet.toRegularNumber(result) - amounts >= 1;
            },
            // 循环查询 有没有批准,返回 boolean
            async checkTokenIfApprovedCircularly(privateKey, walletAddress, tokenAddress, amounts){
                return new Promise((resolve, reject) => {
                    let times = 0;
                    this.checkTokenInterval = setInterval(async () => {
                        let result = await this.checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts);
                        if (result || times > 8) {
                            clearInterval(this.checkTokenInterval);
                            this.checkTokenInterval = null;
                            resolve(result);
                        } else {
                            times++
                        }
                    }, 1000)
                });
            },
            // 去token合约进行批准
            async toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts){
                let params = {
                    contractAbi: ERC20Abi,
                    contractAddress: tokenAddress,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                console.log(this.$lan('去批准的参数'), this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts - 0 + 10));
                walletApi.setVal('0');
                let approveResult = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts  - 0 + 10));
                console.log('approveResult', approveResult);
            },

            // 添加兑换池
            async addLiquidity(privateKey, walletAddress, dataA, dataB) {
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);

                let dataNewA, dataNewB;
                if(dataB.type === 'main'){
                    dataNewA = dataB;
                    dataNewB = dataA;
                }else{
                    dataNewA = dataA;
                    dataNewB = dataB;
                }

                if(dataNewA.type === 'main'){
                    let data = {
                        token: dataNewB.contractAddress,
                        amountTokenDesired: aboutWallet.toBigNumber(dataNewB.amountsInput),
                        amountTokenMin: '0',
                        amountTKMMin: '0',
                        to: walletAddress.toLowerCase(),
                        deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString(),
                    };
                    console.log(this.$lan('去添加兑换池1'), data);
                    walletApi.setVal(aboutWallet.toBigNumber(dataNewA.amountsInput));
                    return contractObj.addLiquidityTKM(...groupObjValToList(data));
                }else{
                    let data = {
                        tokenA: dataNewA.contractAddress,
                        tokenB: dataNewB.contractAddress,
                        amountADesired: aboutWallet.toBigNumber(dataNewA.amountsInput),
                        amountBDesired: aboutWallet.toBigNumber(dataNewB.amountsInput),
                        amountAMin: '0',
                        amountBMin: '0',
                        to: walletAddress.toLowerCase(),
                        deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString(),
                    };
                    console.log(this.$lan('去添加兑换池2'), data);
                    walletApi.setVal('0');
                    return contractObj.addLiquidity(...groupObjValToList(data));
                }
            },
            // 结算凭证充值
            async addStableCoin(privateKey, walletAddress, dataA, dataB){
                console.log('结算凭证充值');
                let dataNewA, dataNewB;
                if(dataB.type === 'main'){
                    dataNewA = dataB;
                    dataNewB = dataA;
                }else{
                    dataNewA = dataA;
                    dataNewB = dataB;
                }
                let params = {
                    privateKey,
                    contractAbi: flashSwapPool,
                    contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                walletApi.setVal(aboutWallet.toBigNumber(dataNewA.amountsInput));
                return contractObj.deposit();
            },
        },
        onShow(){
            this.init();
        },
        beforeDestroy(){
            clearInterval(this.checkTokenInterval);
            this.checkTokenInterval = null;
            this.handleAmountInputDebounce = null;
        },
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    ._block{
        width: 686rpx;
        background: #fff;
        margin: 0 auto;
        border-radius: 20rpx;
        padding: 56rpx 32rpx 63rpx;
    }
    .trade-type-description{
        color: #707070;
        font-size: 26rpx;
        line-height: 40rpx;
        vertical-align: center;
        border-bottom: 50rpx;
        overflow: hidden;
        margin-bottom: 50rpx;

        &:before{
            content: '';
            display: inline-block;
            width: 14rpx;
            height: 14rpx;
            border-radius: 50%;
            background: $main-color;
            margin-right: 20rpx;
            transform: translate(0, -30%);
        }
    }
    .transaction-select{
        margin: 0 auto;
        background: #FFF;
        overflow: hidden;
        .transaction-from{


        }
        .transaction-to{
            margin-top: 31rpx;
        }

        .transaction-direction-text{
            font-size: 26rpx;
            color: #333;
            line-height: 25rpx;
        }
        .tips-for-not-enough{
            font-size: 24rpx;
            color: #ED1923;
            line-height: 24rpx;
        }
        .input-area{
            width: 100%;
            height: 80rpx;
            border: 1rpx solid #AAA;
            border-radius: 8rpx;
            position: relative;
            overflow: hidden;
            .amounts-input{
                width: 100%;
                height: 100%;
                padding: 0 100rpx 0 50rpx;
                color: #333;
                font-size: 30rpx;
                font-weight: 600;
                &.amounts-input-disabled{
                    background: #eee;
                }
            }
            .data-type{
                position: absolute;
                top: 50%;
                right: 24rpx;
                transform: translate(0, -50%);
            }
        }

        .TZ-image{
            width: 32rpx;
            height: 32rpx;
            margin-right: 16rpx;
        }
        .TZ-name{
            font-size: 30rpx;
            color: #333;
            font-weight: 600;
        }
    }
    .description{
        margin-top: 40rpx;
        .description-item{
            height: 83rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .label{
                color: #555;
                font-size: 26rpx;
            }
            .value{
                color: #222;
                font-size: 26rpx;
            }
        }
       /* .description-item+.description-item{
            border-top: 1px solid #E0E0E0;
        }*/
    }

</style>
