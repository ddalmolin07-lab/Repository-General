# Filtro K — Stato Progetto

> Snapshot al **2026-05-22**. Documento di contesto generale: cosa è fatto, cosa è deciso ma da fare, cosa è da decidere, cosa è da migliorare.
>
> Fonti: memory `~/.claude/projects/-Users-daniele-Desktop-Claude-Filtro-K/memory/*`, git log `main`, codice `dashboard/`, workflow n8n istanza `daniele1323.app.n8n.cloud`.

---

## 0. Inquadramento

**Cos'è:** dashboard web per l'addetto vendite di **Filtro Cappa**. Gestisce le escalation di un workflow n8n che risponde automaticamente alle email via Q&A; le domande fuori KB vengono inoltrate all'addetto.

**Architettura attuale (TEST):**
- **Ingest email** → workflow n8n `Definitivo Filtro Cappa_Supabase` (`AK1TBv9sw4twK8NO`) → Gmail trigger → KB lookup → branch AI/Escalated → INSERT in `email_requests` (Supabase TEST `txblvjxhubtjgtfblgdv`).
- **Dashboard React** (Vite + Tailwind) → legge `email_requests`, `kb_faq`, `analytics_daily` via Supabase JS, login Supabase Auth reale. Reply va a webhook n8n `Dashboard - Reply - Webhook_supabase` (`8cwIL3cZYk9fWsfS`).
- **Modello dati semplificato Message-ID:** `email_requests.id TEXT = Gmail internal ID`, 5 stati (`risolta_ai`, `in_attesa_addetto`, `presa_in_carico`, `risolta_addetto`, `errore`). Functions Postgres `claim_request`, `send_reply`, `mark_reply_error` con `SECURITY DEFINER` come scrittori autorizzati.
- **PROD:** vuoto, fuori scope. Tutto su TEST.

**Stack:** React + Tailwind, Supabase (Postgres + Auth + RLS), n8n cloud, Gmail OAuth2, OpenAI gpt-4o-mini.

---

## 1. ✅ FATTO (decise e completate)

### 1.1 Backend & dati
- **Schema Supabase TEST** completo: `email_requests` (Message-ID model), `kb_faq` (con `parole_chiave[3]`, senza `stato`), `analytics_daily`.
- **Postgres functions** `claim_request`, `send_reply`, `mark_reply_error` — testate con guard atomici e idempotenza.
- **RLS** abilitata su tutte le tabelle, policy `authenticated`-only.
- **Auth Supabase reale** su TEST (account `test@filtrok.local`). Pattern SQL per replicare l'account su PROD documentato.

### 1.2 Workflow n8n migrati a Supabase
| Workflow | ID | Stato |
|---|---|---|
| Definitivo Filtro Cappa_Supabase (main email) | `AK1TBv9sw4twK8NO` | migrato + Fase A verifica OK |
| Dashboard - Reply - Webhook_supabase | `8cwIL3cZYk9fWsfS` | **active**, testato live |
| KB - Leggi/Aggiungi/Modifica/Elimina FAQ _supabase | `hC2atTQc... / XVx8FY... / TwHwzY... / Vwn0SI...` | Fase C verifica OK |

### 1.3 Verifica end-to-end TEST
- **Fase A — Ingest** (5 scenari A1-A5): tutti ✅, 4 bug scoperti e risolti, hardening order Log→Gmail send applicato.
- **Fase B — Reply avversi** (7 scenari): 200/401/404/409/500 mappati correttamente, 2 bug risolti (JSON 409 + onError Valida Input).
- **Fase C — KB webhook** (6 scenari C1-C6): tutti ✅ tranne C5 (UUID inesistente → 200 empty, fragile non rotto).

### 1.4 Dashboard React (su `main`, commit `04d0ade`)
- **Login** — Supabase Auth reale, design split 50/50 con scanner 3D blended.
- **Escalation** (`/`) — lista + claim + reply, integrata con `claim_request` rpc.
- **KB** (`/kb`) — CRUD FAQ con `parole_chiave`, ricerca full-text, chip categoria.
- **Storico** (`/storico`) — WIP non ancora committato (toolbar + tabella espandibile, già nel working tree).
- **Design system definitivo** in `DESIGN.md` (Urbanist, palette indigo `#5975D6`, card opache, noise overlay, cursor spotlight).

---

## 2. 🔄 DECISE E DA FARE (priorità ordinata)

### 2.1 Pagine dashboard residue
| Priorità | Pagina | Stato | Note |
|---|---|---|---|
| ALTA | **Storico** `/storico` | WIP nel working tree, da finire e committare | mockup `dashboard-storico.html` |
| MEDIA | **Analytics** `/analytics` | placeholder ("in costruzione") | dati pronti in `analytics_daily`, mockup `dashboard-analytics.html` |
| MEDIA | **Impostazioni** `/impostazioni` | placeholder | mockup `settings-full.html` (1315 righe) |

**Approccio approvato:** "fedele allo spirito non al pixel" — mantenere contenuti e gerarchia dei mockup, ma stile coerente con Escalation/KB già fatte.

### 2.2 Cleanup pre-PROD
- **Disabilitare/nascondere `/signup`** prima del go-live (chiunque può registrarsi oggi).
- **Disattivare workflow originali Sheets** (`yVLhUgHM3Mf5ykmP`, `C3XGpS0Dg0FuvK2m`, ecc.) una volta confermati i `_supabase`.
- **Service_role secret** Supabase: l'utente deve rigenerarlo (è stato condiviso in chat il 2026-05-20).

