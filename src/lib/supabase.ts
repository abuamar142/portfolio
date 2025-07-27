import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://brghgmleqkppibcebcix.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZ2hnbWxlcWtwcGliY2ViY2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyODcwMTUsImV4cCI6MjA0NTg2MzAxNX0.LFL8Xy3YG4KtN057Ap5obbHKriaOmoLyKVVAjHjfc7k'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
