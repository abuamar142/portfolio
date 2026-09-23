<template>
  <article class="figure-block flex flex-col">
    <div class="figure-block-head">
      <span class="label">{{ $t('achievements.categories.' + achievement.type) }}</span>
      <p class="data">{{ formatDate(achievement.date) }}</p>
    </div>

    <div class="figure-block-body flex flex-1 flex-col">
      <h3 class="heading-sm">{{ achievement.title }}</h3>

      <p class="mt-2 font-serif text-[0.9375rem] leading-snug text-ink-3">
        {{ achievement.organizer }}
      </p>

      <p v-if="achievement.description" class="mt-3 line-clamp-3 text-sm text-ink-2">
        {{ achievement.description }}
      </p>

      <div
        v-if="achievement.certificate_number || achievement.participant_as || achievement.valid_until"
        class="mt-4 space-y-1.5"
      >
        <p v-if="achievement.certificate_number" class="data">
          {{ achievement.certificate_number }}
        </p>
        <p v-if="achievement.participant_as" class="label">
          {{ achievement.participant_as }}
        </p>
        <p v-if="achievement.valid_until" class="data">
          {{ formatDate(achievement.valid_until) }}
        </p>
      </div>
    </div>

    <div v-if="achievement.drive_file_id" class="figure-block-foot">
      <div class="flex justify-end">
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
