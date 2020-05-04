import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'main',
    meta: {
      needLogin: true
    },
    component: () => import('./components/main.vue'),
    beforeEnter: function (to, from, next) {
      if (localStorage.getItem('isLogin') && JSON.parse(localStorage.getItem('isLogin')).status)
        next()
      else
        next({
          name: 'signin',
          query: {
            from: to.fullPath
          },
          replace: true
        })
    }
  }, {
    path: '/signin',
    name: 'signin',
    component: () => import('./components/signin.vue')
  }, {
    path: '/signup',
    name: 'signup',
    component: () => import('./components/signup.vue')
  }]
})

export default router