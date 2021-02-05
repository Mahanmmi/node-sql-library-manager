import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/panel',
    name: 'Panel',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "panel" */ '../views/Panel.vue'),
  },
  {
    path: '/book',
    name: 'Book',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "book" */ '../views/Book.vue'),
  },
  {
    path: '/borrow',
    name: 'Borrow',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "borrow" */ '../views/Borrow.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = store.getters.getToken;
  if (!token) {
    if (to.name !== 'Home') {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else if (to.name === 'Home') {
    next({ name: 'Panel' });
  } else {
    next();
  }
});

export default router;
