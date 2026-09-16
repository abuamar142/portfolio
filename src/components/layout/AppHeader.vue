<template>
  <header class="fixed inset-x-0 top-5 z-50 hidden justify-center px-6 md:flex">
    <nav
      class="flex items-center gap-1 rounded-full border border-base-300/60 bg-base-200/80 p-1.5 shadow-md shadow-black/5 backdrop-blur-md"
      aria-label="Primary"
    >
      <PillNav :section-nav="sectionNav" :active-id="activeSection" :is-blog-route="isBlogRoute" />
    </nav>
  </header>
  <!-- Compact bar: mobile + blog context (pill hides on small screens, like reference). -->
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-base-300 bg-base-100/85 backdrop-blur-md md:hidden"
  >
    <nav class="wrap" aria-label="Primary">
      <div class="flex h-16 items-center justify-between gap-4">
        <router-link to="/" class="flex items-center gap-2.5" @click="isMenuOpen = false">
          <span
            class="flex size-8 items-center justify-center rounded-md border border-base-300 bg-base-200 font-mono text-[11px] font-semibold tracking-wider text-base-content"
            aria-hidden="true"
          >
            {{ profile.initials }}
          </span>
          <span class="font-display text-[17px] tracking-tight text-base-content">Abu Amar</span>
        </router-link>
        <button
          type="button"
          class="btn btn-ghost btn-square size-11"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
          @click="isMenuOpen = !isMenuOpen"
        >
          <X v-if="isMenuOpen" class="size-5" aria-hidden="true" />
          <Menu v-else class="size-5" aria-hidden="true" />
        </button>
      </div>
      <MobileMenu
        :open="isMenuOpen"
        :full-nav="fullNav"
        :resume-href="profile.resume"
        @close="isMenuOpen = false"
      />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import PillNav from '@/components/layout/PillNav.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import { profile } from '@/data/profile'

const route = useRoute()
const isMenuOpen = ref(false)
const activeSection = ref('')

/** In-page sections, in document order. */
const sectionNav = [
  { id: 'about', label: 'navigation.about' },
  { id: 'experiences', label: 'navigation.experience' },
  { id: 'projects', label: 'navigation.projects' },
  { id: 'education', label: 'navigation.education' },
  { id: 'achievements', label: 'navigation.achievements' },
  { id: 'contact', label: 'navigation.contact' },
]

/** Mobile menu: in-page sections plus the blog route. */
const fullNav = [
  ...sectionNav.map((item) => ({ href: `#${item.id}`, label: item.label, route: false })),
  { href: '/blogs', label: 'navigation.blog', route: true },
]

const isBlogRoute = computed(() => route.path.startsWith('/blogs'))

let observer: IntersectionObserver | null = null

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)

  if (!('IntersectionObserver' in window)) return

  const sections = sectionNav
    .map((item) => document.getElementById(item.id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (!sections.length) return

  // A section is "current" while its top passes through the upper-middle band
  // of the viewport.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
  )

  sections.forEach((section) => observer?.observe(section))
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
})
</script>
