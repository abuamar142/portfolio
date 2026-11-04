import { describe, expect, it } from 'vitest'
import { MIN_TARGET, resolveTarget } from '@/lib/gameTarget'

/**
 * These cases are the contract the lobby preview shows. They mirror the
 * service's own table (internal/game/room_test.go, TestTargetFor); if one side
 * changes, the other is wrong and this is where it shows.
 */
describe('resolveTarget', () => {
  it('falls back to twice the roster above the floor', () => {
    expect(resolveTarget(0, 3)).toBe(6)
    expect(resolveTarget(0, 5)).toBe(10)
    expect(resolveTarget(0, 8)).toBe(16)
  })

  it('keeps the floor of five for small rooms', () => {
    expect(resolveTarget(0, 1)).toBe(MIN_TARGET)
    expect(resolveTarget(0, 2)).toBe(MIN_TARGET)
  })

  it('lets an explicit target win in every case', () => {
    expect(resolveTarget(7, 1)).toBe(7)
    expect(resolveTarget(7, 9)).toBe(7)
    expect(resolveTarget(1, 12)).toBe(1)
  })

  it('treats a non-positive target as automatic', () => {
    expect(resolveTarget(-3, 4)).toBe(8)
  })
})
