# CHAT 2 — Nuovo Workflow n8n: Analytics Giornaliere

## Contesto
Progetto "Filtro K" per Filtro Cappa. Workflow n8n esistente che gestisce email clienti e logga ogni richiesta su Google Sheets.

**Obiettivo di questa chat:** creare un nuovo workflow n8n separato, schedulato ogni sera, che legge le richieste del giorno dal tab `requests` e scrive un aggregato giornaliero nel tab `analytics_daily`.

---

## Google Sheets — Database

- **Document ID:** `1NhXPI3Prqu3bmMERZGuUaPSdTupSZroAOR1AUji2k30`
- **Credenziale n8n da usare:** Google Sheets OAuth2, ID `zr5BaMYSNlfECQZg`, nome "Google Sheets OAuth2 API"

### Tab `requests` (lettura) — colonne:
`id | timestamp_arrivo | mittente_email | oggetto_email | testo_email | tipo | stato | timestamp_risolto | risposta_inviata | secondo_contatto`

- `tipo` può essere: `ai_handled` o `escalated`
- `stato` può essere: `risolto`, `in_attesa`, `in_lavorazione`
- `timestamp_arrivo` e `timestamp_risolto` sono in formato ISO (es. `2026-04-30T14:23:00.000Z`)

### Tab `analytics_daily` (scrittura) — colonne:
`data | totale_richieste | ai_handled | escalated | tempo_medio_risposta_h`

- `data`: formato `YYYY-MM-DD`
- `tempo_medio_risposta_h`: media ore tra `timestamp_arrivo` e `timestamp_risolto` per le righe `tipo=escalated` e `stato=risolto` del giorno. Se nessuna escalation risolta → `0`

---

## Logica del workflow

1. **Schedule Trigger** — ogni giorno alle 23:30
2. **Leggi tutte le righe** da `requests`
3. **Filtra** le righe il cui `timestamp_arrivo` è nella data di oggi (confronto solo sulla data, non l'ora)
4. **Calcola in un Code node:**
   - `totale_richieste`: count totale righe del giorno
   - `ai_handled`: count righe con `tipo === 'ai_handled'`
   - `escalated`: count righe con `tipo === 'escalated'`
   - `tempo_medio_risposta_h`: media delle ore di risposta per le escalation risolte oggi (quelle con `tipo === 'escalated'` e `stato === 'risolto'` e `timestamp_risolto` presente). Se nessuna → `0`
5. **Scrivi una riga** su `analytics_daily` con i valori calcolati

---

## Credenziali disponibili
- Google Sheets OAuth2: ID `zr5BaMYSNlfECQZg`, nome "Google Sheets OAuth2 API"

---

## Output atteso

Un JSON n8n completo del nuovo workflow, pronto da importare. Nome del workflow: `Sistema - Calcola Analytics Giornaliere - Cron`.

Salvalo come file nella cartella `/Users/daniele/Desktop/Claude/Filtro K/workflows/`.
