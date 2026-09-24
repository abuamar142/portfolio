import axios from 'axios'

const API_BASE = import.meta.env.VITE_PORTFOLIO_API_URL || 'https://portfolio.abuamar.online'

const client = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('quote_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Link {
  id: string
  user_id: string
  url: string
  title: string
  description: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface LinkListResponse {
  links: Link[]
  total: number
  page: number
  limit: number
}

export interface LinkTagResponse {
  tag: string
  count: number
}

export async function fetchLinks(params: {
  search?: string
  tag?: string
  page?: number
  limit?: number
} = {}): Promise<LinkListResponse> {
  const { data } = await client.get('/links', { params })
  return data.data
}

export async function fetchLinkTags(): Promise<LinkTagResponse[]> {
  const { data } = await client.get('/links/tags')
  return data.data || []
}

export async function createLink(req: {
  url: string
  title: string
  description?: string
  tags?: string[]
}): Promise<Link> {
  const { data } = await client.post('/links', req)
  return data.data
}

export async function updateLink(
  id: string,
  req: { url: string; title: string; description?: string; tags?: string[] },
): Promise<Link> {
  const { data } = await client.put(`/links/${id}`, req)
  return data.data
}

export async function deleteLink(id: string): Promise<void> {
  await client.delete(`/links/${id}`)
}
