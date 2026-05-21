import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Escalation',   to: '/',             icon: '⚡' },
  { label: 'Storico',      to: '/storico',      icon: '📋' },
  { label: 'KB',           to: '/kb',           icon: '📚' },
  { label: 'Analytics',    to: '/analytics',    icon: '📊' },
  { label: 'Impostazioni', to: '/impostazioni', icon: '⚙️' },
]

export default function Sidebar({ pendingCount = 0 }) {
  return (
    <aside
      className="flex flex-col gap-1 py-3 px-2 flex-shrink-0"
      style={{ width: '196px' }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span style={{ fontSize: '15px', lineHeight: 1, flexShrink: 0 }}>
            {item.icon}
          </span>
          <span>{item.label}</span>
          {item.label === 'Escalation' && pendingCount > 0 && (
            <span className="nav-badge" data-testid="escalation-badge">
              {pendingCount}
            </span>
          )}
        </NavLink>
      ))}
    </aside>
  )
}
