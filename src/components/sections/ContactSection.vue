<template>
  <section
    id="contact"
    class="relative py-12 sm:py-16 lg:py-20 scroll-mt-16 sm:scroll-mt-18 lg:scroll-mt-20 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-20 hidden md:block pointer-events-none">
      <div
        class="absolute inset-0 text-dracula-comment text-xs sm:text-sm font-mono p-8 overflow-hidden leading-loose"
      >
        <!-- Pattern 1: Top Left -->
        <div class="absolute top-8 left-8 transform -rotate-12 opacity-60">
          // {{ $t('contact.backgroundPatterns.welcome') }}<br />
          final Contact contact = {{ $t('contact.backgroundPatterns.contact') }};<br />
          print('{{ $t('contact.backgroundPatterns.connect') }}');
        </div>

        <!-- Pattern 2: Center Right -->
        <div class="absolute top-1/3 right-12 transform rotate-12 opacity-40">
          class {{ $t('contact.backgroundPatterns.developer') }} {<br />
          &nbsp;&nbsp;String passion = '{{ $t('contact.backgroundPatterns.passion') }}';<br />
          &nbsp;&nbsp;bool isAvailable = {{ $t('contact.backgroundPatterns.available') }};<br />
          &nbsp;&nbsp;void connect() => print('{{
            $t('contact.backgroundPatterns.connect')
          }}');<br />
          }
        </div>

        <!-- Pattern 3: Bottom Left -->
        <div class="absolute bottom-16 left-16 transform -rotate-6 opacity-50">
          // 🚀 {{ $t('contact.backgroundPatterns.project') }}<br />
          await {{ $t('contact.backgroundPatterns.delayed') }};<br />
          developer.connect();
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-6 sm:mb-8 shadow-glow"
        >
          <Mail class="w-6 h-6 sm:w-8 sm:h-8" />
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

      <div class="space-y-8 lg:space-y-0">
        <!-- Mobile/Tablet Layout -->
        <div class="lg:hidden space-y-8">
          <!-- Contact Cards -->
          <div class="space-y-4 sm:space-y-4 md:space-y-6 animate-slide-up w-full min-w-0">
            <!-- Email Card -->
            <ContactCard
              icon="email"
              type="email"
              :title="$t('contact.cards.email.title')"
              :content="portfolio?.personalInfo.email || ''"
              :subtitle="$t('contact.cards.email.subtitle')"
              :href="`mailto:${portfolio?.personalInfo.email || ''}`"
            />

            <!-- Location Card -->
            <ContactCard
              icon="location"
              type="location"
              :title="$t('contact.cards.location.title')"
              :content="portfolio?.personalInfo.location || ''"
              :subtitle="$t('contact.cards.location.subtitle')"
            />

            <!-- Phone Card (if available) -->
            <ContactCard
              v-if="portfolio?.personalInfo.phone"
              icon="phone"
              type="phone"
              :title="$t('contact.cards.phone.title')"
              :content="portfolio?.personalInfo.phone || ''"
              :subtitle="$t('contact.cards.phone.subtitle')"
            />
          </div>

          <!-- Code Block -->
          <div class="animate-slide-up" style="animation-delay: 0.2s">
            <div
              class="bg-dracula-selection border border-dracula-comment rounded-xl overflow-hidden shadow-2xl"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-dracula-selection border-b border-dracula-comment"
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
                      >'{{ portfolio?.personalInfo.email || '' }}'</span
                    >
                    <span class="text-dracula-foreground">;</span>
                  </div>
                  <div class="pl-2 sm:pl-4">
                    <span class="text-dracula-purple">final String</span>
                    <span class="text-dracula-foreground"> location = </span>
                    <span class="text-dracula-green"
                      >'{{ portfolio?.personalInfo.location || '' }}'</span
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
          </div>

          <!-- Social Links -->
          <div class="animate-slide-up" style="animation-delay: 0.4s">
            <div
              class="bg-dracula-selection/50 border border-dracula-purple/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
            >
              <div class="text-center mb-4 sm:mb-6">
                <h3
                  class="text-dracula-foreground font-semibold text-base sm:text-lg mb-2 font-mono"
                >
                  {{ $t('contact.social') }}
                </h3>
                <div
                  class="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-dracula-purple to-dracula-pink mx-auto"
                ></div>
              </div>

              <!-- Mobile View: List Layout -->
              <div class="space-y-2">
                <a
                  v-if="portfolio?.personalInfo.github"
                  :href="portfolio?.personalInfo.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center justify-between bg-dracula-background/60 hover:bg-dracula-purple/20 border border-dracula-comment/20 hover:border-dracula-purple/40 rounded-lg p-3 transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors"
                    >
                      <Github class="w-4 h-4 text-dracula-purple" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-dracula-purple transition-colors"
                      >
                        GitHub
                      </p>
                      <p class="text-dracula-comment text-xs">View repositories</p>
                    </div>
                  </div>
                  <ExternalLinkIcon
                    class="w-4 h-4 text-dracula-comment group-hover:text-dracula-purple transition-colors"
                  />
                </a>

                <a
                  v-if="portfolio?.personalInfo.linkedin"
                  :href="portfolio?.personalInfo.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center justify-between bg-dracula-background/60 hover:bg-blue-500/20 border border-dracula-comment/20 hover:border-blue-500/40 rounded-lg p-3 transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors"
                    >
                      <Linkedin class="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-blue-400 transition-colors"
                      >
                        LinkedIn
                      </p>
                      <p class="text-dracula-comment text-xs">Professional network</p>
                    </div>
                  </div>
                  <ExternalLinkIcon
                    class="w-4 h-4 text-dracula-comment group-hover:text-blue-400 transition-colors"
                  />
                </a>

                <a
                  v-if="portfolio?.personalInfo.instagram"
                  :href="portfolio?.personalInfo.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center justify-between bg-dracula-background/60 hover:bg-pink-500/20 border border-dracula-comment/20 hover:border-pink-500/40 rounded-lg p-3 transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-colors"
                    >
                      <Instagram class="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-pink-400 transition-colors"
                      >
                        Instagram
                      </p>
                      <p class="text-dracula-comment text-xs">Behind the scenes</p>
                    </div>
                  </div>
                  <ExternalLinkIcon
                    class="w-4 h-4 text-dracula-comment group-hover:text-pink-400 transition-colors"
                  />
                </a>

                <a
                  v-if="portfolio?.personalInfo.whatsApp"
                  :href="portfolio?.personalInfo.whatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center justify-between bg-dracula-background/60 hover:bg-green-500/20 border border-dracula-comment/20 hover:border-green-500/40 rounded-lg p-3 transition-all duration-300"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors"
                    >
                      <MessageCircle class="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-green-400 transition-colors"
                      >
                        WhatsApp
                      </p>
                      <p class="text-dracula-comment text-xs">Quick chat</p>
                    </div>
                  </div>
                  <ExternalLinkIcon
                    class="w-4 h-4 text-dracula-comment group-hover:text-green-400 transition-colors"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Layout: 2 + 1 Layout -->
        <div class="hidden lg:block space-y-8">
          <!-- Top Row: 2 Columns -->
          <div class="grid grid-cols-2 gap-8 xl:gap-12">
            <!-- Left: Contact Cards -->
            <div class="space-y-6 animate-slide-up">
              <!-- Email Card -->
              <ContactCard
                icon="email"
                type="email"
                :title="$t('contact.cards.email.title')"
                :content="portfolio?.personalInfo.email || ''"
                :subtitle="$t('contact.cards.email.subtitle')"
                :href="`mailto:${portfolio?.personalInfo.email || ''}`"
              />

              <!-- Location Card -->
              <ContactCard
                icon="location"
                type="location"
                :title="$t('contact.cards.location.title')"
                :content="portfolio?.personalInfo.location || ''"
                :subtitle="$t('contact.cards.location.subtitle')"
              />

              <!-- Phone Card (if available) -->
              <ContactCard
                v-if="portfolio?.personalInfo.phone"
                icon="phone"
                type="phone"
                :title="$t('contact.cards.phone.title')"
                :content="portfolio?.personalInfo.phone || ''"
                :subtitle="$t('contact.cards.phone.subtitle')"
              />
            </div>

            <!-- Right: Code Block -->
            <div class="animate-slide-up" style="animation-delay: 0.2s">
              <div
                class="bg-dracula-selection border border-dracula-comment rounded-xl overflow-hidden shadow-2xl h-full flex flex-col"
              >
                <!-- Header -->
                <div
                  class="flex items-center justify-between px-6 py-4 bg-dracula-selection border-b border-dracula-comment"
                >
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div class="text-dracula-comment text-sm font-mono">contact.dart</div>
                  <div class="w-6"></div>
                </div>

                <!-- Code Content -->
                <div class="p-6 font-mono text-sm leading-relaxed overflow-x-auto flex-grow">
                  <div class="space-y-2 min-w-max">
                    <div>
                      <span class="text-dracula-purple">class</span>
                      <span class="text-dracula-cyan"> Contact</span>
                      <span class="text-dracula-foreground"> {</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-purple">final String</span>
                      <span class="text-dracula-foreground"> email = </span>
                      <span class="text-dracula-green break-all"
                        >'{{ portfolio?.personalInfo.email || '' }}'</span
                      >
                      <span class="text-dracula-foreground">;</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-purple">final String</span>
                      <span class="text-dracula-foreground"> location = </span>
                      <span class="text-dracula-green"
                        >'{{ portfolio?.personalInfo.location || '' }}'</span
                      >
                      <span class="text-dracula-foreground">;</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-purple">final String</span>
                      <span class="text-dracula-foreground"> availability = </span>
                      <span class="text-dracula-green"
                        >'{{ $t('contact.code.availability') }}'</span
                      >
                      <span class="text-dracula-foreground">;</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-purple">final String</span>
                      <span class="text-dracula-foreground"> responseTime = </span>
                      <span class="text-dracula-green"
                        >'{{ $t('contact.code.responseTime') }}'</span
                      >
                      <span class="text-dracula-foreground">;</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-purple">String</span>
                      <span class="text-dracula-cyan"> connect</span>
                      <span class="text-dracula-foreground">() {</span>
                    </div>
                    <div class="pl-8">
                      <span class="text-dracula-purple">return</span>
                      <span class="text-dracula-foreground"> </span>
                      <span class="text-dracula-green">'{{ $t('contact.code.message') }}'</span>
                      <span class="text-dracula-foreground">;</span>
                    </div>
                    <div class="pl-4">
                      <span class="text-dracula-foreground">}</span>
                    </div>
                    <div>
                      <span class="text-dracula-foreground">}</span>
                    </div>
                    <div class="mt-4">
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
            </div>
          </div>

          <!-- Bottom Row: Full Width Social Links -->
          <div class="animate-slide-up" style="animation-delay: 0.4s">
            <div
              class="bg-dracula-selection/50 border border-dracula-purple/20 rounded-xl p-6 backdrop-blur-sm"
            >
              <div class="text-center mb-6">
                <h3 class="text-dracula-foreground font-semibold text-lg mb-2 font-mono">
                  {{ $t('contact.social') }}
                </h3>
                <div
                  class="w-12 h-0.5 bg-gradient-to-r from-dracula-purple to-dracula-pink mx-auto"
                ></div>
              </div>

              <!-- Social Links Grid: 4 columns on desktop -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <a
                  v-if="portfolio?.personalInfo.github"
                  :href="portfolio?.personalInfo.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative bg-dracula-background/60 hover:bg-dracula-purple/20 border border-dracula-comment/20 hover:border-dracula-purple/40 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-dracula-purple/25 block"
                >
                  <div class="flex flex-col items-center text-center space-y-3">
                    <div
                      class="w-12 h-12 bg-dracula-purple/20 rounded-lg flex items-center justify-center group-hover:bg-dracula-purple/30 transition-colors"
                    >
                      <Github class="w-6 h-6 text-dracula-purple" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-dracula-purple transition-colors"
                      >
                        GitHub
                      </p>
                      <p class="text-dracula-comment text-xs">View repositories</p>
                    </div>
                  </div>
                  <div
                    class="absolute inset-0 rounded-lg bg-gradient-to-r from-dracula-purple/0 to-dracula-pink/0 group-hover:from-dracula-purple/5 group-hover:to-dracula-pink/5 transition-all duration-300"
                  ></div>
                </a>

                <a
                  v-if="portfolio?.personalInfo.linkedin"
                  :href="portfolio?.personalInfo.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative bg-dracula-background/60 hover:bg-blue-500/20 border border-dracula-comment/20 hover:border-blue-500/40 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 block"
                >
                  <div class="flex flex-col items-center text-center space-y-3">
                    <div
                      class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors"
                    >
                      <Linkedin class="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-blue-400 transition-colors"
                      >
                        LinkedIn
                      </p>
                      <p class="text-dracula-comment text-xs">Professional network</p>
                    </div>
                  </div>
                  <div
                    class="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-300"
                  ></div>
                </a>

                <a
                  v-if="portfolio?.personalInfo.instagram"
                  :href="portfolio?.personalInfo.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative bg-dracula-background/60 hover:bg-pink-500/20 border border-dracula-comment/20 hover:border-pink-500/40 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 block"
                >
                  <div class="flex flex-col items-center text-center space-y-3">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-500/30 transition-colors"
                    >
                      <Instagram class="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-pink-400 transition-colors"
                      >
                        Instagram
                      </p>
                      <p class="text-dracula-comment text-xs">Behind the scenes</p>
                    </div>
                  </div>
                  <div
                    class="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 transition-all duration-300"
                  ></div>
                </a>

                <a
                  v-if="portfolio?.personalInfo.whatsApp"
                  :href="portfolio?.personalInfo.whatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative bg-dracula-background/60 hover:bg-green-500/20 border border-dracula-comment/20 hover:border-green-500/40 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 block"
                >
                  <div class="flex flex-col items-center text-center space-y-3">
                    <div
                      class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors"
                    >
                      <MessageCircle class="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p
                        class="text-dracula-foreground font-medium text-sm group-hover:text-green-400 transition-colors"
                      >
                        WhatsApp
                      </p>
                      <p class="text-dracula-comment text-xs">Quick chat</p>
                    </div>
                  </div>
                  <div
                    class="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all duration-300"
                  ></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Github, Linkedin, Instagram, MessageCircle, ExternalLinkIcon, Mail } from 'lucide-vue-next'
import { usePortfolio } from '@/composables/usePortfolio'
import ContactCard from '@/components/ui/ContactCard.vue'

const { portfolio } = usePortfolio()
</script>
