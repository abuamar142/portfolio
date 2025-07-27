<template>
  <section
    id="experience"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 right-4 sm:right-10 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-32 left-4 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-20 right-20 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">Future&lt;String&gt;</code>
          <code class="text-dracula-cyan text-sm"> buildCareer</code>
          <code class="text-dracula-foreground text-sm">() </code>
          <code class="text-dracula-purple text-sm">async</code>
          <code class="text-dracula-foreground text-sm"> {</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-16 animate-float" style="animation-delay: 2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">return</code>
          <code class="text-dracula-green text-sm"> 'Experienced Developer'</code>
          <code class="text-dracula-foreground text-sm">;</code>
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M16 14h.01M16 18h.01"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('experience.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('experience.subtitle') }}
        </p>
      </div>

      <!-- Enhanced Timeline -->
      <div class="relative">
        <!-- Timeline Line -->
        <div
          class="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-dracula-purple via-dracula-purple to-dracula-pink"
        ></div>

        <div class="space-y-8 sm:space-y-12 lg:space-y-16 animate-slide-up delay-200">
          <div
            v-for="(experience, index) in portfolioData.experiences"
            :key="index"
            class="relative group"
          >
            <!-- Timeline Dot -->
            <div
              class="absolute left-2.5 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-dracula-purple to-dracula-pink rounded-full shadow-glow group-hover:scale-125 transition-transform duration-300 border-2 sm:border-4 border-dracula-background"
            ></div>

            <!-- Content Card -->
            <div class="ml-8 sm:ml-16 lg:ml-20">
              <div
                class="bg-dracula-selection border border-gray-500 rounded-lg p-4 sm:p-6 lg:p-8 group-hover:border-dracula-purple/50 hover:shadow-lg hover:shadow-dracula-purple/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div
                  class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6"
                >
                  <div class="flex-1">
                    <h3
                      class="text-lg sm:text-xl lg:text-2xl font-bold text-dracula-foreground mb-2 group-hover:text-dracula-purple transition-colors duration-300 font-mono leading-tight"
                    >
                      {{ experience.position }}
                    </h3>

                    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3 sm:mb-4">
                      <div
                        class="flex items-center gap-2 text-dracula-purple font-semibold font-mono text-sm sm:text-base"
                      >
                        <svg
                          class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span class="break-words">{{ experience.company }}</span>
                      </div>

                      <div
                        class="flex items-center gap-2 text-dracula-comment font-mono text-xs sm:text-sm"
                      >
                        <svg
                          class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {{ experience.duration }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Description -->
                <div class="mb-6">
                  <div class="space-y-3">
                    <div
                      v-for="desc in experience.description"
                      :key="desc"
                      class="flex items-start gap-3 text-dracula-foreground leading-relaxed"
                    >
                      <div
                        class="w-1.5 h-1.5 bg-dracula-purple rounded-full mt-2 flex-shrink-0"
                      ></div>
                      <span>{{ desc }}</span>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Technologies -->
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="tech in experience.technologies"
                    :key="tech"
                    class="px-3 py-1 bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple text-sm rounded-full font-mono hover:scale-105 hover:bg-dracula-purple/30 transition-all duration-200"
                  >
                    {{ tech }}
                  </span>
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
import { portfolioData } from '@/data/portfolio'
</script>
