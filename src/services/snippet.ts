import client from '@/services/client'
import type {
  Snippet,
  CreateSnippetRequest,
  UpdateSnippetRequest,
  SnippetListResponse,
  TagResponse,
  LanguageResponse,
} from '@/types/snippet'

export async function fetchSnippets(params: {
  search?: string
  tag?: string
  language?: string
  page?: number
  limit?: number
} = {}): Promise<SnippetListResponse> {
  const { data } = await client.get('/snippets', { params })
  return data.data
}

export async function fetchSnippetById(id: string): Promise<Snippet> {
  const { data } = await client.get(`/snippets/${id}`)
  return data.data
}

export async function createSnippet(req: CreateSnippetRequest): Promise<Snippet> {
  const { data } = await client.post('/snippets', req)
  return data.data
}

export async function updateSnippet(
  id: string,
  req: UpdateSnippetRequest,
): Promise<Snippet> {
  const { data } = await client.put(`/snippets/${id}`, req)
  return data.data
}

export async function deleteSnippet(id: string): Promise<void> {
  await client.delete(`/snippets/${id}`)
}

export async function fetchSnippetTags(): Promise<TagResponse[]> {
  const { data } = await client.get('/snippets/tags')
  return data.data || []
}

export async function fetchSnippetLanguages(): Promise<LanguageResponse[]> {
  const { data } = await client.get('/snippets/languages')
  return data.data || []
}
