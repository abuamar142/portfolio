<template>
  <footer v-if="identity" class="bg-neutral text-neutral-content">
    <div class="wrap">
      <div
        class="grid gap-10 py-14 md:grid-cols-2 md:gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-y-0 lg:py-20"
      >
        <!-- Brand -->
        <div class="lg:pr-8">
          <div class="flex items-center gap-3">
            <span
              class="flex size-8 shrink-0 items-center justify-center border border-neutral-content/25 font-mono text-[11px] font-semibold tracking-wider"
              aria-hidden="true"
            >
              {{ initials }}
            </span>
            <span class="masthead-name text-neutral-content">{{ identity.fullname }}</span>
          </div>
          <p class="mt-5 max-w-[34ch] text-base leading-relaxed text-neutral-content/70">
            {{ bio }}
          </p>
        </div>

        <!-- Sections -->
        <div class="lg:border-l lg:border-neutral-content/15 lg:pl-8">
          <p class="label text-neutral-content/50">{{ $t('footer.labels.sections') }}</p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="item in sectionLinks" :key="item.hash">
              <router-link
                :to="{ path: '/', hash: item.hash }"
                class="inline-flex min-h-11 items-center font-sans text-[13px] font-medium text-neutral-content/75 transition-colors hover:text-voltage-light"
              >
                {{ $t(item.label) }}
              </router-link>
            </li>
            <li>
              <router-link
                to="/explore"
                class="inline-flex min-h-11 items-center font-sans text-[13px] font-medium text-neutral-content/75 transition-colors hover:text-voltage-light"
              >
                {{ $t('navigation.explore') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Elsewhere -->
        <div class="lg:border-l lg:border-neutral-content/15 lg:pl-8">
          <p class="label text-neutral-content/50">{{ $t('footer.labels.elsewhere') }}</p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="link in socialLinks" :key="link.label">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 items-center gap-1.5 font-sans text-[13px] font-medium text-neutral-content/75 transition-colors hover:text-voltage-light"
              >
                {{ link.label }}
                <ArrowUpRight class="size-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="lg:border-l lg:border-neutral-content/15 lg:pl-8">
          <p class="label text-neutral-content/50">{{ $t('footer.labels.contact') }}</p>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li>
              <a
                :href="`mailto:${identity.email}`"
                class="inline-flex min-h-11 items-center font-sans text-[13px] font-medium text-neutral-content/75 transition-colors hover:text-voltage-light"
              >
                {{ identity.email }}
              </a>
            </li>
            <li v-if="identity.phone">
              <a
                :href="phoneHref"
                class="inline-flex min-h-11 items-center font-sans text-[13px] font-medium text-neutral-content/75 transition-colors hover:text-voltage-light"
              >
                {{ identity.phone }}
              </a>
            </li>
            <li
              v-if="identity.location"
              class="flex min-h-11 items-center font-mono text-[13px] text-neutral-content/60"
            >
              {{ identity.location }}
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-content/15 py-5"
      >
        <p class="font-mono text-xs text-neutral-content/60">
          © {{ year }} {{ identity.fullname }} · {{ $t('footer.built') }}
        </p>
        <router-link
          :to="{ path: '/', hash: '#hero' }"
          class="inline-flex min-h-11 items-center gap-2 font-sans text-[13px] font-medium text-neutral-content/70 transition-colors hover:text-voltage-light"
        >
          {{ $t('footer.backToTop') }}
          <ArrowUp class="size-3.5" aria-hidden="true" />
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUp, ArrowUpRight } from 'lucide-vue-next'
import { useIdentity } from '@/composables/useIdentity'

const { locale } = useI18n()
const { identity, initials, phoneHref } = useIdentity()

const year = new Date().getFullYear()

/** Home-route hash targets; router-link so they work from /blogs too. */
const sectionLinks = [
  { hash: '#about', label: 'navigation.about' },
  { hash: '#experiences', label: 'navigation.experience' },
  { hash: '#projects', label: 'navigation.projects' },
  { hash: '#skills', label: 'navigation.skills' },
  { hash: '#education', label: 'navigation.education' },
  { hash: '#achievements', label: 'navigation.achievements' },
  { hash: '#contact', label: 'navigation.contact' },
]

const bio = computed(() =>
  locale.value === 'id' ? (identity.value?.bio_id ?? '') : (identity.value?.bio_en ?? ''),
)

const socialLinks = computed(() => [
  { label: 'GitHub', url: identity.value?.github ?? '' },
  { label: 'LinkedIn', url: identity.value?.linkedin ?? '' },
  { label: 'Instagram', url: identity.value?.instagram ?? '' },
])
</script>
