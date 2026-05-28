import { useEffect, useState } from 'react'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EscalationDetail({ request, onClaim, onSendReply, busy, signature }) {
  const [reply, setReply] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setReply('')
    setFocused(false)
  }, [request?.id])

  if (!request) {
    return (
      <div className="detail-panel surface-detail">
        <div className="detail-empty">Seleziona un'escalation per vedere i dettagli</div>
      </div>
    )
  }

  const isLavorazione = request.stato === 'presa_in_carico'
  const canSend = reply.trim().length > 0 && !busy

  return (
    <div className="detail-panel surface-detail">
      <div className="detail-header">
        <div className="detail-header-left">
          <h3>{request.oggetto_email}</h3>
          <div className="detail-meta">
            <span>{request.mittente_email}</span>
            <span>·</span>
            <span>{formatDate(request.timestamp_arrivo)}</span>
          </div>
        </div>
        <div className="detail-actions">
          {!isLavorazione && (
            <button
              className="btn status"
              disabled={busy}
              onClick={() => onClaim()}
            >
              → Prendi in carico
            </button>
          )}
        </div>
      </div>

      <div className="detail-body">
        <div className="email-bubble">
          <div className="email-bubble-header">
            <span className="email-from">{request.mittente_email}</span>
            <span className="email-date">{formatDate(request.timestamp_arrivo)}</span>
          </div>
          <div className="email-body">{request.testo_email}</div>
        </div>

        <div className={`reply-box ${focused ? 'focused' : ''}`}>
          <div className="reply-box-header">
            <span className="reply-box-label">Risposta</span>
            <span className="reply-box-recipient">Verrà inviata a {request.mittente_email}</span>
          </div>
          <textarea
            className="reply-textarea"
            placeholder="Scrivi la risposta da inviare al cliente…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <div className="reply-footer">
            <span className="reply-hint">
              {signature
                ? 'La firma verrà aggiunta in fondo. Invio via Gmail, stato → Risolto.'
                : 'La risposta verrà inviata via Gmail e lo stato passerà automaticamente a Risolto'}
            </span>
            <button
              className="btn primary"
              disabled={!canSend}
              onClick={() => onSendReply(reply)}
            >
              {busy ? 'Invio…' : 'Invia risposta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
