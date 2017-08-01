import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-default/index.css'
import routes from './routes'
import stores from './stores'
import App from './App.vue'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI, { locale })

const router = new VueRouter({
  routes
})

const store = new Vuex.Store(stores)

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
}).$mount('#app')
