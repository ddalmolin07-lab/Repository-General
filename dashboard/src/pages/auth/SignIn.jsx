import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import AuthInput from '../../components/auth/AuthInput'
import AuthButton from '../../components/auth/AuthButton'
import { signIn } from '../../lib/authMock'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [submitErr, setSubmitErr] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!EMAIL_RE.test(email)) e.email = 'Email non valida'
    if (password.length < 8) e.password = 'Almeno 8 caratteri'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    setSubmitErr('')
    if (!validate()) return
    setLoading(true)
    const res = await signIn({ email, password })
    setLoading(false)
    if (res.ok) navigate('/', { replace: true })
    else setSubmitErr(res.error || 'Accesso non riuscito.')
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <span className="auth-eyebrow"><span className="auth-eyebrow-dot" /> Accesso</span>

        <div>
          <h1 className="auth-title">Bentornato.</h1>
          <p className="auth-subtitle">Accedi al tuo spazio Filtro K per gestire le escalation in arrivo.</p>
        </div>

        <div className="auth-form">
          <AuthInput
            name="email" type="email" icon="mail"
            label="Email"
            placeholder="tuo.nome@filtrocappa.it"
            value={email} onChange={setEmail}
            onBlur={() => EMAIL_RE.test(email) && setErrors((p) => ({ ...p, email: undefined }))}
            error={errors.email}
            autoComplete="email"
            disabled={loading}
          />

          <AuthInput
            name="password" type="password" icon="lock"
            label="Password"
            placeholder="••••••••"
            value={password} onChange={setPassword}
            onBlur={() => password.length >= 8 && setErrors((p) => ({ ...p, password: undefined }))}
            error={errors.password}
            autoComplete="current-password"
            disabled={loading}
          />

          <div className="auth-row-meta">
            <label className="auth-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Ricordami su questo dispositivo
            </label>
            <Link to="/forgot-password" className="auth-link">Password dimenticata?</Link>
          </div>

          {submitErr && (
            <div className="auth-error-msg" style={{ marginTop: 4 }}>{submitErr}</div>
          )}

          <AuthButton loading={loading} loadingLabel="Accesso in corso…">
            Accedi
          </AuthButton>
        </div>

        <p className="auth-switch">
          Non hai ancora un account? <Link to="/signup" className="auth-link">Registrati</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
