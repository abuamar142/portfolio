/**
 * Client for the anagram game service.
 *
 * The service is authoritative: the answer never reaches this module, and every
 * mutation returns the room state that the UI then renders. That is why nothing
 * here computes a score or decides whether a guess was right.
 */

export type GamePhase = 'lobby' | 'round' | 'reveal' | 'finished'

export interface GamePlayer {
  id: string
  name: string
  score: number
  wrong: number
}

export interface GamePuzzle {
  scrambled: string
  category: string
  length: number
  secondsLeft: number
}

export interface GameSettings {
  language: 'id' | 'en'
  /** 0 asks the server to derive it from the roster. */
  target: number
  maxWrong: number
  roundSeconds: number
}

export interface GameState {
  code: string
  phase: GamePhase
  hostId: string
  players: GamePlayer[]
  settings: GameSettings
  target: number
  solved: number
  round: number
  puzzle?: GamePuzzle
  reveal?: string
  roundWinner?: string
  winner?: string
}

export interface GuessResult {
  correct: boolean
  locked: boolean
  points: number
}

interface Envelope<T> {
  success: boolean
  message: string
  data?: T
  error?: { code?: string; details?: string }
}

/** Error carrying the service's machine-readable code, which the UI maps to copy. */
export class GameError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'GameError'
    this.code = code
    this.status = status
  }
}

const API_BASE = import.meta.env.VITE_PORTFOLIO_API_URL || 'https://portfolio.abuamar.online'
const BASE = `${API_BASE}/api/v1/game`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    })
  } catch {
    // fetch rejects only for network-level failures, which for this game means
    // "server unreachable", not "request refused".
    throw new GameError('network', 'cannot reach the game service', 0)
  }

  let body: Envelope<T> | undefined
  try {
    body = (await response.json()) as Envelope<T>
  } catch {
    body = undefined
  }

  if (!response.ok || !body?.success) {
    throw new GameError(
      body?.error?.code ?? 'unknown',
      body?.message ?? `request failed with ${response.status}`,
      response.status,
    )
  }
  return body.data as T
}

export function getRoom(code: string) {
  return request<GameState>(`/rooms/${code}`)
}

/**
 * Session persistence.
 *
 * A refresh must not cost a player their seat: the id issued at create/join is
 * the only thing tying this browser to its score. It is kept per room code, in
 * sessionStorage rather than localStorage.
 *
 * sessionStorage is the right scope here, not a weaker one: it survives a
 * reload (so a phone that sleeps mid-game keeps its seat) but not a new tab —
 * and two tabs on one machine are two *players*, who would otherwise overwrite
 * each other's id. localStorage made the host tab silently adopt the guest's
 * identity during testing, which is exactly the bug this prevents.
 */
const SESSION_PREFIX = 'tebak-kata:'

export function saveSession(code: string, playerId: string): void {
  try {
    sessionStorage.setItem(`${SESSION_PREFIX}${code}`, playerId)
  } catch {}
}

export function loadSession(code: string): string | null {
  try {
    return sessionStorage.getItem(`${SESSION_PREFIX}${code}`)
  } catch {
    return null
  }
}

export function clearSession(code: string): void {
  try {
    sessionStorage.removeItem(`${SESSION_PREFIX}${code}`)
  } catch {}
}

export function createRoom(name: string, settings: Partial<GameSettings>) {
  return request<{ code: string; playerId: string; state: GameState }>('/rooms', {
    method: 'POST',
    body: JSON.stringify({ name, settings }),
  })
}

export function joinRoom(code: string, name: string) {
  return request<{ playerId: string; state: GameState }>(`/rooms/${code}/join`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function startGame(code: string, playerId: string) {
  return request<GameState>(`/rooms/${code}/start`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  })
}

export function nextRound(code: string, playerId: string) {
  return request<GameState>(`/rooms/${code}/next`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  })
}

export function restartGame(code: string, playerId: string) {
  return request<GameState>(`/rooms/${code}/restart`, {
    method: 'POST',
    body: JSON.stringify({ playerId }),
  })
}

export function updateSettings(code: string, playerId: string, settings: Partial<GameSettings>) {
  return request<GameState>(`/rooms/${code}/settings`, {
    method: 'POST',
    body: JSON.stringify({ playerId, settings }),
  })
}

export function submitGuess(code: string, playerId: string, guess: string) {
  return request<GuessResult>(`/rooms/${code}/guess`, {
    method: 'POST',
    body: JSON.stringify({ playerId, guess }),
  })
}

export function adjustScore(code: string, playerId: string, targetId: string, delta: number) {
  return request<GameState>(`/rooms/${code}/score`, {
    method: 'POST',
    body: JSON.stringify({ playerId, targetId, delta }),
  })
}

export function leaveRoom(code: string, playerId: string) {
  return request<null>(`/rooms/${code}/players/${playerId}`, { method: 'DELETE' })
}

/**
 * Subscribes to the room's server-sent event feed.
 *
 * EventSource reconnects on its own, so an intermittent drop needs no code
 * here. `onClosed` fires only when the service says the room is gone, which is
 * the one case where reconnecting would loop forever.
 */
export function openStream(
  code: string,
  handlers: { onState: (state: GameState) => void; onClosed: () => void },
): () => void {
  const source = new EventSource(`${BASE}/rooms/${code}/events`)

  const onState = (event: MessageEvent) => {
    try {
      handlers.onState(JSON.parse(event.data) as GameState)
    } catch {}
  }
  source.addEventListener('state', onState as EventListener)
  source.addEventListener('closed', () => {
    source.close()
    handlers.onClosed()
  })

  return () => source.close()
}
