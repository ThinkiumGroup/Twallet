<template>
    <UniPopup ref="easyDialog" type="center">
        <view class="container">
            <view class="content">
                <view class="header" v-if="titles">{{titles}}</view>
                <view class="body" v-if="texts">{{texts}}</view>
            </view>
            <view class="footer">
                <template v-if="isOneBtns">
                    <view @click="onOkBtnClick" class="single">{{okTexts}}</view>
                </template>
                <template v-else>
                    <view class="btn left" @click="onCancelBtnClick">{{cancelTexts}}</view>
                    <view class="btn right" @click="onOkBtnClick">{{okTexts}}</view>
                </template>
            </view>

        </view>
    </UniPopup>
</template>
<script>
    import UniPopup from '@/components/uni-popup/uni-popup.vue'
    export default {
        name: 'EasyDialog',
        components: { UniPopup },
        props: {
            title: {
                type: String,
                default: ''
            },
            text: {
                type: String,
                default: ''
            },
            isOneBtn: {
                type: Boolean,
                default: false,
            },
            okText: {
                type: String,
                default: '',
            },
            cancelText: {
                type: String,
                default: '',
            }
        },
        data() {
            return {
                title2: '',
                text2: '',
                isOneBtn2: '',
                okText2: '',
                cancelText2: ''
            }
        },
        computed: {
            titles(){ return this.title2 || this.title},
            texts(){ return this.text2 || this.text},
            isOneBtns(){ return this.isOneBtn2 || this.isOneBtn},
            okTexts(){ return this.okText2 || this.okText},
            cancelTexts(){ return this.cancelText2 || this.cancelText},
        },
        methods: {
            onOkBtnClick(){
                console.log('Click OK');
                this.onOk && this.onOk();
                this.closeDialog();
                this.$emit('onOkBtnClick')
            },
            onCancelBtnClick(){
                console.log('Click Cancel');
                this.onCancel && this.onCancel();
                this.closeDialog();
                this.$emit('onCancelBtnClick')
            },
            showDialog({ title, text, okText, cancelText, ok, cancel } = {}){
                if(title) this.title2 = title;
                if(text) this.text2 = text;
                if(okText) this.okText2 = okText;
                if(cancelText) this.cancelText2 = cancelText;
                if(ok) this.onOk = ok;
                if(cancel) this.onCancel = cancel;
                this.$refs.easyDialog.open()

            },
            closeDialog(){
                this.onCancel && this.onCancel();
                this.$refs.easyDialog.close()
            },
        },
    }
</script>
<style scoped lang="scss">
    .container{
        width: 600rpx;
        background: #fff;
        border-radius: 20rpx;
        .content{
            padding: 59rpx 62rpx 58rpx;
            .header{
                width: 100%;
                color: #333;
                font-size: 36rpx;
                font-weight: 600;
                text-align: center;
                line-height:35rpx;
            }
            .body{
                margin-top: 64rpx;
                color: #666;
                font-size: 30rpx;
                line-height: 42rpx;
            }
        }
        .footer{
            height: 100rpx;
            border-top: 1rpx solid #DDD;
            display: flex;
            justify-content: space-between;
            .single{
                color: $main-color;
                font-size: 34rpx;
                font-weight: 600;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .btn{
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .left{
                width: 50%;
                color: #999;
                font-size: 34rpx;
            }
            .right{
                width: 50%;
                color: $main-color;
                font-size: 34rpx;
                font-weight: 600;
                border-left: 1rpx solid #DDD;
            }
        }
    }
</style>
