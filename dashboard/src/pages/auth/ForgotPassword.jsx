import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import AuthInput from '../../components/auth/AuthInput'
import AuthButton from '../../components/auth/AuthButton'
import { requestPasswordReset } from '../../lib/authMock'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setError('')
    if (!EMAIL_RE.test(email)) { setError('Email non valida'); return }
    setLoading(true)
    const res = await requestPasswordReset(email)
    setLoading(false)
    if (res.ok) setSent(true)
    else setError(res.error || 'Invio non riuscito.')
  }

  return (
    <AuthLayout>
      {!sent ? (
        <form className="auth-card" onSubmit={onSubmit} noValidate>
          <span className="auth-eyebrow"><span className="auth-eyebrow-dot" /> Recupero</span>

          <div>
            <h1 className="auth-title">Password dimenticata?</h1>
            <p className="auth-subtitle">Nessun problema. Inserisci la tua email e ti invieremo un link sicuro per reimpostarla.</p>
          </div>

          <div className="auth-form">
            <AuthInput
              name="email" type="email" icon="mail"
              label="Email"
              placeholder="tuo.nome@filtrocappa.it"
              value={email} onChange={setEmail}
              onBlur={() => EMAIL_RE.test(email) && setError('')}
              error={error}
              autoComplete="email"
              disabled={loading}
            />

            <AuthButton loading={loading} loadingLabel="Invio in corso…">
              Invia link di recupero
            </AuthButton>
          </div>

          <p className="auth-switch">
            <Link to="/login" className="auth-link">← Torna al login</Link>
          </p>
        </form>
      ) : (
        <div className="auth-card">
          <div className="auth-confirm">
            <div className="auth-confirm-icon"><CheckIcon /></div>
            <div>
              <h1 className="auth-title" style={{ fontSize: 28 }}>Controlla la tua email.</h1>
              <p className="auth-subtitle">
                Abbiamo inviato un link di recupero a <strong style={{ color: '#fff' }}>{email}</strong>.<br />
                Il link è valido per 30 minuti.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                className="auth-link"
                onClick={() => { setSent(false); setEmail('') }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px 0' }}
              >
                Cambia indirizzo
              </button>
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
              <Link to="/login" className="auth-link" style={{ padding: '8px 0' }}>Torna al login</Link>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
