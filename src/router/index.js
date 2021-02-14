import Vue from 'vue'
import VueRouter from 'vue-router'
import CreateGame from '@/views/CreateGame.vue'

Vue.use(VueRouter)

const PlayGame = () => import('@/views/PlayGame.vue')

const routes = [
  {
    path: '/',
    name: 'create',
    component: CreateGame
  },
  {
    path: '/play/:game',
    name: 'play',
    component: PlayGame
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    redirect: { name: 'create' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
