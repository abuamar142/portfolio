<template>
  <section
    id="skills"
    class="relative py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 left-16 w-80 h-80 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-16 w-96 h-96 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20">
      <div class="absolute top-24 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">import</code>
          <code class="text-dracula-foreground text-sm"> * </code>
          <code class="text-dracula-purple text-sm">as</code>
          <code class="text-dracula-cyan text-sm"> skills</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-24 animate-float" style="animation-delay: 1.2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-cyan text-sm">skills</code>
          <code class="text-dracula-foreground text-sm">.level = </code>
          <code class="text-dracula-green text-sm">'expert'</code>
        </div>
      </div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">
      <!-- Enhanced Header -->
      <div class="text-center mb-20 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-dracula-purple to-dracula-pink text-dracula-background mb-8 shadow-glow"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        <h2 class="text-5xl md:text-6xl font-bold mb-8">
          <span class="text-dracula-foreground font-mono">
            <span class="text-dracula-purple">keahlian</span>
            <span class="text-dracula-foreground">.</span>
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-dracula-purple to-dracula-pink"
              >saya</span
            >
          </span>
        </h2>

        <p class="text-xl text-dracula-comment max-w-2xl mx-auto">
          Technologies and tools I use to bring ideas to life
        </p>
      </div>

      <!-- Enhanced Skills Grid -->
      <div class="space-y-12 animate-slide-up delay-200">
        <div v-for="category in skillCategories" :key="category.name" class="space-y-6">
          <!-- Category Header -->
          <div class="text-center">
            <h3 class="text-2xl font-bold text-dracula-foreground mb-2 font-mono">
              <span class="text-dracula-comment">//</span>
              <span class="text-dracula-purple">{{ category.name.toLowerCase() }}</span>
            </h3>
          </div>

          <!-- Skills Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="skill in category.skills" :key="skill.id" class="group">
              <div
                class="bg-dracula-selection border border-gray-500 rounded-lg p-6 text-center hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              >
                <!-- Skill Icon/Initial -->
                <div
                  class="w-12 h-12 mx-auto bg-dracula-purple/20 border border-dracula-purple/30 rounded-lg flex items-center justify-center text-dracula-purple text-lg font-bold mb-3 group-hover:scale-110 transition-transform duration-300"
                >
                  {{ getSkillInitial(skill.name) }}
                </div>
                <!-- Skill Name -->
                <h4
                  class="text-sm text-dracula-foreground font-mono font-medium group-hover:text-dracula-foreground transition-colors duration-300"
                >
                  {{ skill.name }}
                </h4>
                <!-- Level Indicator -->
                <div class="mt-2 w-full bg-dracula-selection rounded-full h-1">
                  <div
                    class="bg-gradient-to-r from-dracula-purple to-dracula-pink h-1 rounded-full transition-all duration-500 group-hover:animate-pulse"
                    :style="{ width: `${skill.level}%` }"
                  ></div>
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
import { computed } from 'vue'
import { portfolioData } from '@/data/portfolio'

const skillCategories = computed(() =>
  [
    {
      name: 'Mobile',
      skills: portfolioData.skills.filter((skill) => skill.category === 'frontend'),
    },
    {
      name: 'Web',
      skills: portfolioData.skills.filter((skill) => skill.category === 'backend'),
    },
    {
      name: 'Database',
      skills: portfolioData.skills.filter((skill) => skill.category === 'database'),
    },
    {
      name: 'Tools',
      skills: portfolioData.skills.filter((skill) => skill.category === 'tools'),
    },
  ].filter((category) => category.skills.length > 0),
)

const getSkillInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}
</script>
