import { getCurrentUser } from '../../lib/authMock'

const WEBHOOKS = [
  { method: 'get',   path: '/webhook/dashboard/requests',  desc: 'Escalation attive' },
  { method: 'post',  path: '/webhook/dashboard/reply',     desc: 'Invia risposta' },
  { method: 'patch', path: '/webhook/dashboard/status',    desc: 'Aggiorna stato' },
  { method: 'get',   path: '/webhook/dashboard/history',   desc: 'Storico richieste' },
  { method: 'get',   path: '/webhook/dashboard/analytics', desc: 'Dati analytics' },
]

const API_KEY_PREVIEW = 'fk-kb-api-••••'

export default function SectionIntegrations({ onToast }) {
  const user = getCurrentUser()
  const email = user?.email ?? '—'

  function copyKey() {
    navigator.clipboard?.writeText(API_KEY_PREVIEW).catch(() => {})
    onToast({ text: 'Chiave copiata' })
  }

  return (
    <>
      <div className="sp-header">
        <div className="sp-header-left">
          <h2>Integrazioni</h2>
          <p>Servizi connessi, API key e webhook</p>
        </div>
      </div>

      <div className="sp-body">
        <section className="settings-section">
          <div className="section-label">Servizi Google</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="int-row-left">
                <div className="int-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="14" height="10" rx="2" />
                    <path d="M1 5l7 5 7-5" />
                  </svg>
                </div>
                <div>
                  <div className="row-label">Gmail</div>
                  <div className="row-sub">{email}</div>
                </div>
              </div>
              <div className="row-control">
                <span className="integration-badge connected">
                  <span className="integration-badge-dot" />
                  Connesso
                </span>
              </div>
            </div>
            <div className="settings-row">
              <div className="int-row-left">
                <div className="int-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="14" height="14" rx="2" />
                    <path d="M1 6h14M1 11h14M6 1v14" />
                  </svg>
                </div>
                <div>
                  <div className="row-label">Google Sheets</div>
                  <div className="row-sub">FiltroCappa — Dashboard</div>
                </div>
              </div>
              <div className="row-control">
                <span className="integration-badge connected">
                  <span className="integration-badge-dot" />
                  Connesso
                </span>
                <button type="button" className="btn ghost-card" disabled title="Disponibile presto">
                  Apri Sheet
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">API Key</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Chiave di autenticazione</div>
                <div className="row-sub">
                  Inviata nell'header{' '}
                  <code style={{ fontFamily: 'monospace', fontSize: 11, background: 'rgba(37,43,60,0.08)', padding: '1px 5px', borderRadius: 4 }}>
                    X-API-Key
                  </code>{' '}
                  delle richieste n8n
                </div>
              </div>
              <div className="row-control">
                <div className="apikey-row">
                  <div className="apikey-value">{API_KEY_PREVIEW}</div>
                  <button type="button" className="btn ghost-card" onClick={copyKey}>Copia</button>
                  <button type="button" className="btn danger" disabled title="Disponibile presto">Rigenera</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Webhook n8n</div>
          <div className="settings-card">
            {WEBHOOKS.map((w) => (
              <div key={w.path} className="webhook-item">
                <div className={`webhook-method ${w.method}`}>{w.method.toUpperCase()}</div>
                <div className="webhook-path">{w.path}</div>
                <div className="webhook-desc">{w.desc}</div>
                <div className="webhook-status active" title="Attivo" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
