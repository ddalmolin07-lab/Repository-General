import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import AuthInput from '../../components/auth/AuthInput'
import AuthButton from '../../components/auth/AuthButton'
import PasswordStrength from '../../components/auth/PasswordStrength'
import { signUp } from '../../lib/authMock'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUp() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accept, setAccept] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitErr, setSubmitErr] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (nome.trim().length < 2) e.nome = 'Inserisci il tuo nome'
    if (!EMAIL_RE.test(email)) e.email = 'Email non valida'
    if (password.length < 8) e.password = 'Almeno 8 caratteri'
    if (!accept) e.accept = 'Devi accettare i termini per procedere'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setSubmitErr('')
    if (!validate()) return
    setLoading(true)
    const res = await signUp({ nome, email, password })
    setLoading(false)
    if (res.ok) navigate('/', { replace: true })
    else setSubmitErr(res.error || 'Registrazione non riuscita.')
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <span className="auth-eyebrow"><span className="auth-eyebrow-dot" /> Nuovo account</span>

        <div>
          <h1 className="auth-title">Inizia con Filtro K.</h1>
          <p className="auth-subtitle">Crea il tuo account in 30 secondi. Nessuna carta richiesta.</p>
        </div>

        <div className="auth-form">
          <AuthInput
            name="nome" type="text" icon="user"
            label="Nome completo"
            placeholder="Es. Marco Rossi"
            value={nome} onChange={setNome}
            onBlur={() => nome.trim().length >= 2 && setErrors((p) => ({ ...p, nome: undefined }))}
            error={errors.nome}
            autoComplete="name"
            disabled={loading}
          />

          <AuthInput
            name="email" type="email" icon="mail"
            label="Email aziendale"
            placeholder="tuo.nome@filtrocappa.it"
            value={email} onChange={setEmail}
            onBlur={() => EMAIL_RE.test(email) && setErrors((p) => ({ ...p, email: undefined }))}
            error={errors.email}
            autoComplete="email"
            disabled={loading}
          />

          <div>
            <AuthInput
              name="password" type="password" icon="lock"
              label="Password"
              placeholder="Minimo 8 caratteri"
              value={password} onChange={setPassword}
              onBlur={() => password.length >= 8 && setErrors((p) => ({ ...p, password: undefined }))}
              error={errors.password}
              autoComplete="new-password"
              disabled={loading}
            />
            <PasswordStrength password={password} />
          </div>

          <label className="auth-checkbox" style={{ alignItems: 'flex-start', lineHeight: 1.5 }}>
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => { setAccept(e.target.checked); if (e.target.checked) setErrors((p) => ({ ...p, accept: undefined })) }}
              disabled={loading}
              style={{ marginTop: 2 }}
            />
            <span style={{ fontSize: 12 }}>
              Accetto i <a href="#termini" className="auth-link">Termini</a> e l'<a href="#privacy" className="auth-link">Informativa Privacy</a> di Filtro K.
            </span>
          </label>
          {errors.accept && <div className="auth-error-msg">{errors.accept}</div>}

          {submitErr && <div className="auth-error-msg">{submitErr}</div>}

          <AuthButton loading={loading} loadingLabel="Creazione account…">
            Crea account
          </AuthButton>
        </div>

        <p className="auth-switch">
          Hai già un account? <Link to="/login" className="auth-link">Accedi</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
