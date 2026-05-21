// API client per la Knowledge Base: chiama i 4 webhook n8n.
const BASE = import.meta.env.VITE_N8N_BASE_URL
const KEY = import.meta.env.VITE_KB_API_KEY

const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': KEY,
}

async function parseOrThrow(res, op) {
  const text = await res.text()
  let body
  try { body = text ? JSON.parse(text) : {} } catch { body = { raw: text } }
  if (!res.ok || body.success === false) {
    const msg = body.error || body.message || `KB ${op} failed: ${res.status}`
    throw new Error(msg)
  }
  return body
}

export async function getKbFaqs() {
  const res = await fetch(`${BASE}/webhook/kb/list`, { method: 'GET', headers: HEADERS })
  const body = await parseOrThrow(res, 'list')
  return body.data ?? []
}

export async function addKbFaq({ domanda, risposta, categoria, parole_chiave }) {
  const res = await fetch(`${BASE}/webhook/kb/add`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ domanda, risposta, categoria: categoria || null, parole_chiave: (parole_chiave || []).slice(0, 3) }),
  })
  return parseOrThrow(res, 'add')
}

export async function updateKbFaq({ id, domanda, risposta, categoria, parole_chiave }) {
  const res = await fetch(`${BASE}/webhook/kb/update`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify({ id, domanda, risposta, categoria: categoria || null, parole_chiave: (parole_chiave || []).slice(0, 3) }),
  })
  return parseOrThrow(res, 'update')
}

export async function deleteKbFaq(id) {
  const res = await fetch(`${BASE}/webhook/kb/delete`, {
    method: 'DELETE',
    headers: HEADERS,
    body: JSON.stringify({ id }),
  })
  return parseOrThrow(res, 'delete')
}
