-- ============================================================
-- Migrazione KB FAQ: Google Sheets "Q&A Filtro Cappa" -> Supabase kb_faq
-- Generata il 2026-05-19 dal contenuto effettivo del Sheet
-- ============================================================

-- Batch 1 — Righe da conversazioni (con metadata, stato=da_verificare)

INSERT INTO kb_faq (domanda, risposta, categoria, tag, fonte_file, note, stato) VALUES
('Come individuare il codice/modello della cappa per ordinare la scheda di ricambio?',
 'Controlli l''etichetta all''interno della cappa (togliendo i filtri), attaccata alla lamiera: contiene marca, modello e numero di matricola; invii una foto per identificare il ricambio corretto.',
 'Ricambi', ARRAY['etichetta','modello','matricola','foto'], 'file_sconosciuto',
 'Il numero di matricola è necessario per capire quale software monta la scheda.', 'da_verificare'),

('La scheda nuova si accende per un istante e poi si spegne: cosa devo controllare?',
 'Verifichi il flat della tastiera (orientamento e connettore), pulisca la scheda della tastiera da residui grassi o umidità e controlli che la tastiera sia correttamente montata; se persiste il problema può richiedere il reso.',
 'Assistenza tecnica', ARRAY['led','scheda','tastiera','flat','reso'], 'file_sconosciuto', NULL, 'da_verificare'),

