<template>
  <section id="contact" class="scroll-mt-14" style="background: var(--color-bg)">
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
      <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
        <!-- Left copy -->
        <div>
          <div class="text-[11px] font-mono tracking-[0.14em] uppercase mb-3" style="color: var(--color-text-faint)">05 — Contact</div>
          <h2 class="text-[22px] md:text-[26px] font-semibold tracking-tighter leading-none" style="color: var(--color-text-primary); letter-spacing: -0.03em">
            {{ $t('contact.title') }}
          </h2>
          <p class="mt-3 text-sm leading-relaxed max-w-[48ch]" style="color: var(--color-text-muted)">
            {{ $t('contact.subtitle') }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              v-if="portfolio?.personalInfo.email"
              :href="`mailto:${portfolio.personalInfo.email}`"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style="background: var(--color-text-primary); color: var(--color-bg)"
            >
              <Mail class="w-4 h-4" />
              {{ portfolio.personalInfo.email }}
            </a>
            <a
              v-if="portfolio?.personalInfo.whatsApp"
              :href="portfolio.personalInfo.whatsApp"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium"
              style="border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface)"
            >
              <MessageCircle class="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <div class="mt-8 flex items-center gap-3 text-xs" style="color: var(--color-text-faint)">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="font-mono">Usually replies &lt; 24h — Jakarta (WIB)</span>
          </div>
        </div>

        <!-- Right: minimal contact card -->
        <div class="rounded-xl border overflow-hidden" style="background: var(--color-surface); border-color: var(--color-border)">
          <div class="px-5 py-4 border-b flex items-center justify-between" style="border-color: var(--color-border)">
            <span class="text-[11px] font-mono tracking-[0.14em] uppercase" style="color: var(--color-text-muted)">Get in touch</span>
            <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">FIG_005</span>
          </div>

          <div class="p-5 space-y-4">
            <a
              v-if="portfolio?.personalInfo.email"
              :href="`mailto:${portfolio.personalInfo.email}`"
              class="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:brightness-110"
              style="background: var(--color-surface-raised); border-color: var(--color-border)"
            >
              <span class="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0" style="background: var(--color-bg); border-color: var(--color-border); color: var(--color-text-muted)">
                <Mail class="w-4 h-4" />
              </span>
              <div class="min-w-0">
                <div class="text-xs font-mono tracking-wide" style="color: var(--color-text-faint)">Email</div>
                <div class="text-sm font-medium truncate" style="color: var(--color-text-secondary)">{{ portfolio.personalInfo.email }}</div>
              </div>
              <span class="ml-auto text-xs" style="color: var(--color-text-faint)">↗</span>
            </a>

            <div v-if="portfolio?.personalInfo.location" class="flex items-center gap-3 p-3 rounded-lg border" style="background: var(--color-surface-raised); border-color: var(--color-border)">
              <span class="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0" style="background: var(--color-bg); border-color: var(--color-border); color: var(--color-text-muted)">
                <MapPin class="w-4 h-4" />
              </span>
              <div>
                <div class="text-xs font-mono tracking-wide" style="color: var(--color-text-faint)">Location</div>
                <div class="text-sm" style="color: var(--color-text-secondary)">{{ portfolio.personalInfo.location }} — Remote friendly</div>
              </div>
            </div>

            <div class="pt-2">
              <div class="text-[11px] font-mono tracking-[0.12em] uppercase mb-3" style="color: var(--color-text-faint)">Connect</div>
              <div class="flex flex-wrap gap-2">
                <a
                  v-if="portfolio?.personalInfo.github"
                  :href="portfolio.personalInfo.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                  style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"
                >
                  <Github class="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  v-if="portfolio?.personalInfo.linkedin"
                  :href="portfolio.personalInfo.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                  style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"
                >
                  <Linkedin class="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a
                  v-if="portfolio?.personalInfo.instagram"
                  :href="portfolio.personalInfo.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                  style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"
                >
                  <Instagram class="w-3.5 h-3.5" /> Instagram
                </a>
                <a
                  v-if="portfolio?.personalInfo.whatsApp"
                  :href="portfolio.personalInfo.whatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
                  style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"
                >
                  <MessageCircle class="w-3.5 h-3.5" /> WhatsApp
                </a>
                <!-- Fallback socials if portfolio missing -->
                <template v-if="!portfolio?.personalInfo.github && !portfolio?.personalInfo.linkedin">
                  <a href="https://github.com/abuamar142" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs" style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"><Github class="w-3.5 h-3.5" /> GitHub</a>
                  <a href="https://linkedin.com/in/abu-amar" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs" style="border-color: var(--color-border); color: var(--color-text-muted); background: var(--color-surface-raised)"><Linkedin class="w-3.5 h-3.5" /> LinkedIn</a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Github, Linkedin, Instagram, MessageCircle, Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio } = usePortfolio()
</script>
