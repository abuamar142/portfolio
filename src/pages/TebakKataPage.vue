<template>
  <PageShell id="tebak-kata" :title="$t('game.title')" :lead="$t('game.dek')">
    <!-- Entry: either open a room or join one by code. -->
    <div v-if="!state" class="panel p-6 md:p-8">
      <div class="grid gap-8 md:grid-cols-2">
        <form class="flex flex-col gap-4" @submit.prevent="onCreate">
          <h2 class="font-sans text-lg font-semibold text-base-content">{{ $t('game.newRoom') }}</h2>
          <label class="form-control">
            <span class="label"><span class="label-text">{{ $t('game.yourName') }}</span></span>
            <input
              v-model="name"
              class="input input-bordered mt-1 w-full"
              maxlength="20"
              autocomplete="nickname"
              :placeholder="$t('game.namePlaceholder')"
            />
          </label>
          <BaseButton type="submit" :loading="busy === 'create'" :disabled="!name.trim()">
            {{ $t('game.create') }}
          </BaseButton>
          <p v-if="error" class="font-mono text-xs text-error" role="alert">{{ error }}</p>
        </form>

        <form class="flex flex-col gap-4 md:border-l md:border-base-300 md:pl-8" @submit.prevent="onJoin">
          <h2 class="font-sans text-lg font-semibold text-base-content">{{ $t('game.joinRoom') }}</h2>
          <label class="form-control">
            <span class="label"><span class="label-text">{{ $t('game.roomCode') }}</span></span>
            <input
              v-model="joinCode"
              class="input input-bordered mt-1 w-full font-mono text-lg uppercase tracking-[0.3em]"
              maxlength="4"
              autocapitalize="characters"
              autocomplete="off"
              spellcheck="false"
              placeholder="ABCD"
            />
          </label>
          <BaseButton type="submit" :loading="busy === 'join'" :disabled="!canJoin">
            {{ $t('game.join') }}
          </BaseButton>
        </form>
      </div>
    </div>

    <!-- Everything below runs inside a room. -->
    <div v-else class="flex flex-col gap-6">
      <div class="panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div class="flex items-center gap-3">
          <span class="label">{{ $t('game.roomCode') }}</span>
          <code class="rounded bg-base-300 px-3 py-1 font-mono text-lg tracking-[0.25em]">{{ state.code }}</code>
          <button
            type="button"
            class="text-xs text-ink-4 underline decoration-dotted hover:text-primary"
            @click="copyInvite"
          >
            {{ copied ? $t('game.copied') : $t('game.copyInvite') }}
          </button>
        </div>
        <div class="flex items-center gap-3">
          <!-- Leaving must be possible in every phase, not only at the end:
               a player who has to go should not be stuck until the game ends. -->
          <button
            type="button"
            class="text-xs text-ink-4 underline decoration-dotted hover:text-error"
            @click="onLeave"
          >
            {{ $t('game.leave') }}
          </button>
          <span class="label">{{ $t('game.language') }}</span>
          <div role="group" :aria-label="$t('game.language')" class="flex">
            <button
              v-for="lang in languages"
              :key="lang.value"
              type="button"
              class="seg"
              :class="{ 'is-active': state.settings.language === lang.value }"
              :aria-pressed="state.settings.language === lang.value"
              :disabled="!isHost || state.phase !== 'lobby'"
              @click="onChangeLanguage(lang.value)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- LOBBY -->
      <div v-if="state.phase === 'lobby'" class="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div class="panel p-6">
          <div class="mb-4 flex items-baseline justify-between">
            <h2 class="font-sans text-lg font-semibold">{{ $t('game.players') }}</h2>
            <span class="font-mono text-xs text-ink-4">{{ state.players.length }}/12</span>
          </div>
          <ul class="flex flex-col divide-y divide-base-300">
            <li v-for="player in state.players" :key="player.id" class="flex items-center gap-3 py-2">
              <span class="text-sm text-base-content">{{ player.name }}</span>
              <span v-if="player.id === state.hostId" class="badge badge-sm">{{ $t('game.host') }}</span>
              <span v-if="player.id === playerId" class="font-mono text-[11px] text-ink-4">
                {{ $t('game.you') }}
              </span>
            </li>
          </ul>
          <p class="mt-4 font-mono text-[11px] text-ink-4">{{ $t('game.shareHint') }}</p>
        </div>

        <div class="panel flex flex-col gap-4 p-6">
          <h2 class="font-sans text-lg font-semibold">{{ $t('game.rules') }}</h2>
          <label v-for="field in ruleFields" :key="field.key" class="form-control">
            <span class="label"><span class="label-text">{{ $t(field.label) }}</span></span>
            <input
              v-model.number="rules[field.key]"
              type="number"
              class="input input-bordered input-sm mt-1 w-full"
              :min="field.min"
              :max="field.max"
              :disabled="!isHost"
            />
          </label>
          <p class="font-mono text-[11px] text-ink-4">{{ $t('game.targetAuto', { target: targetPreview }) }}</p>
          <BaseButton v-if="isHost" :loading="busy === 'start'" @click="onStart">
            {{ $t('game.start') }}
          </BaseButton>
          <p v-else class="text-xs text-ink-4">{{ $t('game.waitingHost') }}</p>
        </div>
      </div>

      <!-- ROUND / REVEAL -->
      <div v-else-if="state.phase === 'round' || state.phase === 'reveal'" class="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div class="panel flex flex-col items-center gap-5 p-6 md:p-10">
          <div class="flex w-full items-center justify-between font-mono text-xs text-ink-4">
            <span>{{ $t('game.round', { round: state.round }) }}</span>
            <span>{{ $t('game.progress', { solved: state.solved, target: state.target }) }}</span>
          </div>

          <!-- Progress meter: the win condition is the only number worth a bar. -->
          <div class="h-1 w-full overflow-hidden rounded bg-base-300">
            <div class="h-full bg-primary transition-[width] duration-500" :style="{ width: `${progress}%` }" />
          </div>

          <template v-if="state.phase === 'round' && state.puzzle">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-ink-4">
              {{ $t(`game.categories.${state.puzzle.category}`, state.puzzle.category) }}
            </p>
            <p
              class="text-center font-mono text-4xl font-bold tracking-[0.35em] text-base-content md:text-6xl"
              :aria-label="scrambleLabel"
            >
              {{ spaced(state.puzzle.scrambled) }}
            </p>
            <p class="font-mono text-xs text-ink-4">
              {{ $t('game.letterCount', { n: state.puzzle.length }) }} ·
              {{ $t('game.secondsLeft', { n: secondsLeft }) }}
            </p>

            <form class="flex w-full max-w-md gap-2" @submit.prevent="onGuess">
              <input
                ref="guessInput"
                v-model="guess"
                class="input input-bordered w-full text-center font-mono text-lg uppercase tracking-[0.2em]"
                maxlength="12"
                autocomplete="off"
                autocapitalize="characters"
                spellcheck="false"
                :placeholder="$t('game.answerPlaceholder')"
                :disabled="locked || submitted"
              />
              <BaseButton type="submit" :disabled="!guess.trim() || locked || submitted">
                {{ $t('game.guess') }}
              </BaseButton>
            </form>
            <p v-if="locked" class="text-sm text-warning" role="status">{{ $t('game.locked', { n: state.settings.maxWrong }) }}</p>
            <p v-else-if="wrongShake" class="text-sm text-error" role="status">{{ $t('game.wrong') }}</p>
            <p v-else class="text-xs text-ink-4">{{ $t('game.wrongLeft', { n: wrongLeft }) }}</p>
          </template>

          <template v-else>
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-ink-4">{{ $t('game.reveal') }}</p>
            <p class="font-sans text-4xl font-bold tracking-wide text-primary md:text-5xl">{{ state.reveal }}</p>
            <p v-if="roundWinnerName" class="text-sm text-base-content">
              {{ $t('game.roundWonBy', { name: roundWinnerName }) }}
            </p>
            <p v-else class="text-sm text-ink-4">{{ $t('game.nobodySolved') }}</p>
            <BaseButton v-if="isHost" variant="ghost" @click="onNext">{{ $t('game.next') }}</BaseButton>
          </template>
        </div>

        <GameScoreboard
          :players="state.players"
          :host-id="state.hostId"
          :player-id="playerId"
          :is-host="isHost"
          :busy="busy === 'score'"
          @adjust="onAdjust"
        />
      </div>

      <!-- FINISHED -->
      <div v-else-if="state.phase === 'finished'" class="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div class="panel flex flex-col items-center gap-4 p-6 md:p-10">
          <p class="label">{{ $t('game.finished') }}</p>
          <p class="font-sans text-3xl font-bold text-primary md:text-4xl">
            {{ winnerNames || $t('game.draw') }}
          </p>
          <p class="font-mono text-xs text-ink-4">
            {{ $t('game.finalSummary', { solved: state.solved, rounds: state.round }) }}
          </p>
          <div class="mt-2 flex gap-2">
            <BaseButton v-if="isHost" :loading="busy === 'restart'" @click="onRestart">
              {{ $t('game.playAgain') }}
            </BaseButton>
          </div>
        </div>

        <GameScoreboard
          :players="state.players"
          :host-id="state.hostId"
          :player-id="playerId"
          :is-host="isHost"
          :busy="busy === 'score'"
          @adjust="onAdjust"
        />
      </div>

      <p v-if="error" class="font-mono text-xs text-error" role="alert">{{ error }}</p>
    </div>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageShell from '@/components/layout/PageShell.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import GameScoreboard from '@/components/game/GameScoreboard.vue'
