<template>
  <header class="mb-10 max-w-3xl md:mb-12" :class="align === 'center' ? 'mx-auto text-center' : ''">
    <div
      v-if="headText"
      class="section-head"
      :class="align === 'center' ? 'justify-center pt-0' : ''"
    >
      <span v-if="align !== 'center'" class="marker-sm" aria-hidden="true"></span>
      <span class="label">{{ headText }}</span>
      <span v-if="align !== 'center'" class="section-head-rule" aria-hidden="true"></span>
    </div>

    <component :is="level" class="display-2 mt-4 text-balance text-base-content">{{
      title
    }}</component>

    <p v-if="lead" class="lead mt-4" :class="align === 'center' ? 'mx-auto' : ''">{{ lead }}</p>

    <div v-if="$slots.meta" class="mt-5" :class="align === 'center' ? 'flex justify-center' : ''">
      <slot name="meta" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Display title (already translated). */
    title: string
    /** Optional supporting sentence. */
    lead?: string
    /**
     * Heading level. In-page sections stay at h2 (the page keeps a single h1);
     * standalone pages pass "h1" to own the document outline.
     */
    level?: 'h1' | 'h2'
    /** Left is the dossier default; center only for hero-adjacent moments. */
    align?: 'left' | 'center'
    /** Dossier section number, e.g. "03". */
    index?: string
    /** Section name for the numbered rail (already translated). */
    kicker?: string
  }>(),
  { level: 'h2', align: 'left' },
)

const headText = computed(() =>
  [props.index, props.kicker].filter(Boolean).join(' / '),
)
</script>
