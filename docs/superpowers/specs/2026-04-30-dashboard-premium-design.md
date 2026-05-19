# Filtro K Dashboard — Design Spec (Premium v3)

**Data:** 2026-04-30  
**Stato:** Approvato dall'utente  
**File di riferimento:** `.superpowers/brainstorm/.../dashboard-v3.html`

---

## Obiettivo

Ridisegnare la dashboard Filtro K con un'estetica premium che unisce:
- Lo stile **glassmorphism light** (opzione B approvata)
- Il language design delle **reference images** (pill shapes, aura glow sotto gli elementi, superfici traslucide quasi bianche)
- I colori esistenti del progetto (indigo/violet come accent, rosso per urgente, verde per AI/success)

---

## Sistema Visivo

### Palette
| Token | Valore | Uso |
|-------|--------|-----|
| `--bg` | `#eef0f5` | Sfondo app |
| `--surface` | `rgba(255,255,255,0.6)` | Card, pannelli |
| `--accent` | `#6366f1` → `#8b5cf6` | Gradient primario |
| `--danger` | `#ef4444` | Escalation urgenti |
| `--warning` | `#f59e0b` | In lavorazione |
| `--success` | `#10b981` | AI attiva, KPI positivi |

### Effetti chiave
1. **Glassmorphism** — `backdrop-filter: blur(24px) saturate(200%)` su tutti i pannelli, header e card
2. **Aura glow** — `::after` pseudo-element con `radial-gradient` + `filter: blur()` posizionato sotto ogni elemento rilevante (logo, KPI card, nav item attivo, button primary, section icon, ai-tag)
3. **Dot grid sfumato** — pattern `radial-gradient` mascherato con `mask-image` agli angoli inferiore-sinistro e superiore-destro
4. **Blob animati** — 3 orb in `position: fixed`, `filter: blur(100px)`, animazione `float` 16s alternate
5. **Gradient text** — valori KPI con `-webkit-background-clip: text` per rosso/verde/viola/neutro

### Border radius — pill system
- Header pill logo: `30px`
- KPI card: `20px`
- Nav item: `30px` (pill pieno)
- Escalation card: `16px`
- Button: `30px` (pill)
- Section icon: `9px`
- AI tag: `20px`
- Chip filtro: `20px`

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER 60px  [Logo Pill] [KPI×4] [spacer] [Status] [Avatar] │
├──────────┬──────────────┬──────────────────────────────┤
│ SIDEBAR  │  LIST PANEL  │      DETAIL PANEL            │
│  210px   │    300px     │         flex: 1              │
│          │              │  [insight] [email] [reply]   │
└──────────┴──────────────┴──────────────────────────────┘
```

---

## Componenti

### Header
- Logo in pill con aura indigo sotto
- 4 KPI card pill (border-radius 20px) con gradient text + aura colorata allineata al tipo di dato
- Status pill "AI attiva" con dot animato + aura verde
- Avatar gradiente con bordo bianco

### Sidebar
- Sfondo `rgba(255,255,255,0.38)` blur
- Nav item a pill shape; item attivo con aura indigo sotto + bordo trasparente sottile
- Badge rosso gradient per escalation count

### List Panel (Escalation)
- Section label con `section-icon` trasparente (glass) + aura indigo che sbuca sotto — elemento chiave richiesto dall'utente
- Search bar pill
- Chip filtri pill
- Escalation card: glass, stripe laterale colorata, micro-aura riflessiva sul lato sinistro

### Detail Panel
- Insight AI con gradient top-line + icon con aura
- Email bubble glass
- Reply box con gradient top-line 2px, AI tag pill con aura, button primary pill con aura

---

## Animazioni CSS
| Elemento | Animazione | Durata |
|----------|-----------|--------|
| Blob bg | `float` translate+scale alternate | 16s |
| Status dot | `glow-pulse` box-shadow | 2s |
| Button hover | `translateY(-1px)` + shadow | 0.15s |
| KPI card hover | `translateY(-2px)` + shadow | 0.15s |
| Escalation card hover | `translateY(-1px)` + shadow | 0.15s |

---

## File da produrre nell'implementazione

- `dashboard/index.html` — markup completo (o equivalente React)
- `dashboard/src/styles/` — CSS modulare per: layout, glass-system, aura-system, animations
- `dashboard/src/components/` — KpiCard, NavItem, EscalationCard, ReplyBox, InsightBanner

---

## Decisioni prese
- **Light > Dark**: utente ha scelto B (light) tra le 3 opzioni proposte
- **Pill shapes**: richiesto esplicitamente dopo le reference images
- **Aura glow**: feature specifica richiesta dall'utente — "l'alone di colore che si intravede con questa forma"
- **Colori**: mantenuti indigo/violet come accent, non cambiati in favore di verde o altri
