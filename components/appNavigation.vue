<template>
  <view class="app-navigation" :style="styles">
    <!-- <div class="logo">
      <img src="../static/image/forsage/homeTopIcon.png" alt />
    </div> -->
    <view class="nav-right-dropDown">
      <image style="width:45rpx;height:36rpx;"  src="../static/image/forsage/homeTopIcon.png" alt @click="open"/>
      <view class="drop-down-list" :class="{open: isOpen}">
        <view class="modal" @click.self="close"/>
        <text class="li" v-for="(item, index) in list" :key="index" @click="jumpPage(item.path)">
            {{(item.name)}}
        </text>
        <view class="iconTop"/>
      </view>
      <!-- @click="dropDown" -->
    </view>
    <!-- <div :class="[!isShow ? 'active' : '.is-active' ]"></div> -->
  </view>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [
        { id: 0, name: "FAQ", path: '/pages/forsage/FAQ', },
        { id: 1, name: "Introduction", path: '/pages/forsage/explain',},
        // { id: 2, name: "developer", path: '/appDeveloper',},
        // { id: 3, name: "browser", path: 'appBrowser',}
      ]
    },
    styles: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
   
      return{
        isOpen:false
      } 
    },
  
  methods: {
    // langChange() {
    //   const langType = this.$i18n.locale == "en" ? "zh" : "en";
    //   this.$i18n.locale = langType;
    //   localStorage.setItem("lang", langType);
    // },
    dropDown(){
      this.isShow = !this.isShow
    },
    // goBrowser() {
    //   window.open("http://browser-pro.thinkium.io/");
    // },
    jumpPage(path){
      this.$router.push(path);
      this.close();
    // if(path=== 'appBrowser'){
    //     this.goBrowser()
    //   }else{
    //     this.$router.push(path);
    //   }
    //   this.close();
    },
    open(){
      console.log('打开了');
      this.isOpen = true;
    },
    close(){
      console.log('关闭了');
      this.isOpen = false;
    },
  }
};
</script>

<style lang="scss" scoped>
.app-navigation {
  width: 100%;
  position: absolute;
  // z-index: 100;
  display: flex;
  justify-content: space-between;
  padding-top:0.46rem;
  .logo {
    color: #fff;
    img {
      width: 1.98rem;
      height: 0.46rem;
      margin-left: 0.45rem;
    }
  }
  .nav-right-dropDown {
    display: flex;
    align-items: center;
    position: relative;

    image {
      // width: 0.34rem;
      // height: 0.34rem;
      // margin-right: 0.34rem;
      cursor: pointer;
    }
    .drop-down-list{
      position: absolute;
      top: 51rpx;
        right: -14rpx;
      width: 270rpx;
height: 200rpx;
background: #35374B;
opacity: 0.95;
border-radius: 10rpx;
      // padding: 0.18rem 0;
      // border-radius: 0.05rem;
      display: none;
      .iconTop{
        position: absolute;
        top: -20rpx;
        left: 224rpx;
       width: 0;
      height: 0;
      border: 12rpx solid ;
      border-color: transparent transparent #35374B transparent;
      opacity: 0.95;
        
      }
      &:before{
        content: '';
        position: absolute;
        top: 11rpx;
        right: 14rpx;
        width: 0;
        height: 0;
        border-left: 0.06rem solid transparent;
        border-right: 0.06rem solid transparent;
        border-bottom: 0.07rem solid rgba(0,0,0, 0.6);
      }
      &.open{
        display: block;
      }
      .modal{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2000px;
        height: 2000px;
        z-index: 1;

      }
      >.li{
        position: relative;
       display: block;
       padding-left: 57rpx;
       padding-top:59rpx;
       padding-bottom: 9rpx;
font-size: 28rpx;
font-family: PingFang SC;
font-weight: 400;
color: #FFFFFF;
line-height: 28rpx;
        // padding-left: 0.5rem;
        z-index: 2;
      }
    }
  }
}
</style>
