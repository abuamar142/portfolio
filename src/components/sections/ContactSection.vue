<template>
  <section
    id="contact"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('contact.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Contact Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Left: Contact Info -->
        <div class="space-y-8 animate-slide-up">
          <p class="text-text-secondary text-base sm:text-lg leading-relaxed max-w-md">
            {{ $t('contact.subtitle') }}
          </p>

          <!-- Contact Cards -->
          <div class="space-y-4">
            <ContactCard
              icon="email"
              type="email"
              :title="$t('contact.cards.email.title')"
              :content="portfolio?.personalInfo.email || ''"
              :subtitle="$t('contact.cards.email.subtitle')"
              :href="`mailto:${portfolio?.personalInfo.email || ''}`"
            />

            <ContactCard
              icon="location"
              type="location"
              :title="$t('contact.cards.location.title')"
              :content="portfolio?.personalInfo.location || ''"
              :subtitle="$t('contact.cards.location.subtitle')"
            />

            <ContactCard
              v-if="portfolio?.personalInfo.phone"
              icon="phone"
              type="phone"
              :title="$t('contact.cards.phone.title')"
              :content="portfolio?.personalInfo.phone || ''"
              :subtitle="$t('contact.cards.phone.subtitle')"
            />
          </div>
        </div>

        <!-- Right: Social Links -->
        <div class="animate-slide-up" style="animation-delay: 0.1s">
          <h3 class="text-lg font-semibold text-text-primary mb-6">
            {{ $t('contact.social') }}
          </h3>

          <div class="space-y-3">
            <a
              v-if="portfolio?.personalInfo.github"
              :href="portfolio?.personalInfo.github"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/30 transition-all duration-200"
            >
              <div class="flex items-center gap-3">
                <Github class="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                <div>
                  <p class="text-text-primary text-sm font-medium">GitHub</p>
                  <p class="text-text-muted text-xs">View repositories</p>
                </div>
              </div>
              <ExternalLinkIcon class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </a>

            <a
              v-if="portfolio?.personalInfo.linkedin"
              :href="portfolio?.personalInfo.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/30 transition-all duration-200"
            >
              <div class="flex items-center gap-3">
                <Linkedin class="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                <div>
                  <p class="text-text-primary text-sm font-medium">LinkedIn</p>
                  <p class="text-text-muted text-xs">Professional network</p>
                </div>
              </div>
              <ExternalLinkIcon class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </a>

            <a
              v-if="portfolio?.personalInfo.instagram"
              :href="portfolio?.personalInfo.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/30 transition-all duration-200"
            >
              <div class="flex items-center gap-3">
                <Instagram class="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                <div>
                  <p class="text-text-primary text-sm font-medium">Instagram</p>
                  <p class="text-text-muted text-xs">Behind the scenes</p>
                </div>
              </div>
              <ExternalLinkIcon class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </a>

            <a
              v-if="portfolio?.personalInfo.whatsApp"
              :href="portfolio?.personalInfo.whatsApp"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center justify-between bg-surface-raised border border-border rounded-xl p-4 hover:border-accent/30 transition-all duration-200"
            >
              <div class="flex items-center gap-3">
                <MessageCircle class="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
                <div>
                  <p class="text-text-primary text-sm font-medium">WhatsApp</p>
                  <p class="text-text-muted text-xs">Quick chat</p>
                </div>
              </div>
              <ExternalLinkIcon class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Github, Linkedin, Instagram, MessageCircle, ExternalLinkIcon } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import ContactCard from '@/components/ui/ContactCard.vue'

const { portfolio } = usePortfolio()
</script>
