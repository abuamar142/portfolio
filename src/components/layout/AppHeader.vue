<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-base-300 bg-base-100/85 backdrop-blur-md">
    <nav class="wrap" aria-label="Primary">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Identity -->
        <router-link to="/" class="flex items-center gap-2.5" @click="isMenuOpen = false">
          <span
            class="flex size-8 items-center justify-center rounded-md border border-base-300 bg-base-200 font-mono text-[11px] font-semibold tracking-wider text-base-content"
            aria-hidden="true"
          >
            AA
          </span>
          <span class="flex flex-col leading-none">
            <span class="font-display text-[17px] tracking-tight text-base-content">Abu Amar</span>
            <span class="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 sm:block">
              {{ $t('footer.role') }}
            </span>
          </span>
        </router-link>

        <!-- Desktop navigation -->
        <ul class="hidden items-center gap-0.5 lg:flex">
          <li v-for="item in sectionNav" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="block rounded-md px-3 py-2 text-[13px] transition-colors"
              :class="
                activeSection === item.id ? 'text-base-content' : 'text-ink-3 hover:text-base-content'
              "
              :aria-current="activeSection === item.id ? 'true' : undefined"
            >
              {{ $t(item.label) }}
            </a>
          </li>
          <li>
            <router-link
              to="/blogs"
              class="block rounded-md px-3 py-2 text-[13px] transition-colors"
              :class="isBlogRoute ? 'text-base-content' : 'text-ink-3 hover:text-base-content'"
              :aria-current="isBlogRoute ? 'page' : undefined"
            >
              {{ $t('navigation.blog') }}
            </router-link>
          </li>
        </ul>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <LanguageDropdown class="hidden sm:block" />
          <a href="/cv.pdf" target="_blank" rel="noopener" class="btn btn-sm hidden md:inline-flex">
            {{ $t('hero.cta.resume') }}
          </a>
          <button
            type="button"
            class="btn btn-ghost btn-square size-11 lg:hidden"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
            @click="isMenuOpen = !isMenuOpen"
          >
            <X v-if="isMenuOpen" class="size-5" aria-hidden="true" />
            <Menu v-else class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="isMenuOpen" id="mobile-menu" class="pb-4 lg:hidden">
          <ul class="border-t border-base-300 pt-3">
            <li v-for="item in fullNav" :key="item.href">
              <component
                :is="item.route ? 'router-link' : 'a'"
                :to="item.route ? item.href : undefined"
                :href="item.route ? undefined : item.href"
                class="flex min-h-11 items-center justify-between rounded-md px-2 text-[15px] text-ink-2 transition-colors hover:bg-base-200 hover:text-base-content"
                @click="isMenuOpen = false"
              >
                <span>{{ $t(item.label) }}</span>
                <ArrowUpRight class="size-4 text-ink-4" aria-hidden="true" />
              </component>
            </li>
          </ul>
          <div class="mt-3 flex items-center justify-between gap-3 border-t border-base-300 pt-3">
            <LanguageDropdown />
            <a href="/cv.pdf" target="_blank" rel="noopener" class="btn btn-sm min-h-11">
              {{ $t('hero.cta.resume') }}
            </a>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRight, Menu, X } from 'lucide-vue-next'
import LanguageDropdown from '@/components/LanguageDropdown.vue'

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
