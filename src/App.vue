<template>
  <div id="app" class="flex min-h-screen flex-col bg-base-100">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-primary-content"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1" role="main">
      <router-view />
    </main>
    <AppFooter />

    <!-- Toast notifications -->
    <div class="toast toast-end toast-bottom z-[200]">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['alert shadow-lg', alertClass(t.type)]"
      >
        <span>{{ t.message }}</span>
        <button @click="dismiss(t.id)" class="btn btn-ghost btn-xs">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

function alertClass(type: ToastType) {
  const map: Record<ToastType, string> = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
  }
  return map[type]
}

const siteUrl = 'https://abuamar.online'

useHead({
  titleTemplate: (title) => (title ? `${title} | Abu Amar` : 'Abu Amar - Portfolio'),
  meta: [
    {
      name: 'description',
      content: 'Personal portfolio of Abu Amar - Software Engineer',
    },
    { property: 'og:site_name', content: 'Abu Amar' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://abuamar.online/og-default.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Abu Amar - Portfolio' },
    {
      name: 'twitter:description',
      content: 'Personal portfolio of Abu Amar - Software Engineer',
    },
    { name: 'twitter:image', content: 'https://abuamar.online/og-default.png' },
  ],
  link: [{ rel: 'canonical', href: siteUrl }],
})
</script>
