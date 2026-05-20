import EscalationCard from './EscalationCard'

const FILTERS = [
  { key: 'all',                 label: 'Tutti' },
  { key: 'in_attesa_addetto',   label: 'In attesa' },
  { key: 'presa_in_carico',     label: 'In lavorazione' },
]

export default function EscalationList({
  requests,
  selectedId,
  onSelect,
  search,
  onSearch,
  filter,
  onFilter,
  loading,
}) {
  return (
    <div className="list-panel surface-panel">
      <div className="list-header">
        <h2>Escalation attive</h2>
        <div className="search-bar">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" />
            <path d="M12 12l2 2" />
          </svg>
          <input
            placeholder="Cerca mittente o oggetto…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-chip ${filter === f.key ? 'active' : ''}`}
              onClick={() => onFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="list-items">
        {loading ? (
          <div style={{ padding: 14, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Caricamento…</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 14, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Nessuna escalation</div>
        ) : (
          requests.map((r) => (
            <EscalationCard
              key={r.id}
              request={r}
              selected={r.id === selectedId}
              onClick={() => onSelect(r.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
