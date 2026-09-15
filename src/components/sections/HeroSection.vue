<template>
  <section id="hero" class="relative overflow-hidden">
    <div
      aria-hidden="true"
      class="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
    ></div>

    <div class="wrap relative pb-16 md:pb-24 md:pt-24">
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div class="min-w-0">
          <p
            class="rise inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-primary"
          >
            <span class="pulse-dot size-2 rounded-full bg-primary" aria-hidden="true"></span>
            {{ $t('hero.badge') }}
          </p>

          <h1
            class="rise display-1 mt-6 max-w-3xl text-balance text-base-content"
            style="--rv-i: 1"
          >
            {{ profile.name }}
          </h1>

          <p
            class="rise mt-5 text-lg font-medium tracking-tight text-ink-2 md:text-xl"
            style="--rv-i: 2"
          >
            {{ $t('hero.role') }}
          </p>

          <p class="rise lead mt-5 max-w-xl" style="--rv-i: 3">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="rise mt-9 flex flex-wrap items-center gap-3" style="--rv-i: 4">
            <a href="#projects" class="btn btn-primary min-h-11 gap-2">
              {{ $t('hero.cta.projects') }}
              <ArrowRight class="size-4" aria-hidden="true" />
            </a>
            <a
              :href="profile.resume"
              target="_blank"
              rel="noopener"
              class="btn btn-outline min-h-11 gap-2"
            >
              <Download class="size-4" aria-hidden="true" />
              {{ $t('hero.cta.resume') }}
            </a>
          </div>

          <dl
            v-if="projectCount"
            class="rise mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-base-300 pt-6"
            style="--rv-i: 5"
          >
            <div v-if="yearsBuilding">
              <dt class="text-xs text-ink-3">{{ $t('hero.stats.experience') }}</dt>
              <dd class="mt-2 font-mono text-2xl tracking-tight text-base-content">
                {{ yearsBuilding }}+
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-3">{{ $t('hero.stats.projects') }}</dt>
              <dd class="mt-2 font-mono text-2xl tracking-tight text-base-content">
                {{ projectCount }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-ink-3">{{ $t('hero.stats.technologies') }}</dt>
              <dd class="mt-2 font-mono text-2xl tracking-tight text-base-content">
                {{ technologyCount }}
              </dd>
            </div>
          </dl>
        </div>

        <aside class="panel rise p-6 md:p-7" style="--rv-i: 3" :aria-label="$t('hero.badge')">
          <p class="inline-flex items-center gap-2 text-sm text-ink-2">
            <span class="size-2 rounded-full bg-primary" aria-hidden="true"></span>
            {{ $t('hero.badge') }}
          </p>

          <dl class="mt-6 border-t border-base-300">
            <div class="flex min-h-11 items-baseline justify-between gap-4 py-3.5">
              <dt class="text-xs text-ink-3">{{ $t('hero.labels.location') }}</dt>
              <dd class="text-right text-sm text-ink-2">{{ profile.location }}</dd>
            </div>

            <div
              class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5"
            >
              <dt class="text-xs text-ink-3">{{ $t('hero.labels.email') }}</dt>
              <dd class="min-w-0 text-right text-sm text-ink-2">
                <a
                  :href="`mailto:${profile.email}`"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.email }}
                </a>
              </dd>
            </div>

            <div
              class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5"
            >
              <dt class="text-xs text-ink-3">{{ $t('hero.labels.phone') }}</dt>
              <dd class="text-right text-sm text-ink-2">
                <a
                  :href="profile.phoneHref"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.phone }}
                </a>
              </dd>
            </div>

            <div
              class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5"
            >
              <dt class="text-xs text-ink-3">{{ $t('hero.labels.github') }}</dt>
              <dd class="min-w-0 text-right text-sm text-ink-2">
                <a
                  :href="profile.social.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.social.githubHandle }}
                </a>
              </dd>
            </div>

            <div
              class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5"
            >
              <dt class="text-xs text-ink-3">{{ $t('hero.labels.linkedin') }}</dt>
              <dd class="min-w-0 text-right text-sm text-ink-2">
                <a
                  :href="profile.social.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.social.linkedinHandle }}
                </a>
              </dd>
            </div>
          </dl>

          <a
            :href="profile.resume"
            target="_blank"
            rel="noopener"
            class="btn btn-ghost btn-sm mt-4 w-full justify-between text-ink-2"
          >
            {{ $t('hero.labels.resume') }}
            <ArrowUpRight class="size-4" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Download } from 'lucide-vue-next'
import { profile } from '@/data/profile'
import { useStats } from '@/composables/useStats'

const { yearsBuilding, projectCount, technologyCount } = useStats()
</script>
