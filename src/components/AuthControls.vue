<template>
  <template v-if="isAuthenticated">
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
        <div class="bg-neutral text-neutral-content w-10 h-10 flex items-center justify-center">
          <span class="text-sm leading-none">{{ userInitials }}</span>
        </div>
      </div>
      <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-200 border border-base-300 z-10 w-52 p-2 shadow-lg mt-2">
        <li class="menu-title">{{ user?.display_name || user?.username }}</li>
        <li><a @click="handleLogout"><LogOut :size="14" /> {{ $t('auth.logout') }}</a></li>
      </ul>
    </div>
  </template>
  <button v-else @click="() => openAuth()" class="btn btn-primary">
    {{ $t('auth.signIn') }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LogOut } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

// Shared auth cluster for page headers: avatar dropdown + logout when signed
// in, Sign In (opens the global AuthModal) otherwise.
const { t } = useI18n()
const toast = useToast()
const { user, isAuthenticated, openAuth, logout } = useAuth()

const userInitials = computed(() => {
  const name = user.value?.display_name || user.value?.username || ''
  return name.charAt(0).toUpperCase() || '?'
})

function handleLogout() {
  logout()
  toast.info(t('auth.loggedOutToast'))
}
</script>
