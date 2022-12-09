import App from './App'
import api from '@/common/api.js'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

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
  app.config.globalProperties.NAME = '不饿了自助点餐'
  app.use(store)
  return {
    app
  }
}
// #endif