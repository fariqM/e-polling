import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    req_name:false,
    req_email: false,
    myPoll:null,
  },
  getters: {
    getReqEmail: state => state.req_email,
    getReqName: state => state.req_name,
    getMyPoll: state => state.myPoll,
  },
  mutations: {
    setReqEmail: (state, payload) => {
      state.req_email = payload
    },
    setReqName: (state, payload) => {
      state.req_name = payload
    },
    setMyPoll: (state, payload) => {
      state.getMyPoll = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