import { usePageSeo } from '@/composables/usePageSeo'
import { resolveTarget } from '@/lib/gameTarget'
import { useI18n } from 'vue-i18n'
import {
  adjustScore as adjustScoreApi,
  clearSession,
  createRoom,
  GameError,
  getRoom,
  joinRoom,
  leaveRoom,
  loadSession,
  nextRound,
  openStream,
  restartGame,
  saveSession,
  startGame,
  submitGuess,
  updateSettings,
  type GameSettings,
  type GameState,
} from '@/services/gameApi'

/**
 * Anagram party game.
 *
 * This page owns no game rules. The service picks the word, decides who was
 * fastest and computes the score; everything here renders `state` and posts
 * intents. Keeping it that way is what makes the game fair across players on
 * different machines — see the comment on the SSE endpoint in the service.
 */
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

usePageSeo({
  title: computed(() => t('game.title')),
  description: computed(() => t('game.dek')),
  breadcrumbs: [{ name: t('navigation.explore'), path: '/explore' }],
})

const state = ref<GameState | null>(null)
const playerId = ref('')
const name = ref('')
const joinCode = ref('')
const guess = ref('')
const error = ref('')
type BusyKind = '' | 'create' | 'join' | 'start' | 'score' | 'restart'
const busy = ref<BusyKind>('')
const copied = ref(false)
const locked = ref(false)
const submitted = ref(false)
const wrongShake = ref(false)
const secondsLeft = ref(0)
const guessInput = ref<HTMLInputElement | null>(null)

