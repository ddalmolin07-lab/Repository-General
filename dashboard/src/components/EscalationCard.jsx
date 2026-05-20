function relativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ora'
  if (m < 60) return `${m}m fa`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h fa`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Ieri'
  if (d < 7) return `${d}g fa`
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

export default function EscalationCard({ request, selected, onClick }) {
  const isLavorazione = request.stato === 'presa_in_carico'
  const variant = isLavorazione ? 'lavorazione' : 'urgente'
  const cls = ['esc-item', variant, selected ? 'selected' : ''].filter(Boolean).join(' ')

  return (
    <div className={cls} onClick={onClick}>
      <div className="esc-item-top">
        <span className="esc-sender">{request.mittente_email}</span>
        <span className="esc-time">{relativeTime(request.timestamp_arrivo)}</span>
      </div>
      <div className="esc-subject">{request.oggetto_email}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span className={`esc-status ${isLavorazione ? 'lavorazione' : 'attesa'}`}>
          <span className="esc-dot"></span>
          {isLavorazione ? 'In lavorazione' : 'In attesa'}
        </span>
      </div>
    </div>
  )
}
