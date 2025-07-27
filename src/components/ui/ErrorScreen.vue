<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background">
    <div class="text-center max-w-md mx-auto px-6">
      <!-- Error Icon with animation -->
      <div class="mb-6">
        <div
          class="w-20 h-20 mx-auto bg-dracula-red/20 rounded-full flex items-center justify-center animate-pulse"
        >
          <div class="relative">
            <svg
              class="w-10 h-10 text-dracula-red animate-shake"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z"
              />
            </svg>
            <!-- Error pulse rings -->
            <div
              class="absolute inset-0 rounded-full border-2 border-dracula-red animate-ping opacity-20"
            ></div>
            <div
              class="absolute inset-2 rounded-full border border-dracula-red animate-ping opacity-10"
              style="animation-delay: 0.5s"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error Content -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-dracula-red font-mono">
          {{ title }}
        </h2>

        <div class="text-dracula-comment">
          <p class="mb-2">{{ message }}</p>
          <details v-if="details" class="text-sm">
            <summary class="cursor-pointer hover:text-dracula-foreground transition-colors">
              Show Details
            </summary>
            <pre class="mt-2 p-3 bg-dracula-selection rounded text-left text-xs overflow-auto">{{
              details
            }}</pre>
          </details>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            @click="$emit('retry')"
            class="px-6 py-3 bg-dracula-purple text-white rounded-lg hover:bg-dracula-purple/80 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>

          <button
            v-if="showRefresh"
            @click="refreshPage"
            class="px-6 py-3 bg-dracula-comment text-white rounded-lg hover:bg-dracula-comment/80 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Page
          </button>
        </div>
      </div>

      <!-- Decorative elements -->
      <div
        class="absolute top-4 left-4 w-2 h-2 bg-dracula-red rounded-full animate-ping opacity-30"
      ></div>
      <div
        class="absolute top-8 right-6 w-1 h-1 bg-dracula-red rounded-full animate-ping opacity-20"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-6 left-8 w-1.5 h-1.5 bg-dracula-red rounded-full animate-ping opacity-25"
        style="animation-delay: 2s"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  details?: string
  showRefresh?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Failed to Load Portfolio',
  message: 'Something went wrong while loading the portfolio data. Please try again.',
  showRefresh: true,
})

defineEmits<{
  retry: []
}>()

const refreshPage = () => {
  window.location.reload()
}
</script>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

.animate-shake {
  animation: shake 2s ease-in-out infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
