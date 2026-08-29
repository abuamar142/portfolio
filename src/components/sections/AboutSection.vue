<template>
  <section id="about" class="py-16 scroll-mt-14" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-lg font-semibold tracking-tight mb-8" style="color: var(--color-text-primary)">
        {{ $t('about.title') }}
      </h2>

      <div class="max-w-2xl mb-8">
        <p class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
          {{ portfolio?.about }}
        </p>
      </div>

      <div class="flex flex-wrap gap-8 mb-8">
        <div>
          <div class="text-lg font-semibold" style="color: var(--color-accent)">
            {{ calculateExperienceYears() }}+
          </div>
          <div class="text-xs" style="color: var(--color-text-muted)">years experience</div>
        </div>
        <div>
          <div class="text-lg font-semibold" style="color: var(--color-success)">
            {{ portfolio?.projects?.length || 0 }}+
          </div>
          <div class="text-xs" style="color: var(--color-text-muted)">projects completed</div>
        </div>
        <div>
          <div class="text-lg font-semibold" style="color: var(--color-orange)">
            6+
          </div>
          <div class="text-xs" style="color: var(--color-text-muted)">technologies</div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-start gap-4">
        <a
          v-if="portfolio?.personalInfo.email"
          :href="`mailto:${portfolio.personalInfo.email}`"
          class="flex items-center gap-2 transition-colors duration-150"
          style="color: var(--color-text-muted)"
        >
          <Mail class="w-3.5 h-3.5" />
          <span class="text-xs">{{ portfolio.personalInfo.email }}</span>
        </a>
        <div v-if="portfolio?.personalInfo.location" class="flex items-center gap-2" style="color: var(--color-text-muted)">
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
  return Math.max(now.getFullYear() - earliest.getFullYear(), 1)
}
</script>
