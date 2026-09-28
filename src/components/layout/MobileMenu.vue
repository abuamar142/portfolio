<template>
  <div class="border-t border-base-300 min-[1200px]:hidden">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="open" id="mobile-menu" ref="menuRef" class="wrap pb-4">
        <ul class="border-t border-hairline-light pt-2">
          <li v-for="item in fullNav" :key="item.href">
            <component
              :is="item.route ? 'router-link' : 'a'"
              :to="item.route ? item.href : undefined"
              :href="item.route ? undefined : item.href"
              class="flex min-h-11 items-center justify-between gap-3 px-1 text-[15px] text-ink-2 transition-colors hover:bg-surface-green hover:text-base-content"
              @click="$emit('close')"
            >
              <span class="flex items-baseline gap-3">
                <span v-if="item.no" class="row-place">{{ item.no }}</span>
                <span>{{ $t(item.label) }}</span>
              </span>
              <ArrowUpRight class="size-4 shrink-0 text-ink-4" aria-hidden="true" />
            </component>
          </li>
        </ul>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-hairline-light pt-3">
          <div class="flex items-center gap-4">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
          <a :href="resumeHref" target="_blank" rel="noopener" class="btn btn-sm min-h-11">
            {{ $t('hero.cta.resume') }}
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import LanguageDropdown from '@/components/LanguageDropdown.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

interface MenuItem {
  href: string
  no?: string
  label: string
  route: boolean
}

const props = defineProps<{
  open: boolean
  fullNav: MenuItem[]
  resumeHref: string
}>()

const emit = defineEmits<{
  close: []
}>()

/**
 * Keyboard containment for the open menu. It is not a modal dialog, but while
 * it covers the page, Tab used to walk straight out of it into the content
 * behind (WCAG 2.4.3): the user could not tell where focus had gone and had to
 * Tab through the whole page to get back.
 *
 * The background is marked `inert` (out of the tab order and off the a11y
 * tree) and Tab wraps between the first and last control of the menu, the same
 * contract BaseModal gives every dialog.
 */
const menuRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

function focusable(): HTMLElement[] {
  const root = menuRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.checkVisibility?.({ checkOpacity: false, checkVisibilityCSS: true }) ?? true,
  )
}

function setBackgroundInert(inert: boolean) {
  if (typeof document === 'undefined') return
  const app = document.getElementById('app')
  if (!app || !menuRef.value) return
  // Walk from the menu up to #app, marking every sibling subtree inert. The
  // header containing the menu is never inerted (that would inert the menu
  // itself), but its other children are.
  let node: HTMLElement | null = menuRef.value
  while (node && node !== app) {
    const parent: HTMLElement | null = node.parentElement
    if (!parent) break
    for (const sibling of Array.from(parent.children) as HTMLElement[]) {
      if (sibling === node) continue
      if (inert) sibling.setAttribute('inert', '')
      else sibling.removeAttribute('inert')
    }
    node = parent
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }
  if (e.key !== 'Tab') return
  const items = focusable()
  if (items.length === 0) return
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement as HTMLElement | null
  if (e.shiftKey && (active === first || !menuRef.value?.contains(active))) {
    e.preventDefault()
    last.focus()
    return
  }
  if (!e.shiftKey && (active === last || !menuRef.value?.contains(active))) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', handleKeydown, true)
      setBackgroundInert(true)
      nextTick(() => focusable()[0]?.focus())
    } else {
      document.removeEventListener('keydown', handleKeydown, true)
      setBackgroundInert(false)
      const target = previouslyFocused
      previouslyFocused = null
      if (target && document.contains(target)) nextTick(() => target.focus())
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown, true)
  setBackgroundInert(false)
})
</script>
