<template>
  <!-- Dossier spine: fixed numbered rail (≥1100px). Global: links route-aware. -->
  <nav class="spine" aria-label="Sections">
    <span class="spine-track" aria-hidden="true"></span>
    <span class="spine-progress" aria-hidden="true"></span>
    <div class="spine-labels">
      <div
        v-for="item in sectionNav"
        :key="item.id"
        class="spine-item"
        :class="{ 'is-active': activeSection === item.id }"
      >
        <router-link :to="{ path: '/', hash: '#' + item.id }">
          {{ item.no }} / {{ $t(item.label) }}
        </router-link>
      </div>
    </div>
  </nav>

  <!-- Masthead -->
  <header class="sticky top-0 z-50 border-b border-base-300 bg-base-100">
    <div class="wrap flex min-h-14 items-center justify-between gap-3 md:gap-6">
      <router-link
        to="/"
        class="masthead-name flex min-h-11 min-w-0 items-center"
        @click="isMenuOpen = false"
      >
        <span class="truncate">{{ identity?.fullname ?? '' }}</span>
      </router-link>

      <nav class="masthead-nav hidden min-[1200px]:flex" aria-label="Primary">
        <router-link
          v-for="item in sectionNav"
          :key="item.id"
          :to="{ path: '/', hash: '#' + item.id }"
          :class="{ 'is-active': activeSection === item.id }"
        >
          {{ $t(item.label) }}
        </router-link>
        <router-link to="/explore" :aria-current="isExploreRoute ? 'page' : undefined">
          {{ $t('navigation.explore') }}
        </router-link>
      </nav>

      <div class="flex shrink-0 items-center gap-3">
        <!-- Utilities move into the open menu below, so the row keeps only the close button. -->
        <template v-if="!isMenuOpen">
          <LanguageDropdown />
          <ThemeToggle />
        </template>
        <button
          type="button"
          class="btn btn-ghost btn-square size-11 min-[1200px]:hidden"
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

    <!-- Dropdown below the masthead row, full width under its top hairline. -->
    <MobileMenu
      :open="isMenuOpen"
      :full-nav="fullNav"
      :resume-href="SITE_RESUME_PATH"
      @close="isMenuOpen = false"
    />
  </header>

  <!-- Numbered section strip: small screens + tablets. Global: links route-aware. -->
  <nav class="spine-mobile" aria-label="Sections">
    <div class="spine-mobile-inner">
      <router-link
        v-for="item in sectionNav"
        :key="item.id"
        :to="{ path: '/', hash: '#' + item.id }"
        :class="{ 'is-active': activeSection === item.id }"
      >
        <span class="marker-sm" aria-hidden="true"></span>
        {{ item.no }} / {{ $t(item.label) }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { SITE_RESUME_PATH, useIdentity } from '@/composables/useIdentity'
import { usePortfolio } from '@/composables/usePortfolio'

const { identity } = useIdentity()
const { loading } = usePortfolio()
const route = useRoute()
const isMenuOpen = ref(false)
const activeSection = ref('')

/** In-page sections, in document order. `no` drives spine, strip and section heads. */
const sectionNav = [
  { id: 'about', no: '01', label: 'navigation.about' },
  { id: 'experiences', no: '02', label: 'navigation.experience' },
  { id: 'projects', no: '03', label: 'navigation.projects' },
  { id: 'skills', no: '04', label: 'navigation.skills' },
  { id: 'education', no: '05', label: 'navigation.education' },
  { id: 'achievements', no: '06', label: 'navigation.achievements' },
  { id: 'contact', no: '07', label: 'navigation.contact' },
]

/** Mobile menu: numbered sections plus the explore route. Always route links so
 *  they navigate home from /quotes, /blogs and /explore (bare #hash would not). */
const fullNav = [
  ...sectionNav.map((item) => ({
    href: `/#${item.id}`,
    no: item.no,
    label: item.label,
    route: true,
  })),
  { href: '/explore', no: '', label: 'navigation.explore', route: true },
]

const isExploreRoute = computed(
  () =>
    route.path === '/explore' ||
    route.path.startsWith('/blogs') ||
    route.path === '/quotes',
)

/* ── Scrollspy ───────────────────────────────────────────────────────────────
   Lives and dies with the landing route. Sections only mount after the
   portfolio data loads (skeleton first) and some render as async chunks, so
   connecting waits for `loading` to flip and then polls briefly until every
   section id exists. Rebuilt on every entry to '/' — an observer created once
   at app mount goes stale after a route round-trip (its elements unmount). */
let observer: IntersectionObserver | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null
let retryCount = 0

const stopScrollspy = () => {
  observer?.disconnect()
  observer = null
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
  retryCount = 0
  activeSection.value = ''
}

const startScrollspy = () => {
  stopScrollspy()
  if (!('IntersectionObserver' in window)) return

  const connect = () => {
    if (route.path !== '/') return
    const sections = sectionNav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (sections.length < sectionNav.length && retryCount < 30) {
      retryCount += 1
      retryTimer = setTimeout(connect, 400)
      return
    }
    if (!sections.length) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection.value = entry.target.id
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer?.observe(section))
  }

  connect()
}

watch(
  [() => route.path, loading],
  ([path, isLoading]) => {
    if (path === '/' && !isLoading) startScrollspy()
    else if (path !== '/') stopScrollspy()
  },
  { immediate: true },
)

// Keep the active strip cell visible on small screens (the mobile twin of the
// desktop spine). `block: 'nearest'` avoids vertical movement; horizontal
// scrolling only happens inside the strip's own overflow.
watch(activeSection, async (id) => {
  if (!id || typeof document === 'undefined') return
  // Pre-flush watcher: wait for the class to land on the cell before centering.
  await nextTick()
  document
    .querySelector('.spine-mobile a.is-active')
    ?.scrollIntoView({ block: 'nearest', inline: 'center' })
})

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') isMenuOpen.value = false
}

// Client-only lifecycle: document access stays out of SSR.
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKeydown)
}

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onKeydown)
  }
  stopScrollspy()
})
</script>
