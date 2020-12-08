<template>
    <view class="a-radio nav-row-center-center" @click="handleClick">
        <view style="margin-right: 12rpx" >
          <icon-font
              v-if="isChecked"
              src="wallet-s-circle-select"
              width="28rpx"
              height="28rpx"
              class="marks-item-img"/>
          <view class="no-select" v-else></view>
        </view>
        <slot>

        </slot>
    </view>
</template>
<script>
    export default {
        name: 'ARadio',
        props: {
          value:{

          },
          isChecked: {

          }
        },

        data() {
            return {

            }
        },
        methods: {
            handleClick(e){
                this.$emit('click', this.value)
            }
        }
    }
</script>
<style scoped lang="scss">
  *{
    box-sizing: border-box;
  }
  .a-radio{
    margin-left: 20rpx;
    margin-left: 20rpx;
  }
    .no-select{
        width: 28rpx;
        height: 28rpx;
        border: 1px solid #999;
        border-radius: 24rpx;
    }
</style>
