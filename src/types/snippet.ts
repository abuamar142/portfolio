export interface Snippet {
  id: string
  user_id: string
  title: string
  language: string
  code: string
  description: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CreateSnippetRequest {
  title: string
  language: string
  code: string
  description?: string
  tags?: string[]
}

export type UpdateSnippetRequest = CreateSnippetRequest

export interface SnippetListResponse {
  snippets: Snippet[]
  total: number
  page: number
  limit: number
}

export interface TagResponse {
  tag: string
  count: number
}

export interface LanguageResponse {
  language: string
  count: number
}
