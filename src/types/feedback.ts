export interface Feedback {
  id: string
  message: string
  contact: string
  page_url: string
  status: 'new' | 'read'
  created_at: string
}

export interface CreateFeedbackRequest {
  message: string
  contact?: string
  page_url?: string
  /** Honeypot — humans never fill this; server ignores it silently. */
  website?: string
}

export interface FeedbackListResponse {
  feedback: Feedback[]
  total: number
}
