import Vue from 'vue'

import APP from './APP.vue'

import './static/reset.css'
import './static/index.css'
import './static/common.scss'
import router from './router'

new Vue({
  router,
  render: h => h(APP)
}).$mount('#app')