<template>
  <div class="flex min-h-screen flex-col bg-base-100">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-primary-content"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1">
      <router-view />
    </main>
    <AppFooter />

    <AuthModal :show="showAuth" @close="closeAuth" @authenticated="handleAuthenticated" />

    <!-- Live region: screen readers announce toasts. Errors are assertive
         (interrupts), success/info polite (waits for a pause). -->
    <div
      class="toast toast-end toast-bottom z-[200]"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['alert shadow-lg', alertClass(t.type)]"
        :role="t.type === 'error' ? 'alert' : undefined"
        :aria-live="t.type === 'error' ? 'assertive' : undefined"
      >
        <span>{{ t.message }}</span>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          :aria-label="$t('common.dismiss')"
          @click="dismiss(t.id)"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AuthModal from '@/components/AuthModal.vue'
import { useAuth, onAuthFailed, runAuthIntent } from '@/composables/useAuth'
import { useToast, type ToastType } from '@/composables/useToast'
import { usePortfolio } from '@/composables/usePortfolio'
import { SITE_URL } from '@/site'

const { toasts, dismiss } = useToast()
const { showAuth, closeAuth, logout, openAuth } = useAuth()
const toast = useToast()

// The user signed in while a gated action was queued (e.g. clicked "New quote"
// while logged out) — run it now so they don't have to repeat the click.
function handleAuthenticated() {
  runAuthIntent()
}

// When a token refresh fails (refresh past its 7d TTL or revoked), client.ts
// emits this: end the stale session and surface a clear prompt rather than
// letting a tool write fail with no explanation.
let offAuthFailed: (() => void) | null = null

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
const { locale, t } = useI18n()

onMounted(() => {
  offAuthFailed = onAuthFailed(() => {
    logout()
    toast.info(t('auth.sessionExpired'))
    openAuth()
  })
})
onUnmounted(() => {
  offAuthFailed?.()
})

// One canonical per route: path only (query/hash excluded), root keeps the
// trailing slash to match the sitemap's `https://abuamar.online/` entry.
const canonicalUrl = computed(() => new URL(route.path, SITE_URL).href)

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
  // Sitewide identity for search engines: the site itself plus the Person
  // behind it. Per-page markup (BlogPosting, the homepage Person block)
  // stays on the pages themselves.
  script: [
    {
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: 'Abu Amar',
            inLanguage: 'id-ID',
            publisher: { '@id': `${SITE_URL}/#person` },
          },
          {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'M. Abu Amar Al Badawi',
            url: `${SITE_URL}/`,
            jobTitle: 'Mobile & Full Stack Developer',
            sameAs: ['https://github.com/abuamar142'],
          },
        ],
      }),
    },
  ],
})
</script>
