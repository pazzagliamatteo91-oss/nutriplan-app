// Lettura ragionata delle analisi ematiche via Claude API. Stessa architettura
// dei client IA già presenti (fetch diretto, nessun SDK, per Metro/Hermes).
// Non è un dispositivo medico: fornisce solo spunti informativi generali,
// mai una diagnosi o una prescrizione.

import { AiAnalysisReport, AiAnalysisRequestParams, WellnessAnalisiInput } from './types';
import { AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from './aiWorkoutClient';

export { AiWorkoutError, hasAiApiKeyConfigured };
export type { AiWorkoutErrorCode };

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-opus-5';
const REQUEST_TIMEOUT_MS = 60000;

const SYSTEM_PROMPT = `Sei un assistente di benessere che aiuta le persone a capire i propri valori delle analisi del sangue in linguaggio semplice. Non sei un medico e non fornisci mai una diagnosi: i tuoi output sono spunti informativi generali da valutare con un professionista sanitario.

### REGOLE:
- Analizza SOLO i parametri effettivamente forniti nel messaggio dell'utente.
- Se nessun parametro è fuori range, dillo chiaramente in "stato_generale" e restituisci "anomalie_rilevate": [].
- Per ogni parametro fuori range, proponi uno spunto nutrizionale/esercitativo PLAUSIBILE e generico da discutere con un professionista sanitario — mai una prescrizione, mai un'ipotesi diagnostica specifica.
- "suggerimento_generale" è una sintesi in 2-3 frasi che collega tra loro le eventuali anomalie (es. se più valori suggeriscono uno stesso ambito, come infiammazione o carenze), sempre con lo stesso taglio informativo e prudente.
- Rispondi in tutti i campi testuali nella lingua indicata.

### FORMATO DI RISPOSTA RICHIESTO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido (nessun testo prima o dopo, nessun blocco di codice markdown):

{
  "report": {
    "disclaimer": "Questi spunti non sostituiscono il parere di un professionista sanitario.",
    "stato_generale": "string",
    "suggerimento_generale": "string",
    "anomalie_rilevate": [
      { "parametro": "string", "valore_rilevato": "string", "spunto_da_discutere_col_medico": "string" }
    ]
  }
}`;

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!key) throw new AiWorkoutError('missing_api_key');
  return key;
}

function buildUserMessage(anomalie: WellnessAnalisiInput[], params: AiAnalysisRequestParams): string {
  const parametriLine = anomalie.length
    ? anomalie.map((a) => `${a.parametro}: ${a.valore} ${a.unita} (${a.stato}, range ${a.rangeMin}-${a.rangeMax})`).join('; ')
    : 'Nessun parametro fuori range';
  return [`Parametri fuori range: ${parametriLine}`, `Note aggiuntive dell'utente: ${params.note || 'Nessuna'}`, `Lingua di risposta: ${params.lingua}`].join('\n');
}

export async function generateAiAnalysisReport(
  anomalie: WellnessAnalisiInput[],
  params: AiAnalysisRequestParams
): Promise<AiAnalysisReport> {
  const apiKey = getApiKey();
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
        max_tokens: 2048,
        thinking: { type: 'disabled' },
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildUserMessage(anomalie, params) }],
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
  const textBlock = Array.isArray(data?.content) ? data.content.find((b: any) => b?.type === 'text') : null;
  if (!textBlock?.text) throw new AiWorkoutError('empty_response');

  let parsed: any;
  try {
    parsed = JSON.parse(stripCodeFences(textBlock.text));
  } catch (err) {
    throw new AiWorkoutError('invalid_json', err);
  }

  const report = parsed?.report;
  if (!report) throw new AiWorkoutError('invalid_schema');

  return {
    disclaimer: report.disclaimer ?? 'Questi spunti non sostituiscono il parere di un professionista sanitario.',
    statoGenerale: report.stato_generale ?? 'Nessun dato disponibile',
    suggerimentoGenerale: report.suggerimento_generale ?? '',
    anomalieRilevate: (report.anomalie_rilevate ?? []).map((a: any) => ({
      parametro: a?.parametro ?? '',
      valoreRilevato: a?.valore_rilevato ?? '',
      spuntoDaDiscuterreColMedico: a?.spunto_da_discutere_col_medico ?? '',
    })),
  };
}
