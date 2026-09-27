<template>
  <span class="chip" :class="{ 'chip-accent': accent }">#{{ tag }}</span>
</template>

<script setup lang="ts">
/**
 * The one owner of the tag look: the design-system `.chip` token with the
 * `#` prefix, wherever tags are rendered (cards, modals, detail pages).
 * `accent` is the existing `chip-accent` token variant — not a new style.
 */
defineProps<{ tag: string; accent?: boolean }>()
</script>
