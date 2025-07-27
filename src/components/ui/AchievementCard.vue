<template>
  <div
    class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 group hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
  >
    <!-- Category Badge -->
    <div class="flex justify-between items-start mb-4">
      <span
        class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium font-mono border"
        :class="categoryColors[achievement.category]"
      >
        {{ categoryLabels[achievement.category] }}
      </span>
      <span class="text-sm text-dracula-comment font-mono">
        {{ formatDate(achievement.date) }}
      </span>
    </div>

    <!-- Title -->
    <h3
      class="text-xl font-bold text-dracula-foreground mb-3 group-hover:text-dracula-purple transition-colors duration-300 font-mono"
    >
      {{ achievement.title }}
    </h3>

    <!-- Issuer -->
    <p class="text-sm font-medium text-dracula-cyan mb-4 font-mono">
      {{ achievement.issuer }}
    </p>

    <!-- Description -->
    <p class="text-dracula-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
      {{ achievement.description }}
    </p>

    <!-- Evidence Button -->
    <div class="flex justify-end" v-if="achievement.evidenceId">
      <BaseButton
        variant="outline"
        size="sm"
        @click="openEvidence"
        class="inline-flex items-center gap-2 border-dracula-purple/30 text-dracula-purple hover:bg-dracula-purple hover:text-dracula-background transition-all duration-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          ></path>
        </svg>
        <span class="font-mono">Lihat Evidence</span>
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
  sertifikat: 'bg-dracula-green/20 text-dracula-green border-dracula-green/30',
  sertifikasi: 'bg-dracula-cyan/20 text-dracula-cyan border-dracula-cyan/30',
  kepanitiaan: 'bg-dracula-purple/20 text-dracula-purple border-dracula-purple/30',
  penghargaan: 'bg-dracula-yellow/20 text-dracula-yellow border-dracula-yellow/30',
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
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
