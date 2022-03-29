import Vue from 'vue'
import Main from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import AXIOS from "axios";
import { App, URLOpenListenerEvent } from '@capacitor/app';

window._ = require('./plugins/lodash_plugins/lodash.min.js');

Vue.config.productionTip = false
window.axios = AXIOS;



new Vue({
  router,
  store,
  vuetify,
  render: h => h(Main)
}).$mount('#app')

App.addListener('appUrlOpen', function (event) {
  // Example url: https://beerswift.app/tabs/tabs2
  // slug = /tabs/tabs2
  console.log(event);
  const slug = event.url.split('.app').pop();

  // We only push to the route if there is a slug present
  if (slug) {
    // router.push({ name: 'polling', params: { pollingUrl: 'tes' } })
    router.push({
      path: slug,
    });
  }
});

