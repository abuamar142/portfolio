import type { Achievement } from '@/types/portfolio'
import client from '@/services/client'
import { FILES_URL } from '@/site'

export async function fetchAchievements(): Promise<Achievement[]> {
  const response = await client.get('/achievements')

  const body = response.data

  if (!body || typeof body !== 'object') {
    throw new Error('Invalid response structure from achievements API')
  }

  if (body.success === false) {
    throw new Error(body.message || 'Achievements API returned an error')
  }

  const data = body.data as { achievements?: unknown } | null

  // Envelope: { success, data: { achievements: [...], total } } — mirroring
  // the feedback list. Anything else is a broken contract, not a fallback.
  const rows =
    data && typeof data === 'object' && Array.isArray((data as { achievements?: unknown }).achievements)
      ? (data as { achievements: Achievement[] }).achievements
      : null

  if (!rows) {
    throw new Error('Expected { achievements: [...] } in Achievements API response')
  }

  return rows
}

export function achievementEvidenceUrl(a: Achievement): string | null {
  if (a.file_key) return `${FILES_URL}/${a.file_key}`
  if (a.drive_file_id) return `https://drive.google.com/file/d/${a.drive_file_id}/view`
  return null
}
