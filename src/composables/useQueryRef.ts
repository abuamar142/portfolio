import { nextTick, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

/**
 * Bind a ref to one query-string parameter, so list state (search, filters,
 * pagination) is shareable, survives reload, and the back button behaves.
 *
 * Writes use router.replace: typing in a search box must not flood history.
 * The default value drops its key so URLs stay clean (/quotes, not
 * /quotes?sort=random&tag=&page=1).
 */

/**
 * Writes from every instance are composed here before navigating. Two refs can
 * change in the same tick (search watch resets page) — each router.replace
 * would otherwise be built from the still-stale route.query and the last write
 * would silently drop the first one's key. Scoped to the route path so a
 * leftover filter from another page can never leak into the next write.
 */
let pending: { path: string; query: LocationQuery } | null = null

export function useQueryStringRef<T extends string>(key: string, defaultValue: T): Ref<T> {
  return makeQueryRef(
    key,
    defaultValue,
    (raw) => raw as T,
    (value) => (value === defaultValue ? null : value),
  )
}

/** Positive-integer query param (pagination). Non-numeric falls back to default. */
export function useQueryNumberRef(key: string, defaultValue: number): Ref<number> {
  return makeQueryRef(
    key,
    defaultValue,
    (raw) => {
      const parsed = Number.parseInt(raw, 10)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue
    },
    (value) => (value === defaultValue ? null : String(value)),
  )
}

function makeQueryRef<V>(
  key: string,
  defaultValue: V,
  parse: (raw: string) => V,
  serialize: (value: V) => string | null,
): Ref<V> {
  const route = useRoute()
  const router = useRouter()

  const readFromRoute = (): V => {
    const raw = route.query[key]
    return typeof raw === 'string' ? parse(raw) : defaultValue
  }

  const model = ref(readFromRoute()) as Ref<V>
  let adopting = false

  watch(model, (value) => {
    if (adopting || typeof window === 'undefined') return
    if (!pending || pending.path !== route.path) {
      pending = { path: route.path, query: { ...route.query } }
    }
    const encoded = serialize(value)
    if (encoded === null) delete pending.query[key]
    else pending.query[key] = encoded
    void router.replace({ query: { ...pending.query } })
  })

  // URL -> ref: deep-linked first load is handled by the initial read above;
  // this covers external changes (manual URL edit handled by reload, but also
  // any router.push to the same route with different params).
  watch(
    () => route.query[key],
    (raw) => {
      const next = typeof raw === 'string' ? parse(raw) : defaultValue
      // The navigation we just finished is the settled source of truth.
      if (pending && pending.path === route.path) {
        pending = { path: route.path, query: { ...route.query } }
      }
      if (next === model.value) return
      adopting = true
      model.value = next
      void nextTick(() => {
        adopting = false
      })
    },
  )

  return model
}
