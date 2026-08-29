<template>
  <section id="contact" class="py-16 scroll-mt-14" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-lg font-semibold tracking-tight mb-8" style="color: var(--color-text-primary)">
        {{ $t('contact.title') }}
      </h2>

      <div class="space-y-8">
        <p class="text-sm leading-relaxed max-w-lg" style="color: var(--color-text-secondary)">
          {{ $t('contact.subtitle') }}
        </p>

        <div class="space-y-3">
          <a
            v-if="portfolio?.personalInfo.email"
            :href="`mailto:${portfolio.personalInfo.email}`"
            class="flex items-center gap-3 transition-colors duration-150"
            style="color: var(--color-text-secondary)"
          >
            <Mail class="w-4 h-4" style="color: var(--color-accent)" />
            <span class="text-sm">{{ portfolio.personalInfo.email }}</span>
          </a>
          <div v-if="portfolio?.personalInfo.location" class="flex items-center gap-3" style="color: var(--color-text-muted)">
            <MapPin class="w-4 h-4" style="color: var(--color-success)" />
            <span class="text-sm">{{ portfolio.personalInfo.location }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-if="portfolio?.personalInfo.github"
            :href="portfolio.personalInfo.github"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors duration-150"
            style="color: var(--color-text-muted)"
            aria-label="GitHub"
          >
            <Github class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.linkedin"
            :href="portfolio.personalInfo.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors duration-150"
            style="color: var(--color-text-muted)"
            aria-label="LinkedIn"
          >
            <Linkedin class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.instagram"
            :href="portfolio.personalInfo.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors duration-150"
            style="color: var(--color-text-muted)"
            aria-label="Instagram"
          >
            <Instagram class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.whatsApp"
            :href="portfolio.personalInfo.whatsApp"
            target="_blank"
            rel="noopener noreferrer"
            class="transition-colors duration-150"
            style="color: var(--color-text-muted)"
            aria-label="WhatsApp"
          >
            <MessageCircle class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Github, Linkedin, Instagram, MessageCircle, Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()
</script>
