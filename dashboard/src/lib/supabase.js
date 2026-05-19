import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey || anonKey.startsWith('PLACEHOLDER')) {
  console.warn('[supabase] Anon key non configurata — leggere da Supabase Dashboard → Settings → API e aggiornare .env.development')
}

export const supabase = createClient(url, anonKey)
