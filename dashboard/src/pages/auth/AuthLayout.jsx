import AuthArtPanel from './AuthArtPanel'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-form-col">
        <header className="auth-brand">
          <span className="auth-brand-mark">F</span>
          <span>Filtro K</span>
        </header>

        <div className="auth-form-body">
          {children}
        </div>

        <footer className="auth-foot">
          <span>© 2026 Filtro K</span>
          <span style={{ display: 'flex', gap: 14 }}>
            <a href="#privacy">Privacy</a>
            <a href="#termini">Termini</a>
          </span>
        </footer>
      </div>

      <AuthArtPanel />
    </div>
  )
}
