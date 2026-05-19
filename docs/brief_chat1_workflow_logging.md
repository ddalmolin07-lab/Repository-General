# CHAT 1 — Modifica Workflow n8n: Aggiunta Logging su Google Sheets

## Contesto
Progetto "Filtro K" per Filtro Cappa. Workflow n8n esistente che gestisce email clienti: risponde automaticamente da knowledge base oppure escala all'addetto umano.

**Obiettivo di questa chat:** aggiungere due nodi Google Sheets al workflow esistente per loggare ogni richiesta sul tab `requests` del documento di database.

---

## Google Sheets — Database

- **Document ID:** `1NhXPI3Prqu3bmMERZGuUaPSdTupSZroAOR1AUji2k30`
- **Tab da usare:** `requests`
- **Credenziale n8n da usare:** Google Sheets OAuth2, ID `zr5BaMYSNlfECQZg`, nome "Google Sheets OAuth2 API"

**Colonne del tab `requests` (in ordine):**
`id | timestamp_arrivo | mittente_email | oggetto_email | testo_email | tipo | stato | timestamp_risolto | risposta_inviata | secondo_contatto`

---

## Cosa fare

Aggiungere **due nodi `googleSheets` (operation: appendOrUpdate / append row)** al workflow esistente:

### Nodo 1 — Log AI Handled
- **Nome:** `Log Richiesta AI Handled`
- **Si collega dopo:** nodo `Send a message1` (branch TRUE di `Risposta Disponibile?`)
- **Valori da scrivere:**

| Colonna | Valore |
|---------|--------|
| id | `={{ $now.toMillis() + '-' + $('Prepara Dati Email').item.json.sender.replace(/[^a-z0-9]/gi, '') }}` |
| timestamp_arrivo | `={{ $('Prepara Dati Email').item.json.timestamp ?? $now.toISO() }}` |
| mittente_email | `={{ $('Prepara Dati Email').item.json.sender }}` |
| oggetto_email | `={{ $('Prepara Dati Email').item.json.subject }}` |
| testo_email | `={{ $('Prepara Dati Email').item.json.body }}` |
| tipo | `ai_handled` |
| stato | `risolto` |
| timestamp_risolto | `={{ $now.toISO() }}` |
| risposta_inviata | `={{ $('Parsa e Valida JSON AI').item.json.response_text }}` |
| secondo_contatto | `false` |

### Nodo 2 — Log Escalated
- **Nome:** `Log Richiesta Escalated`
- **Si collega dopo:** nodo `Invia Gmail Interna ad Addetto` (fine branch FALSE di `Risposta Disponibile?`)
- **Valori da scrivere:**

| Colonna | Valore |
|---------|--------|
| id | `={{ $now.toMillis() + '-' + $('Prepara Dati Email').item.json.sender.replace(/[^a-z0-9]/gi, '') }}` |
| timestamp_arrivo | `={{ $('Prepara Dati Email').item.json.timestamp ?? $now.toISO() }}` |
| mittente_email | `={{ $('Prepara Dati Email').item.json.sender }}` |
| oggetto_email | `={{ $('Prepara Dati Email').item.json.subject }}` |
| testo_email | `={{ $('Prepara Dati Email').item.json.body }}` |
| tipo | `escalated` |
| stato | `in_attesa` |
| timestamp_risolto | *(vuoto)* |
| risposta_inviata | *(vuoto)* |
| secondo_contatto | `false` |

---

## JSON del branch esistente (da modificare)