let closeStream: (() => void) | null = null
let countdown: ReturnType<typeof setInterval> | null = null

const rules = reactive<GameSettings>({
  language: 'id',
  target: 0,
  maxWrong: 3,
  roundSeconds: 30,
})

const languages = [
  { value: 'id' as const, label: 'ID' },
  { value: 'en' as const, label: 'EN' },
]

const ruleFields = [
  { key: 'target' as const, label: 'game.ruleTarget', min: 0, max: 50 },
  { key: 'maxWrong' as const, label: 'game.ruleMaxWrong', min: 1, max: 10 },
  { key: 'roundSeconds' as const, label: 'game.ruleSeconds', min: 10, max: 180 },
]

const isHost = computed(() => state.value?.hostId === playerId.value)
const canJoin = computed(() => joinCode.value.trim().length === 4 && name.value.trim().length > 0)
// Preview only — the service decides, and `state.target` is the answer once the
// game starts. The rule itself lives in lib so it can be tested.
const targetPreview = computed(() => resolveTarget(rules.target, state.value?.players.length ?? 0))

const progress = computed(() =>
  state.value && state.value.target ? Math.min(100, (state.value.solved / state.value.target) * 100) : 0,
)
const wrongLeft = computed(() =>
  state.value ? Math.max(0, state.value.settings.maxWrong - (me.value?.wrong ?? 0)) : 0,
)
const me = computed(() => state.value?.players.find((p) => p.id === playerId.value) ?? null)
const roundWinnerName = computed(() => {
  const id = state.value?.roundWinner
  return id ? (state.value?.players.find((p) => p.id === id)?.name ?? '') : ''
})
const winnerNames = computed(() => {
  if (!state.value?.winner) return ''
  return state.value.players.find((p) => p.id === state.value?.winner)?.name ?? ''
})
const scrambleLabel = computed(() => state.value?.puzzle?.scrambled.split('').join(' ') ?? '')

