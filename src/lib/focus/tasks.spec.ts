import { describe, expect, it } from 'vitest'
import {
  TASK_MAX_COUNT,
  TASK_MAX_LENGTH,
  addTask,
  clearDoneTasks,
  normalizeTaskTitle,
  openTaskCount,
  removeTask,
  toggleTask,
  type FocusTask,
} from '@/lib/focus/tasks'

const T0 = 1_700_000_000_000

function task(id: string, done = false): FocusTask {
  return { id, title: `Tugas ${id}`, done, createdAt: T0 }
}

describe('normalizeTaskTitle', () => {
  it('collapses whitespace and trims the ends', () => {
    expect(normalizeTaskTitle('  tulis   laporan \n')).toBe('tulis laporan')
  })

  it('caps the length so one paste cannot break the layout', () => {
    const long = normalizeTaskTitle('a'.repeat(TASK_MAX_LENGTH + 50))
    expect(long).toHaveLength(TASK_MAX_LENGTH)
  })
})

describe('addTask', () => {
  it('appends an open task', () => {
    const tasks = addTask([], 'Tulis laporan', T0, 'a')
    expect(tasks).toEqual([{ id: 'a', title: 'Tulis laporan', done: false, createdAt: T0 }])
  })

  it('rejects a blank title rather than storing an empty row', () => {
    expect(addTask([], '   ', T0, 'a')).toEqual([])
  })

  it('refuses to grow past the cap', () => {
    const full: FocusTask[] = Array.from({ length: TASK_MAX_COUNT }, (_, index) => task(String(index)))
    expect(addTask(full, 'satu lagi', T0, 'overflow')).toHaveLength(TASK_MAX_COUNT)
  })

  it('does not mutate the list it was given', () => {
    const original: FocusTask[] = []
    addTask(original, 'baru', T0, 'a')
    expect(original).toHaveLength(0)
  })
})

describe('task list operations', () => {
  const tasks = [task('a'), task('b', true), task('c')]

  it('toggles exactly one task', () => {
    const toggled = toggleTask(tasks, 'a')
    expect(toggled[0].done).toBe(true)
    expect(toggled[2].done).toBe(false)
    expect(toggleTask(tasks, 'b')[1].done).toBe(false)
  })

  it('removes by id and leaves the rest in order', () => {
    expect(removeTask(tasks, 'b').map((item) => item.id)).toEqual(['a', 'c'])
    expect(removeTask(tasks, 'missing')).toHaveLength(3)
  })

  it('clears only the finished rows', () => {
    expect(clearDoneTasks(tasks).map((item) => item.id)).toEqual(['a', 'c'])
  })

  it('counts what is still open', () => {
    expect(openTaskCount(tasks)).toBe(2)
    expect(openTaskCount([])).toBe(0)
  })
})
