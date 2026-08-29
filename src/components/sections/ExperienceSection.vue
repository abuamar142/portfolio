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
            <!-- Company Logo -->
            <div class="w-10 h-10 rounded-lg bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0 text-text-muted text-xs font-medium">
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
              <p class="text-xs text-text-muted mb-3">
                {{ experience.company }}
              </p>

              <!-- Description -->
              <ul class="space-y-1.5 mb-3">
                <li
                  v-for="desc in experience.description"
                  :key="desc"
                  class="flex items-start gap-2 text-text-secondary text-xs leading-relaxed"
                >
                  <span class="text-text-muted mt-0.5">—</span>
                  <span>{{ desc }}</span>
                </li>
              </ul>

              <!-- Technologies -->
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tech in experience.technologies"
                  :key="tech"
                  class="px-2 py-0.5 bg-surface-overlay text-text-muted text-[10px] rounded font-mono"
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
</script>
