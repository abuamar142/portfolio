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

export async function createAchievement(
  req: Omit<Achievement, 'id' | 'created_at' | 'file_key' | 'file_name' | 'file_size'>,
): Promise<Achievement> {
  const { data } = await client.post('/achievements', req)
  return data.data
}

export async function updateAchievement(
  id: string,
  req: Partial<Omit<Achievement, 'id' | 'created_at' | 'file_key' | 'file_name' | 'file_size'>>,
): Promise<Achievement> {
  const { data } = await client.put(`/achievements/${id}`, req)
  return data.data
}

export async function deleteAchievement(id: string): Promise<void> {
  await client.delete(`/achievements/${id}`)
}

export async function uploadAchievementFile(
  id: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<Achievement> {
  const { data } = await client.post(`/achievements/${id}/file`, file, {
    headers: {
      'Content-Type': file.type,
      'X-File-Name': encodeURIComponent(file.name),
    },
    maxBodyLength: Infinity,
    timeout: 120_000,
    onUploadProgress: (e: { loaded: number; total?: number }) => {
      if (!onProgress || !e.total) return
      onProgress(Math.round((e.loaded * 100) / e.total))
    },
  })
  return data.data
}

export async function deleteAchievementFile(id: string): Promise<Achievement> {
  const { data } = await client.delete(`/achievements/${id}/file`)
  return data.data
}

export function achievementEvidenceUrl(a: Achievement): string | null {
  if (a.file_key) return `${FILES_URL}/${a.file_key}`
  return null
}
