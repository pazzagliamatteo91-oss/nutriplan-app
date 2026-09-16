import { DietTag } from './types';

export type ProteinDef = {
  nome: string;
  tag: DietTag;
  lattosio?: boolean;
  crostacei?: boolean;
};

export type BaseDef = { nome: string; glutine?: boolean };
export type StyleDef = { label: string; alcol?: boolean };

export type CuisineBank = {
  id: string;
  nome: string;
  proteins: ProteinDef[];
  bases: BaseDef[];
  veggies: string[];
  styles: StyleDef[];
  fruttaGuscio?: string[]; // ingredienti extra con frutta a guscio, aggiunti a rotazione
};

export const CUISINE_BANKS: CuisineBank[] = [
  {
    id: 'mediterranea',
    nome: 'Mediterranea',
    proteins: [
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Salmone', tag: 'Pesce' },
      { nome: 'Ceci', tag: 'Vegano' },
      { nome: 'Tonno', tag: 'Pesce' },
      { nome: 'Uova', tag: 'Vegetariano' },
      { nome: 'Feta', tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: 'Cous cous', glutine: true },
      { nome: 'Farro', glutine: true },
      { nome: 'Pane integrale', glutine: true },
      { nome: 'Riso', glutine: false },
      { nome: 'Patate', glutine: false },
    ],
    veggies: ['Pomodorini', 'Zucchine', 'Melanzane', 'Peperoni', 'Rucola'],
    styles: [
      { label: 'alla griglia' },
      { label: 'al forno' },
      { label: 'in insalata' },
      { label: 'saltato in padella' },
      { label: 'al vino bianco', alcol: true },
    ],
    fruttaGuscio: ['Mandorle a lamelle', 'Pinoli'],
  },
  {
    id: 'giapponese',
    nome: 'Giapponese',
    proteins: [
      { nome: 'Salmone', tag: 'Pesce' },
      { nome: 'Tofu', tag: 'Vegano' },
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Gamberi', tag: 'Pesce', crostacei: true },
      { nome: 'Manzo', tag: 'Carne' },
      { nome: 'Edamame', tag: 'Vegano' },
    ],
    bases: [
      { nome: 'Riso', glutine: false },
      { nome: 'Soba', glutine: true },
      { nome: 'Udon', glutine: true },
      { nome: 'Riso per sushi', glutine: false },
    ],
    veggies: ['Alga nori', 'Cavolo', 'Daikon', 'Funghi shiitake', 'Cetriolo'],
    styles: [
      { label: 'in stile teriyaki' },
      { label: 'in tempura' },
      { label: 'al vapore' },
      { label: 'marinato in salsa di soia' },
      { label: 'alla griglia' },
    ],
    fruttaGuscio: ['Sesamo tostato'],
  },
  {
    id: 'messicana',
    nome: 'Messicana',
    proteins: [
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Manzo', tag: 'Carne' },
      { nome: 'Fagioli neri', tag: 'Vegano' },
      { nome: 'Gamberi', tag: 'Pesce', crostacei: true },
      { nome: 'Formaggio', tag: 'Vegetariano', lattosio: true },
      { nome: 'Uova', tag: 'Vegetariano' },
    ],
    bases: [
      { nome: 'Tortilla di mais', glutine: false },
      { nome: 'Riso', glutine: false },
      { nome: 'Tortilla di farina', glutine: true },
      { nome: 'Nachos', glutine: false },
    ],
    veggies: ['Jalapeño', 'Avocado', 'Pomodoro', 'Mais', 'Cipolla rossa'],
    styles: [
      { label: 'alla griglia' },
      { label: 'speziato' },
      { label: 'al forno' },
      { label: 'saltato in padella' },
      { label: 'in salsa piccante' },
    ],
  },
  {
    id: 'indiana',
    nome: 'Indiana',
    proteins: [
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Ceci', tag: 'Vegano' },
      { nome: 'Lenticchie', tag: 'Vegano' },
      { nome: 'Paneer', tag: 'Vegetariano', lattosio: true },
      { nome: 'Gamberi', tag: 'Pesce', crostacei: true },
      { nome: 'Agnello', tag: 'Carne' },
    ],
    bases: [
      { nome: 'Riso basmati', glutine: false },
      { nome: 'Naan', glutine: true },
      { nome: 'Riso pilaf', glutine: false },
      { nome: 'Chapati', glutine: true },
    ],
    veggies: ['Spinaci', 'Cavolfiore', 'Piselli', 'Melanzane', 'Pomodoro'],
    styles: [
      { label: 'al curry' },
      { label: 'speziato' },
      { label: 'in stile tandoori' },
      { label: 'in salsa masala' },
      { label: 'saltato con spezie' },
    ],
    fruttaGuscio: ['Anacardi', 'Mandorle'],
  },
  {
    id: 'mediorientale',
    nome: 'Mediorientale',
    proteins: [
      { nome: 'Agnello', tag: 'Carne' },
      { nome: 'Ceci', tag: 'Vegano' },
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Falafel', tag: 'Vegano' },
      { nome: 'Yogurt', tag: 'Vegetariano', lattosio: true },
      { nome: 'Manzo', tag: 'Carne' },
    ],
    bases: [
      { nome: 'Cous cous', glutine: true },
      { nome: 'Pane pita', glutine: true },
      { nome: 'Riso', glutine: false },
      { nome: 'Bulgur', glutine: true },
    ],
    veggies: ['Melanzane', 'Pomodoro', 'Cetriolo', 'Prezzemolo', 'Peperoni'],
    styles: [
      { label: 'speziato' },
      { label: 'alla griglia' },
      { label: 'al forno' },
      { label: 'in salsa tahini' },
      { label: 'marinato allo yogurt' },
    ],
    fruttaGuscio: ['Pistacchi', 'Pinoli'],
  },
  {
    id: 'sudamericana',
    nome: 'Sudamericana',
    proteins: [
      { nome: 'Manzo', tag: 'Carne' },
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Fagioli neri', tag: 'Vegano' },
      { nome: 'Pesce bianco', tag: 'Pesce' },
      { nome: 'Uova', tag: 'Vegetariano' },
      { nome: 'Formaggio', tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: 'Riso', glutine: false },
      { nome: 'Yuca', glutine: false },
      { nome: 'Platano fritto', glutine: false },
      { nome: 'Polenta', glutine: false },
      { nome: 'Patate', glutine: false },
    ],
    veggies: ['Mais', 'Peperoni', 'Pomodoro', 'Avocado', 'Cipolla'],
    styles: [
      { label: 'alla griglia (churrasco)' },
      { label: 'speziato' },
      { label: 'al forno' },
      { label: 'saltato in padella' },
      { label: 'al vino rosso', alcol: true },
    ],
  },
  {
    id: 'varie',
    nome: 'Varie',
    proteins: [
      { nome: 'Pollo', tag: 'Carne' },
      { nome: 'Tofu', tag: 'Vegano' },
      { nome: 'Uova', tag: 'Vegetariano' },
      { nome: 'Tacchino', tag: 'Carne' },
      { nome: 'Legumi misti', tag: 'Vegano' },
      { nome: 'Formaggio', tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: 'Quinoa', glutine: false },
      { nome: 'Riso', glutine: false },
      { nome: 'Pasta integrale', glutine: true },
      { nome: 'Patate', glutine: false },
      { nome: 'Pane', glutine: true },
    ],
    veggies: ['Broccoli', 'Carote', 'Spinaci', 'Zucchine', 'Insalata mista'],
    styles: [
      { label: 'al forno' },
      { label: 'saltato in padella' },
      { label: 'alla griglia' },
      { label: 'in insalata' },
      { label: 'in zuppa' },
    ],
    fruttaGuscio: ['Noci', 'Mandorle'],
  },
];

export function cuisineBank(id: string): CuisineBank {
  const bank = CUISINE_BANKS.find((c) => c.id === id);
  if (!bank) throw new Error(`Cucina sconosciuta: ${id}`);
  return bank;
}
