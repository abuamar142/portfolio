<template>
  <article
    class="row grid gap-4 py-7 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)] md:gap-8 md:py-8"
  >
    <div class="row-place">
      <p>{{ experience.duration }}</p>
      <p class="mt-1">{{ experience.company }}</p>
    </div>

    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="row-title">{{ experience.position }}</h3>
        <span v-if="employmentType" class="chip chip-accent">
          {{ employmentType }}
        </span>
      </div>

      <ul class="mt-3 space-y-2">
        <li
          v-for="desc in experience.description"
          :key="desc"
          class="flex gap-2.5 text-sm leading-relaxed text-ink-2"
        >
          <span
            class="mt-2 size-[3px] shrink-0 bg-voltage"
            aria-hidden="true"
          ></span>
          <span>{{ desc }}</span>
        </li>
      </ul>

      <ul v-if="experience.technologies?.length" class="mt-4 flex flex-wrap gap-1.5">
        <li v-for="tech in experience.technologies" :key="tech" class="chip">
          {{ tech }}
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Experience } from '@/types/portfolio'

const props = defineProps<{
  experience: Experience
}>()

const { t, te } = useI18n()

/**
 * Employment-type badge. The data layer has no contract field for this, so the
 * badge only renders when a matching locale key exists; otherwise the row stays
 * badge-free rather than inventing a label.
 */
const employmentType = computed(() => {
  const key = `experience.types.${props.experience.company}`
  return te(key) ? t(key) : null
})
</script>
