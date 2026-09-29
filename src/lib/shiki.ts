import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { HighlighterCore } from 'shiki/core'

// Lazy singleton — only created on the client
let highlighterPromise: Promise<HighlighterCore> | null = null

const LANG_MAP: Record<string, string> = {
  typescript: 'typescript',
  ts: 'typescript',
  javascript: 'javascript',
  js: 'javascript',
  vue: 'vue',
  html: 'html',
  css: 'css',
  json: 'json',
  go: 'go',
  python: 'python',
  py: 'python',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  markdown: 'markdown',
  md: 'markdown',
  rust: 'rust',
  rs: 'rust',
  java: 'java',
  php: 'php',
  ruby: 'ruby',
  rb: 'ruby',
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  text: 'text',
}

/** Map unknown language aliases to known IDs, or 'text' if unrecognised. */
function resolveLanguage(lang: string): string {
  return LANG_MAP[lang.toLowerCase()] || 'text'
}

/** Languages loaded on demand via dynamic import. */
const LANG_IMPORTS: Record<string, () => Promise<unknown>> = {
  typescript: () => import('shiki/langs/typescript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
}

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import('shiki/themes/github-light.mjs'),
        import('shiki/themes/github-dark.mjs'),
      ],
      langs: [], // languages loaded on demand
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}

/**
 * Highlight code to HTML. Safe to call during SSR — returns the raw code
 * wrapped in `<pre>` when window is unavailable.
 */
export async function highlight(
  code: string,
  lang: string,
  dark: boolean,
): Promise<string> {
  if (typeof window === 'undefined') {
    return escapeHtml(code)
  }

  const resolved = resolveLanguage(lang)
  if (resolved === 'text') {
    return escapeHtml(code)
  }

  const highlighter = await getHighlighter()

  // Load language if not yet bundled
  if (resolved in LANG_IMPORTS) {
    try {
      await highlighter.loadLanguage(
        (await LANG_IMPORTS[resolved]()) as Parameters<HighlighterCore['loadLanguage']>[0],
      )
    } catch {
      // Language load failed — fall through to plain text
      return escapeHtml(code)
    }
  }

  return highlighter.codeToHtml(code, {
    lang: resolved,
    theme: dark ? 'github-dark' : 'github-light',
  })
}

/**
 * Highlight every fenced code block inside a rendered article, in place.
 *
 * Blog bodies arrive as HTML from `marked` — `<pre><code class="language-x">`
 * — because that is what the prerenderer can write without a DOM. This walks
 * those blocks, swaps each for Shiki's coloured markup, and tags the result
 * with its language so a second pass (the theme flip) does not have to guess:
 * after the first run the fence class is gone, replaced by Shiki's own.
 *
 * Blocks whose language has no bundled grammar are left exactly as they are.
 * A plain <pre> is honest and readable; `highlight()` would hand back bare
 * escaped text, which has no <pre> to go in and would break the layout.
 *
 * Returns how many blocks were painted, so a caller can skip the work when a
 * post has no code at all.
 */
export async function highlightCodeBlocks(root: HTMLElement, dark: boolean): Promise<number> {
  const blocks = Array.from(root.querySelectorAll('pre'))
  let painted = 0

  for (const pre of blocks) {
    const code = pre.querySelector('code')
    if (!code) continue

    const lang = pre.dataset.lang || /language-([\w+-]+)/.exec(code.className)?.[1] || ''
    if (resolveLanguage(lang) === 'text') continue

    const html = await highlight(code.textContent || '', lang, dark)
    const next = new DOMParser().parseFromString(html, 'text/html').querySelector('pre')
    if (!next) continue

    // The article's own surface frames the block (`.blog-content pre` owns the
    // border, padding and fill). Shiki ships its theme background inline, which
    // would sit on top of that design as a second, foreign colour — and only in
    // dark mode, where the two differ. Keep the palette, drop the fill.
    next.style.backgroundColor = ''
    next.dataset.lang = lang
    pre.replaceWith(next)
    painted++
  }

  return painted
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
