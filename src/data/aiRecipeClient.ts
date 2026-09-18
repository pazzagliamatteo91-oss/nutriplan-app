// Generatore di ricette su misura via Claude API. Stessa architettura dei
// client IA già presenti nell'app (aiWorkoutClient.ts, wellnessEngineClient.ts):
// fetch diretto verso l'endpoint REST (niente SDK, per compatibilità con
// Metro/Hermes), chiave letta da EXPO_PUBLIC_ANTHROPIC_API_KEY.

import { AiRecipeRequestParams, AiRecipeResult } from './types';
import { AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from './aiWorkoutClient';

export { AiWorkoutError, hasAiApiKeyConfigured };
export type { AiWorkoutErrorCode };

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-opus-5';
const REQUEST_TIMEOUT_MS = 60000;

const SYSTEM_PROMPT = `Sei "FitChef AI", il motore di intelligenza artificiale per la nutrizione integrato nell'app. Il tuo compito è generare UNA ricetta nuova, reale e su misura per la richiesta dell'utente. Operi in una di tre modalità, indicata nel messaggio dell'utente:

- TREND_SOCIAL: crea la versione fit e bilanciata di un piatto virale/di tendenza (es. Baked Feta Pasta, Cloud Bread, Proats), adattata ai macro e alle intolleranze dell'utente. Se l'utente non specifica un piatto preciso, scegline uno tra i format virali più noti e riconoscibili, variando la scelta invece di ripetere sempre lo stesso.
- ETHNIC_FOOD: crea un piatto bilanciato che rispetti fedelmente la tradizione culinaria indicata, adattato al target calorico.
- CUSTOM_INGREDIENTS: crea una ricetta libera, usando prioritariamente gli ingredienti o le preferenze indicate dall'utente.

Il catalogo base di ricette dell'app è gestito separatamente dal codice, senza il tuo intervento: ogni ricetta che generi è nuova e potrà essere salvata nella libreria locale di quell'utente — non in un database condiviso, perché l'app non ha un backend comune a più utenti. Non devi assegnare un ID: ci pensa l'app dopo aver ricevuto la tua risposta.

### REGOLE:
- ESCLUDI o SOSTITUISCI TASSATIVAMENTE ogni ingrediente collegato alle intolleranze/allergie indicate con un'alternativa sicura ed equivalente. Imposta "compatibile_intolleranze": true solo se la ricetta è al 100% sicura per le intolleranze specificate.
- Assegna a "tag_dietetico" esattamente uno tra: Vegetariano, Vegano, Carne, Pesce — coerente con gli ingredienti realmente usati.
- Il tempo di preparazione totale non deve superare i minuti indicati.
- Se sono forniti target di kcal e/o proteine, avvicinati il più possibile (tolleranza ragionevole); se non forniti, scegli valori sensati per il tipo di pasto.
- Se è indicata una stagione, privilegia dove sensato ingredienti di quella stagione, senza forzarlo se in conflitto con lo stile richiesto.
- Ogni ingrediente ha una quantità precisa per UNA porzione, come stringa leggibile (es. "150 g", "200 ml", "1 cucchiaio"). Non assegnare categorie di spesa: le calcola l'app automaticamente dal nome dell'ingrediente.
- Passaggi di preparazione chiari, in ordine, realmente eseguibili.
- Rispondi in tutti i campi testuali nella lingua indicata.

### FORMATO DI RISPOSTA RICHIESTO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido (nessun testo prima o dopo, nessun blocco di codice markdown):

{
  "ricetta": {
    "nome": "string",
    "cucina": "string",
    "tag_dietetico": "string (Vegetariano / Vegano / Carne / Pesce)",
    "difficolta": "string (Facile / Media / Difficile)",
    "tempo_minuti": 0,
    "kcal": 0,
    "proteine_g": 0,
    "compatibile_intolleranze": true,
    "ingredienti": [
      { "nome": "string", "quantita": "string (es. \\"150 g\\", \\"200 ml\\", \\"1 cucchiaio\\")" }
    ],
    "passaggi": ["string"],
    "tip_dello_chef": "string (consiglio per cottura, conservazione o variante)"
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

function buildModeLine(params: AiRecipeRequestParams): string {
  if (params.modalita === 'trend') {
    return params.note
      ? `Modalità: TREND_SOCIAL. Idea/piatto virale suggerito dall'utente: ${params.note}`
      : `Modalità: TREND_SOCIAL. Nessun piatto specifico indicato: scegline uno tu tra i format virali più noti.`;
  }
  if (params.modalita === 'etnica') {
    return `Modalità: ETHNIC_FOOD. Cucina richiesta: ${params.cucina || 'a tua scelta'}.${params.note ? ` Dettagli extra: ${params.note}` : ''}`;
  }
  return `Modalità: CUSTOM_INGREDIENTS. Ingredienti/preferenze indicate dall'utente: ${params.note || 'nessuna indicazione specifica'}.${params.cucina ? ` Cucina preferita: ${params.cucina}.` : ''}`;
}

function buildUserMessage(params: AiRecipeRequestParams): string {
  const lines = [
    buildModeLine(params),
    `Tipo pasto: ${params.tipoPasto}`,
    `Tempo massimo di preparazione: ${params.tempoMassimoMin} minuti`,
    `Target kcal: ${params.kcalTarget != null ? `${params.kcalTarget} kcal` : 'Nessun vincolo specifico'}`,
    `Target proteine: ${params.proteineTarget != null ? `${params.proteineTarget} g` : 'Nessun vincolo specifico'}`,
    `Intolleranze/allergie da escludere: ${params.intolleranzeAllergie.length ? params.intolleranzeAllergie.join(', ') : 'Nessuna'}`,
    `Stagione attuale: ${params.stagione || 'non specificata'}`,
    `Lingua di risposta: ${params.lingua}`,
  ];
  return lines.join('\n');
}

export async function generateAiRecipe(params: AiRecipeRequestParams): Promise<AiRecipeResult> {
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
        messages: [{ role: 'user', content: buildUserMessage(params) }],
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

  const r = parsed?.ricetta;
  if (!r) throw new AiWorkoutError('invalid_schema');

  return {
    nome: r.nome ?? '',
    cucina: r.cucina ?? params.cucina,
    tagDietetico: r.tag_dietetico ?? '',
    difficolta: r.difficolta ?? '',
    tempoMinuti: r.tempo_minuti ?? params.tempoMassimoMin,
    kcal: r.kcal ?? 0,
    proteineG: r.proteine_g ?? 0,
    compatibileIntolleranze: r.compatibile_intolleranze ?? true,
    ingredienti: (r.ingredienti ?? []).map((i: any) => ({ nome: i?.nome ?? '', quantita: i?.quantita ?? '' })),
    passaggi: Array.isArray(r.passaggi) ? r.passaggi.map((p: any) => String(p)) : [],
    tipDelloChef: r.tip_dello_chef ?? '',
  };
}
