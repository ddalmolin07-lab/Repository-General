import { useEffect, useMemo, useState } from 'react'
import KbList from '../components/KbList'
import KbEditPanel from '../components/KbEditPanel'
import { getKbFaqs, addKbFaq, updateKbFaq, deleteKbFaq } from '../api/kbClient'

const ALL = '__all__'

export default function Kb() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState(ALL)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getKbFaqs()
      setItems(data)
    } catch (e) {
      setError(e.message ?? 'Errore caricamento KB')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const categories = useMemo(() => {
    const set = new Set()
    items.forEach((x) => { if (x.categoria) set.add(x.categoria) })
    return Array.from(set).sort()
  }, [items])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      if (categoria !== ALL && (it.categoria || '') !== categoria) return false
      if (!q) return true
      const inText =
        it.domanda?.toLowerCase().includes(q) ||
        it.risposta?.toLowerCase().includes(q)
      const inKeywords = (it.parole_chiave || []).some((k) => k.toLowerCase().includes(q))
      return inText || inKeywords
    })
  }, [items, search, categoria])

  async function handleSave(payload) {
    setBusy(true)
    setError(null)
    try {
      if (payload.id) {
        await updateKbFaq(payload)
      } else {
        await addKbFaq(payload)
      }
      setEditing(null)
      await load()
    } catch (e) {
      setError(e.message ?? 'Errore salvataggio')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id) {
    setBusy(true)
    setError(null)
    try {
      await deleteKbFaq(id)
      await load()
    } catch (e) {
      setError(e.message ?? 'Errore eliminazione')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flex: 1, gap: 10, overflow: 'hidden' }}>
      <div className="kb-page surface-panel">
        <div className="list-header">
          <div className="kb-header-top">
            <h2>Knowledge Base ({items.length})</h2>
            <button
              className="btn primary"
              onClick={() => setEditing({})}
              disabled={busy}
            >
              + Aggiungi FAQ
            </button>
          </div>
          <div className="search-bar">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
              <circle cx="7" cy="7" r="5" />
              <path d="M12 12l2 2" />
            </svg>
            <input
              placeholder="Cerca in domanda, risposta o parole chiave…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-row" style={{ flexWrap: 'wrap' }}>
            <button
              className={`filter-chip ${categoria === ALL ? 'active' : ''}`}
              onClick={() => setCategoria(ALL)}
            >
              Tutte
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-chip ${categoria === c ? 'active' : ''}`}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="kb-body">
          <KbList
            items={filtered}
            loading={loading}
            onEdit={(it) => setEditing(it)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {editing !== null && (
        <KbEditPanel
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          busy={busy}
        />
      )}

      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(197,90,90,0.18)',
            border: '1px solid rgba(197,90,90,0.35)',
            color: '#FFD9D9',
            fontSize: 12,
            maxWidth: 320,
            cursor: 'pointer',
          }}
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}
    </div>
  )
}
