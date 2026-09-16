<template>
  <div class="mx-auto max-w-2xl text-center">
    <SectionHeader :title="$t('headings.contact')" :lead="$t('contact.subtitle')" align="center" />

    <div class="mt-8">
      <a
        :href="`mailto:${profile.email}`"
        class="link-sweep text-lg font-medium tracking-tight text-base-content md:text-xl"
      >
        {{ profile.email }}
      </a>
      <p class="mt-3 flex items-center justify-center gap-2 text-sm text-ink-3">
        <span class="size-1.5 rounded-full bg-primary" aria-hidden="true"></span>
        {{ $t('contact.badge') }} {{ profile.timeZoneLabel }}
      </p>
    </div>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <BaseButton class="min-h-11" :href="`mailto:${profile.email}`" :icon-left="Mail">
        {{ $t('contact.cards.email.title') }}
      </BaseButton>

      <BaseButton
        class="min-h-11"
        variant="secondary"
        :href="profile.whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        :icon-left="MessageCircle"
      >
        WhatsApp
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail, MessageCircle } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { profile } from '@/data/profile'
</script>
