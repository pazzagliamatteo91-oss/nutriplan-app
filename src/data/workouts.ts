import { IconName } from '../components/Icon';
import { WorkoutDay, WorkoutLevel, Exercise } from './types';
import { WEEKDAYS } from './constants';

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

const SPECIFICO_LABELS: Record<string, string> = {
  corsa: 'Sessione tecnica di corsa',
  ciclismo: 'Uscita con variazioni di ritmo',
  nuoto: 'Sessione tecnica in vasca',
  tennis: 'Sessione tecnica su campo',
  palestra: 'Scheda di forza',
  yoga: 'Sequenza di asana',
  calcio: 'Sessione tecnico-tattica',
};

const SUPPORTO_LABELS: Record<string, string> = {
  corsa: 'Rinforzo e mobilità',
  ciclismo: 'Forza per gambe e core',
  nuoto: 'Mobilità e potenziamento a secco',
  tennis: 'Cardio e reattività',
  palestra: 'Cardio complementare',
  yoga: 'Camminata e respirazione',
  calcio: 'Cardio e prevenzione infortuni',
};

// --- Esercizi -----------------------------------------------------------
// Ogni esercizio è definito con valori "base" (livello Intermedio) che vengono
// scalati per livello con LEVEL_FACTORS, per evitare di scrivere a mano 4
// varianti per ognuno dei ~70 esercizi dei pool sport-specifici.
type ExerciseSpec =
  | { nome: string; kind: 'reps'; serie: number; ripetizioni: number; perLato?: boolean }
  | { nome: string; kind: 'time'; serie: number; secondi: number; perLato?: boolean }
  | { nome: string; kind: 'duration'; minuti: number }
  | { nome: string; kind: 'count'; conteggio: number }
  | { nome: string; kind: 'fixed'; dettaglio: string };

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
      return { nome: spec.nome, dettaglio: `${serie}x${rip}${spec.perLato ? ' per lato' : ''}` };
    }
    case 'time': {
      const serie = roundTo(spec.serie * f.serie, 1, 2);
      const sec = roundTo(spec.secondi * f.secondi, 5, 15);
      return { nome: spec.nome, dettaglio: `${serie}x${sec}s${spec.perLato ? ' per lato' : ''}` };
    }
    case 'duration': {
      const min = roundTo(spec.minuti * f.minuti, 5, 5);
      return { nome: spec.nome, dettaglio: `${min} min` };
    }
    case 'count': {
      const conteggio = roundTo(spec.conteggio * f.ripetizioni, 1, 3);
      return { nome: spec.nome, dettaglio: `${conteggio}x` };
    }
    case 'fixed':
      return { nome: spec.nome, dettaglio: spec.dettaglio };
  }
}

type SportPools = { specifico: ExerciseSpec[]; supporto: ExerciseSpec[] };

