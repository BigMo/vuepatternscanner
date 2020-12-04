import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Workbench from '@/views/Workbench.vue'

import NotFound from '@/components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  }, {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      auth: false,
    },
  }, {
    path: '/workbench',
    name: 'Workbench',
    component: Workbench
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
