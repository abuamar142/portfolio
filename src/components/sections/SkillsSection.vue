<template>
  <section id="skills" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">04 — Skills</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('skills.title') }}
          </h2>
          <p class="mt-3 text-sm max-w-[520px] leading-relaxed" style="color: var(--color-text-muted)">
            Grouped, monochrome pills — no progress bars, no sparklines.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div
          v-for="category in skillCategories"
          :key="category.key"
          class="rounded-xl border p-5"
          style="background: var(--color-surface); border-color: var(--color-border)"
        >
          <h3 class="text-[11px] font-mono tracking-[0.14em] uppercase" style="color: var(--color-text-faint)">
            {{ category.name }}
          </h3>
          <div class="mt-3 w-6 h-px" style="background: var(--color-border)"></div>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="skill in category.skills"
              :key="skill.name"
              class="px-2.5 py-1.5 text-xs font-mono rounded-md border"
              style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-secondary)"
            >
              {{ skill.name }}
            </span>
          </div>
          <div class="mt-3 text-[11px] font-mono" style="color: var(--color-text-faint)">{{ category.skills.length }} items</div>
        </div>

        <div v-if="skillCategories.length === 0" class="col-span-full py-8 text-center rounded-xl border" style="border-color: var(--color-border); background: var(--color-surface)">
          <p class="text-sm" style="color: var(--color-text-muted)">No skills data yet.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const skillCategories = computed(() => {
  const all = portfolio.value?.skills || []
  const groups = [
    { name: 'Mobile', key: 'mobile', skills: all.filter(s => s.category === 'mobile').slice(0, 12) },
    { name: 'Web', key: 'web', skills: all.filter(s => s.category === 'web').slice(0, 12) },
    { name: 'Backend', key: 'backend', skills: all.filter(s => s.category === 'backend').slice(0, 12) },
    { name: 'Tools', key: 'tools', skills: all.filter(s => s.category === 'tools').slice(0, 12) },
  ]
  return groups.filter(c => c.skills.length > 0)
})
</script>
