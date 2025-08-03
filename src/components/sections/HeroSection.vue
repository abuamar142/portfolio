<template>
  <!-- Loading State -->
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-dracula-purple mx-auto mb-4"
      ></div>
      <p class="text-dracula-foreground font-mono">Loading portfolio...</p>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="error"
    class="fixed inset-0 z-50 flex items-center justify-center bg-dracula-background"
  >
    <div class="text-center">
      <div class="text-dracula-red text-6xl mb-4">⚠️</div>
      <h2 class="text-dracula-foreground text-2xl font-bold mb-2">Connection Error</h2>
      <p class="text-dracula-comment font-mono mb-4">Failed to load portfolio data</p>
      <button
        @click="reloadPage"
        class="px-4 py-2 bg-dracula-purple text-dracula-background rounded-lg hover:bg-dracula-pink transition-colors"
      >
        Retry
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <section
    v-else
    id="hero"
    class="relative min-h-screen scroll-mt-16 sm:scroll-mt-18 lg:scroll-mt-20 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background with Code Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0 text-dracula-comment text-xs font-mono p-8 overflow-hidden leading-loose"
      >
        <div class="transform rotate-12 opacity-50">
          class Portfolio { final List&lt;String&gt; skills = ['Flutter', 'Dart', 'Mobile
          Development']; }
        </div>
      </div>
    </div>
    >
    <!-- Background with Code Pattern -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-dracula-background via-gray-900 to-dracula-background"
    ></div>

    <!-- Animated Code Background -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0 text-dracula-comment text-xs font-mono p-8 overflow-hidden leading-loose"
      >
        <div class="transform rotate-12 opacity-50">
          class Portfolio { final List&lt;String&gt; skills = ['Flutter', 'Dart', 'Mobile
          Development']; }
        </div>
      </div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden hidden md:block">
      <div class="absolute top-20 left-10 animate-float">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">class</code>
          <code class="text-dracula-foreground text-sm"> Developer </code>
          <code class="text-dracula-foreground text-sm">{</code>
        </div>
      </div>

      <div class="absolute top-40 right-20 animate-float" style="animation-delay: 1s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-cyan text-sm">print</code>
          <code class="text-dracula-foreground text-sm">(</code>
          <code class="text-dracula-green text-sm">'Hello Flutter!'</code>
          <code class="text-dracula-foreground text-sm">);</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-20 animate-float" style="animation-delay: 2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">final String</code>
          <code class="text-dracula-cyan text-sm"> name</code>
          <code class="text-dracula-foreground text-sm"> = </code>
          <code class="text-dracula-green text-sm">{{
            portfolio?.personalInfo.nickname || ''
          }}</code>
          <code class="text-dracula-foreground text-sm">;</code>
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] lg:min-h-[90vh]">
        <!-- Content -->
        <div class="text-center lg:text-left animate-fade-in order-2 lg:order-1">
          <!-- Developer Badge -->
          <div
            class="inline-flex items-center bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm"
          >
            <div class="w-2 h-2 bg-dracula-green rounded-full mr-2 sm:mr-3 animate-pulse"></div>
            {{ $t('hero.badge') }}
          </div>

          <!-- Main Heading with Typing Effect -->
          <div class="mb-4 sm:mb-6">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-dracula-foreground mb-2 leading-tight"
            >
              {{ $t('hero.greeting') }}
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-dracula-purple to-dracula-pink"
              >
                {{ portfolio?.personalInfo.nickname || '' }}
              </span>
            </h1>
            <div
              class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-dracula-comment h-8 sm:h-10 lg:h-12 flex items-center justify-center lg:justify-start"
            >
              <span class="font-mono">></span>
              <span
                class="ml-2 border-r-2 border-dracula-purple animate-typing overflow-hidden whitespace-nowrap"
              >
                {{ currentRole }}
              </span>
            </div>
          </div>

          <!-- Subtitle -->
          <p
            class="text-sm sm:text-base md:text-lg lg:text-xl text-dracula-comment mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
          >
            {{ portfolio?.personalInfo.title || '' }} {{ $t('hero.subtitle') }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
            <BaseButton
              variant="primary"
              size="lg"
              class="shadow-glow hover:shadow-button-hover transform hover:-translate-y-1 transition-all duration-300 bg-dracula-purple hover:bg-dracula-pink w-full sm:w-auto"
              @click="scrollToContact"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                ></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              {{ $t('hero.cta.connect') }}
            </BaseButton>

            <BaseButton
              variant="outline"
              size="lg"
              class="border-2 border-dracula-comment text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple hover:bg-dracula-purple/10 transition-all duration-300 w-full sm:w-auto"
              @click="viewCV"
            >
              <EyeIcon class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {{ $t('hero.cta.resume') }}
            </BaseButton>
          </div>

          <!-- Tech Stack Pills -->
          <div
            class="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center lg:justify-start px-4 sm:px-0"
          >
            <div
              v-for="tech in featuredTechs"
              :key="tech"
              class="px-2 py-1 sm:px-3 bg-dracula-selection border border-gray-500 text-dracula-foreground text-xs sm:text-sm rounded-full backdrop-blur-sm hover:border-dracula-purple/50 transition-colors"
            >
              {{ tech }}
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center px-4 sm:px-0">
            <div class="animate-slide-up" style="animation-delay: 0.2s">
              <div class="text-xl sm:text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolio?.experiences?.length || 0 }}+
              </div>
              <div class="text-xs sm:text-sm text-dracula-comment">
                {{ $t('hero.stats.experience') }}
              </div>
            </div>
            <div class="animate-slide-up" style="animation-delay: 0.4s">
              <div class="text-xl sm:text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolio?.projects?.length || 0 }}+
              </div>
              <div class="text-xs sm:text-sm text-dracula-comment">
                {{ $t('hero.stats.projects') }}
              </div>
            </div>
            <div class="animate-slide-up" style="animation-delay: 0.6s">
              <div class="text-xl sm:text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolio?.skills?.length || 0 }}+
              </div>
              <div class="text-xs sm:text-sm text-dracula-comment">
                {{ $t('hero.stats.technologies') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Code Editor -->
        <div
          class="hidden lg:block animate-fade-in order-1 lg:order-2"
          style="animation-delay: 0.3s"
        >
          <div class="relative">
            <!-- Code Editor Window -->
            <div
              class="bg-dracula-background border border-gray-500 rounded-lg shadow-2xl overflow-hidden"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-4 py-3 bg-dracula-selection border-b border-gray-500"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-dracula-red rounded-full"></div>
                  <div class="w-3 h-3 bg-dracula-yellow rounded-full"></div>
                  <div class="w-3 h-3 bg-dracula-green rounded-full"></div>
                </div>
                <div class="text-dracula-foreground text-sm font-mono">portfolio.dart</div>
                <div class="w-6"></div>
              </div>

              <!-- Code Content -->
              <div class="p-6 font-mono text-sm leading-relaxed">
                <div class="space-y-2">
                  <div>
                    <span class="text-dracula-purple">class</span>
                    <span class="text-dracula-cyan"> Developer</span>
                    <span class="text-dracula-foreground"> {</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">final String</span>
                    <span class="text-dracula-foreground"> name = </span>
                    <span class="text-dracula-green">'{{ portfolio?.personalInfo.fullname }}'</span>
                    <span class="text-dracula-foreground">;</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">final String</span>
                    <span class="text-dracula-foreground"> role = </span>
                    <span class="text-dracula-green">'{{ portfolio?.personalInfo.title }}'</span>
                    <span class="text-dracula-foreground">;</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">final List&lt;String&gt;</span>
                    <span class="text-dracula-foreground"> skills = [</span>
                  </div>
                  <div
                    class="pl-8"
                    v-for="(skill, index) in (portfolio?.skills || []).slice(0, 4)"
                    :key="skill.name"
                  >
                    <span class="text-dracula-green">'{{ skill.name }}'</span>
                    <span class="text-dracula-foreground">{{ index < 3 ? ',' : '' }}</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">];</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">final bool</span>
                    <span class="text-dracula-cyan"> hardWorker</span>
                    <span class="text-dracula-foreground"> = </span>
                    <span class="text-dracula-purple">true</span>
                    <span class="text-dracula-foreground">;</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">final bool</span>
                    <span class="text-dracula-cyan"> problemSolver</span>
                    <span class="text-dracula-foreground"> = </span>
                    <span class="text-dracula-purple">true</span>
                    <span class="text-dracula-foreground">;</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-purple">bool</span>
                    <span class="text-dracula-cyan"> isHireable</span>
                    <span class="text-dracula-foreground">() {</span>
                  </div>
                  <div class="pl-8">
                    <span class="text-dracula-purple">return</span>
                    <span class="text-dracula-foreground"> (</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-foreground">hardWorker &&</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-foreground">problemSolver &&</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-foreground">skills.length >= </span>
                    <span class="text-dracula-orange">{{ portfolio?.skills?.length || 0 }}</span>
                  </div>
                  <div class="pl-8">
                    <span class="text-dracula-foreground">);</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">}</span>
                  </div>
                  <div>
                    <span class="text-dracula-foreground">}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Terminal -->
            <div
              class="absolute -bottom-6 -right-6 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl"
            >
              <div class="flex items-center mb-2">
                <div class="text-green-400 text-sm font-mono">$</div>
                <div class="text-dracula-foreground text-sm font-mono ml-1">flutter run</div>
              </div>
              <div class="text-green-400 text-xs font-mono">
                ✓ Flutter app running on localhost:8080
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        ></path>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'
import BaseButton from '@/components/ui/BaseButton.vue'
import { EyeIcon } from '@heroicons/vue/24/outline'

const { portfolio, loading, error } = usePortfolio()

const currentRole = ref('')

// Static roles untuk typing effect (tidak perlu i18n karena ini lebih ke branding)
const roles = [
  'Mobile Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Problem Solver',
  'Code Enthusiast',
]

const featuredTechs = ['Flutter', 'Dart', 'TypeScript', 'React', 'Git', 'Docker']

let roleIndex = 0
let charIndex = 0
let isDeleting = false

const typeRole = () => {
  const role = roles[roleIndex]

  if (isDeleting) {
    currentRole.value = role.substring(0, charIndex - 1)
    charIndex--
  } else {
    currentRole.value = role.substring(0, charIndex + 1)
    charIndex++
  }

  let typeSpeed = isDeleting ? 50 : 100

  if (!isDeleting && charIndex === role.length) {
    typeSpeed = 2000
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
  }

  setTimeout(typeRole, typeSpeed)
}

onMounted(() => {
  typeRole()
})

const scrollToContact = () => {
  const element = document.querySelector('#contact') as HTMLElement
  if (element) {
    const headerHeight = 80
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

const viewCV = () => {
  window.open('/cv.pdf', '_blank')
}

const reloadPage = () => {
  window.location.reload()
}
</script>
