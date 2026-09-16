export type MealType = 'colazione' | 'pranzo' | 'spuntino' | 'cena';
export type DietTag = 'Vegetariano' | 'Vegano' | 'Carne' | 'Pesce';

export type Ingredient = { nome: string; quantita: string };

export type Recipe = {
  id: string;
  nome: string;
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
  passaggiSintetici: string[];
  passaggiDettagliati: string[];
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
  giornoSpesa: string;
  dispositivi: Record<string, boolean>;
};

export type AnalysisStatus = 'basso' | 'normale' | 'alto' | 'manuale';

export type AnalysisValue = {
  id: string;
  parametro: string;
  unita: string;
  rangeMin: number;
  rangeMax: number;
  valore: number | null;
  stato: AnalysisStatus;
  nota: string;
};

export type WorkoutLevel = 'Base' | 'Intermedio' | 'Avanzato' | 'Agonista';

export type WorkoutSessionType = 'Specifico' | 'Supporto';

export type WorkoutDay = {
  giorno: string;
  tipo: WorkoutSessionType | 'Riposo';
  descrizione: string;
  durataMinuti: number;
};

export type ShoppingItem = {
  id: string;
  nome: string;
  categoria: string;
  quantita: string;
  spuntato: boolean;
};
