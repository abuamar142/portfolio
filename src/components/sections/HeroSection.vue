<template>
  <section id="hero" class="relative overflow-hidden">
    <!-- One restrained top light; the rest of the site stays flat. -->
    <div
      aria-hidden="true"
      class="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]"
    ></div>

    <div
      class="wrap relative pb-16 pt-[calc(var(--header-h)+3rem)] md:pb-24 md:pt-[calc(var(--header-h)+5rem)]"
    >
      <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <!-- Identity -->
        <div>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p class="eyebrow">{{ $t('hero.kicker') }}</p>
            <p class="inline-flex items-center gap-2 font-mono text-[11px] text-primary">
              <span
                class="size-2 rounded-full bg-primary ring-2 ring-primary/25"
                aria-hidden="true"
              ></span>
              {{ $t('hero.badge') }}
            </p>
          </div>

          <h1 class="display-1 mt-6 text-balance text-base-content">{{ profile.name }}</h1>

          <p class="mt-5 text-lg font-medium tracking-tight text-ink-2 md:text-xl">
            {{ $t('hero.role') }}
          </p>

          <p class="lead mt-5">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-3">
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

          <!-- Facts, straight from portfolio data -->
          <dl
            v-if="projectCount"
            class="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-base-300 pt-6"
          >
            <div v-if="yearsBuilding">
              <dt class="eyebrow">{{ $t('hero.stats.experience') }}</dt>
              <dd class="mt-2 font-display text-2xl tracking-tight text-base-content">
                {{ yearsBuilding }}+
              </dd>
            </div>
            <div>
              <dt class="eyebrow">{{ $t('hero.stats.projects') }}</dt>
              <dd class="mt-2 font-display text-2xl tracking-tight text-base-content">
                {{ projectCount }}
              </dd>
            </div>
            <div>
              <dt class="eyebrow">{{ $t('hero.stats.technologies') }}</dt>
              <dd class="mt-2 font-display text-2xl tracking-tight text-base-content">
                {{ technologyCount }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Dossier -->
        <aside class="panel p-6 md:p-7">
          <p class="eyebrow">{{ $t('hero.labels.status') }}</p>
          <p class="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
            <span class="size-2 rounded-full bg-primary" aria-hidden="true"></span>
            {{ $t('hero.badge') }}
          </p>

          <dl class="mt-6 border-t border-base-300">
            <div class="flex min-h-11 items-baseline justify-between gap-4 py-3.5">
              <dt class="eyebrow">{{ $t('hero.labels.location') }}</dt>
              <dd class="text-right text-sm text-ink-2">{{ profile.location }}</dd>
            </div>

            <div class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="eyebrow">{{ $t('hero.labels.email') }}</dt>
              <dd class="min-w-0 text-right text-sm text-ink-2">
                <a
                  :href="`mailto:${profile.email}`"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.email }}
                </a>
              </dd>
            </div>

            <div class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="eyebrow">{{ $t('hero.labels.phone') }}</dt>
              <dd class="text-right text-sm text-ink-2">
                <a
                  :href="profile.phoneHref"
                  class="transition-colors after:absolute after:inset-0 hover:text-primary"
                >
                  {{ profile.phone }}
                </a>
              </dd>
            </div>

            <div class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="eyebrow">{{ $t('hero.labels.github') }}</dt>
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

            <div class="relative flex min-h-11 items-baseline justify-between gap-4 border-t border-base-300 py-3.5">
              <dt class="eyebrow">{{ $t('hero.labels.linkedin') }}</dt>
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