### 2.3 Promozione PROD (quando TEST è stabile)
1. Replicare schema Supabase TEST su PROD.
2. Creare account auth via pattern SQL documentato (email/password definitive cliente).
3. Aggiornare `.env.production` con URL+anon key di PROD.
4. Duplicare workflow `_supabase` da TEST a PROD (cambiare credenziale Supabase n8n).
5. Eseguire regression test (A1+B1+C1 minimum) prima di switch DNS.

---

## 3. ❓ DA DECIDERE

### 3.1 Prodotto
- **AI confidence threshold (#9 criticità storica).** Oggi "answer-friendly": l'AI risponde anche su domande borderline (es. "tempo consegna Sicilia" → generico 2-3gg). Decidere se rendere più conservativo (escalation forzata su confidence bassa) o lasciare così.
- **Signup page**: rimuovere del tutto o nascondere con feature flag?

### 3.2 Architettura — temi rinviati dal piano "ambizioso" (vedi `project_filtro_k_dashboard_reply_flow.md`)
Furono pianificati con schema `threads/messages/escalations/metrics_daily/message_refs` + Edge Function proxy + Realtime. È stato sostituito con il modello semplificato Message-ID. **Decidere se mai recuperare** uno o più di questi temi:
- **Threading conversazione** (follow-up multipli cliente↔addetto su stesso thread Gmail).
- **Realtime Supabase** sulla dashboard (oggi polling/refresh manuale).
- **Audit trail** (chi ha cambiato cosa quando, diff vs AI draft).
- **Multi-addetto** (oggi single-account model).
- **Retention "Lean Forensics"** (7gg full → 90gg hash → delete + `message_refs`).
- **Edge Function idempotency-key proxy** vs attuale chiamata diretta da dashboard a webhook n8n con API key.

### 3.3 Migrazione legacy
- **Workflow analytics cron** (Fase 2a del piano migrazione Supabase): mai migrato. Sostituibile con singola query SQL aggregata. **Da pianificare** o lasciare il vecchio cron Sheets?

---

## 4. 🛠 DA MIGLIORARE (debiti tecnici / hardening)

### 4.1 Sicurezza & robustezza
- **API key dashboard→n8n (`fk-kb-api-2026`) nel bundle.** Statica, esposta lato client. Mitigazione futura: Edge Function proxy (vedi §3.2).
- **C5 — UUID inesistente su KB update/delete restituisce 200 empty.** Aggiungere Code node post-Supabase con respond 404 esplicito.
- **B7 — `mark_reply_error` esposizione stato.** Oggi `"{{ $json.stato }}"` stringificato funziona ma fragile; migrare a pattern `JSON.stringify` lato n8n.

### 4.2 UX dashboard
- **No realtime**: nuove escalation non appaiono senza refresh. (Realtime Supabase pianificato ma rinviato).
- **No badge contatore live** sull'icona Escalation in sidebar.
- **Search/filtri Storico**: la WIP attuale ha toolbar ma da validare visivamente.

### 4.3 Workflow n8n
- **Subject fallback `[RICHIESTA CLIENTE] (senza oggetto)`** quando subject entrante è vuoto (oggi diventa solo `[RICHIESTA CLIENTE]`).
- **Loop guard Gmail trigger** già fix con label `FiltroK-Processed`, ma documentare nel runbook per evitare regressioni a future modifiche.
- **`message_refs` hedge table** non implementata — futura KB ricostruibile da Gmail API è bloccata se non si inizia a salvare almeno `{message_id, thread_id, sent_at}`.

### 4.4 Test e regression
- **App.test.jsx fallisce** preesistente per env `VITE_SUPABASE_URL` mancante nei test → fix env mock di test.
- **Nessuna regression suite automatica** sui workflow n8n: ogni modifica richiede rifare A1+B1+C1 a mano. Valutare workflow di test sintetici schedulati.

---

## 5. Riferimenti

### Memory (auto-loaded)
- `project_filtro_k.md` — contesto generale, design system
- `project_filtro_k_migrazione_supabase.md` — piano migrazione Sheets→Supabase
- `project_filtro_k_messageid_migration.md` — modello Message-ID (Fasi 1-5)
- `project_filtro_k_verification_plan.md` — Fasi A+B+C verifica
- `project_filtro_k_dashboard_reply_flow.md` — piano "ambizioso" rinviato
- `project_filtro_k_dashboard_auth.md` — auth Supabase single-account
- `project_filtro_k_kb_redesign.md` — KB semplificata 2026-05-21
- `project_filtro_k_login.md` — design login definitivo
- `project_filtro_k_pages_roadmap.md` — stato pagine dashboard

### File chiave nel repo
- `dashboard/src/api/client.js` — wrapper Supabase + webhook n8n
- `dashboard/src/lib/authMock.js` — wrapper auth (nome legacy, è reale)
- `docs/supabase_schema.sql` — schema canonico
- `workflows/*_supabase.json` — backup workflow n8n migrati
- `DESIGN.md` — design system
- `.superpowers/brainstorm/.../content/*.html` — mockup HTML di riferimento

### Istanza n8n
- URL: `https://daniele1323.app.n8n.cloud`
- MCP config: `/Users/daniele/Desktop/Claude/n8n/.mcp.json`
- Credenziali configurate: OpenAI, Gmail OAuth2, Google Sheets OAuth2, Supabase service_role
