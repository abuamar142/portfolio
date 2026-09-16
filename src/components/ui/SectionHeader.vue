<template>
  <header class="mb-10 max-w-3xl md:mb-14" :class="align === 'center' ? 'mx-auto text-center' : ''">
    <component :is="level" class="display-2 text-balance text-base-content">{{ title }}</component>
    <p v-if="lead" class="lead mt-4" :class="align === 'center' ? 'mx-auto text-center' : ''">{{ lead }}</p>
    <div v-if="$slots.meta" class="mt-4" :class="align === 'center' ? 'flex justify-center' : ''">
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
    /** Centered variant for hero-adjacent sections (projects, contact). */
    align?: 'left' | 'center'
  }>(),
  { level: 'h2', align: 'left' },
)
</script>
