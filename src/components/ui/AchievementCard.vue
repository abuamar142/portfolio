<template>
  <div
    class="bg-surface-raised border border-border rounded-xl p-6 group hover:border-accent/30 transition-all duration-200"
  >
    <!-- Category Badge -->
    <div class="flex justify-between items-start mb-3">
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
        :class="categoryColors[achievement.type]"
      >
        {{ $t(`achievements.categories.${achievement.type}`) }}
      </span>
      <span class="text-xs text-text-muted">
        {{ formatDate(achievement.date) }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-base font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">
      {{ achievement.title }}
    </h3>

    <!-- Organizer -->
    <p class="text-sm text-accent mb-3">
      {{ achievement.organizer }}
    </p>

    <!-- Description & Certificate Number -->
    <div class="mb-4">
      <p
        v-if="achievement.description"
        class="text-text-secondary text-sm mb-2 line-clamp-3 leading-relaxed"
      >
        {{ achievement.description }}
      </p>
      <p v-if="achievement.certificate_number" class="text-xs text-text-muted">
        Certificate: {{ achievement.certificate_number }}
      </p>
      <p v-if="achievement.participant_as" class="text-xs text-text-muted">
        As: {{ achievement.participant_as }}
      </p>
      <p v-if="achievement.valid_until" class="text-xs text-accent mt-1">
        Valid until: {{ formatDate(achievement.valid_until) }}
      </p>
    </div>

    <!-- Evidence Button -->
    <div class="flex justify-end" v-if="achievement.drive_file_id">
      <button
        @click="openEvidence"
        class="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors duration-200"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {{ $t('achievements.buttons.evidence') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '@/types/portfolio'

interface Props {
  achievement: Achievement
}

const props = defineProps<Props>()

const categoryColors: Record<string, string> = {
  certificate: 'bg-success/10 text-success border-success/20',
  certification: 'bg-accent-subtle text-accent border-accent/20',
  webinar: 'bg-surface-overlay text-text-secondary border-border',
  seminar: 'bg-surface-overlay text-text-secondary border-border',
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  })
}

const openEvidence = () => {
  if (props.achievement.drive_file_id) {
    const url = `https://drive.google.com/file/d/${props.achievement.drive_file_id}/view`
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
