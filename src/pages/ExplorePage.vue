<template>
  <section id="explore" class="page-top">
    <div class="wrap pb-20 md:pb-28">
      <SectionHeader level="h1" :title="$t('navigation.explore')" />

      <ul class="border-t border-base-300">
        <li
          v-for="(entry, index) in entries"
          :key="entry.to"
          v-reveal
          :style="{ '--rv-i': index }"
          class="row"
        >
          <router-link
            :to="entry.to"
            class="grid gap-2 py-6 md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-center md:gap-8 md:py-8"
          >
            <span class="row-place">{{ entry.path }}</span>
            <span class="min-w-0">
              <span class="row-title block">{{ entry.title }}</span>
              <span class="row-dek block">{{ entry.dek }}</span>
            </span>
            <ArrowRight class="row-arrow size-5" aria-hidden="true" />
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { ArrowRight } from 'lucide-vue-next'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const { t } = useI18n()

/**
 * Directory of everything that is not a landing-page section. Each new
 * surface ships as one more `{ to, path, title, dek }` ledger entry.
 */
const entries = computed(() => [
  { to: '/blogs', path: '/blogs', title: t('navigation.blog'), dek: t('headings.blog') },
  { to: '/quotes', path: '/quotes', title: t('quotes.title'), dek: t('quotes.dek') },
  { to: '/remove-bg', path: '/remove-bg', title: t('removeBg.title'), dek: t('removeBg.dek') },
  { to: '/qr', path: '/qr', title: t('qr.title'), dek: t('qr.dek') },
])

useHead({
  title: computed(() => t('navigation.explore')),
  meta: [
    { name: 'description', content: computed(() => t('head.explore')) },
    { property: 'og:title', content: computed(() => `${t('navigation.explore')} - Abu Amar`) },
    { property: 'og:description', content: computed(() => t('head.explore')) },
  ],
})
</script>
