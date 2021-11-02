<template>
    <view class="app">

            <!--<nav-bar :containerStyle="{background: 'rgba(0,0,0,0)'}" :isgoBack="false">
                <view slot="leftBtn" @click="goBack">
                    <icon-font src="return" width="17rpx" height="32rpx" />
                </view>
                <span slot="title" class="title" >交易说明</span>
            </nav-bar>-->
        <nav-bar>
          <span slot="title" class="title" >{{$lan('transactionDescription')}}</span>
        </nav-bar>
        <view class="content">
          <image class="bgImage" src="/static/image/decentralizedTransactions/description-header-image.png"/>
          <view class="description-list">
            <view class="description-item">{{$lan('XTOpayment')}}</view>
            <view class="description-item">{{$lan('redeemXTOInputPrompt')}}</view>
            <view class="description-item">{{$lan('redemptionOfXTOTips1')}}</view>
          </view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
          goBack(){
            uni.navigateBack();
          }
        }
    }
</script>
<style scoped lang="scss">

    .content{
       width: 686rpx;
       margin: 20rpx auto 0;
       background: #fff;
      border-radius: 20rpx;
       .bgImage{
          width: 100%;
          height: 260rpx;
       }
      .description-list{
        margin-top: 18rpx;
        padding: 47rpx 33rpx 88rpx;
        .description-item{
          line-height: 48rpx;
          color: #404040;
          font-size: 30rpx;
          position: relative;
          &:before{
            content: '';
            display: inline-block;
            width: 14rpx;
            height: 14rpx;
            border-radius: 50%;
            background: $main-color;
            margin-right: 36rpx;
            /*margin-top: 24rpx;*/
            transform: translate(0, -38%);
          }
          &:nth-child(n+2){
            margin-top: 56rpx;
          }
        }

      }

    }

</style>
