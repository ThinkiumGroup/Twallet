<template>
  <view class="Wallet">
    <view class="noWallet" @click="toAddNewWallet">
      <view class="no_content">
        <view class="no_left">
            <view class="left_top">
                <text>{{$lan('noWallet')}}</text>
                <image src="../static/image/home/jt.png"></image>
            </view>
             <text class="left_bottom">{{$lan('createNewWallet')}}</text>
        </view>
        <view class="no_right">
            <image src="../static/image/home/no.png"></image>
        </view>
      </view>
    </view>
    <view class="noWallet" @click="toImportWallet">
      <view class="no_content">
        <view class="no_left">
            <view class="left_top">
                <text>{{$lan('alreadyHaveAWallet')}}</text>
                <image src="../static/image/home/jt.png"></image>
            </view>
             <text class="left_bottom">{{$lan('importOtherWallets')}}</text>
        </view>
        <view class="no_right">
            <image src="../static/image/home/has.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    toAddNewWallet(){
      uni.navigateTo({ url: `/pages/wallet/createWallet`})
    },
    toImportWallet(){
      uni.navigateTo({ url: `/pages/wallet/importWallet`})
    },
  }
};
</script>

<style  lang="scss" scoped>
.Wallet {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f5f6f8;
  .noWallet {
    background: #FFFFFF;
    width: 686rpx;
    height: 240rpx;
    margin: 0 auto;
    margin-top: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .no_content {
      width: 96%;
      height: 200rpx;
      margin: auto;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .no_left{
          width: 44%;
          height: 200rpx;
          display: flex;
            justify-content: flex-start;
            flex-direction: column;

            // align-items: center;
          // height: 158rpx;
        .left_top{
            width: 190rpx;
            height: 60rpx;
            display: flex;

            justify-content: space-between;
            align-items: center;
            margin-top: 20rpx;
            text{
               width: 156rpx;
            height: 40rpx;
            font-size: 36rpx;
            font-family: PingFang SC;
            font-weight: 700;
            color: #243FFF;
            }
            image{
                width: 40rpx;
                height: 40rpx;
                margin-top: 10rpx;
            }
        }
        .left_bottom{
           width: 220rpx;
           height: 200rpx;
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 30rpx;
          //  margin: 20rpx 0;
            // margin: 0 auto;
height: 26rpx;
font-size: 26rpx;
font-family: PingFang SC;
font-weight: 400;
color: #999999;
        }
      }
      .no_right{
          width: 202rpx;
          height: 178rpx;
          image{
          width: 202rpx;
          height: 178rpx;
          }
      }
    }
  }
}
</style>
