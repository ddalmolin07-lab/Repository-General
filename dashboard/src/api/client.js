import { supabase } from '../lib/supabase'

// Escalation attive (escalated + non risolte)
export async function getRequests() {
  const { data, error } = await supabase
    .from('email_requests')
    .select('*')
    .eq('tipo', 'escalated')
    .neq('stato', 'risolto')
    .order('timestamp_arrivo', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Aggiorna solo lo stato (e timestamp_risolto se risolto)
export async function patchStatus({ id, stato }) {
  const update = { stato }
  if (stato === 'risolto') update.timestamp_risolto = new Date().toISOString()
  const { data, error } = await supabase
    .from('email_requests')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Invia risposta via n8n (Gmail) — l'unica chiamata che resta su n8n
export async function postReply({ id, mittente_email, oggetto_email, testo_risposta }) {
  const BASE = import.meta.env.VITE_N8N_BASE_URL
  const KEY = import.meta.env.VITE_KB_API_KEY
  const res = await fetch(`${BASE}/webhook/dashboard/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': KEY,
    },
    body: JSON.stringify({ id, mittente_email, oggetto_email, testo_risposta }),
  })
  if (!res.ok) throw new Error(`Reply webhook failed: ${res.status}`)
  // Aggiorna localmente lo stato a risolto + risposta_inviata
  await supabase
    .from('email_requests')
    .update({
      stato: 'risolto',
      timestamp_risolto: new Date().toISOString(),
      risposta_inviata: testo_risposta,
    })
    .eq('id', id)
  return res.json().catch(() => ({}))
}

// Storico (tutte le richieste, con filtri opzionali)
export async function getHistory({ tipo, stato, search } = {}) {
  let q = supabase
    .from('email_requests')
    .select('*')
    .order('timestamp_arrivo', { ascending: false })
  if (tipo) q = q.eq('tipo', tipo)
  if (stato) q = q.eq('stato', stato)
  if (search) {
    q = q.or(`mittente_email.ilike.%${search}%,oggetto_email.ilike.%${search}%`)
  }
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

// Analytics ultimi N giorni
export async function getAnalytics(days = 14) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('analytics_daily')
    .select('*')
    .gte('data', sinceStr)
    .order('data', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Ping per status integrazioni (sezione Impostazioni)
export async function pingSupabase() {
  const { error } = await supabase
    .from('email_requests')
    .select('id', { count: 'exact', head: true })
    .limit(1)
  return !error
}
