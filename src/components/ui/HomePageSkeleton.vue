<template>
  <div class="min-h-screen bg-dracula-background">
    <!-- Hero Skeleton -->
    <div class="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div class="text-center max-w-4xl mx-auto space-y-6">
        <div class="h-4 bg-gray-600 rounded-full w-48 mx-auto animate-pulse"></div>
        <div class="h-12 sm:h-16 bg-gray-600 rounded w-3/4 mx-auto animate-pulse"></div>
        <div class="h-6 bg-gray-600 rounded w-1/2 mx-auto animate-pulse"></div>
        <div class="flex justify-center gap-4 mt-8">
          <div class="h-10 w-36 bg-gray-600 rounded-lg animate-pulse"></div>
          <div class="h-10 w-36 bg-gray-600 rounded-lg animate-pulse"></div>
        </div>
        <div class="flex justify-center gap-3 mt-6">
          <div v-for="i in 5" :key="i" class="h-8 w-20 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- About Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div class="h-4 bg-gray-600 rounded w-96 max-w-full mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div v-for="i in 3" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 text-center">
            <div class="h-8 bg-gray-600 rounded w-16 mx-auto mb-2 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="space-y-8 max-w-3xl mx-auto">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <div class="w-3 h-3 bg-gray-600 rounded-full mt-2 animate-pulse shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-5 bg-gray-600 rounded w-1/3 animate-pulse"></div>
              <div class="h-4 bg-gray-600 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-gray-600 rounded w-1/5 animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-600 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-600 rounded w-5/6 animate-pulse"></div>
              </div>
              <div class="flex gap-2">
                <div v-for="j in 4" :key="j" class="h-6 w-16 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Education Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 space-y-3">
            <div class="h-5 bg-gray-600 rounded w-2/3 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 space-y-3">
            <div class="h-5 bg-gray-600 rounded w-2/3 animate-pulse"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-600 rounded animate-pulse"></div>
              <div class="h-3 bg-gray-600 rounded w-4/5 animate-pulse"></div>
            </div>
            <div class="flex gap-2">
              <div v-for="j in 3" :key="j" class="h-6 w-16 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 space-y-4">
            <div class="h-5 bg-gray-600 rounded w-1/2 animate-pulse"></div>
            <div v-for="j in 4" :key="j" class="space-y-2">
              <div class="h-3 bg-gray-600 rounded w-2/3 animate-pulse"></div>
              <div class="h-2 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievements Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="flex justify-center gap-3 mb-8">
          <div v-for="i in 5" :key="i" class="h-8 w-24 bg-gray-600 rounded-full animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 space-y-3">
            <div class="h-5 bg-gray-600 rounded w-2/3 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/4 animate-pulse"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-600 rounded animate-pulse"></div>
              <div class="h-3 bg-gray-600 rounded w-4/5 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Skeleton -->
    <div class="py-12 sm:py-16 lg:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12 sm:mb-16">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-full mx-auto mb-6 animate-pulse"></div>
          <div class="h-10 bg-gray-600 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div v-for="i in 3" :key="i" class="bg-dracula-selection border border-gray-500 rounded-lg p-6 space-y-3">
            <div class="h-10 w-10 bg-gray-600 rounded-lg animate-pulse"></div>
            <div class="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
            <div class="h-3 bg-gray-600 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-8">
          <div v-for="i in 4" :key="i" class="h-10 w-10 bg-gray-600 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>
