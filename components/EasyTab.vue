<template>
    <view class="tabs">
        <text
            v-for="(item, index) in tabList"
            :key="index"
            class="tabs-item"
            :class=" {'tabs-item-active': item.value == valueSelected}"
            @click="onSelect(item.value)">
            {{item.prop}}
        </text>
    </view>
</template>
<script>
    export default {
        name: 'EasyTab',
        props:{
            tabList: {
              type: Array,
              default: function () {
                  return [
                      {
                          prop: 'transfer accounts',
                          value: 1,
                      },
                      {
                          prop: 'Transfer money to others',
                          value: 2,
                      },
                  ]
              },
              required: true,
            },
            activeValue: {
                default: '',
            },
        },
        model:{
            prop: 'activeValue',
            event:'onSelect'
        },
        data() {
            return {
                valueSelected: '',
            }
        },
        watch:{
            activeValue(){
                this.valueSelected = this.activeValue;
            }
        },
        methods: {
            onSelect(value){
                this.valueSelected = value;
                this.$emit('onSelect', value);
            },
        },
        created(){
            this.onSelect(this.activeValue || this.tabList[0].value)
        },
    }
</script>
<style scoped lang="scss">
    .tabs {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;

        .tabs-item {
            width: 215rpx;
            height: 88rpx;
            line-height: 80rpx;
            text-align: center;
            border-bottom: 4rpx solid #fff;
            color: #999999;
            font-size: 26rpx;
        }

        .tabs-item-active {
            color: #333333;
            border-bottom: 4rpx solid #333333;
        }
    }
</style>
