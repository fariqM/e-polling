import Vue from 'vue'
import Main from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './scss/var.scss'
import '@mdi/font/css/materialdesignicons.css'
import AXIOS from "axios";

import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { SplashScreen } from '@capacitor/splash-screen';

import izi_Toast from 'izitoast'
import "./plugins/iziToast.min.css"



window.platform = Capacitor.getPlatform();
window._ = require('./plugins/lodash_plugins/lodash.min.js');
window.toast = izi_Toast

Vue.config.productionTip = false

// const __BASE_URL_SERVER = 'http://192.168.1.3:8888/';
// const __BASE_URL_SERVER = 'https://poll-polling.test/';
// const __BASE_URL_SERVER = 'https://poll-polling.site/';
const __BASE_URL_SERVER = 'https://7847-2001-448a-50e1-f245-ac7b-137-a3c1-874f.ngrok.io/';


const __API_PREFIX = 'api'
// window.axios = AXIOS;
window.axios = AXIOS.create({
  baseURL: `${__BASE_URL_SERVER}${__API_PREFIX}`,
  // headers: {'X-Requested-With': 'XMLHttpRequest'},
});
window.__BASE_URL__ = __BASE_URL_SERVER



SplashScreen.hide().then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(Main)
  }).$mount('#app')
})


defineCustomElements(window);

App.addListener('appUrlOpen', function (event) {
  // Example url: https://beerswift.app/tabs/tabs2
  // slug = /tabs/tabs2
  console.log(event);
  const slug = event.url.split('.site').pop();

  // We only push to the route if there is a slug present
  if (slug) {
    // router.push({ name: 'polling', params: { pollingUrl: 'tes' } })
    router.push({
      path: slug,
    });
  }
});

