<template>
  <article class="panel flex flex-col p-5 transition-colors hover:border-primary/40">
    <div class="flex items-start justify-between gap-3">
      <span class="chip">{{ $t('achievements.categories.' + achievement.type) }}</span>
      <p class="shrink-0 font-mono text-[11px] leading-none text-ink-4">
        {{ formatDate(achievement.date) }}
      </p>
    </div>

    <h3 class="mt-4 text-[15px] font-medium leading-snug text-base-content">
      {{ achievement.title }}
    </h3>

    <p class="mt-1 text-sm text-ink-3">{{ achievement.organizer }}</p>

    <p v-if="achievement.description" class="mt-3 line-clamp-3 text-sm text-ink-2">
      {{ achievement.description }}
    </p>

    <div
      v-if="achievement.certificate_number || achievement.participant_as || achievement.valid_until"
      class="mt-3 space-y-1 font-mono text-[11px] leading-relaxed text-ink-4"
    >
      <p v-if="achievement.certificate_number">{{ achievement.certificate_number }}</p>
      <p v-if="achievement.participant_as">{{ achievement.participant_as }}</p>
      <p v-if="achievement.valid_until">{{ formatDate(achievement.valid_until) }}</p>
    </div>

    <div v-if="achievement.drive_file_id" class="mt-auto pt-4">
      <div class="flex justify-end border-t border-base-300 pt-3">
        <BaseButton
          variant="ghost"
          size="sm"
          class="min-h-11"
          :icon-right="ArrowUpRight"
          @click="openEvidence"
        >
          {{ $t('achievements.buttons.evidence') }}
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { Achievement } from '@/types/portfolio'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  achievement: Achievement
}

const props = defineProps<Props>()

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
