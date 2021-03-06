import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
  },
  getters: {
    getToken(state) {
      if (state.token) {
        return state.token;
      }
      state.token = localStorage.getItem('token');
      return state.token;
    },
  },
  mutations: {
    loginSetToken(state, token) {
      state.token = `Bearer ${token}`;
      localStorage.setItem('token', `Bearer ${token}`);
      Vue.prototype.$http.defaults.headers.Authorization = `Bearer ${token}`;
    },
    logoutResetToken(state) {
      state.token = undefined;
      localStorage.removeItem('token');
      Vue.prototype.$http.defaults.headers.Authorization = undefined;
    },
  },
  actions: {
    async login({ commit }, user) {
      const token = (await Vue.prototype.$http.post('/users/login', {
        username: user.username,
        password: user.password,
      })).data;
      commit('loginSetToken', token);
    },
    async logout({ commit, state }) {
      await Vue.prototype.$http.get('/users/logout', {
        headers: {
          Authorization: state.token,
        },
      });
      commit('logoutResetToken');
    },
  },
  modules: {},
});
