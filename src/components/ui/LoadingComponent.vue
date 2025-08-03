<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm w-full">
      <!-- Loading Spinner -->
      <div class="mb-4">
        <div
          :class="[
            'inline-block animate-spin rounded-full border-4 border-solid border-dracula-purple border-r-transparent',
            spinnerSizeClass,
            'motion-reduce:animate-[spin_1.5s_linear_infinite]',
          ]"
        ></div>
      </div>

      <!-- Loading Text with Typing Animation -->
      <div class="text-dracula-foreground font-mono leading-relaxed mb-4" :class="textSizeClass">
        <span class="text-dracula-green">const</span>
        <span class="text-dracula-cyan ml-1 sm:ml-2">{{ variableName }}</span>
        <span class="text-dracula-foreground ml-0.5 sm:ml-1">=</span>
        <span class="text-dracula-orange ml-1 sm:ml-2">await</span>
        <span class="text-dracula-yellow ml-1 sm:ml-2">{{ functionName }}</span>
        <span class="text-dracula-foreground">()</span>
        <span class="animate-pulse text-dracula-purple ml-0.5 sm:ml-1">...</span>
      </div>

      <!-- Progress Indicator -->
      <div class="text-dracula-comment" :class="subtextSizeClass">
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

// Responsive size classes
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
    md: 'text-sm sm:text-base md:text-lg',
    lg: 'text-base sm:text-lg md:text-xl',
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
/* Custom animations for better mobile performance */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .animate-spin {
    animation: none;
  }
}

/* Ensure proper spacing on very small screens */
@media (max-width: 320px) {
  .font-mono {
    font-size: 0.75rem;
  }
}
</style>
