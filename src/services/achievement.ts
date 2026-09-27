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

  const data = body.data

  if (!Array.isArray(data)) {
    throw new Error('Expected achievements data to be an array')
  }

  return data as Achievement[]
}

export function achievementEvidenceUrl(a: Achievement): string | null {
  if (a.file_key) return `${FILES_URL}/${a.file_key}`
  if (a.drive_file_id) return `https://drive.google.com/file/d/${a.drive_file_id}/view`
  return null
}
