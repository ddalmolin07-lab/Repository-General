export default function KpiBar({ kpis = [] }) {
  return (
    <header
      className="surface-kpibar flex items-center gap-4 px-5 flex-shrink-0"
      style={{ height: '52px' }}
    >
      <span
        style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text)', whiteSpace: 'nowrap' }}
      >
        FiltroCappa
      </span>

      <div
        style={{
          width: '1px', height: '20px', flexShrink: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.05) 65%, transparent)',
        }}
      />

      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-pill">
            <span
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: kpi.dotColor, flexShrink: 0,
                animation: 'dot-pulse 2.2s ease-in-out infinite',
              }}
            />
            <span style={{ color: 'var(--muted)', fontSize: '11px', fontWeight: 500 }}>
              {kpi.label}
            </span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>
              {kpi.value}
            </span>
          </div>
        ))}
      </div>

      <button
        aria-label="avatar utente"
        style={{
          width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--btn-dark), var(--btn-light))',
          border: '2px solid rgba(255,255,255,0.18)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: '#fff',
        }}
      >
        D
      </button>
    </header>
  )
}
