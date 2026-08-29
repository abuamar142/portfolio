<template>
  <section id="about" class="py-16 bg-surface scroll-mt-14">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-text-primary tracking-tight mb-8">
        {{ $t('about.title') }}
      </h2>

      <!-- About Text -->
      <div class="max-w-2xl mb-8">
        <p class="text-text-secondary text-sm leading-relaxed">
          {{ portfolio?.about }}
        </p>
      </div>

      <!-- Stats with colorful accents -->
      <div class="flex flex-wrap gap-8 mb-8">
        <div class="group">
          <div class="text-lg font-semibold text-accent">
            {{ calculateExperienceYears() }}+
          </div>
          <div class="text-xs text-text-muted">
            years experience
          </div>
        </div>
        <div class="group">
          <div class="text-lg font-semibold text-[#10B981]">
            {{ portfolio?.projects?.length || 0 }}+
          </div>
          <div class="text-xs text-text-muted">
            projects completed
          </div>
        </div>
        <div class="group">
          <div class="text-lg font-semibold text-[#F97316]">
            6+
          </div>
          <div class="text-xs text-text-muted">
            technologies
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="flex flex-col sm:flex-row items-start gap-4">
        <a
          v-if="portfolio?.personalInfo.email"
          :href="`mailto:${portfolio.personalInfo.email}`"
          class="flex items-center gap-2 text-text-muted hover:text-accent transition-colors duration-150"
        >
          <Mail class="w-3.5 h-3.5" />
          <span class="text-xs">{{ portfolio.personalInfo.email }}</span>
        </a>
        <div
          v-if="portfolio?.personalInfo.location"
          class="flex items-center gap-2 text-text-muted"
        >
          <MapPin class="w-3.5 h-3.5" />
          <span class="text-xs">{{ portfolio.personalInfo.location }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const calculateExperienceYears = (): number => {
  const experiences = portfolio.value?.experiences || []
  if (experiences.length === 0) return 0

  let earliest = new Date()
  experiences.forEach((exp: any) => {
    if (exp.startDate) {
      const start = new Date(exp.startDate)
      if (start < earliest) earliest = start
    }
  })

  const now = new Date()
  const years = now.getFullYear() - earliest.getFullYear()
  return Math.max(years, 1)
}
</script>
