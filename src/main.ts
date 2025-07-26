import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

// Import translations
import en from './locales/en'
import id from './locales/id'

// Add smooth scroll behavior to html element
document.documentElement.style.scrollBehavior = 'smooth'

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Enable composition API mode
  locale: 'id', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    id,
  },
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
