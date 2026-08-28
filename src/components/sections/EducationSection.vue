<template>
  <section
    id="education"
    class="py-20 bg-surface scroll-mt-16"
  >
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-16 animate-fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-4">
          {{ $t('education.title') }}
        </h2>
        <div class="w-12 h-0.5 bg-accent"></div>
      </div>

      <!-- Education Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(edu, index) in education"
          :key="index"
          class="bg-surface-raised border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-200 group"
        >
          <!-- Institution Name -->
          <h3 class="text-lg font-semibold text-text-primary mb-2 leading-snug">
            {{ edu.institution }}
          </h3>

          <!-- Degree + Field -->
          <div class="mb-3">
            <span class="text-accent text-sm font-medium">{{ edu.degree }}</span>
            <span class="text-text-muted mx-1.5">&mdash;</span>
            <span class="text-text-secondary text-sm">{{ edu.field }}</span>
          </div>

          <!-- Duration -->
          <p class="text-text-muted text-sm mb-2">
            {{ edu.duration }}
          </p>

          <!-- GPA (if present) -->
          <div v-if="edu.gpa" class="flex items-center gap-2">
            <span class="text-xs text-text-muted uppercase tracking-wider">GPA</span>
            <span class="text-sm text-text-primary font-medium">{{ edu.gpa }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const education = computed(() => portfolio.value?.education || [])
</script>
