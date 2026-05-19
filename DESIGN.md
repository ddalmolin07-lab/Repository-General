# Filtro K — Design System

> Estratto dalla dashboard Escalation (sezione definitiva, approvata).
> Tutte le sezioni future devono rispettare questi token e pattern.

---

## Font

**Urbanist** (Google Fonts) — unico typeface del progetto.
```
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap');
font-family: 'Urbanist', -apple-system, sans-serif;
```

Pesi in uso: 400 (body), 500 (ui text), 600 (label/semibold), 700 (heading), 800 (logo).

---

## Palette — CSS Variables

```css
:root {
  /* Sfondo app */
  --bg-dark:    #252B3C;
  --bg-light:   #A6ADC5;

  /* Pannelli (sidebar, list panel, detail header) */
  --panel-dark: #6C7182;
  --panel-light: #AEB2C1;

  /* Card superfici chiare */
  --card-dark:  #D2D4DE;
  --card-light: #E4E5EA;

  /* Bottone primary (indigo) */
  --btn-dark:   #5975D6;
  --btn-light:  #889DE2;

  /* Testo su sfondi scuri/medi */
  --text:   rgba(255,255,255,0.93);
  --muted:  rgba(255,255,255,0.62);
  --meta:   rgba(255,255,255,0.40);

  /* Testo su card chiare */
  --card-text:  #1E2235;
  --card-muted: #4A4E62;
  --card-meta:  #7C7F93;

  /* Status badge */
  --status-waiting:  #C5A35A;   /* giallo ambra — In attesa */
  --status-progress: #7266C9;   /* viola — In lavorazione */
  --status-resolved: #6E9D82;   /* verde salvia — Risolto */
  --status-ai:       #6C87D8;   /* blu medio — AI attiva */
}
```

---

## Sfondo App

```css
body {
  background:
    radial-gradient(ellipse 80% 95% at 40% 54%, #A6ADC5 0%, transparent 72%),
    radial-gradient(ellipse 58% 68% at 91%  9%, #A6ADC5 0%, transparent 68%),
    radial-gradient(ellipse 40% 35% at 15% 92%, #8E97B2 0%, transparent 60%),
    #252B3C;
}
```

