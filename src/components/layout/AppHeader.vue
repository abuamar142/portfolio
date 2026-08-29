<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-border">
    <nav class="max-w-3xl mx-auto px-6">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <router-link
          to="/"
          class="text-text-primary font-medium text-sm tracking-tight hover:text-accent transition-colors duration-150"
        >
          abuamar
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
            class="text-xs text-text-muted hover:text-text-primary transition-colors duration-150"
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
            <X v-if="isMobileMenuOpen" class="h-4 w-4" />
            <Menu v-else class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="isMobileMenuOpen" id="mobile-menu" class="md:hidden pb-3" role="menu">
          <div class="space-y-0.5 border-t border-border pt-2">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
              class="text-text-muted hover:text-text-primary block px-2 py-2 text-xs transition-colors duration-150 rounded hover:bg-surface-overlay"
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
