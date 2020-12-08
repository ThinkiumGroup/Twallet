<template>
    <view class="container" :style="{paddingTop: customBar + 100 + 'rpx'}">
        <view class="nav-fixed-top" style="width: 100%">
            <nav-bar :title="this.$lan('钱包管理')" />
        </view>
        <view class="wallet-list">
            <view
                v-for="(item, index) in walletListCopy" :key="index"
                @click="changeDefaultWallet(item.address)"
                class="wallet-item nav-row-between-center">
                <view style=" width: 90%;">
                    <view class="top nav-row-between-center">
                        <view class="nav-row-start-center">
                            <icon-font src="wallet-p-tkm" width="31rpx" height="46rpx"/>
                            <view class="wallet-name">{{item.name}}</view>
                        </view>
                        <text>
                            {{item.address | $toTHAddress | $hiddenString(5,4)}}
                        </text>

                    </view>
                    <view class="middle">
                        {{item.asset}}TKM
                    </view>
                    <!-- <view class="bottom">
                    ≈{{item.asset}}CNY
                    </view>-->
                </view>

                <view class="select-mark">
                    <icon-font :src="defaultWallet.address === item.address ? 'wallet-p-selected' : 'wallet-p-not-selected'" width="32rpx" height="32rpx"/>
                </view>
            </view>
        </view>
        <view class="to-add-new-wallet nav-row-start-center">
            <view @click="toImportWallet" class="to-add-wallet-item">{{$lan('导入钱包')}}</view>
            <view @click="toCreateWallet" class="to-add-wallet-item">{{$lan('创建钱包')}}</view>
        </view>

        <EasyDialog ref="EasyDialog"/>
    </view>
</template>
<script>
    import { mapState, mapMutations } from 'vuex';
    import { aboutWallet } from "../../utils/businessCommon";
    import { isTimeInvalid } from "../../utils/common";
    import walletApi from "../../apis/walletApi";
    import _ from "lodash";
    import { chainList } from "../../utils/data/enums";
    import { BigNumber } from 'bignumber.js';
    import EasyDialog from "../../components/EasyDialog";

    export default {
        components: { EasyDialog },
        data() {
            return {
                // #ifndef H5
                customBar: plus.navigator.getStatusbarHeight(),
                // #endif
                // #ifdef H5
                customBar: 0,
                // #endif
                walletListCopy: [],
            }
        },
        computed:{
            ...mapState(['walletList', 'defaultWallet']),
        },
        methods: {
            ...mapMutations(['setWalletList']),
            async changeDefaultWallet(walletAddress){
                let result = await aboutWallet.setDefaultWallet(walletAddress);
                if(result.status === 1){
                    this.getAllWalletAsset();
                    this.$refs.EasyDialog.showDialog({
                        title:this.$lan('提示'),
                        text:this.$lan('更换成功, 该钱包将作为新的默认钱包。'),
                        okText:this.$lan('确定'),
                        cancelText:this.$lan('取消'),
                        ok: () => {
                            uni.navigateBack();
                        },
                        cancel: () => {

                        },
                    });
                }else{
                    this.$showToast(this.$lan('更换失败'));
                }
            },
            // 获得钱包余额
            getAllWalletAsset(){
                uni.showLoading({
                    title: '',
                    mask: true,
                });
                let walletList = _.cloneDeep(this.walletList);
                let lastTime = uni.getStorageSync('lastTimeOfGetAllWalletAsset') || 0;
                walletList.map(async(item) => {
                    if(item.address === this.defaultWallet.address || isTimeInvalid(lastTime, 30*60*1000)){ // 非默认钱包， 30分钟刷新一次
                        let asset = new BigNumber(0);
                        for(var i=0;  i<chainList.length; i++){
                            let content = await walletApi.getAccount(chainList[i].id, item.address.toLowerCase())
                            let amount =  new BigNumber(content.balance);
                            asset = asset.plus(amount);
                        }
                        item.asset = aboutWallet.toRegularNumber(asset.toString());
                    };
                });
                uni.setStorageSync('lastTimeOfGetAllWalletAsset', new Date().getTime());
                this.walletListCopy = walletList;
                this.setWalletList(walletList);
                uni.hideLoading();
            },
            toImportWallet(){
                uni.navigateTo({ url: `/pages/wallet/importWallet`})
            },
            toCreateWallet() {
                uni.navigateTo({ url: `/pages/wallet/createWallet`})
            },
        },
        onLoad(){
           this.getAllWalletAsset();
        }
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    .wallet-list{
        padding-bottom: 50rpx;
      .wallet-item{
          margin: 20rpx auto 0;
          width: 686rpx;
          border-radius: 16rpx;
          background: #fff;
          padding: 32rpx;
          position: relative;
          .top{
              .wallet-name{
                  color: #666;
                  font-size: 28rpx;
                  font-weight: 600;
                  margin-left: 26rpx;
              }
          }
          .middle{
              margin-top: 60rpx;
              color: #515D8A;
              font-size: 50rpx;
              line-height: 38rpx;
          }
          .bottom{
              color: #B7BED8;
              font-size: 30rpx;
              margin-top: 33rpx;
              line-height: 23rpx;

          }
          .select-mark{

          }
      }
    }
    .to-add-new-wallet{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        background: #fff;
        .to-add-wallet-item{
            width: 50%;
            height: 100rpx;
            line-height: 100rpx;
            text-align: center;
            font-size: 24rpx;
            color: #515D8A;
            &:nth-child(n+2){
                border-left: 1rpx solid $main-color-background;
            }
        }
    }
</style>
