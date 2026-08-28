<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm w-full">
      <div class="mb-4">
        <div
          :class="[
            'inline-block animate-spin rounded-full border-4 border-solid border-accent border-r-transparent',
            spinnerSizeClass,
            'motion-reduce:animate-[spin_1.5s_linear_infinite]',
          ]"
        ></div>
      </div>

      <div class="text-text-secondary mb-4" :class="textSizeClass">
        Loading...
      </div>

      <div class="text-text-muted" :class="subtextSizeClass">
        {{ subMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  subMessage?: string
  variableName?: string
  functionName?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  subMessage: 'Loading portfolio data',
  variableName: 'portfolio',
  functionName: 'fetchData',
})

const spinnerSizeClass = computed(() => {
  const sizes = {
    sm: 'h-6 w-6 sm:h-8 sm:w-8',
    md: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12',
    lg: 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16',
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const sizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  }
  return sizes[props.size]
})

const subtextSizeClass = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
  }
  return sizes[props.size]
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .animate-spin {
    animation: none;
  }
}
</style>
