<template>
    <view class="_container" v-if="isShow">
      <view class="_modal">
          <image src="/static/image/wallet/iconTransgif.gif" class="loading-image"/>
          <view class="explain">{{text || text2}}</view>
      </view>
    </view>
</template>
<script>
    export default {
        name: 'TransferLoading',
        props:{
          text: {
            type: String,
            default: ''
          }
        },
        data() {
            return {
              isShow: false,
              text2: '',
            }
        },
        methods: {
            show({text} = {}){
              if(text) this.text2 = text;
              this.isShow = true;
            },
            hide(){
              this.isShow = false;
            }
        }
    }
</script>
<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  ._container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background: rgba(0,0,0, 0.3);
    ._modal{
      position: absolute;
      top: 40%;
      left: 50%;
      transform:  translate( -50%, -50%);
      width: 600rpx;
      padding: 20rpx 10rpx;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 20rpx;
      padding: 40rpx 56rpx 72rpx;
      .loading-image{
         width: 420rpx;
         height: 187rpx;
      }
      .explain{
         width: 100%;
         margin-top: 30rpx;
         color: #333;
         font-size: 28rpx;
      }
    }
  }
</style>
