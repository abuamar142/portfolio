import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80, // Account for fixed header
      }
    }
    return { top: 0 }
  },
})

// View Transitions: wrap each navigation in `document.startViewTransition`
// when the browser supports it.  Skip same-path navigations (e.g. hash
// changes) to avoid flicker, and skip entirely when the API is absent.
router.beforeEach((to, from) => {
  if (to.fullPath === from.fullPath) return true

  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    return new Promise<boolean>((resolve) => {
      document.startViewTransition(async () => {
        resolve(true)
      })
    })
  }

  return true
})

export default router
