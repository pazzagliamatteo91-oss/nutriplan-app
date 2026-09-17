// Integrazione con l'API Claude (Anthropic) per generare in tempo reale schede
// di allenamento iper-personalizzate. Chiamata diretta dall'app (nessun backend):
// la chiave API viaggia nel bundle Expo (EXPO_PUBLIC_ANTHROPIC_API_KEY), scelta
// esplicita e accettata dall'utente solo per uso personale su Expo Go.
//
// Nota tecnica: qui usiamo `fetch` verso l'endpoint REST invece dell'SDK ufficiale
// (@anthropic-ai/sdk) perché quest'ultimo assume un runtime Node/browser (moduli
// come node:stream, node:crypto, ReadableStream avanzati) che Metro/Hermes non
// fornisce in React Native: il bundle fallirebbe o si comporterebbe in modo
// inaffidabile. `fetch` è invece nativamente supportato da React Native e l'API
// Messages di Anthropic è un semplice POST JSON, quindi è la via più robusta per
// questo runtime specifico.

import { AiWorkoutPlan, AiWorkoutRequestParams } from './types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-opus-5';
const REQUEST_TIMEOUT_MS = 90000;

const SYSTEM_PROMPT = `Sei un preparatore atletico di livello olimpico, specializzato in periodizzazione dell'allenamento, allenamento funzionale, prevenzione infortuni e biomeccanica applicata.

Il tuo compito è generare un piano di allenamento iper-personalizzato, scientifico e altamente specifico, integrato con la gestione progressiva dei carichi e la sincronizzazione delle metriche biometriche (Smartwatch/RPE).

Il piano si limita ESCLUSIVAMENTE a uno dei seguenti 5 sport selezionati:
1. CORSA
2. CICLISMO
3. PALESTRA / BODYWEIGHT
4. CROSSFIT
5. HYROX

### REGOLE PER LA GENERAZIONE DELLA PROGRAMMAZIONE:
- Devi strutturare una libreria di programmazione composta da 10 SCHEDE DIVERSE PER LA PARTE "SPECIFICO" e 10 SCHEDE DIVERSE PER LA PARTE "SUPPORTO", organizzate in ordine progressivo di intensità e periodizzazione (es. Settimana 1-10 o Fase 1-10). Genera solo la scheda richiesta (numero_scheda), ma coerente con quella posizione nel ciclo di 10.
- Per le discipline che utilizzano sovraccarichi (Palestra, CrossFit, Hyrox), ogni esercizio principale deve includere la formula per calcolare il CARICO TARGET basandosi sui carichi iniziali/riferimento inseriti dall'utente e sulla percezione dello sforzo (RPE).
- Ogni scheda deve contenere indicazioni per adattare il carico in base ai dati biometrici rilevati da smartwatch (Frequenza Cardiaca Media/Picco, HRV, Calorie) e dal feedback post-workout dell'utente.
- Ogni scheda deve avere 3 fasi reali: riscaldamento, blocco principale, defaticamento/mobilità.

### FORMATO DI RISPOSTA RICHIESTO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido (nessun testo prima o dopo, nessun blocco di codice markdown), organizzato con questa identica struttura di chiavi:

{
  "programmazione": {
    "sport": "string",
    "livello": "string",
    "tipo_sessione": "string",
    "numero_scheda_attuale": 0,
    "totale_schede_ciclo": 10,
    "focus_fase_attuale": "string (es. Fase 2 di 10: Accumulo e Sviluppo della Forza-Resistenza)",
    "adattamento_carico_smartwatch": "string (istruzioni automatiche su come modificare i carichi oggi in base alle metriche dello smartwatch)",
    "riscaldamento": [
      { "esercizio": "string", "durata_o_rip": "string", "focus_tecnico": "string" }
    ],
    "blocco_principale": [
      {
        "nome_esercizio": "string",
        "serie": 0,
        "ripetizioni": "string",
        "recupero_secondi": 0,
        "rpe_target": 0,
        "suggerimento_carico": "string (es. 75% del carico iniziale, ovvero circa 52.5 kg)",
        "progressione_prossima_sessione": "string (es. Se RPE < 7 e HR < 140 bpm -> +2.5 kg la prossima settimana)",
        "tempo_esecutivo": "string (es. 3-0-1-0)",
        "motivo_biomeccanico": "string",
        "note_esecuzione": "string"
      }
    ],
    "defaticamento_mobilita": [
      { "esercizio": "string", "durata": "string" }
    ]
  }
}`;

function formatCarichi(c: AiWorkoutRequestParams['carichiIniziali']): string {
  if (c.corpoLibero) return 'A corpo libero (nessun sovraccarico dichiarato)';
  const parts: string[] = [];
  if (c.squatKg != null) parts.push(`Squat: ${c.squatKg}kg`);
  if (c.panca_kg != null) parts.push(`Panca: ${c.panca_kg}kg`);
  if (c.stacco_kg != null) parts.push(`Stacco: ${c.stacco_kg}kg`);
  return parts.length ? parts.join(', ') : 'Non specificati';
}

