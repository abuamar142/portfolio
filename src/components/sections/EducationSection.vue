<template>
  <section id="education" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="mb-10">
        <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">06 — Education</div>
        <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
          {{ $t('education.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <div
          v-for="(edu, index) in education"
          :key="index"
          class="rounded-xl border p-5 md:p-6 transition-colors"
          style="background: var(--color-surface); border-color: var(--color-border)"
        >
          <h3 class="text-sm font-medium leading-snug" style="color: var(--color-text-primary)">
            {{ edu.institution }}
          </h3>
          <div class="mt-2 text-[11px] font-mono">
            <span class="font-medium" style="color: var(--color-text-secondary)">{{ edu.degree }}</span>
            <span class="mx-1.5" style="color: var(--color-text-faint)">—</span>
            <span style="color: var(--color-text-muted)">{{ edu.field }}</span>
          </div>
          <p class="mt-3 text-[11px] font-mono" style="color: var(--color-text-faint)">
            {{ edu.duration }}
          </p>
          <div v-if="edu.gpa" class="mt-3 inline-flex items-center gap-2 text-[11px] font-mono border rounded-full px-2.5 py-1" style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-muted)">
            <span class="text-[11px] font-mono tracking-widest uppercase" style="color: var(--color-text-faint)">GPA</span>
            {{ edu.gpa }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const education = computed(() => portfolio.value?.education || [])
</script>
