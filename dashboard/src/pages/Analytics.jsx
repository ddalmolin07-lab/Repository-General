import { useEffect, useMemo, useState } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getAnalytics } from '../api/client'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const WEEKDAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

function ymd(d) { return d.toISOString().split('T')[0] }

function buildDayWindow(days) {
  // Returns array of {date: Date, key: 'YYYY-MM-DD'} for last N days (oldest → today)
  const out = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    out.push({ date: d, key: ymd(d) })
  }
  return out
}

function gradientPlugin() {
  return {
    id: 'gradientFills',
    beforeUpdate(chart) {
      const { ctx, chartArea } = chart
      if (!chartArea) return
      const { top, bottom } = chartArea

      const gradAI = ctx.createLinearGradient(0, top, 0, bottom)
      gradAI.addColorStop(0, 'rgba(100, 130, 220, 0.76)')
      gradAI.addColorStop(1, 'rgba(68,  96, 192, 0.96)')
      chart.data.datasets[0].backgroundColor = gradAI

      const gradHuman = ctx.createLinearGradient(0, top, 0, bottom)
      gradHuman.addColorStop(0, 'rgba(165, 155, 218, 0.78)')
      gradHuman.addColorStop(1, 'rgba(128, 112, 188, 0.96)')
      chart.data.datasets[1].backgroundColor = gradHuman
    },
  }
}

function externalTooltipHandler(context) {
  const { chart, tooltip } = context
  const parent = chart.canvas.parentNode
  let el = parent.querySelector('.chart-tooltip')
  if (!el) {
    el = document.createElement('div')
    el.className = 'chart-tooltip'
    parent.appendChild(el)
  }
  if (tooltip.opacity === 0) { el.style.opacity = 0; return }
  const ai = tooltip.dataPoints?.find((d) => d.datasetIndex === 0)?.parsed.y ?? 0
  const hum = tooltip.dataPoints?.find((d) => d.datasetIndex === 1)?.parsed.y ?? 0
  el.innerHTML = `
    <div class="ct-label">${tooltip.title?.[0] ?? ''}</div>
    <div class="ct-row"><span class="ct-dot ai"></span><span>AI</span><strong>${ai}</strong></div>
    <div class="ct-row"><span class="ct-dot human"></span><span>Operatore</span><strong>${hum}</strong></div>
    <div class="ct-total"><span>Totale</span><strong>${ai + hum}</strong></div>
  `
  el.style.opacity = 1
  el.style.left = tooltip.caretX + 'px'
  el.style.top = tooltip.caretY + 'px'
}

