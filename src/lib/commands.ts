/**
 * Command mode for the palette: `>` starts an action instead of a search.
 *
 * Kept separate from the search ranking on purpose. Search answers "where is
 * this thing" with a ranked list; a command is an imperative with no ranking
 * and no ambiguity — either the typed text names one command or it does not.
 * Mixing the two into one scoring function would let "dark" outrank "tema
 * gelap" depending on weights, which is not a thing a command should do.
 *
 * The registry is data, so the matcher is testable without a browser: each
 * entry declares the words that select it and what running it means.
 */

export type CommandId = 'theme-dark' | 'theme-light' | 'theme-system' | 'lang-id' | 'lang-en'

export interface CommandDef {
  id: CommandId
  /** What the palette shows. */
  label: string
  /** Secondary line explaining the effect. */
  hint: string
  /** Words that select this command (lowercased, matched by prefix). */
  keywords: string[]
  /** Extra group for the palette footer, e.g. "theme". */
  group: 'theme' | 'language'
}

export const COMMANDS: CommandDef[] = [
  {
    id: 'theme-dark',
    label: 'Dark',
    hint: 'Switch the theme to dark',
    keywords: ['dark', 'gelap', 'malam', 'theme dark', 'tema gelap'],
    group: 'theme',
  },
  {
    id: 'theme-light',
    label: 'Light',
    hint: 'Switch the theme to light',
    keywords: ['light', 'terang', 'siang', 'theme light', 'tema terang'],
    group: 'theme',
  },
  {
    id: 'theme-system',
    label: 'System',
    hint: 'Follow the operating system theme',
    keywords: ['system', 'sistem', 'auto', 'otomatis', 'os'],
    group: 'theme',
  },
  {
    id: 'lang-id',
    label: 'Bahasa Indonesia',
    hint: 'Ganti bahasa ke Indonesia',
    keywords: ['id', 'indonesia', 'bahasa', 'ind', 'lang id'],
    group: 'language',
  },
  {
    id: 'lang-en',
    label: 'English',
    hint: 'Switch the language to English',
    keywords: ['en', 'english', 'inggris', 'lang en'],
    group: 'language',
  },
]

/** True when the palette should be in command mode. */
export function isCommandQuery(query: string): boolean {
  return query.trimStart().startsWith('>')
}

/** Everything after the `>`, trimmed. */
export function commandText(query: string): string {
  return query.trimStart().replace(/^>\s*/, '').trim()
}

/**
 * Commands matching the typed text.
 *
 * An empty query lists all of them — that is how a user discovers the mode
 * exists after typing `>`. Otherwise a command matches when any of its keywords
 * *starts with* the typed text, so `>da` finds Dark without also matching
 * "kadang" style false positives from a substring search.
 */
export function matchCommands(text: string): CommandDef[] {
  const needle = text.trim().toLowerCase()
  if (!needle) return COMMANDS
  return COMMANDS.filter((command) =>
    command.keywords.some((keyword) => keyword.startsWith(needle)),
  )
}
