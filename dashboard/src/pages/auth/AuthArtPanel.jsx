// Placeholder artistico per il pannello destro (40%).
// L'utente sostituirà questo contenuto con un'animazione Higgsfield in seguito.

export default function AuthArtPanel() {
  return (
    <aside className="auth-art-col" aria-hidden>
      {/* TODO: Higgsfield animation slot — sostituire questo blocco con il video/canvas finale */}
      <div className="auth-art-orb a" />
      <div className="auth-art-orb b" />
      <div className="auth-art-orb c" />
      <div className="auth-art-grid" />
      <div className="auth-art-noise" />

      <div className="auth-art-content">
        <div className="auth-art-mini">
          <span className="auth-art-mini-dot" />
          Filtro K · Live
        </div>

        <h2 className="auth-art-hero">
          Ogni email merita la <em>risposta giusta</em>, al momento giusto.
        </h2>

        <div className="auth-art-cards">
          <div className="auth-art-card">
            <div className="auth-art-card-icon">✦</div>
            <div>
              <div className="auth-art-card-label">Gestite da AI</div>
              <div className="auth-art-card-value">87%</div>
            </div>
          </div>
          <div className="auth-art-card">
            <div className="auth-art-card-icon">◷</div>
            <div>
              <div className="auth-art-card-label">Tempo medio</div>
              <div className="auth-art-card-value">2.4h</div>
            </div>
          </div>
          <div className="auth-art-card">
            <div className="auth-art-card-icon">↗</div>
            <div>
              <div className="auth-art-card-label">Escalation oggi</div>
              <div className="auth-art-card-value">3 attive</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