/** Letter spacing is a visual cue only; the aria-label spells the letters out. */
function spaced(word: string): string {
  return word.split('').join(' ')
}

// The server sends the remaining seconds once per state change; the ticker
// between frames keeps the number honest without polling the endpoint.
watch(
  () => state.value?.puzzle?.secondsLeft,
  (value) => {
    secondsLeft.value = value ?? 0
    if (countdown) clearInterval(countdown)
    if ((value ?? 0) > 0) {
      countdown = setInterval(() => {
        if (secondsLeft.value > 0) secondsLeft.value -= 1
      }, 1000)
    }
  },
  { immediate: true },
)

// A new round clears the previous answer and its transient messages.
watch(
  () => state.value?.round,
  () => {
    guess.value = ''
    locked.value = false
    submitted.value = false
    wrongShake.value = false
  },
)

// Focus the answer field as soon as a round opens: the first keystroke should
// not be spent clicking.
watch(
  () => state.value?.phase,
  async (phase) => {
    if (phase !== 'round') return
    await nextTick()
    guessInput.value?.focus()
  },
)

function handleError(err: unknown) {
  if (err instanceof GameError) {
    if (err.code === 'room_not_found') {
      error.value = t('game.errors.roomNotFound')
      teardown()
      state.value = null
      return
    }
    if (err.code === 'network') {
      error.value = t('game.errors.network')
      return
    }
    // Codes with dedicated copy, otherwise the server's own message.
    const known = ['name_taken', 'room_full', 'locked_out', 'invalid_name', 'not_host']
    error.value = known.includes(err.code) ? t(`game.errors.${camel(err.code)}`) : err.message
    return
  }
  error.value = t('game.errors.network')
}

