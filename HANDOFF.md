# HANDOFF — Filtro K, Fase 2 (Dashboard + Supabase)

> **Per la prossima chat:** leggi questo file PRIMA di qualsiasi azione. Poi leggi il piano completo in `/Users/daniele/.claude/plans/includi-nel-piano-completo-zazzy-planet.md`. Poi prosegui dal punto "PROSSIMO STEP".

---

## OBIETTIVO DEL PROGETTO

Dashboard React per Filtro K (assistente vendite di "Filtro Cappa") che gestisce le escalation email dall'AI. Cambio architetturale chiave introdotto in questa fase: **Supabase sostituisce Google Sheets come database primario**. Frontend React → Supabase JS Client (anon key + RLS). n8n resta solo per email ingestion + AI + invio Gmail.

**Regola assoluta:** sviluppo prima su Supabase TEST, poi migrazione identica a PROD.

---

## AMBIENTI SUPABASE

| | TEST | PROD |
|-|------|------|
| URL | `https://txblvjxhubtjgtfblgdv.supabase.co` | `https://jkxavutfaxmfngishuoc.supabase.co` |
| Ref | `txblvjxhubtjgtfblgdv` | `jkxavutfaxmfngishuoc` |

**Service Role TEST** (NON usare nel frontend, solo n8n / .env.local):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Ymx2anhodWJ0amd0ZmJsZ2R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MDA5MywiZXhwIjoyMDk0NzY2MDkzfQ._m9R8tSW-82rqFy95udZXyjwZdex6jkHARw-m0VoajE
```

**Service Role PROD** (NON usare nel frontend):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreGF2dXRmYXhtZm5naXNodW9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MTI5OSwiZXhwIjoyMDk0NzY3Mjk5fQ.6RMXaiUfEeeNAlNL8irkT_KYVGznDqFHjZstok-NXBI
```

**Anon Keys:** ancora da recuperare (placeholder nei .env file). Vanno lette da: Supabase Dashboard → Project Settings → API → `anon public` key (una per TEST, una per PROD).

---

## STATO ATTUALE (cosa è già fatto)

### ✅ COMPLETATO

1. **`.mcp.json`** aggiornato — aggiunti `supabase-test` e `supabase-prod` come HTTP MCP servers. **Anche corretto un errore di struttura precedente** (playwright/github/figma erano fuori da `mcpServers`).

2. **SQL schema** scritto in [`docs/supabase_schema.sql`](docs/supabase_schema.sql) — contiene:
   - 3 tabelle: `email_requests`, `analytics_daily`, `app_settings`
   - Trigger `updated_at` automatico
   - RLS policies (authenticated read/update, service role bypass)
   - Storage bucket `email-attachments`
   - Indici performance
   - **Dati di test inseriti** (3 escalation + 14 giorni analytics) — da rimuovere prima di applicare a PROD

3. **Dipendenze installate** in `dashboard/`:
   - `@supabase/supabase-js`
   - `chart.js`
   - `react-chartjs-2`

4. **File env creati** (con placeholder per anon keys):
   - `dashboard/.env.development` → punta a TEST Supabase
   - `dashboard/.env.production` → punta a PROD Supabase
   - `.gitignore` aggiornato per escludere `.env*`

5. **Supabase client singleton** creato: [`dashboard/src/lib/supabase.js`](dashboard/src/lib/supabase.js)

6. **API layer completo** creato: [`dashboard/src/api/client.js`](dashboard/src/api/client.js) con funzioni:
   - `getRequests()` — escalation attive
   - `patchStatus({id, stato})` — aggiorna stato
   - `postReply({...})` — invia Gmail via n8n + aggiorna DB
   - `getHistory({tipo, stato, search})` — storico filtrabile
   - `getAnalytics(days)` — ultimi N giorni
   - `pingSupabase()` — health check per Impostazioni

### 🔄 IN CORSO / DA FARE

- **Implementazione 4 pagine React**:
  - `dashboard/src/pages/Escalation.jsx` ✅ implementata (EscalationList + EscalationCard + EscalationDetail)
  - `dashboard/src/pages/Storico.jsx` ← prossimo step
  - `dashboard/src/pages/Analytics.jsx`
  - `dashboard/src/pages/Impostazioni.jsx`
- **App.jsx** da aggiornare per caricare KPI live al mount (usa `getRequests()` + `getAnalytics(1)`)
- **n8n workflow** da modificare per scrivere su Supabase invece di Google Sheets
- **Webhook n8n** `POST /webhook/dashboard/reply` da creare

---

## AZIONI MANUALI ANCORA NECESSARIE DALL'UTENTE

