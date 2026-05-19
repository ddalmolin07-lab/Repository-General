import { useEffect, useMemo, useState } from 'react'
import EscalationList from '../components/EscalationList'
import EscalationDetail from '../components/EscalationDetail'
import { getRequests, patchStatus, postReply } from '../api/client'

export default function Escalation() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function load(preserveSelection = true) {
    setLoading(true)
    setError(null)
    try {
      const data = await getRequests()
      setRequests(data)
      if (!preserveSelection || !data.some((r) => r.id === selectedId)) {
        setSelectedId(data[0]?.id ?? null)
      }
    } catch (e) {
      setError(e.message ?? 'Errore caricamento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return requests.filter((r) => {
      if (filter === 'in_attesa' && r.stato !== 'in_attesa') return false
      if (filter === 'in_lavorazione' && r.stato !== 'in_lavorazione') return false
      if (!q) return true
      return (
        r.mittente_email?.toLowerCase().includes(q) ||
        r.oggetto_email?.toLowerCase().includes(q)
      )
    })
  }, [requests, search, filter])

  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId]
  )

  async function handleChangeStatus(stato) {
    if (!selected) return
    setBusy(true)
    try {
      await patchStatus({ id: selected.id, stato })
      await load(stato !== 'risolto')
    } catch (e) {
      setError(e.message ?? 'Errore aggiornamento stato')
    } finally {
      setBusy(false)
    }
  }

  async function handleSendReply(text) {
    if (!selected) return
    setBusy(true)
    try {
      await postReply({
        id: selected.id,
        mittente_email: selected.mittente_email,
        oggetto_email: selected.oggetto_email,
        testo_risposta: text,
      })
      await load(false)
    } catch (e) {
      setError(e.message ?? 'Errore invio risposta')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flex: 1, gap: 10, overflow: 'hidden' }}>
      <EscalationList
        requests={filtered}
        selectedId={selectedId}
        onSelect={setSelectedId}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        loading={loading}
      />
      <EscalationDetail
        request={selected}
        onChangeStatus={handleChangeStatus}
        onSendReply={handleSendReply}
        busy={busy}
      />
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
          }}
          onClick={() => setError(null)}
        >
          {error}
        </div>
      )}
    </div>
  )
}
