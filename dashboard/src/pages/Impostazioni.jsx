import { useEffect, useState } from 'react'
import CategoryPanel from '../components/settings/CategoryPanel'
import SectionAccount from '../components/settings/SectionAccount'
import SectionNotifications from '../components/settings/SectionNotifications'
import SectionAi from '../components/settings/SectionAi'
import SectionIntegrations from '../components/settings/SectionIntegrations'
import { getCurrentUser } from '../lib/authMock'

const STORAGE_KEY = 'fk-settings-v1'

const DEFAULTS = {
  displayName: '',
  notifications: {
    browser: true,
    sound: false,
    badge: true,
    secondContact: true,
    digest: '2h',
  },
  ai: {
    model: 'gpt-4o-mini',
    language: 'it',
    threshold: 65,
    autoReply: true,
    autoResolve: true,
  },
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    return {
      displayName:   parsed.displayName ?? DEFAULTS.displayName,
      notifications: { ...DEFAULTS.notifications, ...(parsed.notifications ?? {}) },
      ai:            { ...DEFAULTS.ai,            ...(parsed.ai ?? {}) },
    }
  } catch {
    return DEFAULTS
  }
}

function saveSettings(next) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore quota */ }
}

export default function Impostazioni() {
  const [active, setActive] = useState('account')
  const [settings, setSettings] = useState(loadSettings)
  const [toast, setToast] = useState(null)

  // Initial displayName from Supabase if not yet set
  useEffect(() => {
    if (settings.displayName) return
    const u = getCurrentUser()
    if (u?.nome) setSettings((s) => ({ ...s, displayName: u.nome }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist on any change
  useEffect(() => { saveSettings(settings) }, [settings])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const onToast = (t) => setToast(t)
  const setDisplayName = (v) => setSettings((s) => ({ ...s, displayName: v }))
  const setNotifications = (v) => setSettings((s) => ({ ...s, notifications: v }))
  const setAi = (v) => setSettings((s) => ({ ...s, ai: v }))

  return (
    <div className="settings-page">
      <CategoryPanel active={active} onChange={setActive} />

      <div className="settings-panel">
        {active === 'account' && (
          <SectionAccount
            displayName={settings.displayName}
            onDisplayNameChange={setDisplayName}
            onToast={onToast}
          />
        )}
        {active === 'notifications' && (
          <SectionNotifications
            value={settings.notifications}
            onChange={setNotifications}
            onToast={onToast}
          />
        )}
        {active === 'ai' && (
          <SectionAi
            value={settings.ai}
            onChange={setAi}
            onToast={onToast}
          />
        )}
        {active === 'integrations' && (
          <SectionIntegrations onToast={onToast} />
        )}
      </div>

      {toast && (
        <div className={`settings-toast${toast.error ? ' error' : ''}`}>
          {toast.text}
        </div>
      )}
    </div>
  )
}
