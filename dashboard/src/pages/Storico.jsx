import { useEffect, useMemo, useState } from 'react'
import { getHistory } from '../api/client'

const TIPO_FILTERS = [
  { key: 'all', label: 'Tutti' },
  { key: 'ai', label: 'AI' },
  { key: 'esc', label: 'Escalation' },
]

const STATO_LABELS = {
  in_attesa_addetto: { text: 'In attesa', cls: 'attesa' },
  presa_in_carico: { text: 'In lavorazione', cls: 'lavorazione' },
  risolta_addetto: { text: 'Risolta (addetto)', cls: 'risolta' },
  risolta_ai: { text: 'Auto-gestita', cls: 'ai' },
}

function isAi(row) { return row.stato === 'risolta_ai' }

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) +
    '\n' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
}

function inputDate(d) {
  return d.toISOString().split('T')[0]
}

export default function Storico() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState('all')
  const [openId, setOpenId] = useState(null)

  // Default range: last 30 days
  const today = new Date()
  const past = new Date()
  past.setDate(past.getDate() - 30)
  const [from, setFrom] = useState(inputDate(past))
  const [to, setTo] = useState(inputDate(today))

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getHistory({})
      setRows(data)
    } catch (e) {
      setError(e.message ?? 'Errore caricamento storico')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : null
    return rows.filter((r) => {
      if (tipo === 'ai' && !isAi(r)) return false
      if (tipo === 'esc' && isAi(r)) return false
      const ts = r.timestamp_arrivo ? new Date(r.timestamp_arrivo).getTime() : 0
      if (fromTs && ts < fromTs) return false
      if (toTs && ts > toTs) return false
      if (!q) return true
      return (
        r.mittente_email?.toLowerCase().includes(q) ||
        r.oggetto_email?.toLowerCase().includes(q)
      )
    })
  }, [rows, search, tipo, from, to])

  return (
    <div className="storico-page surface-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="list-header storico-toolbar">
        <div className="storico-toolbar-row">
          <h2 style={{ marginBottom: 0 }}>Storico</h2>
          <div className="search-bar" style={{ marginBottom: 0, flex: '1 1 240px', maxWidth: 360 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
              <circle cx="7" cy="7" r="5" />
              <path d="M12 12l2 2" />
            </svg>
            <input
              placeholder="Cerca mittente o oggetto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-row" style={{ marginBottom: 0 }}>
            {TIPO_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-chip ${tipo === f.key ? 'active' : ''}`}
                onClick={() => setTipo(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="storico-dates">
            <span className="storico-date-label">Dal</span>
            <input type="date" className="storico-date-input" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span className="storico-date-label">al</span>
            <input type="date" className="storico-date-input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <span className="storico-count"><strong>{filtered.length}</strong> richieste</span>
        </div>
      </div>

      <div className="storico-table-wrap">
        <div className="storico-col-head">
          <span style={{ width: 76 }}>Data</span>
          <span style={{ flex: '0 0 220px' }}>Mittente</span>
          <span style={{ flex: 1 }}>Oggetto</span>
          <span style={{ width: 110 }}>Tipo</span>
          <span style={{ width: 140 }}>Stato</span>
          <span style={{ width: 40 }}></span>
        </div>

        {loading ? (
          <div style={{ padding: 18, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Caricamento…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 18, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Nessuna richiesta nel periodo selezionato</div>
        ) : (
          filtered.map((r) => {
            const open = openId === r.id
            const ai = isAi(r)
            const statoCfg = STATO_LABELS[r.stato] || { text: r.stato, cls: '' }
            return (
              <div key={r.id} className={`storico-row-group ${open ? 'open' : ''}`}>
                <div
                  className={`storico-row ${open ? 'open' : ''}`}
                  onClick={() => setOpenId(open ? null : r.id)}
                >
                  <span className="storico-date" style={{ width: 76 }}>
                    {fmtDate(r.timestamp_arrivo)}
                  </span>
                  <span className="storico-sender" style={{ flex: '0 0 220px' }} title={r.mittente_email}>
                    {r.mittente_email}
                  </span>
                  <span className="storico-subject" style={{ flex: 1 }} title={r.oggetto_email}>
                    {r.oggetto_email}
                  </span>
                  <span style={{ width: 110 }}>
                    <span className={`storico-badge ${ai ? 'ai' : 'esc'}`}>
                      <span className="storico-badge-dot" />
                      {ai ? 'AI' : 'Escalation'}
                    </span>
                  </span>
                  <span style={{ width: 140 }}>
                    <span className={`esc-status ${statoCfg.cls === 'ai' ? 'lavorazione' : statoCfg.cls === 'attesa' ? 'attesa' : statoCfg.cls === 'risolta' ? '' : 'lavorazione'}`}
                      style={statoCfg.cls === 'risolta' ? { background: 'rgba(110,157,130,0.16)', color: '#3f7257' } : undefined}>
                      <span className="esc-dot" />
                      {statoCfg.text}
                    </span>
                  </span>
                  <span style={{ width: 40, textAlign: 'right' }}>
                    <span className={`storico-chevron ${open ? 'open' : ''}`}>›</span>
                  </span>
                </div>
                {open && (
                  <div className="storico-expand">
                    <div className="storico-expand-label">
                      {r.risposta_inviata ? 'Risposta inviata' : 'Testo richiesta'}
                    </div>
                    <div className="storico-expand-text">
                      {r.risposta_inviata || r.testo_email || '—'}
                    </div>
                    {r.timestamp_risolto && (
                      <div className="storico-expand-meta">
                        Risolta il {new Date(r.timestamp_risolto).toLocaleString('it-IT')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {error && (
        <div
          style={{
            position: 'fixed', bottom: 20, right: 20,
            padding: '10px 14px', borderRadius: 12,
            background: 'rgba(197,90,90,0.18)',
            border: '1px solid rgba(197,90,90,0.35)',
            color: '#FFD9D9', fontSize: 12, maxWidth: 320, cursor: 'pointer',
          }}
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}
    </div>
  )
}
