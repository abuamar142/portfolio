<template>
  <footer class="border-t border-base-300">
    <div class="wrap py-12 md:py-16">
      <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <!-- Identity -->
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5">
            <span
              class="flex size-8 items-center justify-center rounded-md border border-base-300 bg-base-200 font-mono text-[11px] font-semibold tracking-wider text-base-content"
              aria-hidden="true"
            >
              {{ profile.initials }}
            </span>
            <span class="font-display text-[17px] tracking-tight text-base-content">
              {{ profile.name }}
            </span>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-ink-3">
            {{ $t('hero.subtitle') }}
          </p>
        </div>

        <!-- Contact + social -->
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
          <div>
            <p class="eyebrow">{{ $t('navigation.contact') }}</p>
            <ul class="mt-2 space-y-0.5">
              <li>
                <a
                  :href="`mailto:${profile.email}`"
                  class="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-primary"
                >
                  {{ profile.email }}
                </a>
              </li>
              <li>
                <a
                  :href="profile.phoneHref"
                  class="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-primary"
                >
                  {{ profile.phone }}
                </a>
              </li>
              <li class="flex min-h-11 items-center text-sm text-ink-3">{{ profile.location }}</li>
            </ul>
          </div>

          <div>
            <p class="eyebrow">{{ $t('contact.social') }}</p>
            <ul class="mt-2 space-y-0.5">
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
          </div>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-base-300 pt-6 sm:flex-row sm:items-center"
      >
        <p class="font-mono text-[11px] tracking-wide text-ink-4">
          © {{ year }} {{ profile.name }} — {{ $t('footer.built') }}
        </p>
        <a
          href="#hero"
          class="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-3 transition-colors hover:text-base-content"
        >
          <ArrowUp class="size-3.5" aria-hidden="true" />
          {{ $t('footer.backToTop') }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowUpRight } from 'lucide-vue-next'
import { profile } from '@/data/profile'

const year = new Date().getFullYear()

const socialLinks = [
  { label: 'GitHub', url: profile.social.github },
  { label: 'LinkedIn', url: profile.social.linkedin },
  { label: 'Instagram', url: profile.social.instagram },
]
</script>
