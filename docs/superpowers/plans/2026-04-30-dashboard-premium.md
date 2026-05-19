# Dashboard Premium — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementare la dashboard Filtro K con design premium glassmorphism — pill shapes, aura glow, gradient text, blob animati — come approvato nel mockup `dashboard-v3.html`.

**Architecture:** Vite+React SPA nella directory `dashboard/`. Il design system è definito in un singolo file CSS (`glass.css`) importato globalmente. Ogni area della dashboard è un componente React isolato. Nessuno stato globale necessario per questa fase — i dati sono mock statici.

**Tech Stack:** Vite 5, React 18, CSS Modules + design system CSS globale, Inter font via Google Fonts. Nessuna libreria UI esterna.

**Spec di riferimento:** `docs/superpowers/specs/2026-04-30-dashboard-premium-design.md`  
**Mockup di riferimento:** `.superpowers/brainstorm/11372-1777570733/content/dashboard-v3.html`

---

## File Map

```
dashboard/
├── index.html                          # entry point Vite (aggiungere font import)
├── package.json                        # già presente o da creare
├── vite.config.js                      # già presente o da creare
├── src/
│   ├── main.jsx                        # mount React root
│   ├── App.jsx                         # layout shell + routing mock
│   ├── styles/
│   │   ├── glass.css                   # CREA: design system (tokens, glass, aura, pill, animations)
│   │   └── index.css                   # MODIFICA: import glass.css, reset, body
│   └── components/
│       ├── Header/
│       │   ├── Header.jsx              # CREA: header bar con logo pill + KPI row + status
│       │   ├── Header.module.css       # CREA
│       │   ├── KpiCard.jsx             # CREA: singola card KPI con gradient text + aura
│       │   └── KpiCard.module.css      # CREA
│       ├── Sidebar/
│       │   ├── Sidebar.jsx             # CREA: sidebar con nav item pill
│       │   └── Sidebar.module.css      # CREA
│       ├── ListPanel/
│       │   ├── ListPanel.jsx           # CREA: lista escalation con section label + aura
│       │   ├── ListPanel.module.css    # CREA
│       │   ├── EscalationCard.jsx      # CREA: singola card escalation
│       │   └── EscalationCard.module.css # CREA
│       ├── DetailPanel/
│       │   ├── DetailPanel.jsx         # CREA: pannello dettaglio email
│       │   ├── DetailPanel.module.css  # CREA
│       │   ├── InsightBanner.jsx       # CREA: banner AI insight
│       │   ├── EmailBubble.jsx         # CREA: bubble email cliente
│       │   └── ReplyBox.jsx            # CREA: box risposta generata AI
│       └── KnowledgeBase.jsx           # ESISTE già — non toccare
```

---

## Task 1: Setup Vite+React (se non presente)

**Files:**
- Verify/Create: `dashboard/package.json`
- Verify/Create: `dashboard/vite.config.js`
- Verify/Create: `dashboard/src/main.jsx`
- Verify/Create: `dashboard/index.html`

- [ ] **Step 1.1: Verifica se package.json esiste**

```bash
ls "/Users/daniele/Desktop/Claude/Filtro K/dashboard/package.json" 2>/dev/null && echo "EXISTS" || echo "MISSING"
```

- [ ] **Step 1.2: Se MISSING — scaffold progetto Vite+React**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K/dashboard"
npm create vite@latest . -- --template react
npm install
```

Se EXISTS, vai al passo 1.4.

- [ ] **Step 1.3: Verifica che il dev server parta**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K/dashboard"
npm run dev -- --port 5173
```

Expected: server su `http://localhost:5173`

- [ ] **Step 1.4: Aggiorna `index.html` — aggiungi Inter font**

Assicurati che `<head>` contenga:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<title>Filtro K</title>
```

- [ ] **Step 1.5: Commit setup**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/package.json dashboard/vite.config.js dashboard/index.html dashboard/src/main.jsx
git commit -m "feat: scaffold vite+react dashboard"
```

---

## Task 2: Design System CSS

**Files:**
- Create: `dashboard/src/styles/glass.css`
- Modify: `dashboard/src/styles/index.css` (o `src/index.css`)

Questo file definisce TUTTO il sistema visivo condiviso. I componenti lo usano tramite classi globali oppure tramite CSS Modules che estendono i token.

- [ ] **Step 2.1: Crea `dashboard/src/styles/glass.css`**

