import { describe, expect, it } from 'vitest'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

/**
 * Blog bodies are CMS HTML rendered with v-html. Vue inserts them verbatim, so
 * these tests are the regression fence around the stored-XSS fix: whatever the
 * CMS contains, nothing executable may survive into the DOM.
 */
describe('sanitizeHtml', () => {
  it('keeps the editorial markup the blog actually uses', () => {
    const html = '<h2>Judul</h2><p>Teks <strong>tebal</strong> dan <em>miring</em></p><ul><li>satu</li></ul>'
    expect(sanitizeHtml(html)).toBe(html)
  })

  it('keeps code blocks and inline code intact', () => {
    const html = '<pre><code>const a = 1 &lt; 2</code></pre><p><code>npm run dev</code></p>'
    expect(sanitizeHtml(html)).toContain('const a = 1')
    expect(sanitizeHtml(html)).toContain('npm run dev')
  })

  it('keeps images and links', () => {
    const html = '<img src="https://files.abuamar.online/a.png" alt="cover"><a href="https://example.com">link</a>'
    const out = sanitizeHtml(html)
    expect(out).toContain('files.abuamar.online/a.png')
    expect(out).toContain('href="https://example.com"')
  })

  it('strips <script> tags and their contents', () => {
    const out = sanitizeHtml('<p>aman</p><script>alert(1)</script>')
    expect(out).not.toContain('script')
    expect(out).not.toContain('alert')
    expect(out).toContain('aman')
  })

  it('strips inline event handlers', () => {
    expect(sanitizeHtml('<img src="x" onerror="alert(1)">')).not.toContain('onerror')
    expect(sanitizeHtml('<div onclick="steal()">x</div>')).not.toContain('onclick')
    expect(sanitizeHtml('<svg onload="alert(1)"></svg>')).not.toContain('onload')
  })

  it('strips javascript: hrefs', () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">klik</a>')
    expect(out).not.toContain('javascript:')
  })

  it('strips iframes, objects and forms', () => {
    const out = sanitizeHtml('<iframe src="https://evil.com"></iframe><object data="x"></object><form action="/x"><input></form>')
    expect(out).not.toContain('iframe')
    expect(out).not.toContain('object')
    expect(out).not.toContain('<form')
    expect(out).not.toContain('<input')
  })

  it('strips style attributes and style tags', () => {
    expect(sanitizeHtml('<p style="position:fixed">x</p>')).not.toContain('style=')
    expect(sanitizeHtml('<style>body{display:none}</style>')).not.toContain('display:none')
  })

  it('returns an empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('')
  })
})
