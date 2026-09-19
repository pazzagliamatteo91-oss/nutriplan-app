import { IconName } from '../components/Icon';
import { WorkoutDay, WorkoutLevel, Exercise, Bilingual, bi, WorkoutLogEntry } from './types';
import { WEEKDAYS, sportDisplayName } from './constants';
import { toDateKey } from './mealPlan';

// Cronologia di esempio: allenamenti negli ultimi 28 giorni, alternati tra i due
// sport di default, con più sessioni nella settimana corrente rispetto alla
// precedente, cosi' l'anello di costanza mostra un miglioramento a scopo demo.
export function generateMockWorkoutLog(): WorkoutLogEntry[] {
  const entries: { n: number; sportId: string }[] = [
    { n: 1, sportId: 'corsa' },
    { n: 3, sportId: 'functional-training' },
    { n: 5, sportId: 'corsa' },
    { n: 9, sportId: 'corsa' },
    { n: 12, sportId: 'functional-training' },
    { n: 16, sportId: 'corsa' },
    { n: 20, sportId: 'functional-training' },
    { n: 23, sportId: 'corsa' },
    { n: 27, sportId: 'corsa' },
  ];
  return entries
    .map(({ n, sportId }) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return { data: toDateKey(d), sportId };
    })
    .sort((a, b) => a.data.localeCompare(b.data)); // ordine cronologico crescente: l'ultimo elemento è sempre il più recente
}

// Sessioni settimanali obiettivo per livello: usate per l'anello di costanza.
export const LEVEL_WEEKLY_GOAL: Record<WorkoutLevel, number> = {
  Base: 2,
  Intermedio: 3,
  Avanzato: 4,
  Agonista: 5,
};

export const WORKOUT_LEVELS: WorkoutLevel[] = ['Base', 'Intermedio', 'Avanzato', 'Agonista'];

export const SPORT_ICONS: Record<string, IconName> = {
  corsa: 'running',
  ciclismo: 'cycling',
  nuoto: 'swimming',
  'functional-training': 'gym',
  hyrox: 'kettlebell',
  pilates: 'pilatesRing',
};

const SPECIFICO_LABELS: Record<string, Bilingual> = {
  corsa: bi('Sessione tecnica di corsa', 'Running technical session'),
  ciclismo: bi('Uscita con variazioni di ritmo', 'Ride with pace variations'),
  nuoto: bi('Sessione tecnica in vasca', 'Technical pool session'),
  'functional-training': bi('Circuito funzionale ad alta intensità', 'High-intensity functional circuit'),
  hyrox: bi('Simulazione stazioni Hyrox', 'Hyrox station simulation'),
  pilates: bi('Sequenza di controllo e core', 'Control and core sequence'),
};

const SUPPORTO_LABELS: Record<string, Bilingual> = {
  corsa: bi('Rinforzo e mobilità', 'Strengthening and mobility'),
  ciclismo: bi('Forza per gambe e core', 'Strength for legs and core'),
  nuoto: bi('Mobilità e potenziamento a secco', 'Dryland mobility and conditioning'),
  'functional-training': bi('Mobilità e core', 'Mobility and core'),
  hyrox: bi('Forza per le stazioni', 'Strength for the stations'),
  pilates: bi('Camminata e respirazione', 'Walking and breathing'),
};

// --- Esercizi -----------------------------------------------------------
// Ogni esercizio è definito con valori "base" (livello Intermedio) che vengono
// scalati per livello con LEVEL_FACTORS, per evitare di scrivere a mano 4
// varianti per ognuno dei ~70 esercizi dei pool sport-specifici.
type ExerciseSpec =
  | { nome: Bilingual; kind: 'reps'; serie: number; ripetizioni: number; perLato?: boolean }
  | { nome: Bilingual; kind: 'time'; serie: number; secondi: number; perLato?: boolean }
  | { nome: Bilingual; kind: 'duration'; minuti: number }
  | { nome: Bilingual; kind: 'count'; conteggio: number }
  | { nome: Bilingual; kind: 'fixed'; dettaglio: Bilingual };

type LevelFactors = { serie: number; ripetizioni: number; secondi: number; minuti: number };

const LEVEL_FACTORS: Record<WorkoutLevel, LevelFactors> = {
  Base: { serie: 0.75, ripetizioni: 0.8, secondi: 0.75, minuti: 0.75 },
  Intermedio: { serie: 1, ripetizioni: 1, secondi: 1, minuti: 1 },
  Avanzato: { serie: 1.2, ripetizioni: 1.15, secondi: 1.25, minuti: 1.25 },
  Agonista: { serie: 1.4, ripetizioni: 1.3, secondi: 1.5, minuti: 1.5 },
};

