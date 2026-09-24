import client from '@/services/client'
import type { Quote, CreateQuoteRequest, QuoteListResponse, TagResponse } from '@/types/quote'

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
