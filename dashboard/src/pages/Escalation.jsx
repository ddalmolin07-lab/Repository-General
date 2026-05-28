import { useEffect, useMemo, useState } from 'react'
import EscalationList from '../components/EscalationList'
import EscalationDetail from '../components/EscalationDetail'
import { getRequests, claimRequest, postReply } from '../api/client'
import { getMySettings } from '../api/settings'

export default function Escalation() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [signature, setSignature] = useState('')

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
    getMySettings()
      .then((s) => setSignature(s.signature || ''))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return requests.filter((r) => {
      if (filter === 'in_attesa_addetto' && r.stato !== 'in_attesa_addetto') return false
      if (filter === 'presa_in_carico' && r.stato !== 'presa_in_carico') return false
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

  async function handleClaim() {
    if (!selected) return
    setBusy(true)
    try {
      const row = await claimRequest(selected.id)
      if (!row) {
        setError('Richiesta già presa in carico da un altro addetto')
      }
      await load(true)
    } catch (e) {
      setError(e.message ?? 'Errore presa in carico')
    } finally {
      setBusy(false)
    }
  }

  async function handleSendReply(text) {
    if (!selected) return
    setBusy(true)
    const sig = (signature || '').trim()
    const finalText = sig ? `${text}\n\n${sig}` : text
    try {
      const result = await postReply({ id: selected.id, testo_risposta: finalText })
      if (result?.already_sent) {
        setError('Risposta già inviata in precedenza')
      }
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
        onClaim={handleClaim}
        onSendReply={handleSendReply}
        busy={busy}
        signature={signature}
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
