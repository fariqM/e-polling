import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/menu/Home.vue'
import Polling from '../views/Polling'
import History from '../views/menu/History'
import Account from '../views/menu/Account'
import NewPoll from '../views/New'
import Landing from '../views/Landing'
import BaseMenuLayout from '../views/menu/Layout'
import MyPoll from '../views/menu/MyPolling'
import ReqDetails from '../views/Reqdetails'
import ShowPoll from '../views/ShowMyPoll'
import EditPoll from '../views/EditPoll'
import MapsEx from '../views/GM'

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
    path: '/{:ownerId}/{:pollingUrl}/edit',
    name: 'edit.poll',
    component: EditPoll
  },
  {
    path: '/new-poll/r-details',
    name: 'req.details',
    component: ReqDetails
  },
  {
    path: '/p/:pollingUrl',
    name: 'polling',
    component: Polling
  },
  {
    path: '/map/example',
    name: 'map.example',
    component: MapsEx
  },
  
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
