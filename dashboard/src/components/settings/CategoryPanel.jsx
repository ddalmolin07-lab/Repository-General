const CATEGORIES = [
  {
    key: 'account',
    name: 'Account',
    sub: 'Profilo e sicurezza',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 13c0-3 2.7-5 6-5s6 2 6 5" />
      </svg>
    ),
  },
  {
    key: 'notifications',
    name: 'Notifiche',
    sub: 'Avvisi e alert',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2a5 5 0 0 1 5 5v3l2 2H1l2-2V7a5 5 0 0 1 5-5z" />
        <path d="M6 13a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  { separator: true, key: 'sep1' },
  {
    key: 'ai',
    name: 'AI & Automazione',
    sub: 'Modello e soglie',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 8l3 3 5-5M13 4l-4.5 4.5" />
        <circle cx="13" cy="11" r="3" />
      </svg>
    ),
  },
  {
    key: 'integrations',
    name: 'Integrazioni',
    sub: 'API e webhook',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="5" height="5" rx="1.5" />
        <rect x="10" y="4" width="5" height="5" rx="1.5" />
        <path d="M6 6.5h4M8 4V2M8 14v-2" />
        <rect x="5.5" y="10.5" width="5" height="3.5" rx="1.5" />
      </svg>
    ),
  },
]

export default function CategoryPanel({ active, onChange }) {
  return (
    <aside className="cat-panel">
      <div className="cat-panel-title">Impostazioni</div>

      {CATEGORIES.map((c) => {
        if (c.separator) return <div key={c.key} className="cat-separator" />
        return (
          <button
            key={c.key}
            type="button"
            className={`cat-item${active === c.key ? ' active' : ''}`}
            onClick={() => onChange(c.key)}
          >
            <span className="cat-icon">{c.icon}</span>
            <span className="cat-label-block">
              <span className="cat-name">{c.name}</span>
              <div className="cat-sub">{c.sub}</div>
            </span>
          </button>
        )
      })}

      <div className="cat-version">
        <span className="cat-version-dot" />
        FiltroCappa v1.0.0
      </div>
    </aside>
  )
}
