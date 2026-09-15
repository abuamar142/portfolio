<template>
  <header class="mb-10 max-w-3xl md:mb-14">
    <component :is="level" class="display-2 text-balance text-base-content">{{ title }}</component>
    <p v-if="lead" class="lead mt-4">{{ lead }}</p>
    <div v-if="$slots.meta" class="mt-4">
      <slot name="meta" />
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
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
  }>(),
  { level: 'h2' },
)
</script>