const SPORT_POOLS: Record<string, SportPools> = {
  corsa: {
    specifico: [
      { nome: 'Riscaldamento corsa leggera', kind: 'duration', minuti: 10 },
      { nome: 'Ripetute 400m a ritmo gara', kind: 'count', conteggio: 6 },
      { nome: 'Recupero tra le ripetute', kind: 'fixed', dettaglio: '90s cammino' },
      { nome: 'Progressivo a ritmo crescente', kind: 'duration', minuti: 20 },
      { nome: 'Allunghi 80m in leggera salita', kind: 'count', conteggio: 6 },
      { nome: 'Defaticamento corsa lenta', kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: 'Plank', kind: 'time', serie: 3, secondi: 30 },
      { nome: 'Squat a corpo libero', kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: 'Affondi alternati', kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: 'Hip thrust', kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: 'Mobilità anca e caviglia', kind: 'duration', minuti: 8 },
      { nome: 'Stretching gambe', kind: 'duration', minuti: 8 },
    ],
  },
  ciclismo: {
    specifico: [
      { nome: 'Riscaldamento spinning leggero', kind: 'duration', minuti: 15 },
      { nome: 'Salite a soglia (8 min ciascuna)', kind: 'count', conteggio: 4 },
      { nome: 'Sprint massimali', kind: 'time', serie: 6, secondi: 30 },
      { nome: 'Cadenza alta (100+ rpm)', kind: 'duration', minuti: 15 },
      { nome: 'Uscita a ritmo costante', kind: 'duration', minuti: 60 },
      { nome: 'Defaticamento pedalata leggera', kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: 'Squat a corpo libero', kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: 'Affondi frontali', kind: 'reps', serie: 3, ripetizioni: 12, perLato: true },
      { nome: 'Plank laterale', kind: 'time', serie: 3, secondi: 30, perLato: true },
      { nome: 'Stretching quadricipiti e polpacci', kind: 'duration', minuti: 10 },
    ],
  },
  nuoto: {
    specifico: [
      { nome: 'Riscaldamento misti', kind: 'fixed', dettaglio: '400m' },
      { nome: 'Serie stile libero 100m', kind: 'count', conteggio: 8 },
      { nome: 'Tecnica bracciata con tavoletta 50m', kind: 'count', conteggio: 6 },
      { nome: 'Sprint vasca corta 25m', kind: 'count', conteggio: 4 },
      { nome: 'Defaticamento a nuoto lento', kind: 'fixed', dettaglio: '200m' },
    ],
    supporto: [
      { nome: 'Elastici per spalle', kind: 'reps', serie: 3, ripetizioni: 15 },
      { nome: 'Plank', kind: 'time', serie: 3, secondi: 40 },
      { nome: 'Mobilità spalle', kind: 'duration', minuti: 8 },
      { nome: 'Russian twist', kind: 'reps', serie: 3, ripetizioni: 20 },
    ],
  },
  tennis: {
    specifico: [
      { nome: 'Riscaldamento palleggi', kind: 'duration', minuti: 10 },
      { nome: 'Dritto e rovescio cross court', kind: 'duration', minuti: 20 },
      { nome: 'Servizio e risposta', kind: 'duration', minuti: 20 },
      { nome: 'Punti simulati', kind: 'duration', minuti: 25 },
      { nome: 'Footwork a scaletta', kind: 'duration', minuti: 8 },
    ],
    supporto: [
      { nome: 'Scatti laterali 20m', kind: 'count', conteggio: 5 },
      { nome: 'Plank con rotazione', kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: 'Squat jump', kind: 'reps', serie: 3, ripetizioni: 10 },
      { nome: 'Stretching spalle e polsi', kind: 'duration', minuti: 8 },
    ],
  },
  palestra: {
    specifico: [
      { nome: 'Squat', kind: 'reps', serie: 4, ripetizioni: 8 },
      { nome: 'Panca piana', kind: 'reps', serie: 4, ripetizioni: 8 },
      { nome: 'Stacco da terra', kind: 'reps', serie: 3, ripetizioni: 6 },
      { nome: 'Military press', kind: 'reps', serie: 3, ripetizioni: 10 },
      { nome: 'Trazioni o lat machine', kind: 'reps', serie: 3, ripetizioni: 10 },
    ],
    supporto: [
      { nome: 'Tapis roulant o cyclette moderato', kind: 'duration', minuti: 20 },
      { nome: 'Plank', kind: 'time', serie: 3, secondi: 45 },
      { nome: 'Mobilità generale', kind: 'duration', minuti: 10 },
    ],
  },
  yoga: {
    specifico: [
      { nome: 'Saluto al sole', kind: 'count', conteggio: 5 },
      { nome: 'Sequenza guerriero I-II-III', kind: 'duration', minuti: 10 },
      { nome: 'Posizioni di equilibrio (albero, sedia)', kind: 'duration', minuti: 8 },
      { nome: 'Torsioni da seduti', kind: 'duration', minuti: 8 },
      { nome: 'Rilassamento finale (savasana)', kind: 'duration', minuti: 10 },
    ],
    supporto: [
      { nome: 'Camminata leggera', kind: 'duration', minuti: 20 },
      { nome: 'Respirazione diaframmatica', kind: 'duration', minuti: 10 },
      { nome: 'Stretching dolce', kind: 'duration', minuti: 10 },
    ],
  },
  calcio: {
    specifico: [
      { nome: 'Riscaldamento con palla', kind: 'duration', minuti: 10 },
      { nome: 'Passaggi e controllo', kind: 'duration', minuti: 20 },
      { nome: 'Conduzione e dribbling', kind: 'duration', minuti: 15 },
      { nome: 'Tiri in porta', kind: 'duration', minuti: 15 },
      { nome: 'Partitella a possesso palla', kind: 'duration', minuti: 20 },
    ],
    supporto: [
      { nome: 'Scatti brevi 20m', kind: 'count', conteggio: 6 },
      { nome: 'Squat jump', kind: 'reps', serie: 3, ripetizioni: 12 },
      { nome: 'Plank', kind: 'time', serie: 3, secondi: 40 },
      { nome: 'Stretching gambe', kind: 'duration', minuti: 8 },
    ],
  },
};

// Fallback per le ~90 discipline extra, che non hanno un pool dedicato.
const GENERIC_POOL: SportPools = {
  specifico: [
    { nome: 'Riscaldamento specifico', kind: 'duration', minuti: 10 },
    { nome: 'Lavoro tecnico di base', kind: 'duration', minuti: 20 },
    { nome: 'Simulazione di gara o situazione reale', kind: 'duration', minuti: 20 },
    { nome: 'Defaticamento', kind: 'duration', minuti: 10 },
  ],
  supporto: [
    { nome: 'Rinforzo core', kind: 'reps', serie: 3, ripetizioni: 15 },
    { nome: 'Mobilità articolare', kind: 'duration', minuti: 10 },
    { nome: 'Cardio leggero', kind: 'duration', minuti: 15 },
  ],
};

function poolsFor(sportId: string): SportPools {
  return SPORT_POOLS[sportId] ?? GENERIC_POOL;
}

export function specificoLabel(sportId: string): string {
  return SPECIFICO_LABELS[sportId] ?? `Sessione tecnica: ${sportId}`;
}

export function supportoLabel(sportId: string): string {
  return SUPPORTO_LABELS[sportId] ?? 'Cardio e potenziamento complementare';
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

// Scheda dettagliata giorno per giorno, con esercizi concreti: presentata come
// sincronizzata da una libreria di allenamenti online (da collegare a un
// servizio/API reale in produzione).
export function generateWeekPlan(sportId: string, level: WorkoutLevel): WorkoutDay[] {
  const { sessioniSettimana } = LEVEL_INTENSITY[level];
  const specifico = specificoLabel(sportId);
  const supporto = supportoLabel(sportId);

  return WEEKDAYS.map((giorno, index) => {
    const isTrainingDay = index % Math.ceil(7 / sessioniSettimana) === 0 && index < 7;
    if (!isTrainingDay) {
      return { giorno, tipo: 'Riposo', descrizione: 'Recupero attivo o riposo completo', durataMinuti: 0, esercizi: [] };
    }
    const isSupporto = index % 4 === 3;
    const tipo = isSupporto ? 'Supporto' : 'Specifico';
    const esercizi = getSessionExercises(sportId, level, tipo);
    return {
      giorno,
      tipo,
      descrizione: isSupporto ? supporto : specifico,
      durataMinuti: totalMinutes(esercizi),
      esercizi,
    };
  });
}
