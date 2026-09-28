import client from '@/services/client'
import type { Link, LinkListResponse, LinkTagResponse } from '@/types/link'

export type { Link, LinkListResponse, LinkTagResponse }

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
