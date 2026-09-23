<template>
  <div v-if="identity" class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
    <div class="flex flex-col gap-6">
      <p class="flex items-center gap-2.5 text-sm text-ink-3">
        <span class="size-1.5 bg-voltage" aria-hidden="true"></span>
        {{ $t('contact.badge') }}
        <span class="data">{{ SITE_TIME_ZONE_LABEL }}</span>
      </p>

      <p class="font-display text-2xl leading-snug text-base-content lg:text-3xl">
        {{ $t('contact.subtitle') }}
      </p>
    </div>

    <div>
      <div class="mb-4">
        <span class="label label-ink">{{ $t('contact.cards.email.title') }}</span>
      </div>

      <div class="space-y-0">
        <a
          :href="`mailto:${identity.email}`"
          class="row flex items-center justify-between gap-4 px-0 py-4"
        >
          <span class="action">
            {{ identity.email }}
            <span class="arrow">&rarr;</span>
          </span>
        </a>

        <a
          v-if="identity.phone"
          :href="phoneHref"
          class="row flex items-center justify-between gap-4 px-0 py-4"
        >
          <span class="action">
            {{ identity.phone }}
            <span class="arrow">&rarr;</span>
          </span>
        </a>

        <div v-if="identity.location" class="row flex items-center justify-between gap-4 px-0 py-4">
          <span class="data">{{ identity.location }}</span>
        </div>
      </div>

      <div v-if="socialLinks.length" class="mt-8">
        <span class="label mb-3 block">{{ $t('contact.social') }}</span>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="action"
          >
            {{ link.label }}
            <span class="arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIdentity, SITE_TIME_ZONE_LABEL } from '@/composables/useIdentity'

const { identity, phoneHref } = useIdentity()

const socialLinks = computed(() => {
  if (!identity.value) return []
  const links: { label: string; href: string }[] = []
  if (identity.value.github) {
    links.push({ label: 'GitHub', href: identity.value.github })
  }
  if (identity.value.linkedin) {
    links.push({ label: 'LinkedIn', href: identity.value.linkedin })
  }
  if (identity.value.instagram) {
    links.push({ label: 'Instagram', href: identity.value.instagram })
  }
  if (identity.value.website) {
    links.push({ label: 'Website', href: identity.value.website })
  }
  return links
})
</script>
