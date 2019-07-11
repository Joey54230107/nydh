import Vue from 'vue'
import App from './App'

import router from './router'
import * as customFilter from './plugins/filter/custom'
import '@/assets/libs/mui.js'
import '@/assets/style/mui.scss'
import '@/assets/style/main.scss'
import '@/assets/style/iconfont.scss'
import '@/assets/style/awesome.scss'
import address from '../config/address.js'

Vue.config.productionTip = false

Object.keys(customFilter).forEach(key => {
	Vue.filter(key, customFilter[key])
})

new Vue({
  el: '#app',

  router,

  components: {
  	App
	},

  template: '<App />'
})

