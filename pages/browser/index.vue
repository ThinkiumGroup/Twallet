<template>
  <view class="app">
    <CustomBar class="topBar" :styles="{background: '#fff'}"/>
    <NoDefaultWallet v-if="!hasDefaultWallet"></NoDefaultWallet>
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
		//设置电池栏高度
		const currentWebview = this.$mp.page.$getAppWebview(); //获取当前web-view
		setTimeout(function() {
		const wv = currentWebview.children()[0];
		wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
			top: uni.getSystemInfoSync().statusBarHeight,
		})
		}, 1000);
	
    
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