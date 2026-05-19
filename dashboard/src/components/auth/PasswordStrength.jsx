function scorePassword(pwd) {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++
  return Math.min(score, 4)
}

const LABELS = ['', 'Debole', 'Discreta', 'Buona', 'Forte']

export default function PasswordStrength({ password }) {
  const score = scorePassword(password)
  return (
    <div>
      <div className="auth-strength" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`auth-strength-seg${score >= i ? ` on-${score}` : ''}`} />
        ))}
      </div>
      {password && (
        <div className="auth-strength-label">Sicurezza password: {LABELS[score]}</div>
      )}
    </div>
  )
}
