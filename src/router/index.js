import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/menu/Home.vue'
import MapsView from '../views/Maps.vue'
import Polling from '../views/Polling'
import History from '../views/menu/History'
import Account from '../views/menu/Account'
import NewPoll from '../views/New'
import Landing from '../views/Landing'
import BaseMenuLayout from '../views/menu/Layout'
import MyPoll from '../views/menu/MyPolling'
import ReqDetails from '../views/Reqdetails'
import ShowPoll from '../views/ShowMyPoll'
import Testing from '../views/Radio'


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
    path: '/{:ownerId}/{:pollingUrl}/show',
    name: 'show.poll',
    component: ShowPoll
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
  {
    path: '/page/testing',
    name: 'testing.page',
    component: Testing
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
