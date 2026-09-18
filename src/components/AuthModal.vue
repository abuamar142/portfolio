<template>
  <Teleport to="body">
    <dialog :class="['modal', show ? 'modal-open' : '']" @click.self="$emit('close')">
      <div class="modal-box">
        <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X :size="16" /></button>
        <h2 class="font-bold text-lg mb-4">
          {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div v-if="mode === 'register'">
            <label class="label"><span class="label-text">Display Name</span></label>
            <input v-model="form.display_name" type="text" class="input input-bordered w-full" placeholder="Your name" />
          </div>

          <div>
            <label class="label"><span class="label-text">{{ mode === 'login' ? 'Email or Username' : 'Email' }}</span></label>
            <input v-model="form.identifier" type="text" required class="input input-bordered w-full" :placeholder="mode === 'login' ? 'email or username' : 'email@example.com'" />
          </div>

          <div v-if="mode === 'register'">
            <label class="label"><span class="label-text">Username</span></label>
            <input v-model="form.username" type="text" class="input input-bordered w-full" placeholder="username" />
          </div>

          <div>
            <label class="label"><span class="label-text">Password</span></label>
            <input v-model="form.password" type="password" required minlength="8" class="input input-bordered w-full" placeholder="••••••••" />
          </div>

          <p v-if="error" class="text-sm text-error">{{ error }}</p>

          <button type="submit" :disabled="loading" class="btn btn-primary w-full">
            {{ loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account' }}
          </button>
        </form>

        <p class="mt-3 text-center text-sm">
          {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
          <button @click="toggleMode" class="link link-primary">
            {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
          </button>
        </p>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import axios from 'axios'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { setToken, storeUser } = useAuth()
const toast = useToast()
const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

const form = reactive({
  identifier: '',
  username: '',
  password: '',
  display_name: '',
})

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'https://auth.abuamar.online'

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}

async function handleLogin(identifier: string, password: string) {
  const { data } = await axios.post(`${AUTH_URL}/api/v1/auth/login`, { identifier, password })
  if (data.data?.access_token) {
    setToken(data.data.access_token)
    // Login doesn't return user — fetch it from /me
    const { data: meData } = await axios.get(`${AUTH_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${data.data.access_token}` },
    })
    if (meData.data) {
      storeUser(meData.data)
    }
    toast.success(mode.value === 'register' ? 'Account created!' : 'Welcome back!')
    emit('close')
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (mode.value === 'register') {
      // Register first
      await axios.post(`${AUTH_URL}/api/v1/auth/register`, {
        email: form.identifier,
        username: form.username,
        password: form.password,
        display_name: form.display_name,
      })
      // Auto-login after register (register doesn't return token)
      await handleLogin(form.identifier, form.password)
    } else {
      await handleLogin(form.identifier, form.password)
    }
  } catch (e: any) {
    const msg = e.response?.data?.error?.details || e.response?.data?.message || 'Something went wrong'
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
