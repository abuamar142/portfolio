<template>
  <section id="experiences" class="py-16 bg-surface scroll-mt-14">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-text-primary tracking-tight mb-8">
        {{ $t('experience.title') }}
      </h2>

      <!-- Timeline -->
      <div class="space-y-8">
        <div
          v-for="(experience, index) in portfolio?.experiences"
          :key="index"
          class="group"
        >
          <div class="flex items-start gap-4">
            <!-- Company Logo with color -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
              :style="{ background: getCompanyColor(experience.company) }"
            >
              {{ getInitials(experience.company) }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 class="text-sm font-medium text-text-primary">
                  {{ experience.position }}
                </h3>
                <span class="text-xs text-text-muted">
                  {{ experience.duration }}
                </span>
              </div>
              <p class="text-xs text-accent font-medium mb-3">
                {{ experience.company }}
              </p>

              <!-- Description -->
              <ul class="space-y-1.5 mb-3">
                <li
                  v-for="desc in experience.description"
                  :key="desc"
                  class="flex items-start gap-2 text-text-secondary text-xs leading-relaxed"
                >
                  <span class="text-accent mt-0.5">—</span>
                  <span>{{ desc }}</span>
                </li>
              </ul>

              <!-- Technologies with colors -->
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in experience.technologies"
                  :key="tech"
                  class="px-2 py-0.5 bg-accent-subtle text-accent text-[10px] rounded font-mono"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const companyColors: Record<string, string> = {
  'Kalbe': '#10B981',
  'SIESTA': '#8B5CF6',
  'Studyo.io': '#3B82F6',
  'Nodewave': '#F97316',
}

const getCompanyColor = (company: string): string => {
  const normalized = company.toLowerCase()
  for (const [key, color] of Object.entries(companyColors)) {
    if (normalized.includes(key.toLowerCase())) return color
  }
  // Default colors based on index
  const defaults = ['#7C3AED', '#3B82F6', '#EC4899', '#14B8A6', '#F97316']
  return defaults[Math.abs(company.charCodeAt(0)) % defaults.length]
}
</script>
