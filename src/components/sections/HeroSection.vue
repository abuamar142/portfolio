<template>
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-dracula-background transition-colors"
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
          const portfolio = { skills: ['Flutter', 'Dart', 'TypeScript'], experience: '3+ years' };
        </div>
      </div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-10 animate-float">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">const</code>
          <code class="text-dracula-foreground text-sm"> developer </code>
          <code class="text-dracula-foreground text-sm">= {</code>
        </div>
      </div>

      <div class="absolute top-40 right-20 animate-float" style="animation-delay: 1s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-cyan text-sm">console.log</code>
          <code class="text-dracula-foreground text-sm">(</code>
          <code class="text-dracula-green text-sm">'Hello World!'</code>
          <code class="text-dracula-foreground text-sm">)</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-20 animate-float" style="animation-delay: 2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">export default</code>
          <code class="text-dracula-cyan text-sm"> Portfolio</code>
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-20">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="text-center lg:text-left animate-fade-in">
          <!-- Developer Badge -->
          <div
            class="inline-flex items-center bg-dracula-purple/20 border border-dracula-purple/30 text-dracula-purple px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            <div class="w-2 h-2 bg-dracula-green rounded-full mr-3 animate-pulse"></div>
            Available for work
          </div>

          <!-- Main Heading with Typing Effect -->
          <div class="mb-6">
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-dracula-foreground mb-2 leading-tight"
            >
              Hi, I'm
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-dracula-purple to-dracula-pink"
              >
                {{ portfolioData.personalInfo.nickname }}
              </span>
            </h1>
            <div
              class="text-2xl md:text-3xl lg:text-4xl font-bold text-dracula-comment h-12 flex items-center"
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
            class="text-lg md:text-xl text-dracula-comment mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
          >
            {{ portfolioData.personalInfo.title }} yang berfokus pada pembuatan solusi yang kuat dan
            skalabel. Saya mengubah ide menjadi pengalaman digital melalui kode yang bersih dan
            pemikiran inovatif.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mb-12">
            <BaseButton
              variant="primary"
              size="lg"
              class="shadow-glow hover:shadow-button-hover transform hover:-translate-y-1 transition-all duration-300 bg-dracula-purple hover:bg-dracula-pink"
              @click="scrollToContact"
            >
              <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                ></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              Mari Terhubung
            </BaseButton>

            <BaseButton
              variant="outline"
              size="lg"
              class="border-2 border-dracula-comment text-dracula-comment hover:border-dracula-purple hover:text-dracula-purple hover:bg-dracula-purple/10 transition-all duration-300"
              @click="viewCV"
            >
              <EyeIcon class="w-5 h-5 mr-2" />
              Lihat Resume
            </BaseButton>
          </div>

          <!-- Tech Stack Pills -->
          <div class="flex flex-wrap gap-3 mb-8">
            <div
              v-for="tech in featuredTechs"
              :key="tech"
              class="px-3 py-1 bg-dracula-selection border border-gray-500 text-dracula-foreground text-sm rounded-full backdrop-blur-sm hover:border-dracula-purple/50 transition-colors"
            >
              {{ tech }}
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 text-center">
            <div class="animate-slide-up" style="animation-delay: 0.2s">
              <div class="text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolioData.experiences.length }}+
              </div>
              <div class="text-sm text-dracula-comment">Years Experience</div>
            </div>
            <div class="animate-slide-up" style="animation-delay: 0.4s">
              <div class="text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolioData.projects.length }}+
              </div>
              <div class="text-sm text-dracula-comment">Projects Built</div>
            </div>
            <div class="animate-slide-up" style="animation-delay: 0.6s">
              <div class="text-2xl md:text-3xl font-bold text-dracula-foreground mb-1">
                {{ portfolioData.skills.length }}+
              </div>
              <div class="text-sm text-dracula-comment">Technologies</div>
            </div>
          </div>
        </div>

        <!-- Interactive Code Editor -->
        <div class="hidden lg:block animate-fade-in" style="animation-delay: 0.3s">
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
                <div class="text-dracula-comment text-sm font-mono">portfolio.js</div>
                <div class="w-6"></div>
              </div>

              <!-- Code Content -->
              <div class="p-6 font-mono text-sm leading-relaxed">
                <div class="space-y-2">
                  <div>
                    <span class="text-dracula-purple">const</span>
                    <span class="text-dracula-cyan"> developer</span>
                    <span class="text-dracula-foreground"> = {</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">name: </span>
                    <span class="text-dracula-green"
                      >'{{ portfolioData.personalInfo.fullname }}'</span
                    >
                    <span class="text-dracula-foreground">,</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">role: </span>
                    <span class="text-dracula-green">'{{ portfolioData.personalInfo.title }}'</span>
                    <span class="text-dracula-foreground">,</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">skills: [</span>
                  </div>
                  <div
                    class="pl-8"
                    v-for="(skill, index) in portfolioData.skills.slice(0, 4)"
                    :key="skill.name"
                  >
                    <span class="text-dracula-green">'{{ skill.name }}'</span>
                    <span class="text-dracula-foreground">{{ index < 3 ? ',' : '' }}</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">],</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-cyan">hardWorker</span>
                    <span class="text-dracula-foreground">: </span>
                    <span class="text-dracula-purple">true</span>
                    <span class="text-dracula-foreground">,</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-cyan">problemSolver</span>
                    <span class="text-dracula-foreground">: </span>
                    <span class="text-dracula-purple">true</span>
                    <span class="text-dracula-foreground">,</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-cyan">hireable</span>
                    <span class="text-dracula-foreground">: </span>
                    <span class="text-dracula-purple">function</span>
                    <span class="text-dracula-foreground">() {</span>
                  </div>
                  <div class="pl-8">
                    <span class="text-dracula-purple">return</span>
                    <span class="text-dracula-foreground"> (</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-purple">this</span>
                    <span class="text-dracula-foreground">.hardWorker &&</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-purple">this</span>
                    <span class="text-dracula-foreground">.problemSolver &&</span>
                  </div>
                  <div class="pl-12">
                    <span class="text-dracula-purple">this</span>
                    <span class="text-dracula-foreground">.skills.length >= </span>
                    <span class="text-dracula-orange">{{ portfolioData.skills.length }}</span>
                  </div>
                  <div class="pl-8">
                    <span class="text-dracula-foreground">);</span>
                  </div>
                  <div class="pl-4">
                    <span class="text-dracula-foreground">}</span>
                  </div>
                  <div>
                    <span class="text-dracula-foreground">};</span>
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
                <div class="text-dracula-foreground text-sm font-mono ml-1">npm start</div>
              </div>
              <div class="text-green-400 text-xs font-mono">
                ✓ Portfolio running on localhost:3000
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
import { portfolioData } from '@/data/portfolio'
import BaseButton from '@/components/ui/BaseButton.vue'
import { EyeIcon } from '@heroicons/vue/24/outline'

const currentRole = ref('')
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
</script>
