<template>
    <view class="container" :style="{paddingTop: customBar + 90 + 'rpx'}">
        <view class="nav-fixed-top" style="width: 100%">
            <nav-bar :title="$lan('flashRedemption')" :isgoBack="false">
<!--                <view slot="rightBtn" class="to-trade-description" @click="jumpPage('/pages/decentralizedTransactions/transactionDescription')" v-if="hasDefaultWallet">-->
<!--                <image style="width:28rpx;height:30rpx;" mode="aspectFit" src="../../static/image/transfer/cmm.png"></image>-->
<!--                </view>-->
                <view slot="rightBtn" class="provide-token-pool" @click="jumpPage('/pages/decentralizedTransactions/liquidityAddition')">{{$lan('provideTokenPool')}}</view>
            </nav-bar>
        </view>


        <NoDefaultWallet v-if="!hasDefaultWallet"/>
        <scroll-view v-else class="scroll-view" scroll-y="true" style="height: 100%;">
            <view class="_block_2">
                <view class="_block_2_content transaction-select">
                    <view class="token-exchange" @click="exchangeToken" >
                       <icon-font src="wallet-p-shadow" width="76rpx" height="76rpx" class="_shadow"/>
                       <icon-font src="wallet-p-exchange"  width="61rpx" height="61rpx" class="token-exchange-img" :class="{'token-exchanged': tokenExchangeStatus == 1}"/>
                    </view>

                    <view class="transaction-direction transaction-from nav-row-start-center bottom-border">
                        <!--<view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                            <view class="transaction-direction-text">{{$lan('cashOut')}}</view>
                            <view
                                class="tips-for-not-enough"
                                v-if="checkIfBalanceIsExceeded(dataA, 'A')"
                                @click="toTransfer">
                                {{$lan('yourDataATokenIsInsufficient').replace('dataATokenName',dataA.tokenName)}}
                            </view>
                        </view>-->
                        <view class="nav-row-center-center token-type" @click="showTokenSelector('A')">
                            <view v-if="dataA.type" class="nav-column-center-center">
                                <image class="TZ-image" :src="dataA.iconUrl" v-show="dataA.iconUrl"/>
                                <text class="TZ-name">{{dataA.tokenName}}</text>
                            </view>
                            <text v-else class="TZ-name">{{$lan('pleaseSelectPass')}}</text>
                            <icon-font src="wallet-p-arrow-down" width="21rpx" height="12rpx" style="margin-left: 35rpx"/>
                        </view>
                        <view class="input-area" :class="{'input-disabled': disabledEdit('A')}">
                            <view class="transaction-direction-text">{{$lan('cashOut')}}</view>
                            <view
                                class="tips-for-not-enough"
                                v-if="checkIfBalanceIsExceeded(dataA, 'A')"
                                @click="toTransfer">
                              <view v-if="dataA.type=== 'main'">
                                {{$lan('yourDataATokenNameIsInsufficient').replace('dataATokenName',dataA.tokenName)}}
                                <text class="__btn">
                                  {{$lan('crossChainTransfer2')}}
                                </text>
                              </view>
                              <view v-else>
                                {{$lan('yourDataATokenNameIsInsufficient2').replace('dataATokenName',dataA.tokenName)}}
                              </view>
                            </view>
                            <input
                                v-model="dataA.amountsInput"
                                @input="handleAmountInput1('A')"
                                :placeholder="disabledEdit('A') ? '' : $lan('inputQuantity')"
                                type="number"
                                class="amounts-input"
                                :disabled="disabledEdit('A')"/>
                        </view>
                    </view>
                    <view class="transaction-direction transaction-to nav-row-start-center">
                        <!--<view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                            <view class="transaction-direction-text">{{$lan('cashIn')}}</view>
                            <view class="tips-for-not-enough" v-if="pairStatus == 1 && dataB.amountsInput - toRegularNumber(dataB.reserves) > 0">
                                {{
                                dataB.type === 'xto'
                                ?  $lan('insufficientTokenFlowPool1').replace('$dataBTokenName',dataB.tokenName).replace('$MathFloorTtoRegularNumberDataBReserves',Math.floor(toRegularNumber(dataB.reserves)))
                                :  $lan('$DataBTokenName通证流动池剩余量不足').replace('',$DataBTokenName)
                                }}

                            </view>
                        </view>-->
                        <view class="nav-row-center-center token-type" @click="showTokenSelector('B')">
                            <view v-if="dataB.type" class="nav-column-center-center">
                                <image class="TZ-image" :src="dataB.iconUrl" v-show="dataB.iconUrl"/>
                                <text class="TZ-name">{{dataB.tokenName}}</text>
                            </view>
                            <text v-else class="TZ-name">{{$lan('pleaseSelectPass')}}</text>
                          <icon-font src="wallet-p-arrow-down" width="21rpx" height="12rpx" style="margin-left: 35rpx"/>
                        </view>
                        <view class="input-area" :class="{'input-disabled': disabledEdit('B')}">
                            <view class="transaction-direction-text">{{$lan('cashIn')}}</view>
                            <view class="tips-for-not-enough" v-if="pairStatus == 1 && dataB.amountsInput - toRegularNumber(dataB.reserves) > 0">
                                {{
                                dataB.type === 'xto'
                                ?  $lan('insufficientTokenFlowPool1').replace('$dataBTokenName', dataB.tokenName).replace('$MathFloorTtoRegularNumberDataBReserves',Math.floor(toRegularNumber(dataB.reserves)))
                                :  $lan('insufficientTokenFlowPool2').replace('$ThisDataBTokenName', dataB.tokenName)
                                }}

                            </view>
                            <input
                                v-model="dataB.amountsInput"
                                @input="handleAmountInput1('B')"
                                :placeholder="disabledEdit('B') ? '' : $lan('inputQuantity')"
                                type="number"
                                class="amounts-input"
                                :disabled="disabledEdit('B')">
                        </view>
                    </view>
                </view>
                <view>

                </view>

                <!--<view class="btn-list nav-row-between-center">
                    <view class="btn-item" @click="jumpPage('/pages/transaction/transfer')">{{$lan('crossChainTransfer')}}</view>
                    <view class="btn-item" @click="jumpPage('/pages/decentralizedTransactions/liquidityAddition')">{{$lan('提供兑换池')}}</view>
                    <view class="btn-item" @click="jumpPage('/pages/decentralizedTransactions/transactionRecord')">{{$lan('查看记录')}}</view>
                </view>-->

            </view>
            <template>
                    <view class="trade-type-description" v-if="transferType === 'stable'">
                        {{$lan('otherExchangePairsDesc').replace('AMPL', dataA.coinType == 1 ? dataA.tokenName : dataB.tokenName)}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'xtoOut' && pairStatus == 1">
                        {{$lan('cashOutThePeculiarityOfXto')}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'xtoIn' && pairStatus == 1">
                        {{$lan('thePeculiaritiesOfCashingInXto')}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'other' && pairStatus == 1">
                        {{$lan('otherExchangePairTips2')}}
                    </view>
                    <view class="trade-type-description" v-else-if="pairStatus == 2">
                        {{$lan('noExchangePool').replace('dataATokenName', dataA.tokenName).replace('dataBTokenName', dataB.tokenName)}}
                    </view>
            </template>
<!--            <view class="transaction-description _block" style="margin-top: 20rpx; padding-top: 40rpx; padding-bottom: 23rpx;">-->
            <view class="transaction-description" style="padding-bottom: 23rpx;"  v-show="(pairStatus == 1 || transferType === 'stable')&& dataA.amountsInput && dataB.amountsInput">
                <view class="nav-row-start-center transaction-description-title" @click="showPriceDescriptionPopup">
                    <text>{{$lan('exchangeRatioDescription')}}</text>
                    <icon-font src="wallet-p-question2" width="25rpx" height="25rpx" style="margin-left: 22rpx"/>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('currentEchangeRatio')}}</view>
                    <view class="value">{{pairPriceText}}</view>
                </view>
                <view class="description-item" v-show="transferType !== 'stable'">
                    <view class="label">{{$lan('fluctuatingExchangeRatio')}}</view>
                    <view class="value">{{priceFluctuation}}</view>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('gasFee')}}</view>
                    <view class="value">{{gasFeeNeeded}}TKM</view>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('handlingFee')}}</view>
                    <view class="value">{{serviceCharge}}</view>
                </view>

                <!--<view class="description-item">
                    <view class="label">兑换路线</view>
                    <view class="value">0.0001  CBCX</view>
                </view>-->
            </view>
            <allBtn :text="this.$lan('redeem')" @click="toLiquidityTransfer" :containerStyle="{width: '686rpx', height: '90rpx', marginTop: '87rpx'}" :disabled="!liquidityTransferValid()"/>
            <view class="check-transaction-record"  @click="jumpPage('/pages/decentralizedTransactions/transactionRecord')">
              {{$lan('viewTransactionHistory')}}
            </view>
            <view style="height: 100rpx"/>
        </scroll-view>




        <!--Popup-->
        <!--Explanation of exchange rate-->
        <UniPopup ref="priceDescription" type="center">
            <view class="price-description-popup-container">
                <view class="close" @click="closePriceDescriptionPopup">
                    <icon-font src="wallet-p-close" width="50rpx" height="50rpx" />
                </view>
                <view class="content">
                   <view class="content-p">
                       {{$lan('currentEchangeRatio')}}
                   </view>
                    <view class="content-p">
                        {{$lan('ProportionChangeTransactionsAreNotExecuted')}}
                    </view>
                    <view class="content-p">
                        {{$lan('theActualConversionRatioWillBeAffected')}}
                    </view>
                    <view class="content-p">
                        {{$lan('reminderOfExchangeFee')}}
                    </view>
                   <!-- <view class="content-p">
                        {{$lan('通过兑换路线兑换将带来最高收益。')}}
                    </view>-->
                </view>
                <view class="has-known-btn" @click="closePriceDescriptionPopup">
                   {{$lan('IKnow')}}
                </view>
            </view>
        </UniPopup>

        <!-- Tongzheng selector-->
        <tokenSelector ref="tokenSelector" @select="handleTokenSelect"/>
        <TransferLoading ref="TransferLoading"/>
        <PasswordPopup ref="passwordPopup"/>

    </view>
