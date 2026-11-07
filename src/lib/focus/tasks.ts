/**
 * The pomodoro checklist.
 *
 * Deliberately a checklist and not a tracker: a task is a line with a
 * checkbox. Estimates and per-task pomodoro counts were considered and
 * dropped — people end up maintaining the numbers instead of doing the work.
 */

export interface FocusTask {
  id: string
  title: string
  done: boolean
  createdAt: number
}

/** Long enough for a real task sentence, short enough to stay one line. */
export const TASK_MAX_LENGTH = 120

/** Bound the list so one runaway import cannot bloat localStorage. */
export const TASK_MAX_COUNT = 100

export function normalizeTaskTitle(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, TASK_MAX_LENGTH)
}

export function addTask(
  tasks: FocusTask[],
  title: string,
  now: number,
  id: string,
): FocusTask[] {
  const clean = normalizeTaskTitle(title)
  if (!clean || tasks.length >= TASK_MAX_COUNT) return tasks
  return [...tasks, { id, title: clean, done: false, createdAt: now }]
}

export function toggleTask(tasks: FocusTask[], id: string): FocusTask[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
}

export function removeTask(tasks: FocusTask[], id: string): FocusTask[] {
  return tasks.filter((task) => task.id !== id)
}

export function clearDoneTasks(tasks: FocusTask[]): FocusTask[] {
  return tasks.filter((task) => !task.done)
}

export function openTaskCount(tasks: FocusTask[]): number {
  return tasks.reduce((count, task) => (task.done ? count : count + 1), 0)
}