```css
/* ── TOKENS ── */
:root {
  --bg: #eef0f5;
  --surface: rgba(255,255,255,0.6);
  --surface-solid: #ffffff;
  --border-light: rgba(255,255,255,0.85);
  --border-subtle: rgba(0,0,0,0.06);
  --text-primary: #0f1623;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --accent-from: #6366f1;
  --accent-to: #8b5cf6;
  --danger-from: #ff8a8a;
  --danger-to: #ef4444;
  --success-from: #34d399;
  --success-to: #059669;
  --warning-from: #fcd34d;
  --warning-to: #f59e0b;
  --blur-sm: blur(12px) saturate(150%);
  --blur-md: blur(24px) saturate(200%);
  --blur-lg: blur(32px) saturate(200%);
  --radius-pill: 30px;
  --radius-card: 16px;
  --radius-icon: 9px;
}

/* ── GLASS SURFACE ── */
.glass {
  background: var(--surface);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--border-light);
}
.glass-sm {
  background: rgba(255,255,255,0.55);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  border: 1px solid var(--border-light);
}

/* ── GRADIENT TEXT ── */
.grad-accent {
  background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-danger {
  background: linear-gradient(135deg, var(--danger-from), var(--danger-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-success {
  background: linear-gradient(135deg, var(--success-from), var(--success-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-warning {
  background: linear-gradient(135deg, var(--warning-from), var(--warning-to));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-neutral {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── PILL ── */
.pill { border-radius: var(--radius-pill); }

/* ── AURA MIXIN via data-aura ── */
/* Usato con ::after su elementi wrapper */
[data-aura="accent"]::after  { background: radial-gradient(ellipse, rgba(99,102,241,0.35), transparent 70%); }
[data-aura="danger"]::after  { background: radial-gradient(ellipse, rgba(239,68,68,0.35), transparent 70%); }
[data-aura="success"]::after { background: radial-gradient(ellipse, rgba(16,185,129,0.35), transparent 70%); }
[data-aura="warning"]::after { background: radial-gradient(ellipse, rgba(245,158,11,0.35), transparent 70%); }

/* ── AMBIENT BLOBS ── */
.blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.45;
  pointer-events: none;
  animation: blob-float 16s ease-in-out infinite alternate;
}
.blob-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, #c7d2fe, #a5b4fc);
  top: -160px; right: -60px;
}
.blob-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, #ddd6fe, #c4b5fd);
  bottom: -100px; left: -60px;
  animation-delay: -5s;
}
.blob-3 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, #bfdbfe, #93c5fd);
  top: 45%; left: 30%;
  animation-delay: -10s;
  opacity: 0.25;
}
@keyframes blob-float {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(15px, -25px) scale(1.04); }
}

/* ── DOT GRID ── */
.dot-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: radial-gradient(circle, rgba(99,102,241,0.13) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image:
    radial-gradient(ellipse 60% 80% at 0% 100%, rgba(0,0,0,0.7) 0%, transparent 55%),
    radial-gradient(ellipse 45% 55% at 100% 0%, rgba(0,0,0,0.5) 0%, transparent 55%);
  -webkit-mask-image:
    radial-gradient(ellipse 60% 80% at 0% 100%, rgba(0,0,0,0.7) 0%, transparent 55%),
    radial-gradient(ellipse 45% 55% at 100% 0%, rgba(0,0,0,0.5) 0%, transparent 55%);
  mask-composite: add;
  -webkit-mask-composite: source-over;
}

/* ── STATUS DOT PULSE ── */
@keyframes status-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.2), 0 0 5px rgba(16,185,129,0.4); }
  50%       { box-shadow: 0 0 0 3px rgba(16,185,129,0.15), 0 0 12px rgba(16,185,129,0.7); }
}
.status-dot-pulse { animation: status-pulse 2s ease-in-out infinite; }

/* ── GRADIENT TOP LINE (usata da reply-box e insight) ── */
.grad-topline::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-from), var(--accent-to), transparent);
  opacity: 0.5;
}
```

- [ ] **Step 2.2: Aggiorna `src/index.css`**

```css
@import './styles/glass.css';

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  height: 100vh;
  overflow: hidden;
}

#root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 2.3: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/styles/glass.css dashboard/src/index.css
git commit -m "feat: add glass design system tokens and CSS"
```

---

## Task 3: KpiCard Component

**Files:**
- Create: `dashboard/src/components/Header/KpiCard.jsx`
- Create: `dashboard/src/components/Header/KpiCard.module.css`

- [ ] **Step 3.1: Crea `KpiCard.module.css`**

```css
.card {
  position: relative;
  border-radius: 20px;
  padding: 5px 14px 6px;
  min-width: 88px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.9);
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: default;
  overflow: visible;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}
/* aura sotto */
.card::after {
  content: '';
  position: absolute;
  bottom: -8px; left: 10%; right: 10%;
  height: 20px;
  border-radius: 50%;
  filter: blur(10px);
  opacity: 0.5;
}
.aura-danger::after  { background: #ef4444; }
.aura-neutral::after { background: #6366f1; }
.aura-success::after { background: #10b981; }
.aura-accent::after  { background: #8b5cf6; }

.label {
  font-size: 8.5px; font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.6px;
}
.value {
  font-size: 20px; font-weight: 800;
  line-height: 1.2; letter-spacing: -0.7px;
}
.trend {
  font-size: 8px; color: var(--text-muted); margin-top: 1px;
}
.trend-up   { color: #10b981; }
.trend-down { color: #ef4444; }
```

- [ ] **Step 3.2: Crea `KpiCard.jsx`**