Queste NON possono essere automatizzate da Claude:

1. **Autenticazione MCP Supabase** (in terminale normale, non IDE):
   ```bash
   claude /mcp
   ```
   Selezionare `supabase-test` → Authenticate. Poi ripetere per `supabase-prod`.

2. **Recuperare anon keys** da Supabase Dashboard:
   - Vai a https://supabase.com/dashboard/project/txblvjxhubtjgtfblgdv/settings/api → copia `anon public` → sostituisci `PLACEHOLDER_ANON_KEY_TEST` in `dashboard/.env.development`
   - Stesso per PROD: https://supabase.com/dashboard/project/jkxavutfaxmfngishuoc/settings/api → copia in `.env.production`

3. **Eseguire SQL schema su TEST**:
   - Aprire https://supabase.com/dashboard/project/txblvjxhubtjgtfblgdv/sql/new
   - Incollare contenuto di `docs/supabase_schema.sql`
   - Eseguire (Run)
   - Verificare in Table Editor che le 3 tabelle siano presenti con dati di test

4. **Installare Agent Skills Supabase** (opzionale):
   ```bash
   npx skills add supabase/agent-skills
   ```

---

## STACK TECNICO (riferimento rapido)

- **Frontend:** React + Vite + Tailwind CSS, deploy Netlify
- **DB:** Supabase Postgres (sostituisce Google Sheets)
- **Auth:** Supabase Auth (email/password) — da implementare in fase login (NON in questa fase)
- **n8n:** `https://daniele1323.app.n8n.cloud` — email ingestion, AI (GPT-4o-mini), invio Gmail
- **Font:** Urbanist (Google Fonts)
- **Design system:** già completo in `dashboard/src/index.css` — design tokens + classi `.surface-*` + animazioni

**Palette principale:**
- BG: `#252B3C` con orb radiali `#A6ADC5` / `#8E97B2`
- Card: gradient `#E4E5EA → #D2D4DE`
- Pannelli: gradient `#6C7182 → #AEB2C1`
- Accent: indigo `#5975D6 → #889DE2`
- Status: waiting `#C5A35A`, progress `#7266C9`, resolved `#6E9D82`

Specifiche complete: `DESIGN.md` nel root.

---

## SCHEMA TABELLE (riferimento per le pagine)

### `email_requests`
| Campo | Tipo | Note |
|-------|------|------|
| `id` | UUID | PK auto |
| `timestamp_arrivo` | TIMESTAMPTZ | default NOW() |
| `mittente_email` | TEXT | |
| `oggetto_email` | TEXT | |
| `testo_email` | TEXT | |
| `tipo` | TEXT | `ai_handled` / `escalated` |
| `stato` | TEXT | `risolto` / `in_attesa` / `in_lavorazione` |
| `timestamp_risolto` | TIMESTAMPTZ | nullable |
| `risposta_inviata` | TEXT | nullable |
| `secondo_contatto` | BOOLEAN | default false |
| `created_at`, `updated_at` | TIMESTAMPTZ | trigger auto |

### `analytics_daily`
| Campo | Tipo |
|-------|------|
| `id` | UUID |
| `data` | DATE UNIQUE |
| `totale_richieste` | INT |
| `ai_handled` | INT |
| `escalated` | INT |
| `tempo_medio_risposta_h` | NUMERIC(5,2) |

### `app_settings`
| Campo | Tipo |
|-------|------|
| `id` | UUID → auth.users |
| `nome` | TEXT |
| `notifiche_email` | BOOLEAN default true |

---

## MOCKUP DI RIFERIMENTO (replicare fedelmente)

Path: `.superpowers/brainstorm/11372-1777570733/content/`

| Mockup | Pagina |
|--------|--------|
| `dashboard-main.html` | Escalation (lista + dettaglio) |
| `dashboard-storico.html` | Storico (tabella filtrabile) |
| `dashboard-analytics.html` | Analytics (4 KPI + 3 grafici) |
| `settings-full.html` | Impostazioni (two-panel) |

---

## ARCHITETTURA REACT (struttura attuale)

```
dashboard/src/
├── App.jsx                 ✅ shell con routing (da aggiornare per KPI live)
├── main.jsx                ✅
├── index.css               ✅ design tokens + surface classes
├── lib/
│   └── supabase.js         ✅ client singleton
├── api/
│   └── client.js           ✅ funzioni getRequests, patchStatus, postReply, getHistory, getAnalytics, pingSupabase
├── components/
│   ├── KpiBar.jsx          ✅ accetta prop `kpis`
│   └── Sidebar.jsx         ✅ accetta prop `pendingCount`
└── pages/
    ├── Escalation.jsx      🔄 PROSSIMO — placeholder da rimpiazzare
    ├── Storico.jsx         🔄 placeholder
    ├── Analytics.jsx       🔄 placeholder
    └── Impostazioni.jsx    🔄 placeholder
```

