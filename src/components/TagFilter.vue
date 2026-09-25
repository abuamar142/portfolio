<template>
  <!-- Few tags: every tag visible at a glance, exactly the original chip row. -->
  <div v-if="tags.length" ref="rootEl" :class="dense ? 'relative' : 'flex flex-wrap items-center gap-2'">
    <template v-if="!dense">
      <button
        type="button"
        :class="['chip', !model ? 'chip-accent' : '']"
        @click="pick('')"
      >{{ allLabel }}</button>
      <button
        v-for="t in tags"
        :key="t.tag"
        type="button"
        :class="['chip', model === t.tag ? 'chip-accent' : '']"
        @click="pick(t.tag)"
      >
        #{{ t.tag }} <span class="text-ink-4">({{ t.count }})</span>
      </button>
    </template>

    <!--
      Many tags: one trigger keeps the row short instead of wrapping 16+ chips.
      The menu follows the ShareButton pattern: role/menuitemradio, Escape in
      the capture phase (so a dialog behind it stays open), outside click.
    -->
    <template v-else>
      <button
        ref="triggerEl"
        type="button"
        class="chip"
        :class="model ? 'chip-accent' : ''"
        aria-haspopup="menu"
        :aria-expanded="open"
        :aria-label="model ? `Tag: #${model}` : 'Tag'"
        @click="toggle"
      >
        <Funnel :size="14" aria-hidden="true" />
        {{ model ? `#${model}` : 'Tag' }}
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
          role="menuitemradio"
          :aria-checked="!model"
          class="btn btn-ghost btn-sm w-full justify-start gap-2"
          @click="pick('')"
        >
          <Check v-if="!model" :size="14" aria-hidden="true" />
          <span v-else class="w-3.5" aria-hidden="true" />
          {{ allLabel }}
        </button>
        <button
          v-for="t in tags"
          :key="t.tag"
          type="button"
          role="menuitemradio"
          :aria-checked="model === t.tag"
          class="btn btn-ghost btn-sm w-full justify-start gap-2"
          @click="pick(t.tag)"
        >
          <Check v-if="model === t.tag" :size="14" aria-hidden="true" />
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

export interface TagCount {
  tag: string
  count: number
}

const props = defineProps<{
  tags: TagCount[]
  /** "All" label — pass a translated string. */
  allLabel: string
}>()

const model = defineModel<string>({ default: '' })

/** Above this many tags the row collapses into the popover. */
const DENSE_LIMIT = 8
const dense = computed(() => props.tags.length > DENSE_LIMIT)

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)

function toggle() {
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

function pick(value: string) {
  if (model.value !== value) model.value = value
  if (dense.value) close(true)
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
