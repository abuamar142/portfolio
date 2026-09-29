import { describe, expect, it } from 'vitest'
import { highlightCodeBlocks } from '@/lib/shiki'

/**
 * The blog body arrives as HTML from `marked` and is painted after mount.
 * Two rules matter and neither is visible when it breaks:
 *
 *  - a block whose language has no bundled grammar must be left exactly as it
 *    was, because `highlight()` answers bare escaped text for unknown
 *    languages, which has no <pre> of its own and would collapse the frame;
 *  - the theme background Shiki ships inline must be dropped, or dark mode
 *    shows a GitHub-grey rectangle on the site's own dark surface.
 *
 * Real Shiki runs here — a mock would prove neither rule.
 */
function article(html: string): HTMLElement {
  const el = document.createElement('div')
  el.innerHTML = html
  return el
}

describe('highlightCodeBlocks', () => {
  it('paints a fenced block and keeps its text', async () => {
    const root = article('<pre><code class="language-bash">echo hi</code></pre>')

    const painted = await highlightCodeBlocks(root, false)

    expect(painted).toBe(1)
    expect(root.querySelector('pre')?.className).toContain('shiki')
    expect(root.textContent).toContain('echo hi')
  })

  it('leaves a block with no bundled grammar untouched', async () => {
    const original = '<pre><code class="language-nginx">server { listen 80; }</code></pre>'
    const root = article(original)

    const painted = await highlightCodeBlocks(root, false)

    expect(painted).toBe(0)
    // Not merely "still text": the whole element must survive, because the
    // article's own CSS frames a <pre> and nothing else.
    expect(root.querySelector('pre')?.outerHTML).toBe(original)
  })

  it('drops the theme background so the site surface shows through', async () => {
    const root = article('<pre><code class="language-bash">echo hi</code></pre>')

    await highlightCodeBlocks(root, true)

    const pre = root.querySelector('pre')!
    expect(pre.getAttribute('style') || '').not.toContain('background-color')
  })

  it('reports zero for an article without code', async () => {
    const root = article('<p>Hanya teks.</p>')
    expect(await highlightCodeBlocks(root, false)).toBe(0)
  })
})
