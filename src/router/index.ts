import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/home/index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/hanoi',
    name: 'Hanoi',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "hanoi" */ '@/views/hanoi/index.vue')
  },
  {
    path: '/debounce-throttle',
    name: 'DebounceAndThrottle',
    component: () => import(/* webpackChunkName: "debounce" */ '@/views/debounce-throttle/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
