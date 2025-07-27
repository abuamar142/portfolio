<template>
  <section
    id="skills"
    class="relative py-16 sm:py-24 lg:py-32 bg-dracula-background overflow-hidden transition-colors"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <div
        class="absolute top-32 left-4 sm:left-16 w-56 h-56 sm:w-80 sm:h-80 bg-dracula-purple/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 right-4 sm:right-16 w-64 h-64 sm:w-96 sm:h-96 bg-dracula-pink/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Floating Code Elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
      <div class="absolute top-24 right-32 animate-float">
        <div
          class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg backdrop-blur-sm"
        >
          <code class="text-dracula-purple text-sm">import</code>
          <code class="text-dracula-green text-sm"> 'dart:core'</code>
          <code class="text-dracula-purple text-sm"> as</code>
          <code class="text-dracula-cyan text-sm"> skills</code>
          <code class="text-dracula-foreground text-sm">;</code>
        </div>
      </div>

      <div class="absolute bottom-32 left-24 animate-float" style="animation-delay: 1.2s">
        <div class="bg-dracula-selection border border-gray-500 rounded-lg p-3 shadow-lg">
          <code class="text-dracula-purple text-sm">final String</code>
          <code class="text-dracula-foreground text-sm"> level = </code>
          <code class="text-dracula-green text-sm">'expert'</code>
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
          <span class="text-dracula-foreground font-mono">
            {{ $t('skills.title') }}
          </span>
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-dracula-comment max-w-2xl mx-auto px-4 sm:px-0"
        >
          {{ $t('skills.subtitle') }}
        </p>
      </div>

      <!-- Enhanced Skills Grid -->
      <div class="space-y-8 sm:space-y-10 lg:space-y-12 animate-slide-up delay-200">
        <div
          v-for="category in skillCategories"
          :key="category.name"
          class="space-y-4 sm:space-y-6"
        >
          <!-- Category Header -->
          <div class="text-center">
            <h3 class="text-xl sm:text-2xl font-bold text-dracula-foreground mb-2 font-mono">
              <span class="text-dracula-comment">//</span>
              <span class="text-dracula-purple">{{ $t(`skills.categories.${category.key}`) }}</span>
            </h3>
          </div>

          <!-- Skills Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <div v-for="(skill, index) in category.skills" :key="index" class="group">
              <div
                class="bg-dracula-selection border border-gray-500 rounded-lg p-4 sm:p-6 text-center hover:border-dracula-purple/50 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              >
                <!-- Skill Icon/Initial -->
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-dracula-purple/20 border border-dracula-purple/30 rounded-lg flex items-center justify-center text-dracula-purple text-base sm:text-lg font-bold mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                >
                  {{ getSkillInitial(skill.name) }}
                </div>
                <!-- Skill Name -->
                <h4
                  class="text-xs sm:text-sm text-dracula-foreground font-mono font-medium group-hover:text-dracula-foreground transition-colors duration-300 leading-tight"
                >
                  {{ skill.name }}
                </h4>
                <!-- Level Indicator -->
                <div class="mt-1 sm:mt-2 w-full bg-dracula-selection rounded-full h-1">
                  <div
                    class="h-1 rounded-full transition-all duration-500 group-hover:animate-pulse"
                    :class="getSkillLevelClass(skill.level)"
                    :style="{ width: `${getSkillLevelPercentage(skill.level)}%` }"
                  ></div>
                </div>
                <!-- Level Text -->
                <div class="mt-1 text-xs text-dracula-comment font-mono">
                  {{ skill.level }}
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
      key: 'mobile',
      skills: portfolioData.skills.filter((skill) => skill.category === 'mobile'),
    },
    {
      name: 'Web',
      key: 'web',
      skills: portfolioData.skills.filter((skill) => skill.category === 'web'),
    },
    {
      name: 'Backend',
      key: 'backend',
      skills: portfolioData.skills.filter((skill) => skill.category === 'backend'),
    },
    {
      name: 'Tools',
      key: 'tools',
      skills: portfolioData.skills.filter((skill) => skill.category === 'tools'),
    },
  ].filter((category) => category.skills.length > 0),
)

const getSkillInitial = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

const getSkillLevelPercentage = (level: string): number => {
  switch (level) {
    case 'beginner':
      return 25
    case 'intermediate':
      return 50
    case 'advanced':
      return 75
    case 'expert':
      return 100
    default:
      return 0
  }
}

const getSkillLevelClass = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'bg-gradient-to-r from-dracula-comment to-dracula-comment'
    case 'intermediate':
      return 'bg-gradient-to-r from-dracula-cyan to-dracula-cyan'
    case 'advanced':
      return 'bg-gradient-to-r from-dracula-purple to-dracula-purple'
    case 'expert':
      return 'bg-gradient-to-r from-dracula-purple to-dracula-pink shadow-glow'
    default:
      return 'bg-gradient-to-r from-dracula-comment to-dracula-comment'
  }
}
</script>
