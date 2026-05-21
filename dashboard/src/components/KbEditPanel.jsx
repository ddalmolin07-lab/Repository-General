import { useEffect, useState } from 'react'

const MAX_KEYWORDS = 3

export default function KbEditPanel({ initial, onSave, onClose, busy }) {
  const [domanda, setDomanda] = useState('')
  const [risposta, setRisposta] = useState('')
  const [categoria, setCategoria] = useState('')
  const [paroleChiave, setParoleChiave] = useState([])
  const [keywordDraft, setKeywordDraft] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    setDomanda(initial?.domanda ?? '')
    setRisposta(initial?.risposta ?? '')
    setCategoria(initial?.categoria ?? '')
    setParoleChiave(initial?.parole_chiave ?? [])
    setKeywordDraft('')
    setError(null)
  }, [initial])

  function addKeyword() {
    const k = keywordDraft.trim()
    if (!k) return
    if (paroleChiave.length >= MAX_KEYWORDS) return
    if (paroleChiave.includes(k)) { setKeywordDraft(''); return }
    setParoleChiave([...paroleChiave, k])
    setKeywordDraft('')
  }

  function removeKeyword(idx) {
    setParoleChiave(paroleChiave.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!domanda.trim() || !risposta.trim()) {
      setError('Domanda e risposta sono obbligatorie')
      return
    }
    setError(null)
    onSave({
      id: initial?.id,
      domanda: domanda.trim(),
      risposta: risposta.trim(),
      categoria: categoria.trim(),
      parole_chiave: paroleChiave,
    })
  }

  const isNew = !initial?.id

  return (
    <div className="kb-panel-overlay" onClick={onClose}>
      <form className="kb-panel surface-detail" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="detail-header">
          <div className="detail-header-left">
            <h3>{isNew ? 'Nuova FAQ' : 'Modifica FAQ'}</h3>
          </div>
          <div className="detail-actions">
            <button type="button" className="btn" onClick={onClose} disabled={busy}>Annulla</button>
            <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Salvataggio…' : 'Salva'}</button>
          </div>
        </div>

        <div className="kb-panel-body">
          <label className="kb-field">
            <span className="kb-field-label">Domanda</span>
            <input
              className="kb-input"
              value={domanda}
              onChange={(e) => setDomanda(e.target.value)}
              placeholder="Es. Come posso cambiare il filtro?"
              autoFocus
            />
          </label>

          <label className="kb-field">
            <span className="kb-field-label">Risposta</span>
            <textarea
              className="kb-textarea"
              value={risposta}
              onChange={(e) => setRisposta(e.target.value)}
              placeholder="Risposta completa, naturale, che useremo per generare le mail al cliente."
              rows={8}
            />
          </label>

          <label className="kb-field">
            <span className="kb-field-label">Categoria</span>
            <input
              className="kb-input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Es. installazione, manutenzione, garanzia…"
            />
          </label>

          <div className="kb-field">
            <span className="kb-field-label">
              Parole chiave <span className="kb-field-hint">(max {MAX_KEYWORDS})</span>
            </span>
            <div className="kb-chip-row">
              {paroleChiave.map((kw, i) => (
                <span key={i} className="kb-chip kb-chip-removable">
                  {kw}
                  <button type="button" onClick={() => removeKeyword(i)} aria-label="Rimuovi">×</button>
                </span>
              ))}
              {paroleChiave.length < MAX_KEYWORDS && (
                <input
                  className="kb-chip-input"
                  value={keywordDraft}
                  onChange={(e) => setKeywordDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault()
                      addKeyword()
                    }
                  }}
                  onBlur={addKeyword}
                  placeholder={paroleChiave.length === 0 ? 'Aggiungi una parola e premi Invio' : '+ aggiungi'}
                />
              )}
            </div>
          </div>

          {error && <div className="kb-error">{error}</div>}
        </div>
      </form>
    </div>
  )
}
