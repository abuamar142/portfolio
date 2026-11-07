<template>
  <div
    class="relative grid place-items-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      class="absolute inset-0 size-full -rotate-90"
      :viewBox="`0 0 ${size} ${size}`"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        class="text-base-300"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="toneColor"
        :stroke-width="strokeWidth"
        stroke-linecap="butt"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        class="transition-[stroke-dashoffset] duration-200 ease-linear"
      />
    </svg>
    <div class="relative grid place-items-center px-6 text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Elapsed fraction, 0..1. */
    progress: number
    size?: number
    strokeWidth?: number
    tone?: 'focus' | 'break' | 'done'
  }>(),
  { size: 280, strokeWidth: 6, tone: 'focus' },
)

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const offset = computed(() => {
  const clamped = Math.min(1, Math.max(0, props.progress))
  return circumference.value * (1 - clamped)
})

const toneColor = computed(() => {
  if (props.tone === 'break') return 'var(--color-success)'
  if (props.tone === 'done') return 'var(--color-voltage-ink)'
  return 'var(--color-primary)'
})
</script>
