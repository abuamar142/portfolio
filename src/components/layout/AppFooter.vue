<template>
  <footer class="border-t border-base-300">
    <div class="wrap py-12 text-center md:py-16">
      <router-link to="/" class="inline-flex items-center gap-2.5">
        <span
          class="flex size-8 items-center justify-center rounded-md border border-base-300 bg-base-200 font-mono text-[11px] font-semibold tracking-wider text-base-content"
          aria-hidden="true"
        >
          {{ profile.initials }}
        </span>
        <span class="font-display text-[17px] tracking-tight text-base-content">
          {{ profile.name }}
        </span>
      </router-link>

      <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-3">
        {{ $t('hero.subtitle') }}
      </p>

      <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <li>
          <a
            :href="`mailto:${profile.email}`"
            class="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-primary"
          >
            {{ profile.email }}
          </a>
        </li>
        <li v-for="link in socialLinks" :key="link.label">
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-2 transition-colors hover:text-primary"
          >
            {{ link.label }}
            <ArrowUpRight class="size-3.5 text-ink-4" aria-hidden="true" />
          </a>
        </li>
      </ul>

      <p class="mt-8 font-mono text-[11px] tracking-wide text-ink-4">
        © {{ year }} {{ profile.name }} · {{ $t('footer.built') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { profile } from '@/data/profile'

const year = new Date().getFullYear()

const socialLinks = [
  { label: 'GitHub', url: profile.social.github },
  { label: 'LinkedIn', url: profile.social.linkedin },
  { label: 'Instagram', url: profile.social.instagram },
]
</script>
