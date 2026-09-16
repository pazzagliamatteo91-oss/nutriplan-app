export type ShoppingScale = 'giorno' | 'settimana' | 'mese';

const SCALE_MULTIPLIER: Record<ShoppingScale, number> = {
  giorno: 1,
  settimana: 7,
  mese: 30,
};

type BaseItem = { id: string; nome: string; categoria: string; qtyGiorno: number; unita: string };

const BASE_ITEMS: BaseItem[] = [
  { id: 'pomodori', nome: 'Pomodori', categoria: 'verdura', qtyGiorno: 100, unita: 'g' },
  { id: 'zucchine', nome: 'Zucchine', categoria: 'verdura', qtyGiorno: 80, unita: 'g' },
  { id: 'spinaci', nome: 'Spinaci', categoria: 'verdura', qtyGiorno: 60, unita: 'g' },
  { id: 'insalata', nome: 'Insalata mista', categoria: 'verdura', qtyGiorno: 50, unita: 'g' },
  { id: 'cipolle', nome: 'Cipolle', categoria: 'verdura', qtyGiorno: 0.15, unita: 'pz' },
  { id: 'riso', nome: 'Riso', categoria: 'cereali', qtyGiorno: 60, unita: 'g' },
  { id: 'pasta_integrale', nome: 'Pasta integrale', categoria: 'cereali', qtyGiorno: 50, unita: 'g' },
  { id: 'pane_integrale', nome: 'Pane integrale', categoria: 'cereali', qtyGiorno: 40, unita: 'g' },
  { id: 'farro', nome: 'Farro', categoria: 'cereali', qtyGiorno: 30, unita: 'g' },
  { id: 'pollo', nome: 'Petto di pollo', categoria: 'proteine', qtyGiorno: 100, unita: 'g' },
  { id: 'uova', nome: 'Uova', categoria: 'proteine', qtyGiorno: 0.4, unita: 'pz' },
  { id: 'salmone', nome: 'Salmone', categoria: 'proteine', qtyGiorno: 60, unita: 'g' },
  { id: 'ceci', nome: 'Ceci', categoria: 'proteine', qtyGiorno: 50, unita: 'g' },
  { id: 'yogurt_greco', nome: 'Yogurt greco', categoria: 'proteine', qtyGiorno: 80, unita: 'g' },
  { id: 'olio_oliva', nome: 'Olio extravergine d\'oliva', categoria: 'dispensa', qtyGiorno: 20, unita: 'ml' },
  { id: 'frutta_secca', nome: 'Frutta secca mista', categoria: 'dispensa', qtyGiorno: 15, unita: 'g' },
  { id: 'spezie', nome: 'Spezie miste', categoria: 'dispensa', qtyGiorno: 0.05, unita: 'conf.' },
  { id: 'miele', nome: 'Miele', categoria: 'dispensa', qtyGiorno: 10, unita: 'g' },
];

function formatQty(value: number, unit: string): string {
  const rounded = unit === 'pz' || unit === 'conf.' ? Math.max(1, Math.round(value)) : Math.round(value);
  return `${rounded} ${unit}`;
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
