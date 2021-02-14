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
    // TODO: add error handling if user enters /play/something-invalid.  Would need to contact the game db and makes sure gameName exists, otherwise forward to an oops it looks like that page doesn't exist page.  
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
