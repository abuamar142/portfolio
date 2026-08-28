<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm w-full mx-auto">
      <div class="text-error text-5xl mb-4">!</div>

      <h2 class="text-xl font-semibold text-text-primary mb-2">
        Oops! Something went wrong
      </h2>

      <div class="text-sm mb-6">
        <div class="bg-surface-raised rounded-lg p-3 border border-error/20">
          <span class="text-error font-medium">Error:</span>
          <div class="text-text-muted mt-1 text-left break-words">
            {{ message }}
          </div>
        </div>
      </div>

      <button
        @click="$emit('retry')"
        class="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm w-full min-h-[44px]"
      >
        <span class="flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </span>
      </button>

      <p class="mt-4 text-xs text-text-muted">
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

defineEmits<{
  retry: []
}>()
</script>
