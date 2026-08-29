<template>
  <div
    class="rounded-xl border p-5 md:p-6 group transition-colors hover:brightness-[1.02]"
    style="background: var(--color-surface); border-color: var(--color-border)"
  >
    <div class="flex justify-between items-start gap-3 mb-3">
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wide border"
        :style="categoryStyle"
      >
        {{ $t(`achievements.categories.${achievement.type}`) }}
      </span>
      <span class="text-xs font-mono shrink-0" style="color: var(--color-text-faint)">
        {{ formatDate(achievement.date) }}
      </span>
    </div>

    <h3 class="text-sm font-medium leading-snug" style="color: var(--color-text-primary)">
      {{ achievement.title }}
    </h3>

    <p class="text-xs font-medium mt-1.5" style="color: var(--color-text-muted)">
      {{ achievement.organizer }}
    </p>

    <div class="mt-3 space-y-1.5">
      <p v-if="achievement.description" class="text-xs leading-relaxed line-clamp-3" style="color: var(--color-text-secondary)">
        {{ achievement.description }}
      </p>
      <p v-if="achievement.certificate_number" class="text-[11px] font-mono" style="color: var(--color-text-faint)">
        Certificate: {{ achievement.certificate_number }}
      </p>
      <p v-if="achievement.participant_as" class="text-[11px] font-mono" style="color: var(--color-text-faint)">
        As: {{ achievement.participant_as }}
      </p>
      <p v-if="achievement.valid_until" class="text-[11px] font-mono" style="color: var(--color-text-muted)">
        Valid until: {{ formatDate(achievement.valid_until) }}
      </p>
    </div>

    <div class="flex justify-end mt-4 pt-4 border-t" style="border-color: var(--color-border)" v-if="achievement.drive_file_id">
      <button
        @click="openEvidence"
        class="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
        style="color: var(--color-text-muted)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        {{ $t('achievements.buttons.evidence') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Achievement } from '@/types/portfolio'

interface Props {
  achievement: Achievement
}

const props = defineProps<Props>()

const categoryStyle = computed(() => {
  const map: Record<string, string> = {
    certificate: 'background: var(--color-surface-raised); color: var(--color-text-secondary); border-color: var(--color-border)',
    certification: 'background: var(--color-accent-subtle); color: var(--color-accent-hover); border-color: rgba(99,102,241,0.2)',
    webinar: 'background: var(--color-surface-raised); color: var(--color-text-muted); border-color: var(--color-border)',
    seminar: 'background: var(--color-surface-raised); color: var(--color-text-muted); border-color: var(--color-border)',
  }
  return map[props.achievement.type] || map.webinar
})

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  } catch {
    return dateString
  }
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