Proporzione: ~60% scuro (#252B3C), ~40% chiaro (#A6ADC5) — tre orb radiali sovrapposti.

**Film di rumore** (noise overlay su tutto, z-index 9999, non interattivo):
```css
body::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px; mix-blend-mode: overlay;
}
```

---

## Border Radius — Sistema Pill

| Elemento | Radius |
|---|---|
| Bottone / pill KPI / badge | `20px` |
| Nav item sidebar | `12px` |
| Card escalation | `16px` |
| Email bubble / reply box / pannelli | `20px–24px` |
| Avatar | `50%` |
| Dot status | `50%` |

---

## Layout App Shell

```
┌─────────────────────────────────────────────────────┐
│  KPI BAR  52px  — blur glass, rgba(37,43,60,0.55)   │
├──────────┬──────────────┬────────────────────────────┤
│ SIDEBAR  │  LIST PANEL  │     DETAIL PANEL           │
│  196px   │    300px     │       flex: 1              │
│ transparent│ panel gradient│ glass rgba(37,43,60,0.32)│
└──────────┴──────────────┴────────────────────────────┘
```

Padding esterno main: `10px 14px 14px 0`. Gap tra colonne: `10px`.

---

## Superfici — Ricette

### KPI Bar (header)
```css
background: rgba(37,43,60,0.55);
backdrop-filter: blur(20px) saturate(110%);
box-shadow: inset 0 -1px 0 rgba(255,255,255,0.06);
height: 52px;
```

### List Panel
```css
background: linear-gradient(145deg, var(--panel-dark) 0%, var(--panel-light) 100%);
border: 1px solid rgba(255,255,255,0.14);
border-radius: 20px;
box-shadow: 0 4px 32px rgba(37,43,60,0.28), inset 0 1px 0 rgba(255,255,255,0.18);
```

### Detail Panel
```css
background: rgba(37,43,60,0.32);
backdrop-filter: blur(28px) saturate(120%);
border: 1px solid rgba(255,255,255,0.09);
border-radius: 20px;
box-shadow: 0 4px 32px rgba(37,43,60,0.22), inset 0 1px 0 rgba(255,255,255,0.08);
```

### Detail Header (striscia colorata in cima al detail panel)
```css
background: linear-gradient(135deg, var(--panel-dark) 0%, var(--panel-light) 100%);
box-shadow: inset 0 -1px 0 rgba(255,255,255,0.12), 0 2px 12px rgba(37,43,60,0.18);
padding: 14px 20px;
```

### Card (email bubble, reply box, card escalation)
```css
background: linear-gradient(150deg, var(--card-light) 0%, var(--card-dark) 100%);
box-shadow: inset 0 1px 0 rgba(255,255,255,0.70), 0 2px 12px rgba(37,43,60,0.14);
border-radius: 20px; /* o 16px per card compatte, 24px per reply box */
```

---

## Componenti

### Bottone base `.btn`
```css
font-size: 12px; font-weight: 600; padding: 7px 16px; border-radius: 20px;
border: 1px solid rgba(255,255,255,0.14);
background: rgba(255,255,255,0.14);
backdrop-filter: blur(10px);
color: rgba(255,255,255,0.75);
```

### Bottone primary `.btn.primary` — spotlight cursor
```css
position: relative; overflow: hidden;
background: linear-gradient(135deg, var(--btn-dark) 0%, var(--btn-light) 100%);
color: #fff; border-radius: 20px;
box-shadow: 0 2px 14px rgba(89,117,214,0.30), inset 0 1px 0 rgba(255,255,255,0.14);
```

Spotlight su hover (richiede JS per aggiornare `--mx` / `--my`):
```css
.btn.primary::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(
    circle 36px at var(--mx, 50%) var(--my, 50%),
    rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 40%, transparent 70%
  );
  opacity: 0; transition: opacity 0.18s ease; border-radius: inherit;
}
.btn.primary:hover::before { opacity: 1; }
```

```js
document.querySelectorAll('.btn.primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--my', (e.clientY - r.top)  + 'px');
  });
});
```

### Bottone status `.btn.status`
```css
background: rgba(114,102,201,0.14); color: var(--status-progress);
border-color: rgba(114,102,201,0.22); border-radius: 20px;
```

### Nav item sidebar
- Default: `color: var(--muted)`, `border-radius: 12px`
- Active/hover: `background: linear-gradient(135deg, var(--panel-dark), var(--panel-light))`, `color: #fff`
- Badge counter: `background: rgba(197,163,90,0.18)`, `color: var(--status-waiting)`

### Card escalation `.esc-item`
- Default: card gradient, `border-radius: 16px`, dot colorato a sinistra (`left: 10px`)
- Hover: `translateY(-1px)`, shadow più alta
- **Selected**: `background: linear-gradient(150deg, #D4D8F5 0%, #BFC4E8 100%)` (wash indigo), `border: 1.5px solid rgba(89,117,214,0.55)`, `box-shadow: 0 4px 22px rgba(89,117,214,0.28)`. Testo: sender/time `rgba(60,70,140,0.65)`, subject `#2a2f6e`.

### Badge status `.esc-status`
```css
/* In attesa */
background: rgba(197,163,90,0.16); color: #8B6E2A;
/* In lavorazione */
background: rgba(114,102,201,0.14); color: var(--status-progress);
```

### Reply box
- Stessa card gradient, `border-radius: 24px`, `border: 1px solid rgba(255,255,255,0.60)`
- **Nessuna divisione interna** — header/body/footer condividono lo stesso background senza bande o box-shadow interni
- Label "RISPOSTA": `font-size: 10px`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 1px`, `color: var(--card-meta)`
- Testo risposta: `font-size: 13.5px`, `font-weight: 500`, `color: var(--card-text)`, `line-height: 1.75`
- Scrollbar custom: `width: 4px`, track trasparente, thumb `rgba(37,43,60,0.16)`
- Focus ring: `0 0 0 1.5px rgba(89,117,214,0.28)`

### Search bar
```css
background: rgba(255,255,255,0.14); border-radius: 20px; padding: 7px 12px;
/* focus-within */
background: rgba(255,255,255,0.20);
```

### Filter chip
- Default: `background: transparent`, `color: rgba(255,255,255,0.60)`
- Active: `background: rgba(255,255,255,0.20)`, `color: #fff`

---

## Animazioni

| Elemento | Keyframe | Durata |
|---|---|---|
| KPI dot | `dot-pulse` scale+opacity | 2.2s ease-in-out infinite |
| Card escalation entry | `card-in` translateY(7px)→0 + opacity | 0.32s ease-out, delay +0.10s per card |
| Hover card | `translateY(-1px)` | 0.15s ease |
| Hover button primary | `box-shadow` + spotlight | 0.22s ease |
| Button active | `scale(0.98)` | 0.1s |

```css
@keyframes dot-pulse {
  0%, 100% { transform: scale(1);   opacity: 0.80; }
  50%       { transform: scale(1.8); opacity: 0.25; }
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: translateY(0);   }
}
```

---

## Tipografia — Scale operativa

| Ruolo | Size | Weight | Color |
|---|---|---|---|
| Logo | 15px | 800 | `--text` |
| Heading dettaglio | 15px | 700 | #fff |
| Section title | 13px | 700 | #fff |
| Body / UI text | 13–13.5px | 500–600 | `--text` / `--card-text` |
| Email body | 13px | 400 | `--card-muted` |
| Reply text | 13.5px | 500 | `--card-text` |
| Label / meta | 11–12px | 400–600 | `--card-meta` / `--muted` |
| Badge / chip | 10–11px | 600–700 | colore specifico status |
| Micro-label uppercase | 9–10px | 500–700 | `--meta` / `--card-meta` |

Line-height standard: 1.4 (compact), 1.7–1.8 (body/email).

---

## Sezioni da costruire (da tenere omogenee)

- [x] Escalation — dashboard principale ✅ **definitiva**
- [ ] Storico — lista email archiviate con filtri
- [ ] Analytics — metriche e grafici
- [ ] Impostazioni — configurazione account e workflow