```json
{
  "nodes": [
    {
      "parameters": {
        "promptType": "define",
        "text": "=Sei un assistente clienti cordiale e professionale. Rispondi alle richieste dei clienti basandoti esclusivamente sui contenuti della knowledge base fornita.\n\nREGOLE:\n1. Usa SOLO informazioni presenti nei documenti — non inventare, non dedurre\n2. Se la risposta non è presente → has_answer: false\n3. Se è solo parziale o incerta → has_answer: false\n4. Quando has_answer è true: scrivi una risposta completa, calda e naturale — come se stessi parlando direttamente con il cliente. Inizia salutando, fornisci tutte le informazioni utili, concludi con disponibilità a ulteriori domande.\n\nFORMATO OUTPUT OBBLIGATORIO — solo JSON valido, senza testo aggiuntivo:\n\n{\n  \"has_answer\": true,\n  \"response_text\": \"risposta completa, cordiale e ben strutturata per il cliente\",\n  \"summary\": \"max 4 parole\"\n}\n\nSe has_answer è false:\n{\n  \"has_answer\": false,\n  \"response_text\": \"\",\n  \"summary\": \"max 4 parole\"\n}\n\n--- KNOWLEDGE BASE ---\n{{ $json.docs_text }}\n\n{{ $json.sheets_kb ? '--- FAQ ---\\n' + $json.sheets_kb : '' }}\n\n--- RICHIESTA CLIENTE ---\nOggetto: {{ $('Prepara Dati Email').item.json.subject }}\nTesto: {{ $('Prepara Dati Email').item.json.body }}",
        "batching": {}
      },
      "id": "85360cf0-4f89-49de-be72-bfe600dfa2df",
      "name": "Genera Risposta da KB",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.9,
      "position": [-1136, 1008]
    },
    {
      "parameters": {
        "model": { "__rl": true, "mode": "id", "value": "gpt-4o-mini" },
        "builtInTools": {}, "options": {}
      },
      "id": "4e30d5d2-bfa2-422b-afbe-466ebcb4a8ca",
      "name": "OpenAI - Genera KB",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [-1136, 1184],
      "credentials": { "openAiApi": { "id": "ban0bSnAtf1pvCgV", "name": "OpenAI account" } }
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "let parsed;\ntry {\n  const raw = $json.text || $json.output || '';\n  const match = raw.match(/\\{[\\s\\S]*\\}/);\n  parsed = JSON.parse(match ? match[0] : raw);\n} catch (e) {\n  parsed = { has_answer: false, response_text: '', summary: 'Errore parsing risposta AI' };\n}\n\nreturn { json: {\n  has_answer: parsed.has_answer === true,\n  response_text: parsed.response_text || '',\n  summary: parsed.summary || ''\n} };"
      },
      "id": "ff727eff-fb89-41ce-ac57-b665a6b56b19",
      "name": "Parsa e Valida JSON AI",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-688, 1008]
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 3 },
          "conditions": [{ "id": "c06", "leftValue": "={{ $json.has_answer }}", "operator": { "type": "boolean", "operation": "true", "singleValue": true } }],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "0a3e6839-8c83-4bd9-a3c4-a0d14dad4ac7",
      "name": "Risposta Disponibile?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.3,
      "position": [-416, 1008]
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=Sei un assistente clienti cordiale e professionale.\n\nIl tuo compito è inviare una conferma di presa in carico della richiesta del cliente.\n\nREGOLE:\n- NON spiegare che non sei riuscito a rispondere\n- NON menzionare AI, documenti, sistemi o processi interni\n- Comunica che la richiesta è stata ricevuta e verrà gestita dal team\n- Tono: caldo, rassicurante, professionale\n- Messaggio: 2-3 frasi complete e naturali\n\nSTRUTTURA MESSAGGIO:\n- Frase 1: conferma ricezione della richiesta (puoi riprendere brevemente l'argomento)\n- Frase 2: rassicurazione sulla presa in carico da parte del team\n- Frase 3 (opzionale): tempi indicativi o disponibilità a ulteriori domande\n\nOUTPUT OBBLIGATORIO - rispetta esattamente questo formato, nessun testo extra:\nOggetto: [oggetto breve e pertinente, max 8 parole]\n\n[messaggio completo per il cliente]\n\nOggetto email ricevuta: {{ $('Prepara Dati Email').item.json.subject }}",
        "batching": {}
      },
      "id": "0751fcd8-af9a-4c35-a392-3d1c508e818b",
      "name": "Genera Email Presa in Carico",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.9,
      "position": [-144, 1136]
    },
    {
      "parameters": {
        "model": { "__rl": true, "mode": "id", "value": "gpt-4o-mini" },
        "builtInTools": {}, "options": {}
      },
      "id": "3d83787a-8d51-4b75-8e59-0ead2bf3a0c0",
      "name": "OpenAI - Presa in Carico",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1.3,
      "position": [-144, 1312],
      "credentials": { "openAiApi": { "id": "ban0bSnAtf1pvCgV", "name": "OpenAI account" } }
    },
    {
      "parameters": {
        "sendTo": "d.dalmolin07@gmail.com",
        "subject": "={{ '[RICHIESTA CLIENTE] ' + $('Prepara Dati Email').item.json.subject }}",
        "emailType": "text",
        "message": "={{ 'Mittente: ' + $('Prepara Dati Email').item.json.sender + '\\n\\nOggetto: ' + $('Prepara Dati Email').item.json.subject + '\\n\\nRichiesta:\\n' + $('Prepara Dati Email').item.json.body + '\\n\\n---\\nSintesi AI: ' + $('Parsa e Valida JSON AI').item.json.summary }}",
        "options": {}
      },
      "id": "341fd202-1c5a-4318-8181-1287034ee9b8",
      "name": "Invia Gmail Interna ad Addetto",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.2,
      "position": [640, 1136],
      "webhookId": "ac0ccbbe-8559-4f69-9e3c-008731336791",
      "credentials": { "gmailOAuth2": { "id": "X1u67BUoZDbc4qau", "name": "Gmail OAuth2 API" } },
      "continueOnFail": true
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const items = $input.all();\nif (!items || items.length === 0) {\n  return [{ json: { testo: 'Nessun dato trovato nel foglio.' } }];\n}\nconst colonne = Object.keys(items[0].json);\nconst righe = items.map((item, index) => {\n  const campi = colonne.map(col => `  - ${col}: ${item.json[col] ?? 'N/A'}`).join('\\n');\n  return `Riga ${index + 1}:\\n${campi}`;\n});\nconst testo = righe.join('\\n\\n');\nreturn [{ json: { testo, totale_righe: items.length } }];"
      },
      "id": "16827f79-af5b-4811-895b-abd01920821d",
      "name": "Estrai Testo da Google Docs",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [-1408, 1008]
    },
    {
      "parameters": {
        "sendTo": "={{ $('Ascolta Nuove Email Gmail').item.json.From }}",
        "subject": "={{ $('Parsa e Valida JSON AI').item.json.summary }}",
        "emailType": "text",
        "message": "={{ $('Parsa e Valida JSON AI').item.json.response_text }}",
        "options": {}
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.2,
      "position": [-144, 864],
      "id": "e6c60cac-f826-4880-bc8d-c48e4fb0315c",
      "name": "Send a message1",
      "webhookId": "107f98a0-5d5e-4c08-a31f-be793ee01287",
      "credentials": { "gmailOAuth2": { "id": "X1u67BUoZDbc4qau", "name": "Gmail OAuth2 API" } }
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const raw = ($json.text != null) ? String($json.text) : '';\nconst matchDouble = raw.match(/^Oggetto:\\s*(.+?)\\n\\n([\\s\\S]*)$/);\nconst matchSingle = raw.match(/^Oggetto:\\s*(.+?)\\n([\\s\\S]*)$/);\nlet subject, body;\nif (matchDouble) {\n  subject = (matchDouble[1] || '').trim();\n  body = (matchDouble[2] || '').trim();\n} else if (matchSingle) {\n  subject = (matchSingle[1] || '').trim();\n  body = (matchSingle[2] || '').trim();\n} else {\n  subject = 'Re: ' + (($('Prepara Dati Email').item.json.subject) || '');\n  body = raw.trim();\n}\nreturn { json: { email_subject: subject, email_body: body } };"
      },
      "id": "c7d8e9f0-a1b2-4c3d-8e4f-5a6b7c8d9e0f",
      "name": "Parsa Oggetto e Corpo Email Presa in Carico",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [224, 1136]
    },
    {
      "parameters": {
        "sendTo": "={{ $('Ascolta Nuove Email Gmail').item.json.From }}",
        "subject": "={{ $json.email_subject }}",
        "emailType": "text",
        "message": "={{ $json.email_body }}",
        "options": {}
      },
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.2,
      "position": [448, 1136],
      "id": "f62220d7-f468-4af5-8aab-0c2c8e1710d5",
      "name": "Presa in carico cliente",
      "webhookId": "107f98a0-5d5e-4c08-a31f-be793ee01287",
      "credentials": { "gmailOAuth2": { "id": "X1u67BUoZDbc4qau", "name": "Gmail OAuth2 API" } }
    },
    {
      "parameters": {
        "documentId": {
          "__rl": true,
          "value": "1w80b1u9P7bpq1AqcCiEskE-4hEJCRf2ilJdcxKAIBMc",
          "mode": "list",
          "cachedResultName": "Q&A Filtro Cappa ",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1w80b1u9P7bpq1AqcCiEskE-4hEJCRf2ilJdcxKAIBMc/edit?usp=drivesdk"
        },
        "sheetName": {
          "__rl": true, "value": "gid=0", "mode": "list",
          "cachedResultName": "Foglio1",
          "cachedResultUrl": "https://docs.google.com/spreadsheets/d/1w80b1u9P7bpq1AqcCiEskE-4hEJCRf2ilJdcxKAIBMc/edit#gid=0"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.7,
      "position": [-1616, 1008],
      "id": "e69f4bd4-b086-47a2-b431-2070aeb8f90a",
      "name": "Get row(s) in sheet",
      "credentials": { "googleSheetsOAuth2Api": { "id": "zr5BaMYSNlfECQZg", "name": "Google Sheets OAuth2 API" } }
    }
  ],
  "connections": {
    "Genera Risposta da KB": { "main": [[{ "node": "Parsa e Valida JSON AI", "type": "main", "index": 0 }]] },
    "OpenAI - Genera KB": { "ai_languageModel": [[{ "node": "Genera Risposta da KB", "type": "ai_languageModel", "index": 0 }]] },
    "Parsa e Valida JSON AI": { "main": [[{ "node": "Risposta Disponibile?", "type": "main", "index": 0 }]] },
    "Risposta Disponibile?": { "main": [[{ "node": "Send a message1", "type": "main", "index": 0 }], [{ "node": "Genera Email Presa in Carico", "type": "main", "index": 0 }]] },
    "Genera Email Presa in Carico": { "main": [[{ "node": "Parsa Oggetto e Corpo Email Presa in Carico", "type": "main", "index": 0 }]] },
    "OpenAI - Presa in Carico": { "ai_languageModel": [[{ "node": "Genera Email Presa in Carico", "type": "ai_languageModel", "index": 0 }]] },
    "Estrai Testo da Google Docs": { "main": [[{ "node": "Genera Risposta da KB", "type": "main", "index": 0 }]] },
    "Parsa Oggetto e Corpo Email Presa in Carico": { "main": [[{ "node": "Presa in carico cliente", "type": "main", "index": 0 }]] },
    "Presa in carico cliente": { "main": [[{ "node": "Invia Gmail Interna ad Addetto", "type": "main", "index": 0 }]] },
    "Get row(s) in sheet": { "main": [[{ "node": "Estrai Testo da Google Docs", "type": "main", "index": 0 }]] }
  }
}
```

---

## Output atteso

Un JSON n8n completo del branch modificato con i due nodi di logging aggiunti e correttamente collegati. Salvalo come file nella cartella `/Users/daniele/Desktop/Claude/Filtro K/workflows/`.
