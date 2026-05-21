export default function KbList({ items, loading, onEdit, onDelete }) {
  if (loading) {
    return <div style={{ padding: 14, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Caricamento…</div>
  }
  if (!items.length) {
    return <div style={{ padding: 14, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Nessuna FAQ trovata</div>
  }
  return (
    <div className="kb-rows">
      {items.map((it) => (
        <div key={it.id} className="kb-row">
          <div className="kb-row-main">
            <div className="kb-row-question">{it.domanda || '—'}</div>
            <div className="kb-row-answer">{it.risposta || ''}</div>
            <div className="kb-row-meta">
              {it.categoria && <span className="kb-cat">{it.categoria}</span>}
              {(it.parole_chiave || []).map((kw, i) => (
                <span key={i} className="kb-chip">{kw}</span>
              ))}
              {it.updated_at && (
                <span className="kb-row-date">
                  {new Date(it.updated_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <div className="kb-row-actions">
            <button className="btn" onClick={() => onEdit(it)}>Modifica</button>
            <button
              className="btn"
              onClick={() => {
                if (confirm(`Eliminare "${it.domanda?.slice(0, 60) || 'FAQ'}"?`)) onDelete(it.id)
              }}
            >
              Elimina
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
