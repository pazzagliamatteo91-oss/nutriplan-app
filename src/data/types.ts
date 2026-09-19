import { Bilingual } from '../i18n/types';
export type { Bilingual };

export function bi(it: string, en: string): Bilingual {
  return { it, en };
}

export type MealType = 'colazione' | 'pranzo' | 'spuntino' | 'cena';
export type DietTag = 'Vegetariano' | 'Vegano' | 'Carne' | 'Pesce';

export type Ingredient = { nome: Bilingual; quantita: Bilingual };

export type Recipe = {
  id: string;
  nome: Bilingual;
  tipoPasto: MealType;
  cucina: string; // id in CUISINES_WITH_RECIPES
  tagDietetico: DietTag;
  tempoMinuti: number;
  kcal: number;
  lattosio: boolean;
  fruttaAGuscio: boolean;
  crostacei: boolean;
  glutine: boolean;
  alcol: boolean;
  ingredienti: Ingredient[];
  passaggiSintetici: Bilingual[];
  passaggiDettagliati: Bilingual[];
};

// Carichi di riferimento dell'utente per gli esercizi con sovraccarico
// (usati dal motore IA per calcolare il carico target: es. "75% dello squat").
export type CarichiRiferimento = {
  squatKg: number | null;
  panca_kg: number | null;
  stacco_kg: number | null;
  corpoLibero: boolean;
};

// Metriche dell'ultimo allenamento rilevate da smartwatch/percezione utente,
// usate dal motore IA per adattare il carico della scheda successiva.
export type MetricheSmartwatch = {
  data: string; // 'YYYY-MM-DD'
  hrMediaBpm: number | null;
  hrPiccoBpm: number | null;
  hrv: number | null;
  calorie: number | null;
  rpePercepito: number | null; // 1-10
  recuperoInsufficiente: boolean;
};

export type UserProfile = {
  nome: string;
  avatarUri: string | null;
  avatarIcon: string | null;
  eta: number;
  pesoKg: number;
  altezzaCm: number;
  kcalGiorno: number;
  proteineGiorno: number;
  stileVita: string;
  obiettivo: string;
  intolleranze: string[];
  allergie: string[];
  cucinePreferite: string[];
  restrizioni: string[];
  sportPreferiti: string[];
  giorniSpesa: string[];
  dispositivi: Record<string, boolean>;
  onboardingCompletato: boolean;
  carichiRiferimento: CarichiRiferimento;
  ultimaSessioneSmartwatch: MetricheSmartwatch | null;
};

export type WorkoutLogEntry = { data: string; sportId: string };

export type AnalysisStatus = 'basso' | 'normale' | 'alto' | 'manuale';

// Punto storico: una lettura precedente del parametro, con la data in cui era il valore corrente.
export type AnalysisHistoryPoint = { data: string; valore: number };

export type AnalysisValue = {
  id: string;
  parametro: Bilingual;
  unita: string;
  rangeMin: number;
  rangeMax: number;
  valore: number | null;
  stato: AnalysisStatus;
  nota: Bilingual;
  entryDate: string | null; // 'YYYY-MM-DD' di quando è stato registrato il valore corrente
  history: AnalysisHistoryPoint[]; // letture precedenti, più vecchie del valore corrente
};

export type WorkoutLevel = 'Base' | 'Intermedio' | 'Avanzato' | 'Agonista';

export type WorkoutSessionType = 'Specifico' | 'Supporto';

export type Exercise = {
  nome: Bilingual;
  dettaglio: Bilingual;
};

export type WorkoutDay = {
  giorno: string;
  isRiposo: boolean;
  specifico: { descrizione: Bilingual; durataMinuti: number; esercizi: Exercise[] };
  supporto: { descrizione: Bilingual; durataMinuti: number; esercizi: Exercise[] };
};

// --- Motore dei contenuti delle schede (moduli a scelta, stile preparatore atletico) ---

export type SessionPhase = 'riscaldamento' | 'centrale' | 'defaticamento';

// Un modulo è una delle opzioni tra cui l'utente può scegliere per la
// scheda Focus (Preparatoria/Specifica) o Supporto, con contenuto reale
// diviso in 3 fasi e diverso per ciascun livello.
export type WorkoutModule = {
  id: string;
  nome: Bilingual;
  descrizione: Bilingual;
  fasi: Record<SessionPhase, Exercise[]>;
};

