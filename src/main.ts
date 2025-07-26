import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

// Add smooth scroll behavior to html element
document.documentElement.style.scrollBehavior = 'smooth'

const app = createApp(App)

app.use(router)

app.mount('#app')
