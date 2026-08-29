<template>
  <div class="min-h-screen" style="background: var(--color-bg)">
    <!-- Hero Skeleton -->
    <div class="border-b" style="border-color: var(--color-border)">
      <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-12 md:py-20">
        <div class="grid lg:grid-cols-[1.4fr_0.85fr] gap-10">
          <div class="space-y-4">
            <div class="h-3 rounded w-40 animate-pulse" style="background: var(--color-surface-raised)"></div>
            <div class="h-10 md:h-12 rounded w-3/4 animate-pulse" style="background: var(--color-surface-raised)"></div>
            <div class="h-4 rounded w-1/2 animate-pulse" style="background: var(--color-surface-raised)"></div>
            <div class="h-4 rounded w-full max-w-[520px] animate-pulse" style="background: var(--color-surface-raised)"></div>
            <div class="flex gap-3 mt-6">
              <div class="h-10 w-32 rounded-lg animate-pulse" style="background: var(--color-surface-raised)"></div>
              <div class="h-10 w-32 rounded-lg animate-pulse" style="background: var(--color-surface-raised)"></div>
            </div>
          </div>
          <div class="rounded-xl border p-5 h-64 animate-pulse" style="background: var(--color-surface); border-color: var(--color-border)"></div>
        </div>
      </div>
    </div>
    <!-- Sections skeleton -->
    <div v-for="section in 3" :key="section" class="py-16 md:py-20 border-b" style="border-color: var(--color-border)">
      <div class="max-w-[1280px] mx-auto px-6 md:px-8">
        <div class="mb-10">
          <div class="h-3 rounded w-24 animate-pulse mb-3" style="background: var(--color-surface-raised)"></div>
          <div class="h-6 rounded w-48 animate-pulse" style="background: var(--color-surface-raised)"></div>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="h-48 rounded-xl border animate-pulse" style="background: var(--color-surface); border-color: var(--color-border)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
