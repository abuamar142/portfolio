import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import { routes } from './router'

// Import translations
import en from './locales/en'
import id from './locales/id'

// https://github.com/antfu-collective/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
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
