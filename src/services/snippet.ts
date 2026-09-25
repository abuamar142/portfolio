import axios from 'axios'
import type {
  Snippet,
  CreateSnippetRequest,
  SnippetListResponse,
  TagResponse,
  LanguageResponse,
} from '@/types/snippet'

const API_BASE = import.meta.env.VITE_QUOTE_API_URL || 'https://portfolio-service.abuamar.online'

const client = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Inject JWT token if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('quote_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
  req: CreateSnippetRequest,
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
