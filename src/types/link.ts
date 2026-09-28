/**
 * Link-archive shapes. These used to live inline in services/link.ts, which
 * was the only CRUD service keeping its types in the service file — quotes and
 * snippets both have a types/ module.
 */
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