```jsx
import styles from './KpiCard.module.css';

// variant: 'danger' | 'neutral' | 'success' | 'accent'
// trendDir: 'up' | 'down' | null
export default function KpiCard({ label, value, trend, trendDir, variant = 'neutral' }) {
  const auraClass = styles[`aura-${variant}`];
  const gradClass = `grad-${variant}`; // dalla glass.css globale

  return (
    <div className={`${styles.card} ${auraClass}`}>
      <div className={styles.label}>{label}</div>
      <div className={`${styles.value} ${gradClass}`}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${trendDir === 'up' ? styles['trend-up'] : trendDir === 'down' ? styles['trend-down'] : ''}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3.3: Test visivo — apri dev server e verifica KpiCard isolato**

Aggiungi temporaneamente in `App.jsx`:
```jsx
import KpiCard from './components/Header/KpiCard';
// nella render:
<div style={{padding:20,display:'flex',gap:8,background:'#eef0f5'}}>
  <KpiCard label="In attesa" value="3" trend="↑ +1 da ieri" trendDir="down" variant="danger" />
  <KpiCard label="Oggi" value="12" trend="−3 da ieri" variant="neutral" />
  <KpiCard label="Gestite AI" value="75%" trend="↑ +3%" trendDir="up" variant="success" />
  <KpiCard label="Tempo medio" value="1.4h" trend="↓ −12min" trendDir="up" variant="accent" />
</div>
```

Expected: 4 card pill con gradient text e aura colorata sotto, hover animato.

- [ ] **Step 3.4: Rimuovi il test temporaneo da App.jsx e commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/Header/
git commit -m "feat: add KpiCard component with aura and gradient text"
```

---

## Task 4: Header Component

**Files:**
- Create: `dashboard/src/components/Header/Header.jsx`
- Create: `dashboard/src/components/Header/Header.module.css`

- [ ] **Step 4.1: Crea `Header.module.css`**

```css
.header {
  height: 60px;
  position: relative;
  z-index: 10;
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border-bottom: 1px solid rgba(255,255,255,0.85);
  box-shadow: 0 1px 0 rgba(99,102,241,0.06), 0 8px 32px rgba(99,102,241,0.05);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.logoPill {
  position: relative;
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 30px;
  padding: 5px 12px 5px 6px;
  box-shadow: 0 2px 12px rgba(99,102,241,0.12);
}
.logoPill::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.25), transparent 70%);
  border-radius: 40px;
  z-index: -1;
  filter: blur(6px);
}
.logoIcon {
  width: 26px; height: 26px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(99,102,241,0.45);
}
.logoText { font-size: 13px; font-weight: 700; letter-spacing: -0.3px; }

.divider {
  width: 1px; height: 30px;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.07), transparent);
}

.kpiRow { display: flex; gap: 6px; }

.spacer { flex: 1; }

.statusPill {
  position: relative;
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 20px;
  padding: 5px 12px 5px 8px;
  font-size: 11px; font-weight: 500; color: #059669;
  box-shadow: 0 2px 10px rgba(16,185,129,0.1);
}
.statusPill::after {
  content: '';
  position: absolute;
  bottom: -6px; left: 15%; right: 15%; height: 12px;
  background: #10b981; border-radius: 50%;
  filter: blur(8px); opacity: 0.4;
}
.statusDot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
}

.avatar {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
  box-shadow: 0 2px 10px rgba(99,102,241,0.4);
  border: 2px solid rgba(255,255,255,0.8);
}
```

- [ ] **Step 4.2: Crea `Header.jsx`**

```jsx
import KpiCard from './KpiCard';
import styles from './Header.module.css';

const KPI_DATA = [
  { label: 'In attesa',    value: '3',    trend: '↑ +1 da ieri', trendDir: 'down', variant: 'danger'  },
  { label: 'Oggi',         value: '12',   trend: '−3 da ieri',   trendDir: null,   variant: 'neutral' },
  { label: 'Gestite AI',   value: '75%',  trend: '↑ +3%',        trendDir: 'up',   variant: 'success' },
  { label: 'Tempo medio',  value: '1.4h', trend: '↓ −12min',     trendDir: 'up',   variant: 'accent'  },
];

export default function Header() {
  return (
    <header className={styles.header}>

      <div className={styles.logoPill}>
        <div className={styles.logoIcon}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6">
            <path d="M2 4h12M2 8h8M2 12h5"/>
            <circle cx="13" cy="12" r="2" fill="white" stroke="none"/>
          </svg>
        </div>
        <span className={styles.logoText}>Filtro K</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.kpiRow}>
        {KPI_DATA.map(k => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.spacer} />

      <div className={styles.statusPill}>
        <div className={`${styles.statusDot} status-dot-pulse`} />
        AI attiva
      </div>

      <div className={styles.avatar}>D</div>

    </header>
  );
}
```

- [ ] **Step 4.3: Monta Header in App.jsx e verifica visivamente**

```jsx
// App.jsx
import Header from './components/Header/Header';

export default function App() {
  return (
    <>
      <div className="dot-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100vh' }}>
        <Header />
      </div>
    </>
  );
}
```

Expected: header con logo pill (aura viola), 4 KPI card con gradient text, status "AI attiva" con dot pulsante verde.

