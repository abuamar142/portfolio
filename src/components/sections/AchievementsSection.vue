<template>
  <section
    id="achievements"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 left-4 sm:left-16 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-16 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-24 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">class</code>
          <code class="text-dracula-cyan text-sm"> Achievement</code>
          <code class="text-dracula-foreground text-sm"> {</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-24 animate-float" style="animation-delay: 1.2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">String</code>
          <code class="text-dracula-cyan text-sm"> type</code>
          <code class="text-dracula-foreground text-sm"> = </code>
          <code class="text-dracula-green text-sm"
            >'{{ $t('achievements.categories.certification').toLowerCase() }}'</code
          >
          <code class="text-dracula-foreground text-sm">;</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('achievements.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('achievements.subtitle') }}
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-12 sm:mb-16 animate-slide-up delay-200">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border',
            activeFilter === 'all'
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple shadow-glow'
              : 'bg-dracula-selection text-dracula-comment border-gray-500 hover:border-dracula-purple/50 hover:text-dracula-purple',
          ]"
        >
          {{ $t('achievements.filters.all') }} ({{ achievements.length }})
        </button>
        <button
          v-for="category in categories"
          :key="category.key"
          @click="activeFilter = category.key"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-300 border',
            activeFilter === category.key
              ? 'bg-dracula-purple text-dracula-background border-dracula-purple shadow-glow'
              : 'bg-dracula-selection text-dracula-comment border-gray-500 hover:border-dracula-purple/50 hover:text-dracula-purple',
          ]"
        >
          {{ $t(`achievements.filters.${category.key}`) }} ({{ getCountByCategory(category.key) }})
        </button>
      </div>

      <!-- Achievements Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-up delay-300"
      >
        <AchievementCard
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredAchievements.length === 0" class="text-center py-12 animate-fade-in">
        <div class="text-dracula-comment mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <p class="text-dracula-comment font-mono">{{ $t('achievements.empty') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { portfolioData } from '@/data/portfolio'
import AchievementCard from '@/components/ui/AchievementCard.vue'

const achievements = portfolioData.achievements
const activeFilter = ref<string>('all')

const categories = [
  { key: 'certificate' },
  { key: 'certification' },
  { key: 'webinar' },
  { key: 'seminar' },
]

const filteredAchievements = computed(() => {
  if (activeFilter.value === 'all') {
    return achievements
  }
  return achievements.filter((achievement) => achievement.type === activeFilter.value)
})

const getCountByCategory = (category: string) => {
  return achievements.filter((achievement) => achievement.type === category).length
}
</script>
