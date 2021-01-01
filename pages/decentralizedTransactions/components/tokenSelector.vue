<template>
    <view class="app">
        <UniPopup ref="uniPop" type="bottom">
            <view class="token-selector-popup-container">
                <view class="content">
                    <input
                        v-model="tokenNameInput"
                        @input="handleTokenNameInput"
                        :placeholder="$lan('输入通证名称')"
                        class="token-input"/>
                    <swiper class="transfer-swiper" :current="tabIndex" @change="swiperChange">
                        <swiper-item  v-for="(pageData, index) in tabList">
                            <view style=" height: 100%">
                                <scroll-view :scroll-y="true" class="scroll-view">
                                    <view class="token-list">
                                        <view v-for="item in (tokenList.length ? tokenList : pageData.list)" class="token-item nav-row-start-center" @click="handleSelected(item)">
                                            <template v-if="!item._status">
                                                <image :src="item.iconUrl" class="token-image"/>
                                                <view class="token-name">{{item.tokenName}}</view>
                                            </template>
                                            <template v-else>
                                                <view class="token-name">没有该通证</view>
                                            </template>
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
                tokenList: [

                ],
                currentTokenList: [],
                tabIndex: '',
                source: '',
                tokenNameInput: '',
            }
        },
        methods: {
            showPop(data, source){
                this.tabList = _.cloneDeep(data || []);
                console.log('tabList', this.tabList);
                this.source = source;
                this.tabIndex = 0;
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
            handleTokenNameInput(){
                let tokenNameInput = this.tokenNameInput.trim().toUpperCase();
                if( !tokenNameInput ){
                    this.tokenList = [];
                    return;
                }
                this.tokenList = this.tabList[this.tabIndex].list.filter((item) => {
                    let tokenName =  item.tokenName.toUpperCase();
                    return tokenName.indexOf(tokenNameInput) > -1
                })
                if(!this.tokenList.length){
                    this.tokenList = [{_status: -1}] //没有筛选出通证
                }
            },
        }
    }
</script>
<style scoped lang="scss">
    *{
        box-sizing: border-box;
    }
    .token-selector-popup-container{
        width: 100%;
        height: 800rpx;
        background: #fff;
        background-size: cover;
        position: relative;
        .content{
            overflow: hidden;
            padding: 0 64rpx;
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
            .token-input{
                width: 100%;
                height:  80rpx;
                border: 1rpx solid #aaa;
                border-radius: 8rpx;
                margin:  64rpx 0 53rpx;
                padding: 0 46rpx;

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
                padding-bottom: 50rpx;
                .token-item{
                    width: 100%;
                    height: 80rpx;
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
