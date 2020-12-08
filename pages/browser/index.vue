<template>
  <view class="app">
    <CustomBar class="topBar"/>
    <NoDefaultWallet v-if="!hasDefaultWallet"></NoDefaultWallet>

    <web-view v-else  :webview-styles="webviewStyles" @message="handleMessage"
		 :src="src"></web-view>
     
  </view>
</template>
<script>
import CustomBar from "../../components/CustomBar";
import NoDefaultWallet from "../../components/NoDefaultWallet";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      src: "https://browser.thinkium.io/phone",
       webviewStyles: {
                     progress: false //必须要设置为false
                    // progress: {
                    //     color: '#FF3333'
                    // }
                }
    };
  },
  	onShow() {
      
      
      
	// 		 var pages = getCurrentPages();
  // var page = pages[pages.length - 1];
  // console.log("page",page)
  // console.log("pages",pages)
  
  // var currentWebview=page.$getAppWebview();
  // console.log("currentWebview",currentWebview)
	// setTimeout(function(){
  //   var web_view= currentWebview.children();
  //   console.log("111",web_view)
  //   var w=plus.nativeUI.showWaiting();
  //   console.log("222",w)
	// 	web_view[0].addEventListener("loading",function(){
	// 		w.show();
	// 	},false);
		
	// 	web_view[0].addEventListener("loaded",function(){
	// 		w.close();
	// 		w=null;
	// 	},false);
	// },600)
			
    },
    onReady(){
      console.log("this",this)
    },
  onload(option) {
    this.src = option.src;
  //   var pages = getCurrentPages();
	// var page = pages[pages.length - 1];
	// var currentWebview=page.$getAppWebview();
	// setTimeout(function(){
  //   var web_view= currentWebview.children();
  //   console.log("111",web_view)
  //   var w=plus.nativeUI.showWaiting();
  //   console.log("222",w)
	// 	web_view[0].addEventListener("loading",function(){
	// 		w.show();
	// 	},false);
		
	// 	web_view[0].addEventListener("loaded",function(){
	// 		w.close();
	// 		w=null;
	// 	},false);
	// },600)
    
  },
  //  onShow(){
  //           uni.setTabBarItem({
  //           index: 2,
  //           text:this.$lan('浏览器')
  //       });
  //       },
  computed: {
    ...mapState(["defaultWallet"]),
    ...mapGetters(["hasDefaultWallet"])
  },
  components: {
    CustomBar,
    NoDefaultWallet
  },
  methods:{
    handleMessage(){
      
    }
			// onPostMessage(){
			// 	console.log('xxxonPostMessage')
			// },
			// demo(){
			// 	console.log('xxxxxxxxxx')
			// },
			// message(event){
			// 	console.log('触发事件')
			// 	const data = event.detail.data[0]
			// 	console.log(data)
			// 	console.log('___________')
			// 	const action = data.action
			// 	console.log(action)
			// 	console.log('messagemessagemessagemessagemessage')
			// 	uni.showModal({
			// 	    title: '提示',
			// 	    content: data.type,
			// 	    success: function (res) {
			// 	        if (res.confirm) {
			// 	            console.log('用户点击确定');
			// 	        } else if (res.cancel) {
			// 	            console.log('用户点击取消');
			// 	        }
			// 	    }
			// 	});
			// 	console.log(event)
			// 	console.log('xxx')
			// }
		}
};
</script>

<style scoped lang="scss">
.topBar{
  // height:34rpx;
}
</style>