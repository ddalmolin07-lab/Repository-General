# Filtro K — Dashboard Assistente Vendite
**Cliente:** Filtro Cappa
**Data inizio:** 2026-04-30
**Stato:** In progettazione

---

## Contesto

Il cliente ha un workflow n8n attivo che gestisce la prima assistenza email:
- Risponde automaticamente tramite Q&A
- Traccia pacchi
- Escala all'addetto le domande che non sa gestire

Questo progetto aggiunge una **dashboard web** per l'addetto alle vendite che gestisce le escalation.

---

## Funzionalità Definite

### 1. Inbox Escalation (CORE)
- Lista domande escalate in attesa con: mittente, data/ora arrivo, anteprima testo
- Vista dettaglio email originale completa
- Campo risposta con **bozza suggerita da LLM** (modificabile/accettabile)
- Stati: `in_attesa` → `in_lavorazione` → `risolto`
- Invio risposta direttamente dalla dashboard (n8n gestisce l'invio email)

### 2. Semaforo Urgenza
Basato su **ore lavorative** (Lun-Ven 9:00-18:00, orario da confermare con Filtro Cappa):

| Stato | Soglia | Colore |
|-------|--------|--------|
| Fresca | 0 – 2h lavorative | Verde |
| Media | 2 – 8h lavorative | Arancione |
| Vecchia | > 8h lavorative | Rosso |
| Secondo contatto | Stesso mittente riscrive entro 8h da richiesta aperta | Rosso immediato |

**Regole secondo contatto:**
- Si tiene traccia del mittente per 8 ore lavorative dalla prima richiesta aperta
- Se lo stesso mittente riscrive prima che la richiesta diventi rossa → rosso immediato
- Quando la richiesta viene chiusa/risolta → timer del mittente azzerato, nuova richiesta riparte da zero

### 3. Analytics
- Volume richieste giornaliero/settimanale (grafico)
- Top 5 domande più frequenti
- **Tasso AI vs escalation oggi** (numero prominente in dashboard): quante gestite dall'AI, quante passate all'umano
- Tempo medio di risposta umana
- Andamento mensile (opzionale)

### 4. Gestione Q&A
- Dopo aver risposto a una domanda, bottone "Aggiungi al Q&A"
- Form per normalizzare domanda + risposta
- Arricchisce la knowledge base dell'AI nel tempo

### 5. Storico
- Archivio tutte le conversazioni gestite (AI + umane)
- Ricerca per mittente, parola chiave, data

---

## Funzionalità Escluse (YAGNI)
- Storico per singolo cliente (richiederebbe storage separato per ogni contatto — troppo complesso ora)
- Gestione multi-utente / ruoli (un solo addetto)
- CRM integrato
- Ticketing system complesso

---

## Stack Tecnologico

### Storage: Google Sheets
Scelto per semplicità e integrazione nativa con n8n. Migrazione futura a Supabase possibile con data layer astratto.

**Tab previsti:**
- `requests` — tutte le richieste in ingresso (AI gestite + escalate)
- `qa_base` — knowledge base domande/risposte
- `analytics_cache` — aggregati precalcolati (aggiornati ogni ora da workflow n8n)

### Analytics: Workflow n8n schedulato
Un workflow separato gira ogni ora, legge `requests`, calcola aggregati e sovrascrive `analytics_cache`. Evita query pesanti in tempo reale dalla dashboard.

---

## Architettura del Sistema

```
Email in arrivo (Gmail/SMTP)
  └─→ Workflow n8n esistente (da modificare)
        → AI classifica richiesta
        → [NODO LOG] scrive su tab "requests" con tipo + timestamp
        → biforcazione per tipo:
             ├── ai_handled  → risposta automatica
             ├── tracking    → risposta automatica tracciamento
             └── escalated   → email all'agente + stato "in_attesa"

Dashboard (web app)
  ├── legge "requests" (stato escalated/in_attesa) → Inbox
  ├── legge "analytics_cache" → grafici e KPI
  ├── legge/scrive "qa_base" → gestione Q&A
  └── quando addetto risponde:
        → chiama n8n webhook → n8n invia email + aggiorna riga su Sheets (stato: risolto)

Workflow n8n analytics (nuovo, schedulato ogni ora)
  → legge "requests"
  → calcola aggregati
  → sovrascrive "analytics_cache"
```

---

## Modifica al Workflow n8n Esistente

Il nodo di logging va inserito **dopo la classificazione AI**, prima della biforcazione sui tipi di risposta. Logga tutte le richieste (non solo le escalate) per avere dati completi per le analytics.

Campi da loggare su ogni richiesta:
- `id` — UUID univoco
- `timestamp_arrivo` — datetime ISO
- `mittente_email`
- `oggetto_email`
- `testo_email` (completo)
- `tipo` — `ai_handled` / `tracking` / `escalated`
- `stato` — `risolto` (per ai/tracking) / `in_attesa` (per escalated)
- `timestamp_risolto` — vuoto inizialmente, compilato alla chiusura
- `risposta_inviata` — testo della risposta (se escalated)
- `secondo_contatto` — boolean, true se stesso mittente ha già richiesta aperta

---

## Roadmap Macro

| # | Area | Stato |
|---|------|-------|
| 1 | Google Sheets — struttura tab e colonne | Da fare |
| 2 | Modifica workflow n8n esistente (aggiunta logging) | Da fare |
| 3 | Workflow n8n analytics (nuovo, schedulato) | Da fare |
| 4 | Dashboard frontend (inbox, analytics, Q&A, storico) | Da fare |
| 5 | Deploy | Da fare |

---

## Da Confermare con Cliente

- Orario lavorativo esatto (attualmente ipotizzato Lun-Ven 9:00-18:00)
- Se vogliono notifiche push/email quando arriva una nuova escalation
