import { Bilingual, bi } from './types';

export type ShoppingScale = 'giorno' | 'settimana' | 'mese';

const SCALE_MULTIPLIER: Record<ShoppingScale, number> = {
  giorno: 1,
  settimana: 7,
  mese: 30,
};

type BaseItem = { id: string; nome: Bilingual; categoria: string; qtyGiorno: number; unita: string };

const BASE_ITEMS: BaseItem[] = [
  { id: 'pomodori', nome: bi('Pomodori', 'Tomatoes'), categoria: 'verdura', qtyGiorno: 100, unita: 'g' },
  { id: 'zucchine', nome: bi('Zucchine', 'Zucchini'), categoria: 'verdura', qtyGiorno: 80, unita: 'g' },
  { id: 'spinaci', nome: bi('Spinaci', 'Spinach'), categoria: 'verdura', qtyGiorno: 60, unita: 'g' },
  { id: 'insalata', nome: bi('Insalata mista', 'Mixed salad'), categoria: 'verdura', qtyGiorno: 50, unita: 'g' },
  { id: 'cipolle', nome: bi('Cipolle', 'Onions'), categoria: 'verdura', qtyGiorno: 0.15, unita: 'pz' },
  { id: 'riso', nome: bi('Riso', 'Rice'), categoria: 'cereali', qtyGiorno: 60, unita: 'g' },
  { id: 'pasta_integrale', nome: bi('Pasta integrale', 'Whole wheat pasta'), categoria: 'cereali', qtyGiorno: 50, unita: 'g' },
  { id: 'pane_integrale', nome: bi('Pane integrale', 'Whole wheat bread'), categoria: 'cereali', qtyGiorno: 40, unita: 'g' },
  { id: 'farro', nome: bi('Farro', 'Farro'), categoria: 'cereali', qtyGiorno: 30, unita: 'g' },
  { id: 'pollo', nome: bi('Petto di pollo', 'Chicken breast'), categoria: 'proteine', qtyGiorno: 100, unita: 'g' },
  { id: 'uova', nome: bi('Uova', 'Eggs'), categoria: 'proteine', qtyGiorno: 0.4, unita: 'pz' },
  { id: 'salmone', nome: bi('Salmone', 'Salmon'), categoria: 'proteine', qtyGiorno: 60, unita: 'g' },
  { id: 'ceci', nome: bi('Ceci', 'Chickpeas'), categoria: 'proteine', qtyGiorno: 50, unita: 'g' },
  { id: 'yogurt_greco', nome: bi('Yogurt greco', 'Greek yogurt'), categoria: 'proteine', qtyGiorno: 80, unita: 'g' },
  { id: 'olio_oliva', nome: bi("Olio extravergine d'oliva", 'Extra virgin olive oil'), categoria: 'dispensa', qtyGiorno: 20, unita: 'ml' },
  { id: 'frutta_secca', nome: bi('Frutta secca mista', 'Mixed nuts'), categoria: 'dispensa', qtyGiorno: 15, unita: 'g' },
  { id: 'spezie', nome: bi('Spezie miste', 'Mixed spices'), categoria: 'dispensa', qtyGiorno: 0.05, unita: 'conf.' },
  { id: 'miele', nome: bi('Miele', 'Honey'), categoria: 'dispensa', qtyGiorno: 10, unita: 'g' },
];

const UNIT_LABELS: Record<string, Bilingual> = {
  g: bi('g', 'g'),
  ml: bi('ml', 'ml'),
  pz: bi('pz', 'pcs'),
  'conf.': bi('conf.', 'pack'),
};

function formatQty(value: number, unit: string): Bilingual {
  const rounded = unit === 'pz' || unit === 'conf.' ? Math.max(1, Math.round(value)) : Math.round(value);
  const label = UNIT_LABELS[unit] ?? bi(unit, unit);
  return bi(`${rounded} ${label.it}`, `${rounded} ${label.en}`);
}

export function generateShoppingList(scale: ShoppingScale) {
  const mult = SCALE_MULTIPLIER[scale];
  return BASE_ITEMS.map((item) => ({
    id: item.id,
    nome: item.nome,
    categoria: item.categoria,
    quantita: formatQty(item.qtyGiorno * mult, item.unita),
    spuntato: false,
  }));
}
