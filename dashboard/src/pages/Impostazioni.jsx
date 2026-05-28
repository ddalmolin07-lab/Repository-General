import { useEffect, useRef, useState } from 'react'
import InitialsAvatar from '../components/settings/InitialsAvatar'
import { getCurrentUser, signOut } from '../lib/authMock'
import { supabase } from '../lib/supabase'
import { getMySettings, upsertMySettings } from '../api/settings'

const DEBOUNCE_MS = 600

export default function Impostazioni() {
  const user = getCurrentUser()
  const email = user?.email ?? ''

  const [displayName, setDisplayName] = useState('')
  const [signature, setSignature] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast] = useState(null)
  const [pwOpen, setPwOpen] = useState(false)

  const saveTimer = useRef(null)
  const firstLoad = useRef(true)

  useEffect(() => {
    (async () => {
      try {
        const s = await getMySettings()
        setDisplayName(s.display_name)
        setSignature(s.signature)
      } catch (e) {
        setToast({ text: e.message || 'Errore caricamento impostazioni', error: true })
      } finally {
        setLoaded(true)
      }
    })()
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (firstLoad.current) { firstLoad.current = false; return }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await upsertMySettings({ display_name: displayName, signature })
        setToast({ text: 'Salvato' })
      } catch (e) {
        setToast({ text: e.message || 'Errore salvataggio', error: true })
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(saveTimer.current)
  }, [displayName, signature, loaded])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  async function handleLogout() {
    await signOut()
    window.location.assign('/login')
  }

  return (
    <div className="settings-page settings-page-minimal">
      <div className="settings-panel">
        <div className="sp-header">
          <div className="sp-header-left">
            <h2>Impostazioni</h2>
            <p>Profilo e firma utilizzata nelle risposte</p>
          </div>
        </div>

        <div className="sp-body">
          {/* SEZIONE 1 — Account */}
          <section className="settings-section">
            <div className="section-label">Account</div>
            <div className="settings-card">
              <div className="avatar-block">
                <InitialsAvatar name={displayName} email={email} size={60} />
                <div className="avatar-info">
                  <h3>{displayName || email.split('@')[0] || 'Utente'}</h3>
                  <p>FiltroCappa</p>
                </div>
              </div>

              <div className="settings-row">
                <div className="row-label-block">
                  <div className="row-label">Nome visualizzato</div>
                  <div className="row-sub">Mostrato nella dashboard e nelle iniziali</div>
                </div>
                <div className="row-control">
                  <input
                    type="text"
                    className="settings-input"
                    value={displayName}
                    placeholder="Es. Mario Rossi"
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!loaded}
                  />
                </div>
              </div>

              <div className="settings-row">
                <div className="row-label-block">
                  <div className="row-label">Email</div>
                  <div className="row-sub">Account di accesso</div>
                </div>
                <div className="row-control">
                  <input type="text" className="settings-input" value={email} readOnly />
                </div>
              </div>

              <div className="settings-row">
                <div className="row-label-block">
                  <div className="row-label">Password</div>
                  <div className="row-sub">Cambia la password di accesso</div>
                </div>
                <div className="row-control">
                  <button type="button" className="btn ghost-card" onClick={() => setPwOpen(true)}>
                    Cambia password
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SEZIONE 2 — Risposte */}
          <section className="settings-section">
            <div className="section-label">Risposte</div>
            <div className="settings-card">
              <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                <div className="row-label-block">
                  <div className="row-label">Firma automatica</div>
                  <div className="row-sub">Verrà aggiunta in fondo a ogni risposta inviata dalla dashboard.</div>
                </div>
                <textarea
                  className="settings-input"
                  style={{ width: '100%', minHeight: 120, padding: 12, lineHeight: 1.5, resize: 'vertical' }}
                  value={signature}
                  placeholder={"Es.\nGrazie,\nMario Rossi\nFiltroCappa"}
                  onChange={(e) => setSignature(e.target.value)}
                  disabled={!loaded}
                />
              </div>
            </div>
          </section>

          {/* Logout, sezione separata */}
          <section className="settings-section">
            <div className="section-label">Sessione</div>
            <div className="settings-card">
              <div className="settings-row">
                <div className="row-label-block">
                  <div className="row-label">Esci</div>
                  <div className="row-sub">Termina la sessione corrente</div>
                </div>
                <div className="row-control">
                  <button type="button" className="btn danger" onClick={handleLogout}>Esci</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {pwOpen && (
        <ChangePasswordModal
          onClose={() => setPwOpen(false)}
          onDone={(msg, isError) => {
            setPwOpen(false)
            setToast({ text: msg, error: !!isError })
          }}
        />
      )}

      {toast && (
        <div className={`settings-toast${toast.error ? ' error' : ''}`}>{toast.text}</div>
      )}
    </div>
  )
}

function ChangePasswordModal({ onClose, onDone }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setErr(null)
    if (pw.length < 8) { setErr('Minimo 8 caratteri.'); return }
    if (pw !== pw2) { setErr('Le password non coincidono.'); return }
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) { setErr(error.message); return }
    onDone('Password aggiornata')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,24,36,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380, background: 'linear-gradient(150deg, var(--card-light) 0%, var(--card-dark) 100%)',
          borderRadius: 16, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--card-text)', marginBottom: 4 }}>
          Cambia password
        </h3>
        <label style={{ fontSize: 12, color: 'var(--card-meta)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          Nuova password
          <input
            type="password"
            className="settings-input"
            style={{ width: '100%' }}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label style={{ fontSize: 12, color: 'var(--card-meta)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          Conferma password
          <input
            type="password"
            className="settings-input"
            style={{ width: '100%' }}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            required
          />
        </label>
        {err && (
          <div style={{ fontSize: 12, color: '#C57A5A' }}>{err}</div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" className="btn ghost-card" onClick={onClose} disabled={busy}>Annulla</button>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Salvataggio…' : 'Aggiorna'}
          </button>
        </div>
      </form>
    </div>
  )
}