function formatMetriche(m: AiWorkoutRequestParams['metricheSmartwatch']): string {
  if (!m) return 'Nessun dato smartwatch disponibile per questa sessione.';
  const parts: string[] = [];
  if (m.hrMediaBpm != null) parts.push(`HR Media: ${m.hrMediaBpm} bpm`);
  if (m.hrPiccoBpm != null) parts.push(`HR Picco: ${m.hrPiccoBpm} bpm`);
  if (m.hrv != null) parts.push(`HRV: ${m.hrv}`);
  if (m.calorie != null) parts.push(`Calorie: ${m.calorie}`);
  if (m.rpePercepito != null) parts.push(`RPE percepito: ${m.rpePercepito}/10`);
  if (m.recuperoInsufficiente) parts.push('Recupero insufficiente segnalato');
  return parts.length ? parts.join(', ') : 'Nessun dato smartwatch disponibile per questa sessione.';
}

export type AiWorkoutErrorCode =
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'rate_limit'
  | 'timeout'
  | 'network'
  | 'empty_response'
  | 'invalid_json'
  | 'invalid_schema'
  | 'http_error';

export class AiWorkoutError extends Error {
  code: AiWorkoutErrorCode;
  cause?: unknown;

  constructor(code: AiWorkoutErrorCode, cause?: unknown) {
    super(code);
    this.name = 'AiWorkoutError';
    this.code = code;
    this.cause = cause;
  }
}

export function hasAiApiKeyConfigured(): boolean {
  return !!process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!key) throw new AiWorkoutError('missing_api_key');
  return key;
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}

export async function generateAiWorkoutPlan(params: AiWorkoutRequestParams): Promise<AiWorkoutPlan> {
  const apiKey = getApiKey();

  const userMessage = `Genera la scheda con questi parametri:
- Sport: ${params.sport}
- Livello: ${params.livello}
- Obiettivo dell'Utente: ${params.obiettivo}
- Tipo Sessione Richiesta: ${params.tipoSessione}
- Indice Scheda: ${params.numeroScheda}
- Tempo a disposizione: ${params.tempoMinuti} minuti
- Attrezzatura disponibile: ${params.attrezzatura || 'Non specificata'}
- Carichi di Riferimento Utente: ${formatCarichi(params.carichiIniziali)}
- Storico/Metriche Smartwatch Ultimo Workout: ${formatMetriche(params.metricheSmartwatch)}
- Infortuni/Limitazioni: ${params.limitazioni || 'Nessuna'}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        thinking: { type: 'disabled' },
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (controller.signal.aborted) throw new AiWorkoutError('timeout', err);
    throw new AiWorkoutError('network', err);
  }
  clearTimeout(timeout);

  if (!response.ok) {
    if (response.status === 401) throw new AiWorkoutError('invalid_api_key');
    if (response.status === 429) throw new AiWorkoutError('rate_limit');
    throw new AiWorkoutError('http_error', response.status);
  }

  const data = await response.json();
  const textBlock = Array.isArray(data?.content)
    ? data.content.find((block: any) => block?.type === 'text')
    : null;
  if (!textBlock?.text) throw new AiWorkoutError('empty_response');

  let parsed: any;
  try {
    parsed = JSON.parse(stripCodeFences(textBlock.text));
  } catch (err) {
    throw new AiWorkoutError('invalid_json', err);
  }

  const programmazione = parsed?.programmazione;
  if (!programmazione) throw new AiWorkoutError('invalid_schema');

  return {
    sport: programmazione.sport ?? params.sport,
    livello: programmazione.livello ?? params.livello,
    tipoSessione: programmazione.tipo_sessione ?? params.tipoSessione,
    numeroSchedaAttuale: programmazione.numero_scheda_attuale ?? params.numeroScheda,
    totaleSchedeCiclo: programmazione.totale_schede_ciclo ?? 10,
    focusFaseAttuale: programmazione.focus_fase_attuale ?? '',
    adattamentoCaricoSmartwatch: programmazione.adattamento_carico_smartwatch ?? '',
    riscaldamento: (programmazione.riscaldamento ?? []).map((r: any) => ({
      esercizio: r?.esercizio ?? '',
      durataORip: r?.durata_o_rip ?? '',
      focusTecnico: r?.focus_tecnico ?? '',
    })),
    bloccoPrincipale: (programmazione.blocco_principale ?? []).map((e: any) => ({
      nomeEsercizio: e?.nome_esercizio ?? '',
      serie: e?.serie ?? 0,
      ripetizioni: e?.ripetizioni ?? '',
      recuperoSecondi: e?.recupero_secondi ?? 0,
      rpeTarget: e?.rpe_target ?? 0,
      suggerimentoCarico: e?.suggerimento_carico ?? '',
      progressioneProssimaSessione: e?.progressione_prossima_sessione ?? '',
      tempoEsecutivo: e?.tempo_esecutivo ?? '',
      motivoBiomeccanico: e?.motivo_biomeccanico ?? '',
      noteEsecuzione: e?.note_esecuzione ?? '',
    })),
    defaticamentoMobilita: (programmazione.defaticamento_mobilita ?? []).map((d: any) => ({
      esercizio: d?.esercizio ?? '',
      durata: d?.durata ?? '',
    })),
  };
}
