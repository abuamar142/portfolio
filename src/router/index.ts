import type { RouteRecordRaw } from 'vue-router'

// Routes only — the router instance itself is created by ViteSSG in src/main.ts
// (routerOptions, incl. scrollBehavior, are passed there).
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/blogs',
    name: 'blogs',
    component: () => import('../pages/BlogsList.vue'),
  },
  {
    path: '/blogs/:slug',
    name: 'blog-detail',
    component: () => import('../pages/BlogDetail.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
  },
]
