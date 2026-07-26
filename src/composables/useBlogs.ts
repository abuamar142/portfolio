import { ref, computed } from 'vue'
import type { BlogPost } from '@/types/blog'

const STORAGE_KEY = 'portfolio_blogs_v1'

const posts = ref<BlogPost[]>([])
const loaded = ref(false)

function loadFromStorage() {
  if (loaded.value) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      posts.value = JSON.parse(raw)
    }
  } catch (e) {
    console.error('Failed to load blogs from storage', e)
  } finally {
    loaded.value = true
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
}

export function useBlogs() {
  loadFromStorage()

  const publishedPosts = computed(() => posts.value.filter((p) => p.published))

  function create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...post,
    }
    posts.value.unshift(newPost)
    saveToStorage()
    return newPost
  }

  function update(id: string, changes: Partial<Omit<BlogPost, 'id' | 'createdAt'>>) {
    const idx = posts.value.findIndex((p) => p.id === id)
    if (idx === -1) return null
    const updated: BlogPost = {
      ...posts.value[idx],
      ...changes,
      updatedAt: new Date().toISOString(),
    }
    posts.value[idx] = updated
    saveToStorage()
    return updated
  }

  function remove(id: string) {
    const idx = posts.value.findIndex((p) => p.id === id)
    if (idx === -1) return false
    posts.value.splice(idx, 1)
    saveToStorage()
    return true
  }

  function togglePublish(id: string) {
    const post = posts.value.find((p) => p.id === id)
    if (!post) return null
    post.published = !post.published
    post.updatedAt = new Date().toISOString()
    saveToStorage()
    return post
  }

  return {
    posts,
    publishedPosts,
    create,
    update,
    remove,
    togglePublish,
  }
}

