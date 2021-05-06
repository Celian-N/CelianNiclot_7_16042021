import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { isUserLoggedIn } from '../mixins/auth/auth.mixins';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/edit-post/:publicationId',
        name: 'EditPost',
        component: () => import('../pages/EditPublication.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
  },

  // {
  //   path: '*',
  //   component: () => import('pages/Error404/Error404.vue')
  // }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isUserLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
