<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm w-full">
      <!-- Loading Spinner -->
      <div
        class="inline-block h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin rounded-full border-4 border-solid border-dracula-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-3 sm:mb-4"
      ></div>

      <!-- Loading Text with Typing Animation -->
      <div
        class="text-dracula-foreground font-mono text-sm sm:text-base md:text-lg leading-relaxed"
      >
        <span class="text-dracula-green">const</span>
        <span class="text-dracula-cyan ml-1 sm:ml-2">portfolio</span>
        <span class="text-dracula-foreground ml-0.5 sm:ml-1">=</span>
        <span class="text-dracula-orange ml-1 sm:ml-2">await</span>
        <span class="text-dracula-yellow ml-1 sm:ml-2">fetchData</span>
        <span class="text-dracula-foreground">()</span>
        <span class="animate-pulse text-dracula-purple ml-0.5 sm:ml-1">...</span>
      </div>

      <!-- Progress Indicator -->
      <div class="mt-3 sm:mt-4 text-xs sm:text-sm text-dracula-comment">Loading portfolio data</div>

      <!-- Progress Bar (Optional) -->
      <div
        class="mt-4 sm:mt-6 w-full bg-dracula-selection rounded-full h-1.5 sm:h-2 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-dracula-purple via-dracula-pink to-dracula-purple h-1.5 sm:h-2 rounded-full progress-bar-animation"
        ></div>
      </div>

      <!-- Loading dots animation -->
      <div class="mt-3 sm:mt-4 flex justify-center space-x-1">
        <div
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dracula-purple rounded-full animate-bounce"
          style="animation-delay: 0ms"
        ></div>
        <div
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dracula-purple rounded-full animate-bounce"
          style="animation-delay: 150ms"
        ></div>
        <div
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dracula-purple rounded-full animate-bounce"
          style="animation-delay: 300ms"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for now, but can be extended later
// interface Props {
//   message?: string
//   showProgressBar?: boolean
// }

// const props = withDefaults(defineProps<Props>(), {
//   message: 'Loading portfolio data',
//   showProgressBar: true
// })
</script>

<style scoped>
/* Progress bar animation */
.progress-bar-animation {
  width: 75%;
  position: relative;
  overflow: hidden;
  animation: progressGlowSpinner 2.5s ease-in-out infinite;
}

.progress-bar-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  bottom: 0;
  width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: progressSweepSpinner 2.5s ease-in-out infinite;
}

.progress-bar-animation::after {
  content: '';
  position: absolute;
  top: 0;
  left: -30%;
  bottom: 0;
  width: 30%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressTrailSpinner 2.5s ease-in-out infinite 0.3s;
}

@keyframes progressGlowSpinner {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(189, 147, 249, 0.3);
    opacity: 0.9;
  }
  50% {
    box-shadow: 0 0 8px rgba(189, 147, 249, 0.6);
    opacity: 1;
  }
}

@keyframes progressSweepSpinner {
  0% {
    left: -100%;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes progressTrailSpinner {
  0% {
    left: -30%;
    opacity: 0;
  }
  30% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.8;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

/* Custom animations for better mobile performance */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }
  .animate-bounce {
    animation: none;
  }
  .animate-pulse {
    animation: none;
  }
  .progress-bar-animation {
    animation: none;
    width: 60%;
  }
  .progress-bar-animation::before,
  .progress-bar-animation::after {
    animation: none;
    opacity: 0;
  }
}

/* Ensure proper spacing on very small screens */
@media (max-width: 320px) {
  .font-mono {
    font-size: 0.75rem;
  }
}
</style>
