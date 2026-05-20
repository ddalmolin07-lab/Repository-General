import { supabase } from '../lib/supabase'

// Escalation attive (in attesa o prese in carico dall'addetto)
export async function getRequests() {
  const { data, error } = await supabase
    .from('email_requests')
    .select('*')
    .in('stato', ['in_attesa_addetto', 'presa_in_carico'])
    .order('timestamp_arrivo', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Claim atomico via Postgres function: solo se in stato 'in_attesa_addetto'
// passa a 'presa_in_carico'. Ritorna la riga aggiornata, oppure null se il
// claim non è andato a buon fine (race: già preso in carico o non eleggibile).
export async function claimRequest(id) {
  const { data, error } = await supabase.rpc('claim_request', { p_id: id })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return row ?? null
}

// Invia risposta via n8n. Il workflow è single-writer: legge mittente/oggetto
// dal DB, invia la Gmail e fa l'UPDATE atomico (stato='risolta_addetto').
// Payload minimo: {id, testo_risposta}.
// Response: { ok: true } | { already_sent: true } per re-invii idempotenti.
export async function postReply({ id, testo_risposta }) {
  const BASE = import.meta.env.VITE_N8N_BASE_URL
  const KEY = import.meta.env.VITE_KB_API_KEY
  const res = await fetch(`${BASE}/webhook/dashboard/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': KEY,
    },
    body: JSON.stringify({ id, testo_risposta }),
  })
  if (!res.ok) throw new Error(`Reply webhook failed: ${res.status}`)
  return res.json().catch(() => ({}))
}

// Storico (tutte le richieste, con filtri opzionali)
export async function getHistory({ stato, search } = {}) {
  let q = supabase
    .from('email_requests')
    .select('*')
    .order('timestamp_arrivo', { ascending: false })
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
