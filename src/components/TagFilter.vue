<template>
  <!--
    Few tags: every tag visible at a glance — the original chip row, now with
    multi-select toggles. Many tags: one trigger keeps the row short.

    The model is the comma-joined string that goes straight into ?tag=a,b —
    parsing lives here, so pages, useQueryRef and the services stay string.
  -->
  <div v-if="tags.length" ref="rootEl" :class="dense ? 'relative' : 'flex flex-wrap items-center gap-2'">
    <template v-if="!dense">
      <button
        type="button"
        :class="['chip', selected.length === 0 ? 'chip-accent' : '']"
        :aria-pressed="selected.length === 0 ? 'true' : undefined"
        @click="clear()"
      >{{ allLabel }}</button>
      <button
        v-for="t in tags"
        :key="t.tag"
        type="button"
        class="chip"
        :class="isSelected(t.tag) ? 'chip-accent' : ''"
        :aria-pressed="isSelected(t.tag) ? 'true' : 'false'"
        @click="toggle(t.tag)"
      >
        #{{ t.tag }} <span class="text-ink-4">({{ t.count }})</span>
      </button>
    </template>

    <template v-else>
      <button
        ref="triggerEl"
        type="button"
        class="chip"
        :class="selected.length ? 'chip-accent' : ''"
        aria-haspopup="menu"
        :aria-expanded="open"
        :aria-label="triggerLabel"
        @click="toggleOpen"
      >
        <Funnel :size="14" aria-hidden="true" />
        {{ selected.length ? `${'Tag'} (${selected.length})` : 'Tag' }}
        <ChevronDown :size="14" aria-hidden="true" />
      </button>

      <div
        v-if="open"
        ref="menuEl"
        role="menu"
        aria-label="Tag"
        class="absolute left-0 top-full z-20 mt-2 max-h-64 min-w-[210px] overflow-y-auto overscroll-contain border border-base-300 bg-base-200 p-1 shadow-lg"
      >
        <button
          type="button"
          role="menuitem"
          class="btn btn-ghost btn-sm w-full justify-start gap-2"
          :disabled="selected.length === 0"
          @click="clearAndClose()"
        >
          <Check v-if="selected.length === 0" :size="14" aria-hidden="true" />
          <span v-else class="w-3.5" aria-hidden="true" />
          {{ allLabel }}
        </button>
        <button
          v-for="t in tags"
          :key="t.tag"
          type="button"
          role="menuitemcheckbox"
          :aria-checked="isSelected(t.tag)"
          class="btn btn-ghost btn-sm w-full justify-start gap-2"
          @click="toggle(t.tag)"
        >
          <Check v-if="isSelected(t.tag)" :size="14" aria-hidden="true" />
          <span v-else class="w-3.5" aria-hidden="true" />
          #{{ t.tag }} <span class="text-ink-4">({{ t.count }})</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ChevronDown, Check, Funnel } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'

export interface TagCount {
  tag: string
  count: number
}

const props = defineProps<{
  tags: TagCount[]
  /** "All" label — pass a translated string. */
  allLabel: string
}>()

/** Comma-joined selection: what ends up in ?tag=a,b. */
const model = defineModel<string>({ default: '' })

const toast = useToast()
const { t } = useI18n()

/** Same cap as tag creation per item — keeps the URL short. */
const MAX_SELECTED = 5
/** Above this many tags the row collapses into the popover. */
const DENSE_LIMIT = 8

const dense = computed(() => props.tags.length > DENSE_LIMIT)

const selected = computed(() => (model.value ? model.value.split(',').filter(Boolean) : []))

const triggerLabel = computed(() => {
  if (selected.value.length === 0) return 'Tag'
  return `Tag: ${selected.value.map((t) => `#${t}`).join(', ')}`
})

function isSelected(tag: string): boolean {
  return selected.value.includes(tag)
}

function toggle(tag: string) {
  const cur = selected.value
  if (cur.includes(tag)) {
    model.value = cur.filter((t) => t !== tag).join(',')
    return
  }
  if (cur.length >= MAX_SELECTED) {
    toast.error(t('common.tagMax'))
    return
  }
  model.value = [...cur, tag].join(',')
}

function clear() {
  model.value = ''
}

function clearAndClose() {
  model.value = ''
  close(true)
}

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)

function toggleOpen() {
  if (open.value) close()
  else void openMenu()
}

async function openMenu() {
  open.value = true
  await nextTick()
  menuEl.value?.querySelector<HTMLElement>('button')?.focus()
}

function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) triggerEl.value?.focus()
}

// Capture phase: a dialog underneath (BaseModal) also listens for Escape on
// document — closing the menu must not close it too.
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    close(true)
  }
}

function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown, true)
  document.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, true)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>
