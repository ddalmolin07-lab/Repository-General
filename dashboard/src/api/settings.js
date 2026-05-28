import { supabase } from '../lib/supabase'

const EMPTY = { display_name: '', signature: '' }

export async function getMySettings() {
  const { data: u } = await supabase.auth.getUser()
  const uid = u?.user?.id
  if (!uid) return { ...EMPTY, exists: false }
  const { data, error } = await supabase
    .from('app_settings')
    .select('display_name, signature')
    .eq('user_id', uid)
    .maybeSingle()
  if (error) throw error
  if (!data) return { ...EMPTY, exists: false }
  return {
    display_name: data.display_name ?? '',
    signature: data.signature ?? '',
    exists: true,
  }
}

export async function upsertMySettings({ display_name, signature }) {
  const { data: u } = await supabase.auth.getUser()
  const uid = u?.user?.id
  if (!uid) throw new Error('Utente non autenticato')
  const { error } = await supabase
    .from('app_settings')
    .upsert(
      { user_id: uid, display_name, signature },
      { onConflict: 'user_id' },
    )
  if (error) throw error
}
