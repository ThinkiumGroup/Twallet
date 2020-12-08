<template>
    <view class="container" :style="{paddingTop: customBar + 90 + 'rpx'}">
        <view class="nav-fixed-top" style="width: 100%">
            <nav-bar :title="$lan('闪兑')" :isgoBack="false">
                <view slot="rightBtn" class="to-trade-description" @click="jumpPage('/pages/decentralizedTransactions/transactionDescription')" v-if="hasDefaultWallet">
                <image style="width:28rpx;height:30rpx;" mode="aspectFit" src="../../static/image/transfer/cmm.png"></image>
                </view>
            </nav-bar>
        </view>


        <NoDefaultWallet v-if="!hasDefaultWallet"/>
        <scroll-view v-else class="scroll-view" scroll-y="true" style="height: 100%;">
            <view class="_block" style="margin-top: 32rpx;">
                <template>
                    <view class="trade-type-description" v-if="transferType === 'stable'">
                        {{$lan('其他兑换对（市场定价）：其他非MTO、BTO通证与稳定结算通证AMPL兑换时，采用市场定价模型，波动性由市场决定').replace('AMPL', dataA.coinType == 1 ? dataA.tokenName : dataB.tokenName)}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'xtoOut' && pairStatus == 1">
                        {{$lan('兑出MTO、BTO：当前可以出兑MTO、BTO资产兑换其他资产，由于MTO、BTO通证的特殊性，仅支持出兑正整数个相应通证,只允许输入通证的数量，兑换比例由兑换池决定。')}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'xtoIn' && pairStatus == 1">
                        {{$lan('兑入MTO、BTO：当前可以出兑MTO、BTO资产兑换其他资产，由于MTO、BTO通证的特殊性，仅支持出兑正整数个相应通证,只允许输入通证的数量，兑换比例由兑换池决定。')}}
                    </view>
                    <view class="trade-type-description" v-else-if="transferType === 'other' && pairStatus == 1">
                        {{$lan('其他兑换对：当前可以进行任意两种非MTO、BTO类通证间的兑换，兑换比例由兑换池决定')}}
                    </view>
                    <view class="trade-type-description" v-else-if="pairStatus == 2">
                        {{$lan('暂无dataATokenName-dataBTokenName兑换池，无法完成兑换，如您可以添加兑换池，快去添加吧！').replace('dataATokenName', dataA.tokenName).replace('dataBTokenName', dataB.tokenName)}}
                    </view>
                </template>
                <view class="transaction-select">
                    <view class="transaction-direction transaction-from">
                        <view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                            <view class="transaction-direction-text">{{$lan('出兑')}}</view>
                            <view
                                class="tips-for-not-enough"
                                v-if="checkIfBalanceIsExceeded(dataA, 'A')"
                                @click="toTransfer">
                                {{$lan('您的dataATokenName不足,请先跨链转入').replace('dataATokenName',dataA.tokenName)}}
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
                                <text v-else class="TZ-name">{{$lan('请选择通证')}}</text>
                                <icon-font icon="thk-s-right-arrow" style="margin-left: 13rpx"/>
                            </view>
                        </view>
                    </view>
                    <view class="transaction-direction transaction-to">
                        <view class="nav-row-between-center" style="margin-bottom: 24rpx;">
                            <view class="transaction-direction-text">{{$lan('兑入')}}</view>
                            <view class="tips-for-not-enough" v-if="pairStatus == 1 && dataB.amountsInput - toRegularNumber(dataB.reserves) > 0">
                                {{
                                dataB.type === 'xto'
                                ?  $lan('$dataBTokenName通证流动池剩余量不足$MathFloorTtoRegularNumberDataBReserves枚').replace('$dataBTokenName',dataB.tokenName).replace('$MathFloorTtoRegularNumberDataBReserves',Math.floor(toRegularNumber(dataB.reserves)))
                                :  $lan('$DataBTokenName通证流动池剩余量不足').replace('',$DataBTokenName)
                                }}

                            </view>
                        </view>
                        <view class="input-area">
                            <input
                                v-model="dataB.amountsInput"
                                @input="handleAmountInput1('B')"
                                :placeholder="dataB.type && !disabledEdit('B')? $lan('请输入数量') :''"
                                type="number"
                                class="amounts-input"
                                :disabled="disabledEdit('B')"
                                :class="{'amounts-input-disabled': disabledEdit('B')}"/>
                            <view class="nav-row-start-center data-type" @click="showTokenSelector('B')">
                                <view v-if="dataB.type" class="nav-row-start-center">
                                    <image class="TZ-image" :src="dataB.iconUrl" v-show="dataB.iconUrl"/>
                                    <text class="TZ-name">{{dataB.tokenName}}</text>
                                </view>
                                <text v-else class="TZ-name">{{$lan('请选择通证')}}</text>
                                <icon-font icon="thk-s-right-arrow" style="margin-left: 13rpx"/>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="btn-list nav-row-between-center">
                    <view class="btn-item" @click="jumpPage('/pages/transaction/transfer')">{{$lan('跨链转账')}}</view>
                    <view class="btn-item" @click="jumpPage('/pages/decentralizedTransactions/liquidityAddition')">{{$lan('提供兑换池')}}</view>
                    <view class="btn-item" @click="jumpPage('/pages/decentralizedTransactions/transactionRecord')">{{$lan('查看记录')}}</view>
                </view>

            </view>
            <view class="transaction-description _block" style="margin-top: 20rpx; padding-top: 40rpx; padding-bottom: 23rpx;" v-show="(pairStatus == 1 || transferType === 'stable')&& dataA.amountsInput && dataB.amountsInput">
                <view class="nav-row-start-center" @click="showPriceDescriptionPopup">
                    <text>{{$lan('兑换比例说明')}}</text>
                    <icon-font src="wallet-p-question2" width="25rpx" height="25rpx" style="margin-left: 20rpx"/>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('当前兑换比例')}}</view>
                    <view class="value">{{pairPriceText}}</view>
                </view>
                <!--<view class="description-item">
                    <view class="label">最低收到</view>
                    <view class="value">0.0007319 CBCX</view>
                </view>-->
                <view class="description-item" v-show="transferType !== 'stable'">
                    <view class="label">{{$lan('兑换比例波动')}}</view>
                    <view class="value">{{priceFluctuation}}</view>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('gas费')}}</view>
                    <view class="value">{{gasFeeNeeded}}TKM</view>
                </view>
                <view class="description-item">
                    <view class="label">{{$lan('手续费')}}</view>
                    <view class="value">{{serviceCharge}}</view>
                </view>

                <!--<view class="description-item">
                    <view class="label">兑换路线</view>
                    <view class="value">0.0001  CBCX</view>
                </view>-->
            </view>
            <allBtn :text="this.$lan('进行兑换')" @click="toLiquidityTransfer" :containerStyle="{width: '686rpx', height: '84rpx', marginTop: '120rpx'}" :disabled="!liquidityTransferValid()"/>
            <view style="height: 100rpx"/>
        </scroll-view>




        <!--弹窗-->
        <!--兑换比例说明-->
        <UniPopup ref="priceDescription" type="center">
            <view class="price-description-popup-container">
                <view class="close" @click="closePriceDescriptionPopup">
                    <icon-font src="wallet-p-close" width="50rpx" height="50rpx" />
                </view>
                <view class="content">
                   <view class="content-p">
                       {{$lan('当前兑换比例。')}}
                   </view>
                    <view class="content-p">
                        {{$lan('如果在确认前出现较大的兑换比例变动，本次兑换将不被执行。')}}
                    </view>
                    <view class="content-p">
                        {{$lan('由于兑换池规模等影响实际兑换比例可能会与预估存在一定偏差。')}}
                    </view>
                    <view class="content-p">
                        {{$lan('每次执行兑换后，其中一部分（0.30%）将作为协议激励向兑换池提供者支付。')}}
                    </view>
                   <!-- <view class="content-p">
                        {{$lan('通过兑换路线兑换将带来最高收益。')}}
                    </view>-->
                </view>
                <view class="has-known-btn" @click="closePriceDescriptionPopup">
                   {{$lan('我知道了')}}
                </view>
            </view>
        </UniPopup>

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
    import {mapState, mapGetters} from 'vuex';
    import walletApi from "../../apis/walletApi";
    import { groupObjValToList, _debounce, clearNoNum, getPercentage, arrangeNum } from "../../utils/common"
    import {aboutWallet, getTransactionResultByHashCircularly} from "../../utils/businessCommon"
    import UniPopup from '../../components/uni-popup/uni-popup.vue'
    import NoDefaultWallet from "../../components/NoDefaultWallet";
    import PasswordPopup from "../../components/PasswordPopup";
    import TransferLoading from "../../components/TransferLoading";
    import {BigNumber} from 'bignumber.js';
    import { contractIndexEnum } from "../../utils/data/enums";


    const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
    const ERC20Abi = require('../../utils/abis/ERC20');
    const flashSwapAbi = require('../../utils/abis/flashSwap');

    // const tokenTestAddress = '0x8565a1fb09b87c36de5064deff11e1766ca5519b';
    const liquidChainId = '103';       // 兑换池的链id
    const gasFeeLiquidTransfer = 0.8;  // 兑换池兑换 gas费
    const gasFeeStableTransfer = 0.8;  // 结算凭证兑换 gas费
    const gasFeeApprove = 0.7;         // 去申请的 gas费

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
                    reserves: '',           // 库存量
                },
                dataB: {
                    contractAddress: '',
                    iconUrl: '',
                    tokenName: '',
                    type: '',
                    amount: '',
                    amountsInput: '',
                    amountsInputBig: '',
                    reserves: '',           // 库存量
                },
                inputType: '',    // A,B
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
                accountBalance: '',
                serviceCharge: '', // 手续费
                priceFluctuation: '', // 兑换比例波动
                gasFeeNeeded: '',


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
    //         text:this.$lan('闪兑')
    //     });
    //     },
        computed: {
            ...mapState(['defaultWallet', '_contractAddress']),
            ...mapGetters(['hasDefaultWallet']),
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
                    return gasFeeStableTransfer;
                }else{
                    return gasFeeApprove + gasFeeLiquidTransfer;
                }
            },
            // 进行转换
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
                    let amount = await this.getPairPriceForStableCoin();  // 1TKM = amount 个结算凭证
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
            // 获得手续费
            getServiceCharge(data){
                return {
                    value: arrangeNum(data.amountsInput * 3 /1000, 'ceil'),
                    tokenName: data.tokenName
                };
            },
            // 查看可用余额
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
            // 查看输入值是否超出余额
            checkIfBalanceIsExceeded(data, type){
                if(data.amountInput <= 0 || !data.contractAddress){
                   return false
                }
                return data.amountsInput - this.checkAvailableBalance(data, type) > 0;
            },
            // 查看输入值是否超出库存
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
            async showTokenSelector(source) {  // 可以传入A B
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
                if ((source === 'A' && this.dataB.type === 'xto') || (source === 'B' && this.dataA.type === 'xto')) {
                    data = [otherTokenData];
                } else {
                    data = [xtoTokenData, otherTokenData]
                }
                this.$refs.tokenSelector.showPop(data, source);
            },
            async handleTokenSelect(e) {
                if (e.source === 'A') {
                    this.dataA = Object.assign({}, this.dataA, e.data);

                } else if (e.source === 'B') {
                    this.dataB = Object.assign({}, this.dataB, e.data);
                }

                if (this.dataA.type === 'xto') {
                    this.inputType = 'A';
                    this.dataA.amountsInput = clearNoNum(this.dataA.amountsInput, 'int') || '';
                }
                if (this.dataB.type === 'xto') {
                    this.inputType = 'B';
                    this.dataB.amountsInput = clearNoNum(this.dataB.amountsInput, 'int') || '';
                }

                let {dataA, dataB} = this;
                this.transferType = this.getTransferType(dataA, dataB);
                this.gasFeeNeeded = this.getGasFeeNeeded(this.transferType);
                if (this.transferType && this.transferType !== 'stable') {
                    let price = await this.getPurePairPrice('1', dataA.contractAddress, dataB.contractAddress);
                    this.pairStatus = price.toString() - 0 <= 0 ? 2 : 1;
                    console.log('选择兑换对后查询是否有兑换池兑换对', this.pairStatus);
                    let reserves = await this.getReserves(dataA.contractAddress, dataB.contractAddress) || [];
                    dataA.reserves = reserves[0].toString();
                    dataB.reserves = reserves[1].toString();
                    console.log('获得兑换池库存量',reserves, dataA.reserves, dataB.reserves);
                } else {
                    this.pairStatus = '';
                    dataA.reserves = '';
                    dataB.reserves = ''
                }

                this.transform();
                this.$forceUpdate();
            },
            // 查看 tkm余额
            async getAccount(){
                let result = await walletApi.getAccount(liquidChainId, this.defaultWallet.address.toLowerCase());
                this.accountBalance = result.balance;
            },
            // 查看token余额
            checkTokenBalance(){

            },
            // 查看库存量
            async getReserves(addressA, addressB){
                if(!addressA || !addressB){
                    return
                }
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    address: this.defaultWallet.address.toLowerCase(),
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                walletApi.setVal('0');
                let reserves = await contractObj.getReserves(addressA, addressB);
                console.log('reserves', reserves);
                return reserves;
            },
            // 获得对价(去除掉兑换费用及溢价)
            async getPurePairPrice(amounts, tokenA, tokenB) {
                if (!amounts) {
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
                console.log('tokenA', tokenA);
                console.log('tokenB', tokenB);
                console.log('aboutWallet.toBigNumber(amounts)', aboutWallet.toBigNumber(amounts));
                let price = await contractObj.quote(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                return price;
            },
            // 查看对价
            async getPairPrice(amounts, tokenA, tokenB, type = 'out') {
                if (!amounts) {
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
                let price;
                if (type === 'in') {
                    price = await contractObj.getAmountIn(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                } else {
                    console.log('lalal', amounts, tokenA, tokenB);
                    price = await contractObj.getAmountOut(aboutWallet.toBigNumber(amounts), tokenA, tokenB);
                }
                console.log('查看对价', price.toString());
                return price;
            },
            // 查看结算凭证的对价
            async getPairPriceForStableCoin(){
                let params = {
                    contractAbi: flashSwapAbi,
                    contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP,
                    address: this.defaultWallet.address.toLowerCase(),
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                walletApi.setVal('0');
                let price = await contractObj.rmbPrice();
                console.log('查看对价', price.toString());
                return price;
            },
            // 去转账
            toTransfer(){
                console.log('123');
                uni.navigateTo({
                    url: '/pages/transaction/transfer'
                })
            },
            // 判断是否可以进行兑换
            liquidityTransferValid(showToast = false) {
                if (!this.dataA.contractAddress || !this.dataB.contractAddress) {
                    showToast && this.$showToast('请选择兑换对！');
                    return false;
                }

                if (this.dataA.contractAddress === this.dataB.contractAddress) {
                    showToast && this.$showToast('不能进行同通证间兑换，请重新选择！');
                    return false;
                }

                if (!this.dataA.amountsInput || !this.dataB.amountsInput) {
                    showToast && this.$showToast('请输入通证数量！');
                    return false;
                }

                if(this.checkIfBalanceIsExceeded(this.dataA, 'A')){
                    showToast && this.$showToast(`您的${this.dataA.tokenName}不足,请先跨链转入`);
                    return false;
                }

                if(this.transferType !== 'stable'){
                    if(this.dataB.amountsInput - aboutWallet.toRegularNumber(this.dataB.reserves) > 0){
                        showToast && this.$showToast(this.dataB.type === 'xto' ?  `${this.dataB.tokenName}通证流动池剩余量不足${Math.floor(aboutWallet.toRegularNumber(this.dataB.reserves))}枚` :  `${this.dataB.tokenName}通证流动池剩余量不足`);
                        return false;
                    }
                }

                if(aboutWallet.toRegularNumber(this.accountBalance) - this.gasFeeNeeded < 0){
                    showToast && this.$showToast(`您的账户余额不足以支付gas费，请先跨链转入`);
                    return false;
                }
                return true;
            },
            // 去进行兑换池兑换
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
            // 兑换池兑换（组合方法）
            async liquidityTransferFuc(privateKey, walletAddress) {
                this.$refs.TransferLoading.show({text: '兑换进行中，预计将于1分钟内完成，为避免兑换未完成造成财产损失，完成前请勿关闭app', show: true,});

                let transferResult;
                if(this.transferType === 'stable' ){
                    // 去兑换
                    transferResult =  await this.toTransferForStableCoin(privateKey, walletAddress, this.dataA, this.dataB);
                }else{
                    // 查看是否approve过
                    if (this.dataA.type !== 'main') {
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataA.contractAddress, this.dataA.amountsInput);
                        if (result !== 'isOk') {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(`申请${this.dataA.tokenName}额度失败，请稍后再试`);
                            return;
                        }
                    }
                    if (this.dataB.type !== 'main') {
                        let result = await this.checkAndApproved(privateKey, walletAddress, this.dataB.contractAddress, this.dataB.amountsInput);
                        if (result !== 'isOk') {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(this.$lan('申请$ThisDataBTokenName额度失败，请稍后再试').replace('$ThisDataBTokenName}',this.dataB.tokenName));
                            return;
                        }
                    }
                    // 去兑换
                    transferResult =  await this.liquidityTransfer(privateKey, walletAddress, this.dataA, this.dataB);
                }

                // 查hash
                if(transferResult.TXhash){
                    let result = await getTransactionResultByHashCircularly(liquidChainId, transferResult.TXhash);
                    if(result){
                        setTimeout(() => {
                            this.$refs.TransferLoading.hide();
                            this.$showToast(this.$lan(`兑换成功`));
                            this.init(2);
                            this.jumpPage('/pages/decentralizedTransactions/transactionRecord')
                        }, 5000)
                    }else{
                        this.$refs.TransferLoading.hide();
                        this.$showToast(this.$lan(`兑换失败，请稍后再试`));
                    }
                }else{
                    this.$refs.TransferLoading.hide();
                    console.log('hash没有生成');
                    this.$showToast(this.$lan(`兑换失败，请稍后再试`));
                    setTimeout(() => {
                        this.init();
                    }, 1000)
                }


            },
            // 查看是否批准、进行批准(组合方法)
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
            // 查有没有批准
            async checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts) {
                let params = {
                    contractAbi: ERC20Abi,
                    contractAddress: tokenAddress,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);
                console.log('11111-----');
                walletApi.setVal('0');
                const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
                console.log('result-check', aboutWallet.toRegularNumber(result));
                console.log('判断', aboutWallet.toRegularNumber(result), amounts, aboutWallet.toRegularNumber(result) >= amounts);
                return aboutWallet.toRegularNumber(result) - amounts >= 1;
            },
            // 循环查询 有没有批准,返回 boolean
            async checkTokenIfApprovedCircularly(privateKey, walletAddress, tokenAddress, amounts) {
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
            async toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts) {
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
                const result = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts- 0 + 10));
                console.log('result111', result);
            },

            // 进行兑换池兑换
            async liquidityTransfer(privateKey, walletAddress, dataA, dataB) {
                let params = {
                    contractAbi: thkSwapRouterAbi,
                    contractAddress: this._contractAddress.CONTRACT_ROUTER,
                    privateKey,
                    address: walletAddress,
                    chainId: liquidChainId
                };
                const contractObj = await walletApi.callContract(params);

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
                    walletApi.setVal(amountIn);
                    result = await contractObj.swapExactTKMForTokens(...groupObjValToList(params));
                }else if(this.inputType === 'B' && dataB.type === 'main'){
                    let params = {
                        amountOut,
                        amountInMax: amountInCal,
                        path,
                        to,
                        deadline,
                    };
                    walletApi.setVal('0');
                    result = await contractObj.swapTokensForExactTKM(...groupObjValToList(params))
                }else if(this.inputType === 'A' && dataB.type === 'main'){
                    let params = {
                        amountIn,
                        amountOutMin: '0',
                        path,
                        to,
                        deadline
                    };
                    walletApi.setVal('0');
                    result = await contractObj.swapExactTokensForTKM(...groupObjValToList(params))
                }else if(this.inputType === 'B' && dataA.type === 'main'){
                    let params = {
                        amountOut,
                        path,
                        to,
                        deadline
                    };
                    walletApi.setVal(amountInCal);
                    result = await contractObj.swapTKMForExactTokens(...groupObjValToList(params))
                }else if(this.inputType === 'A'){
                    let params = {
                        amountIn,
                        amountOutMin: '0',
                        path,
                        to,
                        deadline,
                    };
                    walletApi.setVal('0');
                    result = await contractObj.swapExactTokensForTokens(...groupObjValToList(params))
                }else if(this.inputType === 'B'){
                    let params = {
                        amountOut,
                        amountInMax: amountInCal,
                        path,
                        to,
                        deadline
                    };
                    walletApi.setVal('0');
                    result = await contractObj.swapTokensForExactTokens(...groupObjValToList(params))
                }
                return result;
            },
            // 进行结算凭证的兑换
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

                console.log('privateKey', privateKey);
                console.log('contractAddress', this._contractAddress.CONTRACT_FLASH_SWAP);
                console.log('address', walletAddress.toLowerCase());
                console.log('chainId', liquidChainId);

                const contractObj = await walletApi.callContract(params);
                if(dataA.type === 'main' && dataB.coinType == 1){
                    console.log('兑入结算凭证', to);
                    console.log('amountIn', amountIn);
                    let params = {
                        to,
                    };
                    walletApi.setVal(amountIn);
                    console.log('params', ...groupObjValToList(params));
                    return await contractObj.swapTKMForToken(...groupObjValToList(params));
                }else if(dataB.type === 'main' && dataA.coinType == 1){
                    console.log('兑出结算凭证', to);
                    let params = {
                        amountIn,
                        to,
                    };
                    return await contractObj.swapTokenForTKM(...groupObjValToList(params));
                }
            },
            showPriceDescriptionPopup() {
                this.$refs.priceDescription.open()
            },
            jumpPage(path){
                uni.navigateTo({url: path})
            },
            closePriceDescriptionPopup(){
                this.$refs.priceDescription.close()
            },
            // 结算凭证提供兑换比例
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
                const contractObj = await walletApi.callContract(params);
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
          .description-text{
              color: #333;
              font-size: 30rpx;
              margin-bottom:12rpx;
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
</style>