export type ModulesByLevel = Record<WorkoutLevel, WorkoutModule[]>;

// Libreria di contenuti di uno sport: per gli sport di squadra "focus" è la
// Scheda Preparatoria (performance in campo), per gli sport individuali è la
// Scheda Specifica (tecnica/performance); "supporto" è sempre la scheda di
// forza/compensazione, con etichette diverse a seconda del tipo di sport.
export type SportWorkoutLibrary = {
  sportId: string;
  isSportDiSquadra: boolean;
  focusLabel: Bilingual;
  supportoLabel: Bilingual;
  focus: ModulesByLevel;
  supporto: ModulesByLevel;
};

// --- Motore IA (Anthropic Claude): scheda generata in tempo reale ---

export const AI_WORKOUT_SPORTS = ['corsa', 'ciclismo', 'nuoto', 'palestra', 'functional-training', 'hyrox', 'pilates'] as const;
export type AiWorkoutSport = (typeof AI_WORKOUT_SPORTS)[number];

export type AiWorkoutObiettivo =
  | 'Forza'
  | 'Ipertrofia'
  | 'Resistenza Lattacida'
  | 'Prevenzione Infortuni'
  | 'Performance Hyrox';

export type AiWorkoutRequestParams = {
  sport: AiWorkoutSport;
  livello: WorkoutLevel;
  obiettivo: AiWorkoutObiettivo;
  tipoSessione: WorkoutSessionType;
  numeroScheda: number; // 1-10
  tempoMinuti: number;
  attrezzatura: string;
  carichiIniziali: CarichiRiferimento;
  metricheSmartwatch: MetricheSmartwatch | null;
  limitazioni: string;
};

export type AiRiscaldamentoItem = {
  esercizio: string;
  durataORip: string;
  focusTecnico: string;
};

export type AiEsercizioPrincipale = {
  nomeEsercizio: string;
  serie: number;
  ripetizioni: string;
  recuperoSecondi: number;
  rpeTarget: number;
  suggerimentoCarico: string;
  progressioneProssimaSessione: string;
  tempoEsecutivo: string;
  motivoBiomeccanico: string;
  noteEsecuzione: string;
};

export type AiDefaticamentoItem = {
  esercizio: string;
  durata: string;
};

export type AiWorkoutPlan = {
  sport: string;
  livello: string;
  tipoSessione: string;
  numeroSchedaAttuale: number;
  totaleSchedeCiclo: number;
  focusFaseAttuale: string;
  adattamentoCaricoSmartwatch: string;
  riscaldamento: AiRiscaldamentoItem[];
  bloccoPrincipale: AiEsercizioPrincipale[];
  defaticamentoMobilita: AiDefaticamentoItem[];
};

// --- Wellness Engine IA: sincronizzazione allenamento + nutrizione + spesa + analisi ---

export type WellnessSyncRequestParams = {
  sport: AiWorkoutSport;
  livello: WorkoutLevel;
  tipoSessione: WorkoutSessionType;
  numeroScheda: number;
  attrezzatura: string;
  limitazioni: string;
  lingua: 'it' | 'en';
};

export type WellnessAnalisiInput = {
  parametro: string;
  valore: number;
  unita: string;
  rangeMin: number;
  rangeMax: number;
  stato: string;
};

export type WellnessSyncInput = WellnessSyncRequestParams & {
  profilo: {
    nome: string;
    eta: number;
    pesoKg: number;
    altezzaCm: number;
    stileVita: string;
    obiettivo: string;
  };
  intolleranzeAllergie: string[];
  baselineNutrizionale: { kcal: number; proteineG: number };
  analisiEmaticheRecenti: WellnessAnalisiInput[];
  metricheSmartwatch: MetricheSmartwatch | null;
  carichiIniziali: CarichiRiferimento;
};

export type WellnessProfiloAggiornato = {
  fabbisognoKcalBaseline: number;
  aggiustamentoKcalApplicato: string;
  fabbisognoKcalOggi: number;
  proteineTargetG: number;
  carboidratiTargetG: number;
  grassiTargetG: number;
  insightAiGiornaliero: string;
};

