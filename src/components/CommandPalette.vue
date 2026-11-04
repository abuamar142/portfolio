<template>
  <BaseModal
    :open="open"
    box-class="max-w-2xl !p-0"
    labelled-by="cmdk-label"
    :close-label="$t('cmdk.close')"
    initial-focus="#cmdk-input"
    @close="$emit('close')"
  >
    <div class="flex flex-col">
      <h2 id="cmdk-label" class="sr-only">{{ $t('cmdk.dialogLabel') }}</h2>

      <div class="flex items-center gap-3 border-b border-base-300 px-4 py-3">
        <SearchIcon class="size-4 shrink-0 text-ink-4" aria-hidden="true" />
        <input
          id="cmdk-input"
          ref="inputEl"
          v-model="query"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-results"
          :aria-activedescendant="activeId"
          autocomplete="off"
          spellcheck="false"
          class="w-full bg-transparent font-sans text-sm text-base-content placeholder:text-ink-4 focus:outline-none"
          :placeholder="$t('cmdk.placeholder')"
          @keydown="onKeydown"
        />
        <button
          type="button"
          class="btn btn-ghost btn-xs shrink-0"
          :aria-label="$t('cmdk.close')"
          @click="$emit('close')"
        >
          <span class="font-mono text-xs">esc</span>
        </button>
      </div>

      <p v-if="partial" class="border-b border-base-300 px-4 py-2 font-mono text-[11px] text-warning">
        {{ $t('cmdk.partial', { sources: failed.join(', ') }) }}
      </p>

      <div id="cmdk-results" role="listbox" class="max-h-[60vh] overflow-y-auto overscroll-contain">
        <p v-if="!query.trim()" class="px-4 py-8 text-center text-sm text-ink-4">
          {{ $t('cmdk.hint') }}
        </p>

        <p v-else-if="loading && hits.length === 0" class="px-4 py-8 text-center text-sm text-ink-4">
          {{ $t('cmdk.searching') }}
        </p>

        <p v-else-if="hits.length === 0" class="px-4 py-8 text-center text-sm text-ink-4">
          {{ $t('cmdk.empty', { query }) }}
        </p>

        <template v-else>
          <div v-for="group in groups" :key="group.kind">
            <p class="label px-4 pb-1 pt-4">
              {{ $t(`cmdk.kinds.${group.kind}`) }} · {{ group.hits.length }}
            </p>
            <button
              v-for="hit in group.hits"
              :id="`cmdk-${hit.id}`"
              :key="hit.id"
              type="button"
              role="option"
              :aria-selected="isActive(hit)"
              class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
              :class="isActive(hit) ? 'bg-base-300' : 'hover:bg-base-200'"
              @click="choose(hit)"
              @mouseenter="activeIndex = flatIndex(hit)"
            >
              <ArrowRight
                class="mt-1 size-3.5 shrink-0"
                :class="isActive(hit) ? 'text-primary' : 'text-ink-4'"
                aria-hidden="true"
              />
              <span class="min-w-0">
                <span class="block truncate font-sans text-sm text-base-content">
                  <template v-for="(part, i) in highlightParts(hit.title, hit.highlights)" :key="i"
                    ><mark v-if="part.match" class="bg-transparent text-primary underline">{{
                      part.text
                    }}</mark
                    ><template v-else>{{ part.text }}</template></template
                  >
                </span>
                <span v-if="hit.subtitle" class="mt-0.5 block truncate font-mono text-[11px] text-ink-4">
                  {{ hit.subtitle }}
                </span>
              </span>
            </button>
          </div>
        </template>
      </div>

      <div class="flex items-center justify-between gap-4 border-t border-base-300 px-4 py-2">
        <span class="font-mono text-[11px] text-ink-4">{{ $t('cmdk.footer') }}</span>
        <span v-if="hits.length" class="font-mono text-[11px] text-ink-4">{{ hits.length }}</span>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search as SearchIcon, ArrowRight } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useGlobalSearch } from '@/composables/useGlobalSearch'
import { groupByKind, highlightParts, rankItems, type SearchHit, type SearchItem } from '@/lib/search'

/**
 * Ctrl/Cmd+K palette.
 *
 * Keyboard model: ↑/↓ move, Enter opens, Escape closes (the dialog's own cancel
 * handles that too). The list is a real listbox, so a screen reader hears
 * "option 3 of 12" instead of floating text, and `aria-activedescendant` keeps
 * the focus in the input rather than moving it down the rows.
 */
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const { loading, failed, search } = useGlobalSearch()

const query = ref('')
const items = ref<SearchItem[]>([])
const inputEl = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

// The corpus loads once per session (see useGlobalSearch), so typing never
// waits on a request: opening the palette starts the load, and the ranking
// re-runs locally on every keystroke.
watch(
  () => props.open,
  (open) => {
    if (!open) {
      query.value = ''
      activeIndex.value = 0
      return
    }
    void nextTick(() => inputEl.value?.focus())
    void load()
  },
)

async function load() {
  items.value = await search()
}

const hits = computed<SearchHit[]>(() => rankItems(items.value, query.value, 30))
const groups = computed(() => groupByKind(hits.value))
const partial = computed(() => failed.value.length > 0)

const flatIndex = (hit: SearchHit): number => hits.value.findIndex((h) => h.id === hit.id)

// The ranked list can shrink or reorder after a new response lands; without
// this the index points past the end and no row looks selected.
watch(hits, (list) => {
  if (activeIndex.value > list.length - 1) activeIndex.value = 0
})
const activeId = computed(() =>
  hits.value[activeIndex.value] ? `cmdk-${hits.value[activeIndex.value]!.id}` : undefined,
)

/** `activeId` is the DOM id (prefixed); rows compare by item id. */
function isActive(hit: SearchHit): boolean {
  return hits.value[activeIndex.value]?.id === hit.id
}

function move(delta: number) {
  if (hits.value.length === 0) return
  const next = activeIndex.value + delta
  // Wrapping keeps a long list navigable with one key.
  activeIndex.value = (next + hits.value.length) % hits.value.length
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      move(1)
      return
    case 'ArrowUp':
      event.preventDefault()
      move(-1)
      return
    case 'Home':
      event.preventDefault()
      activeIndex.value = 0
      return
    case 'End':
      event.preventDefault()
      activeIndex.value = Math.max(hits.value.length - 1, 0)
      return
    case 'Enter': {
      const hit = hits.value[activeIndex.value]
      if (hit) {
        event.preventDefault()
        choose(hit)
      }
      return
    }
  }
}

function choose(hit: SearchHit) {
  emit('close')
  void router.push(hit.to)
}
</script>
