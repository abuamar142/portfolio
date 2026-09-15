import type { Directive } from 'vue'

/**
 * v-reveal: motivated scroll entry only (hierarchy + storytelling order).
 * Adds `.rv` on mount; IntersectionObserver flips `.is-in` once the element
 * enters the viewport. Transform + opacity only, never layout properties.
 * Stagger with an inline `--rv-i` index: `style="{ '--rv-i': i }"`.
 * No `window.addEventListener('scroll')`. Respects `prefers-reduced-motion`
 * through the CSS layer (elements resolve to visible instantly).
 */
export const vReveal: Directive<HTMLElement, void> = {
  mounted(el) {
    el.classList.add('rv')

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-in')
            io.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
  },
}
