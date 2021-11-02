<template>
  <view class="app">
    <CustomBar class="topBar" :styles="{background: '#fff'}"/>
    <NoDefaultWallet v-if="!hasDefaultWallet"></NoDefaultWallet>
	<!-- <web-view v-else
			:webview-styles="webviewStyles"
			src="http://localhost:9001/#/?userData=' + JSON.stringify(userData)"
			@message="handleMessage">
		
	</web-view> -->

    <web-view
			v-else
			:webview-styles="webviewStyles"
			:src="src"
			@message="handleMessage"
		 ></web-view>

  </view>
</template>
<script>
import CustomBar from "../../components/CustomBar";
import NoDefaultWallet from "../../components/NoDefaultWallet";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      src: "https://browser.thinkium.io/phone?public",
       webviewStyles: {
                     progress: false //Must be set to false
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
		onLoad(option) {
		if(option.src) this.src = option.src;


		// var pages = getCurrentPages();
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
		//Set battery bar height
		const currentWebview = this.$mp.page.$getAppWebview(); //Get the current web view
		setTimeout(function() {
		const wv = currentWebview.children()[0];
		wv.setStyle({ //Set the distance between the web view and the top and your own height in PX
			top: uni.getSystemInfoSync().statusBarHeight,
		})
		}, 1000);


  },
  //  onShow(){
  //           uni.setTabBarItem({
  //           index: 2,
  //           text:this.$lan('browser')
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
  },
 
};
</script>

<style scoped lang="scss">
.topBar{
  // height:34rpx;
}
</style>
