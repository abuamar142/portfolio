<template>
  <section
    id="contact"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5 hidden md:block">
      <div
        class="absolute inset-0 text-dracula-comment text-xs font-mono p-8 overflow-hidden leading-loose"
      >
        <div class="transform -rotate-12 opacity-30">
          // Mari buat sesuatu yang luar biasa bersama<br />
          final Contact contact = Contact(ready: true, available: 'now');
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div
          class="inline-flex items-center bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm"
        >
          <div class="w-2 h-2 bg-dracula-green rounded-full mr-2 sm:mr-3 animate-pulse"></div>
          {{ $t('contact.badge') }}
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('contact.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <!-- Contact Cards -->
        <div class="space-y-4 sm:space-y-6 animate-slide-up">
          <!-- Email Card -->
          <div
            class="bg-dracula-selection backdrop-blur-sm border border-gray-500 rounded-xl p-4 sm:p-6 hover:border-dracula-purple/50 transition-all duration-300 group"
          >
            <div class="flex items-start space-x-3 sm:space-x-4">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 sm:w-6 sm:h-6 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-dracula-foreground mb-1 sm:mb-2">
                  {{ $t('contact.cards.email.title') }}
                </h3>
                <a
                  :href="`mailto:${portfolioData.personalInfo.email}`"
                  class="text-dracula-purple hover:text-dracula-pink transition-colors text-sm sm:text-lg font-mono break-all"
                >
                  {{ portfolioData.personalInfo.email }}
                </a>
                <p class="text-dracula-comment text-xs sm:text-sm mt-1 sm:mt-2">
                  {{ $t('contact.cards.email.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Location Card -->
          <div
            class="bg-dracula-selection backdrop-blur-sm border border-gray-500 rounded-xl p-4 sm:p-6 hover:border-dracula-purple/50 transition-all duration-300 group"
          >
            <div class="flex items-start space-x-3 sm:space-x-4">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 sm:w-6 sm:h-6 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-dracula-foreground mb-1 sm:mb-2">
                  {{ $t('contact.cards.location.title') }}
                </h3>
                <p class="text-dracula-foreground text-sm sm:text-lg">
                  {{ portfolioData.personalInfo.location }}
                </p>
                <p class="text-dracula-comment text-xs sm:text-sm mt-1 sm:mt-2">
                  {{ $t('contact.cards.location.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Phone Card (if available) -->
          <div
            v-if="portfolioData.personalInfo.phone"
            class="bg-dracula-selection backdrop-blur-sm border border-gray-500 rounded-xl p-4 sm:p-6 hover:border-dracula-purple/50 transition-all duration-300 group"
          >
            <div class="flex items-start space-x-3 sm:space-x-4">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors flex-shrink-0"
              >
                <svg
                  class="w-5 h-5 sm:w-6 sm:h-6 text-dracula-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-semibold text-dracula-foreground mb-1 sm:mb-2">
                  {{ $t('contact.cards.phone.title') }}
                </h3>
                <p class="text-dracula-foreground text-sm sm:text-lg font-mono break-all">
                  {{ portfolioData.personalInfo.phone }}
                </p>
                <p class="text-dracula-comment text-xs sm:text-sm mt-1 sm:mt-2">
                  {{ $t('contact.cards.phone.subtitle') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Code Block -->
        <div class="animate-slide-up mt-8 lg:mt-0" style="animation-delay: 0.2s">
          <div
            class="bg-dracula-selection border border-gray-500 rounded-xl overflow-hidden shadow-2xl"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-dracula-selection border-b border-gray-500"
            >
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div class="text-dracula-comment text-xs sm:text-sm font-mono">contact.dart</div>
              <div class="w-4 sm:w-6"></div>
            </div>

            <!-- Code Content -->
            <div class="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
              <div class="space-y-1 sm:space-y-2 min-w-max">
                <div>
                  <span class="text-dracula-purple">class</span>
                  <span class="text-dracula-cyan"> Contact</span>
                  <span class="text-dracula-foreground"> {</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-purple">final String</span>
                  <span class="text-dracula-foreground"> email = </span>
                  <span class="text-dracula-green break-all"
                    >'{{ portfolioData.personalInfo.email }}'</span
                  >
                  <span class="text-dracula-foreground">;</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-purple">final String</span>
                  <span class="text-dracula-foreground"> location = </span>
                  <span class="text-dracula-green"
                    >'{{ portfolioData.personalInfo.location }}'</span
                  >
                  <span class="text-dracula-foreground">;</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-purple">final String</span>
                  <span class="text-dracula-foreground"> availability = </span>
                  <span class="text-dracula-green">'{{ $t('contact.code.availability') }}'</span>
                  <span class="text-dracula-foreground">;</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-purple">final String</span>
                  <span class="text-dracula-foreground"> responseTime = </span>
                  <span class="text-dracula-green">'{{ $t('contact.code.responseTime') }}'</span>
                  <span class="text-dracula-foreground">;</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-purple">String</span>
                  <span class="text-dracula-cyan"> connect</span>
                  <span class="text-dracula-foreground">() {</span>
                </div>
                <div class="pl-4 sm:pl-8">
                  <span class="text-dracula-purple">return</span>
                  <span class="text-dracula-foreground"> </span>
                  <span class="text-dracula-green">'{{ $t('contact.code.message') }}'</span>
                  <span class="text-dracula-foreground">;</span>
                </div>
                <div class="pl-2 sm:pl-4">
                  <span class="text-dracula-foreground">}</span>
                </div>
                <div>
                  <span class="text-dracula-foreground">}</span>
                </div>
                <div class="mt-2 sm:mt-4">
                  <span class="text-code-comment">// {{ $t('contact.code.comment') }}</span>
                </div>
                <div>
                  <span class="text-dracula-purple">final</span>
                  <span class="text-dracula-cyan"> contact</span>
                  <span class="text-dracula-foreground"> = </span>
                  <span class="text-dracula-cyan">Contact</span>
                  <span class="text-dracula-foreground">();</span>
                </div>
                <div>
                  <span class="text-dracula-cyan">contact.connect</span>
                  <span class="text-dracula-foreground">();</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="mt-6 sm:mt-8 text-center">
            <p class="text-dracula-comment mb-3 sm:mb-4 text-sm sm:text-base">
              {{ $t('contact.social') }}
            </p>
            <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                v-if="portfolioData.personalInfo.github"
                :href="portfolioData.personalInfo.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 sm:space-x-2 text-dracula-comment hover:text-dracula-purple transition-colors group"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span class="group-hover:underline text-sm sm:text-base">GitHub</span>
              </a>
              <a
                v-if="portfolioData.personalInfo.linkedin"
                :href="portfolioData.personalInfo.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 sm:space-x-2 text-dracula-comment hover:text-dracula-purple transition-colors group"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                <span class="group-hover:underline text-sm sm:text-base">LinkedIn</span>
              </a>
              <a
                v-if="portfolioData.personalInfo.instagram"
                :href="portfolioData.personalInfo.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 sm:space-x-2 text-dracula-comment hover:text-dracula-purple transition-colors group"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                  />
                </svg>
                <span class="group-hover:underline text-sm sm:text-base">Instagram</span>
              </a>
              <a
                v-if="portfolioData.personalInfo.whatsApp"
                :href="portfolioData.personalInfo.whatsApp"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 sm:space-x-2 text-dracula-comment hover:text-dracula-purple transition-colors group"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.272-.099-.47-.148-.669.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.711.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.124-.272-.198-.57-.347z"
                  />
                  <path
                    d="M12.004 2.003c-5.522 0-9.997 4.475-9.997 9.997 0 1.762.463 3.479 1.341 4.991l-1.414 5.179 5.308-1.396c1.469.805 3.13 1.229 4.762 1.229 5.522 0 9.997-4.475 9.997-9.997s-4.475-9.997-9.997-9.997zm0 18.181c-1.522 0-3.021-.401-4.329-1.161l-.309-.179-3.152.829.842-3.082-.201-.317c-.823-1.297-1.259-2.797-1.259-4.309 0-4.411 3.588-7.999 7.999-7.999s7.999 3.588 7.999 7.999-3.588 7.999-7.999 7.999z"
                  />
                </svg>
                <span class="group-hover:underline text-sm sm:text-base">WhatsApp</span>
              </a>
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
