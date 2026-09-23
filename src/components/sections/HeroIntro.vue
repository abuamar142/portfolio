<template>
  <div v-if="identity" class="flex flex-col">
    <p class="rise flex items-center gap-3" style="--rv-i: 0">
      <span class="marker-sm" aria-hidden="true"></span>
      <span class="data">{{ identity.location }} · {{ SITE_TIME_ZONE_LABEL }}</span>
    </p>

    <h1 class="rise display-hero mt-6 text-balance text-base-content" style="--rv-i: 1">
      {{ greeting }} {{ identity.nickname }}.
    </h1>

    <div class="rise mt-7 max-w-[46ch] border-t border-hairline-light pt-5" style="--rv-i: 2">
      <p class="text-base leading-relaxed text-ink-2">{{ bio }}</p>
    </div>

    <div class="rise mt-8 flex flex-wrap items-center gap-3" style="--rv-i: 3">
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
      <a :href="`mailto:${identity.email}`" class="btn btn-ghost min-h-11 gap-2">
        {{ $t('hero.cta.contact') }}
      </a>
    </div>

    <ul class="rise mt-8 flex items-center gap-1" style="--rv-i: 4">
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
import { SITE_RESUME_PATH, SITE_TIME_ZONE_LABEL, useIdentity } from '@/composables/useIdentity'

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
