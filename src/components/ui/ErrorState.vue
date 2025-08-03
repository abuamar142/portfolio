<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm sm:max-w-md w-full mx-auto">
      <!-- Error Icon -->
      <div class="text-4xl sm:text-5xl md:text-6xl text-dracula-red mb-3 sm:mb-4">⚠️</div>

      <!-- Error Title -->
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-dracula-red mb-2 sm:mb-3">
        Oops! Something went wrong
      </h2>

      <!-- Error Message -->
      <div class="text-dracula-foreground font-mono mb-4 sm:mb-6 text-sm sm:text-base">
        <div class="bg-dracula-selection rounded-lg p-3 sm:p-4 border border-dracula-red/20">
          <span class="text-dracula-red font-semibold">Error:</span>
          <div class="text-dracula-comment mt-1 text-left break-words">
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Retry Button -->
      <button
        @click="$emit('retry')"
        class="bg-dracula-purple hover:bg-dracula-purple/80 active:bg-dracula-purple/70 text-dracula-background px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto min-w-[120px] touch-manipulation"
      >
        <span class="flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Try Again
        </span>
      </button>

      <!-- Help Text -->
      <p class="mt-3 sm:mt-4 text-xs sm:text-sm text-dracula-comment">
        If the problem persists, please check your internet connection or try again later.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()

// Emit retry event to parent
defineEmits<{
  retry: []
}>()
</script>

<style scoped>
/* Enhance touch targets for mobile */
button {
  min-height: 44px; /* iOS recommended touch target size */
}

/* Ensure proper spacing on very small screens */
@media (max-width: 320px) {
  .font-mono {
    font-size: 0.75rem;
  }

  button {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

/* Better error message display on mobile */
@media (max-width: 480px) {
  .break-words {
    word-break: break-word;
    hyphens: auto;
  }
}
</style>
