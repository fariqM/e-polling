import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    req_name:false,
    req_email: false,
  },
  getters: {
    getReqEmail: state => state.req_email,
    getReqName: state => state.req_name,
  },
  mutations: {
    setReqEmail: (state, payload) => {
      state.req_email = payload
    },
    setReqName: (state, payload) => {
      state.req_name = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
