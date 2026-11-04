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
        <!-- Command mode: `>` turns the palette into an action list. -->
        <template v-if="commandMode">
          <p v-if="commands.length === 0" class="px-4 py-8 text-center text-sm text-ink-4">
            {{ $t('cmdk.noCommand', { query: commandQuery }) }}
          </p>
          <button
            v-for="(command, index) in commands"
            :id="`cmdk-cmd-${command.id}`"
            :key="command.id"
            type="button"
            role="option"
            :aria-selected="index === activeIndex"
            class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
            :class="index === activeIndex ? 'bg-base-300' : 'hover:bg-base-200'"
            @click="runCommand(command)"
            @mouseenter="activeIndex = index"
          >
            <Terminal
              class="mt-1 size-3.5 shrink-0"
              :class="index === activeIndex ? 'text-primary' : 'text-ink-4'"
              aria-hidden="true"
            />
            <span class="min-w-0">
              <span class="block truncate font-sans text-sm text-base-content">{{ command.label }}</span>
              <span class="mt-0.5 block truncate font-mono text-[11px] text-ink-4">{{ command.hint }}</span>
            </span>
          </button>
        </template>

        <p v-else-if="!query.trim()" class="px-4 py-8 text-center text-sm text-ink-4">
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
import { Search as SearchIcon, ArrowRight, Terminal } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useGlobalSearch } from '@/composables/useGlobalSearch'
import { groupByKind, highlightParts, rankItems, type SearchHit, type SearchItem } from '@/lib/search'
import {
  commandText,
  isCommandQuery,
  matchCommands,
  type CommandDef,
  type CommandId,
} from '@/lib/commands'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'

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
const { set: setTheme } = useTheme()
const { locale } = useI18n()

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

const commandMode = computed(() => isCommandQuery(query.value))
const commandQuery = computed(() => commandText(query.value))
const commands = computed<CommandDef[]>(() =>
  commandMode.value ? matchCommands(commandQuery.value) : [],
)

const hits = computed<SearchHit[]>(() =>
  commandMode.value ? [] : rankItems(items.value, query.value, 30),
)
const groups = computed(() => groupByKind(hits.value))
const partial = computed(() => failed.value.length > 0)

const flatIndex = (hit: SearchHit): number => hits.value.findIndex((h) => h.id === hit.id)

// The ranked list can shrink or reorder after a new response lands; without
// this the index points past the end and no row looks selected.
// Both lists can shrink; the index must never point past the end in either
// mode, or Enter would fire whatever happens to sit at that index.
watch([hits, commands], () => {
  if (activeIndex.value > rowCount.value - 1) activeIndex.value = 0
})

// Typing or deleting the `>` switches modes, and the old index means nothing
// in the new list.
watch(commandMode, () => {
  activeIndex.value = 0
})
const activeId = computed(() => {
  if (commandMode.value) {
    const command = commands.value[activeIndex.value]
    return command ? `cmdk-cmd-${command.id}` : undefined
  }
  const hit = hits.value[activeIndex.value]
  return hit ? `cmdk-${hit.id}` : undefined
})

/** `activeId` is the DOM id (prefixed); rows compare by item id. */
function isActive(hit: SearchHit): boolean {
  return hits.value[activeIndex.value]?.id === hit.id
}

/** How many rows the current mode shows — the palette has two lists. */
const rowCount = computed(() => (commandMode.value ? commands.value.length : hits.value.length))

function move(delta: number) {
  if (rowCount.value === 0) return
  const next = activeIndex.value + delta
  // Wrapping keeps a long list navigable with one key.
  activeIndex.value = (next + rowCount.value) % rowCount.value
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
      activeIndex.value = Math.max(rowCount.value - 1, 0)
      return
    case 'Enter': {
      if (commandMode.value) {
        const command = commands.value[activeIndex.value]
        if (command) {
          event.preventDefault()
          runCommand(command)
        }
        return
      }
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

/** Runs a command: theme and language are applied in place, no navigation. */
function runCommand(command: CommandDef) {
  switch (command.id as CommandId) {
    case 'theme-dark':
      setTheme('dark')
      break
    case 'theme-light':
      setTheme('light')
      break
    case 'theme-system':
      setTheme('system')
      break
    case 'lang-id':
      locale.value = 'id'
      try {
        localStorage.setItem('portfolio-language', 'id')
      } catch {}
      break
    case 'lang-en':
      locale.value = 'en'
      try {
        localStorage.setItem('portfolio-language', 'en')
      } catch {}
      break
  }
  emit('close')
}
</script>
