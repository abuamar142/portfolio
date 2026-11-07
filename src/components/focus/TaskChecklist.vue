<template>
  <section class="panel p-6">
    <header class="flex items-baseline justify-between gap-4">
      <h2 class="label">{{ t('focus.tasks.heading') }}</h2>
      <span class="data text-xs text-ink-3">
        {{ t('focus.tasks.openCount', { n: openCount }) }}
      </span>
    </header>

    <form class="mt-4 flex gap-2" @submit.prevent="submit">
      <label class="sr-only" for="focus-task-input">{{ t('focus.tasks.placeholder') }}</label>
      <input
        id="focus-task-input"
        v-model="draft"
        type="text"
        autocomplete="off"
        class="input input-bordered min-w-0 flex-1 text-sm"
        :placeholder="t('focus.tasks.placeholder')"
        :maxlength="TASK_MAX_LENGTH"
      />
      <BaseButton type="submit" size="sm" :disabled="!draft.trim()">
        {{ t('focus.tasks.add') }}
      </BaseButton>
    </form>

    <p v-if="tasks.length === 0" class="data mt-6 text-sm text-ink-3">
      {{ t('focus.tasks.empty') }}
    </p>

    <ul v-else class="mt-4 flex flex-col">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-3 border-t border-base-300 py-3 first:border-t-0"
      >
        <input
          :id="`task-${task.id}`"
          type="checkbox"
          class="checkbox checkbox-sm"
          :checked="task.done"
          @change="focusSession.toggleTask(task.id)"
        />
        <label
          :for="`task-${task.id}`"
          class="min-w-0 flex-1 cursor-pointer text-sm"
          :class="{ 'text-ink-4 line-through': task.done }"
        >
          {{ task.title }}
        </label>
        <button
          type="button"
          class="remove"
          :aria-label="t('focus.tasks.remove', { title: task.title })"
          @click="focusSession.removeTask(task.id)"
        >
          <X class="size-4" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <footer v-if="doneCount > 0" class="mt-4 border-t border-base-300 pt-4">
      <BaseButton variant="ghost" size="sm" @click="focusSession.clearDoneTasks()">
        {{ t('focus.tasks.clearDone') }}
      </BaseButton>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'
import { TASK_MAX_LENGTH, openTaskCount } from '@/lib/focus/tasks'
import { focusSession } from '@/composables/useFocusSession'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const { snapshot } = focusSession

const draft = ref('')

const tasks = computed(() => snapshot.tasks)
const openCount = computed(() => openTaskCount(tasks.value))
const doneCount = computed(() => tasks.value.filter((task) => task.done).length)

function submit(): void {
  if (!draft.value.trim()) return
  focusSession.addTask(draft.value)
  draft.value = ''
}
</script>

<style scoped>
.remove {
  display: inline-grid;
  place-items: center;
  padding: 0.25rem;
  color: var(--color-ink-4);
  cursor: pointer;
}

.remove:hover {
  color: var(--color-voltage-ink);
}

.remove:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
