<template>
    <view class="container">
        <nav-bar :title="this.$lan('备份助记词')" />
        <view class="content">
            <view class="export-tips nav-row-start-start">
                <icon-font src="wallet-p-exclamation" width="28rpx" height="25rpx" style="margin-right: 19rpx; display: inline-block"/>
                <view class="export-tips-text">{{$lan('请勿将助记词在联网环境下分享及储存，例如社交应用、邮箱、相册等。')}}</view>
            </view>
            <view class="divide-line"/>
            <view class="tip-title">
               {{$lan('请按照顺序将助记词抄写在纸上并妥善保管')}} 
            </view>
            <view class="mnemonic-area" v-if="mnemonic">
                {{mnemonic}}
            </view>
            <view class="attention">
                {{$lan('注：官方客服不会以任何形式索要您的私钥。')}}
            </view>
            <allBtn :text="this.$lan('下一步')"  :containerStyle="{marginTop: '500rpx'}" @click="next"/>
        </view>
        <view>

        </view>

    </view>
</template>
<script>
    import { aboutWallet } from "../../utils/businessCommon";
    import { mapState, mapMutations } from "vuex"
    import allBtn from "../../components/common/allBtn";

    export default {
        components: {allBtn},
        data() {
            return {
                mnemonic: '',
            }
        },
        computed: {
            ...mapState(['walletList']),
        },
        methods: {
            ...mapMutations(['setMnemonicWords']),
          async getMnemonic(walletAddress, password){
              let walletDetail = this.walletList.find((item) => { return item.address === walletAddress}) || {};
              if(walletDetail.type !== 'mnemonic'){
                 throw  new Error(this.$lan('该钱包没有私钥'))
              }
              let walletInfo = await aboutWallet.getWalletInfo(walletAddress, password);
              this.mnemonic = walletInfo.mnemonic;
          },
            next(){
                this.setMnemonicWords(this.mnemonic);
                uni.navigateTo({
                    url: `/pages/wallet/verifyMnemonicWord?type=2`
                })
            }
        },
        onLoad(option){
            if(!option.address || !option.password){
                throw new Error(this.$lan('连接中缺少地址和密码数据'));
            }
            this.getMnemonic(option.address, option.password);
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
    }
    .content{
        padding: 0 32rpx;
        .export-tips{
            margin-top: 51rpx;
            .export-tips-text{
                width: 633rpx;
                color: $main-color;
                font-size: 26rpx;
                line-height: 35rpx;
                flex: 1;
            }
        }
        .divide-line{
            border-top: 1rpx solid #DDD;
            margin: 51rpx 0 49rpx;
        }
        .tip-title {
            width: 686rpx;
            color: #333;
            font-size: 26rpx;
            line-height: 25rpx;
            display: flex;
            align-items: center;
            &::before {
                content: '';
                display: inline-block;
                position: relative;
                margin-right: 24rpx;
                width: 14rpx;
                height: 14rpx;
                border-radius: 50%;
                background-color: $main-color;
            }
        }
        .mnemonic-area{
            width: 686rpx;
            border: 1rpx solid #B0B0B4;
            padding: 24rpx  46rpx;
            line-height: 46rpx;
            margin-top: 54rpx;
            color: #666;
            font-size: 30rpx;
        }
        .attention{
            margin-top: 29rpx;
            color: #999;
            font-size: 26rpx;
        }
    }
</style>
