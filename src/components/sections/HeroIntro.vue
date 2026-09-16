<template>
  <div v-if="identity" class="rise mx-auto max-w-2xl text-center" style="--rv-i: 0">
    <p class="inline-flex items-center gap-2 text-sm text-ink-3">
      <span class="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true"></span>
      {{ $t('hero.badge') }}
    </p>

    <h1 class="rise display-hero mt-6 text-balance text-base-content" style="--rv-i: 1">
      {{ greeting }} {{ identity.nickname }}.
    </h1>

    <p class="rise mt-5 text-lg font-medium tracking-tight text-ink-2 md:text-xl" style="--rv-i: 2">
      {{ identity.title }}
    </p>

    <p class="rise lead mx-auto mt-5 max-w-xl" style="--rv-i: 3">
      {{ bio }}
    </p>

    <div class="rise mt-9 flex flex-wrap items-center justify-center gap-3" style="--rv-i: 4">
      <a href="#projects" class="btn btn-primary min-h-11 gap-2">
        {{ $t('hero.cta.projects') }}
        <ArrowRight class="size-4" aria-hidden="true" />
      </a>
      <a
        :href="SITE_RESUME_PATH"
        target="_blank"
        rel="noopener"
        class="btn btn-outline min-h-11 gap-2"
      >
        <Download class="size-4" aria-hidden="true" />
        {{ $t('hero.cta.resume') }}
      </a>
      <a
        :href="`mailto:${identity.email}`"
        class="btn btn-ghost min-h-11 gap-2"
      >
        {{ $t('hero.cta.contact') }}
      </a>
    </div>

    <ul class="rise mt-8 flex items-center justify-center gap-1" style="--rv-i: 5">
      <li v-for="link in socialLinks" :key="link.platform" class="[&_svg]:size-5">
        <SocialLink
          :platform="link.platform"
          :href="link.href"
          :label="link.label"
          class="px-2.5"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Download } from 'lucide-vue-next'
import SocialLink from '@/components/ui/SocialLink.vue'
import { SITE_RESUME_PATH, useIdentity } from '@/composables/useIdentity'

const { t, locale } = useI18n()
const { identity } = useIdentity()

const greeting = computed(() => t('hero.greeting'))

/** Hero subtitle from CMS, in the active locale. */
const bio = computed(() =>
  locale.value === 'id' ? (identity.value?.bio_id ?? '') : (identity.value?.bio_en ?? ''),
)

/** Icon-only social row under the CTAs (labels stay for screen readers via aria-label). */
const socialLinks = computed<
  { platform: 'github' | 'linkedin' | 'instagram'; href: string; label: string }[]
>(() => [
  { platform: 'github', href: identity.value?.github ?? '', label: t('hero.labels.github') },
  { platform: 'linkedin', href: identity.value?.linkedin ?? '', label: t('hero.labels.linkedin') },
  { platform: 'instagram', href: identity.value?.instagram ?? '', label: 'Instagram' },
])
</script>
