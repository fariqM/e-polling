import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Home.vue'
import MapsView from '../views/Maps.vue'
import Polling from '../views/Polling'
import History from '../views/History'
import Account from '../views/Account'
import NewPoll from '../views/New'
import Landing from '../views/Landing'
import BaseMenuLayout from '../views/Layout'
import MyPoll from '../views/MyPolling'
import ReqDetails from '../views/Reqdetails'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/app',
    name: 'app.menu',
    component: BaseMenuLayout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomeView
      },
      {
        path: 'history',
        name: 'history',
        component: History
      },
      {
        path: 'my-poll',
        name: 'my.poll',
        component: MyPoll
      },
      {
        path: 'account',
        name: 'account',
        component: Account
      },
    ]
  },
  {
    path: '/new-poll',
    name: 'new.poll',
    component: NewPoll
  },
  {
    path: '/new-poll/r-details',
    name: 'req.details',
    component: ReqDetails
  },
  {
    path: '/maps',
    name: 'maps',
    component: MapsView
  },
  {
    path: '/p/:pollingUrl',
    name: 'polling',
    component: Polling
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
