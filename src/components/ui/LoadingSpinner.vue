<template>
  <div class="flex-1 flex items-center justify-center p-4">
    <div class="text-center max-w-sm w-full">
      <div
        class="inline-block h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"
      ></div>

      <div class="text-text-secondary text-sm sm:text-base mb-2">
        Loading portfolio data
      </div>

      <div class="mt-4 w-full bg-surface-overlay rounded-full h-1.5 overflow-hidden">
        <div class="bg-accent h-1.5 rounded-full progress-bar-animation"></div>
      </div>

      <div class="mt-4 flex justify-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style="animation-delay: 0ms"></div>
        <div class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style="animation-delay: 200ms"></div>
        <div class="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style="animation-delay: 400ms"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar-animation {
  width: 75%;
  position: relative;
  overflow: hidden;
  animation: progressGlow 2.5s ease-in-out infinite;
}

.progress-bar-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  bottom: 0;
  width: 50%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: progressSweep 2.5s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

@keyframes progressSweep {
  0% { left: -100%; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse {
    animation: none;
  }
  .progress-bar-animation {
    animation: none;
    width: 60%;
  }
  .progress-bar-animation::before {
    animation: none;
    opacity: 0;
  }
}
</style>