- [ ] **Step 4.4: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/Header/Header.jsx dashboard/src/components/Header/Header.module.css
git commit -m "feat: add Header component with logo pill and KPI row"
```

---

## Task 5: Sidebar Component

**Files:**
- Create: `dashboard/src/components/Sidebar/Sidebar.jsx`
- Create: `dashboard/src/components/Sidebar/Sidebar.module.css`

- [ ] **Step 5.1: Crea `Sidebar.module.css`**

```css
.sidebar {
  width: 210px;
  position: relative;
  z-index: 5;
  background: rgba(255,255,255,0.38);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255,255,255,0.7);
  padding: 18px 12px;
  display: flex; flex-direction: column; gap: 2px;
  flex-shrink: 0;
}

.sectionLabel {
  font-size: 9px; font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px;
  padding: 8px 10px 5px;
}

.navItem {
  position: relative;
  display: flex; align-items: center; gap: 9px;
  padding: 8px 12px;
  border-radius: 30px;
  font-size: 13px; font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.navItem:hover:not(.active) {
  background: rgba(255,255,255,0.5);
  color: var(--text-primary);
}
.navItem.active {
  background: rgba(255,255,255,0.75);
  color: #6366f1;
  font-weight: 600;
  border-color: rgba(99,102,241,0.12);
  box-shadow: 0 2px 12px rgba(99,102,241,0.1);
}
/* aura sotto nav attivo */
.navItem.active::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 20%; right: 20%; height: 10px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.35), transparent 70%);
  border-radius: 50%;
  filter: blur(4px);
}

.navIcon { width: 14px; height: 14px; flex-shrink: 0; }

.badge {
  margin-left: auto;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff; font-size: 9px; font-weight: 700;
  border-radius: 20px; padding: 2px 7px;
  box-shadow: 0 2px 6px rgba(239,68,68,0.4);
}

.bottom { margin-top: auto; }
```

- [ ] **Step 5.2: Crea `Sidebar.jsx`**

```jsx
import styles from './Sidebar.module.css';