('La tastiera deve fare massa sulla carcassa per far funzionare la scheda?',
 'Sì: per alcune versioni la tastiera deve essere montata in modo da fare massa sulla carcassa; se l''involucro è tutto in plastica e non è possibile, questo può impedire il corretto funzionamento.',
 'Installazione', ARRAY['tastiera','massa','installazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso fornire i dati corretti per identificare e ordinare la scheda di ricambio della cappa?',
 'Invii una foto dell''etichetta interna della cappa (dietro i filtri, attaccata alla lamiera) con marca, modello e numero di matricola/serie: il matricola serve per identificare il software della scheda.',
 'Ricambi', ARRAY['ricambio','codice','matricola','etichetta','foto'], 'file_sconosciuto', NULL, 'da_verificare'),

('Dopo aver montato la nuova scheda il LED si accende un istante e poi si spegne: cosa verificare?',
 'Controlli il flat della tastiera (orientamento e connettore ben inserito), pulisca la scheda della tastiera da grasso/umidità e verifichi il corretto montaggio della tastiera; se il problema persiste può essere un guasto preesistente o della vecchia scheda in corto.',
 'Assistenza tecnica', ARRAY['diagnosi','tastiera','flat','installazione'], 'file_sconosciuto',
 'Non è certo se la scheda richieda massa sulla carcassa; il cliente ha detto che l''involucro è plastico, quindi verificare questo aspetto con assistenza.', 'da_verificare'),

('Posso restituire la scheda se non funziona dopo l''installazione?',
 'Sì, è possibile effettuare il reso; contatti l''assistenza per ricevere le istruzioni e le eventuali procedure di ritorno.',
 'Resi e garanzia', ARRAY['reso','garanzia','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso verificare la disponibilità in magazzino di un ricambio (es. motore indicato nel link)?',
 'Verifichiamo la disponibilità sul nostro magazzino e le confermiamo via WhatsApp indicando quantità e tempi di evasione; per accelerare invii il codice articolo o una foto del prodotto.',
 'Ricambi', ARRAY['disponibilità','magazzino','ricambio','codice articolo'], 'file_sconosciuto',
 'Nella conversazione il venditore non ha fornito conferma di disponibilità; risposta proposta come template.', 'da_verificare'),

('Effettuate spedizioni in Moldavia?',
 'Verifichiamo la possibilità di spedizione internazionale e le comunichiamo costi, tempi e eventuali oneri; per quotare ci fornisca indirizzo completo e CAP.',
 'Spedizione', ARRAY['spedizione','internazionale','Moldavia','costi','tempi'], 'file_sconosciuto',
 'Nella conversazione non è stata data una risposta; risposta proposta come procedura standard.', 'da_verificare'),

('Come posso fornire informazioni per identificare il ricambio corretto della cappa se non trovo il codice sulla cappa?',
 'Rimuova i filtri e invii una foto dell''etichetta attaccata alla lamiera interna con marca, modello e numero di serie; se non è disponibile mandi foto della scheda. Il numero di matricola è necessario per identificare il software e il ricambio corretto.',
 'Ricambi', ARRAY['etichetta','numero di matricola','foto','identificazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Ho montato la scheda e all''accensione il LED si accende per un istante e poi si spegne: cosa devo verificare?',
 'Verifichi il flat (connettore rosso) e il suo orientamento, pulisca la scheda della tastiera da grasso/umidità e controlli il corretto collegamento della tastiera; se la tastiera non fa massa sulla carcassa provi comunque questi controlli. Se il problema persiste la scheda può essere restituita, poiché sono testate prima della spedizione.',
 'Assistenza tecnica', ARRAY['LED','tastiera','flat','pulizia','reso'], 'file_sconosciuto',
 'Causa non certa; cliente ha segnalato involucro plastico che impedisce massa della tastiera; offrire reso se non risolto.', 'da_verificare'),

('Come verificare la disponibilità in magazzino di un motore o ricambio indicato tramite link?',
 'Chiedere il codice articolo o il link al cliente; controllare il gestionale/magazzino e rispondere indicando se è disponibile, la quantità pronta e i tempi di evasione.',
 'Ricambi', ARRAY['disponibilità','magazzino','codice_articolo','motore'], 'file_sconosciuto',
 'Nessuna risposta dell''operatore nella conversazione; verificare nel gestionale prima di confermare.', 'da_verificare'),

('Effettuate spedizioni in Moldavia? (variante 2)',
 'Verificare la policy spedizioni internazionali; chiedere indirizzo completo e codice postale e comunicare costi, tempi di consegna e eventuali restrizioni doganali o documenti necessari.',
 'Spedizione', ARRAY['spedizioni','internazionale','Moldavia','costi','tempi'], 'file_sconosciuto',
 'Duplicato di "Effettuate spedizioni in Moldavia?" — risposta alternativa. Nessuna risposta dell''operatore nella conversazione.', 'da_verificare'),

('Come posso trovare il filtro metallico giusto per una cappa Falmec se non conosco il modello?',
 'Inviare foto dell''adesivo e la misura lato x lato del filtro (es. 285 x 300 mm) indicando che le alette sporgenti vanno escluse; con questi dati possiamo indicare il ricambio compatibile.',
 'Compatibilità prodotto', ARRAY['misure','foto','ricerca','Falmec'], 'file_sconosciuto', NULL, 'da_verificare'),

('Posso sostituire il filtro originale con un''alternativa più economica?',
 'Sì: se le dimensioni corrispondono l''alternativa è compatibile; la differenza riguarda solo l''estetica.',
 'Compatibilità prodotto', ARRAY['compatibilità','dimensioni','estetica','risparmio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso ottenere l''unità ventilatore (motore/impeller) di ricambio per una cappa Max Fire?',
 'Prodotto consigliato (motore FIME compatibile): https://www.filtrocappa.it/en/max-fire-motors-and-impellers/1126--fime-motor-ven0097182-850-mch-4-speed-for-cooker-hood-electrolux-maxfire-4055372488.html',
 'Ricambi', ARRAY['motore','ventilatore','ricambio','Max Fire'], 'file_sconosciuto', NULL, 'da_verificare'),

('Dove posso trovare la scheda elettronica (PCB) e la tastiera di controllo per la cappa Max Fire?',
 'Scheda elettronica: https://www.filtrocappa.it/en/max-fire-electronic-boards/2116-electronic-control-unit-for-gpz-motors-for-max-fire-cooker-hood-141301361.html; Tastiera: https://www.filtrocappa.it/it/tastiere-e-slider-max-fire/2117-tastiera-elettronica-per-cappa-max-fire-141301340.html',
 'Ricambi', ARRAY['scheda','PCB','tastiera','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso conoscere il prezzo comprensivo di consegna nel Regno Unito e qual è la politica di reso per i ricambi?',
 'Dettagli su prezzi e metodi di spedizione: https://www.filtrocappa.it/en/content/9-price-and-shipping-methods; Politica resi: https://www.filtrocappa.it/en/content/8-how-to-make-a-return',
 'Ordini', ARRAY['prezzo','spedizione','resi','UK'], 'file_sconosciuto',
 'Il prezzo esatto per l''unità non è stato fornito nella conversazione; verificare il calcolo spedizione per UK sulla pagina dei prezzi.', 'da_verificare'),

('Vendete filtri metallici da 25x30 cm compatibili con cappe Elektron?',
 'Sì, possiamo ordinare filtri metallici 25x30 cm per cappe Elektron; prodotto trovato qui: https://www.filtrocappa.it/it/filtri-metallici-fim/2511-filtro-metallico-alluminio-25-x-30-cm-per-cappe-fim-kappe-k-linea.html',
 'Ricambi', ARRAY['filtri','cappa','25x30','compatibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Qual è il prezzo per singolo filtro e c''è uno sconto per l''ordine di 4 pezzi?',
 'Prezzo indicato in chat: 39€ ciascuno; lo sconto per ordini superiori a 3 pezzi viene applicato automaticamente dal sito.',
 'Pagamenti', ARRAY['prezzo','sconto','quantità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa succede se i filtri non sono immediatamente disponibili?',
 'L''azienda può ordinarli ma possono verificarsi ritardi di produzione; verrete avvisati non appena la merce ordinata arriva.',
 'Ordini', ARRAY['disponibilità','ritardo','notifica'], 'file_sconosciuto', NULL, 'da_verificare'),

('Quali sono i tempi di consegna se un prodotto risulta non disponibile?',
 'Il rifornimento del prodotto è previsto mercoledì.',
 'Spedizione', ARRAY['tempi di consegna','disponibilità','rifornimento'], 'file_sconosciuto',
 'Giorno di rifornimento comunicato dall''operatore nella conversazione per quel prodotto specifico.', 'da_verificare'),

('Come posso trovare il punto di ritiro BRT più vicino a un indirizzo?',
 'Utilizzi lo strumento ''Fermopoint'' sul sito BRT inserendo l''indirizzo preciso per visualizzare i punti di ritiro in zona.',
 'Spedizione', ARRAY['BRT','punto ritiro','Fermopoint','spedizione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Il ricambio originale della griglia porta-filtro per la cappa Elica (Elibloc) è disponibile?',
 'No, il produttore lo ha esaurito e non è più reperibile presso i fornitori.',
 'Ricambi', ARRAY['disponibilità','esaurito','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Esistono ricambi compatibili o soluzioni alternative se la griglia originale non è più reperibile?',
 'Non esistono pezzi adattabili; sono ordinabili solo le manigliette e la plafoniera. Alcuni clienti hanno risolto facendola verniciare da un carrozziere.',
 'Ricambi', ARRAY['compatibilità','alternative','manutenzione','soluzioni'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come si identifica quale versione del rubinetto ordinare per un piano cottura datato?',
 'Verificare il colore del pennarello segnato sulle viti del rubinetto (segno fatto in produzione); se non visibile è necessario smontare il piano o controllare l''etichetta sotto. Esistono 4 versioni non compatibili; in assenza di info si possono ordinare tutte (costo indicativo ~€80 cad al pubblico).',
 'Compatibilità prodotto', ARRAY['rubinetto','identificazione','piano cottura','versioni'], 'file_sconosciuto', NULL, 'da_verificare'),

('Quali informazioni devo fornire per richiedere ricambi (termocoppie, candelette, pistoni, schede)?',
 'Inviare il codice ricambio se disponibile, foto del piano/etichetta e foto dettagliate del particolare (es. colore segno sulle viti) e misure rilevanti (es. pistone 23 cm). Se non si dispone di questi dati potrebbe essere necessario smontare il piano per identificare il pezzo.',
 'Ricambi', ARRAY['foto','codice ricambio','misure','identificazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Quali sono alcuni prezzi e tempi indicativi per ricambi consultati nella conversazione?',
 'Esempi rilevati: termocoppia 15€ (es. 9606231/133.0052.856); candeletta 12€ (133.0042.041); porta iniettore 20€ (9603015); resistenza friggitrice (versione ''oro'') 220€ (pezzo unico); motore CEMCA... 205€ disponibile; scheda YT457... 76€ con ~5 giorni.',
 'Ricambi', ARRAY['prezzi','tempi','termocoppia','resistenza','scheda'], 'file_sconosciuto',
 'Tempi e disponibilità dipendono dal fornitore; alcune parti sono esaurite o uniche e possono richiedere sollecito.', 'da_verificare'),

('Come posso verificare se il motore venduto è compatibile con la mia cappa?',
 'Invii una foto dell''etichetta sulla carcassa del motore; se l''etichetta è illeggibile invii foto del motore e indichi il numero di velocità (es. 3 velocità) per consentirci la verifica.',
 'Compatibilità prodotto', ARRAY['etichetta','foto','velocità','compatibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come ordino il motore dal sito e come avviene la spedizione/pagamento?',
 'Clicchi sul link del prodotto, ''Aggiungi al carrello'', poi ''Vai al pagamento'', inserisca indirizzo di spedizione/fatturazione, selezioni il metodo di spedizione e scelga il tipo di pagamento seguendo le istruzioni del sito.',
 'Ordini', ARRAY['ordine online','spedizione','pagamento','sito'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa fare se ricevo un motore sbagliato o danneggiato? Come funziona il reso e il rimborso?',
 'Contattaci: ti invieremo via e-mail un link per scaricare un''etichetta prepagata da consegnare al Fermopoint; creeremo un ordine di reso e procederemo al rimborso, che può richiedere alcuni giorni per essere accreditato.',
 'Resi e garanzia', ARRAY['reso','etichetta prepagata','rimborso','Fermopoint'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso essere avvisato quando un prodotto tornerà disponibile in magazzino?',
 'Nella pagina del prodotto inserisca il suo indirizzo e-mail nella casella di notifica: riceverà un messaggio non appena il prodotto verrà caricato in magazzino.',
 'Ordini', ARRAY['disponibilità','notifica','email','magazzino'], 'file_sconosciuto', NULL, 'da_verificare'),

('Esiste un''alternativa alla tastiera touch per evitare problemi dovuti all''umidità?',
 'Non esiste un''alternativa compatibile: per avere un tipo di comando diverso sarebbe necessario sostituire l''intera cappa con un altro modello.',
 'Compatibilità prodotto', ARRAY['tastiera','alternativa','umidità','compatibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa posso fare se la tastiera di ricambio presenta gli stessi difetti? I pezzi di ricambio sono coperti dalla garanzia legale?',
 'È possibile rendere la tastiera e richiedere il rimborso seguendo la procedura di reso indicata nel link fornito dall''operatore; nella chat non è stata fornita una conferma esplicita sulla copertura della garanzia legale.',
 'Resi e garanzia', ARRAY['reso','rimborso','garanzia','ricambi'], 'file_sconosciuto',
 'Nessuna conferma esplicita sulla garanzia legale nella conversazione.', 'da_verificare'),

('Posso rendere una lampadina/faretto acquistato e chi paga le spese di spedizione del reso?',
 'Sì: seguire la procedura di reso indicata sul sito; le spese di spedizione per il reso sono a carico del cliente.',
 'Resi e garanzia', ARRAY['reso','procedura','spedizione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Posso acquistare il faretto con tonalità ''Natural white'' e quanto costa?',
 'Sì: il faretto alternativo costa 25€; in questo caso il venditore offre le spese di spedizione gratuite e può creare un ordine inviando un link precompilato per completare l''acquisto.',
 'Ordini', ARRAY['prezzo','spedizione gratuita','tonalità','ordine','faretto'], 'file_sconosciuto', NULL, 'da_verificare'),

('Perché due faretti entrambi indicati 4000K possono avere tonalità diverse e come risolvere il problema?',
 'LED di produttori diversi o con diverse aperture focali possono apparire differenti anche a pari Kelvin; soluzione pratica: sostituire i faretti in coppia o in gruppo per uniformare la tonalità.',
 'Assistenza tecnica', ARRAY['tonalità','led','compatibilità','consigli'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come verifico la disponibilità dei ricambi (supporti e ganci) per la mia cappa?',
 'Invii foto dettagliate del modello e dei pezzi da sostituire; verificheremo nell''elenco ricambi. Se il modello non è presente, potrebbe non esserci disponibilità perché molti pezzi risultano esauriti dal produttore.',
 'Ricambi', ARRAY['verifica disponibilità','foto','supporti','ganci'], 'file_sconosciuto',
 'L''operatore ha espresso incertezza sulla disponibilità (''credo'') rispetto all''esaurimento da parte del produttore.', 'da_verificare'),

('Cosa devo inviare se ho perso o gettato un pezzo della cappa?',
 'Invii una foto del pezzo mancante e il modello della cappa; il team utilizzerà le immagini per identificare il ricambio o confermare l''eventuale indisponibilità.',
 'Ricambi', ARRAY['pezzo mancante','foto','procedura'], 'file_sconosciuto', NULL, 'da_verificare'),

('Avete il filtro originale per la cappa Elica 240BEX2?',
 'Sì, disponiamo del filtro metallico antigrasso compatibile con Elica 240BEX2; verifichi il codice originale ACC0202014 se lo ha a disposizione.',
 'Ricambi', ARRAY['Elica','240BEX2','filtro metallico','ACC0202014'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso verificare se il filtro in vendita è compatibile con la mia cappa? (misure)',
 'Misuri l''alloggiamento del filtro nella cappa: deve risultare circa 43,5 x 20 cm (larghezza x altezza); se le misure corrispondono, il filtro è compatibile.',
 'Compatibilità prodotto', ARRAY['misure','compatibilità','installazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('La scheda di ricambio è compatibile con la mia cappa Franke K 20s (1996)?',
 'La scheda è compatibile nelle dimensioni e nel montaggio con la cassa originale; tuttavia il connettore verso il motore non è compatibile: sarà necessario tagliare i fili e risaldare i collegamenti.',
 'Compatibilità prodotto', ARRAY['compatibilità','connettore','fili','montaggio'], 'file_sconosciuto', NULL, 'da_verificare'),

('La scheda include uno schema dei colori/collegamenti per risaldare i fili?',
 'Nella conversazione non è stato fornito alcuno schema; prima di procedere richiedere lo schema dei collegamenti al venditore o al supporto tecnico per evitare errori nei collegamenti.',
 'Assistenza tecnica', ARRAY['schema','cablaggio','fili','supporto'], 'file_sconosciuto',
 'Non è stato specificato nella chat se lo schema è disponibile; verificare con il venditore.', 'da_verificare'),

('Quali filtri a carbone sono compatibili con la cappa Faber In Nova X A90 S/I e posso acquistare solo i due filtri invece del kit?',
 'Il filtro compatibile è il codice FKS140, misura 195x139; è venduto in confezione da 2 pezzi (stesso prodotto da 16€ citato). Al momento risulta non disponibile.',
 'Ricambi', ARRAY['filtri carbone','FKS140','compatibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('I filtri antigrasso metallici della cappa devono essere sostituiti o è possibile lavarli?',
 'Se non sono rotti possono essere lavati in lavastoviglie e solitamente non è necessario sostituirli; il prezzo sul sito è riferito a un singolo pezzo.',
 'Assistenza tecnica', ARRAY['filtri antigrasso','lavaggio','ricambi'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso essere avvisato quando i filtri a carbone tornano disponibili?',
 'Nella pagina prodotto è presente una casella per inserire la propria e-mail: inserendola riceverai un avviso non appena il prodotto sarà caricato in magazzino; al momento non abbiamo una data di arrivo certa.',
 'Ordini', ARRAY['disponibilità','avviso','email'], 'file_sconosciuto', NULL, 'da_verificare'),

('Il motore Smeg 795211073 è compatibile con la cappa Smeg KSEIL 90 X/1?',
 'No. La cappa KSEIL 90 X/1 richiedeva il motore codice 795210268; quel ricambio è esaurito/discontinuato e non è disponibile.',
 'Compatibilità prodotto', ARRAY['motore','compatibilità','Smeg','KSEIL90X1'], 'file_sconosciuto', NULL, 'da_verificare'),

('Posso trovare ricambi o supporti compatibili per i faretti della cappa Kappa/Faber (modello anni 2000)?',
 'Sì: è disponibile il supporto porta-faretto per cappe Faber/Smeg (product: supporto porta faretto per cappe faber smeg 1330057313) per montare faretti compatibili.',
 'Ricambi', ARRAY['faretto','supporto','compatibilità','Faber'], 'file_sconosciuto',
 'Verificare il diametro totale (es. 5,5 cm) e il tipo di attacco prima dell''acquisto.', 'da_verificare'),

('Quale tipo di lampadina serve come ricambio per questi faretti?',
 'Faretto dicroico 12V 20W (product: faretto dicroico per cappe Faber/Smeg 12V 20W).',
 'Ricambi', ARRAY['lampadina','dicroico','12V','20W'], 'file_sconosciuto',
 'Controllare misura e attacco del faretto esistente per confermare la compatibilità.', 'da_verificare'),

('Posso sostituire solo il motore interno se l''alberino è consumato?',
 'Il ricambio originale è esaurito dal produttore; proponiamo un motore alternativo compatibile (link fornito dal servizio). Disponibilità in arrivo la prossima settimana.',
 'Ricambi', ARRAY['motore','ricambio','disponibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso verificare quante velocità ha la mia cappa?',
 'Se la tastiera è elettronica, premendo a lungo il tasto 3 si avvia la quarta velocità; il modello in questione gestisce 4 velocità.',
 'Assistenza tecnica', ARRAY['velocità','controlli','compatibilità'], 'file_sconosciuto',
 'L''operatore ha indicato ''dovrebbe'' avere 4 velocità: verificare che la tastiera sia elettronica; modelli con comandi meccanici possono funzionare diversamente.', 'da_verificare'),

('Avete il filtro a carbone attivo compatibile con questo modello?',
 'Sì, è disponibile il filtro a carbone attivo tipo 3 compatibile; il link al prodotto è stato fornito dal servizio.',
 'Ricambi', ARRAY['filtro','carbone attivo','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Il filtro carbone attivo 26,7 x 23,7 cm (cod. 112.0157.243) è compatibile con la cappa Faber Arco Plus type 3802 (cod. 630000162)?',
 'Sì, confermiamo la compatibilità con la cappa Arco Plus type 3802; pagina prodotto fornita nella conversazione.',
 'Compatibilità prodotto', ARRAY['filtro carbone','Faber','compatibilità','Arco Plus'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso ordinare questo filtro?',
 'Può procedere all''acquisto dalla pagina prodotto indicata nel link condiviso dall''operatore nella chat.',
 'Ordini', ARRAY['ordine online','link prodotto','acquisto'], 'file_sconosciuto',
 'Nella conversazione non c''è una conferma esplicita dell''operatore dopo la domanda ''posso ordinare''; è stato comunque condiviso il link al prodotto.', 'da_verificare'),

('Cosa succede se ricevo un prodotto difettoso o sbagliato?',
 'Procediamo con la spedizione di un pezzo di ricambio/sostituzione; non è necessario restituire l''articolo originale.',
 'Resi e garanzia', ARRAY['sostituzione','reso','difetto','garanzia'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa succede se il ricambio non è immediatamente disponibile?',
 'Se il ricambio non è disponibile lo ordiniamo e lo spediamo non appena arriva; ci scusiamo per l''eventuale ritardo.',
 'Ricambi', ARRAY['ricambio','disponibilità','ritardo','spedizione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso verificare se un cavo piatto è compatibile con la mia cappa?',
 'Consulta la scheda prodotto che ti è stata inviata nella chat per verificare compatibilità.',
 'Compatibilità prodotto', ARRAY['compatibilità','cavo piatto','scheda prodotto'], 'file_sconosciuto',
 'Nella conversazione non è stata fornita una conferma finale di compatibilità.', 'da_verificare'),

('Il prodotto è attualmente disponibile?',
 'Al momento non è disponibile: è previsto l''arrivo del prodotto la prossima settimana.',
 'Ordini', ARRAY['disponibilità','riassortimento'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso essere avvisato quando il prodotto torna disponibile?',
 'Nella pagina del prodotto inserisci il tuo indirizzo e-mail nella casella dedicata per ricevere una notifica quando il prodotto viene caricato in magazzino.',
 'Ordini', ARRAY['notifiche','disponibilità','pagina prodotto'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso sapere se un motore di ricambio è compatibile con la mia cappa se il mio modello non compare nell''elenco?',
 'Verifichiamo internamente la compatibilità e, se confermiamo, il motore è adatto; per modelli datati l''elenco online potrebbe non riportarli tutti perché il ricambio è compatibile con molti modelli.',
 'Compatibilità prodotto', ARRAY['motore','cappa','compatibilità','modelli datati'], 'file_sconosciuto', NULL, 'da_verificare'),

('Dove posso trovare la scheda del motore di ricambio consigliato?',
 'La scheda prodotto è disponibile al link fornito dall''assistenza: https://www.filtrocappa.it/it/filtri-e-ricambi/156-motore-cappa-faber-franke-smeg-6-pin-3-velocita-1330018526-7612980005970.html',
 'Ricambi', ARRAY['link prodotto','motore','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come viene comunicato lo stato dell''ordine e quando viene spedito il pezzo?',
 'L''assistenza conferma la ricezione dell''ordine e comunica la spedizione; in questo caso è stato indicato che l''ordine è stato ricevuto e che la parte sarebbe partita il mattino seguente.',
 'Spedizione', ARRAY['ordine','spedizione','stato ordine'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso ottenere informazioni e procedere all''acquisto di un modello che ho fotografato e inviato via WhatsApp?',
 'Per fornirti informazioni e procedere con l''acquisto servono dati identificativi: invia foto nitide dell''apparecchio e dell''etichetta; se possibile indica marca, modello o numero di serie presenti sul prodotto.',
 'Ordini', ARRAY['foto','acquisto','identificazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa devo fare se le informazioni del prodotto non sono leggibili o si sono cancellate dalle foto inviate?',
 'Controlla direttamente sull''apparecchio la presenza di scritte con marca, modello o numeri di serie e invia foto leggibili o trascrivi i dati in chat.',
 'Informazioni prodotto', ARRAY['etichetta','marca','numero di serie','foto'], 'file_sconosciuto', NULL, 'da_verificare'),

('Qual è la lunghezza del cavo flat di collegamento tastiera-scheda per la cappa?',
 'Circa 15 cm.',
 'Ricambi', ARRAY['cavo','lunghezza','flat cable','ricambio'], 'file_sconosciuto',
 'Lunghezza indicativa fornita dall''operatore.', 'da_verificare'),

('Come posso individuare il ricambio corretto per la mia cappa?',
 'Rimuovere i filtri e fotografare l''etichetta attaccata alla lamiera interna (marca, modello, numero di serie) e inviarla per identificazione precisa.',
 'Ricambi', ARRAY['etichetta','identificazione','foto','modello','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Il motore della cappa è a tre velocità e dove posso trovare il motore completo o i pezzi di ricambio?',
 'Confermiamo che si tratta di un motore a tre velocità. Può trovare il motore completo o i singoli pezzi di ricambio nella pagina prodotto dedicata; invieremo il link per l''acquisto.',
 'Ricambi', ARRAY['motore','tre velocità','ricambio','pagina prodotto'], 'file_sconosciuto', NULL, 'da_verificare'),

('Posso acquistare solo il ricambio (es. la lampadina o parte del faretto) invece dell''intero faretto?',
 'No, il fornitore fornisce il faretto completo e non il singolo componente.',
 'Ricambi', ARRAY['faretto','ricambio','disponibilità'], 'file_sconosciuto', NULL, 'da_verificare'),

('Dove posso acquistare il faretto completo compatibile?',
 'Il faretto è disponibile sul sito: https://www.filtrocappa.it/it/filtri-e-ricambi/133-faretto-alogeno-acciaio-spazzolato-completo-per-cappa-20-watt-12-volt-faber-franke-smeg.html',
 'Ordini', ARRAY['faretto','acquisto','sito'], 'file_sconosciuto', NULL, 'da_verificare'),

('Questo ricambio è disponibile e può essere ordinato?',
 'Il ricambio è esaurito dal produttore e non possiamo rifornirlo, quindi non è possibile ordinarlo da noi.',
 'Ricambi', ARRAY['disponibilità','esaurito','non rifornibile','ricambio'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso ottenere la fattura o la ricevuta del mio acquisto?',
 'Se la fattura è stata emessa, la inviamo tramite l''interscambio elettronico e possiamo inoltrare una copia in chat.',
 'Ordini', ARRAY['fattura','ricevuta','interscambio','documentazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('È possibile intestare la fattura alla mia azienda anche se il pagamento è stato effettuato con una carta di credito diversa?',
 'Sì: è possibile intestare la fattura alla sua azienda anche se il pagamento è stato effettuato con carta di credito; emettiamo la fattura con l''intestazione richiesta.',
 'Pagamenti', ARRAY['fatturazione','intestazione','pagamento'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa succede se mancano il codice fiscale o altri dati necessari per l''emissione della fattura?',
 'La mancanza di dati fiscali può causare errori nell''interscambio elettronico; verifichiamo e correggiamo i dati prima di inviare la fattura definitiva.',
 'Ordini', ARRAY['codice fiscale','interscambio','errore'], 'file_sconosciuto',
 'L''operatore ha indicato il rischio di errore per mancanza di codice fiscale; non confermato se l''errore si è verificato.', 'da_verificare'),

('La calotta mostrata è disponibile nel colore bianco o è grigia?',
 'La foto inganna: il ricambio è bianco.',
 'Informazioni prodotto', ARRAY['colore','ricambio','ventilatore','calotta'], 'file_sconosciuto', NULL, 'da_verificare'),

('Cosa fare se al checkout viene richiesto un codice promozionale che non si possiede?',
 'Al momento non sono attivi codici promo; selezionare ''sono nuovo cliente'' e inserire i dati (nome, cognome, e-mail) per proseguire con l''ordine.',
 'Ordini', ARRAY['checkout','codice promo','ordine','registrazione'], 'file_sconosciuto', NULL, 'da_verificare'),

('Il filtro a carbone attivo indicato per il modello H41/2P è compatibile con il modello H41/1P?',
 'Sì. Dopo verifica delle foto inviate, l''operatore ha confermato che il filtro proposto è compatibile con H41/1P.',
 'Compatibilità prodotto', ARRAY['compatibilità','filtro a carbone','H41/1P','H41/2P'], 'file_sconosciuto', NULL, 'da_verificare'),

('Come posso verificare se il filtro in vendita è quello giusto per la mia cappa?',
 'Invii al supporto la foto del filtro vecchio; un operatore confronterà le immagini e indicherà il prodotto compatibile.',
 'Assistenza tecnica', ARRAY['verifica','foto','assistenza','filtro'], 'file_sconosciuto', NULL, 'da_verificare');


-- Batch 2 — FAQ ufficiali dal sito (no metadata, stato=verificata)

INSERT INTO kb_faq (domanda, risposta, categoria, tag, fonte_file, note, stato) VALUES
('Posso collegare la mia cappa a uno scarico esterno con tubo e curve?',
 'Dipende. Un collegamento efficace non dovrebbe superare i 6 metri (ogni curva vale 1 metro). Tuttavia, se il diametro del tubo di scarico nel muro è inferiore a 12 cm (es. 10 cm), il collegamento non è consigliato: la cappa diventerebbe rumorosa e poco efficiente. Inoltre, il diametro del tubo non deve essere ridotto di oltre il 25% rispetto al diametro dell''uscita motore: ad esempio, se l''uscita è da 15 cm la riduzione massima è a 12,5 cm, mentre se l''uscita è da 12 cm la riduzione massima è a 10 cm.',
 'Installazione', NULL, 'faq_sito_web', NULL, 'verificata'),

('Come faccio a sapere quale filtro è compatibile con la mia cappa?',
 'Apri la cappa e togli i filtri antigrasso. Troverai un''etichetta con marca, modello e numero di serie. Inviaci una foto via email o WhatsApp: ti diremo noi quale è il ricambio corretto.',
 'Compatibilità prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Non trovo l''etichetta con i dati. Come faccio?',
 'Puoi inviarci una foto della cappa e dei filtri, oppure del pezzo di ricambio che ti serve. Per i filtri è preferibile ricevere anche le misure (altezza e larghezza di ogni lato). In questo modo potremo individuare il ricambio più adatto.',
 'Compatibilità prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('I filtri ai carboni attivi sono sempre necessari?',
 'Solo se l''aria non viene espulsa all''esterno. Se la cappa è collegata a una tubazione che porta fuori l''aria, bastano i filtri metallici antigrasso.',
 'Informazioni prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Ogni quanto vanno sostituiti i filtri ai carboni attivi?',
 'I filtri usa e getta devono essere sostituiti ogni 6-8 mesi, mentre i filtri Long Life possono essere lavati e hanno una durata fino a 3 anni. I filtri High Performance garantiscono una filtrazione superiore, ma richiedono comunque la sostituzione ogni 6-8 mesi. Per quanto riguarda i filtri a carbone attivo, la frequenza di sostituzione varia in base all''utilizzo: in caso di uso normale, pari a 1-2 volte al giorno, è consigliata la sostituzione ogni 3-6 mesi, mentre in caso di uso intenso, con cotture frequenti, fritti o odori persistenti, è preferibile sostituirli ogni 2-3 mesi. La necessità di sostituzione si manifesta anche con una ridotta efficacia di aspirazione, con la persistenza di odori in cucina o con l''accumulo visibile di grasso attorno al filtro. I filtri a carbone attivo Long Life, invece, devono essere rigenerati ogni 6-12 mesi e sostituiti completamente dopo 2-3 anni.',
 'Informazioni prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Come funziona l''ordine dal sito?',
 'Basta cliccare sul prodotto, poi su "Aggiungi al carrello" e seguire le istruzioni fino al pagamento. Puoi scegliere tra diversi metodi di pagamento e spedizione.',
 'Ordini', NULL, 'faq_sito_web', NULL, 'verificata'),

('Quali metodi di pagamento accettate?',
 'Carte di credito, bonifico, contrassegno, PayPal, Satispay.',
 'Pagamenti', NULL, 'faq_sito_web', NULL, 'verificata'),

('Quanto costa la spedizione?',
 'La spedizione è gratuita se scegli il ritiro presso un FermoPoint BRT. In caso di consegna a domicilio il costo è di 8 €. Per ordini superiori a 29 € la spedizione resta gratuita, ma solo con ritiro presso un FermoPoint, mentre per ordini inferiori a 29 € il costo è di 8 € (valido in tutta Italia). Per maggiori dettagli, e per i costi di spedizione fuori dall''Italia, consulta la pagina ''Costi di spedizione''.',
 'Spedizione', NULL, 'faq_sito_web', NULL, 'verificata'),

('Come posso tracciare la spedizione?',
 'A ogni fase della lavorazione dell''ordine riceverai un''e-mail di avviso, compresa quella con il link per il tracking. Se hai scelto il ritiro presso un FermoPoint, BRT ti informerà via e-mail non appena il pacco sarà disponibile per il ritiro. Si consiglia di controllare anche la cartella spam.',
 'Spedizione', NULL, 'faq_sito_web', NULL, 'verificata'),

('Posso fare il reso di un prodotto?',
 'Sì. Imballa il prodotto nella sua confezione originale, proteggilo adeguatamente e spedisci il pacco a: Sintesi snc – Via del Lavoro, 14 – 31013 Cimavilla di Codognè (TV), Italia. Sul pacco indica chiaramente nome, cognome, indirizzo e numero d''ordine. È importante utilizzare una scatola di spedizione robusta e materiale di imbottitura per proteggere sia il prodotto sia la confezione originale, evitando danni durante il trasporto. Non scrivere direttamente sulla confezione originale: tutte le informazioni devono essere riportate su un foglio e applicate all''esterno della scatola di spedizione. Si ricorda che, in caso di danneggiamento del prodotto dovuto a un imballaggio insufficiente o non adeguato, non sarà possibile effettuare il rimborso.',
 'Resi e garanzia', NULL, 'faq_sito_web', NULL, 'verificata'),

('Posso montare un motore diverso da quello originale?',
 'Solitamente No. Anche se le misure e l''attacco possono sembrare compatibili, i collegamenti elettrici e le configurazioni interne possono variare: è necessario avere il modello esatto per evitare danni. In caso di dubbi, contattateci via e-mail o WhatsApp per maggiori informazioni.',
 'Compatibilità prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Serve un tecnico per sostituire il tubo della cappa?',
 'No, se hai un po'' di manualità puoi farlo da solo.',
 'Installazione', NULL, 'faq_sito_web', NULL, 'verificata'),

('Ho un piano a induzione: mi serve una cappa con funzione anticondensa?',
 'Sì, soprattutto in inverno. Senza funzione anticondensa si formano gocce d''acqua sulla superficie della cappa.',
 'Informazioni prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('I filtri metallici eliminano anche gli odori?',
 'No. I filtri metallici trattengono il grasso. Per eliminare gli odori servono i filtri ai carboni attivi (necessari solo per cappe a ricircolo).',
 'Informazioni prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Non ho ricevuto lo schema elettrico con il ricambio. Come faccio?',
 'Difficilmente i produttori non forniscono gli schemi elettrici, perché i ricambi venduti si presuppone vadano a sostituire lo stesso pezzo guasto. Possiamo aiutarti a reperirlo se ci invii i dati completi della tua cappa.',
 'Assistenza tecnica', NULL, 'faq_sito_web', NULL, 'verificata'),

('Posso ordinare tramite WhatsApp?',
 'No, l''ordine deve essere effettuato tramite il sito seguendo la procedura guidata. Su WhatsApp puoi invece ottenere tutte le informazioni sui prodotti o l''assistenza di cui hai bisogno.',
 'Ordini', NULL, 'faq_sito_web', NULL, 'verificata'),

('Come trovo il codice del mio ordine?',
 'Lo trovi nelle email di conferma ordine o nel tuo account sul sito.',
 'Ordini', NULL, 'faq_sito_web', NULL, 'verificata'),

('Come faccio a sapere se i filtri visualizzati sul sito sono un set o singoli?',
 'Leggi attentamente la descrizione prodotto. Se hai dubbi, contattaci prima di effettuare l''ordine.',
 'Informazioni prodotto', NULL, 'faq_sito_web', NULL, 'verificata'),

('Se voglio rendere il prodotto per ripensamento o errato acquisto, cosa devo fare?',
 'La politica resi di Filtrocappa ti consente di ripensare al tuo acquisto o di restituire l''articolo per un errato acquisto, senza dover specificare il motivo, entro 30 giorni di calendario dalla data di avvenuta consegna. Se il reso è conforme alle condizioni, avrai diritto alla restituzione del prezzo del prodotto (escluse le spese di spedizione). Imballa adeguatamente la merce nella confezione originale con scatola robusta e materiale imbottitura. Non scrivere sulla confezione originale. Scrivi su un foglio: nome, cognome, indirizzo, numero d''ordine come mittente e come destinatario: Sintesi snc - Via del lavoro, 14 - 31013 Cimavilla di Codognè (TV) Italia. I costi di spedizione sono a carico del cliente. I prodotti devono essere in condizioni perfette, nella confezione originale integra, con tutte le etichette e accessori presenti, senza segni di utilizzo. Nel caso di motori o componenti elettrici con bruciature o danni da errato collegamento, il rimborso non verrà emesso. Il rimborso viene emesso entro 14 giorni dal ricevimento e verifica della merce, con lo stesso metodo di pagamento utilizzato.',
 'Resi e garanzia', NULL, 'faq_sito_web', NULL, 'verificata'),

('Cosa succede se il prodotto ricevuto è difettoso?',
 'Contattaci entro 14 giorni dalla consegna tramite la pagina Contatti o via email a info@filtrocappa.it, indicando il numero d''ordine e descrivendo il problema, possibilmente con foto. Una volta ricevuto il prodotto restituito, verrà effettuato un controllo approfondito. Nel caso di motori o componenti elettrici con bruciature o danni da errato collegamento o modifiche, il reso non verrà accettato. Puoi scegliere tra: sostituzione con prodotto identico (salvo disponibilità) o rimborso completo del prezzo di acquisto. Le spese di spedizione per la restituzione e per l''invio del prodotto sostitutivo sono a carico di FiltroCappa.it. I rimborsi vengono elaborati entro 14 giorni lavorativi dal ricevimento e dalla verifica del prodotto.',
 'Resi e garanzia', NULL, 'faq_sito_web', NULL, 'verificata'),

('Cosa faccio se il prodotto è danneggiato a causa del trasporto?',
 'Contattaci via email a info@filtrocappa.it entro 24 ore dalla ricezione del pacco. Nella comunicazione includi i riferimenti dell''ordine e, se possibile, delle immagini del danno. Il nostro servizio clienti ti assisterà rapidamente per risolvere la situazione.',
 'Resi e garanzia', NULL, 'faq_sito_web', NULL, 'verificata'),

('Quali metodi di pagamento sono disponibili sul sito?',
 'Il sito FiltroCappa.it dispone di diversi canali di pagamento: PayPal, Carte di Credito (Maestro, Visa, Mastercard, American Express, PostePay), PayPal Pay Later (pagamento a rate), Bonifico bancario, Satispay. Tutti i pagamenti online sono protetti da gateway sicuri che garantiscono la protezione dei dati sensibili.',
 'Pagamenti', NULL, 'faq_sito_web', NULL, 'verificata'),

('Quali sono i costi e i tempi di spedizione?',
 'In Italia: spedizione gratuita per ordini superiori a 29€ con ritiro presso FermoPoint BRT; per ordini inferiori a 29€ il costo è di 8€; la consegna a domicilio prevede sempre un costo di 8€ indipendentemente dall''importo. Su tutti gli ordini è inclusa un''assicurazione gratuita contro danni da trasporto. In Europa: Austria e Germania 15€; Croazia, Slovenia, Belgio, Olanda, Francia, Polonia, Portogallo, Spagna 15€ (solo FermoPoint); Bulgaria, Repubblica Ceca, Romania, Ungheria 25€; Danimarca, Malta, Finlandia, Svezia, Svizzera, Regno Unito 35€. Tempi: gli ordini vengono evasi entro 24 ore dalla ricezione del pagamento (esclusi sabato, domenica e festività). Il corriere effettua la consegna nelle 24-48 ore successive. Riceverai un''email con il tracking appena la merce viene affidata al corriere.',
 'Spedizione', NULL, 'faq_sito_web', NULL, 'verificata');
