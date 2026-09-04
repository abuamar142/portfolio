<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 border-b"
    style="background: var(--color-bg); border-color: var(--color-border)"
  >
    <nav class="max-w-[1280px] mx-auto px-6 md:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Monogram / wordmark -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 group"
          aria-label="Home"
        >
          <span
            class="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-medium tracking-widest border"
            style="background: var(--color-surface-raised); border-color: var(--color-border); color: var(--color-text-primary)"
          >
            A
          </span>
          <span class="text-sm font-medium tracking-tight" style="color: var(--color-text-primary)">abuamar</span>
          <span class="hidden sm:inline text-[11px] font-mono tracking-[0.14em] uppercase ml-1" style="color: var(--color-text-faint)">— portfolio 2026</span>
        </router-link>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-7">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
            class="text-[11px] font-mono tracking-wide transition-colors duration-150 hover:opacity-100"
            style="color: var(--color-text-muted)"
            active-class="!text-[var(--color-text-primary)]"
          >
            {{ $t(item.name) }}
          </router-link>
          <div class="h-4 w-px" style="background: var(--color-border)"></div>
          <LanguageDropdown />
        </div>

        <!-- Mobile -->
        <div class="md:hidden flex items-center gap-2">
          <LanguageDropdown />
          <button
            class="w-8 h-8 inline-flex items-center justify-center rounded-md border transition-colors"
            :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)', background: isMobileMenuOpen ? 'var(--color-surface-raised)' : 'transparent' }"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <X v-if="isMobileMenuOpen" class="h-4 w-4" />
            <Menu v-else class="h-4 w-4" />
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="isMobileMenuOpen" id="mobile-menu" class="md:hidden pb-4" role="menu">
          <div class="border-t pt-3 mt-1 space-y-0.5" style="border-color: var(--color-border)">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.isRoute ? item.href : { path: '/', hash: item.href }"
              class="flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-colors"
              style="color: var(--color-text-secondary); background: transparent"
              @click="isMobileMenuOpen = false"
            >
              <span>{{ $t(item.name) }}</span>
              <span class="text-[11px] font-mono" style="color: var(--color-text-faint)">→</span>
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
  { name: 'navigation.education', href: '#education' },
  { name: 'navigation.achievements', href: '#achievements' },
  { name: 'navigation.blog', href: '/blogs', isRoute: true },
  { name: 'navigation.contact', href: '#contact' },
]
</script>
