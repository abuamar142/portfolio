<template>
  <section id="achievements" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pencapaian & Aktivitas
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sertifikat, sertifikasi, kepanitiaan, dan penghargaan yang telah saya peroleh
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button
          @click="activeFilter = 'all'"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
        >
          Semua ({{ achievements.length }})
        </button>
        <button
          v-for="category in categories"
          :key="category.key"
          @click="activeFilter = category.key"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            activeFilter === category.key
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
          ]"
        >
          {{ category.label }} ({{ getCountByCategory(category.key) }})
        </button>
      </div>

      <!-- Achievements Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AchievementCard
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredAchievements.length === 0" class="text-center py-12">
        <div class="text-gray-400 dark:text-gray-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400">Tidak ada pencapaian dalam kategori ini</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Achievement } from '@/types/portfolio'
import { portfolioData } from '@/data/portfolio'
import AchievementCard from '@/components/ui/AchievementCard.vue'

const achievements = portfolioData.achievements
const activeFilter = ref<string>('all')

const categories = [
  { key: 'sertifikat', label: 'Sertifikat' },
  { key: 'sertifikasi', label: 'Sertifikasi' },
  { key: 'kepanitiaan', label: 'Kepanitiaan' },
  { key: 'penghargaan', label: 'Penghargaan' },
]

const filteredAchievements = computed(() => {
  if (activeFilter.value === 'all') {
    return achievements
  }
  return achievements.filter((achievement) => achievement.category === activeFilter.value)
})

const getCountByCategory = (category: string) => {
  return achievements.filter((achievement) => achievement.category === category).length
}
</script>
