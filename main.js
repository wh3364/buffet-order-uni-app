import App from './App'
import api from '@/common/api.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$api = api

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$api = api
  app.config.globalProperties.$api.cart = {
					body: [],
					way: 0,
					total: 0
				}
  app.config.globalProperties.mainPath = api.path
  return {
    app
  }
}
// #endif