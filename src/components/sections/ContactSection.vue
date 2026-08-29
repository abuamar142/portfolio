<template>
  <section id="contact" class="py-16 bg-surface scroll-mt-14">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-text-primary tracking-tight mb-8">
        {{ $t('contact.title') }}
      </h2>

      <!-- Contact Content -->
      <div class="space-y-8">
        <!-- Description -->
        <p class="text-text-secondary text-sm leading-relaxed max-w-lg">
          {{ $t('contact.subtitle') }}
        </p>

        <!-- Contact Info -->
        <div class="space-y-3">
          <a
            v-if="portfolio?.personalInfo.email"
            :href="`mailto:${portfolio.personalInfo.email}`"
            class="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-150"
          >
            <Mail class="w-4 h-4 text-text-muted" />
            <span class="text-sm">{{ portfolio.personalInfo.email }}</span>
          </a>
          <div
            v-if="portfolio?.personalInfo.location"
            class="flex items-center gap-3 text-text-muted"
          >
            <MapPin class="w-4 h-4" />
            <span class="text-sm">{{ portfolio.personalInfo.location }}</span>
          </div>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <a
            v-if="portfolio?.personalInfo.github"
            :href="portfolio.personalInfo.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-text-primary transition-colors duration-150"
            aria-label="GitHub"
          >
            <Github class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.linkedin"
            :href="portfolio.personalInfo.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-text-primary transition-colors duration-150"
            aria-label="LinkedIn"
          >
            <Linkedin class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.instagram"
            :href="portfolio.personalInfo.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-text-primary transition-colors duration-150"
            aria-label="Instagram"
          >
            <Instagram class="w-4 h-4" />
          </a>
          <a
            v-if="portfolio?.personalInfo.whatsApp"
            :href="portfolio.personalInfo.whatsApp"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-muted hover:text-text-primary transition-colors duration-150"
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
