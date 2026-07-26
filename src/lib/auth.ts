import { supabase } from './supabase'

export type SessionRole = 'admin' | 'user' | ''

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function getRoleFromJWT(accessToken?: string | null): SessionRole {
  if (!accessToken) return ''
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]))
    const role = (payload?.role || payload?.app_metadata?.role || '') as string
    return role === 'admin' ? 'admin' : ''
  } catch {
    return ''
  }
}

// Optional fallback: check admins table if JWT claim is missing
export async function isAdminByTable(userId?: string | null): Promise<boolean> {
  if (!userId) return false
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()
  if (error) return false
  return !!data
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  const role = getRoleFromJWT(session?.access_token)
  if (role === 'admin') return true
  // fallback to table
  return isAdminByTable(session?.user?.id)
}

