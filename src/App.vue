<template>
  <div id="app" class="min-h-screen flex flex-col bg-surface">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm">
      Skip to content
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1" role="main">
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
    { property: 'og:image', content: 'https://abuamar.online/og-default.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Abu Amar — Portfolio' },
    { name: 'twitter:description', content: 'Personal portfolio of Abu Amar — Mobile & Full Stack Developer' },
    { name: 'twitter:image', content: 'https://abuamar.online/og-default.png' },
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
  ],
})

onMounted(() => {
  document.documentElement.classList.remove('dark')
})
</script>
