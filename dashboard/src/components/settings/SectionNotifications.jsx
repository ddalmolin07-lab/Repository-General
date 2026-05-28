import Toggle from './controls/Toggle'
import Segmented from './controls/Segmented'

const DIGEST_OPTIONS = [
  { value: 'never', label: 'Mai' },
  { value: '2h',    label: 'Ogni 2h' },
  { value: 'eod',   label: 'Fine giornata' },
]

export default function SectionNotifications({ value, onChange, onToast }) {
  function set(field, v) { onChange({ ...value, [field]: v }) }

  return (
    <>
      <div className="sp-header">
        <div className="sp-header-left">
          <h2>Notifiche</h2>
          <p>Configura quando e come ricevere gli avvisi</p>
        </div>
        <div className="sp-header-right">
          <button
            type="button"
            className="btn primary"
            onClick={() => onToast({ text: 'Preferenze salvate' })}
          >
            Salva modifiche
          </button>
        </div>
      </div>

      <div className="sp-body">
        <section className="settings-section">
          <div className="section-label">Avvisi in tempo reale</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Notifiche browser</div>
                <div className="row-sub">Popup del sistema operativo per ogni nuova escalation</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.browser} onChange={(v) => set('browser', v)} ariaLabel="Notifiche browser" />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Suono di avviso</div>
                <div className="row-sub">Riproduce un tono all'arrivo di una nuova escalation</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.sound} onChange={(v) => set('sound', v)} ariaLabel="Suono di avviso" />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Badge nella sidebar</div>
                <div className="row-sub">Mostra il contatore sull'icona Escalation</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.badge} onChange={(v) => set('badge', v)} ariaLabel="Badge sidebar" />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Avviso 2° contatto</div>
                <div className="row-sub">Notifica speciale quando un cliente scrive una seconda volta</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.secondContact} onChange={(v) => set('secondContact', v)} ariaLabel="Avviso secondo contatto" />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Digest email</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Riepilogo via email</div>
                <div className="row-sub">Ricevi un riepilogo delle escalation pendenti</div>
              </div>
              <div className="row-control">
                <Segmented options={DIGEST_OPTIONS} value={value.digest} onChange={(v) => set('digest', v)} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