function roundTo(value: number, step: number, min: number) {
  return Math.max(min, Math.round(value / step) * step);
}

function formatExercise(spec: ExerciseSpec, level: WorkoutLevel): Exercise {
  const f = LEVEL_FACTORS[level];
  switch (spec.kind) {
    case 'reps': {
      const serie = roundTo(spec.serie * f.serie, 1, 2);
      const rip = roundTo(spec.ripetizioni * f.ripetizioni, 1, 6);
      const suffixIt = spec.perLato ? ' per lato' : '';
      const suffixEn = spec.perLato ? ' per side' : '';
      return { nome: spec.nome, dettaglio: bi(`${serie}x${rip}${suffixIt}`, `${serie}x${rip}${suffixEn}`) };
    }
    case 'time': {
      const serie = roundTo(spec.serie * f.serie, 1, 2);
      const sec = roundTo(spec.secondi * f.secondi, 5, 15);
      const suffixIt = spec.perLato ? ' per lato' : '';
      const suffixEn = spec.perLato ? ' per side' : '';
      return { nome: spec.nome, dettaglio: bi(`${serie}x${sec}s${suffixIt}`, `${serie}x${sec}s${suffixEn}`) };
    }
    case 'duration': {
      const min = roundTo(spec.minuti * f.minuti, 5, 5);
      return { nome: spec.nome, dettaglio: bi(`${min} min`, `${min} min`) };
    }
    case 'count': {
      const conteggio = roundTo(spec.conteggio * f.ripetizioni, 1, 3);
      return { nome: spec.nome, dettaglio: bi(`${conteggio}x`, `${conteggio}x`) };
    }
    case 'fixed':
      return { nome: spec.nome, dettaglio: spec.dettaglio };
  }
}

type SportPools = { specifico: ExerciseSpec[]; supporto: ExerciseSpec[] };

