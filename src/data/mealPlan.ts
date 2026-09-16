import { MealPlanEntry, Recipe, ShoppingItem } from './types';

export type PlanScale = 'giorno' | 'settimana' | 'mese';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Elenco di date (YYYY-MM-DD) da oggi in avanti per lo scale scelto.
export function datesForScale(scale: PlanScale, from: Date = new Date()): string[] {
  const count = scale === 'giorno' ? 1 : scale === 'settimana' ? 7 : 30;
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    dates.push(toDateKey(d));
  }
  return dates;
}

export function formatDateLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T00:00:00');
  const label = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// --- Aggregazione ingredienti → lista della spesa ---------------------------

const CATEGORY_KEYWORDS: { categoria: string; keywords: string[] }[] = [
  {
    categoria: 'verdura',
    keywords: [
      'pomodor', 'zucchin', 'melanzan', 'peperon', 'rucola', 'spinac', 'cavol', 'daikon', 'funghi',
      'cetriol', 'jalape', 'avocado', 'mais', 'cipoll', 'insalata', 'broccol', 'carot', 'piselli',
      'prezzemolo', 'lattuga', 'cavolfiore', 'sedano', 'aglio', 'lime', 'limone', 'banana', 'mango',
      'papaya', 'ananas', 'frutti di bosco', 'fichi', 'pera', 'mela',
    ],
  },
  {
    categoria: 'cereali',
    keywords: [
      'riso', 'cous cous', 'farro', 'pane', 'pasta', 'tortilla', 'naan', 'chapati', 'bulgur',
      'quinoa', 'soba', 'udon', 'nachos', 'polenta', 'patate', 'yuca', 'platano', 'orzo', 'semolino',
    ],
  },
  {
    categoria: 'proteine',
    keywords: [
      'pollo', 'manzo', 'salmone', 'tonno', 'uov', 'feta', 'tofu', 'gamber', 'edamame', 'ceci',
      'fagioli', 'lenticchie', 'paneer', 'agnello', 'falafel', 'yogurt', 'formaggio', 'pesce',
      'tacchino', 'legumi', 'anacardi', 'mandorle', 'noci', 'pistacchi', 'pinoli', 'labneh',
    ],
  },
];

export function categorizeIngredient(nome: string): string {
  const lower = nome.toLowerCase();
  for (const { categoria, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) return categoria;
  }
  return 'dispensa';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Prova a leggere un numero (anche frazioni tipo "1/2") e l'unità da una
// quantità testuale libera come "150 g" o "1 cucchiaio". Se non riconosce un
// numero (es. "q.b."), ritorna value=null: quell'ingrediente non viene sommato
// ma solo elencato una volta per ricetta.
function parseQuantity(qty: string): { value: number | null; unit: string } {
  const match = qty.trim().match(/^([\d]+(?:[.,]\d+)?(?:\/\d+)?)\s*(.*)$/);
  if (!match) return { value: null, unit: qty.trim() };
  const rawNum = match[1];
  let value: number;
  if (rawNum.includes('/')) {
    const [a, b] = rawNum.split('/').map(Number);
    value = b !== 0 ? a / b : NaN;
  } else {
    value = parseFloat(rawNum.replace(',', '.'));
  }
  if (!Number.isFinite(value)) return { value: null, unit: qty.trim() };
  return { value, unit: match[2].trim() };
}

function formatAggregatedQty(value: number | null, unit: string, occorrenze: number): string {
  if (value === null) {
    return occorrenze > 1 ? `${unit} (x${occorrenze})` : unit || 'q.b.';
  }
  const rounded = Math.round(value * 10) / 10;
  return unit ? `${rounded} ${unit}` : `${rounded}`;
}

// Aggrega gli ingredienti di tutte le ricette pianificate nelle date indicate,
// sommando le quantità quando l'unità è riconoscibile, e le raggruppa per
// categoria per costruire direttamente la lista della spesa.
export function aggregateMealPlanToShoppingItems(
  entries: MealPlanEntry[],
  dates: string[],
  recipesById: Map<string, Recipe>
): ShoppingItem[] {
  const dateSet = new Set(dates);
  const relevant = entries.filter((e) => dateSet.has(e.data));

  type Agg = { nome: string; categoria: string; value: number | null; unit: string; occorrenze: number };
  const aggregated = new Map<string, Agg>();

  for (const entry of relevant) {
    const recipe = recipesById.get(entry.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredienti) {
      const { value, unit } = parseQuantity(ing.quantita);
      const key = `${ing.nome.toLowerCase()}|${unit.toLowerCase()}`;
      const existing = aggregated.get(key);
      if (existing) {
        existing.occorrenze += 1;
        if (existing.value !== null && value !== null) {
          existing.value += value;
        } else {
          existing.value = null;
        }
      } else {
        aggregated.set(key, {
          nome: ing.nome,
          categoria: categorizeIngredient(ing.nome),
          value,
          unit,
          occorrenze: 1,
        });
      }
    }
  }

  return Array.from(aggregated.values()).map((a) => ({
    id: `mp-${slugify(a.nome)}-${slugify(a.unit)}`,
    nome: a.nome,
    categoria: a.categoria,
    quantita: formatAggregatedQty(a.value, a.unit, a.occorrenze),
    spuntato: false,
  }));
}
