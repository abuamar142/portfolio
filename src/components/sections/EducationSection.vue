<template>
  <section
    id="education"
    class="relative py-12 sm:py-16 lg:py-20 scroll-mt-16 sm:scroll-mt-18 lg:scroll-mt-20 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 left-4 sm:left-16 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-cyan/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-16 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-24 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">class</code>
          <code class="text-dracula-cyan text-sm"> Education</code>
          <code class="text-dracula-foreground text-sm"> {</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-24 animate-float" style="animation-delay: 1.2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">const</code>
          <code class="text-dracula-cyan text-sm"> degree</code>
          <code class="text-dracula-foreground text-sm"> = </code>
          <code class="text-dracula-green text-sm"
            >'{{ $t('education.labels.field').toLowerCase() }}'</code
          >
          <code class="text-dracula-foreground text-sm">;</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-cyan to-dracula-purple text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <GraduationCap class="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('education.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('education.subtitle') }}
        </p>
      </div>

      <!-- Education Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-up delay-300"
      >
        <div
          v-for="(edu, index) in education"
          :key="index"
          class="group relative bg-dracula-selection border border-gray-500 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-dracula-cyan/50 hover:shadow-lg hover:shadow-dracula-cyan/10 hover:-translate-y-1 animate-fade-in"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <!-- Card Accent Line -->
          <div
            class="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-dracula-cyan to-dracula-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- Institution Name -->
          <h3
            class="text-lg sm:text-xl font-bold text-dracula-foreground mb-3 font-mono leading-tight"
          >
            {{ edu.institution }}
          </h3>

          <!-- Degree + Field -->
          <div class="mb-4">
            <span class="text-dracula-cyan font-medium">{{ edu.degree }}</span>
            <span class="text-dracula-comment mx-2">&mdash;</span>
            <span class="text-dracula-pink font-medium">{{ edu.field }}</span>
          </div>

          <!-- Duration -->
          <div class="flex items-center gap-2 mb-3">
            <div
              class="w-2 h-2 rounded-full bg-dracula-green group-hover:animate-pulse"
            ></div>
            <span class="text-sm text-dracula-comment font-mono">
              {{ edu.duration }}
            </span>
          </div>

          <!-- GPA (if present) -->
          <div v-if="edu.gpa" class="flex items-center gap-2">
            <span class="text-xs text-dracula-purple font-mono uppercase tracking-wider">{{
              $t('education.labels.gpa')
            }}</span>
            <span class="text-sm text-dracula-foreground font-mono">{{ edu.gpa }}</span>
          </div>

          <!-- Hover Glow Effect -->
          <div
            class="absolute inset-0 rounded-xl bg-gradient-to-br from-dracula-cyan/5 to-dracula-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GraduationCap } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const education = computed(() => portfolio.value?.education || [])
</script>
