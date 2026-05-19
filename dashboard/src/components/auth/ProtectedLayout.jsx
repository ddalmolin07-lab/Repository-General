import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import KpiBar from '../KpiBar'
import Sidebar from '../Sidebar'
import { isAuthenticated, onAuthChange, signOut } from '../../lib/authMock'

const KPI_PLACEHOLDERS = [
  { label: 'In attesa',      value: '--', dotColor: 'var(--status-waiting)'  },
  { label: 'Richieste oggi', value: '--', dotColor: 'var(--status-ai)'       },
  { label: 'Gestite AI',     value: '--', dotColor: 'var(--status-resolved)' },
  { label: 'Tempo medio',    value: '--', dotColor: 'var(--status-progress)' },
]

export default function ProtectedLayout() {
  const location = useLocation()
  const [authed, setAuthed] = useState(isAuthenticated())

  useEffect(() => onAuthChange(setAuthed), [])

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <KpiBar kpis={KPI_PLACEHOLDERS} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '10px 14px 14px 0', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Sidebar pendingCount={0} />
          <button
            type="button"
            onClick={signOut}
            className="nav-item"
            style={{ marginTop: 'auto', marginBottom: 6, color: 'var(--muted)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>⎋</span>
            <span>Esci</span>
          </button>
        </div>

        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