const SPORT_POOLS: Record<string, SportPools> = {
  corsa: {
    specifico: [
      { nome: bi('Riscaldamento corsa leggera', 'Light warm-up run'), kind: 'duration', minuti: 10 },
      { nome: bi('Ripetute 400m a ritmo gara', '400m repeats at race pace'), kind: 'count', conteggio: 6 },
      { nome: bi('Recupero tra le ripetute', 'Recovery between repeats'), kind: 'fixed', dettaglio: bi('90s cammino', '90s walk') },
      { nome: bi('Progressivo a ritmo crescente', 'Progressive run with increasing pace'), kind: 'duration', minuti: 20 },
      { nome: bi('Allunghi 80m in leggera salita', '80m strides on a slight incline'), kind: 'count', conteggio: 6 },
      { nome: bi('Defaticamento corsa lenta', 'Slow cool-down run'), kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: bi('Plank', 'Plank'), kind: 'time', serie: 3, secondi: 30 },
      { nome: bi('Squat a corpo libero', 'Bodyweight squats'), kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: bi('Affondi alternati', 'Alternating lunges'), kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: bi('Hip thrust', 'Hip thrust'), kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: bi('Mobilità anca e caviglia', 'Hip and ankle mobility'), kind: 'duration', minuti: 8 },
      { nome: bi('Stretching gambe', 'Leg stretching'), kind: 'duration', minuti: 8 },
    ],
  },
  ciclismo: {
    specifico: [
      { nome: bi('Riscaldamento spinning leggero', 'Light spinning warm-up'), kind: 'duration', minuti: 15 },
      { nome: bi('Salite a soglia (8 min ciascuna)', 'Threshold climbs (8 min each)'), kind: 'count', conteggio: 4 },
      { nome: bi('Sprint massimali', 'Maximal sprints'), kind: 'time', serie: 6, secondi: 30 },
      { nome: bi('Cadenza alta (100+ rpm)', 'High cadence (100+ rpm)'), kind: 'duration', minuti: 15 },
      { nome: bi('Uscita a ritmo costante', 'Steady-pace ride'), kind: 'duration', minuti: 60 },
      { nome: bi('Defaticamento pedalata leggera', 'Light cool-down ride'), kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: bi('Squat a corpo libero', 'Bodyweight squats'), kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: bi('Affondi frontali', 'Forward lunges'), kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: bi('Plank laterale', 'Side plank'), kind: 'time', serie: 3, secondi: 30, perLato: true },
      { nome: bi('Stretching quadricipiti e polpacci', 'Quad and calf stretching'), kind: 'duration', minuti: 10 },
    ],
  },
  nuoto: {
    specifico: [
      { nome: bi('Riscaldamento misti', 'Warm-up medley'), kind: 'fixed', dettaglio: bi('400m', '400m') },
      { nome: bi('Serie stile libero 100m', 'Freestyle set 100m'), kind: 'count', conteggio: 8 },
      { nome: bi('Tecnica bracciata con tavoletta 50m', 'Stroke technique with kickboard 50m'), kind: 'count', conteggio: 6 },
      { nome: bi('Sprint vasca corta 25m', 'Short-course sprint 25m'), kind: 'count', conteggio: 4 },
      { nome: bi('Defaticamento a nuoto lento', 'Slow cool-down swim'), kind: 'fixed', dettaglio: bi('200m', '200m') },
    ],
    supporto: [
      { nome: bi('Elastici per spalle', 'Shoulder resistance bands'), kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: bi('Plank', 'Plank'), kind: 'time', serie: 3, secondi: 40 },
      { nome: bi('Mobilità spalle', 'Shoulder mobility'), kind: 'duration', minuti: 8 },
      { nome: bi('Russian twist', 'Russian twist'), kind: 'reps', serie: 3, ripetizioni: 20 },
    ],
  },
  'functional-training': {
    specifico: [
      { nome: bi('Riscaldamento dinamico', 'Dynamic warm-up'), kind: 'duration', minuti: 8 },
      { nome: bi('Kettlebell swing', 'Kettlebell swing'), kind: 'reps', serie: 4, ripetizioni: 15 },
      { nome: bi('Burpees', 'Burpees'), kind: 'reps', serie: 4, ripetizioni: 12 },
      { nome: bi('Circuito funzionale a stazioni', 'Functional station circuit'), kind: 'count', conteggio: 4 },
      { nome: bi('Defaticamento e mobilità', 'Cool-down and mobility'), kind: 'duration', minuti: 8 },
    ],
    supporto: [
      { nome: bi('Plank', 'Plank'), kind: 'time', serie: 3, secondi: 40 },
      { nome: bi('Mobilità anche e spalle', 'Hip and shoulder mobility'), kind: 'duration', minuti: 10 },
      { nome: bi('Stretching generale', 'General stretching'), kind: 'duration', minuti: 10 },
    ],
  },
  hyrox: {
    specifico: [
      { nome: bi('Riscaldamento corsa leggera', 'Light warm-up run'), kind: 'duration', minuti: 8 },
      { nome: bi('SkiErg', 'SkiErg'), kind: 'fixed', dettaglio: bi('1000 m', '1000 m') },
      { nome: bi('Corsa', 'Run'), kind: 'fixed', dettaglio: bi('1 km', '1 km') },
      { nome: bi('Sled push', 'Sled push'), kind: 'fixed', dettaglio: bi('50 m', '50 m') },
      { nome: bi('Sled pull', 'Sled pull'), kind: 'fixed', dettaglio: bi('50 m', '50 m') },
      { nome: bi('Burpee broad jump', 'Burpee broad jump'), kind: 'fixed', dettaglio: bi('40 m', '40 m') },
      { nome: bi('Farmers carry', 'Farmers carry'), kind: 'fixed', dettaglio: bi('200 m', '200 m') },
      { nome: bi('Wall balls', 'Wall balls'), kind: 'reps', serie: 1, ripetizioni: 75 },
      { nome: bi('Defaticamento corsa lenta', 'Slow cool-down run'), kind: 'duration', minuti: 8 },
    ],
    supporto: [
      { nome: bi('Squat a corpo libero', 'Bodyweight squats'), kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: bi('Affondi con zavorra', 'Weighted lunges'), kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: bi('Rematore con manubrio', 'Dumbbell row'), kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: bi('Mobilità anca e caviglia', 'Hip and ankle mobility'), kind: 'duration', minuti: 8 },
    ],
  },
  pilates: {
    specifico: [
      { nome: bi('Respirazione e attivazione core', 'Breathing and core activation'), kind: 'duration', minuti: 5 },
      { nome: bi('The Hundred', 'The Hundred'), kind: 'reps', serie: 1, ripetizioni: 100 },
      { nome: bi('Roll up', 'Roll up'), kind: 'reps', serie: 3, ripetizioni: 8 },
      { nome: bi('Leg circles', 'Leg circles'), kind: 'reps', serie: 3, ripetizioni: 10, perLato: true },
      { nome: bi('Swan', 'Swan'), kind: 'reps', serie: 3, ripetizioni: 8 },
      { nome: bi('Rilassamento finale', 'Final relaxation'), kind: 'duration', minuti: 5 },
    ],
    supporto: [
      { nome: bi('Camminata leggera', 'Light walk'), kind: 'duration', minuti: 15 },
      { nome: bi('Stretching dolce', 'Gentle stretching'), kind: 'duration', minuti: 10 },
    ],
  },
};

