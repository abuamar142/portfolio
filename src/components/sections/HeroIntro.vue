<template>
  <div class="rise mx-auto max-w-2xl text-center" style="--rv-i: 0">
    <p class="inline-flex items-center gap-2 text-sm text-ink-3">
      <span class="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true"></span>
      {{ $t('hero.badge') }}
    </p>

    <h1 class="rise display-hero mt-6 text-balance text-base-content" style="--rv-i: 1">
      {{ greeting }} {{ profile.shortName }}.
    </h1>

    <p class="rise mt-5 text-lg font-medium tracking-tight text-ink-2 md:text-xl" style="--rv-i: 2">
      {{ $t('hero.role') }}
    </p>

    <p class="rise lead mx-auto mt-5 max-w-xl" style="--rv-i: 3">
      {{ $t('hero.subtitle') }}
    </p>

    <div class="rise mt-9 flex flex-wrap items-center justify-center gap-3" style="--rv-i: 4">
      <a href="#projects" class="btn btn-primary min-h-11 gap-2">
        {{ $t('hero.cta.projects') }}
        <ArrowRight class="size-4" aria-hidden="true" />
      </a>
      <a
        :href="`mailto:${profile.email}`"
        class="btn btn-outline min-h-11 gap-2"
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
import { ArrowRight } from 'lucide-vue-next'
import SocialLink from '@/components/ui/SocialLink.vue'
import { profile } from '@/data/profile'

const { t } = useI18n()

const greeting = computed(() => t('hero.greeting'))

/** Icon-only social row under the CTAs (labels stay for screen readers via aria-label). */
const socialLinks = computed<
  { platform: 'github' | 'linkedin' | 'instagram'; href: string; label: string }[]
>(() => [
  { platform: 'github', href: profile.social.github, label: t('hero.labels.github') },
  { platform: 'linkedin', href: profile.social.linkedin, label: t('hero.labels.linkedin') },
  { platform: 'instagram', href: profile.social.instagram, label: 'Instagram' },
])
</script>