export default function Analytics() {
  const [period, setPeriod] = useState(7) // 7 | 30
  const [rows, setRows] = useState([])
  const [prevRows, setPrevRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const all = await getAnalytics(period * 2)
        if (cancelled) return
        const todayKey = ymd(new Date())
        const cutoff = new Date()
        cutoff.setHours(0, 0, 0, 0)
        cutoff.setDate(cutoff.getDate() - period)
        const cutoffKey = ymd(cutoff)
        const current = all.filter((r) => r.data > cutoffKey && r.data <= todayKey)
        const previous = all.filter((r) => r.data <= cutoffKey)
        setRows(current)
        setPrevRows(previous)
      } catch (e) {
        if (!cancelled) setError(e.message ?? 'Errore caricamento analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [period])

  // Build dataset aligned to N-day window
  const series = useMemo(() => {
    const window = buildDayWindow(period)
    const byKey = new Map(rows.map((r) => [r.data, r]))
    return window.map(({ date, key }) => {
      const r = byKey.get(key)
      return {
        date,
        key,
        ai: r?.ai_handled ?? 0,
        human: r?.escalated ?? 0,
        total: r?.totale_richieste ?? 0,
        time: r ? Number(r.tempo_medio_risposta_h) : null,
      }
    })
  }, [rows, period])

  const labels = useMemo(() => series.map(({ date }) => {
    if (period === 7) return WEEKDAYS_SHORT[date.getDay()] + ' ' + date.getDate()
    return String(date.getDate())
  }), [series, period])

  const kpi = useMemo(() => {
    const total = series.reduce((s, d) => s + d.total, 0)
    const ai = series.reduce((s, d) => s + d.ai, 0)
    const human = series.reduce((s, d) => s + d.human, 0)
    const timeVals = series.map((d) => d.time).filter((v) => v != null && !Number.isNaN(v))
    const timeAvg = timeVals.length ? timeVals.reduce((a, b) => a + b, 0) / timeVals.length : null
    const aiPct = total > 0 ? Math.round((ai / total) * 100) : 0
    return { total, ai, human, time: timeAvg, aiPct }
  }, [series])

  const signals = useMemo(() => {
    // Peak: day with max total
    let peak = null
    for (const d of series) {
      if (!peak || d.total > peak.total) peak = d
    }
    const peakLabel = peak && peak.total > 0
      ? `${WEEKDAYS[peak.date.getDay()]} · ${peak.total} richieste`
      : '—'

    // Variation vs previous period
    const prevTotal = prevRows.reduce((s, r) => s + (r.totale_richieste ?? 0), 0)
    let deltaLabel = '—'
    if (prevTotal > 0) {
      const pct = Math.round(((kpi.total - prevTotal) / prevTotal) * 100)
      const sign = pct > 0 ? '+' : pct < 0 ? '−' : ''
      const abs = Math.abs(pct)
      deltaLabel = `${sign}${abs}% rispetto ai ${period}gg prec.`
    }

    return {
      peak: peakLabel,
      aiPct: kpi.total > 0 ? `${kpi.aiPct}% del periodo` : '—',
      delta: deltaLabel,
    }
  }, [series, prevRows, kpi, period])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Gestite da AI',
        data: series.map((d) => d.ai),
        backgroundColor: 'rgba(100,130,220,0.9)',
        borderWidth: 0,
        borderRadius: 0,
        borderSkipped: 'top',
        stack: 'giorno',
      },
      {
        label: 'Passate a operatore',
        data: series.map((d) => d.human),
        backgroundColor: 'rgba(165,155,218,0.9)',
        borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
        borderColor: 'rgba(255,255,255,0.22)',
        borderRadius: { topLeft: 7, topRight: 7, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        stack: 'giorno',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false, external: externalTooltipHandler },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        border: { display: false },
        ticks: { color: 'rgba(255,255,255,0.42)', font: { size: 10, family: 'Urbanist', weight: '500' }, maxRotation: 0 },
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { display: false },
        ticks: { color: 'rgba(255,255,255,0.38)', font: { size: 10, family: 'Urbanist' }, maxTicksLimit: 5, padding: 8 },
      },
    },
    animation: { duration: 500, easing: 'easeOutQuart' },
    barPercentage: 0.68,
    categoryPercentage: 0.82,
  }

  const subLabel = period === 7 ? 'negli ultimi 7 giorni' : 'negli ultimi 30 giorni'
  const timeDisplay = kpi.time != null ? `${kpi.time.toFixed(1)}h` : '—'

  return (
    <div className="analytics-panel">
      <div className="analytics-header">
        <div className="analytics-header-text">
          <h2>Analytics richieste</h2>
          <div className="analytics-header-subtitle">
            Andamento delle richieste e distribuzione tra AI e intervento umano.
          </div>
        </div>
        <div className="analytics-filter-row">
          <button
            className={`filter-chip ${period === 7 ? 'active' : ''}`}
            onClick={() => setPeriod(7)}
          >7 giorni</button>
          <button
            className={`filter-chip ${period === 30 ? 'active' : ''}`}
            onClick={() => setPeriod(30)}
          >30 giorni</button>
        </div>
      </div>

      <div className="analytics-body">
        <div className="analytics-kpi-row">
          <div className="analytics-kpi-card">
            <div className="analytics-kpi-value">{kpi.total}</div>
            <div className="analytics-kpi-label">Richieste totali</div>
            <div className="analytics-kpi-sub">{subLabel}</div>
          </div>
          <div className="analytics-kpi-card">
            <div className="analytics-kpi-value">{kpi.ai}</div>
            <div className="analytics-kpi-label">Gestite da AI</div>
            <div className="analytics-kpi-accent ai">{kpi.total > 0 ? `${kpi.aiPct}% del totale` : '—'}</div>
          </div>
          <div className="analytics-kpi-card">
            <div className="analytics-kpi-value">{kpi.human}</div>
            <div className="analytics-kpi-label">Passate a operatore</div>
            <div className="analytics-kpi-accent human">{kpi.total > 0 ? `${100 - kpi.aiPct}% del totale` : '—'}</div>
          </div>
          <div className="analytics-kpi-card">
            <div className="analytics-kpi-value">{timeDisplay}</div>
            <div className="analytics-kpi-label">Tempo medio risposta</div>
            <div className="analytics-kpi-sub">per richiesta escalata</div>
          </div>
        </div>

        <div className="analytics-chart-section">
          <div className="analytics-chart-header">
            <div>
              <div className="analytics-chart-title">Distribuzione del carico</div>
              <div className="analytics-chart-subtitle">
                Quanto lavoro viene assorbito dall'AI e quanto richiede intervento umano.
              </div>
            </div>
            <div className="chart-legend-row">
              <span className="legend-dot" style={{ background: 'var(--analytics-ai)' }} /> Gestite da AI
              <span className="legend-dot" style={{ background: 'var(--analytics-human)' }} /> Passate a operatore
            </div>
          </div>
          <div style={{ position: 'relative', height: 210, marginTop: 14 }}>
            <Bar data={chartData} options={chartOptions} plugins={[gradientPlugin()]} />
          </div>
        </div>

        <div className="analytics-secondary-row">
          <div className="analytics-secondary-card">
            <div className="analytics-secondary-title">Segnali operativi</div>
            <div className="analytics-secondary-subtitle">Indicatori chiave del periodo selezionato</div>
            <div className="signal-grid">
              <div className="signal-item">
                <div className="signal-dot" style={{ background: 'var(--analytics-human)' }} />
                <div>
                  <div className="signal-label">Picco massimo</div>
                  <div className="signal-value">{signals.peak}</div>
                </div>
              </div>
              <div className="signal-item">
                <div className="signal-dot" style={{ background: 'var(--analytics-ai)' }} />
                <div>
                  <div className="signal-label">AI sul totale</div>
                  <div className="signal-value">{signals.aiPct}</div>
                </div>
              </div>
              <div className="signal-item">
                <div className="signal-dot" style={{ background: 'var(--status-resolved)' }} />
                <div>
                  <div className="signal-label">Variazione</div>
                  <div className="signal-value">{signals.delta}</div>
                </div>
              </div>
              <div className="signal-item">
                <div className="signal-dot" style={{ background: 'var(--status-waiting)' }} />
                <div>
                  <div className="signal-label">Tempo medio</div>
                  <div className="signal-value">{timeDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: 8 }}>
            Caricamento…
          </div>
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
