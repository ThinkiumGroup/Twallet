<template>
  <view class="app">
    <view @click="showModal" class="btn-system"/>
    <UniPopup ref="passwordPopup" type="center" :maskClick="false">
       <view class="container">
         <view class="nav-row-start-center item">
           <text>Environmental Science</text>
           <view class="nav-row-start-center">
             <ARadio :value="'dev'" :isChecked="env === 'dev'" @click="handleEnvChange('dev')"><text class="__content">Development</text></ARadio>
             <ARadio :value="'pro'" :isChecked="env === 'pro'" @click="handleEnvChange('pro')"><text class="__content">Production</text></ARadio>
             <ARadio :value="'other'" :isChecked="env === 'other'"><text class="__content">other</text></ARadio>
           </view>
         </view>
         <view class="close" @click="hideModal">
           close
         </view>
       </view>
    </UniPopup>
  </view>
</template>
<script>
  import UniPopup from '@/components/uni-popup/uni-popup.vue'
  import ARadio from "./ARadio";
  import { getEnv, setEnv } from "../utils/host";

  export default {
    name: 'systemManagement',
    components:{UniPopup, ARadio},
    data() {
      return {
        times: 0,
        env: '',
      }
    },
    methods: {
      init(){
        this.env = getEnv();
        console.log('env', this.env);
      },
      showModal(){
        this.times++
        console.log('times', this.times++);
        if(this.times > 8){
          this.init();
          this.$refs.passwordPopup.open();
        }
        setTimeout(() => {
          this.time = 0;
        }, 2000);
      },
      hideModal(){
        this.$refs.passwordPopup.close();
      },
      handleEnvChange(env){
        setEnv(env)
        this.env = env;
        // #ifdef H5
        history.go(0)
        // #endif
        // #ifndef H5
        plus.runtime.restart();
        // #endif
      },
    },
    onLoad() {

    },
  }
</script>
<style scoped lang="scss">
  .btn-system{
    position: fixed;
    top: 0;
    right: 0;
    width: 200rpx;
    height: 200rpx;
  }
  .container{
    width: 600rpx;
    height: 500rpx;
    background: #fff;
    border-radius: 10rpx;
    padding: 30rpx 20rpx;
    .close{
       position: absolute;
       bottom: 10rpx;
       left: 50%;
       transform: translate(-50%, 0);
    }
  }

</style>
