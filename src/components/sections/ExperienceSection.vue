<template>
  <section id="experiences" class="py-16 scroll-mt-14" style="background: var(--color-surface)">
    <div class="max-w-3xl mx-auto px-6">
      <h2 class="text-lg font-semibold tracking-tight mb-8" style="color: var(--color-text-primary)">
        {{ $t('experience.title') }}
      </h2>

      <div class="space-y-8">
        <div
          v-for="(experience, index) in portfolio?.experiences"
          :key="index"
          class="group"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
              :style="{ background: getCompanyColor(experience.company) }"
            >
              {{ getInitials(experience.company) }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 class="text-sm font-medium" style="color: var(--color-text-primary)">
                  {{ experience.position }}
                </h3>
                <span class="text-xs" style="color: var(--color-text-muted)">
                  {{ experience.duration }}
                </span>
              </div>
              <p class="text-xs font-medium mb-3" style="color: var(--color-accent)">
                {{ experience.company }}
              </p>

              <ul class="space-y-1.5 mb-3">
                <li
                  v-for="desc in experience.description"
                  :key="desc"
                  class="flex items-start gap-2 text-xs leading-relaxed"
                  style="color: var(--color-text-secondary)"
                >
                  <span style="color: var(--color-accent)">—</span>
                  <span>{{ desc }}</span>
                </li>
              </ul>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in experience.technologies"
                  :key="tech"
                  class="px-2 py-0.5 text-[10px] rounded font-mono"
                  style="background: var(--color-accent-subtle); color: var(--color-accent)"
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
  'Kalbe': '#059669',
  'SIESTA': '#7C3AED',
  'Studyo.io': '#2563EB',
  'Nodewave': '#EA580C',
}

const getCompanyColor = (company: string): string => {
  const normalized = company.toLowerCase()
  for (const [key, color] of Object.entries(companyColors)) {
    if (normalized.includes(key.toLowerCase())) return color
  }
  const defaults = ['#7C3AED', '#2563EB', '#DB2777', '#0D9488', '#EA580C']
  return defaults[Math.abs(company.charCodeAt(0)) % defaults.length]
}
</script>
