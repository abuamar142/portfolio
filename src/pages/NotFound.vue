<template>
  <section class="min-h-screen flex items-center justify-center px-6 py-16" style="background: var(--color-bg)">
    <div class="max-w-[1280px] w-full">
      <div class="max-w-[560px]">
        <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-6" style="color: var(--color-text-faint)">404 — Not found — FIG_404</div>
        <div class="text-[56px] md:text-[72px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.05em">404</div>
        <p class="mt-4 text-sm leading-relaxed max-w-[42ch]" style="color: var(--color-text-muted)">
          The page you’re looking for doesn’t exist or has been moved. Head back home or browse writing.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <router-link
            to="/"
            class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium"
            style="background: var(--color-text-primary); color: var(--color-bg)"
          >
            ← Home
          </router-link>
          <router-link
            to="/blogs"
            class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border text-sm font-medium"
            style="border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface)"
          >
            Browse blog
          </router-link>
        </div>
        <div class="mt-10 pt-6 border-t text-xs font-mono" style="border-color: var(--color-border); color: var(--color-text-faint)">
          wide container · dark slate · max-w-[1280px]
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
useHead({ title: '404 | Abu Amar' })
</script>