---

## PROSSIMO STEP (dove riprendere)

### Step immediato: Implementare la pagina Storico

Escalation è completata: 3 componenti in `dashboard/src/components/` (EscalationList, EscalationCard, EscalationDetail), pagina ricollegata a `getRequests`/`patchStatus`/`postReply`, CSS specifico aggiunto a `index.css`. Build Vite passa.

Prossimo: pagina Storico — vedi mockup `dashboard-storico.html` e piano Step 5. Usare `getHistory({tipo, stato, search})`.

### Step originale (Escalation — archiviato)

1. Leggere il mockup `.superpowers/brainstorm/11372-1777570733/content/dashboard-main.html` per capire layout, struttura HTML, classi CSS
2. Creare 3 componenti in `dashboard/src/components/`:
   - **`EscalationList.jsx`** — colonna 300px sinistra: input ricerca + filtri tab (Tutti / In attesa / In lavorazione) + lista card
   - **`EscalationCard.jsx`** — singola card con stripe laterale colorata per stato, badge "2° contatto", status dot, mittente, oggetto, snippet testo
   - **`EscalationDetail.jsx`** — pannello destra flex:1: email bubble con testo originale + reply box con gradient top-line + bottone "Invia risposta" + pulsanti cambio stato ("→ In lavorazione" / "✓ Segna risolto")
3. Aggiornare `Escalation.jsx`:
   - `useEffect` al mount → `getRequests()` → set state
   - Selected card state, reply text state, filter state
   - Cambio stato → `patchStatus({id, stato})` → ricarica
   - Invio risposta → `postReply({...})` → ricarica
4. **NON usare mock data** — i dati arrivano da Supabase. I dati di test sono già presenti nella DB TEST (3 escalation).
5. Riutilizzare classi CSS esistenti: `.surface-panel`, `.surface-detail`, `.surface-card`, design tokens.

### Step successivi (in ordine)
- Storico page → vedi piano Step 5
- Analytics page → vedi piano Step 5
- Impostazioni page → vedi piano Step 5
- Aggiornare `App.jsx` per KpiBar live → vedi piano Step 5
- Aggiornare n8n workflow → vedi piano Step 4
- Verifica E2E con Playwright → vedi piano Step 6
- Migrazione PROD → vedi piano Step 7

---

## CONTESTO PROGETTO (da memoria persistente)

- **Cliente:** Filtro Cappa (e-commerce filtri cappa)
- **Workflow n8n esistente:** AI risponde via Q&A da Google Sheets KB, traccia pacchi, escala domande non sa rispondere
- **Workflow attivi n8n:**
  - Ramo email ingestion + AI (esistente, da modificare per scrivere su Supabase)
  - 4 workflow KB (esistenti, indipendenti — `/webhook/kb/*` — NON toccare)
  - Workflow analytics schedulato (esistente, da modificare per scrivere su `analytics_daily` Supabase)
- **Credenziali n8n già configurate:**
  - OpenAI: `ban0bSnAtf1pvCgV`
  - Gmail OAuth2: `X1u67BUoZDbc4qau`
  - Google Sheets OAuth2: `zr5BaMYSNlfECQZg` (non più necessaria dopo migrazione)
- **API key statica per webhook:** `fk-kb-api-2026` (header `X-API-Key`)

---

## FILE DI RIFERIMENTO PERMANENTI

- **Piano completo:** `/Users/daniele/.claude/plans/includi-nel-piano-completo-zazzy-planet.md`
- **Memoria progetto:** `/Users/daniele/.claude/projects/-Users-daniele-Desktop-Claude-Filtro-K/memory/project_filtro_k.md`
- **Design system completo:** `/Users/daniele/Desktop/Claude/Filtro K/DESIGN.md`
- **Requisiti progetto:** `/Users/daniele/Desktop/Claude/Filtro K/PRODUCT.md`
- **Standard operativo n8n:** `/Users/daniele/CLAUDE.md`

---

## COME AVVIARE LA PROSSIMA CHAT

Prompt suggerito da copiare:

> Leggi `HANDOFF.md` nel root del progetto Filtro K. Poi leggi il piano in `/Users/daniele/.claude/plans/includi-nel-piano-completo-zazzy-planet.md`. Riprendi dal "PROSSIMO STEP" indicato in HANDOFF.md (implementazione pagina Escalation).