// activeSection: 'escalation' | 'storico' | 'analytics' | 'kb' | 'impostazioni'
export default function Sidebar({ activeSection = 'escalation', onNavigate }) {
  const item = (id, label, icon, badge = null) => (
    <div
      key={id}
      className={`${styles.navItem} ${activeSection === id ? styles.active : ''}`}
      onClick={() => onNavigate?.(id)}
    >
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
        {icon}
      </svg>
      {label}
      {badge && <span className={styles.badge}>{badge}</span>}
    </div>
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionLabel}>Gestione</div>

      {item('escalation', 'Escalation',
        <><path d="M2 4h12M2 8h8M2 12h6"/></>,
        3
      )}
      {item('storico', 'Storico',
        <><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8h6M5 5h6M5 11h4"/></>
      )}

      <div className={styles.sectionLabel} style={{ marginTop: 6 }}>Report</div>

      {item('analytics', 'Analytics',
        <><path d="M2 12l4-4 3 3 5-6"/></>
      )}
      {item('kb', 'Knowledge Base',
        <><path d="M2 12V4l6-2 6 2v8l-6 2-6-2z"/></>
      )}

      <div className={styles.bottom}>
        {item('impostazioni', 'Impostazioni',
          <><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2"/></>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 5.3: Aggiungi Sidebar in App.jsx, verifica nav item attivo con aura**

```jsx
// App.jsx — aggiungi Sidebar accanto a Header
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';

// dentro il render:
const [activeSection, setActiveSection] = useState('escalation');
// ...
<div style={{ display:'flex', flex:1, overflow:'hidden' }}>
  <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
</div>
```

Expected: sidebar con item "Escalation" attivo (sfondo glass, colore viola, aura sotto), badge rosso "3", hover sui non-attivi.

- [ ] **Step 5.4: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/Sidebar/
git commit -m "feat: add Sidebar with pill nav items and aura glow"
```

---

## Task 6: EscalationCard + ListPanel

**Files:**
- Create: `dashboard/src/components/ListPanel/EscalationCard.jsx`
- Create: `dashboard/src/components/ListPanel/EscalationCard.module.css`
- Create: `dashboard/src/components/ListPanel/ListPanel.jsx`
- Create: `dashboard/src/components/ListPanel/ListPanel.module.css`

- [ ] **Step 6.1: Crea `EscalationCard.module.css`**

```css
.card {
  position: relative;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 16px;
  padding: 11px 13px 11px 16px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  overflow: hidden;
}
.card:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
.card.selected {
  background: rgba(255,255,255,0.88);
  border-color: rgba(99,102,241,0.22);
  box-shadow: 0 6px 24px rgba(99,102,241,0.1), 0 0 0 1px rgba(99,102,241,0.12);
}

/* stripe laterale */
.stripe {
  position: absolute;
  left: 0; top: 8px; bottom: 8px; width: 3px;
  border-radius: 0 3px 3px 0;
}
.stripe-danger  { background: linear-gradient(to bottom, #f87171, #ef4444); }
.stripe-warning { background: linear-gradient(to bottom, #fcd34d, #f59e0b); }

/* micro aura riflessa a sinistra */
.card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0; width: 40px;
  pointer-events: none;
  background: linear-gradient(to right, rgba(239,68,68,0.04), transparent);
}
.card.warning-aura::before { background: linear-gradient(to right, rgba(245,158,11,0.05), transparent); }
.card.selected::before { background: linear-gradient(to right, rgba(99,102,241,0.04), transparent); }

.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
.sender { font-size: 10.5px; color: var(--text-muted); font-weight: 500; }
.time   { font-size: 10px; color: #cbd5e1; }
.subject { font-size: 12px; font-weight: 600; color: var(--text-primary); line-height: 1.35; margin-bottom: 6px; }
.foot { display: flex; gap: 5px; align-items: center; }

.pill {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600;
  padding: 3px 9px; border-radius: 20px;
}
.pill-danger  { background: rgba(239,68,68,0.07); color: #dc2626; border: 1px solid rgba(239,68,68,0.12); }
.pill-warning { background: rgba(245,158,11,0.07); color: #d97706; border: 1px solid rgba(245,158,11,0.12); }
.dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

.tag {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; font-weight: 500; color: #7c3aed;
  background: rgba(124,58,237,0.07);
  border: 1px solid rgba(124,58,237,0.12);
  border-radius: 20px; padding: 2px 8px;
}
```

- [ ] **Step 6.2: Crea `EscalationCard.jsx`**

```jsx
import styles from './EscalationCard.module.css';

// urgency: 'danger' | 'warning'
// status: 'attesa' | 'lavorazione'
export default function EscalationCard({ id, sender, subject, time, urgency, status, isSecondo, selected, onClick }) {
  const stripeClass  = urgency === 'warning' ? styles['stripe-warning'] : styles['stripe-danger'];
  const auraClass    = urgency === 'warning' ? styles['warning-aura'] : '';
  const pillClass    = status === 'lavorazione' ? styles['pill-warning'] : styles['pill-danger'];
  const pillLabel    = status === 'lavorazione' ? 'In lavorazione' : 'In attesa';

  return (
    <div
      className={`${styles.card} ${auraClass} ${selected ? styles.selected : ''}`}
      onClick={() => onClick?.(id)}
    >
      <div className={`${styles.stripe} ${stripeClass}`} />
      <div className={styles.top}>
        <span className={styles.sender}>{sender}</span>
        <span className={styles.time}>{time}</span>
      </div>
      <div className={styles.subject}>{subject}</div>
      <div className={styles.foot}>
        <span className={`${styles.pill} ${pillClass}`}>
          <span className={styles.dot} />
          {pillLabel}
        </span>
        {isSecondo && <span className={styles.tag}>↩ 2° contatto</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 6.3: Crea `ListPanel.module.css`**

```css
.panel {
  width: 300px;
  position: relative;
  z-index: 5;
  background: rgba(255,255,255,0.32);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.65);
  display: flex; flex-direction: column;
  flex-shrink: 0; overflow: hidden;
}

.head {
  padding: 16px 14px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.6);
}

/* Section label con aura — elemento chiave spec */
.sectionWrap {
  position: relative;
  display: inline-flex; align-items: center; gap: 7px;
  margin-bottom: 12px;
}
.sectionWrap::before {
  content: '';
  position: absolute;
  bottom: -8px; left: 10%; right: 10%; height: 22px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.3), transparent 70%);
  border-radius: 50%; filter: blur(8px);
}
.sectionIcon {
  position: relative;
  z-index: 1;
  width: 28px; height: 28px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(99,102,241,0.1);
  backdrop-filter: blur(8px);
}
.sectionTitle {
  position: relative;
  z-index: 1;
  font-size: 13px; font-weight: 700;
  color: var(--text-primary); letter-spacing: -0.3px;
}

.search {
  display: flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 20px;
  padding: 7px 12px; margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.search input {
  border: none; background: transparent;
  font-size: 12px; font-family: inherit;
  color: var(--text-primary); outline: none; flex: 1;
}
.search input::placeholder { color: var(--text-muted); }

.chips { display: flex; gap: 5px; }
.chip {
  font-size: 11px; font-weight: 500;
  padding: 4px 12px; border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.07);
  background: rgba(255,255,255,0.6);
  color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
}
.chip.active {
  background: rgba(255,255,255,0.85);
  color: #6366f1; border-color: rgba(99,102,241,0.2);
  box-shadow: 0 2px 8px rgba(99,102,241,0.12);
}

.body {
  flex: 1; overflow-y: auto; padding: 10px;
  display: flex; flex-direction: column; gap: 6px;
}
.body::-webkit-scrollbar { width: 3px; }
.body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 3px; }
```

- [ ] **Step 6.4: Crea `ListPanel.jsx`**

```jsx
import { useState } from 'react';
import EscalationCard from './EscalationCard';
import styles from './ListPanel.module.css';

const MOCK_ESCALATIONS = [
  { id: 1, sender: 'mario.rossi@gmail.com', subject: 'Spedizione bloccata al corriere da 3 giorni', time: '2h fa', urgency: 'danger', status: 'attesa', isSecondo: true },
  { id: 2, sender: 'giulia.b@hotmail.it', subject: 'Rimborso filtro cappa difettoso', time: '5h fa', urgency: 'warning', status: 'lavorazione', isSecondo: false },
  { id: 3, sender: 'info@restauranteblu.it', subject: 'Ordine multiplo — fattura mancante', time: 'Ieri', urgency: 'danger', status: 'attesa', isSecondo: false },
];

const FILTERS = ['Tutti', 'In attesa', 'In lavorazione'];

export default function ListPanel({ selectedId, onSelect }) {
  const [activeFilter, setActiveFilter] = useState('Tutti');

  const filtered = MOCK_ESCALATIONS.filter(e => {
    if (activeFilter === 'In attesa')     return e.status === 'attesa';
    if (activeFilter === 'In lavorazione') return e.status === 'lavorazione';
    return true;
  });

  return (
    <div className={styles.panel}>
      <div className={styles.head}>

        <div className={styles.sectionWrap}>
          <div className={styles.sectionIcon}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#6366f1" strokeWidth="1.7">
              <path d="M2 4h12M2 8h8M2 12h6"/>
            </svg>
          </div>
          <span className={styles.sectionTitle}>Escalation attive</span>
        </div>

        <div className={styles.search}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
            <circle cx="7" cy="7" r="4.5"/><path d="M12 12l2.5 2.5"/>
          </svg>
          <input placeholder="Cerca mittente o oggetto…" />
        </div>

        <div className={styles.chips}>
          {FILTERS.map(f => (
            <span
              key={f}
              className={`${styles.chip} ${activeFilter === f ? styles.active : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {filtered.map(e => (
          <EscalationCard key={e.id} {...e} selected={selectedId === e.id} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6.5: Aggiungi ListPanel in App.jsx, verifica filtri e selezione card**

```jsx
const [selectedId, setSelectedId] = useState(1);
// dentro il div flex principale:
<ListPanel selectedId={selectedId} onSelect={setSelectedId} />
```

Expected: lista con section label "Escalation attive" con aura viola sotto l'icona, chip filtri pill, card selezionata con bordo viola e aura riflessa.

- [ ] **Step 6.6: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/ListPanel/
git commit -m "feat: add ListPanel and EscalationCard with aura section label"
```

---

## Task 7: InsightBanner, EmailBubble, ReplyBox

**Files:**
- Create: `dashboard/src/components/DetailPanel/InsightBanner.jsx`
- Create: `dashboard/src/components/DetailPanel/InsightBanner.module.css`
- Create: `dashboard/src/components/DetailPanel/EmailBubble.jsx`
- Create: `dashboard/src/components/DetailPanel/EmailBubble.module.css`
- Create: `dashboard/src/components/DetailPanel/ReplyBox.jsx`
- Create: `dashboard/src/components/DetailPanel/ReplyBox.module.css`

- [ ] **Step 7.1: Crea `InsightBanner.module.css`**

```css
.banner {
  position: relative;
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(99,102,241,0.12);
  border-radius: 16px;
  padding: 11px 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(99,102,241,0.07);
  overflow: hidden;
}
.banner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.4), transparent);
}
.icon {
  position: relative;
  width: 30px; height: 30px; flex-shrink: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(99,102,241,0.35);
}
.icon::after {
  content: '';
  position: absolute;
  bottom: -5px; left: 2px; right: 2px; height: 10px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.45), transparent 70%);
  border-radius: 50%; filter: blur(4px);
}
.text { font-size: 12px; color: var(--text-secondary); line-height: 1.65; }
.text strong { color: var(--text-primary); font-weight: 600; }
```

- [ ] **Step 7.2: Crea `InsightBanner.jsx`**

```jsx
import styles from './InsightBanner.module.css';

export default function InsightBanner({ text }) {
  return (
    <div className={styles.banner}>
      <div className={styles.icon}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.6">
          <path d="M8 2a6 6 0 100 12A6 6 0 008 2z"/>
          <path d="M8 7v4M8 5.5v.5"/>
        </svg>
      </div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
```

- [ ] **Step 7.3: Crea `EmailBubble.module.css`**

```css
.bubble {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.9);
  border-radius: 18px;
  padding: 15px 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.04);
  backdrop-filter: blur(14px);
}
.head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.from { display: flex; align-items: center; gap: 9px; }
.avatar {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #475569;
  border: 2px solid rgba(255,255,255,0.8);
}
.name  { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.email { font-size: 11px; color: var(--text-muted); }
.date  { font-size: 11px; color: var(--text-muted); }
.body  { font-size: 13px; color: var(--text-secondary); line-height: 1.7; }
```

- [ ] **Step 7.4: Crea `EmailBubble.jsx`**

```jsx
import styles from './EmailBubble.module.css';

export default function EmailBubble({ initials, name, email, date, bodyHtml }) {
  return (
    <div className={styles.bubble}>
      <div className={styles.head}>
        <div className={styles.from}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <div className={styles.name}>{name}</div>
            <div className={styles.email}>{email}</div>
          </div>
        </div>
        <div className={styles.date}>{date}</div>
      </div>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}
```

- [ ] **Step 7.5: Crea `ReplyBox.module.css`**

```css
.box {
  position: relative;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(99,102,241,0.14);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 28px rgba(99,102,241,0.08);
}
.box::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent);
  opacity: 0.5;
}
.head {
  padding: 11px 16px;
  border-bottom: 1px solid rgba(99,102,241,0.07);
  background: rgba(99,102,241,0.025);
  display: flex; align-items: center; justify-content: space-between;
}
.aiTag {
  position: relative;
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(99,102,241,0.18);
  border-radius: 20px; padding: 3px 10px;
  font-size: 10px; font-weight: 700; color: #6366f1; letter-spacing: 0.3px;
  box-shadow: 0 1px 4px rgba(99,102,241,0.1);
}
.aiTag::after {
  content: '';
  position: absolute;
  bottom: -5px; left: 10%; right: 10%; height: 8px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.3), transparent 70%);
  border-radius: 50%; filter: blur(4px);
}
.replyTo { font-size: 11px; color: var(--text-muted); }
.textarea {
  width: 100%; padding: 13px 16px;
  font-size: 13px; font-family: inherit;
  color: var(--text-secondary); line-height: 1.7;
  border: none; resize: none; outline: none;
  min-height: 100px; background: transparent;
}
.foot {
  padding: 10px 16px;
  border-top: 1px solid rgba(99,102,241,0.06);
  background: rgba(99,102,241,0.02);
  display: flex; justify-content: space-between; align-items: center;
}
.hint { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }

/* Button inline nel ReplyBox */
.sendBtn {
  position: relative;
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600;
  padding: 7px 16px; border-radius: 30px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; border: none; cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
  transition: all 0.15s;
}
.sendBtn::after {
  content: '';
  position: absolute;
  bottom: -6px; left: 15%; right: 15%; height: 12px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.5), transparent 70%);
  border-radius: 50%; filter: blur(5px);
}
.sendBtn:hover { box-shadow: 0 6px 22px rgba(99,102,241,0.5); transform: translateY(-1px); }
```

- [ ] **Step 7.6: Crea `ReplyBox.jsx`**

```jsx
import { useState } from 'react';
import styles from './ReplyBox.module.css';

export default function ReplyBox({ toEmail, defaultText, onSend }) {
  const [text, setText] = useState(defaultText || '');

  return (
    <div className={styles.box}>
      <div className={styles.head}>
        <div className={styles.aiTag}>
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 2l2 4 4 .5-3 2.8.8 4.2L8 11.2l-3.8 2.3.8-4.2L2 6.5 6 6z"/>
          </svg>
          Generata AI
        </div>
        <span className={styles.replyTo}>→ {toEmail}</span>
      </div>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <div className={styles.foot}>
        <span className={styles.hint}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2H3a1 1 0 00-1 1v9l3-2h8a1 1 0 001-1V3a1 1 0 00-1-1z"/>
          </svg>
          Invio via Gmail · stato → Risolto automaticamente
        </span>
        <button className={styles.sendBtn} onClick={() => onSend?.(text)}>
          Invia risposta →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7.7: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/DetailPanel/InsightBanner.jsx dashboard/src/components/DetailPanel/InsightBanner.module.css
git add dashboard/src/components/DetailPanel/EmailBubble.jsx dashboard/src/components/DetailPanel/EmailBubble.module.css
git add dashboard/src/components/DetailPanel/ReplyBox.jsx dashboard/src/components/DetailPanel/ReplyBox.module.css
git commit -m "feat: add InsightBanner, EmailBubble, ReplyBox components"
```

---

## Task 8: DetailPanel Component

**Files:**
- Create: `dashboard/src/components/DetailPanel/DetailPanel.jsx`
- Create: `dashboard/src/components/DetailPanel/DetailPanel.module.css`

- [ ] **Step 8.1: Crea `DetailPanel.module.css`**

```css
.panel {
  flex: 1;
  display: flex; flex-direction: column;
  overflow: hidden;
  position: relative; z-index: 5;
}
.head {
  background: rgba(255,255,255,0.42);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.7);
  padding: 13px 22px;
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 14px;
}
.title { font-size: 14px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px; margin-bottom: 5px; }
.meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.meta span { font-size: 11.5px; color: var(--text-secondary); }
.metaDot { color: #cbd5e1; font-size: 10px; }
.tag {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; font-weight: 500; color: #7c3aed;
  background: rgba(124,58,237,0.07);
  border: 1px solid rgba(124,58,237,0.12);
  border-radius: 20px; padding: 2px 8px;
}
.actions { display: flex; gap: 7px; flex-shrink: 0; align-items: center; }
.btn {
  font-size: 12px; font-weight: 600;
  padding: 7px 16px; border-radius: 30px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.7);
  color: var(--text-secondary); cursor: pointer;
  transition: all 0.15s;
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.btn:hover { background: rgba(255,255,255,0.9); box-shadow: 0 3px 12px rgba(0,0,0,0.08); }
.btnWarn { background: rgba(245,158,11,0.08); color: #d97706; border-color: rgba(245,158,11,0.18); }
.body {
  flex: 1; overflow-y: auto; padding: 18px 22px;
  display: flex; flex-direction: column; gap: 12px;
}
.body::-webkit-scrollbar { width: 3px; }
.body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.07); border-radius: 3px; }
```

- [ ] **Step 8.2: Crea `DetailPanel.jsx`**

```jsx
import InsightBanner from './InsightBanner';
import EmailBubble from './EmailBubble';
import ReplyBox from './ReplyBox';
import styles from './DetailPanel.module.css';

const MOCK_DETAIL = {
  id: 1,
  title: 'Spedizione bloccata al corriere da 3 giorni',
  sender: 'mario.rossi@gmail.com',
  date: '30 apr 2026, 09:14',
  isSecondo: true,
  insight: '<strong>Suggerimento AI:</strong> Cliente al secondo contatto — priorità alta. Ordine ORD-2241 attivo da 4 giorni. GLS ha segnalato un\'anomalia nel centro smistamento di Padova il 27 apr.',
  emailBodyHtml: 'Buongiorno,<br><br>ho effettuato un ordine il 26 aprile (n° <strong>ORD-2241</strong>) ma il pacco risulta bloccato al corriere GLS da tre giorni. Il tracking non si aggiorna e il servizio GLS non risponde.<br><br>Potreste verificare e farmi sapere? Grazie mille.',
  replyDefault: `Gentile Mario,\n\ngrazie per averci contattato. Abbiamo verificato il suo ordine ORD-2241 e stiamo aprendo una segnalazione urgente con GLS. Riceverà aggiornamenti entro 24 ore lavorative.\n\nCi scusiamo per il disagio.`,
};

export default function DetailPanel({ escalationId }) {
  const d = MOCK_DETAIL; // in futuro: lookup per escalationId

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>{d.title}</div>
          <div className={styles.meta}>
            <span>{d.sender}</span>
            <span className={styles.metaDot}>·</span>
            <span>{d.date}</span>
            {d.isSecondo && (
              <>
                <span className={styles.metaDot}>·</span>
                <span className={styles.tag}>↩ 2° contatto</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnWarn}`}>→ In lavorazione</button>
          <button className={styles.btn}>✓ Segna risolto</button>
        </div>
      </div>

      <div className={styles.body}>
        <InsightBanner text={d.insight} />
        <EmailBubble
          initials="MR"
          name="Mario Rossi"
          email={d.sender}
          date={d.date}
          bodyHtml={d.emailBodyHtml}
        />
        <ReplyBox
          toEmail={d.sender}
          defaultText={d.replyDefault}
          onSend={(text) => console.log('Inviato:', text)}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 8.3: Commit**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/components/DetailPanel/DetailPanel.jsx dashboard/src/components/DetailPanel/DetailPanel.module.css
git commit -m "feat: add DetailPanel with insight, email bubble and reply box"
```

---

## Task 9: Assembly — App.jsx finale

**Files:**
- Modify: `dashboard/src/App.jsx`

- [ ] **Step 9.1: Sostituisci `App.jsx` con il layout completo**

```jsx
import { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ListPanel from './components/ListPanel/ListPanel';
import DetailPanel from './components/DetailPanel/DetailPanel';

export default function App() {
  const [activeSection, setActiveSection] = useState('escalation');
  const [selectedId, setSelectedId] = useState(1);

  return (
    <>
      {/* Ambient background — fixed, z-index 0 */}
      <div className="dot-grid" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* App shell */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
          {activeSection === 'escalation' && (
            <>
              <ListPanel selectedId={selectedId} onSelect={setSelectedId} />
              <DetailPanel escalationId={selectedId} />
            </>
          )}
          {activeSection !== 'escalation' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              Sezione in arrivo
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 9.2: Avvia il dev server e verifica l'intera dashboard**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K/dashboard"
npm run dev -- --port 5173
```

Apri `http://localhost:5173` e verifica:
- Header glassmorphism con logo pill (aura viola), 4 KPI gradient, status dot pulsante
- Sidebar con "Escalation" attivo (pill viola, aura sotto), badge rosso
- ListPanel con section label "Escalation attive" — icona glass con aura viola che sbuca sotto
- 3 escalation card con stripe laterale colorata, chip filtri funzionanti
- DetailPanel con InsightBanner (gradient top-line, icon con aura), EmailBubble, ReplyBox (AI tag pill con aura, send button con aura)
- Blob animati e dot grid agli angoli
- Click su escalation card → aggiorna selectedId (DetailPanel mostra stessa email per ora)

- [ ] **Step 9.3: Commit finale**

```bash
cd "/Users/daniele/Desktop/Claude/Filtro K"
git add dashboard/src/App.jsx
git commit -m "feat: assemble full premium dashboard — glassmorphism, aura, pill system"
```

---

## Checklist Spec Coverage

| Requisito spec | Task |
|---|---|
| Glassmorphism su header/sidebar/panel | Task 2, 4, 5, 6, 8 |
| Aura glow sotto KPI card | Task 3 |
| Aura glow sotto nav item attivo | Task 5 |
| Section label "Escalation attive" con icona glass + aura | Task 6 |
| Gradient text KPI (danger/success/accent/neutral) | Task 2, 3 |
| Dot grid sfumato agli angoli | Task 2 (glass.css) |
| Blob animati | Task 2 (glass.css) |
| Pill shape su tutti gli elementi interattivi | Task 2–8 |
| Status dot pulsante "AI attiva" | Task 4 |
| Insight AI con gradient top-line e icon aura | Task 7 |
| Reply box con gradient top-line e AI tag aura | Task 7 |
| Send button primary con aura viola | Task 7 |
| Escalation card con stripe laterale e micro-aura | Task 6 |
