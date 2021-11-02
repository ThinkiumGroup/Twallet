<template>
  <view class="app">
    <nav-bar :title="$lan('exitTheTokenPool')"/>
    <view class="_block">
      <view class="caption">
        {{$lan('exitShare')}}
      </view>
      <view class="input-area bottom-border nav-row-between-center">
        <text v-show="!ratioInput" class="input-area-placeholder">
          {{$lan('PleaseEnterAnIntegerFrom1_100')}}
        </text>
        <input class="input" type="number" v-model="ratioInput" @input="handleInput"/>
        <text class="mark">
          %
        </text>
      </view>
      <view class="ratio-list nav-row-between-center">
        <view v-for="(item, index)  in ratioList" :key="index" class="ratio-item" @click="handleRatioSelect(item)">
          {{item}}%
        </view>
      </view>

    </view>
    <view class="_block">
      <view class="caption-middle nav-row-center-center">
        <icon-font src="caption-bg-left" width="24rpx" height="24rpx"/>
        <text style="margin: 0 20rpx">
          {{$lan('expectedToGet')}}
        </text>
        <icon-font src="caption-bg-right" width="24rpx" height="24rpx"/>
      </view>
      <view class="get-item">
        <view class="get-item-top nav-row-between-center">
          <view class="left">{{lodash.get(pairData, 'contentA.tokenName')}}</view>
          <view class="right">{{lodash.get(pairData, 'contentA.getExpected') || 0}}</view>
        </view>
        <view class="get-item-bottom">
<!--          (Including commission income：0.5555)-->
        </view>
      </view>
      <view class="get-item" v-if="transferType !== 'stable'">
        <view class="get-item-top nav-row-between-center">
          <view class="left">{{lodash.get(pairData, 'contentB.tokenName')}}</view>
          <view class="right">{{lodash.get(pairData, 'contentB.getExpected')  || 0}}</view>
        </view>
        <view class="get-item-bottom">
<!--          (Including commission income：0.5555)-->
        </view>
      </view>
      <view class="other-description top-border nav-row-between-center" v-if="pairPriceText">
        <view class="left">
          {{$lan('currentEchangeRatio')}}
        </view>
        <view class="right">
          {{pairPriceText}}
        </view>
      </view>
    </view>
    <view class="btn-list nav-row-between-center">
      <view class="btn-item btn-item-transparent" @click="goBack">
        {{$lan('thinkAgain')}}
      </view>
      <view class="btn-item btn-item-blue" @click="confirmExit">
        {{$lan('confirm')}}
      </view>

    </view>
    <PasswordPopup ref="passwordPopup"/>
    <TransferLoading ref="TransferLoading"/>

  </view>
