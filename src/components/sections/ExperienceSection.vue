<template>
  <section id="experiences" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-10 md:mb-12">
        <div>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">02 — Experience</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('experience.title') }}
          </h2>
        </div>
        <div class="text-xs font-mono" style="color: var(--color-text-faint)">{{ portfolio?.experiences?.length || 0 }} roles — victoreke list</div>
      </div>

      <div class="border-t" style="border-color: var(--color-border)">
        <div
          v-for="(experience, index) in portfolio?.experiences"
          :key="index"
          class="group grid md:grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr] gap-4 md:gap-8 py-6 md:py-7 border-b last:border-b-0 transition-colors"
          style="border-color: var(--color-border)"
        >
          <!-- Left: duration -->
          <div class="md:pt-1">
            <div class="text-xs font-mono" style="color: var(--color-text-muted)">{{ experience.duration }}</div>
            <div class="mt-1 text-[11px] font-mono tracking-wide" style="color: var(--color-text-faint)">{{ experience.company }}</div>
          </div>

          <!-- Right: content -->
          <div class="min-w-0">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <h3 class="text-[15px] font-medium tracking-tight leading-tight" style="color: var(--color-text-primary)">
                {{ experience.position }}
              </h3>
              <span
                class="hidden md:inline-flex text-[11px] font-mono px-2 py-1 rounded border"
                style="border-color: var(--color-border); color: var(--color-text-faint); background: var(--color-surface)"
              >
                {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
              </span>
            </div>
            <div class="text-xs font-medium mt-1" style="color: var(--color-text-muted)">{{ experience.company }}</div>

            <ul class="mt-3 space-y-1.5">
              <li
                v-for="desc in experience.description"
                :key="desc"
                class="flex gap-2.5 text-sm leading-relaxed"
                style="color: var(--color-text-secondary)"
              >
                <span class="mt-2 w-1 h-1 rounded-full shrink-0" style="background: var(--color-text-faint)"></span>
                <span>{{ desc }}</span>
              </li>
            </ul>

            <div v-if="experience.technologies?.length" class="mt-4 flex flex-wrap gap-1.5">
              <span
                v-for="tech in experience.technologies"
                :key="tech"
                class="px-2 py-1 text-[10px] font-mono tracking-wide rounded border"
                style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-muted)"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!portfolio?.experiences?.length" class="py-12 text-center border-b" style="border-color: var(--color-border)">
          <p class="text-sm" style="color: var(--color-text-muted)">No experience data yet.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()
</script>
