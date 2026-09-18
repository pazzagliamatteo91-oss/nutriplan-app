// Wellness Engine: sincronizzazione IA di allenamento + nutrizione + lista
// della spesa + analisi ematiche in un'unica chiamata a Claude. Pensato come
// azione esplicita ("Sincronizza tutto" in Home), separata dal generatore di
// sole schede di allenamento (src/data/aiWorkoutClient.ts): unire tutto in
// ogni interazione sarebbe più costoso e più lento senza un reale bisogno.
//
// Stessa scelta tecnica del client dell'allenamento: fetch verso l'endpoint
// REST invece dell'SDK ufficiale, perché Metro/Hermes (React Native) non
// supporta i moduli Node richiesti da @anthropic-ai/sdk.

import {
  CarichiRiferimento,
  MetricheSmartwatch,
  WellnessAnalisiInput,
  WellnessEcosistema,
  WellnessSyncInput,
} from './types';
import { AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from './aiWorkoutClient';

export { AiWorkoutError, hasAiApiKeyConfigured };
export type { AiWorkoutErrorCode };

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-opus-5';
const REQUEST_TIMEOUT_MS = 120000;

const SYSTEM_PROMPT = `Sei "Wellness Engine AI", l'intelligenza artificiale centrale di un'app di benessere olistico e performance atletica. Il tuo obiettivo è analizzare in modo incrociato nutrizione, preparazione atletica e biometria per creare un ecosistema sincronizzato per l'utente.

Non fornisci mai una diagnosi medica: gli output del modulo analisi ematiche sono spunti informativi da valutare con un professionista sanitario, mai istruzioni cliniche dirette.

Operi esclusivamente su 5 discipline sportive target:
1. CORSA
2. CICLISMO
3. PALESTRA / BODYWEIGHT
4. CROSSFIT
5. HYROX

### REGOLE:
1. MODULO ALLENAMENTO:
   - Genera la scheda richiesta (numero da 1 a 10) in base al livello, all'obiettivo e al tipo di sessione (Specifico o Supporto).
   - Adatta volumi, pesi target (basandoti sui carichi di riferimento forniti, se presenti) e intensità (RPE) in base alle metriche dello smartwatch e al feedback RPE precedente.
   - Per Hyrox/CrossFit focalizzati su stazioni ufficiali e lavoro accessorio/articolare.
   - Per Corsa/Ciclismo crea sessioni di supporto orientate alla prevenzione infortuni e alla stabilità del core.

2. MODULO NUTRIZIONE & RICETTE:
   - Non calcolare il fabbisogno calorico/macro da zero: parti SEMPRE dai valori in <baseline_nutrizionale> (calcolati deterministicamente dall'app) e applica solo un aggiustamento (delta) motivato dal volume di allenamento previsto oggi. Riporta sia il baseline sia l'aggiustamento applicato, in modo trasparente.
   - ESCLUDI rigorosamente gli ingredienti legati alle intolleranze/allergie dichiarate.
   - Proponi ricette con tempi di preparazione e valori nutrizionali indicativi (kcal/macro sono stime, non misurazioni di laboratorio).

3. MODULO SPESA:
   - Genera la lista della spesa aggregando gli ingredienti dei pasti che generi in "piano_nutrizionale_oggi" in questa stessa risposta, sommando le quantità ed eliminando i doppioni.
   - La lista copre SOLO la giornata odierna (non hai visibilità sugli altri giorni della settimana): dichiara sempre "solo_oggi" nel campo "copertura".

4. MODULO ANALISI EMATICHE:
   - Analizza SOLO i parametri effettivamente presenti in <analisi_ematiche_recenti>. Se il tag è assente o vuoto, restituisci stato_generale: "Nessun dato disponibile" e anomalie_rilevate: [].
   - Per ogni parametro fuori range, proponi uno spunto nutrizionale/esercitativo PLAUSIBILE da discutere con un professionista sanitario — mai una prescrizione né un'ipotesi diagnostica.

5. LINGUA: rispondi in tutti i campi testuali nella lingua indicata da <lingua> ("it" oppure "en").

### FORMATO DI RISPOSTA RICHIESTO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON valido (nessun testo prima o dopo, nessun blocco di codice markdown), organizzato con questa identica struttura di chiavi:

{
  "ecosistema_wellness": {
    "profilo_aggiornato": {
      "fabbisogno_kcal_baseline": 0,
      "aggiustamento_kcal_applicato": "string (es. +150 kcal per allenamento Specifico di 60min)",
      "fabbisogno_kcal_oggi": 0,
      "proteine_target_g": 0,
      "carboidrati_target_g": 0,
      "grassi_target_g": 0,
      "insight_ai_giornaliero": "string"
    },
    "allenamento": {
      "sport": "string",
      "tipo_sessione": "string",
      "numero_scheda": 0,
      "focus_tecnico": "string",
      "adattamento_smartwatch_applicato": "string",
      "riscaldamento": [
        { "esercizio": "string", "durata_o_rip": "string" }
      ],
      "blocco_principale": [
        {
          "nome_esercizio": "string",
          "serie": 0,
          "ripetizioni": "string",
          "recupero_secondi": 0,
          "rpe_target": 0,
          "carico_suggerito": "string",
          "tempo_esecutivo": "string",
          "motivo_biomeccanico": "string"
        }
      ],
      "defaticamento": [
        { "esercizio": "string", "durata": "string" }
      ]
    },
    "piano_nutrizionale_oggi": [
      {
        "pasto": "string",
        "nome_ricetta": "string",
        "tempo_preparazione_min": 0,
        "kcal": 0,
        "compatibile_intolleranze": true,
        "ingredienti": [
          { "nome": "string", "quantita_g": 0 }
        ]
      }
    ],
    "lista_spesa": {
      "copertura": "string (\\"solo_oggi\\" oppure \\"settimana_completa\\")",
      "categorie": [
        {
          "categoria": "string",
          "elementi": [
            { "ingrediente": "string", "quantita_totale": "string" }
          ]
        }
      ]
    },
    "analisi_ematiche_report": {
      "disclaimer": "Questi spunti non sostituiscono il parere di un professionista sanitario.",
      "stato_generale": "string",
      "anomalie_rilevate": [
        { "parametro": "string", "valore_rilevato": "string", "spunto_da_discutere_col_medico": "string" }
      ]
    }
  }
}`;

function formatCarichi(c: CarichiRiferimento): string {
  if (c.corpoLibero) return 'A corpo libero (nessun sovraccarico dichiarato)';
  const parts: string[] = [];
  if (c.squatKg != null) parts.push(`Squat: ${c.squatKg}kg`);
  if (c.panca_kg != null) parts.push(`Panca: ${c.panca_kg}kg`);
  if (c.stacco_kg != null) parts.push(`Stacco: ${c.stacco_kg}kg`);
  return parts.length ? parts.join(', ') : 'Non specificati';
}

function formatSmartwatch(m: MetricheSmartwatch | null): string {
  if (!m) return 'Nessun dato smartwatch disponibile';
  const parts: string[] = [];
  if (m.hrMediaBpm != null) parts.push(`FC media: ${m.hrMediaBpm} bpm`);
  if (m.hrPiccoBpm != null) parts.push(`FC picco: ${m.hrPiccoBpm} bpm`);
  if (m.hrv != null) parts.push(`HRV: ${m.hrv}`);
  if (m.calorie != null) parts.push(`Calorie: ${m.calorie}`);
  if (m.rpePercepito != null) parts.push(`RPE percepito: ${m.rpePercepito}/10`);
  if (m.recuperoInsufficiente) parts.push('recupero insufficiente segnalato');
  return parts.length ? parts.join(', ') : 'Nessun dato smartwatch disponibile';
}

function formatAnalisi(items: WellnessAnalisiInput[]): string | null {
  if (!items.length) return null;
  return items.map((a) => `${a.parametro}: ${a.valore} ${a.unita} (${a.stato}, range ${a.rangeMin}-${a.rangeMax})`).join('; ');
}

function buildUserContextXml(input: WellnessSyncInput): string {
  const profiloLine = `Nome: ${input.profilo.nome}, Età: ${input.profilo.eta}, Peso: ${input.profilo.pesoKg} kg, Altezza: ${input.profilo.altezzaCm} cm, Stile di vita: ${input.profilo.stileVita}, Obiettivo: ${input.profilo.obiettivo}`;
  const intolleranzeLine = input.intolleranzeAllergie.length ? input.intolleranzeAllergie.join(', ') : 'Nessuna';
  const baselineLine = `Kcal baseline: ${input.baselineNutrizionale.kcal}, Proteine baseline: ${input.baselineNutrizionale.proteineG} g`;
  const allenamentoLine = `Sport attivo: ${input.sport}, Livello: ${input.livello}, Tipo sessione: ${input.tipoSessione}, Numero scheda: ${input.numeroScheda}`;
  const analisiLine = formatAnalisi(input.analisiEmaticheRecenti);

  const lines = [
    `<profilo>${profiloLine}</profilo>`,
    `<intolleranze_allergie>${intolleranzeLine}</intolleranze_allergie>`,
    `<lingua>${input.lingua}</lingua>`,
    `<baseline_nutrizionale>${baselineLine}</baseline_nutrizionale>`,
    analisiLine ? `<analisi_ematiche_recenti>${analisiLine}</analisi_ematiche_recenti>` : null,
    `<allenamento_richiesta>${allenamentoLine}</allenamento_richiesta>`,
    `<smartwatch_ultimo_workout>${formatSmartwatch(input.metricheSmartwatch)}</smartwatch_ultimo_workout>`,
    `<carichi_riferimento>${formatCarichi(input.carichiIniziali)}</carichi_riferimento>`,
    `<attrezzatura_disponibile>${input.attrezzatura || 'Non specificata'}</attrezzatura_disponibile>`,
    input.limitazioni ? `<limitazioni>${input.limitazioni}</limitazioni>` : null,
  ].filter((line): line is string => line !== null);

  return `<user_context>\n${lines.join('\n')}\n</user_context>`;
}

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

export async function generateWellnessSync(input: WellnessSyncInput): Promise<WellnessEcosistema> {
  const apiKey = getApiKey();
  const userMessage = buildUserContextXml(input);

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
        max_tokens: 8000,
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

  const eco = parsed?.ecosistema_wellness;
  if (!eco) throw new AiWorkoutError('invalid_schema');

  const profiloAggiornato = eco.profilo_aggiornato ?? {};
  const allenamento = eco.allenamento ?? {};
  const listaSpesa = eco.lista_spesa ?? {};
  const analisi = eco.analisi_ematiche_report ?? {};

  return {
    profiloAggiornato: {
      fabbisognoKcalBaseline: profiloAggiornato.fabbisogno_kcal_baseline ?? input.baselineNutrizionale.kcal,
      aggiustamentoKcalApplicato: profiloAggiornato.aggiustamento_kcal_applicato ?? '',
      fabbisognoKcalOggi: profiloAggiornato.fabbisogno_kcal_oggi ?? input.baselineNutrizionale.kcal,
      proteineTargetG: profiloAggiornato.proteine_target_g ?? input.baselineNutrizionale.proteineG,
      carboidratiTargetG: profiloAggiornato.carboidrati_target_g ?? 0,
      grassiTargetG: profiloAggiornato.grassi_target_g ?? 0,
      insightAiGiornaliero: profiloAggiornato.insight_ai_giornaliero ?? '',
    },
    allenamento: {
      sport: allenamento.sport ?? input.sport,
      tipoSessione: allenamento.tipo_sessione ?? input.tipoSessione,
      numeroScheda: allenamento.numero_scheda ?? input.numeroScheda,
      focusTecnico: allenamento.focus_tecnico ?? '',
      adattamentoSmartwatchApplicato: allenamento.adattamento_smartwatch_applicato ?? '',
      riscaldamento: (allenamento.riscaldamento ?? []).map((r: any) => ({
        esercizio: r?.esercizio ?? '',
        durataORip: r?.durata_o_rip ?? '',
      })),
      bloccoPrincipale: (allenamento.blocco_principale ?? []).map((e: any) => ({
        nomeEsercizio: e?.nome_esercizio ?? '',
        serie: e?.serie ?? 0,
        ripetizioni: e?.ripetizioni ?? '',
        recuperoSecondi: e?.recupero_secondi ?? 0,
        rpeTarget: e?.rpe_target ?? 0,
        caricoSuggerito: e?.carico_suggerito ?? '',
        tempoEsecutivo: e?.tempo_esecutivo ?? '',
        motivoBiomeccanico: e?.motivo_biomeccanico ?? '',
      })),
      defaticamento: (allenamento.defaticamento ?? []).map((d: any) => ({
        esercizio: d?.esercizio ?? '',
        durata: d?.durata ?? '',
      })),
    },
    pianoNutrizionaleOggi: (eco.piano_nutrizionale_oggi ?? []).map((p: any) => ({
      pasto: p?.pasto ?? '',
      nomeRicetta: p?.nome_ricetta ?? '',
      tempoPreparazioneMin: p?.tempo_preparazione_min ?? 0,
      kcal: p?.kcal ?? 0,
      compatibileIntolleranze: p?.compatibile_intolleranze ?? true,
      ingredienti: (p?.ingredienti ?? []).map((i: any) => ({
        nome: i?.nome ?? '',
        quantitaG: i?.quantita_g ?? 0,
      })),
    })),
    listaSpesa: {
      copertura: listaSpesa.copertura ?? 'solo_oggi',
      categorie: (listaSpesa.categorie ?? []).map((c: any) => ({
        categoria: c?.categoria ?? '',
        elementi: (c?.elementi ?? []).map((el: any) => ({
          ingrediente: el?.ingrediente ?? '',
          quantitaTotale: el?.quantita_totale ?? '',
        })),
      })),
    },
    analisiEmaticheReport: {
      disclaimer: analisi.disclaimer ?? 'Questi spunti non sostituiscono il parere di un professionista sanitario.',
      statoGenerale: analisi.stato_generale ?? 'Nessun dato disponibile',
      anomalieRilevate: (analisi.anomalie_rilevate ?? []).map((a: any) => ({
        parametro: a?.parametro ?? '',
        valoreRilevato: a?.valore_rilevato ?? '',
        spuntoDaDiscuterreColMedico: a?.spunto_da_discutere_col_medico ?? '',
      })),
    },
  };
}
