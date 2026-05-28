import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { it } from 'date-fns/locale'
import 'react-day-picker/style.css'

function toIsoDate(d) {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromIsoDate(s) {
  if (!s) return undefined
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function fmtPill(d) {
  if (!d) return '—'
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function buildPresets() {
  const today = startOfDay(new Date())
  const thisMonthStart = startOfMonth(today)
  const lastMonthEnd = addDays(thisMonthStart, -1)
  const lastMonthStart = startOfMonth(lastMonthEnd)
  return [
    { key: 'today', label: 'Oggi', from: today, to: today },
    { key: '7d', label: 'Ultimi 7 giorni', from: addDays(today, -6), to: today },
    { key: '30d', label: 'Ultimi 30 giorni', from: addDays(today, -29), to: today },
    { key: 'tm', label: 'Questo mese', from: thisMonthStart, to: today },
    { key: 'lm', label: 'Mese scorso', from: lastMonthStart, to: lastMonthEnd },
  ]
}

function sameDay(a, b) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ from: fromIsoDate(from), to: fromIsoDate(to) })
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900)
  const wrapRef = useRef(null)

  useEffect(() => {
    setDraft({ from: fromIsoDate(from), to: fromIsoDate(to) })
  }, [from, to, open])

  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < 900) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const presets = useMemo(() => buildPresets(), [])
  const activePreset = useMemo(() => {
    if (!draft.from || !draft.to) return null
    return presets.find((p) => sameDay(p.from, draft.from) && sameDay(p.to, draft.to))?.key ?? null
  }, [draft, presets])

  const fromD = fromIsoDate(from)
  const toD = fromIsoDate(to)

  function applyPreset(p) {
    setDraft({ from: p.from, to: p.to })
    onChange({ from: toIsoDate(p.from), to: toIsoDate(p.to) })
    setOpen(false)
  }

  function commit() {
    onChange({ from: toIsoDate(draft.from), to: toIsoDate(draft.to) })
    setOpen(false)
  }

  function cancel() {
    setDraft({ from: fromD, to: toD })
    setOpen(false)
  }

  return (
    <div className="drp-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`drp-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Seleziona intervallo date"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="3.5" width="12" height="11" rx="2" />
          <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
        </svg>
        <span className="drp-trigger-text">
          {fmtPill(fromD)} <span className="drp-trigger-sep">→</span> {fmtPill(toD)}
        </span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={`drp-caret ${open ? 'open' : ''}`} aria-hidden="true">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </button>

      {open && (
        <div className="drp-popover" role="dialog" aria-label="Selettore intervallo date">
          <div className="drp-presets">
            {presets.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`drp-preset ${activePreset === p.key ? 'active' : ''}`}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={`drp-preset ${activePreset === null ? 'active' : ''}`}
              onClick={() => setDraft({ from: undefined, to: undefined })}
            >
              Personalizzato
            </button>
          </div>

          <div className="drp-calendar">
            <DayPicker
              mode="range"
              numberOfMonths={isMobile ? 1 : 2}
              selected={draft}
              onSelect={(range) => setDraft(range ?? { from: undefined, to: undefined })}
              locale={it}
              weekStartsOn={1}
              showOutsideDays
              defaultMonth={draft.from ?? new Date()}
            />

            <div className="drp-footer">
              <div className="drp-range-text">
                {draft.from ? fmtPill(draft.from) : '—'}
                <span className="drp-trigger-sep">→</span>
                {draft.to ? fmtPill(draft.to) : '—'}
              </div>
              <div className="drp-actions">
                <button type="button" className="drp-btn drp-btn-ghost" onClick={cancel}>Annulla</button>
                <button
                  type="button"
                  className="drp-btn drp-btn-primary"
                  onClick={commit}
                  disabled={!draft.from || !draft.to}
                >
                  Applica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
