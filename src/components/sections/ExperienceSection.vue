<template>
  <section
    id="experiences"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('experience.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-[7px] top-2 bottom-2 w-px bg-border"></div>

        <div class="space-y-10">
          <div
            v-for="(experience, index) in portfolio?.experiences"
            :key="index"
            class="relative pl-10 group"
          >
            <!-- Timeline Dot -->
            <div class="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-border bg-surface group-hover:border-accent transition-colors duration-200"></div>

            <!-- Content -->
            <div class="group-hover:translate-x-1 transition-transform duration-200">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-text-primary leading-snug">
                    {{ experience.position }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-accent text-sm font-medium">{{ experience.company }}</span>
                    <span class="text-text-muted text-xs">&middot;</span>
                    <span class="text-text-muted text-sm">{{ experience.duration }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <ul class="mt-4 space-y-2">
                <li
                  v-for="desc in experience.description"
                  :key="desc"
                  class="flex items-start gap-2.5 text-text-secondary text-sm leading-relaxed"
                >
                  <span class="text-text-muted mt-1.5 flex-shrink-0">&ndash;</span>
                  <span>{{ desc }}</span>
                </li>
              </ul>

              <!-- Technologies -->
              <div class="flex flex-wrap gap-2 mt-4">
                <span
                  v-for="tech in experience.technologies"
                  :key="tech"
                  class="px-2.5 py-1 bg-accent-subtle text-accent text-xs rounded-md font-medium"
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
</script>
