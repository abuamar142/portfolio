<template>
  <section id="about" class="scroll-mt-14 border-b" style="background: var(--color-bg); border-color: var(--color-border)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
        <!-- Section header -->
        <div class="lg:sticky lg:top-20">
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">01 — About</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('about.title') }}
          </h2>
          <div class="mt-4 w-8 h-px" style="background: var(--color-border)"></div>
          <p class="mt-4 text-[11px] font-mono leading-relaxed max-w-[28ch]" style="color: var(--color-text-faint)">
            Simple prose, generous whitespace. No metrics theater.
          </p>
        </div>

        <!-- Content -->
        <div class="min-w-0">
          <p class="text-[15px] leading-relaxed max-w-[62ch]" style="color: var(--color-text-secondary)">
            {{ portfolio?.about }}
          </p>

          <!-- Subtle inline stats — not hero-metric -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6" style="border-color: var(--color-border)">
            <div class="rounded-lg border p-4" style="background: var(--color-surface); border-color: var(--color-border)">
              <div class="text-[11px] font-mono tracking-[0.1em] uppercase" style="color: var(--color-text-faint)">Experience</div>
              <div class="mt-1 text-sm font-medium" style="color: var(--color-text-secondary)">{{ calculateExperienceYears() }}+ years — building</div>
              <div class="mt-1 text-[11px] font-mono" style="color: var(--color-text-muted)">Mobile & web, shipped to production</div>
            </div>
            <div class="rounded-lg border p-4" style="background: var(--color-surface); border-color: var(--color-border)">
              <div class="text-[11px] font-mono tracking-[0.1em] uppercase" style="color: var(--color-text-faint)">Projects</div>
              <div class="mt-1 text-sm font-medium" style="color: var(--color-text-secondary)">{{ portfolio?.projects?.length || 0 }} deployed</div>
              <div class="mt-1 text-[11px] font-mono" style="color: var(--color-text-muted)">Focused on clean, maintainable code</div>
            </div>
            <div class="rounded-lg border p-4" style="background: var(--color-surface); border-color: var(--color-border)">
              <div class="text-[11px] font-mono tracking-[0.1em] uppercase" style="color: var(--color-text-faint)">Stacks</div>
              <div class="mt-1 text-sm font-medium" style="color: var(--color-text-secondary)">6+ technologies</div>
              <div class="mt-1 text-[11px] font-mono" style="color: var(--color-text-muted)">Flutter, Vue, React, Node, etc.</div>
            </div>
          </div>

          <!-- Contact snippet -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              v-if="portfolio?.personalInfo.email"
              :href="`mailto:${portfolio.personalInfo.email}`"
              class="inline-flex items-center gap-2 text-[11px] font-mono px-3 py-2 rounded-full border"
              style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-secondary)"
            >
              <Mail class="w-3.5 h-3.5" style="color: var(--color-text-muted)" />
              {{ portfolio.personalInfo.email }}
            </a>
            <span
              v-if="portfolio?.personalInfo.location"
              class="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-2 rounded-full border"
              style="border-color: var(--color-border); color: var(--color-text-muted)"
            >
              <MapPin class="w-3.5 h-3.5" />
              {{ portfolio.personalInfo.location }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()

const calculateExperienceYears = (): number => {
  const experiences = portfolio.value?.experiences || []
  if (experiences.length === 0) return 2
  let earliest = new Date()
  let found = false
  experiences.forEach((exp: any) => {
    if (exp.startDate) {
      const start = new Date(exp.startDate)
      if (!isNaN(start.getTime())) {
        if (start < earliest) earliest = start
        found = true
      }
    }
    // fallback: try parse duration like "2022 — Present"
    if (!exp.startDate && exp.duration) {
      const m = String(exp.duration).match(/(19|20)\d{2}/)
      if (m) {
        const y = parseInt(m[0], 10)
        const d = new Date(y, 0, 1)
        if (d < earliest) earliest = d
        found = true
      }
    }
  })
  if (!found) return 2
  const now = new Date()
  return Math.max(now.getFullYear() - earliest.getFullYear(), 1)
}
</script>
