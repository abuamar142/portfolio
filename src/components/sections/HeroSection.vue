<template>
  <!-- Loading -->
  <div
    v-if="loading"
    class="min-h-[60vh] flex items-center"
    style="background: var(--color-bg)"
  >
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
      <div class="h-3 w-28 rounded animate-pulse mb-6" style="background: var(--color-surface-raised)"></div>
      <div class="h-10 w-3/4 rounded animate-pulse mb-3" style="background: var(--color-surface-raised)"></div>
      <div class="h-4 w-1/2 rounded animate-pulse" style="background: var(--color-surface-raised)"></div>
    </div>
  </div>

  <!-- Error -->
  <div
    v-else-if="error"
    class="min-h-[60vh] flex items-center"
    style="background: var(--color-bg)"
  >
    <div class="max-w-[1280px] mx-auto px-6 md:px-8 w-full py-20">
      <p class="text-sm mb-4" style="color: var(--color-text-muted)">Failed to load portfolio data.</p>
      <button
        @click="reloadPage"
        class="px-4 py-2 rounded-lg border text-xs transition-colors"
        style="border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface-raised)"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Content -->
  <section
    v-else
    id="hero"
    class="scroll-mt-14 border-b"
    style="background: var(--color-bg); border-color: var(--color-border)"
  >
    <div class="max-w-[1280px] mx-auto px-6 md:px-8">
      <div class="grid lg:grid-cols-[1.4fr_0.85fr] gap-10 lg:gap-12 py-12 md:py-16 lg:py-20 items-start">
        <!-- Left: copy -->
        <div class="min-w-0">
          <!-- Mono label -->
          <div class="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] font-mono tracking-[0.14em] uppercase mb-6">
            <span style="color: var(--color-text-faint)">FIG_001</span>
            <span class="w-6 h-px hidden sm:block" style="background: var(--color-border)"></span>
            <span class="inline-flex items-center gap-1.5" style="color: var(--color-text-muted)">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Available for work
            </span>
            <span class="hidden sm:inline-flex items-center gap-2" style="color: var(--color-text-faint)">
              <span>·</span>
              <span>{{ currentTime }} — {{ portfolio?.personalInfo.location || 'Jakarta, ID' }}</span>
            </span>
          </div>

          <!-- Name -->
          <h1
            class="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-semibold tracking-tighter leading-[0.9] mb-4"
            style="color: var(--color-text-primary); letter-spacing: -0.04em"
          >
            {{ portfolio?.personalInfo.fullname || 'M. Abu Amar Al Badawi' }}
          </h1>

          <!-- Role -->
          <p class="text-[15px] md:text-[16px] font-medium tracking-tight" style="color: var(--color-text-secondary)">
            Mobile & Full Stack Developer
          </p>

          <!-- Value prop -->
          <p class="mt-4 text-sm md:text-[15px] leading-relaxed max-w-[560px]" style="color: var(--color-text-muted)">
            {{ portfolio?.personalInfo.title || 'Building mobile and web applications with a focus on clean code and user experience.' }}
            <span class="hidden md:inline" style="color: var(--color-text-secondary)"> Focused on robust, scalable solutions — from idea to shipped product.</span>
          </p>

          <!-- Meta row -->
          <div class="mt-6 flex flex-wrap items-center gap-3 md:gap-4">
            <a
              v-if="portfolio?.personalInfo.email"
              :href="`mailto:${portfolio.personalInfo.email}`"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors hover:brightness-110"
              style="border-color: var(--color-border); background: var(--color-surface-raised); color: var(--color-text-secondary)"
            >
              <Mail class="w-3.5 h-3.5" style="color: var(--color-text-muted)" />
              {{ portfolio.personalInfo.email }}
            </a>
            <span
              v-if="portfolio?.personalInfo.location"
              class="inline-flex items-center gap-1.5 text-xs"
              style="color: var(--color-text-faint)"
            >
              <MapPin class="w-3.5 h-3.5" />
              {{ portfolio.personalInfo.location }}
            </span>
          </div>

          <!-- Socials + CTA -->
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style="background: var(--color-text-primary); color: var(--color-bg)"
            >
              View projects
            </a>
            <a
              href="#contact"
              class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors"
              style="border-color: var(--color-border); color: var(--color-text-secondary); background: var(--color-surface-raised)"
            >
              Let's connect
            </a>
            <div class="hidden sm:flex items-center gap-1.5 ml-1 pl-3 border-l" style="border-color: var(--color-border)">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 inline-flex items-center justify-center rounded-md border transition-colors hover:brightness-125"
                :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface-raised)' }"
                :aria-label="social.label"
              >
                <component :is="social.icon" class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- Mobile socials -->
          <div class="flex sm:hidden items-center gap-2 mt-6">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 inline-flex items-center justify-center rounded-md border"
              :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', background: 'var(--color-surface-raised)' }"
              :aria-label="social.label"
            >
              <component :is="social.icon" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Right: Overview card (fikril-style) -->
        <div class="lg:pl-2">
          <div
            class="rounded-xl border overflow-hidden"
            style="background: var(--color-surface); border-color: var(--color-border)"
          >
            <!-- Card header -->
            <div class="px-5 py-4 flex items-center justify-between border-b" style="border-color: var(--color-border)">
              <span class="text-[11px] font-mono tracking-[0.14em] uppercase" style="color: var(--color-text-muted)">Overview</span>
              <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">FIG_001</span>
            </div>

            <!-- Identity -->
            <div class="px-5 py-5 flex gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border"
                style="background: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-primary)"
              >
                {{ initials }}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-medium leading-none truncate" style="color: var(--color-text-primary)">
                  {{ portfolio?.personalInfo.fullname || 'Abu Amar' }}
                </div>
                <div class="text-xs mt-1" style="color: var(--color-text-muted)">Mobile & Full Stack — Jakarta</div>
                <div class="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono" style="color: var(--color-text-faint)">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Open to opportunities
                </div>
              </div>
            </div>

            <!-- Details list -->
            <div class="px-5 pb-5 space-y-3">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="rounded-lg border p-3" style="background: var(--color-surface-raised); border-color: var(--color-border)">
                  <div class="text-[11px] font-mono tracking-[0.08em] uppercase mb-1" style="color: var(--color-text-faint)">Location</div>
                  <div class="font-medium truncate" style="color: var(--color-text-secondary)">{{ portfolio?.personalInfo.location || 'Jakarta, Indonesia' }}</div>
                </div>
                <div class="rounded-lg border p-3" style="background: var(--color-surface-raised); border-color: var(--color-border)">
                  <div class="text-[11px] font-mono tracking-[0.08em] uppercase mb-1" style="color: var(--color-text-faint)">Local time</div>
                  <div class="font-medium font-mono text-xs" style="color: var(--color-text-secondary)">{{ currentTime }}</div>
                </div>
              </div>

              <div class="rounded-lg border p-3 flex items-center justify-between" style="background: var(--color-surface-raised); border-color: var(--color-border)">
                <div>
                  <div class="text-[11px] font-mono tracking-[0.08em] uppercase mb-1" style="color: var(--color-text-faint)">Response</div>
                  <div class="text-xs font-medium" style="color: var(--color-text-secondary)">&lt; 24 hours</div>
                </div>
                <div class="w-8 h-8 rounded-full border flex items-center justify-center" style="border-color: var(--color-border); color: var(--color-text-muted)">
                  <Mail class="w-3.5 h-3.5" />
                </div>
              </div>

              <div class="pt-3 border-t space-y-2" style="border-color: var(--color-border)">
                <a
                  v-if="portfolio?.personalInfo.email"
                  :href="`mailto:${portfolio.personalInfo.email}`"
                  class="flex items-center justify-between text-xs group"
                  style="color: var(--color-text-muted)"
                >
                  <span class="truncate">{{ portfolio.personalInfo.email }}</span>
                  <span class="ml-2 shrink-0 inline-flex w-6 h-6 rounded-full border items-center justify-center group-hover:brightness-125 transition" style="border-color: var(--color-border); background: var(--color-surface-raised)">↗</span>
                </a>
                <div class="flex items-center gap-2 text-[11px] font-mono" style="color: var(--color-text-faint)">
                  <span>3 deployed</span><span>·</span><span>6+ stacks</span><span>·</span><span>Remote friendly</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Github, Linkedin, Instagram, Mail, MapPin } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'

const { portfolio, loading, error } = usePortfolio()

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/abuamar142', icon: Github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/abu-amar', icon: Linkedin },
  { label: 'Instagram', url: 'https://instagram.com/abuuamar_', icon: Instagram },
  { label: 'Email', url: 'mailto:abuamar.albadawi@gmail.com', icon: Mail },
]

const initials = computed(() => {
  const name = portfolio.value?.personalInfo.fullname || 'Abu Amar'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const currentTime = ref('')

function updateTime() {
  try {
    currentTime.value = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()) + ' WIB'
  } catch {
    currentTime.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60_000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const reloadPage = () => window.location.reload()
</script>
