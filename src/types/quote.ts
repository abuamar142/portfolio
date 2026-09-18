export interface Quote {
  id: string
  user_id: string
  content: string
  author_name: string
  is_anonymous: boolean
  source: string
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'white'
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CreateQuoteRequest {
  content: string
  author_name?: string
  is_anonymous?: boolean
  source?: string
  tags?: string[]
}

export interface QuoteListResponse {
  quotes: Quote[]
  total: number
  page: number
  limit: number
}

export interface TagResponse {
  tag: string
  count: number
}

export interface AuthUser {
  id: string
  email: string
  username: string
  display_name: string
}
