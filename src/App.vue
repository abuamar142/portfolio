<template>
  <div id="app" class="min-h-screen flex flex-col bg-dracula-background">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const siteUrl = 'https://abuamar.online'

useHead({
  titleTemplate: (title) => title ? `${title} | Abu Amar` : 'Abu Amar — Portfolio',
  meta: [
    { name: 'description', content: 'Personal portfolio of Abu Amar — Mobile & Full Stack Developer' },
    { property: 'og:site_name', content: 'Abu Amar' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Abu Amar — Portfolio' },
    { name: 'twitter:description', content: 'Personal portfolio of Abu Amar — Mobile & Full Stack Developer' },
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
  ],
})

onMounted(() => {
  document.documentElement.classList.remove('dark')
})
</script>
