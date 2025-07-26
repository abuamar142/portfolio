<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-dracula-background/95 backdrop-blur-sm border-b border-gray-500"
  >
    <nav class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Developer Logo -->
        <div class="flex-shrink-0">
          <router-link
            to="/"
            class="flex items-center space-x-2 text-dracula-foreground hover:text-dracula-purple transition-colors group"
          >
            <div
              class="h-6 sm:h-8 px-2 rounded-lg flex items-center justify-center font-mono font-bold text-sm sm:text-base text-dracula-foreground group-hover:bg-dracula-pink transition-colors"
            >
              abuamar.site
            </div>
          </router-link>
        </div>

        <!-- Developer Navigation -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-6 lg:space-x-8">
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-sm text-dracula-comment hover:text-dracula-purple transition-colors font-mono relative group"
              @click.prevent="scrollToSection(item.href)"
            >
              <span class="text-dracula-purple mr-1">.</span>{{ item.name.toLowerCase() }}()
              <span
                class="absolute -bottom-1 left-0 w-0 h-0.5 bg-dracula-purple transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div class="flex items-center">
          <!-- Mobile menu button -->
          <BaseButton
            variant="ghost"
            size="sm"
            class="md:hidden p-1.5 sm:p-2 text-dracula-comment hover:text-dracula-purple"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <XMarkIcon v-if="isMobileMenuOpen" class="h-5 w-5 sm:h-6 sm:w-6" />
            <Bars3Icon v-else class="h-5 w-5 sm:h-6 sm:w-6" />
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
            class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dracula-background border-t border-gray-500 shadow-lg"
          >
            <a
              v-for="item in navigation"
              :key="item.name"
              :href="item.href"
              class="text-dracula-comment hover:text-dracula-purple block px-3 py-3 text-sm sm:text-base font-mono transition-colors rounded-lg hover:bg-dracula-selection"
              @click.prevent="
                () => {
                  scrollToSection(item.href)
                  isMobileMenuOpen = false
                }
              "
            >
              <span class="text-dracula-purple mr-1">.</span>{{ item.name.toLowerCase() }}()
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
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'Tentang', href: '#about' },
  { name: 'Pengalaman', href: '#experience' },
  { name: 'Proyek', href: '#projects' },
  { name: 'Keahlian', href: '#skills' },
  { name: 'Kontak', href: '#contact' },
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
</script>
