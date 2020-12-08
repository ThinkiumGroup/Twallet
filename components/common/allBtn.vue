<template name="allBtn">
    <view>
       <button  class="allBtn" type="primary" :style="containerStyle" @click="handleClick" :class="{'a_disabled': disabled}">{{ text }}</button>
    </view>
</template>

<script>
export default {
    name: 'allBtn',
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
      handleClick(){
        if(this.disabled){
          return;
        }
        this.$emit('click')
      }
    },
     props: {
       text: {
                type: String,
                default: '转账'
            },
       containerStyle: {

       },
       disabled: {
         type: Boolean,
         default: false,
       },
     },
};
</script>

<style scoped lang="scss">
.allBtn{
    background-color: $main-color;
    box-shadow: 0 6rpx 24rpx 5rpx $main-color-btn-shadow;
    width: 686rpx;
    margin: 0 auto;
    height: 90rpx;
    color:#FFFFFF;
    font-size: 32rpx;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
   &.a_disabled{
     background: #AAA;
     box-shadow: 0rpx 6rpx 24rpx 5rpx rgba(204, 209, 205, 0.35);
   }
}
</style>
