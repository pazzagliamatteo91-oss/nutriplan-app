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
    { n: 3, sportId: 'palestra' },
    { n: 5, sportId: 'corsa' },
    { n: 9, sportId: 'corsa' },
    { n: 12, sportId: 'palestra' },
    { n: 16, sportId: 'corsa' },
    { n: 20, sportId: 'palestra' },
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
  tennis: 'tennis',
  palestra: 'gym',
  yoga: 'yoga',
  calcio: 'soccer',
};

const SPECIFICO_LABELS: Record<string, Bilingual> = {
  corsa: bi('Sessione tecnica di corsa', 'Running technical session'),
  ciclismo: bi('Uscita con variazioni di ritmo', 'Ride with pace variations'),
  nuoto: bi('Sessione tecnica in vasca', 'Technical pool session'),
  tennis: bi('Sessione tecnica su campo', 'On-court technical session'),
  palestra: bi('Scheda di forza', 'Strength program'),
  yoga: bi('Sequenza di asana', 'Asana sequence'),
  calcio: bi('Sessione tecnico-tattica', 'Technical-tactical session'),
};

const SUPPORTO_LABELS: Record<string, Bilingual> = {
  corsa: bi('Rinforzo e mobilità', 'Strengthening and mobility'),
  ciclismo: bi('Forza per gambe e core', 'Strength for legs and core'),
  nuoto: bi('Mobilità e potenziamento a secco', 'Dryland mobility and conditioning'),
  tennis: bi('Cardio e reattività', 'Cardio and reactivity'),
  palestra: bi('Cardio complementare', 'Complementary cardio'),
  yoga: bi('Camminata e respirazione', 'Walking and breathing'),
  calcio: bi('Cardio e prevenzione infortuni', 'Cardio and injury prevention'),
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
  tennis: {
    specifico: [
      { nome: bi('Riscaldamento palleggi', 'Warm-up rallies'), kind: 'duration', minuti: 10 },
      { nome: bi('Dritto e rovescio cross court', 'Cross-court forehand and backhand'), kind: 'duration', minuti: 20 },
      { nome: bi('Servizio e risposta', 'Serve and return'), kind: 'duration', minuti: 20 },
      { nome: bi('Punti simulati', 'Simulated points'), kind: 'duration', minuti: 25 },
      { nome: bi('Footwork a scaletta', 'Ladder footwork'), kind: 'duration', minuti: 8 },
    ],
    supporto: [
      { nome: bi('Scatti laterali 20m', '20m lateral sprints'), kind: 'count', conteggio: 5 },
      { nome: bi('Plank con rotazione', 'Plank with rotation'), kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: bi('Squat jump', 'Squat jump'), kind: 'reps', serie: 3, ripetizioni: 10 },
      { nome: bi('Stretching spalle e polsi', 'Shoulder and wrist stretching'), kind: 'duration', minuti: 8 },
    ],
  },
  palestra: {
    specifico: [
      { nome: bi('Squat', 'Squat'), kind: 'reps', serie: 4, ripetizioni: 8 },
      { nome: bi('Panca piana', 'Bench press'), kind: 'reps', serie: 4, ripetizioni: 8 },
      { nome: bi('Stacco da terra', 'Deadlift'), kind: 'reps', serie: 3, ripetizioni: 6 },
      { nome: bi('Military press', 'Military press'), kind: 'reps', serie: 3, ripetizioni: 10 },
      { nome: bi('Trazioni o lat machine', 'Pull-ups or lat pulldown'), kind: 'reps', serie: 3, ripetizioni: 10 },
    ],
    supporto: [
      { nome: bi('Tapis roulant o cyclette moderato', 'Moderate treadmill or stationary bike'), kind: 'duration', minuti: 20 },
      { nome: bi('Plank', 'Plank'), kind: 'time', serie: 3, secondi: 45 },
      { nome: bi('Mobilità generale', 'General mobility'), kind: 'duration', minuti: 10 },
    ],
  },
  yoga: {
    specifico: [
      { nome: bi('Saluto al sole', 'Sun salutation'), kind: 'count', conteggio: 5 },
      { nome: bi('Sequenza guerriero I-II-III', 'Warrior I-II-III sequence'), kind: 'duration', minuti: 10 },
      { nome: bi('Posizioni di equilibrio (albero, sedia)', 'Balance poses (tree, chair)'), kind: 'duration', minuti: 8 },
      { nome: bi('Torsioni da seduti', 'Seated twists'), kind: 'duration', minuti: 8 },
      { nome: bi('Rilassamento finale (savasana)', 'Final relaxation (savasana)'), kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: bi('Camminata leggera', 'Light walk'), kind: 'duration', minuti: 20 },
      { nome: bi('Respirazione diaframmatica', 'Diaphragmatic breathing'), kind: 'duration', minuti: 10 },
      { nome: bi('Stretching dolce', 'Gentle stretching'), kind: 'duration', minuti: 10 },
    ],
  },
  calcio: {
    specifico: [
      { nome: bi('Riscaldamento con palla', 'Warm-up with the ball'), kind: 'duration', minuti: 10 },
      { nome: bi('Passaggi e controllo', 'Passing and ball control'), kind: 'duration', minuti: 20 },
      { nome: bi('Conduzione e dribbling', 'Dribbling and ball carrying'), kind: 'duration', minuti: 15 },
      { nome: bi('Tiri in porta', 'Shots on goal'), kind: 'duration', minuti: 15 },
      { nome: bi('Partitella a possesso palla', 'Possession small-sided game'), kind: 'duration', minuti: 20 },
    ],
    supporto: [
      { nome: bi('Scatti brevi 20m', '20m short sprints'), kind: 'count', conteggio: 6 },
      { nome: bi('Squat jump', 'Squat jump'), kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: bi('Plank', 'Plank'), kind: 'time', serie: 3, secondi: 40 },
      { nome: bi('Stretching gambe', 'Leg stretching'), kind: 'duration', minuti: 8 },
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
