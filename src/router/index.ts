import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin } from '@/lib/auth'

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
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminList.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/new',
      name: 'admin-new',
      component: () => import('../pages/AdminEdit.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/:id/edit',
      name: 'admin-edit',
      component: () => import('../pages/AdminEdit.vue'),
      meta: { requiresAdmin: true },
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

// Simple admin guard
router.beforeEach(async (to) => {
  if (to.meta?.requiresAdmin) {
    const ok = await isAdmin()
    if (!ok) {
      return { path: '/blogs', query: { forbidden: '1' } }
    }
  }
  return true
})

export default router
