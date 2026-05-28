import { getCurrentUser, signOut, requestPasswordReset } from '../../lib/authMock'

export default function SectionAccount({ displayName, onDisplayNameChange, onToast }) {
  const user = getCurrentUser()
  const email = user?.email ?? ''
  const initial = (displayName || user?.nome || email || '?').trim().charAt(0)

  async function handleResetPassword() {
    if (!email) {
      onToast({ text: 'Email non disponibile per il reset.', error: true })
      return
    }
    const res = await requestPasswordReset(email)
    if (res.ok) onToast({ text: 'Email di reset inviata a ' + email })
    else onToast({ text: res.error || 'Errore invio reset.', error: true })
  }

  return (
    <>
      <div className="sp-header">
        <div className="sp-header-left">
          <h2>Account</h2>
          <p>Gestisci il tuo profilo e le credenziali di accesso</p>
        </div>
        <div className="sp-header-right">
          <button
            type="button"
            className="btn primary"
            onClick={() => onToast({ text: 'Preferenze salvate' })}
          >
            Salva modifiche
          </button>
        </div>
      </div>

      <div className="sp-body">
        <section className="settings-section">
          <div className="section-label">Profilo</div>
          <div className="settings-card">
            <div className="avatar-block">
              <div className="big-avatar">{initial}</div>
              <div className="avatar-info">
                <h3>{displayName || user?.nome || 'Utente'}</h3>
                <p>Addetto · FiltroCappa</p>
              </div>
              <span className="avatar-badge">Attivo</span>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Nome completo</div>
                <div className="row-sub">Visibile nelle email inviate ai clienti</div>
              </div>
              <div className="row-control">
                <input
                  type="text"
                  className="settings-input"
                  value={displayName}
                  onChange={(e) => onDisplayNameChange(e.target.value)}
                />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Indirizzo email</div>
                <div className="row-sub">Account Gmail connesso</div>
              </div>
              <div className="row-control">
                <input type="text" className="settings-input" value={email} readOnly />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Sicurezza</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Password</div>
                <div className="row-sub">Invia un link di reset alla tua email</div>
              </div>
              <div className="row-control">
                <button type="button" className="btn ghost-card" onClick={handleResetPassword}>
                  Cambia password
                </button>
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Sessioni attive</div>
                <div className="row-sub">1 dispositivo connesso</div>
              </div>
              <div className="row-control">
                <button type="button" className="btn ghost-card" disabled title="Disponibile presto">
                  Visualizza sessioni
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Zona pericolosa</div>
          <div className="settings-card">
            <div className="danger-row">
              <div className="row-label-block">
                <div className="row-label">Esci dalla dashboard</div>
                <div className="row-sub">Termina la sessione corrente</div>
              </div>
              <div className="row-control">
                <button type="button" className="btn danger" onClick={() => signOut()}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
