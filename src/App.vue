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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useToast, type ToastType } from '@/composables/useToast'
import { usePortfolio } from '@/composables/usePortfolio'
import { SITE_URL } from '@/site'

const { toasts, dismiss } = useToast()

// Identity powers the masthead and the whole colophon footer on EVERY route.
// Loading it from the app shell (not HomePage) keeps direct visits to
// /blogs, /quotes, /qr, /remove-bg, /explore and the 404 fully populated —
// AppFooter renders only when identity exists.
const { refresh } = usePortfolio()
onMounted(() => {
  void refresh()
})

function alertClass(type: ToastType) {
  const map: Record<ToastType, string> = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
  }
  return map[type]
}

const route = useRoute()
const { locale } = useI18n()

// One canonical per route: path only (query/hash excluded), root keeps the
// trailing slash to match the sitemap's `https://abuamar.online/` entry.
const canonicalUrl = computed(() => new URL(route.path, SITE_URL).href)

// Site-wide meta description — also the og:description fallback; individual
// pages override both with their own copy.
const SITE_DESCRIPTION =
  'M. Abu Amar Al Badawi - Mobile & Full Stack Developer. Portofolio proyek mobile, web, dan backend yang berjalan di produksi.'

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  titleTemplate: (title) => (title ? `${title} | Abu Amar` : 'Abu Amar - Portfolio'),
  meta: [
    { name: 'description', content: SITE_DESCRIPTION },
    { property: 'og:site_name', content: 'Abu Amar' },
    { property: 'og:url', content: computed(() => canonicalUrl.value) },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Abu Amar - Portfolio' },
    { property: 'og:description', content: SITE_DESCRIPTION },
    { property: 'og:image', content: `${SITE_URL}/og-default.png` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${SITE_URL}/og-default.png` },
  ],
  link: [{ rel: 'canonical', href: computed(() => canonicalUrl.value) }],
})
</script>
