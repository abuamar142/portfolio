<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700"
  >
    <!-- Category Badge -->
    <div class="flex justify-between items-start mb-3">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="categoryColors[achievement.category]"
      >
        {{ categoryLabels[achievement.category] }}
      </span>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(achievement.date) }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {{ achievement.title }}
    </h3>

    <!-- Issuer -->
    <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
      {{ achievement.issuer }}
    </p>

    <!-- Description -->
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
      {{ achievement.description }}
    </p>

    <!-- Evidence Button -->
    <div class="flex justify-end" v-if="achievement.evidenceId">
      <BaseButton
        variant="outline"
        size="sm"
        @click="openEvidence"
        class="inline-flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          ></path>
        </svg>
        Lihat Evidence
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '@/types/portfolio'
import BaseButton from './BaseButton.vue'

interface Props {
  achievement: Achievement
}

const props = defineProps<Props>()

const categoryColors = {
  sertifikat: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  sertifikasi: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  kepanitiaan: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  penghargaan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
}

const categoryLabels = {
  sertifikat: 'Sertifikat',
  sertifikasi: 'Sertifikasi',
  kepanitiaan: 'Kepanitiaan',
  penghargaan: 'Penghargaan',
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  })
}

const openEvidence = () => {
  if (props.achievement.evidenceId) {
    const url = `https://drive.google.com/file/d/${props.achievement.evidenceId}/view`
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
