<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle"
  >
    <nav class="max-w-5xl mx-auto px-6">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link
          to="/"
          class="text-text-primary font-semibold text-base tracking-tight hover:text-accent transition-colors duration-200"
        >
          abuamar
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
            class="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            {{ $t(item.name) }}
          </router-link>
          <LanguageDropdown />
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center gap-3">
          <LanguageDropdown />
          <button
            class="text-text-muted hover:text-text-primary transition-colors p-1"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <X v-if="isMobileMenuOpen" class="h-5 w-5" />
            <Menu v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="isMobileMenuOpen" id="mobile-menu" class="md:hidden pb-4" role="menu">
          <div class="space-y-1 border-t border-border-subtle pt-4">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
              class="text-text-muted hover:text-text-primary block px-3 py-2.5 text-sm transition-colors duration-200 rounded-md hover:bg-surface-overlay"
              @click="isMobileMenuOpen = false"
            >
              {{ $t(item.name) }}
            </router-link>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import LanguageDropdown from '@/components/LanguageDropdown.vue'

const isMobileMenuOpen = ref(false)

const navigation = [
  { name: 'navigation.about', href: '#about' },
  { name: 'navigation.experience', href: '#experiences' },
  { name: 'navigation.projects', href: '#projects' },
  { name: 'navigation.blog', href: '/blogs', isRoute: true },
  { name: 'navigation.contact', href: '#contact' },
]
</script>
