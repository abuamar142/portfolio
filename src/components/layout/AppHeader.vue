<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-dracula-background/95 backdrop-blur-sm border-b border-gray-500"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18 lg:h-20">
        <!-- Developer Logo -->
        <div class="flex-shrink-0">
          <router-link
            to="/"
            class="flex items-center space-x-2 text-dracula-foreground hover:text-dracula-purple transition-colors group"
          >
            <div
              class="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 rounded-lg flex items-center justify-center font-mono font-bold text-sm border border-dracula-purple sm:text-base lg:text-lg text-dracula-foreground group-hover:bg-dracula-purple group-hover:text-dracula-background transition-all duration-300"
            >
              abuamar.site
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
          <div class="flex items-center space-x-4 lg:space-x-6">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-sm text-dracula-foreground hover:text-dracula-purple transition-colors font-mono relative group py-2"
              @click.prevent="scrollToSection(item.href)"
            >
              <span class="text-dracula-purple mr-1">.</span>{{ $t(item.name) }}()
              <span
                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-dracula-purple transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </div>
        </div>

        <!-- Desktop Language Dropdown -->
        <div class="hidden md:flex items-center">
          <LanguageDropdown />
        </div>

        <!-- Mobile Menu -->
        <div class="md:hidden flex items-center space-x-3">
          <!-- Mobile Language Dropdown -->
          <LanguageDropdown />

          <!-- Mobile menu button -->
          <BaseButton
            variant="ghost"
            size="sm"
            class="p-2 sm:p-2.5 text-dracula-comment hover:text-dracula-purple hover:bg-dracula-purple/10 rounded-lg transition-all duration-300"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <XMarkIcon v-if="isMobileMenuOpen" class="h-6 w-6 sm:h-7 sm:w-7" />
            <Bars3Icon v-else class="h-6 w-6 sm:h-7 sm:w-7" />
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
            class="px-4 pt-4 pb-6 space-y-2 bg-dracula-background border-t border-gray-500 shadow-lg"
          >
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-dracula-comment hover:text-dracula-purple block px-4 py-4 text-base font-mono transition-colors rounded-lg hover:bg-dracula-selection border border-transparent hover:border-dracula-purple/30"
              @click.prevent="
                () => {
                  scrollToSection(item.href)
                  isMobileMenuOpen = false
                }
              "
            >
              <span class="text-dracula-purple mr-2">.</span>{{ $t(item.name) }}()
            </a>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'navigation.about', href: '#about' },
  { name: 'navigation.experience', href: '#experiences' },
  { name: 'navigation.projects', href: '#projects' },
  { name: 'navigation.skills', href: '#skills' },
  { name: 'navigation.achievements', href: '#achievements' },
  { name: 'navigation.contact', href: '#contact' },
]

const scrollToSection = (href: string) => {
  const element = document.querySelector(href) as HTMLElement
  if (element) {
    const headerHeight = 88 // Increased for taller header
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    })
  }
}
</script>