</template>
<script>
    import allBtn from "../../components/common/allBtn";
    import tokenSelector from "./components/tokenSelector";
    import decentralizedTransactionsApi from "../../apis/decentralizedTransactionsApi";
    import {mapState, mapGetters} from 'vuex';
    import walletApi from "../../apis/walletApi";
    import { groupObjValToList, _debounce, clearNoNum, getPercentage, arrangeNum } from "../../utils/common"
    import {aboutWallet, getTransactionResultByHashCircularly} from "../../utils/businessCommon"
    import UniPopup from '../../components/uni-popup/uni-popup.vue'
    import NoDefaultWallet from "../../components/NoDefaultWallet";
    import PasswordPopup from "../../components/PasswordPopup";
    import TransferLoading from "../../components/TransferLoading";
    import {BigNumber} from 'bignumber.js';
    import { contractIndexEnum, ChainIdEnum } from "../../utils/data/enums";


    const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
    const ERC20Abi = require('../../utils/abis/ERC20');
    const flashSwapAbi = require('../../utils/abis/flashSwap');

    // const tokenTestAddress = '0x8565a1fb09b87c36de5064deff11e1766ca5519b';
    const liquidChainId = ChainIdEnum.BUSINESS_CHAIN;       // Chain ID of exchange poolid
    const gasFeeLiquidTransfer = 0.8;  // Exchange pool for gas fee
    const gasFeeStableTransfer = 0.8;  // Gas fee of settlement voucher exchange
    const gasFeeApprove = 0.7;         // Gas fee to apply for

    export default {
        components: { allBtn, tokenSelector, UniPopup, NoDefaultWallet, PasswordPopup, TransferLoading},
        data() {
            return {
                dataA: {
                    contractAddress: '',
                    iconUrl: '',
                    tokenName: '',
                    type: '',
                    amount: '',
                    amountsInput: '',
                    amountsInputBig: '',
                    reserves: '',           // Inventory
                },
                dataB: {
                    contractAddress: '',
                    iconUrl: '',
                    tokenName: '',
                    type: '',
                    amount: '',
                    amountsInput: '',
                    amountsInputBig: '',
                    reserves: '',           // Inventory
                },
                inputType: '',    // A,B
                priceBToOneA: 0,  // Exchange ratio of B corresponding to one a
                priceAToOneB: 0,  // Exchange ratio of a corresponding to 1 b
                tokenList: [
                    {   contractAddress: '',
                        iconUrl: '',
                        tokenName: 'TKM',
                        type: 'main',    // Main currency
                        amount: '',
                    }
                ],
                transactionPairList: [],
                pairPriceTextOrigin: '',
                pairPriceText: '',
                pairStatus: '',   // 1 is the exchange pool exchange pair, 2 is the non exchange pool exchange pair
                checkTokenInterval: '',
                hashResult: '',
                handleAmountInputDebounce: _debounce(() => {this.handleAmountInput()}, 500),
                toRegularNumber: aboutWallet.toRegularNumber,
                accountBalance: '',
                serviceCharge: '', // Service Charge
                priceFluctuation: '', // Exchange rate fluctuation
                gasFeeNeeded: '',
                tokenExchangeStatus: 0, // 0 not reversed, 1 reversed


                // #ifndef H5
                customBar: plus.navigator.getStatusbarHeight(),
                // #endif
                // #ifdef H5
                customBar: 0,
                // #endif

            }
        },
    //    onShow(){
    //         uni.setTabBarItem({
    //         index: 1,
    //         text:this.$lan('flashRedemption')
    //     });
    //     },
        computed: {
            ...mapState(['defaultWallet', '_contractAddress']),
            ...mapGetters(['hasDefaultWallet']),
            transferType(){
               let transferType = this.getTransferType(this.dataA, this.dataB);
               console.log('---transferType', transferType)
               return transferType;
            },

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
                }
                await this.getData();
            },
            async getBalance({walletAddress, contractAddress, type, chainId}){
                let balance = 0;
                try{
                    if(type == 'main'){
                        balance = await walletApi.ethGetAccount(chainId, walletAddress);
                    }else{
                        let params = {
                            contractAbi: ERC20Abi,
                            contractAddress: contractAddress,
                            chainId: chainId
                        };
                        console.log('-----params', params)
                        const contractObj = await walletApi.ethCallContract(params);
                        balance = await contractObj.balanceOf(walletAddress);
                    }
                }catch(err){
                   console.log('------getBalanceErr', err);
                }
                return balance.toString();
            },
            getData(){
                uni.showLoading({
                    title: '',
                    mask: true,
                });
                return Promise.all([this.getTokenData(), this.getTransactionPairList()]).then(() => {
                    uni.hideLoading();
                });
            },
            getTransferType(dataA, dataB){
                if(dataA.contractAddress && dataB.contractAddress && dataA.contractAddress !== dataB.contractAddress){
                    if((dataA.coinType == 1 && dataB.type === 'main') || (dataB.coinType == 1 && dataA.type === 'main')){
                        return 'stable'   // Exchange of settlement voucher
                    }else if(dataA.type === 'xto' && dataB.type !== 'xto'){
                        return 'xtoOut'   // Exchange XTO
                    }else if(dataA.type !== 'xto' && dataB.type === 'xto'){
                        return 'xtoIn'    // Into XTO
                    }else if(dataA.type !== 'xto' && dataB.type !== 'xto'){
                        return 'other'    // Other exchange
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
                    return gasFeeStableTransfer;
                }else{
                    return gasFeeApprove + gasFeeLiquidTransfer;
                }
            },
            // Make the conversion
            async transform() {
                let {dataA, dataB, pairStatus, transferType, inputType} = this;
                if(!(transferType === 'stable' || pairStatus === 1)){
                    this.pairPriceText = '';
                    return;
                }

                let data0, data1;
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
                    let amount = await this.getPairPriceForStableCoin();  // 1TKM = amount settlement voucher
                    let data0new, data1new;
                    if(data0.type === 'main'){
                        data1.amountsInput =  aboutWallet.toRegularNumber(new BigNumber(data0.amountsInput).multipliedBy(amount))
                        data0new = data0;
                        data1new = data1;
                    }else{
                        data0new = data1;
                        data1new = data0;
                        data1.amountsInput =  aboutWallet.toRegularNumber(new BigNumber(data0.amountsInput).div(amount).multipliedBy("1e+36"))
                    }
                    let price = aboutWallet.toRegularNumber(amount);
                    this.pairPriceText = `1${data0new.tokenName} = ${price}${data1new.tokenName}`;
                    let serviceCharge = this.getServiceCharge(data0new);
                    this.serviceCharge = serviceCharge.value + serviceCharge.tokenName;

                }else{
                    let amount = await this.getPairPrice(data0.amountsInput, dataA.contractAddress, dataB.contractAddress, inputType === 'A' ? 'out' : 'in');
                    data1.amountsInputBig = amount.toString();
                    data1.amountsInput = aboutWallet.toRegularNumber(amount);
                    console.log('data1.amountsInput', data1.amountsInput);
                    console.log('data0.amountsInput', data0.amountsInput);
                    let price = arrangeNum(data1.amountsInput / data0.amountsInput, '', 8);
                    this.pairPriceText = `1${data0.tokenName} ≈ ${price}${data1.tokenName}`;
                    let serviceCharge = this.getServiceCharge(data1);
                    this.serviceCharge = serviceCharge.value + serviceCharge.tokenName;
                    let purAmountBig = await this.getPurePairPrice(data0.amountsInput, data0.contractAddress, data1.contractAddress);
                    let purAmount =  aboutWallet.toRegularNumber(purAmountBig);
                    this.priceFluctuation = getPercentage(data1.amountsInput, purAmount, 'positive');
                }
                this.$forceUpdate();
            },
            // Get a commission
            getServiceCharge(data){
                return {
                    value: arrangeNum(data.amountsInput * 3 /1000, 'ceil'),
                    tokenName: data.tokenName
                };
            },
            // View available balance
            checkAvailableBalance(data, inputType){
               if(!data.contractAddress){
                   return 0;
               }
                let availableBalance;

                if(this.transferType === 'stable'){
                    if(data.type === 'main'){
                        let serviceCharge = this.getServiceCharge(data);
                        availableBalance =  data.amount - serviceCharge.value  - this.gasFeeNeeded;
                    }else{
                        availableBalance =  data.amount
                    }

                }else{
                    let gasFeeNeed = 0;
                    if(data.type === 'main'){
                        gasFeeNeed = this.gasFeeNeeded;
                    }
                    if(inputType !== this.inputType){
                        let serviceCharge = this.getServiceCharge(data);
                        availableBalance =  data.amount - serviceCharge.value  - gasFeeNeed;
                    }else{
                        availableBalance =  data.amount - gasFeeNeed;
                    }
                }

                return availableBalance >= 0 ? availableBalance : 0;
            },
            // Check whether the input value exceeds the balance
            checkIfBalanceIsExceeded(data, type){
                if(data.amountInput <= 0 || !data.contractAddress){
                   return false
                }
                return data.amountsInput - this.checkAvailableBalance(data, type) > 0;
            },
            // Check whether the input value exceeds the inventory
            checkIfStockIsExceeded(){

            },
            disabledEdit(type){
                let {dataA, dataB, pairStatus, transferType} = this;
                if(type === 'A'){
                    return  pairStatus !== 2 && dataB.type === 'xto'
                }else if(type === 'B'){
                    return  pairStatus !== 2 && dataA.type === 'xto'
                }
            },
            handleAmountInput1(type) {
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
            async handleAmountInput() {
                this.transform();
            },
            exchangeToken(){
                let dataA = _.cloneDeep(this.dataA);
                let dataB = _.cloneDeep(this.dataB);

                 dataA.amountsInput = this.dataB.amountsInput;
                 dataB.amountsInput = this.dataA.amountsInput;

                this.dataA = dataB;
                this.dataB = dataA;

                this.tokenExchangeStatus = this.tokenExchangeStatus == 1 ? 0 : 1;
                this.handleAmountInput1(this.inputType === 'A' ? 'B' : 'A');
                
                // this.transform();

            },
            async getTokenData(){
              const [result, resultB] = await Promise.all([this.getTokenList(), this.getAccount()]);

              let tokenList = result && result.data.data || [];

              this.tokenList = tokenList.filter((item) => {
                return item.index >= 0 || item.index == contractIndexEnum.WTKM || item.index == contractIndexEnum.FLASH_SWAP
              }).map((item) => {
                if(item.index > 0){
                  item.type = 'xto';
                }else if (item.index == contractIndexEnum.WTKM) {
                  item.type = 'main';
                }else{
                  item.type = 'other';
                }

                if( item.index == contractIndexEnum.FLASH_SWAP ){
                  item.coinType = 1;
                }
                item.amount = aboutWallet.toRegularNumber(item.amount);
                return item;
              });

              let index = this.tokenList.findIndex((item) => { return item.type === 'main'});
              if(this.tokenList[index]){
                this.tokenList[index].amountBig = resultB.toString();
                this.tokenList[index].amount = aboutWallet.toRegularNumber(resultB);
              }

              console.log('this.tokenList',  this.tokenList);

              // Setting default values for dataa and datab
              let dataA = this.tokenList.find((item) => {
                return item.index == contractIndexEnum.WTKM
              });
              let dataB = this.tokenList.find((item) => {
                return item.index == contractIndexEnum.FLASH_SWAP
              });
              this.handleTokenSelect({source: 'A', data: dataA})
              this.handleTokenSelect({source: 'B', data: dataB})

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

                return decentralizedTransactionsApi.getTokenList(params);




            },
            async getTransactionPairList(){
                let result = await decentralizedTransactionsApi.getTransactionPairList({chainId: this.$enums.ChainIdOldEnum.BUSINESS_CHAIN, address: ''});
                let data = result && result.data || {};
                let list = data.data || [];
                if(this._contractAddress.CONTRACT_FLASH_SWAP && this._contractAddress.CONTRACT_WTKM){
                    list.push({
                        tokenA: this._contractAddress.CONTRACT_FLASH_SWAP,
                        tokenB: this._contractAddress.CONTRACT_WTKM,
                    });
                }
                this.transactionPairList = list;
            },
            async showTokenSelector(source) {  // You must pass in a or B
                console.log('-this.tokenList',this.tokenList);

                let tokenList = _.cloneDeep(this.tokenList);

                if((source === 'A' && this.dataB.type) || (source === 'B' && this.dataA.type)){
                    let data0;
                    let transactionPairList = [];

                    if(source === 'A'){
                      data0 = this.dataB;
                    }else{
                      data0 = this.dataA;
                    }

                   this.transactionPairList.map((item, index) => {
                       if(item.tokenA === data0.contractAddress){
                           transactionPairList.push(
                               {
                                   hash: item.hash,
                                   pairAddress: item.pairAddress,
                                   tokenA: item.tokenA,
                                   tokenB: item.tokenB
                               })
                               console.log('--index', index)
                       }else if(item.tokenB === data0.contractAddress){
                           transactionPairList.push(
                               {
                                   hash: item.hash,
                                   pairAddress: item.pairAddress,
                                   tokenA: item.tokenB,
                                   tokenB: item.tokenA
                               });
                               console.log('--index', index)
                       }
                   });

                    console.log('--transactionPairList', transactionPairList);
                    tokenList = this.tokenList.filter((item) => {
                        return transactionPairList.findIndex((item2) => {return item2.tokenB === item.contractAddress}) > -1;
                    })

                }else{
                    tokenList = this.tokenList.filter((item) => {
                        return this.transactionPairList.findIndex((item2) => {return item2.tokenA === item.contractAddress || item2.tokenB === item.contractAddress}) > -1;
                    })
                }


                console.log('---tokenList',tokenList);

                let tokenData = {
                    name: '',
                    list: tokenList,
                    method: '',
                };


                console.log('--tokenData', tokenData);

                this.$refs.tokenSelector.showPop([tokenData], source);
            },
            async handleTokenSelect(e) {

                let data = e.data;
                data.amountBig = await this.getBalance({
                        walletAddress: this.defaultWallet.address.toLowerCase(), 
                        contractAddress: data.contractAddress, 
                        type: data.type, 
                        chainId: liquidChainId 
                        });
                data.amount = aboutWallet.toRegularNumber(data.amountBig);
                
                if(data.type === 'xto'){
                   this.inputType = e.source;
                   data.amountsInput = clearNoNum(data.amountsInput, 'int') || '';
                }

                console.log('---data', data)

                if(e.source === 'A'){
                    this.dataA = data;
                }else if (e.source === 'B'){
                    this.dataB = data;
                }

                let {dataA, dataB} = this;
                this.gasFeeNeeded = this.getGasFeeNeeded(this.transferType);
                if (this.transferType && this.transferType !== 'stable') {
                    let price = await this.getPurePairPrice('1', dataA.contractAddress, dataB.contractAddress);
                    this.pairStatus = price.toString() - 0 <= 0 ? 2 : 1;
                    console.log('After selecting the exchange pair, query whether there is a exchange pool exchange pair', this.pairStatus);
                    let reserves = await this.getReserves(dataA.contractAddress, dataB.contractAddress) || [];
                    dataA.reserves = reserves[0] && reserves[0].toString();
                    dataB.reserves = reserves[1] && reserves[1].toString();
                    console.log('Get the stock of exchange pool',reserves, dataA.reserves, dataB.reserves);
                } else {
                    this.pairStatus = '';
                    dataA.reserves = '';
                    dataB.reserves = ''
                }
                this.transform();
                this.$forceUpdate();
            },
            // View TKM balance
            async getAccount(){
                let balance = await walletApi.ethGetAccount(liquidChainId, this.defaultWallet.address.toLowerCase());
                this.accountBalance = balance.toString();
                return balance.toString();
            },
            // View token balance
            checkTokenBalance(){

            },
            // View inventory
            async getReserves(addressA, addressB){
                if(!addressA || !addressB){
                    return
                }

                try{
                    let params = {
                        contractAbi: thkSwapRouterAbi,
                        contractAddress: this._contractAddress.CONTRACT_ROUTER,
                        address: this.defaultWallet.address.toLowerCase(),
                        chainId: liquidChainId,
                        value: '0x0',
                    };
                    const contractObj = await walletApi.ethCallContract(params);
                    console.log('addressA', addressA)
                    console.log('addressB', addressB)
                    let reserves = await contractObj.getReserves(addressA, addressB);
                    console.log('---reserves', reserves);
                    return reserves;

                }catch(err){
                console.log('---err',err)
                }
                return []
                
            },
            // Gain consideration (excluding exchange fee and premium)
            async getPurePairPrice(amounts, tokenA, tokenB) {
                if (!amounts) {
                    return '';
                }
                try{
                    let params = {
                        contractAbi: thkSwapRouterAbi,
                        contractAddress: this._contractAddress.CONTRACT_ROUTER,
                        chainId: liquidChainId,
                    };
                    const contractObj = await walletApi.ethCallContract(params);
                    console.log('tokenA', tokenA);
                    console.log('tokenB', tokenB);
                    let price = await contractObj.quote(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                     console.log('--quote', price.toString())
                    return price;
                 }catch(err){
                     console.log('---getPurePairPriceErr', err)
                }
                return '0';
            },
            // View consideration
            async getPairPrice(amounts, tokenA, tokenB, type = 'out') {
                if (!amounts) {
                    return '';
                }

                try{
                    let params = {
                        contractAbi: thkSwapRouterAbi,
                        contractAddress: this._contractAddress.CONTRACT_ROUTER,
                        address: this.defaultWallet.address.toLowerCase(),
                        chainId: liquidChainId,
                        value: '0x0',
                    };
                    const contractObj = await walletApi.ethCallContract(params);
                    let price;
                    if (type === 'in') {
                        price = await contractObj.getAmountIn(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                        if(!(price - 0)){
                        price = '9'.repeat(99);
                        }
                    } else {
                        console.log('lalal', amounts, tokenA, tokenB);
                        price = await contractObj.getAmountOut(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                    }
                    console.log('View consideration', price.toString());
                    return price.toString();

                }catch(err){
                console.log('---err',err)
                }
                return '0'
                
            },
            // View consideration of settlement voucher
            async getPairPriceForStableCoin(){
                try{
                    let params = {  
                        contractAbi: flashSwapAbi,
                        contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP,
                        address: this.defaultWallet.address.toLowerCase(),
                        chainId: liquidChainId,
                        value: '0x0',
                    };
                    const contractObj = await walletApi.ethCallContract(params);
                    let price = await contractObj.rmbPrice();
                    console.log('View consideration', price && price.toString());
                    return price.toString();

                }catch(err){
                  console.log('---getPairPriceForStableCoinErr', err)
                }
                return '0'
            },
            // To transfer money
            toTransfer(){
                console.log('123');
                uni.navigateTo({
                    url: '/pages/transaction/transfer'
                })
            },
            // Judge whether it can be exchanged
            liquidityTransferValid(showToast = false) {
                if (!this.dataA.contractAddress || !this.dataB.contractAddress) {
                    showToast && this.$showToast(this.$lan('pleaseSelectAnExchangePair'));
                    return false;
                }

                if (this.dataA.contractAddress === this.dataB.contractAddress) {
                    showToast && this.$showToast(this.$lan('theSamePassCannotBeExchanged'));
                    return false;
                }

                if (!this.dataA.amountsInput || !this.dataB.amountsInput) {
                    showToast && this.$showToast(this.$lan('pleaseEnterTheNumberOfTokens'));
                    return false;
                }

                if(this.checkIfBalanceIsExceeded(this.dataA, 'A')){
                    showToast && this.$showToast(`yourtokenIsInsufficient`).replace('tokenName', this.dataA.tokenName);
                    return false;
                }

                if(this.transferType !== 'stable'){
                    if(this.dataB.amountsInput - aboutWallet.toRegularNumber(this.dataB.reserves) > 0){
                        showToast && this.$showToast(this.dataB.type === 'xto' ?  `${this.dataB.tokenName}通证流动池剩余量不足${Math.floor(aboutWallet.toRegularNumber(this.dataB.reserves))}枚` :  `${this.dataB.tokenName}通证流动池剩余量不足`);
                        return false;
                    }
                }

                if(aboutWallet.toRegularNumber(this.accountBalance) - this.gasFeeNeeded < 0){
                    showToast && this.$showToast(this.$lan('isNotEnoughToPayTheGasFee'));
                    return false;
                }
                return true;
            },
            // Go to the exchange pool
            toLiquidityTransfer() {
                this.$refs.passwordPopup.showPasswordPopup({
                    cancel: () => {
                    },
                    success: async (password) => {
                        console.log(password)
                        let walletAddress = this.defaultWallet.address;
                        let privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, password);
                        this.liquidityTransferFuc(privateKey, walletAddress);
                    },
                    fail: () => {

                    },
                });
            },
            // Exchange pool exchange (combination method)
            async liquidityTransferFuc(privateKey, walletAddress) {
                this.$refs.TransferLoading.show({text: this.$lan('theExchangeIsInProgressTips2')});

                let transferResult;
                if(this.transferType === 'stable' ){
                    // To exchange
                    transferResult =  await this.toTransferForStableCoin(privateKey, walletAddress, this.dataA, this.dataB);
                }else{
                    console.log('--this.dataA', this.dataA);
                    console.log('--this.dataB', this.dataB);
                    // Check whether it has been approved
                    if (this.dataA.type !== 'main') {
                        console.log('----approvedA-start')
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataA.contractAddress, this.dataA.amountsInput);
                        if (result !== 'isOk') {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(this.$lan('failedToApplyForTokenQuota').replace('tokenName', this.dataA.tokenName));
                            return;
                        }
                        console.log('----approvedA-end')
                    }
                    if (this.dataB.type !== 'main') {
                        console.log('----approvedB-start')
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataB.contractAddress, this.dataB.amountsInput);
                        if (result !== 'isOk') {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(this.$lan('failedToApplyForTokenB').replace('$ThisDataBTokenName}',this.dataB.tokenName));
                            return;
                        }
                        console.log('----approvedB-end')
                    }
                    // To exchange
                    transferResult =  await this.liquidityTransfer(privateKey, walletAddress, this.dataA, this.dataB);
                }

                // Check hash
                if(transferResult.hash){
                    let result = await getTransactionResultByHashCircularly(liquidChainId, transferResult.hash);
                    if(result){
                        setTimeout(() => {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(this.$lan(`successfulRedemption`));
                            this.jumpPage('/pages/decentralizedTransactions/transactionRecord')
                        }, 5000)
                    }else{
                        this.$refs.TransferLoading.hide();
                        this.$showToast(this.$lan(`redemptionFailedTips`));
                    }
                }else{
                    this.$refs.TransferLoading.hide();
                    console.log('hashNot generated');
                    this.$showToast(this.$lan(`redemptionFailedTips`));
                    setTimeout(() => {
                        this.init();
                    }, 1000)
                }
            },
            // Check whether to approve or not (combined method)
            async checkAndApproved(privateKey, walletAddress, tokenAddress, amounts) {
                if (!await this.checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts)) {
                    await this.toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts);
                    let result = await this.checkTokenIfApprovedCircularly(privateKey, walletAddress, tokenAddress, amounts);
                    if (result) {
                        return 'isOk';
                    } else {
                        return 'isNotOk';
                    }
                } else {
                    return 'isOk';
                }
            },
            // Check for approval
            async checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts) {
                let params = {
                    contractAbi: ERC20Abi,
                    contractAddress: tokenAddress,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.ethCallContract(params);
                console.log('11111-----');
                const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
                console.log('result-check', aboutWallet.toRegularNumber(result));
                console.log('判断', aboutWallet.toRegularNumber(result), amounts, aboutWallet.toRegularNumber(result) >= amounts);
                return aboutWallet.toRegularNumber(result) - amounts >= 1;
            },
            // Loop to check whether there is approval and return Boolean
            async checkTokenIfApprovedCircularly(privateKey, walletAddress, tokenAddress, amounts) {
                return new Promise((resolve, reject) => {
                    let times = 0;
                    this.checkTokenInterval = setInterval(async () => {
                        let result = await this.checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts);
                        console.log('---checkTokenIfApproved', result);
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
            // Go to token contract for approval
            async toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts) {
                let params = {
                    contractAbi: ERC20Abi,
                    contractAddress: tokenAddress,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.ethCallContract(params);
                console.log('Approved parameters', this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts - 0 + 10));
                const result = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts- 0 + 10));
                console.log('toTokenContractForApprovalResult', result);
            },

            // Exchange in the exchange pool
            async liquidityTransfer(privateKey, walletAddress, dataA, dataB) {
                console.log('----liquidityTransfer-start')
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                console.log('----ethCallContract', params)
                const contractObj = await walletApi.ethCallContract(params);

                let result;
                const amountIn =  aboutWallet.toBigNumber(dataA.amountsInput);
                const amountOut =  aboutWallet.toBigNumber(dataB.amountsInput);
                const amountInCal = dataA.amountsInputBig;
                const amountOutCal = dataB.amountsInputBig;
                const path = [dataA.contractAddress, dataB.contractAddress];
                const deadline = parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString();
                const to = walletAddress.toLowerCase();

                if(this.inputType === 'A' && dataA.type === 'main'){
                    let params = {
                        amountOutMin: '0',
                        path,
                        to,
                        deadline,
                    };
                    let overrides = {
                        value: amountIn,
                    }
                    console.log('----swapExactTKMForTokens', params)
                    result = await contractObj.swapExactTKMForTokens(...groupObjValToList(params), overrides);
                }else if(this.inputType === 'B' && dataB.type === 'main'){
                    let params = {
                        amountOut,
                        amountInMax: amountInCal,
                        path,
                        to,
                        deadline,
                    };
                    console.log('----swapTokensForExactTKM', params)
                    result = await contractObj.swapTokensForExactTKM(...groupObjValToList(params))
                }else if(this.inputType === 'A' && dataB.type === 'main'){
                    let params = {
                        amountIn,
                        amountOutMin: '0',
                        path,
                        to,
                        deadline
                    };
                    let overrides = {
                        value: '0',
                    }
                    console.log('----swapExactTokensForTKM', params)
                    result = await contractObj.swapExactTokensForTKM(...groupObjValToList(params), overrides)
                }else if(this.inputType === 'B' && dataA.type === 'main'){
                    let params = {
                        amountOut,
                        path,
                        to,
                        deadline
                    };
                    let overrides = {
                        value: amountInCal,
                    }
                    console.log('----swapTKMForExactTokens', params)
                    result = await contractObj.swapTKMForExactTokens(...groupObjValToList(params), overrides)
                }else if(this.inputType === 'A'){
                    let params = {
                        amountIn,
                        amountOutMin: '0',
                        path,
                        to,
                        deadline,
                    };
                    console.log('----swapExactTokensForTokens', params)
                    result = await contractObj.swapExactTokensForTokens(...groupObjValToList(params))
                }else if(this.inputType === 'B'){
                    let params = {
                        amountOut,
                        amountInMax: amountInCal,
                        path,
                        to,
                        deadline
                    };
                    console.log('----swapTokensForExactTokens', params)
                    result = await contractObj.swapTokensForExactTokens(...groupObjValToList(params))
                }
                console.log('----liquidityTransfer-end', result)
                return result;
            },
            // Exchange settlement voucher
            async toTransferForStableCoin(privateKey, walletAddress, dataA, dataB){
                const amountIn =  aboutWallet.toBigNumber(dataA.amountsInput);
                const amountOut =  aboutWallet.toBigNumber(dataB.amountsInput);
                const to = walletAddress.toLowerCase();

                let params = {
                    privateKey,
                    contractAbi: flashSwapAbi,
                    contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP,
                    address: walletAddress.toLowerCase(),
                    chainId: liquidChainId
                };
                console.log('----ethCallContract', params)
                const contractObj = await walletApi.ethCallContract(params);
                if(dataA.type === 'main' && dataB.coinType == 1){
                    console.log('Cash in settlement voucher', to);
                    console.log('amountIn', amountIn);
                    let params = {
                        to,
                    };
                    let overrides = {
                        value: amountIn,
                    }
                    console.log('----swapTKMForToken', params)
                    return await contractObj.swapTKMForToken(...groupObjValToList(params), overrides);
                }else if(dataB.type === 'main' && dataA.coinType == 1){
                    let params = {
                        amountIn,
                        to,
                    };
                    console.log('----swapTokenForTKM', params)
                    return await contractObj.swapTokenForTKM(...groupObjValToList(params));
                }
            },
            showPriceDescriptionPopupshowPriceDescriptionPopup() {
                this.$refs.priceDescription.open()
            },
            jumpPage(path){
                uni.navigateTo({url: path})
            },
            closePriceDescriptionPopup(){
                this.$refs.priceDescription.close()
            },
            // Exchange ratio of settlement voucher
            async provideStableCurrencyPrice(){
                let walletAddress = this.defaultWallet.address.toLowerCase()
                let privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, '123456');
                let params = {
                    privateKey,
                    contractAbi: flashSwapAbi,
                    contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.ethCallContract(params);
                let result = await contractObj.feedPrice(aboutWallet.toBigNumber(0.6));
            }
        },
        onShow(){
            this.init(2);
            console.log('1111111',this._contractAddress)
        },
        beforeDestroy(){
            clearInterval(this.checkTokenInterval);
            this.checkTokenInterval = null;
            this.handleAmountInputDebounce = null;
        }
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
  .container{
      height: 100%;
      background: #fff;
      ._block{
          width: 686rpx;
          background: #fff;
          margin: 0 auto;
          border-radius: 20rpx;
          padding: 56rpx 32rpx 63rpx;
      }
      ._block_2{
          width: 650rpx;
          margin: 40rpx auto 0;
          position: relative;
          &:before{
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            border: solid 1px #E4E6EA;
            /*border: solid 1px red;*/
            border-radius: 40rpx;
            z-index: 1;
            box-sizing: border-box;
          }
          ._block_2_content{
            position: relative;
            z-index: 10;
            border-radius: 20rpx;
            border: 1px solid rgba(0,0,0,0);
            overflow: hidden;
          }
      }
      .trade-type-description{
        color: #aaa;
        font-size: 26rpx;
        line-height: 40rpx;
        vertical-align: center;
        overflow: hidden;
        width: 650rpx;
        margin:  30rpx auto 0;
      }

      .transaction-select{
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          .token-exchange{
              position: absolute;
              top: 173rpx;
              left: 198rpx;
              z-index: 9;
              .token-exchange-img{
                position: absolute;
                top: 2rpx;
                left: 50%;
                transform:  translate(-50%, 0) rotateZ(0deg);
                transition: all 0.4s linear;
                &.token-exchanged{
                  transform: translate(-50%, 0) rotateZ(180deg);
                }

              }

          }
          .transaction-from{
            position: relative;


          }
          .transaction-to{
            height: 211rpx;
          }

          .transaction-direction{
            height: 210rpx;
          }
          .token-type{
              height: 100%;
              width: 239rpx;
              background: #EDEFF3;
          }
          .input-area{
              flex: 1;
              height: 100%;
              position: relative;
              overflow: hidden;
              padding-left: 64rpx;
              .transaction-direction-text{
                  font-size: 26rpx;
                  color: #666;
                  line-height: 25rpx;
                  position: absolute;
                  top: 35rpx;
              }
              .tips-for-not-enough{
                  font-size: 24rpx;
                  color: #999;
                  line-height: 24rpx;
                  position: absolute;
                  top: 85rpx;
                  .__btn{
                     color: $main-color;
                  }
              }
              .amounts-input{
                  color: #333;
                  font-size: 34rpx;
                  font-weight: 600;
                  line-height: 34rpx;
                  height: 34rpx;
                  position: absolute;
                  top: 134rpx;

                  &.amounts-input-disabled{
                      background: #eee;
                  }

                ::-webkit-input-placeholder { /* WebKit, Blink, Edge */    color:  #aaa; }

                :-moz-placeholder { /* Mozilla Firefox 4 to 18 */   color: #aaa; }

                ::-moz-placeholder { /* Mozilla Firefox 19+ */   color: #aaa; }

                :-ms-input-placeholder { /* Internet Explorer 10-11 */   color:#aaa; }
              }
             &.input-disabled{
                background: #E4E6EA;
             }
          }

          .TZ-image{
              width: 56rpx;
              height: 56rpx;
              margin-bottom: 23rpx;
              border-radius: 10rpx;

          }
          .TZ-name{
              font-size: 30rpx;
              line-height: 23rpx;
              color: #333;
              font-weight: 600;

          }
      }
      .current-price{
          margin-top: 40rpx;
          .label{
              color: #555;
              font-size: 26rpx;
          }
          .value{
              color: #222;
              font-size: 26rpx;
          }
      }
      .transaction-description{
          width: 650rpx;
          margin: 0 auto;
          .transaction-description-title{
              color: #333;
              font-size: 30rpx;
              line-height: 28rpx;
              font-weight: 600;
              margin-top: 33rpx;
              margin-bottom:17rpx;
          }
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
          .description-item+.description-item{
              border-top: 1px solid #E0E0E0;
          }
      }

      .check-transaction-record{
          color: #555;
          font-size: 26rpx;
          line-height: 25rpx;
          width: 300rpx;
          margin: 38rpx auto 0;
         text-align: center;
      }
  }

    .price-description-popup-container{
        width: 585rpx;
        height: 927rpx;
        background: url("../../static/image/decentralizedTransactions/price-description-bg.png") no-repeat;
        background-size: cover;
        position: relative;
        .close{
            position: absolute;
            top: -50rpx;
            right: -50rpx;
        }
        .content{
            width: 430rpx;
            margin: 0 auto;
            padding-top: 200rpx;
            .content-p{
                color: #523919;
                font-size: 28rpx;
                line-height: 36rpx;
                position: relative;
                &:before{
                    content: '';
                    position: absolute;
                    top: 18rpx;
                    left: -26rpx;
                    transform: translate(0, -50%);
                    width: 10rpx;
                    height: 10rpx;
                    background: #BF9766;
                    border-radius: 50%;
                }
            }
            .content-p+.content-p{
                margin-top: 24rpx;
            }
        }
        .has-known-btn{
            background: url('../../static/image/decentralizedTransactions/price-description-btn.png') no-repeat;
            background-size: cover;
            width: 500rpx;
            height: 90rpx;
            position: absolute;
            left: 50%;
            bottom: 40rpx;
            transform: translate(-50%, 0);
            font-size: 32rpx;
            color: #fff;
            line-height: 90rpx;
            text-align: center;
        }
    }
    .btn-list{
        margin-top: 63rpx;
        .btn-item{
            width: 180rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            border-radius: 30rpx;
            background: $main-color;
            color: #fff;
            font-size: 26rpx;

        }
    }

    .provide-token-pool{
      font-size: 30rpx;
      color: #333;
    }

    .bottom-border{
      &:before{
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #D3D7DD;
        -webkit-transform-origin: bottom center;
        transform-origin: bottom center;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }

    }
</style>
