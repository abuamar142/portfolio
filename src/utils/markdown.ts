import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export function renderMarkdownToHtml(md?: string | null): string {
  if (!md) return ''
  const raw = marked.parse(md) as string
  return DOMPurify.sanitize(raw)
}

