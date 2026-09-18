import axios from 'axios'
import type { Quote, CreateQuoteRequest, QuoteListResponse, TagResponse } from '@/types/quote'

const API_BASE = import.meta.env.VITE_QUOTE_API_URL || 'https://quote.abuamar.online'

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

export async function fetchQuotes(params: {
  search?: string
  tag?: string
  page?: number
  limit?: number
} = {}): Promise<QuoteListResponse> {
  const { data } = await client.get('/quotes', { params })
  return data.data
}

export async function fetchQuoteById(id: string): Promise<Quote> {
  const { data } = await client.get(`/quotes/${id}`)
  return data.data
}

export async function createQuote(req: CreateQuoteRequest): Promise<Quote> {
  const { data } = await client.post('/quotes', req)
  return data.data
}

export async function updateQuote(id: string, req: CreateQuoteRequest): Promise<Quote> {
  const { data } = await client.put(`/quotes/${id}`, req)
  return data.data
}

export async function deleteQuote(id: string): Promise<void> {
  await client.delete(`/quotes/${id}`)
}

export async function fetchTags(): Promise<TagResponse[]> {
  const { data } = await client.get('/quotes/tags')
  return data.data || []
}