</template>
<script>
  import { mapState } from 'vuex';
  import _ from 'lodash'
  import walletApi from "../../apis/walletApi";
  import {aboutWallet, getTransactionResultByHashCircularly} from "../../utils/businessCommon";
  import {arrangeNum, groupObjValToList} from "../../utils/common";
  import { BigNumber } from "bignumber.js";
  import PasswordPopup from "../../components/PasswordPopup";
  import allBtn from "../../components/common/allBtn";
  import tokenSelector from "./components/tokenSelector";
  import TransferLoading from "../../components/TransferLoading";
  import {contractIndexEnum, ChainIdEnum} from "../../utils/data/enums";

  const flashSwapAbi = require('../../utils/abis/flashSwap');
  const flashSwapPool = require('../../utils/abis/flashSwapPool');
  const ERC20Abi = require('../../utils/abis/ERC20');
  const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
  const liquidChainId = ChainIdEnum.BUSINESS_CHAIN;


  const gasFeeApprove = 0.5;                    // Gas fee for applicationgas费
  const gasFeeExitForFlashSwapPool = 1.5;       // Gas fee of TKM exiting flash cash pool
  const gasFeeExitForThkSwap = 1.5;             // Gas fee for exiting thkswap

  export default {
    components: { TransferLoading, PasswordPopup },
    data() {
      return {
        ratioList: [25, 50, 75, 100],
        ratioInput: '',
        pairData: {},
        transferType: '',
        pairPriceText: '',
        accountBalance: '',
        lodash: _,
      }
    },
    computed: {
      ...mapState(['defaultWallet', '_contractAddress']),
    },
    methods: {
      async getData(){
        let pairData =  uni.getStorageSync('pairDataWaitingToExit');
        console.log('--pairData', pairData);
        this.transferType = pairData.transferType;
        this.pairData = pairData;
        this.pairPriceText = await this.getPairPriceText();
        await this.getAccount();
      },
      // View TKM balance
      async getAccount(){
        let address = this.defaultWallet.address && this.defaultWallet.address.toLowerCase();
        if(!address){
          return;
        }
        let balance = await walletApi.ethGetAccount(liquidChainId, this.defaultWallet.address.toLowerCase());
        this.accountBalance = balance.toString();
        return balance.toString();
      },
      // Gain consideration (excluding exchange fee and premium), not stable
      async getPurePairPrice(amounts, tokenA, tokenB){
        if(!amounts){
          return '';
        }
        

        try{
          let params = {
            contractAbi: thkSwapRouterAbi,
            contractAddress: this._contractAddress.CONTRACT_ROUTER,
            address: this.defaultWallet.address.toLowerCase(),
            chainId: liquidChainId
          };
          const contractObj = await walletApi.ethCallContract(params);
          let price =  await contractObj.quote(aboutWallet.toBigNumber(amounts), tokenA, tokenB );
          console.log('Original consideration', aboutWallet.toRegularNumber(price));
          return price.toString();

        }catch(err){
          console.log('---err',err)
        }
        return '0'
      },
      // View the consideration of settlement voucher, stable
      async getPairPriceForStableCoin(){
        
        try{
          let params = {
            contractAbi: flashSwapAbi,
            contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP,
            address: this.defaultWallet.address.toLowerCase(),
            chainId: liquidChainId
          };
          const contractObj = await walletApi.ethCallContract(params);
          let price = await contractObj.rmbPrice();
          console.log('View consideration', price && price.toString());
          return price.toString();

        }catch(err){
          console.log('---err',err)
        }
        return '0'
      },
      handleInput(){
        setTimeout(() => {
          this.ratioInput -= 0;
          if(this.ratioInput > 100){
            this.ratioInput = 100;
          }else if(this.ratioInput < 0 ){
            this.ratioInput = 0;
          }
          this.ratioInput = parseInt(this.ratioInput);
          if(this.ratioInput == 0){
            this.ratioInput = ''
            if(this.pairData.contentA) this.pairData.contentA.getExpected = 0;
            if(this.pairData.contentB) this.pairData.contentB.getExpected = 0;
          }else{
            if(this.pairData.contentA){
              this.pairData.contentA.getExpected = aboutWallet.toRegularNumber(new BigNumber(this.pairData.contentA.reserveBig).multipliedBy(this.pairData.ratioValue).multipliedBy(this.ratioInput).div(100), 'floor');
            }
            if(this.pairData.contentB){
              this.pairData.contentB.getExpected = aboutWallet.toRegularNumber(new BigNumber(this.pairData.contentB.reserveBig).multipliedBy(this.pairData.ratioValue).multipliedBy(this.ratioInput).div(100), 'floor');
            }
          }
          console.log('ratioInput', this.ratioInput);

          

          this.$forceUpdate();
        })
      },
      handleRatioSelect(ratio){
        this.ratioInput = ratio;
        this.handleInput();
      },

      async getPairPriceText(){
        let {pairData} = this;

        if(pairData.transferType !== 'stable'){
          let amount = await this.getPurePairPrice('1', _.get(pairData, 'contentA.contractAddress'),  _.get(pairData, 'contentB.contractAddress'));
          let price = aboutWallet.toRegularNumber(amount, 'auto', 6);
          return `1${_.get(pairData, 'contentA.tokenName')} ≈ ${price}${_.get(pairData, 'contentB.tokenName')}`;
        }else{
          return '';
        }
      },
      getGasFeeNeeded(transferType){
        if(!transferType){
          return ''
        }
        if(transferType ===  'stable'){
          return gasFeeExitForFlashSwapPool;
        }else{
          return gasFeeApprove + gasFeeExitForThkSwap;
        }
      },
      // Judge whether you can exit
      exitExchangePairValid(showToast = true){
        if(!this.ratioInput){
           showToast &&this.$showToast(this.$lan('pleaseEnterExitShare'));
           return false;
        }

        let gasFeeNeeded = this.getGasFeeNeeded(this.transferType);
        console.log('accountBalance', this.accountBalance);
        console.log('gasFeeNeeded', aboutWallet.toBigNumber(gasFeeNeeded));
        if(new BigNumber(this.accountBalance).minus(aboutWallet.toBigNumber(gasFeeNeeded)).toString() - 0 < 0){
          showToast &&this.$showToast(this.$lan('insufficientGasFee'));
          return false;
        }

        return true;
      },
      confirmExit(){
        if(!this.exitExchangePairValid()){
          return;
        }
        this.$refs.passwordPopup.showPasswordPopup({
          cancel: () => {

          },
          success: async (password) => {
            console.log(password)
            let walletAddress = this.defaultWallet.address;
            let privateKey = await aboutWallet.getWalletPrivateKey(walletAddress, password);
            this.exitExchangePairGroupFuc(privateKey, walletAddress);
          },
          fail:  () => {

          },
        });
      },
      async exitExchangePairGroupFuc(privateKey, walletAddress){
        this.$refs.TransferLoading.show({text: this.$lan('exchangePoolIsExiting')});

        let result;
        if(this.transferType !== 'stable'){
          let value = new BigNumber(this.pairData.balanceOf).multipliedBy(this.ratioInput / 100).toFixed(0, 1);
          let approveResult = await this.checkAndApproved(privateKey, walletAddress, this.pairData.pairAddress, value);
          console.log('--approveResult', approveResult);
          if(approveResult !== 'isOk'){
            this.$refs.TransferLoading.hide();
            this.$showToast(this.$lan(`failedToExitTheExchangePool`));
            return;
          }

          result = await this.exitExchangePair(privateKey, walletAddress, this.pairData.pairAddress, this.pairData.contentA, this.pairData.contentB, value)

        }else{
          let value = new BigNumber(this.pairData.balanceOf).multipliedBy(this.ratioInput / 100).toFixed(0, 1);
          result = await this.exitStableExchangePair(privateKey, walletAddress, value)
        }
        // Check hash
        if(result.hash){
          let hashResult = await getTransactionResultByHashCircularly(liquidChainId, result.hash);
          if(hashResult){
            setTimeout(() => {
              this.$showToast(this.$lan(`exchangePoolExitedSuccessfully`));
              setTimeout(() => {
                uni.navigateBack();
              }, 1000)
              this.$refs.TransferLoading.hide();
            }, 3000)
          }else{
            this.$refs.TransferLoading.hide();
            this.handleExitFaild()
          }
        }else{
          console.log(this.$lan('hash没有生成'));
          this.handleExitFaild()
        }

      },
      handleExitFaild(){
        this.$refs.TransferLoading.hide();
        this.$showToast(this.$lan(`failedToExitTheRedemptionPool`));
        setTimeout(() => {
          uni.navigateBack();
        }, 1000)
      },

      // Check if the token is xto and has an integer balance
      async isXTOAndIntBalance(tokenAddress, index){
        if(index <= 0){
          return false;
        }
        let balance = await this.checkTokenBalance(tokenAddress);
        balance = new BigNumber(balance).div("1e+18").toString();
        return !(balance%1)
      },

      // View token balance
      async checkTokenBalance(address){
        console.log('--address', address);
       
        try{
           let params = {
              contractAbi: ERC20Abi,
              contractAddress: address,
              address: this.defaultWallet.address.toLowerCase(),
              chainId: liquidChainId
            };
            const contractObj = await walletApi.ethCallContract(params);
            let balanceOf = await contractObj.balanceOf(this.defaultWallet.address.toLowerCase());
            return  balanceOf.toString() || '';

        }catch(err){
          console.log('---err',err)
        }
        return '0'
      },


     // Check whether to approve or not (combined method)
      async checkAndApproved(privateKey, walletAddress, pairAddress, value ){
        if(!await this.checkPairIfApproved(privateKey, walletAddress, pairAddress, value)){
          await this.toPairContractForApproval(privateKey, walletAddress, pairAddress);
          let result = await this.checkPairIfApprovedCircularly(privateKey, walletAddress, pairAddress, value);
          if(result){
            return 'isOk';
          }else{
            return 'isNotOk';
          }
        }else{
          return 'isOk';
        }
      },

      // Check whether it is approved and return to Boolean
      async checkPairIfApproved(privateKey, walletAddress, pairAddress, value){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract( params );
        console.log('pairAddress', pairAddress);
        console.log('value', value);
        const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
        console.log('approve-check', result.toString());
        return new BigNumber(result.toString()).minus(value).toString() - 0 >= 1;
      },
      // Loop to check whether there is approval and return Boolean
      async checkPairIfApprovedCircularly(privateKey, walletAddress, pairAddress, value){
        return new Promise((resolve, reject) => {
          let times = 0;
          this.checkTokenInterval = setInterval(async () => {
            let result = await this.checkPairIfApproved(privateKey, walletAddress, pairAddress, value);
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
      // To approve the contract
      async toPairContractForApproval(privateKey, walletAddress, pairAddress, value = 1 + '0'.repeat(32)){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract(params);
        console.log('Approved parameters', this._contractAddress.CONTRACT_ROUTER, value);
        let approveResult = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, value);
        console.log('approveResult', approveResult);
      },

      // sign out non stable
      async exitExchangePair(privateKey, walletAddress, pairAddress, dataA, dataB, value){
        console.log('--dataA', dataA);
        console.log('--dataB', dataB);

        let data0, data1;
        if(dataB.index == contractIndexEnum.WTKM){
          data0 = dataB;
          data1 = dataA;
        }else{
          data0 = dataA;
          data1 = dataB;
        }
        let params = {
          privateKey,
          contractAbi: thkSwapRouterAbi,
          contractAddress: this._contractAddress.CONTRACT_ROUTER,
          address: walletAddress.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract(params);

        if(data0.index == contractIndexEnum.WTKM){
          let data = {
            token: data1.contractAddress,
            liquidity: value,
            amountTokenMin: '0',
            amountTKMMin: '0',
            to: walletAddress.toLowerCase(),
            deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString()
          };
          return contractObj.removeLiquidityTKM(...groupObjValToList(data));
        }else{
          let data = {
            tokenA: data0.contractAddress,
            tokenB: data1.contractAddress,
            liquidity: value,
            amountAMin: '0',
            amountBMin: '0',
            to: walletAddress.toLowerCase(),
            deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString()

          };
          return contractObj.removeLiquidity(...groupObjValToList(data));
        }
      },
      // sign out stable
      async exitStableExchangePair(privateKey, walletAddress, value){
        console.log('sign out stable, value', value);
        let params = {
          privateKey,
          contractAbi: flashSwapPool,
          contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract(params);
        ;
        console.log('value', value);
        return contractObj.withdraw(value);
      },




      // Go and add the exchange pool
      async toAddLiquidity(privateKey, walletAddress, tokenA, tokenB, amountA){
        let price = await this.getPurePairPrice('1', tokenA,  tokenB);
        let amountB = new BigNumber(price).div('1e+18').multipliedBy(amountA).toString();
        let data = {
          privateKey,
          walletAddress,
          tokenA,
          tokenB,
          tokenAIndex,
          tokenBIndex,
          amountA,
          amountB
        };
        let result = await this.addLiquidityGroupFuc(data);

        return !!result;
      },



      // Add exchange pool (combination method) and return to Boolean
      async addLiquidityGroupFuc({privateKey, walletAddress, tokenA, tokenB, tokenAIndex, tokenBIndex, amountA, amountB}){
        let addResult;
        if(this.transferType === 'stable' ){
          // addResult = await this.addStableCoin(privateKey, walletAddress, this.dataA, this.dataB);
        }else{
          // Check whether it has been approved
          if(tokenAIndex > 0){
            let result = await this.checkAndApprovedFromTokenContract(privateKey, walletAddress, tokenA, amountA);
            if(result !== 'isOk'){
              this.$refs.TransferLoading.hide();
              this.$showToast(this.$lan('failedToApplyForTokenQuota').replace('tokenName', this.dataA.tokenName));
              return false;
            }
          }
          if(tokenBIndex > 0){
            let result = await this.checkAndApprovedFromTokenContract(privateKey, walletAddress, tokenB, amountB);
            if(result !== 'isOk'){
              this.$refs.TransferLoading.hide();
              this.$showToast(this.$lan('failedToApplyForTokenQuota').replace('tokenName', this.dataB.tokenName));
              return false;
            }
          }

          // Add exchange pool
          let data = {privateKey, walletAddress, tokenA, tokenB, tokenAIndex, tokenBIndex, amountA, amountB}
          addResult = await this.addLiquidity(data);
        }


        // Check hash
        if(addResult.hash){
          let result = await getTransactionResultByHashCircularly(liquidChainId, addResult.hash);
          if(result){
            // this.$showToast(this.$lan(`exchangPoolAddedSuccessfully`));
            return true;
          }else{
            // this.$showToast(this.$lan(`failedToAddRedemptionPool`));
            return false;
          }
        }else{
          console.log('hash Not generated');
          // this.$showToast(this.$lan(`failedToAddRedemptionPool`));
          return false;

        }

      },

      // Check whether the token contract is approved or not (combination method)
      async checkAndApprovedFromTokenContract(privateKey, walletAddress, tokenAddress, amounts ){
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
      // Check whether it is approved and return to Boolean
      async checkTokenIfApproved(privateKey, walletAddress, tokenAddress, amounts){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: tokenAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract( params );
        console.log('tokenAddress', tokenAddress);
        console.log('amounts', amounts);
        const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
        console.log('approve-check', aboutWallet.toRegularNumber(result));
        return aboutWallet.toRegularNumber(result) - amounts >= 1;
      },
      // Loop to check whether there is approval and return Boolean
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
      // Go to token contract for approval
      async toTokenContractForApproval(privateKey, walletAddress, tokenAddress, amounts){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: tokenAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract(params);
        console.log( 'Approved parameters', this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts - 0 + 10));
        ;
        let approveResult = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, aboutWallet.toBigNumber(amounts  - 0 + 10));
        console.log('approveResult', approveResult);
      },

      // Add exchange pool
      async addLiquidity({privateKey, walletAddress, tokenA, tokenB, tokenAIndex, tokenBIndex, amountA, amountB}) {
        let params = {
          contractAbi: thkSwapRouterAbi,
          contractAddress: this._contractAddress.CONTRACT_ROUTER,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.ethCallContract(params);

        if(tokenBIndex === contractIndexEnum.WTKM){
          [tokenA, tokenB, tokenAIndex, tokenBIndex, amountA, amountB] = [tokenB, tokenA, tokenBIndex, tokenAIndex, amountB, amountA]
        }

        if(tokenAIndex === contractIndexEnum.WTKM){
          let data = {
            token: tokenB,
            amountTokenDesired: aboutWallet.toBigNumber(amountB),
            amountTokenMin: '0',
            amountTKMMin: '0',
            to: walletAddress.toLowerCase(),
            deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString(),
          };
          console.log('Go to add exchange pool 1', data);
          let overrides = {
              value: aboutWallet.toBigNumber(amountA),
          }
          return contractObj.addLiquidityTKM(...groupObjValToList(data), overrides);
        }else{
          let data = {
            tokenA: tokenA,
            tokenB: tokenB,
            amountADesired: aboutWallet.toBigNumber(amountA),
            amountBDesired: aboutWallet.toBigNumber(amountB),
            amountAMin: '0',
            amountBMin: '0',
            to: walletAddress.toLowerCase(),
            deadline: parseInt((new Date().getTime() + 5 * 60 * 1000) / 1000).toString(),
          };
          console.log('Go to add exchange pool 2', data);
          ;
          return contractObj.addLiquidity(...groupObjValToList(data));
        }
      },





      goBack(){
        uni.navigateBack();

      },
    },
    onLoad() {

      uni.showLoading({
        title: '',
        mask: true,
      });

      Promise.all([this.getData()]).then(() => {
        uni.hideLoading();
      })
    },
  }
</script>
<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  ._block{
    width: 686rpx;
    border-radius: 10rpx;
    background: #FFF;
    margin: 26rpx auto 0;
    padding: 0 28rpx;
    overflow: hidden;
  }

  .caption{
    color: #333;
    font-size: 26rpx;
    line-height: 25rpx;
    margin-top: 39rpx;
  }
  .input-area{
    position: relative;
    height: 51rpx;
    margin-top: 49rpx;
    .input-area-placeholder{
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      color: #A5A5A5;
      font-size: 24rpx;
    }
    .input{
      color: $main-color;
      font-size: 36rpx;
      font-weight: bold;
    }
    .mark{
      color: $main-color;
      font-size: 26rpx;
    }
    &:before{
      border-color: #D5D5D5;
    }

  }

  .ratio-list{
    margin: 50rpx 0;
    .ratio-item{
      width: 110rpx;
      line-height: 46rpx;
      text-align: center;
      border-radius: 6rpx;
      border: 1rpx solid $main-color;
      color: $main-color

    }
  }

  .caption-middle{
    line-height: 25rpx;
    color:  $main-color;
    font-size: 26rpx;
    font-weight: bold;
    background-size: cover;
    margin: 39rpx auto 47rpx;
  }
  .get-item{
    margin-bottom: 39rpx;
    .get-item-top{
      line-height: 25rpx;
      .left{
        color: #434343;
        font-size: 28rpx;
        font-weight: 500;
      }
      .right{
        color: #373737;
        font-size: 32rpx;
        font-weight: Heavy;
      }
    }
    .get-item-bottom{
      margin-top: 15rpx;
      color: #5D5D5D;
      font-size: 24rpx;
      line-height: 15rpx;
      text-align: right;
    }
  }
  .other-description{
    position: relative;
    color: #777777;
    font-size: 24rpx;
    height: 102rpx;
  }

  .btn-list{
    width: 686rpx;
    margin: 130rpx auto 0;
    .btn-item{
      width: 318rpx;
      height: 81rpx;
      line-height: 81rpx;
      border-radius: 6rpx;
      text-align: center;
      &.btn-item-transparent{
        border: 1px solid $main-color;
        color: $main-color;
        font-size: 28rpx;
      }
      &.btn-item-blue{
        color: #FFF;
        font-weight: bold;
        font-size: 28rpx;
        background: $main-color;

      }
    }

  }

</style>
