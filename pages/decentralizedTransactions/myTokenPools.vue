<template>
  <view class="container" :style="{paddingTop: customBar + 90 + 'rpx'}">
    <view class="nav-fixed-top" style="width: 100%">
       <nav-bar :title="$lan('我的通证池')"/>
    </view>
    <view class="content-list">
      <view
          class="content-item"
          :class="{'content-item-active': currentPairIndex === index }"
          v-for="(item, index) in transactionPairList"
          :key="index"
          @click="selectTransactionPair(item, index)">
        <view class="basic">
          <view class="left nav-row-start-center">
            <view class="token nav-row-start-center">
              <image class="token-image" mode="aspectFit" :src="lodash.get(item, 'contentA.iconUrl')"/>
              <text class="token-name">{{item.contentA && item.contentA.tokenName}}</text>
            </view>
            <view class="dot"/>
            <view class="token nav-row-start-center">
              <image class="token-image" mode="aspectFit" :src="lodash.get(item, 'contentB.iconUrl')"/>
              <text class="token-name">{{item.contentB && item.contentB.tokenName}}</text>
            </view>
          </view>
          <icon-font src="wallet-arrow-gray" width="20rpx" height="10rpx" class="wallet-arrow" :class="{reverse: currentPairIndex === index }"/>
        </view>
        <view class="detail top-border">
          <view style="padding: 18rpx 0">
            <view class="detail-item nav-row-between-center">
              <view class="nav-row-start-center">
                <image :src="item.contentA && item.contentA.iconUrl" mode="aspectFit" style="width: 36rpx; height: 30rpx; margin-right: 12rpx"/>
                <text class="prop-text">{{currentPairData.contentA && currentPairData.contentA.tokenName}}{{$lan('通证池内总量')}}</text>
              </view>
              <view class="valve">
                {{currentPairData.contentA && currentPairData.contentA.reserve}}
              </view>
            </view>
            <view class="detail-item nav-row-between-center" v-show="currentPairData.transferType && currentPairData.transferType !== 'stable'">
              <view class="nav-row-start-center">
                <image :src="item.contentB && item.contentB.iconUrl" mode="aspectFit" style="width: 36rpx; height: 30rpx; margin-right: 12rpx"/>
                <text class="prop-text">{{currentPairData.contentB && currentPairData.contentB.tokenName}}{{$lan('通证池内总量')}}</text>
              </view>
              <view class="valve">
                {{currentPairData.contentB && currentPairData.contentB.reserve}}
              </view>
            </view>
          </view>
          <view class="detail-bottom top-border">
           <view class="nav-row-between-center _top">
             <view class="prop">
               {{$lan('我的占比')}}
             </view>
             <view class="value">
               {{lodash.get(currentPairData, 'ratio')}}
             </view>
           </view>
           <view class="btn-list nav-row-between-center">
             <view class="btn-item"  @click.stop="toExitTokenPool()">{{$lan('退出通证池')}}</view>
             <view class="btn-item btn-item-blue" @click.stop="toAddExchangePairs()">{{$lan('提供通证池')}}</view>
           </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import { mapState } from 'vuex';
  import _ from 'lodash'
  import allBtn from "../../components/common/allBtn";
  import {contractIndexEnum} from "../../utils/data/enums";
  import {aboutWallet} from "../../utils/businessCommon";
  import {getPercentage, arrangeNum} from "../../utils/common";
  import decentralizedTransactionsApi from "../../apis/decentralizedTransactionsApi";
  import walletApi from "../../apis/walletApi";
  import { BigNumber } from "bignumber.js";

  const thkSwapRouterAbi = require('../../utils/abis/thkSwapRouter');
  const flashSwapPoolAbi = require('../../utils/abis/flashSwapPool');
  const ERC20Abi = require('../../utils/abis/ERC20');
  const liquidChainId = '103';

  export default {
    components: { allBtn },
    data() {
      return {
        transactionPairList: [],
        currentPairData: {},
        currentPairIndex: '',
        lodash: _,
        customBar: 0,
      }
    },
    computed: {
      ...mapState(['defaultWallet', '_contractAddress']),
    },
    methods: {
      async getTokenData(){
        let [tokenList, pairList, stableBalanceOf] = await Promise.all([this.getTokenList(), this.getTransactionPairList(), this.getStableBalanceOf()]);

        console.log('--stableBalanceOf', stableBalanceOf);
        if(this._contractAddress.CONTRACT_FLASH_SWAP && this._contractAddress.CONTRACT_WTKM && stableBalanceOf - 0){
          pairList.push({
            tokenA: this._contractAddress.CONTRACT_WTKM,  // 切记, tokenA与tokenB的地址不能颠倒
            tokenB: this._contractAddress.CONTRACT_FLASH_SWAP,
          });
        }

        pairList = pairList.map((item) => {
          let contentA = tokenList.find((item1) => {
            return item1.contractAddress.toLowerCase() === item.tokenA.toLowerCase()
          }) || "";
          let contentB = tokenList.find((item2) => {
            return item2.contractAddress.toLowerCase() === item.tokenB.toLowerCase()
          })|| "";
          item.contentA = contentA;
          item.contentB = contentB;
          return item;
        }).filter((item) => {
          return item.contentA && item.contentB;
        })

        console.log('--pairList', pairList);
        this.transactionPairList = pairList;
      },
      async getTokenList() {
        let address = this.defaultWallet.address && this.defaultWallet.address.toLowerCase();
        console.log('lalall');
        if(!address){
          return;
        }
        console.log('lalall2');

        let params = {
          accountAddress: address,
          contractAddress: '',
          page: 1,
          rows: 10000,
          xtoName: '',
        };

        let result = await decentralizedTransactionsApi.getTokenList(params) || {};
        return result.data && result.data.data || [];
      },
      async getTransactionPairList(){
        let result = await decentralizedTransactionsApi.getTransactionPairListForAddress({chainId: 103, address: this.defaultWallet.address.toLowerCase()});
        let data = result && result.data || {};
        let list = data.data || [];

        return list || [];
      },
      getTransferType(index1, index2){
        if((index1 === contractIndexEnum.WTKM && index2 === contractIndexEnum.FLASH_SWAP) || (index1 === contractIndexEnum.FLASH_SWAP && index2 === contractIndexEnum.WTKM)){
          return 'stable'
        }else{
          return 'other'
        }
      },

      async selectTransactionPair(pairData = {}, index){

        if(this.currentPairIndex === index){
          this.currentPairData = {};
          this.currentPairIndex = '';
          return;
        }

        if(!pairData.contentA || !pairData.contentB || !Object.keys(pairData.contentA).length || !Object.keys(pairData.contentB).length){
          return;
        }

        uni.showLoading({
          title: '',
          mask: true,
        });

        let transferType = this.getTransferType(_.get(pairData, 'contentA.index'), _.get(pairData, 'contentB.index'))
        console.log('--transferType', transferType);
        pairData.transferType = transferType;

        if(transferType === 'stable'){
          let reserves = await this.getStableReserves();
          console.log('-reserves', reserves);
          pairData.contentA.reserveBig = reserves && reserves.toString();  // 默认contentA为主币内容
          pairData.contentA.reserve = aboutWallet.toRegularNumber(reserves);
          let totalSupply = await this.getStableTotalSupply();
          console.log('--totalSupply', totalSupply);
          let balanceOf = await this.getStableBalanceOf();
          console.log('--balanceOf', balanceOf);
          let ratioValue =new BigNumber(balanceOf).div(totalSupply).toString();
          let ratio = (ratioValue * 100).toFixed(2) + '%';
          console.log('--ratio', ratio);
          pairData.balanceOf = balanceOf.toString();
          pairData.totalSupply = totalSupply.toString();
          pairData.ratioValue = ratioValue;
          pairData.ratio = ratio;
        }else{
          let reserves = await this.getReserves(_.get(pairData, 'contentA.contractAddress'), _.get(pairData, 'contentB.contractAddress'));
          pairData.contentA.reserveBig = reserves[0] && reserves[0].toString();
          pairData.contentA.reserve = aboutWallet.toRegularNumber(reserves[0], 'floor');
          pairData.contentB.reserveBig = reserves[1] && reserves[1].toString();
          pairData.contentB.reserve = aboutWallet.toRegularNumber(reserves[1], 'floor');

          let totalSupply = await this.getTotalSupply(_.get(pairData, 'pairAddress'));
          console.log('--totalSupply', totalSupply);
          let balanceOf = await this.getBalanceOf(_.get(pairData, 'pairAddress'));
          console.log('--balanceOf', balanceOf);
          let ratioValue =new BigNumber(balanceOf).div(totalSupply).toString();
          let ratio = (ratioValue * 100).toFixed(2) + '%';
          console.log('--ratio', ratio);
          pairData.balanceOf = balanceOf.toString();
          pairData.totalSupply = totalSupply.toString();
          pairData.ratioValue = ratioValue;
          pairData.ratio = ratio;
        }

        console.log('--pairData2', pairData);
        this.currentPairData = pairData;
        this.currentPairIndex = index;
        console.log('currentPairIndex',  this.currentPairIndex);

        setTimeout(() => {
          uni.hideLoading();
        });
      },
      // 查看非stable库存量
      async getReserves(addressA, addressB){
        if(!addressA || !addressB){
          throw new Error('getReserves方法请传入addressA和addressB')
        }
        addressA = addressA.toLowerCase();
        addressB = addressB.toLowerCase();

        console.log('thkSwapRouterAbi', thkSwapRouterAbi);
        console.log('CONTRACT_ROUTER', this._contractAddress.CONTRACT_ROUTER);
        console.log('defaultWallet', this.defaultWallet.address);
        let params = {
          contractAbi: thkSwapRouterAbi,
          contractAddress: this._contractAddress.CONTRACT_ROUTER,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let reserves = await contractObj.getReserves(addressA, addressB) || '';
        console.log('reserves', reserves);
        return reserves || [];
      },
      // 查看库存量stable
      async getStableReserves(){
        let params = {
          contractAbi: flashSwapPoolAbi,
          contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let reserves = await contractObj.TKMBalance() || '';
        console.log('reserves', reserves);
        return reserves.toString() || '0';
      },
      // 获得总分额,非stable
      async getTotalSupply(pairContractAddress){
        console.log('--pairContractAddress', pairContractAddress);
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairContractAddress,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let totalSupply = await contractObj.totalSupply();
        return totalSupply.toString() || '';
      },
      // 获得自己的份额,非stable
      async getBalanceOf(pairContractAddress){
        console.log('--pairContractAddress', pairContractAddress);
        let params = {
          contractAbi: ERC20Abi,
          contractAddress: pairContractAddress,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let balanceOf = await contractObj.balanceOf(this.defaultWallet.address.toLowerCase());
        return  balanceOf.toString() || '';
      },
      // 获得总分额,stable
      async getStableTotalSupply(){
        let params = {
          contractAbi: flashSwapPoolAbi,
          contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let totalSupply = await contractObj.totalSupply();
        return totalSupply.toString() || '';

      },
      // 获得自己的份额,stable
      async getStableBalanceOf(){
        let params = {
          contractAbi: flashSwapPoolAbi,
          contractAddress: this._contractAddress.CONTRACT_FLASH_SWAP_POOL,
          address: this.defaultWallet.address.toLowerCase(),
          chainId: liquidChainId
        };
        const contractObj = await walletApi.callContract(params);
        walletApi.setVal('0');
        let balanceOf = await contractObj.balanceOf(this.defaultWallet.address.toLowerCase());
        return  balanceOf.toString() || '';
      },

      toExitTokenPool(){
        uni.setStorageSync('pairDataWaitingToExit', this.currentPairData);
        setTimeout(() => {
          uni.navigateTo({url: '/pages/decentralizedTransactions/exitTokenPool'})
        }, 100)
        setTimeout(() => {
          this.currentPairIndex = '';
        }, 200)

      },
      toAddExchangePairs(){
        let data = {
          tokenA: this.currentPairData.tokenA,
          tokenB: this.currentPairData.tokenB,
        };
        uni.setStorageSync('pairDataWaitingToAdd', data);
        setTimeout(() => {
          uni.navigateTo({url: '/pages/decentralizedTransactions/liquidityAddition'})
        }, 100)
        setTimeout(() => {
          this.currentPairIndex = '';
        }, 200)
      },
      jumpPage(path){
        uni.navigateTo({url: path})
      },
    },
    onShow() {
      uni.showLoading({
        title: '',
        mask: true,
      });

      // #ifndef H5
        this.customBar = plus.navigator.getStatusbarHeight()
      // #endif

      Promise.all([this.getTokenData()]).then(() => {
        uni.hideLoading();
      })

    },
  }
</script>
<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .container{
    height: 100%;
  }
  .content-list{
    padding-bottom: 50rpx;
    .content-item{
      width: 686rpx;
      height: 100rpx;
      padding: 0 28rpx 0 26rpx;
      margin: 26rpx auto 0;
      background: #fff;
      border-radius: 10rpx;
      overflow: hidden;
      transition: height 0.2s ease-in;
      &.content-item-active{
        height: 437rpx;
      }
      .basic{
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .wallet-arrow{
          transform: rotateZ(180deg);
          &.reverse{
            transform: rotateZ(0);
          }

        }

        .left{
          .token{
            .token-image{
              width: 48rpx;
              height: 40rpx;
              margin-right: 10rpx;
            }
            .token-name{
              color: #3B3B3B;
              font-weight: 400;
              font-size: 32rpx;
              min-width: 120rpx;
            }
          }
          .dot{
            width: 6rpx;
            height: 6rpx;
            background: #BBB;
            border-radius: 50%;
            margin-right: 20rpx;
          }
        }
        .arrow{
          width: 20rpx;
          height: 10rpx;
          background: #3B4144;

        }
      }
      .detail{
        position: relative;
        &:before{
          border-color: #D5D5D5;
        }
        .detail-item{
          height: 54rpx;
          .prop-text{
            color: #545454;
            font-size: 24rpx;
          }
          .valve{
            color: #545454;
            font-weight: bold;
            font-size: 26rpx;
          }

        }
        .detail-bottom{
          position: relative;
          overflow: hidden;
          &:before{
            border-color: #EAEAEA;
          }
          ._top{
            line-height: 23rpx;
            margin: 30rpx 0 49rpx;
            .prop{
              font-size: 24rpx;
              color: #545454;
            }
            .value{
              color: #545454;
              font-size: 26rpx;
              font-weight: bold;
            }
          }
          .btn-list{
            .btn-item{
              width: 280rpx;
              height: 60rpx;
              line-height: 60rpx;
              text-align: center;
              border-radius: 6rpx;
              background: #F5F6F8;
              color: #545454;
              font-size: 24rpx;
              &.btn-item-blue{
                color: #FFFFFF;
                font-size: 24rpx;
                font-weight: bold;
                background: $main-color;
              }
            }

          }
        }

      }

    }

  }
</style>
