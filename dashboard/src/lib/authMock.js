// Wrapper auth: oggi usa Supabase Auth reale. Il nome del file resta
// "authMock" per non rompere import esistenti (SignIn/SignUp/ProtectedLayout).
import { supabase } from './supabase'

let currentSession = null
const subscribers = new Set()

function notify() {
  for (const cb of subscribers) cb(!!currentSession)
}

// Boot: prendi la sessione persistita (sync da localStorage interno a supabase-js)
supabase.auth.getSession().then(({ data }) => {
  currentSession = data.session ?? null
  notify()
})

supabase.auth.onAuthStateChange((_event, session) => {
  currentSession = session ?? null
  notify()
})

export function isAuthenticated() {
  return !!currentSession
}

export function getCurrentUser() {
  const u = currentSession?.user
  if (!u) return null
  return {
    email: u.email,
    nome: u.user_metadata?.nome || u.email?.split('@')[0] || 'utente',
  }
}

export async function signIn({ email, password }) {
  if (!email || !password) return { ok: false, error: 'Inserisci email e password.' }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { ok: false, error: error.message === 'Invalid login credentials' ? 'Email o password non corrette.' : error.message }
  }
  currentSession = data.session
  notify()
  return { ok: true }
}

export async function signUp({ nome, email, password }) {
  if (!nome || !email || !password) return { ok: false, error: 'Compila tutti i campi.' }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  })
  if (error) return { ok: false, error: error.message }
  // Se email confirmation è abilitata su Supabase, data.session sarà null.
  currentSession = data.session
  notify()
  if (!data.session) {
    return { ok: true, needsEmailConfirm: true }
  }
  return { ok: true }
}

export async function requestPasswordReset(email) {
  if (!email) return { ok: false, error: 'Inserisci la tua email.' }
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function signOut() {
  await supabase.auth.signOut()
  currentSession = null
  notify()
}

export function onAuthChange(cb) {
  subscribers.add(cb)
  // Eventuale evento iniziale è già scattato in boot
  return () => subscribers.delete(cb)
}
