<script>
	import {
		mapActions,
		mapMutations,
		mapState
	} from "vuex";
	const unorm = require('./utils/dependence/unorm.js')

	export default {
		methods: {
			...mapActions(['getContractAddresses']),
		},
    watch:{
      defaultWallet: {
        deep: true,  //深度监听设置为 true
        handler: function(newV,oldV){
          if(newV && newV.address){
            this.getContractAddresses()
          }
        }
      }
    },
    computed:{
      ...mapState(['defaultWallet']),
	},
	// onBackPress(e) {
    // console.log(e);
    // if(e.from == 'backbutton'){
    // this.$utils.showModal('提示','房型尚未保存,确认退出吗?',true,'继续编辑','确定').then(()=>{
    // 	console.log('确定')
    // 	uni.navigateBack({
    // 		delta:1
    // 	})
    // }).catch(()=>{
    // 	console.log('继续编辑')
    // })
    // return true;//阻止默认返回行为
    // }
// },
		onLaunch: function() {
			this.getContractAddresses();
			console.log("App Launch");
			uni.setTabBarItem({
				index: 0,
				text: this.$lan('home')
			});
			uni.setTabBarItem({
				index: 1,
				text: this.$lan('flashRedemption')
			});
			uni.setTabBarItem({
				index: 2,
				text: this.$lan('browser')
			});
			uni.setTabBarItem({
				index: 3,
				text: this.$lan('mine')
			});

			// #ifdef H5
			//在页面加载时读取sessionStorage里的状态信息
			if (sessionStorage.getItem("store")) {
				this.$store.replaceState(Object.assign({},
					this.$store.state,
					JSON.parse(sessionStorage.getItem("store"))
				))
				sessionStorage.removeItem('store');
			}
			//在页面刷新时将vuex里的信息保存到sessionStorage里
			window.addEventListener("beforeunload", () => {
				sessionStorage.setItem("store", JSON.stringify(this.$store.state))
			})
			// #endif
		},
		onShow: function() {
			// console.log('App Show')

			let token = uni.getStorageSync("token");
			if (!token) {
				uni.reLaunch({
					url: "pages/login/login"
				});
			}
		},
		//   onReady: function() {
		// 	console.log("App onReady");
		// 	uni.setTabBarItem({
		//             index: 0,
		//             text: home
		//         });

		//   },
		// computed: {
		// 	...mapState(['hasLogin', 'token']), //对全局变量hasLogin进行监控
		// },
		onHide: function() {
			console.log("App Hide");
		}
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./app.scss";
	@import "./static/css/iconfont.css";
</style>
