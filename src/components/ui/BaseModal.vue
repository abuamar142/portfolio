<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      :class="['modal', open ? 'modal-open' : '']"
      :aria-labelledby="labelledBy || undefined"
      aria-modal="true"
      tabindex="-1"
      @click.self="handleBackdropClick"
      @cancel.prevent="handleCancel"
    >
      <div class="modal-box overscroll-contain" :class="boxClass">
        <button
          type="button"
          :aria-label="closeLabel"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="requestClose"
        >
          <X :size="16" aria-hidden="true" />
        </button>
        <slot />
      </div>
      <div class="modal-backdrop" @click="requestClose" />
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

/**
 * Behaviour shared by every dialog in the app:
 *
 * - focus is trapped inside while open, and returns to the trigger on close
 * - the page behind cannot scroll (and cannot be scrolled past the dialog,
 *   thanks to `overscroll-contain` on the box)
 * - Escape and a backdrop click both close
 * - `inert` on the app root keeps the background out of the tab order
 *
 * The previous per-modal `useEscapeToClose` listener is superseded here: the
 * native <dialog> `cancel` event covers Escape without a document listener.
 */
const props = defineProps<{
  open: boolean
  boxClass?: string
  /** id of the element that names this dialog, for aria-labelledby. */
  labelledBy?: string
  /** Accessible name for the close button — pass a translated string. */
  closeLabel: string
}>()

const emit = defineEmits<{ close: [] }>()

const dialogRef = ref<HTMLDialogElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function focusable(): HTMLElement[] {
  const root = dialogRef.value
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false
    // `offsetParent` is unreliable here (a positioned/transformed ancestor can
    // make it null even when the control is visible), so prefer
    // checkVisibility() where available and fall back to offsetParent.
    if (typeof el.checkVisibility === 'function') {
      return el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })
    }
    return el.offsetParent !== null || el === document.activeElement
  })
}

function requestClose() {
  emit('close')
}

function handleCancel() {
  emit('close')
}

function handleBackdropClick() {
  emit('close')
}

/**
 * Manual trap. The dialog is shown with the `modal-open` class rather than
 * `showModal()`, so there is no native focus containment — Tab out of the
 * last control would otherwise land on <body>. Handle both the wrap case and
 * the case where focus has already escaped.
 */
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    // Explicit: relying on the native `cancel` event alone proved unreliable
    // when the dialog is opened via the `modal-open` class rather than
    // showModal(), so close here too.
    e.preventDefault()
    requestClose()
    return
  }
  if (e.key !== 'Tab') return
  const root = dialogRef.value
  if (!root) return
  const items = focusable()
  if (items.length === 0) {
    e.preventDefault()
    root.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (e.shiftKey) {
    // Backwards past the first control (or focus already escaped) → last.
    if (active === first || !root.contains(active)) {
      e.preventDefault()
      last.focus()
    }
    return
  }
  // Forwards past the last control (or focus already escaped) → first.
  if (active === last || !root.contains(active)) {
    e.preventDefault()
    first.focus()
  }
}

function lockScroll(lock: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

function setInert(inert: boolean) {
  if (typeof document === 'undefined') return
  const app = document.getElementById('app')
  if (!app) return
  if (inert) app.setAttribute('inert', '')
  else app.removeAttribute('inert')
}

function activate() {
  // Capture the trigger BEFORE inert (which can blur it) and before we move
  // focus into the dialog.
  if (!previouslyFocused) {
    const el = document.activeElement as HTMLElement | null
    previouslyFocused = el && el !== document.body ? el : null
  }
  lockScroll(true)
  setInert(true)
  document.addEventListener('keydown', handleKeydown)
  nextTick(() => {
    const items = focusable()
    ;(items[0] ?? dialogRef.value)?.focus()
  })
}

function deactivate() {
  document.removeEventListener('keydown', handleKeydown)
  lockScroll(false)
  setInert(false)
  // Return focus to whatever opened the dialog. Do this after clearing
  // `inert`, otherwise focusing an element inside #app is a no-op.
  const target = previouslyFocused
  previouslyFocused = null
  if (target && document.contains(target)) {
    nextTick(() => target.focus())
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) activate()
    else deactivate()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  lockScroll(false)
  setInert(false)
})
</script>
