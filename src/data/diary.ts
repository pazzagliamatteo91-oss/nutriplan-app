import { Recipe, DietTag, DiaryEntry, MealType } from './types';
import { RECIPES } from './recipes';
import { toDateKey } from './mealPlan';

// Il modello ricette non include le proteine: le stimiamo da kcal e tipo di
// piatto (densità proteica media per categoria) per dare comunque un valore
// plausibile quando l'utente registra una ricetta nel diario.
const PROTEIN_DENSITY: Record<DietTag, number> = {
  Carne: 0.09,
  Pesce: 0.09,
  Vegetariano: 0.06,
  Vegano: 0.05,
};

export function estimateProtein(recipe: Recipe): number {
  return Math.round(recipe.kcal * PROTEIN_DENSITY[recipe.tagDietetico]);
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `diary-${Date.now()}-${counter}`;
}

export function diaryEntryFromRecipe(recipe: Recipe, data: string, pasto: MealType): DiaryEntry {
  return {
    id: nextId(),
    data,
    pasto,
    nome: recipe.nome,
    kcal: recipe.kcal,
    proteine: estimateProtein(recipe),
    recipeId: recipe.id,
  };
}

// Un paio di voci già registrate oggi, per mostrare il diario "vivo" al primo avvio
// invece che vuoto: colazione e pranzo già fatti, cena e spuntino ancora da loggare.
export function generateMockDiary(): DiaryEntry[] {
  const today = toDateKey(new Date());
  const breakfast = RECIPES.find((r) => r.tipoPasto === 'colazione');
  const lunch = RECIPES.find((r) => r.tipoPasto === 'pranzo');
  const entries: DiaryEntry[] = [];
  if (breakfast) entries.push(diaryEntryFromRecipe(breakfast, today, 'colazione'));
  if (lunch) entries.push(diaryEntryFromRecipe(lunch, today, 'pranzo'));
  return entries;
}
