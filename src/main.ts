import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import { routes } from './router'

// Import translations
import en from './locales/en'
import id from './locales/id'

import { vReveal } from './composables/useReveal'
// https://github.com/antfu-collective/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    async scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash && typeof document !== 'undefined') {
        // Section targets mount only after portfolio data loads (skeleton
        // first, then async chunks) — wait for the element before scrolling.
        const deadline = Date.now() + 8000
        while (!document.querySelector(to.hash) && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
        if (document.querySelector(to.hash)) {
          return { el: to.hash, behavior: 'smooth', top: 72 } // Clear the sticky masthead
        }
      }
      return { top: 0 }
    },
  },
  ({ app, router, isClient }) => {
    // Create the i18n instance inside the hook so every prerendered page render
    // gets a fresh instance (no shared locale state across page renders).
    const i18n = createI18n({
      legacy: false, // Enable composition API mode
      locale: 'id', // default locale
      fallbackLocale: 'en',
      messages: {
        en,
        id,
      },
    })
    app.use(i18n)
    app.directive('reveal', vReveal)

    // Head (@unhead/vue) is registered automatically by vite-ssg
    // (`useHead: true` client option default) — no manual createHead needed.

    // Add smooth scroll behavior to html element (client only)
    if (isClient) {
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    // View Transitions: wrap each navigation in `document.startViewTransition`
    // when the browser supports it.  Skip same-path navigations (e.g. hash
    // changes) to avoid flicker, and skip entirely when the API is absent
    // (the guard below also keeps prerendering safe — no `document` in Node).
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
  },
)
