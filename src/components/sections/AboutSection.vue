<template>
  <section
    id="about"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-32 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">class</code>
          <code class="text-dracula-cyan text-sm"> Developer</code>
          <code class="text-dracula-foreground text-sm"> {</code>
        </div>
      </div>

      <div class="absolute bottom-40 left-32 animate-float" style="animation-delay: 1.5s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-foreground text-sm">skills.</code>
          <code class="text-dracula-cyan text-sm">add</code>
          <code class="text-dracula-foreground text-sm">(</code>
          <code class="text-dracula-green text-sm">'Flutter'</code>
          <code class="text-dracula-foreground text-sm">);</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('about.title') }}
          </span>
        </h2>

        <div class="max-w-4xl mx-auto px-4 sm:px-0">
          <p
            class="text-base sm:text-lg md:text-xl lg:text-2xl text-dracula-comment leading-relaxed mb-6 sm:mb-8"
          >
            {{ portfolioData.about }}
          </p>
          <div
            class="w-16 sm:w-24 h-1 bg-gradient-to-r from-dracula-purple to-dracula-pink mx-auto rounded-full"
          ></div>
        </div>
      </div>

      <!-- Enhanced Stats -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20 animate-slide-up delay-200"
      >
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 text-center group hover:scale-105 hover:border-dracula-purple/50 transition-all duration-300 shadow-lg backdrop-blur-sm"
        >
          <div
            class="text-3xl sm:text-4xl md:text-5xl font-bold text-dracula-purple mb-2 sm:mb-3 font-mono"
          >
            {{ portfolioData.experiences.length }}+
          </div>
          <div class="text-base sm:text-lg font-medium text-dracula-foreground mb-1 sm:mb-2">
            {{ $t('about.stats.years') }}
          </div>
          <div class="text-sm sm:text-base text-dracula-comment">
            {{ $t('about.stats.experience') }}
          </div>
        </div>

        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 text-center group hover:scale-105 hover:border-dracula-purple/50 transition-all duration-300 shadow-lg backdrop-blur-sm"
        >
          <div
            class="text-3xl sm:text-4xl md:text-5xl font-bold text-dracula-purple mb-2 sm:mb-3 font-mono"
          >
            {{ portfolioData.projects.length }}+
          </div>
          <div class="text-base sm:text-lg font-medium text-dracula-foreground mb-1 sm:mb-2">
            {{ $t('about.stats.projects') }}
          </div>
          <div class="text-sm sm:text-base text-dracula-comment">
            {{ $t('about.stats.completed') }}
          </div>
        </div>

        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-6 sm:p-8 text-center group hover:scale-105 hover:border-dracula-purple/50 transition-all duration-300 shadow-lg backdrop-blur-sm"
        >
          <div class="text-4xl md:text-5xl font-bold text-dracula-purple mb-3 font-mono">
            {{ portfolioData.skills.length }}+
          </div>
          <div class="text-lg font-medium text-dracula-foreground mb-2">
            {{ $t('about.stats.technologies') }}
          </div>
          <div class="text-dracula-comment">{{ $t('about.stats.mastered') }}</div>
        </div>
      </div>

      <!-- Enhanced Contact Info -->
      <div class="text-center animate-slide-up delay-400">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-8 max-w-2xl mx-auto shadow-lg backdrop-blur-sm"
        >
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <div class="flex items-center gap-3 text-dracula-foreground">
              <div
                class="w-10 h-10 rounded-full bg-dracula-purple/20 border border-dracula-purple/30 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span class="font-medium font-mono">{{ portfolioData.personalInfo.email }}</span>
            </div>

            <div class="flex items-center gap-3 text-dracula-foreground">
              <div
                class="w-10 h-10 rounded-full bg-dracula-purple/20 border border-dracula-purple/30 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span class="font-medium font-mono">{{ portfolioData.personalInfo.location }}</span>
            </div>
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

// Helper untuk backward compatibility
const portfolioData = computed(
  () =>
    portfolio.value || {
      personalInfo: { fullname: '', nickname: '', title: '', email: '', phone: '', location: '' },
      about: '',
      experiences: [],
      projects: [],
      skills: [],
      education: [],
      achievements: [],
    },
)
</script>
