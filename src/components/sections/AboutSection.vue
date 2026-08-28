<template>
  <section
    id="about"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('about.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- About Text -->
      <div class="max-w-3xl mb-16 animate-slide-up">
        <p class="text-text-secondary text-base sm:text-lg leading-relaxed">
          {{ portfolio?.about }}
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 animate-slide-up" style="animation-delay: 0.1s">
        <div class="bg-surface-raised border border-border rounded-xl p-6 hover:border-border transition-colors duration-200">
          <div class="text-3xl font-bold text-text-primary mb-1">
            {{ portfolio?.experiences?.length || 0 }}+
          </div>
          <div class="text-sm text-text-muted">
            {{ $t('about.stats.years') }} {{ $t('about.stats.experience') }}
          </div>
        </div>

        <div class="bg-surface-raised border border-border rounded-xl p-6 hover:border-border transition-colors duration-200">
          <div class="text-3xl font-bold text-text-primary mb-1">
            {{ portfolio?.projects?.length || 0 }}+
          </div>
          <div class="text-sm text-text-muted">
            {{ $t('about.stats.projects') }} {{ $t('about.stats.completed') }}
          </div>
        </div>

        <div class="bg-surface-raised border border-border rounded-xl p-6 hover:border-border transition-colors duration-200">
          <div class="text-3xl font-bold text-text-primary mb-1">
            {{ portfolio?.skills?.length || 0 }}+
          </div>
          <div class="text-sm text-text-muted">
            {{ $t('about.stats.technologies') }} {{ $t('about.stats.mastered') }}
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="flex flex-col sm:flex-row items-start gap-6 animate-slide-up" style="animation-delay: 0.2s">
        <div class="flex items-center gap-3 text-text-secondary">
          <Mail class="w-4 h-4 text-text-muted flex-shrink-0" />
          <span class="text-sm">{{ portfolio?.personalInfo.email }}</span>
        </div>
        <div class="flex items-center gap-3 text-text-secondary">
          <MapPin class="w-4 h-4 text-text-muted flex-shrink-0" />
          <span class="text-sm">{{ portfolio?.personalInfo.location }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()
</script>
