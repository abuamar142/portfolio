<template>
  <div class="min-h-screen bg-surface">
    <!-- Hero Skeleton -->
    <div class="min-h-screen flex items-center px-6">
      <div class="max-w-5xl mx-auto w-full space-y-6">
        <div class="h-3 bg-surface-overlay rounded w-32 animate-pulse"></div>
        <div class="h-12 sm:h-14 bg-surface-overlay rounded-lg w-3/4 animate-pulse"></div>
        <div class="h-6 bg-surface-overlay rounded w-48 animate-pulse"></div>
        <div class="h-4 bg-surface-overlay rounded w-96 max-w-full animate-pulse"></div>
        <div class="flex gap-3 mt-8">
          <div class="h-10 w-32 bg-surface-overlay rounded-lg animate-pulse"></div>
          <div class="h-10 w-32 bg-surface-overlay rounded-lg animate-pulse"></div>
        </div>
        <div class="flex gap-5 mt-6">
          <div v-for="i in 4" :key="i" class="h-4 w-16 bg-surface-overlay rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Content Skeleton -->
    <div v-for="section in 4" :key="section" class="py-20">
      <div class="max-w-5xl mx-auto px-6">
        <div class="mb-16">
          <div class="h-8 bg-surface-overlay rounded w-48 animate-pulse"></div>
          <div class="w-12 h-0.5 bg-surface-overlay mt-4"></div>
        </div>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-4 bg-surface-overlay rounded animate-pulse" :style="{ width: `${70 + Math.random() * 30}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
