<template>
    <view class="container">
        <nav-bar :title="$lan('exportPrivateKey')" :containerStyle="{boxShadow: '0 0'}"/>
        <EasyTab :tabList="tabList" v-model="type"/>
        <swiper class="transfer-swiper" :current="type" @change="swiperChange">
            <swiper-item class="swiper-item">
                <view class="content">
                    <view class="label">
                        {{$lan('saveOffline')}}
                    </view>
                    <view class="text">
						{{$lan('pleaseSaveThePrivateKeyOffline')}}
                    </view>
                    <view class="label">
						{{$lan('doNotUseNetworkTransmission')}}

                    </view>
                    <view class="text">
						{{$lan('doNotSpreadYourPrivateKeyTips')}}

                    </view>
                    <view class="label">
                        {{$lan('saveWithPasswordTool')}}
                    </view>
                    <view class="text">
                        {{$lan('suggestionsForSavingPrivateKeys')}}
                    </view>
                    <view class="label">
                        {{$lan('yourPrivateKey')}}
                    </view>
                    <view class="private-key-area">
                        {{ privateKey }}
                    </view>
                    <allBtn :text="this.$lan('copyPrivateKey')"  :containerStyle="{marginTop: '150rpx', marginBottom: '50rpx'}" @click="toCopy(privateKey)"/>
                </view>
            </swiper-item>
            <swiper-item class="swiper-item">
                <scroll-view class="content" scroll-y="true">
                    <view class="label">
                        {{$lan('forScanningOnly')}}
                    </view>
                    <view class="text">
						{{$lan('doNotSaveQRCode')}}

                    </view>
                    <view class="label">
						{{$lan('pleaseUseInAnAbsolutelySafeEnvironment')}}

                    </view>
                    <view class="text">
						{{$lan('doNotRevealTheQRCode')}}
                    </view>
                    <view class="code-area">
                        <image src="/static/image/privateKey/hideCode.png" v-show="!showCode" style="width: 316rpx; height: 162rpx;"></image>
                        <image :src="codePath" v-show="showCode" style="width: 385rpx;height: 385rpx;"></image>
                    </view>
                    <allBtn :text="this.$lan('displayQRCode')" :containerStyle="{marginTop: '102rpx', marginBottom: '50rpx'}" @click="showCode = !showCode"/>
                </scroll-view>
            </swiper-item>
        </swiper>
        <view style="width: 0; height: 0;overflow: hidden;">
            <canvas canvas-id="qrcode" style="width: 385rpx;height: 385rpx;"/>
        </view>
    </view>
</template>
<script>
    import EasyTab from "../../components/EasyTab";
    import allBtn from "../../components/common/allBtn";
    import {copy} from "../../utils/common";
    import { aboutWallet } from "../../utils/businessCommon";
    import uQRCode from '@/utils/uqrcode.js'

    export default {
        components: {
            EasyTab, allBtn
        },
        data() {
            return {
                tabList: [
                    {
                        prop:this.$lan('exportPrivateKey'),
                        value: 0
                    },
                    {
                        prop:this.$lan('QRCode'),
                        value: 1
                    },
                ],
                type: 0, // 1 normal export page 2 QR code page
                privateKey: '',
                codePath: '',
                showCode: false,
            }
        },
        methods: {
            swiperChange(e){
                this.type = e.target.current;
            },
            toCopy(text){
                copy(text);
                uni.showToast({
                    title:this.$lan('copySuccessfully'),
                    icon: 'none',
                    duration: 2000
                });
            },
            async getPrivateKey(walletAddress, password){
                let walletInfo = await aboutWallet.getWalletInfo(walletAddress, password);
                this.privateKey = walletInfo.privateKey;
                this.createCode();
            },

            // Making QR code
            async createCode(){
                const {windowWidth, windowHeight} = uni.getSystemInfoSync();
                let size = 385 * windowWidth / 750;
								let text = encodeURIComponent(`type=importWallet&privateKey=${this.privateKey}`)
                const res = await uQRCode.make({
                    size,
                    text,
                    canvasId: 'qrcode',
                    componentInstance: this,
                    margin: 0,
                    backgroundColor: '#ffffff',
                    foregroundColor: '#000000',
                    fileType: 'jpg',
                    correctLevel: uQRCode.errorCorrectLevel.H,
                    success: res => {
                        console.log('-----getCodePath', res);
                        this.codePath = res;
                        // that.base64s = res;
                        // console.log(that.base64s);
                        // that.$forceUpdate();
                    },
                    fail: err => {
                        console.log('-----getCodePath-err', err);
                    }
                })
            }
        },
        onLoad(option){
            if(!option.address || !option.password){
                throw new Error('Address and password data missing in the connection');
            }
            this.getPrivateKey(option.address, option.password)
        }
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    .container{
        height: 100%;
        display: flex;
        flex-direction: column;
        .transfer-swiper {
            flex: 1;
            .swiper-item {
                height: 100%;
            }
        }

        .content{
            height: 100%;
            overflow: auto;
            padding: 0 36rpx;
            .label{
                color: #333;
                font-size: 30rpx;
                margin-top: 60rpx;
                line-height: 29rpx;
            }
            .text{
                color: #999;
                font-size: 30rpx;
                margin-top: 36rpx;
                 margin-bottom: 36rpx;
            }
            .private-key-area{
                margin-top: 45rpx;
                width: 100%;
                border-radius: 20rpx;
                background: #fff;
                padding: 40rpx 27rpx;
                color: #666;
                font-size: 26rpx;
                word-break: break-all;
                display: flex;
                align-items: center;

            }
            .code-area{
                width: 500rpx;
                height: 500rpx;
                background: #fff;
                margin: 93rpx auto 0;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
