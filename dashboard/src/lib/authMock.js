// Mock front-end auth. Da sostituire con Netlify Identity / Supabase più avanti.

const STORAGE_KEY = 'fk_auth_session'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('fk-auth-change'))
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('fk-auth-change'))
}

export function isAuthenticated() {
  return !!readSession()
}

export function getCurrentUser() {
  const s = readSession()
  return s?.user || null
}

export async function signIn({ email, password }) {
  await sleep(900)
  if (!email || !password) {
    return { ok: false, error: 'Inserisci email e password.' }
  }
  writeSession({
    user: { email, nome: email.split('@')[0] },
    issuedAt: Date.now(),
  })
  return { ok: true }
}

export async function signUp({ nome, email, password }) {
  await sleep(1100)
  if (!nome || !email || !password) {
    return { ok: false, error: 'Compila tutti i campi.' }
  }
  writeSession({
    user: { email, nome },
    issuedAt: Date.now(),
  })
  return { ok: true }
}

export async function requestPasswordReset(email) {
  await sleep(900)
  if (!email) return { ok: false, error: 'Inserisci la tua email.' }
  return { ok: true }
}

export function signOut() {
  clearSession()
}

export function onAuthChange(cb) {
  const handler = () => cb(isAuthenticated())
  window.addEventListener('fk-auth-change', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('fk-auth-change', handler)
    window.removeEventListener('storage', handler)
  }
}
