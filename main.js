import Vue from 'vue'
import App from './App'
import store from './store'
import './global'

import "@/filters/"
import utils from '@/utils/utils'
Vue.use(utils)

Vue.config.productionTip = false
Vue.prototype.$store = store;




import iconFont from './components/IconFont.vue'
Vue.component('icon-font',iconFont)

import NavBar from './components/NavBar.vue'
Vue.component('nav-bar',NavBar)

// import UniPopup from '@/components/uni-popup/uni-popup.vue'
// Vue.component('uni-popup',UniPopup)

App.mpType = 'app';
const app = new Vue({
    ...App,
    // store
});
app.$mount()
