<template>
  <footer v-if="identity" class="border-t border-base-300">
    <div class="wrap py-12 text-center md:py-16">
      <router-link to="/" class="inline-flex items-center gap-2.5">
        <span
          class="flex size-8 items-center justify-center rounded-md border border-base-300 bg-base-200 font-mono text-[11px] font-semibold tracking-wider text-base-content"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
        <span class="font-display text-[17px] tracking-tight text-base-content">
          {{ identity.fullname }}
        </span>
      </router-link>

      <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-3">
        {{ bio }}
      </p>

      <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <li>
          <a
            :href="`mailto:${identity.email}`"
            class="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors hover:text-primary"
          >
            {{ identity.email }}
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
        © {{ year }} {{ identity.fullname }} · {{ $t('footer.built') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight } from 'lucide-vue-next'
import { useIdentity } from '@/composables/useIdentity'

const { locale } = useI18n()
const { identity, initials } = useIdentity()

const year = new Date().getFullYear()

const bio = computed(() =>
  locale.value === 'id' ? (identity.value?.bio_id ?? '') : (identity.value?.bio_en ?? ''),
)

const socialLinks = computed(() => [
  { label: 'GitHub', url: identity.value?.github ?? '' },
  { label: 'LinkedIn', url: identity.value?.linkedin ?? '' },
  { label: 'Instagram', url: identity.value?.instagram ?? '' },
])
</script>
