import { describe, expect, it } from 'vitest'
import { COMMANDS, commandText, isCommandQuery, matchCommands } from '@/lib/commands'

/**
 * Command mode is a mode switch, not a ranking: the only behaviours worth
 * pinning are what turns it on, what it strips, and that matching is by prefix
 * rather than substring (so `>da` finds Dark and does not drag in everything
 * containing "da").
 */

describe('isCommandQuery', () => {
  it('activates only on a leading >', () => {
    expect(isCommandQuery('>')).toBe(true)
    expect(isCommandQuery('>dark')).toBe(true)
    expect(isCommandQuery('  >dark')).toBe(true)
    expect(isCommandQuery('dark')).toBe(false)
    expect(isCommandQuery('a > b')).toBe(false)
    expect(isCommandQuery('')).toBe(false)
  })
})

describe('commandText', () => {
  it('strips the marker and surrounding space', () => {
    expect(commandText('>dark')).toBe('dark')
    expect(commandText('>  dark  ')).toBe('dark')
    expect(commandText('>')).toBe('')
  })
})

describe('matchCommands', () => {
  it('lists every command for a bare >', () => {
    expect(matchCommands('')).toHaveLength(COMMANDS.length)
  })

  it('matches by keyword prefix', () => {
    expect(matchCommands('da').map((c) => c.id)).toEqual(['theme-dark'])
    expect(matchCommands('li').map((c) => c.id)).toEqual(['theme-light'])
    expect(matchCommands('sys').map((c) => c.id)).toEqual(['theme-system'])
  })

  it('matches Indonesian keywords', () => {
    expect(matchCommands('gelap').map((c) => c.id)).toEqual(['theme-dark'])
    expect(matchCommands('terang').map((c) => c.id)).toEqual(['theme-light'])
    expect(matchCommands('inggris').map((c) => c.id)).toEqual(['lang-en'])
    expect(matchCommands('bahasa').map((c) => c.id)).toEqual(['lang-id'])
  })

  it('is case-insensitive', () => {
    expect(matchCommands('DARK').map((c) => c.id)).toEqual(['theme-dark'])
  })

  it('does not match mid-word', () => {
    // "ark" appears inside "dark" but is not a prefix of any keyword.
    expect(matchCommands('ark')).toEqual([])
  })

  it('returns nothing for text no command starts with', () => {
    expect(matchCommands('qqq')).toEqual([])
  })

  it('keeps every id unique and every keyword non-empty', () => {
    const ids = COMMANDS.map((command) => command.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const command of COMMANDS) {
      expect(command.keywords.length).toBeGreaterThan(0)
      for (const keyword of command.keywords) expect(keyword.trim()).not.toBe('')
    }
  })
})
