import { NavLink } from 'react-router-dom'
import { Inbox, History, BookOpen, BarChart3, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Escalation',   to: '/',             Icon: Inbox },
  { label: 'Storico',      to: '/storico',      Icon: History },
  { label: 'KB',           to: '/kb',           Icon: BookOpen },
  { label: 'Analytics',    to: '/analytics',    Icon: BarChart3 },
  { label: 'Impostazioni', to: '/impostazioni', Icon: Settings },
]

export default function Sidebar({ pendingCount = 0 }) {
  return (
    <aside
      className="flex flex-col gap-1 py-3 px-2 flex-shrink-0"
      style={{ width: '196px' }}
    >
      {NAV_ITEMS.map(({ label, to, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon
            size={16}
            strokeWidth={1.75}
            style={{ flexShrink: 0, color: 'currentColor' }}
            aria-hidden="true"
          />
          <span>{label}</span>
          {label === 'Escalation' && pendingCount > 0 && (
            <span className="nav-badge" data-testid="escalation-badge">
              {pendingCount}
            </span>
          )}
        </NavLink>
      ))}
    </aside>
  )
}
