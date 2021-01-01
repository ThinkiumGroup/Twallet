<template>
  <view class="app">
    <nav-bar :title="$lan('退出通证池')"/>
    <view class="_block">
      <view class="caption">
        {{$lan('退出份额')}}
      </view>
      <view class="input-area bottom-border nav-row-between-center">
        <text v-show="!ratioInput" class="input-area-placeholder">
          {{$lan('请输入1-100的整数')}}
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
          {{$lan('预计获得')}}
        </text>
        <icon-font src="caption-bg-right" width="24rpx" height="24rpx"/>
      </view>
      <view class="get-item">
        <view class="get-item-top nav-row-between-center">
          <view class="left">{{lodash.get(pairData, 'contentA.tokenName')}}</view>
          <view class="right">{{lodash.get(pairData, 'contentA.getExpected') || 0}}</view>
        </view>
        <view class="get-item-bottom">
<!--          (包含手续费收益：0.5555)-->
        </view>
      </view>
      <view class="get-item" v-if="transferType !== 'stable'">
        <view class="get-item-top nav-row-between-center">
          <view class="left">{{lodash.get(pairData, 'contentB.tokenName')}}</view>
          <view class="right">{{lodash.get(pairData, 'contentB.getExpected')  || 0}}</view>
        </view>
        <view class="get-item-bottom">
<!--          (包含手续费收益：0.5555)-->
        </view>
      </view>
      <view class="other-description top-border nav-row-between-center" v-if="pairPriceText">
        <view class="left">
          {{$lan('当前兑换比例')}}
        </view>
        <view class="right">
          {{pairPriceText}}
        </view>
      </view>
    </view>
    <view class="btn-list nav-row-between-center">
      <view class="btn-item btn-item-transparent" @click="goBack">
        {{$lan('我再想想')}}
      </view>
      <view class="btn-item btn-item-blue" @click="confirmExit">
        {{$lan('确认退出')}}
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
  import {contractIndexEnum} from "../../utils/data/enums";

  const flashSwapAbi = require('../../utils/abis/flashSwap');
  const flashSwapPool = require('../../utils/abis/flashSwapPool');
  const ERC20Abi = require('../../utils/abis/ERC20');
  const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
  const liquidChainId = '103';


  const gasFeeApprove = 0.5;                    // 进行申请的gas费
  const gasFeeExitForFlashSwapPool = 1.5;       // 退出闪兑池的TKM的gas费
  const gasFeeExitForThkSwap = 1.5;             // 退出ThkSwap的gas费

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
      // 查看 tkm余额
      async getAccount(){
        let address = this.defaultWallet.address && this.defaultWallet.address.toLowerCase();
        if(!address){
          return;
        }
        let result = await walletApi.getAccount(liquidChainId, address);
        this.accountBalance = result.balance;
        console.log('--accountBalance', this.accountBalance);
        return result.balance;
      },
      // 获得对价(去除掉兑换费用及溢价), 非stable
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
        console.log('原始对价', aboutWallet.toRegularNumber(price));
        return price.toString();
      },
      // 查看结算凭证的对价,stable
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
        console.log('查看对价', price && price.toString());
        return price;
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
          }
          console.log('ratioInput', this.ratioInput);

          if(this.pairData.contentA){
            this.pairData.contentA.getExpected = aboutWallet.toRegularNumber(new BigNumber(this.pairData.contentA.reserveBig).multipliedBy(this.pairData.ratioValue).multipliedBy(this.ratioInput).div(100), 'floor');
          }
          if(this.pairData.contentB){
            this.pairData.contentB.getExpected = aboutWallet.toRegularNumber(new BigNumber(this.pairData.contentB.reserveBig).multipliedBy(this.pairData.ratioValue).multipliedBy(this.ratioInput).div(100), 'floor');
          }

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
      // 判断是否可以退出
      exitExchangePairValid(showToast = true){
        if(!this.ratioInput){
           showToast &&this.$showToast(this.$lan('请输入退出份额'));
           return false;
        }

        let gasFeeNeeded = this.getGasFeeNeeded(this.transferType);
        console.log('accountBalance', this.accountBalance);
        console.log('gasFeeNeeded', aboutWallet.toBigNumber(gasFeeNeeded));
        if(new BigNumber(this.accountBalance).minus(aboutWallet.toBigNumber(gasFeeNeeded)).toString() - 0 < 0){
          showToast &&this.$showToast(this.$lan('您的gas费不足，无法退出，请先跨链转入。'));
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
        this.$refs.TransferLoading.show({text: this.$lan('兑换池退出中，预计将于1分钟内完成，为避免退出未完成造成财产损失，完成前请勿关闭app'), show: true,});

        let result;
        if(this.transferType !== 'stable'){
          let value = new BigNumber(this.pairData.balanceOf).multipliedBy(this.ratioInput / 100).toFixed(0, 1);
          let approveResult = await this.checkAndApproved(privateKey, walletAddress, this.pairData.pairAddress, value);
          console.log('--approveResult', approveResult);
          if(approveResult !== 'isOk'){
            this.$refs.TransferLoading.hide();
            this.$showToast(this.$lan(`申请退出兑换池额度失败，请稍后再试`));
            return;
          }

          result = await this.exitExchangePair(privateKey, walletAddress, this.pairData.pairAddress, this.pairData.contentA, this.pairData.contentB, value)

        }else{
          let value = new BigNumber(this.pairData.balanceOf).multipliedBy(this.ratioInput / 100).toFixed(0, 1);
          result = await this.exitStableExchangePair(privateKey, walletAddress, value)
        }
        // 查hash
        if(result.TXhash){
          let hashResult = await getTransactionResultByHashCircularly(liquidChainId, result.TXhash);
          if(hashResult){
            setTimeout(() => {
              this.$showToast(this.$lan(`兑换池退出成功`));
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
        this.$showToast(this.$lan(`兑换池退出失败，请稍后再试`));
        setTimeout(() => {
          uni.navigateBack();
        }, 1000)
      },


      // 查看是否批准、进行批准(组合方法)
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
      // 查有没有批准,返回 boolean
      async checkPairIfApproved(privateKey, walletAddress, pairAddress, value){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract( params );
        console.log('11111-----', pairAddress);
        walletApi.setVal('0');
        const result = await contractObj.allowance(walletAddress, this._contractAddress.CONTRACT_ROUTER);
        console.log('approve-check', result.toString());
        return new BigNumber(result).minus(value).toString() - 0 >= 1;
      },
      // 循环查询 有没有批准,返回 boolean
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
      // 去配对合约进行批准
      async toPairContractForApproval(privateKey, walletAddress, pairAddress, value = 1 + '0'.repeat(32)){
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairAddress,
          privateKey,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        console.log(this.$lan('去批准的参数'), this._contractAddress.CONTRACT_ROUTER, value);
        walletApi.setVal('0');
        let approveResult = await contractObj.approve(this._contractAddress.CONTRACT_ROUTER, value);
        console.log('approveResult', approveResult);
      },

      // 退出 非stable
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
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');

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
      // 退出 stable
      async exitStableExchangePair(privateKey, walletAddress, value){
        console.log('退出 stable, value', value);
        let params = {
          privateKey,
          contractAbi: flashSwapPool,
          contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
          address: walletAddress,
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        console.log('value', value);
        return contractObj.withdraw(value);
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
