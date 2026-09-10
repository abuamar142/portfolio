<template>
  <header class="mb-10 md:mb-14">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div class="min-w-0">
        <p class="eyebrow">
          <span v-if="index" class="text-ink-4">{{ index }}</span>
          <span v-if="index" aria-hidden="true" class="mx-2 text-ink-4">/</span>
          <span>{{ label }}</span>
        </p>
        <component :is="level" class="display-2 mt-4 text-base-content">{{ title }}</component>
      </div>
      <div v-if="$slots.meta" class="shrink-0 pb-1">
        <slot name="meta" />
      </div>
    </div>
    <p v-if="lead" class="lead mt-4">{{ lead }}</p>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Section number, e.g. "01". */
    index?: string
    /** Eyebrow label (already translated). */
    label: string
    /** Display title (already translated). */
    title: string
    /** Optional supporting sentence. */
    lead?: string
    /**
     * Heading level. In-page sections stay at h2 (the page keeps a single h1);
     * standalone pages pass "h1" to own the document outline.
     */
    level?: 'h1' | 'h2'
  }>(),
  { level: 'h2' },
)
</script>