// Fallback per le ~90 discipline extra, che non hanno un pool dedicato.
const GENERIC_POOL: SportPools = {
  specifico: [
    { nome: bi('Riscaldamento specifico', 'Sport-specific warm-up'), kind: 'duration', minuti: 10 },
    { nome: bi('Lavoro tecnico di base', 'Basic technical work'), kind: 'duration', minuti: 20 },
    { nome: bi('Simulazione di gara o situazione reale', 'Race or real-situation simulation'), kind: 'duration', minuti: 20 },
    { nome: bi('Defaticamento', 'Cool-down'), kind: 'duration', minuti: 10 },
  ],
  supporto: [
    { nome: bi('Rinforzo core', 'Core strengthening'), kind: 'reps', serie: 3, ripetizioni: 15 },
    { nome: bi('Mobilità articolare', 'Joint mobility'), kind: 'duration', minuti: 10 },
    { nome: bi('Cardio leggero', 'Light cardio'), kind: 'duration', minuti: 15 },
  ],
};

function poolsFor(sportId: string): SportPools {
  return SPORT_POOLS[sportId] ?? GENERIC_POOL;
}

export function specificoLabel(sportId: string): Bilingual {
  const found = SPECIFICO_LABELS[sportId];
  if (found) return found;
  const name = sportDisplayName(sportId);
  return bi(`Sessione tecnica: ${name.it}`, `Technical session: ${name.en}`);
}

export function supportoLabel(sportId: string): Bilingual {
  return SUPPORTO_LABELS[sportId] ?? bi('Cardio e potenziamento complementare', 'Complementary cardio and conditioning');
}

// Elenco esercizi di una sessione, con serie/ripetizioni/durata scalate per livello.
export function getSessionExercises(sportId: string, level: WorkoutLevel, tipo: 'Specifico' | 'Supporto'): Exercise[] {
  const pool = tipo === 'Specifico' ? poolsFor(sportId).specifico : poolsFor(sportId).supporto;
  return pool.map((spec) => formatExercise(spec, level));
}

const LEVEL_INTENSITY: Record<WorkoutLevel, { sessioniSettimana: number }> = {
  Base: { sessioniSettimana: 3 },
  Intermedio: { sessioniSettimana: 4 },
  Avanzato: { sessioniSettimana: 5 },
  Agonista: { sessioniSettimana: 6 },
};

function totalMinutes(esercizi: Exercise[]): number {
  // Stima approssimativa: ogni esercizio "occupa" in media 6 minuti tra
  // esecuzione e recupero, usata solo per mostrare una durata complessiva.
  return Math.max(20, esercizi.length * 6);
}

const REST_DESCRIPTION: Bilingual = bi('Recupero attivo o riposo completo', 'Active recovery or full rest');

// Scheda dettagliata giorno per giorno: ogni giorno di allenamento porta con sé
// sia la sessione Specifico sia quella Supporto, così l'utente può passare
// dall'una all'altra per lo stesso giorno invece di vederne solo una.
export function generateWeekPlan(sportId: string, level: WorkoutLevel): WorkoutDay[] {
  const { sessioniSettimana } = LEVEL_INTENSITY[level];
  const specificoDesc = specificoLabel(sportId);
  const supportoDesc = supportoLabel(sportId);

  return WEEKDAYS.map((giorno, index) => {
    const isTrainingDay = index % Math.ceil(7 / sessioniSettimana) === 0 && index < 7;
    if (!isTrainingDay) {
      return {
        giorno,
        isRiposo: true,
        specifico: { descrizione: REST_DESCRIPTION, durataMinuti: 0, esercizi: [] },
        supporto: { descrizione: REST_DESCRIPTION, durataMinuti: 0, esercizi: [] },
      };
    }
    const specificoEsercizi = getSessionExercises(sportId, level, 'Specifico');
    const supportoEsercizi = getSessionExercises(sportId, level, 'Supporto');
    return {
      giorno,
      isRiposo: false,
      specifico: { descrizione: specificoDesc, durataMinuti: totalMinutes(specificoEsercizi), esercizi: specificoEsercizi },
      supporto: { descrizione: supportoDesc, durataMinuti: totalMinutes(supportoEsercizi), esercizi: supportoEsercizi },
    };
  });
}
