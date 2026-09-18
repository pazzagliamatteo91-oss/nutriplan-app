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

const SYSTEM_PROMPT = `Sei uno chef e nutrizionista esperto. Il tuo compito è creare UNA ricetta reale, pratica e gustosa, con ingredienti facilmente reperibili al supermercato, rispettando rigorosamente i vincoli forniti dall'utente.

### REGOLE:
- ESCLUDI TASSATIVAMENTE ogni ingrediente collegato alle intolleranze/allergie indicate. Se non sei certo che un ingrediente sia sicuro, non usarlo.
- Il tempo di preparazione totale non deve superare i minuti indicati.
- Se è fornito un target di kcal, avvicinati il più possibile (tolleranza ragionevole); se non è fornito, scegli un valore sensato per il tipo di pasto.
- Se è indicata una cucina, la ricetta deve essere coerente con quello stile gastronomico; se non è indicata, scegli tu liberamente in base al tipo di pasto e alle eventuali note.
- Ingredienti con quantità precise per UNA porzione. Passaggi di preparazione chiari, in ordine, realmente eseguibili.
- Rispondi in tutti i campi testuali nella lingua indicata.

### FORMATO DI RISPOSTA RICHIESTO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido (nessun testo prima o dopo, nessun blocco di codice markdown):

{
  "ricetta": {
    "nome": "string",
    "cucina": "string",
    "tag_dietetico": "string (es. Vegetariano, Vegano, Carne, Pesce)",
    "tempo_minuti": 0,
    "kcal": 0,
    "proteine_g": 0,
    "compatibile_intolleranze": true,
    "ingredienti": [
      { "nome": "string", "quantita": "string" }
    ],
    "passaggi": ["string"]
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

function buildUserMessage(params: AiRecipeRequestParams): string {
  const lines = [
    `Tipo pasto: ${params.tipoPasto}`,
    `Cucina preferita: ${params.cucina || 'Nessuna preferenza, scegli tu'}`,
    `Tempo massimo di preparazione: ${params.tempoMassimoMin} minuti`,
    `Target kcal: ${params.kcalTarget != null ? `${params.kcalTarget} kcal` : 'Nessun vincolo specifico'}`,
    `Intolleranze/allergie da escludere: ${params.intolleranzeAllergie.length ? params.intolleranzeAllergie.join(', ') : 'Nessuna'}`,
    `Note aggiuntive: ${params.note || 'Nessuna'}`,
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
    tempoMinuti: r.tempo_minuti ?? params.tempoMassimoMin,
    kcal: r.kcal ?? 0,
    proteineG: r.proteine_g ?? 0,
    compatibileIntolleranze: r.compatibile_intolleranze ?? true,
    ingredienti: (r.ingredienti ?? []).map((i: any) => ({ nome: i?.nome ?? '', quantita: i?.quantita ?? '' })),
    passaggi: Array.isArray(r.passaggi) ? r.passaggi.map((p: any) => String(p)) : [],
  };
}
