<template>
  <div class="panel flex flex-col p-6">
    <h2 class="mb-4 font-sans text-lg font-semibold">{{ $t('game.scoreboard') }}</h2>
    <ul class="flex flex-col divide-y divide-base-300">
      <li
        v-for="player in sorted"
        :key="player.id"
        class="flex items-center justify-between gap-3 py-2"
        :class="player.id === playerId ? 'text-base-content' : 'text-ink-4'"
      >
        <span class="flex min-w-0 items-center gap-2">
          <span class="truncate text-sm">{{ player.name }}</span>
          <span v-if="player.id === hostId" class="badge badge-xs">{{ $t('game.host') }}</span>
        </span>
        <span class="flex shrink-0 items-center gap-1">
          <!-- Host-only correction: the on-screen answer to a disputed round. -->
          <button
            v-if="isHost"
            type="button"
            class="score-btn"
            :disabled="busy"
            :aria-label="$t('game.minusFor', { name: player.name })"
            @click="$emit('adjust', player.id, -1)"
          >
            −
          </button>
          <span class="w-8 text-center font-mono text-sm tabular-nums text-base-content">
            {{ player.score }}
          </span>
          <button
            v-if="isHost"
            type="button"
            class="score-btn"
            :disabled="busy"
            :aria-label="$t('game.plusFor', { name: player.name })"
            @click="$emit('adjust', player.id, 1)"
          >
            +
          </button>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GamePlayer } from '@/services/gameApi'

/**
 * Live scoreboard. Ordering is by score then name so it does not jump around
 * between equal scores — a board that reorders on every point is unreadable
 * while several people are watching it.
 */
const props = defineProps<{
  players: GamePlayer[]
  hostId: string
  playerId: string
  isHost: boolean
  busy: boolean
}>()

defineEmits<{ adjust: [playerId: string, delta: number] }>()

const sorted = computed(() =>
  [...props.players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
)
</script>

<style scoped>
.score-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-base-300, #d4d4d8);
  font-family: var(--font-mono, monospace);
  line-height: 1;
  color: var(--color-ink-4, #71717a);
  background: transparent;
  cursor: pointer;
}
.score-btn:hover:not(:disabled) {
  border-color: var(--color-primary, #2563eb);
  color: var(--color-primary, #2563eb);
}
.score-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
