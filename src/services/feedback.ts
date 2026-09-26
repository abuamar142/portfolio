import client from '@/services/client'
import type {
  Feedback,
  CreateFeedbackRequest,
  FeedbackListResponse,
} from '@/types/feedback'

/** Public — no auth required. */
export async function submitFeedback(req: CreateFeedbackRequest): Promise<{ id: string }> {
  const { data } = await client.post('/feedback', req)
  return data.data
}

export async function fetchFeedback(params: {
  status?: 'new' | 'read' | 'all'
} = {}): Promise<FeedbackListResponse> {
  const { data } = await client.get('/feedback', { params })
  return data.data
}

export async function updateFeedbackStatus(
  id: string,
  status: 'new' | 'read',
): Promise<Feedback> {
  const { data } = await client.patch(`/feedback/${id}`, { status })
  return data.data
}

export async function deleteFeedback(id: string): Promise<void> {
  await client.delete(`/feedback/${id}`)
}
