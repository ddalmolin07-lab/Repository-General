-- ============================================================
-- Filtro K — Schema Supabase
-- Eseguire prima su TEST (txblvjxhubtjgtfblgdv), poi su PROD
-- ============================================================

-- ------------------------------------------------------------
-- email_requests — modello "Message-ID + scrittori autorizzati"
-- id = Message-ID Gmail (TEXT). Scritture solo da n8n (service_role)
-- o via Postgres function SECURITY DEFINER (claim_request).
-- ------------------------------------------------------------

DROP TABLE IF EXISTS email_requests CASCADE;

CREATE TABLE email_requests (
  id TEXT PRIMARY KEY,                    -- Message-ID Gmail
  timestamp_arrivo TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mittente_email TEXT NOT NULL,
  oggetto_email TEXT NOT NULL,
  testo_email TEXT NOT NULL,
  stato TEXT NOT NULL CHECK (stato IN (
    'risolta_ai','in_attesa_addetto','presa_in_carico','risolta_addetto','errore'
  )),
  timestamp_risolto TIMESTAMPTZ,
  risposta_inviata TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- analytics_daily / app_settings (invariate)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL UNIQUE,
  totale_richieste INTEGER DEFAULT 0,
  ai_handled INTEGER DEFAULT 0,
  escalated INTEGER DEFAULT 0,
  tempo_medio_risposta_h NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nome TEXT,
  notifiche_email BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TRIGGER updated_at automatico
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_email_requests_updated_at ON email_requests;
CREATE TRIGGER trg_email_requests_updated_at
  BEFORE UPDATE ON email_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_app_settings_updated_at ON app_settings;
CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- Postgres function claim_request
-- Unico canale autorizzato per la transizione
-- in_attesa_addetto -> presa_in_carico dalla dashboard.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION claim_request(p_id TEXT)
RETURNS email_requests
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE email_requests
     SET stato = 'presa_in_carico'
   WHERE id = p_id
     AND stato = 'in_attesa_addetto'
  RETURNING *;
$$;

REVOKE ALL ON FUNCTION claim_request(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_request(TEXT) TO authenticated;

-- ------------------------------------------------------------
-- RLS (Row Level Security)
-- email_requests: SELECT per authenticated, nessun UPDATE diretto.
-- Le scritture passano solo da service_role (n8n) o da claim_request.
-- ------------------------------------------------------------

ALTER TABLE email_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_requests" ON email_requests;
CREATE POLICY "auth_read_requests" ON email_requests
  FOR SELECT TO authenticated USING (true);

-- Policy UPDATE per client authenticated rimossa: niente UPDATE liberi dal client.

DROP POLICY IF EXISTS "auth_read_analytics" ON analytics_daily;
CREATE POLICY "auth_read_analytics" ON analytics_daily
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "users_own_settings" ON app_settings;
CREATE POLICY "users_own_settings" ON app_settings
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- STORAGE BUCKET (allegati email — uso futuro)
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('email-attachments', 'email-attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "auth_read_attachments" ON storage.objects;
CREATE POLICY "auth_read_attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'email-attachments');

-- ------------------------------------------------------------
-- INDICI (performance)
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_email_requests_stato
  ON email_requests(stato);

CREATE INDEX IF NOT EXISTS idx_email_requests_timestamp_arrivo
  ON email_requests(timestamp_arrivo DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_data
  ON analytics_daily(data DESC);

-- ------------------------------------------------------------
-- DATI DI TEST (solo TEST — rimuovere prima di PROD)
-- ------------------------------------------------------------

INSERT INTO email_requests (id, mittente_email, oggetto_email, testo_email, stato)
VALUES
  ('<seed-001@test.local>', 'mario.rossi@email.com',  'Problema con il filtro modello X200',
   'Buongiorno, ho acquistato il filtro X200 tre settimane fa e continua a perdere da un lato. Ho già cambiato la guarnizione ma il problema persiste. Potete aiutarmi?',
   'in_attesa_addetto'),
  ('<seed-002@test.local>', 'giulia.bianchi@gmail.com', 'Compatibilità filtro con cappa Elica',
   'Salve, vorrei sapere se il vostro filtro universale è compatibile con la mia cappa Elica modello BELT 60. Grazie',
   'presa_in_carico'),
  ('<seed-003@test.local>', 'luca.verdi@hotmail.com', 'Ordine #4521 — spedizione non ricevuta',
   'Ho effettuato un ordine il 12 maggio ma il corriere dice che il pacco è fermo in magazzino da 4 giorni. Potete verificare?',
   'in_attesa_addetto')
ON CONFLICT (id) DO NOTHING;

INSERT INTO analytics_daily (data, totale_richieste, ai_handled, escalated, tempo_medio_risposta_h)
VALUES
  (CURRENT_DATE - 13, 8, 6, 2, 1.5),
  (CURRENT_DATE - 12, 12, 10, 2, 1.2),
  (CURRENT_DATE - 11, 7, 5, 2, 2.1),
  (CURRENT_DATE - 10, 15, 12, 3, 0.9),
  (CURRENT_DATE - 9, 9, 8, 1, 1.8),
  (CURRENT_DATE - 8, 11, 9, 2, 1.4),
  (CURRENT_DATE - 7, 14, 11, 3, 1.1),
  (CURRENT_DATE - 6, 6, 5, 1, 2.3),
  (CURRENT_DATE - 5, 18, 15, 3, 0.8),
  (CURRENT_DATE - 4, 10, 8, 2, 1.6),
  (CURRENT_DATE - 3, 13, 11, 2, 1.3),
  (CURRENT_DATE - 2, 16, 13, 3, 1.0),
  (CURRENT_DATE - 1, 9, 7, 2, 1.9),
  (CURRENT_DATE,     4, 3, 1, 0.7)
ON CONFLICT (data) DO NOTHING;
