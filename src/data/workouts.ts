import { IconName } from '../components/Icon';
import { WorkoutDay, WorkoutLevel } from './types';
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

const SPECIFICO_TEMPLATES: Record<string, string> = {
  corsa: 'Serie di ripetute e allunghi specifici per la corsa',
  ciclismo: 'Uscita con variazioni di ritmo e salite',
  nuoto: 'Serie in vasca su stile libero e tecnica',
  tennis: 'Esercitazioni tecniche di dritto, rovescio e servizio',
  palestra: 'Scheda di forza su multi-frequenza',
  yoga: 'Sequenza di asana e lavoro sulla respirazione',
  calcio: 'Esercitazioni tattiche e possesso palla',
};

const SUPPORTO_TEMPLATES: Record<string, string> = {
  corsa: 'Rinforzo core e mobilità articolare',
  ciclismo: 'Lavoro di forza per gambe e core',
  nuoto: 'Mobilità di spalle e potenziamento a secco',
  tennis: 'Lavoro cardio e reattività',
  palestra: 'Cardio complementare e stretching',
  yoga: 'Camminata leggera e respirazione guidata',
  calcio: 'Cardio aerobico e prevenzione infortuni',
};

const LEVEL_INTENSITY: Record<WorkoutLevel, { sessioniSettimana: number; durata: number }> = {
  Base: { sessioniSettimana: 3, durata: 30 },
  Intermedio: { sessioniSettimana: 4, durata: 40 },
  Avanzato: { sessioniSettimana: 5, durata: 55 },
  Agonista: { sessioniSettimana: 6, durata: 75 },
};

export function specificoLabel(sportId: string): string {
  return SPECIFICO_TEMPLATES[sportId] ?? `Allenamento tecnico specifico: ${sportId}`;
}

export function supportoLabel(sportId: string): string {
  return SUPPORTO_TEMPLATES[sportId] ?? 'Cardio e potenziamento complementare';
}

// Scheda dettagliata giorno per giorno: presentata come sincronizzata da una libreria
// di allenamenti online (da collegare a un servizio/API reale in produzione).
export function generateWeekPlan(sportId: string, level: WorkoutLevel): WorkoutDay[] {
  const { sessioniSettimana, durata } = LEVEL_INTENSITY[level];
  const specifico = specificoLabel(sportId);
  const supporto = supportoLabel(sportId);

  return WEEKDAYS.map((giorno, index) => {
    const isTrainingDay = index % Math.ceil(7 / sessioniSettimana) === 0 && index < 7;
    if (!isTrainingDay) {
      return { giorno, tipo: 'Riposo', descrizione: 'Recupero attivo o riposo completo', durataMinuti: 0 };
    }
    const isSupporto = index % 4 === 3;
    return {
      giorno,
      tipo: isSupporto ? 'Supporto' : 'Specifico',
      descrizione: isSupporto ? supporto : specifico,
      durataMinuti: durata,
    };
  });
}
