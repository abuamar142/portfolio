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

      <!-- A contribution explains what was shipped, so it keeps its links and
           gets more room than a certificate line. -->
      <p
        v-if="achievement.description"
        class="mt-3 text-sm text-ink-2"
        :class="isContribution ? 'line-clamp-none' : 'line-clamp-3'"
      >
        <template v-for="(segment, index) in descriptionSegments" :key="index">
          <a
            v-if="segment.type === 'link'"
            :href="safeHref(segment.value)"
            target="_blank"
            rel="noopener noreferrer"
            class="break-all text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
          >{{ segment.value }}</a>
          <template v-else>{{ segment.value }}</template>
        </template>
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

    <div v-if="achievement.file_key" class="figure-block-foot">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowUpRight } from 'lucide-vue-next'
import type { Achievement } from '@/types/portfolio'
import { achievementEvidenceUrl } from '@/services/achievement'
import { linkify } from '@/lib/linkify'
import { safeHref } from '@/lib/safeHref'
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  achievement: Achievement
}

const props = defineProps<Props>()

const { locale } = useI18n()

/**
 * Descriptions are plain text, but a contribution is only useful when its PR
 * and release can be opened. Splitting into segments keeps v-html out of the
 * picture; the anchor href still goes through safeHref.
 */
const descriptionSegments = computed(() => linkify(props.achievement.description ?? ''))

const isContribution = computed(() => props.achievement.type === 'contribution')

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const dateLocale = locale.value === 'en' ? 'en-US' : 'id-ID'
    return date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long' })
  } catch {
    return dateString
  }
}

const openEvidence = () => {
  const url = achievementEvidenceUrl(props.achievement)
  // noopener: the opened document must not get a handle on this tab.
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}
</script>
