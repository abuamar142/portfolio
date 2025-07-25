<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800"
  >
    <nav class="max-w-6xl mx-auto px-6">
      <div class="flex items-center justify-between h-14">
        <!-- Simple Logo -->
        <div class="flex-shrink-0">
          <router-link
            to="/"
            class="text-lg font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {{ getInitials(portfolioData.personalInfo.name) }}
          </router-link>
        </div>

        <!-- Clean Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-8">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              @click.prevent="scrollToSection(item.href)"
            >
              {{ item.name }}
            </a>
          </div>
        </div>

        <!-- Dark Mode Toggle & Mobile Menu Button -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <BaseButton
            variant="ghost"
            size="sm"
            @click="toggleDarkMode"
            class="p-2"
            aria-label="Toggle dark mode"
          >
            <SunIcon v-if="isDarkMode" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </BaseButton>

          <!-- Mobile menu button -->
          <BaseButton
            variant="ghost"
            size="sm"
            class="md:hidden p-2"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <XMarkIcon v-if="isMobileMenuOpen" class="h-6 w-6" />
            <Bars3Icon v-else class="h-6 w-6" />
          </BaseButton>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden">
          <div
            class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700"
          >
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium transition-colors"
              @click.prevent="
                () => {
                  scrollToSection(item.href)
                  isMobileMenuOpen = false
                }
              "
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { portfolioData } from '@/data/portfolio'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const { isDarkMode, toggleDarkMode } = useDarkMode()
const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

const scrollToSection = (href: string) => {
  const element = document.querySelector(href) as HTMLElement
  if (element) {
    const headerHeight = 80
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
</script>