function camel(code: string): string {
  return code.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function teardown() {
  closeStream?.()
  closeStream = null
  if (countdown) clearInterval(countdown)
  countdown = null
}

function attach(code: string) {
  teardown()
  closeStream = openStream(code, {
    onState: (next) => {
      state.value = next
      // Keep the host's rule inputs in sync with what the server accepted.
      Object.assign(rules, next.settings)
    },
    onClosed: () => {
      error.value = t('game.errors.roomClosed')
      teardown()
      state.value = null
    },
  })
}

async function onCreate() {
  if (busy.value) return
  error.value = ''
  busy.value = 'create'
  try {
    const created = await createRoom(name.value.trim(), { language: 'id' })
    playerId.value = created.playerId
    saveSession(created.code, created.playerId)
    state.value = created.state
    Object.assign(rules, created.state.settings)
    attach(created.code)
    await router.replace({ query: { room: created.code } })
  } catch (err) {
    handleError(err)
  } finally {
    busy.value = ''
  }
}

async function onJoin() {
  if (busy.value) return
  error.value = ''
  busy.value = 'join'
  try {
    const code = joinCode.value.trim().toUpperCase()
    const joined = await joinRoom(code, name.value.trim())
    playerId.value = joined.playerId
    saveSession(code, joined.playerId)
    state.value = joined.state
    Object.assign(rules, joined.state.settings)
    attach(code)
    await router.replace({ query: { room: code } })
  } catch (err) {
    handleError(err)
  } finally {
    busy.value = ''
  }
}

async function onStart() {
  if (!state.value || busy.value) return
  busy.value = 'start'
  error.value = ''
  try {
    // The rule inputs are local drafts until now. Start would otherwise run
    // with whatever the room was created with, silently discarding every edit
    // the host just made.
    await updateSettings(state.value.code, playerId.value, { ...rules })
    await startGame(state.value.code, playerId.value)
  } catch (err) {
    handleError(err)
  } finally {
    busy.value = ''
  }
}

async function onNext() {
  if (!state.value) return
  try {
    await nextRound(state.value.code, playerId.value)
  } catch (err) {
    handleError(err)
  }
}

async function onRestart() {
  if (!state.value || busy.value) return
  busy.value = 'restart'
  try {
    await restartGame(state.value.code, playerId.value)
  } catch (err) {
    handleError(err)
  } finally {
    busy.value = ''
  }
}

async function onGuess() {
  if (!state.value || submitted.value) return
  const answer = guess.value.trim()
  if (!answer) return

  // The field is disabled while the request is in flight: a second submission
  // would be judged against the next round if this one ended the game.
  submitted.value = true
  error.value = ''
  try {
    const result = await submitGuess(state.value.code, playerId.value, answer)
    if (result.correct) {
      guess.value = ''
    } else {
      locked.value = result.locked
      wrongShake.value = true
      setTimeout(() => (wrongShake.value = false), 900)
      guess.value = ''
    }
  } catch (err) {
    if (err instanceof GameError && err.code === 'locked_out') locked.value = true
    handleError(err)
  } finally {
    submitted.value = false
  }
}

async function onAdjust(targetId: string, delta: number) {
  if (!state.value || busy.value) return
  busy.value = 'score'
  try {
    await adjustScoreApi(state.value.code, playerId.value, targetId, delta)
  } catch (err) {
    handleError(err)
  } finally {
    busy.value = ''
  }
}

async function onChangeLanguage(language: 'id' | 'en') {
  if (!state.value || !isHost.value) return
  try {
    await updateSettings(state.value.code, playerId.value, { ...rules, language })
  } catch (err) {
    handleError(err)
  }
}

async function copyInvite() {
  if (!state.value) return
  const url = `${window.location.origin}${window.location.pathname}?room=${state.value.code}`
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    error.value = t('game.errors.clipboard')
  }
}

async function onLeave() {
  if (state.value && playerId.value) {
    try {
      await leaveRoom(state.value.code, playerId.value)
    } catch {
      // Leaving is best-effort: a room that already swept this player is fine.
    }
  }
  if (state.value) clearSession(state.value.code)
  teardown()
  state.value = null
  playerId.value = ''
  void router.replace({ query: {} })
}

onBeforeUnmount(teardown)

// A shared link carries ?room=CODE: prefill the join form so a guest only types
// a name.
const invited = typeof route.query.room === 'string' ? route.query.room.toUpperCase() : ''
if (invited.length === 4) joinCode.value = invited

/**
 * Reclaim a seat saved by a previous visit.
 *
 * The saved id is only useful if the server still knows it — a service restart
 * or an idle sweep drops the room, and a stale id would otherwise look like a
 * working session that never updates. So the room is fetched first, and a
 * missing room or a missing player clears the session instead of showing a
 * dead screen.
 */
onMounted(async () => {
  if (invited.length !== 4) return
  const savedId = loadSession(invited)
  if (!savedId) return

  try {
    const snapshot = await getRoom(invited)
    if (!snapshot.players.some((player) => player.id === savedId)) {
      clearSession(invited)
      error.value = t('game.errors.seatGone')
      return
    }
    playerId.value = savedId
    state.value = snapshot
    Object.assign(rules, snapshot.settings)
    attach(invited)
  } catch (err) {
    clearSession(invited)
    if (err instanceof GameError && err.code === 'room_not_found') {
      error.value = t('game.errors.roomNotFound')
    }
  }
})
</script>

<style scoped>
.seg {
  border: 1px solid var(--color-base-300, #d4d4d8);
  padding: 0.25rem 0.75rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-ink-4, #71717a);
  background: transparent;
  cursor: pointer;
}
.seg:first-child {
  border-radius: 0.375rem 0 0 0.375rem;
}
.seg:last-child {
  border-radius: 0 0.375rem 0.375rem 0;
  border-left: 0;
}
.seg.is-active {
  background: var(--color-primary, #2563eb);
  border-color: var(--color-primary, #2563eb);
  color: #fff;
}
.seg:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
