import { useState } from 'react'

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c6.5 0 10 7 10 7a18.2 18.2 0 0 1-3 3.7" />
    <path d="M6.4 6.4A18.2 18.2 0 0 0 2 13s3.5 7 10 7c1.6 0 3-.4 4.3-1" />
    <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" />
  </svg>
)
const IconAlert = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

const ICONS = { mail: IconMail, lock: IconLock, user: IconUser }

export default function AuthInput({
  type = 'text',
  name,
  label,
  placeholder,
  icon = 'mail',
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  disabled = false,
}) {
  const [focused, setFocused] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const Icon = ICONS[icon] || IconMail
  const isPassword = type === 'password'
  const inputType = isPassword ? (revealed ? 'text' : 'password') : type

  return (
    <div className="auth-field">
      {label && <label className="auth-label" htmlFor={name}>{label}</label>}
      <div className={`auth-input-wrap${focused ? ' focused' : ''}${error ? ' error' : ''}`}>
        <span className="auth-input-icon"><Icon /></span>
        <input
          id={name}
          name={name}
          type={inputType}
          className="auth-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); onBlur?.(e.target.value) }}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="auth-input-toggle"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Nascondi password' : 'Mostra password'}
          >
            {revealed ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {error && (
        <span className="auth-error-msg"><IconAlert /> {error}</span>
      )}
    </div>
  )
}
