import Toggle from './controls/Toggle'
import Segmented from './controls/Segmented'
import Slider from './controls/Slider'

const MODEL_OPTIONS = [
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'gpt-4o',      label: 'gpt-4o' },
]

const LANG_OPTIONS = [
  { value: 'it',   label: 'Italiano' },
  { value: 'en',   label: 'Inglese' },
  { value: 'auto', label: 'Auto' },
]

export default function SectionAi({ value, onChange, onToast }) {
  function set(field, v) { onChange({ ...value, [field]: v }) }

  return (
    <>
      <div className="sp-header">
        <div className="sp-header-left">
          <h2>AI & Automazione</h2>
          <p>Comportamento del modello e regole di escalation</p>
        </div>
        <div className="sp-header-right">
          <span className="model-badge">
            <span className="model-badge-dot" />
            {value.model}
          </span>
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
          <div className="section-label">Modello AI</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Modello attivo</div>
                <div className="row-sub">Usato per generare le risposte automatiche</div>
              </div>
              <div className="row-control">
                <Segmented options={MODEL_OPTIONS} value={value.model} onChange={(v) => set('model', v)} />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Lingua risposte AI</div>
                <div className="row-sub">Lingua in cui il modello scrive le email</div>
              </div>
              <div className="row-control">
                <Segmented options={LANG_OPTIONS} value={value.language} onChange={(v) => set('language', v)} />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Soglie di escalation</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Soglia confidenza AI</div>
                <div className="row-sub">Sotto questa soglia la risposta viene escalata all'addetto anziché inviata</div>
              </div>
              <div className="row-control">
                <Slider value={value.threshold} onChange={(v) => set('threshold', v)} />
              </div>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-label">Comportamento automatico</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Auto-risposta presa in carico</div>
                <div className="row-sub">Invia automaticamente un'email di conferma al cliente appena arriva l'escalation</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.autoReply} onChange={(v) => set('autoReply', v)} ariaLabel="Auto-risposta" />
              </div>
            </div>
            <div className="settings-row">
              <div className="row-label-block">
                <div className="row-label">Segna risolto dopo invio risposta</div>
                <div className="row-sub">Cambia automaticamente stato a "Risolto" dopo che l'addetto invia la risposta</div>
              </div>
              <div className="row-control">
                <Toggle checked={value.autoResolve} onChange={(v) => set('autoResolve', v)} ariaLabel="Auto-risolto" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
