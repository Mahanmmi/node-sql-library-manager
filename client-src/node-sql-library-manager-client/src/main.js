import Vue from 'vue';
// Axios
import axios from 'axios';
// Bootstrap Vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// Animate CSS
import 'animate.css';
// Vue notification
import Notifications from 'vue-notification';
// Vue app, router and store
import App from './App.vue';
import router from './router';
import store from './store';

Vue.prototype.$http = axios.create({
  baseURL: process.env.VUE_APP_SERVER_BASE_URL,
});

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
