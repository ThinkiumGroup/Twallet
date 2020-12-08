<template>
    <view class="app">
        <UniPopup ref="uniPop" type="center">
            <view class="token-selector-popup-container">
                <view class="content">
                    <view class="tabs">
                        <view
                            @click="switchTab(index)"
                            class="tabs-item"
                            v-for="(item, index) in tabList"
                            :class="index == tabIndex && 'tabs-item-active'">
                            {{item.name}}
                        </view>
                    </view>
                    <swiper class="transfer-swiper" :current="tabIndex" @change="swiperChange">
                        <swiper-item  v-for="(pageData, index) in tabList">
                            <view style="padding: 0 32rpx 0 27rpx; height: 100%">
                                <scroll-view :scroll-y="true" class="scroll-view">
                                    <view class="token-list">
                                        <view v-for="item in pageData.list" class="token-item nav-row-start-center" @click="handleSelected(item)">
                                            <image :src="item.iconUrl" class="token-image"/>
                                            <view class="token-name">{{item.tokenName}}</view>
                                        </view>
                                    </view>
                                </scroll-view>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </UniPopup>
    </view>
</template>
<script>
    import UniPopup from '../../../components/uni-popup/uni-popup.vue'
    import _ from 'lodash'
    export default {
        name: 'tokenSelector',
        components: { UniPopup },
        data() {
            return {
                tabList: [{
                    name: 'MTO/BTO',
                    type: 'xto',
                    list: [
                        {image: '', tokenName: 'ETH', type: 'xto',},
                        {image: '', tokenName: 'ETH', type: 'xto',},
                         ]
                    },
                    {
                        name: this.$lan('其他通证'),
                        type: 'other',
                        list: [{image: '', tokenName: 'TKM', type: 'other',},
                               {image: '', tokenName: 'TKM', type: 'other',},]
                    }],
                currentTokenList: [],
                tabIndex: '',
                source: '',
            }
        },
        methods: {
            showPop(data, source){
                this.tabList = _.cloneDeep(data || []);
                console.log('tabList', this.tabList);
                this.source = source;
                this.$refs.uniPop.open();
            },
            closePop(){
                this.$refs.uniPop.close();
            },
            switchTab(index){
              this.tabIndex = index;
            },
            swiperChange(e){
                this.tabIndex = e.target.current
            },
            handleSelected(data){
                this.$emit('select', {source: this.source, data});
                this.closePop();
            },
        }
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    .token-selector-popup-container{
        width: 620rpx;
        height: 952rpx;
        background: url("../../../static/image/decentralizedTransactions/token-selector-bg.png") no-repeat center;
        background-size: cover;
        position: relative;
        .content{
            padding-top: 260rpx;
            .tabs{
                height: 90rpx;
                width: 564rpx;
                margin: 0 auto;
                display: flex;
                justify-content: left;
                align-items: flex-end;
               .tabs-item{
                   color: #535353;
                   font-size: 30rpx;
                   border-bottom-width: 5rpx;
                   border-bottom-style: solid;
                   border-color: $main-color-transparent;
                   padding: 0 11rpx;
                  &.tabs-item-active{
                      color: #404040;
                      font-weight: bold;
                      border-color: $main-color;

                  }
               }
                .tabs-item+.tabs-item{
                    margin-left: 38rpx;
                }
            }
            .transfer-swiper{
                margin-top: 50rpx;
                height: 500rpx;
                    .swiper-item {
                        height: 100%;
                    }
                .scroll-view{
                    height: 100%;
                }
            }
            .token-list{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                align-items: center;
                .token-item{
                    width: 100%;
                    height: 80rpx;
                    padding-left: 55rpx;
                    &:nth-child(n + 2){
                        margin-top: 50rpx;
                    }
                    .token-image{
                        width: 80rpx;
                        height: 80rpx;
                        margin-right: 38rpx;
                    }
                    .token-name{
                        font-size: 30rpx;
                        color: #666;
                    }
                }

            }
        }
    }
</style>
