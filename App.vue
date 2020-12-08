<script>
import { mapMutations, mapState } from "vuex";
const unorm = require('./utils/dependence/unorm.js')

export default {
  onLaunch: function() {
	console.log("App Launch");
	uni.setTabBarItem({
            index: 0,
            text: this.$lan('首页')
		});
		uni.setTabBarItem({
            index: 1,
            text: this.$lan('闪兑')
		});
		uni.setTabBarItem({
            index: 2,
            text: this.$lan('浏览器')
		});
		uni.setTabBarItem({
            index: 3,
            text: this.$lan('我的')
        });
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
