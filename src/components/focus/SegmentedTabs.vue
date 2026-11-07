<template>
  <div role="group" :aria-label="legend" class="flex flex-wrap">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="seg"
      :class="{ 'is-active': option.value === modelValue }"
      :aria-pressed="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Segmented control in the site's `seg` style.
 *
 * Values stay plain strings: callers own the union and validate it before use,
 * which is the same rule the `?mode=` query follows. A generic parameter here
 * would only move that check into the template layer.
 */
defineProps<{
  options: { value: string; label: string }[]
  modelValue: string
  legend: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.seg {
  min-width: 5rem;
  border: 1px solid var(--color-base-300);
  background: var(--color-base-200);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-ink-3);
  cursor: pointer;
}

.seg + .seg {
  border-left: 0;
}

.seg:hover {
  color: var(--color-base-content);
}

.seg.is-active {
  background: var(--color-base-content);
  color: var(--color-base-200);
}

.seg:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