export type WellnessAllenamento = {
  sport: string;
  tipoSessione: string;
  numeroScheda: number;
  focusTecnico: string;
  adattamentoSmartwatchApplicato: string;
  riscaldamento: { esercizio: string; durataORip: string }[];
  bloccoPrincipale: {
    nomeEsercizio: string;
    serie: number;
    ripetizioni: string;
    recuperoSecondi: number;
    rpeTarget: number;
    caricoSuggerito: string;
    tempoEsecutivo: string;
    motivoBiomeccanico: string;
  }[];
  defaticamento: { esercizio: string; durata: string }[];
};

export type WellnessIngrediente = { nome: string; quantitaG: number };

export type WellnessPastoGenerato = {
  pasto: string;
  nomeRicetta: string;
  tempoPreparazioneMin: number;
  kcal: number;
  compatibileIntolleranze: boolean;
  ingredienti: WellnessIngrediente[];
};

export type WellnessListaSpesaCategoria = {
  categoria: string;
  elementi: { ingrediente: string; quantitaTotale: string }[];
};

export type WellnessListaSpesa = {
  copertura: string;
  categorie: WellnessListaSpesaCategoria[];
};

export type WellnessAnomaliaEmatica = {
  parametro: string;
  valoreRilevato: string;
  spuntoDaDiscuterreColMedico: string;
};

export type WellnessAnalisiEmaticheReport = {
  disclaimer: string;
  statoGenerale: string;
  anomalieRilevate: WellnessAnomaliaEmatica[];
};

export type WellnessEcosistema = {
  profiloAggiornato: WellnessProfiloAggiornato;
  allenamento: WellnessAllenamento;
  pianoNutrizionaleOggi: WellnessPastoGenerato[];
  listaSpesa: WellnessListaSpesa;
  analisiEmaticheReport: WellnessAnalisiEmaticheReport;
};

// --- Motore IA: generazione di una singola ricetta su misura ---

// trend = versione fit di un piatto virale/di tendenza del momento
// etnica = nuovo piatto fedele a una specifica cucina del mondo
// custom = ricetta libera (facoltativamente con cucina/ingredienti a scelta)
export type AiRecipeMode = 'trend' | 'etnica' | 'custom';

export type AiRecipeRequestParams = {
  modalita: AiRecipeMode;
  tipoPasto: MealType;
  cucina: string; // '' = nessuna preferenza, lascia scegliere all'IA (usato per 'etnica')
  tempoMassimoMin: number;
  kcalTarget: number | null; // null = nessun vincolo
  proteineTarget: number | null; // null = nessun vincolo
  note: string;
  stagione: string; // etichetta stagione corrente, per orientare gli ingredienti quando sensato
  lingua: 'it' | 'en';
  intolleranzeAllergie: string[];
};

export type AiRecipeIngrediente = { nome: string; quantita: string };

export type AiRecipeResult = {
  nome: string;
  cucina: string;
  tagDietetico: string;
  difficolta: string;
  tempoMinuti: number;
  kcal: number;
  proteineG: number;
  compatibileIntolleranze: boolean;
  ingredienti: AiRecipeIngrediente[];
  passaggi: string[];
  tipDelloChef: string;
};

// --- Motore IA: lettura ragionata delle analisi ematiche ---

export type AiAnalysisRequestParams = {
  note: string;
  lingua: 'it' | 'en';
};

export type AiAnalysisAnomalia = {
  parametro: string;
  valoreRilevato: string;
  spuntoDaDiscuterreColMedico: string;
};

export type AiAnalysisReport = {
  disclaimer: string;
  statoGenerale: string;
  suggerimentoGenerale: string;
  anomalieRilevate: AiAnalysisAnomalia[];
};

export type ShoppingItem = {
  id: string;
  nome: Bilingual;
  categoria: string;
  quantita: Bilingual;
  spuntato: boolean;
};

// Assegnazione di una ricetta a un pasto in una data specifica (piano pasti).
export type MealPlanEntry = {
  data: string; // 'YYYY-MM-DD'
  pasto: MealType;
  recipeId: string;
};

// Voce del diario alimentare: un alimento/pasto effettivamente registrato in una
// data, a differenza di MealPlanEntry che è solo una pianificazione futura.
export type DiaryEntry = {
  id: string;
  data: string; // 'YYYY-MM-DD'
  pasto: MealType;
  nome: Bilingual;
  kcal: number;
  proteine: number;
  recipeId: string | null; // null per le voci inserite manualmente
};
