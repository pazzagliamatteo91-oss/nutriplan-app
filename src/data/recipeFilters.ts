import { Recipe, UserProfile } from './types';

function ingredientsInclude(recipe: Recipe, keywordIt: string, keywordEn?: string) {
  return recipe.ingredienti.some(
    (i) => i.nome.it.toLowerCase().includes(keywordIt) || i.nome.en.toLowerCase().includes(keywordEn ?? keywordIt)
  );
}

// Restrizioni ed allergeni escludono in modo "hard" la ricetta dai risultati.
export function isExcludedByProfile(recipe: Recipe, profile: UserProfile): boolean {
  for (const r of profile.restrizioni) {
    if (r === 'vegetariano' && (recipe.tagDietetico === 'Carne' || recipe.tagDietetico === 'Pesce')) return true;
    if (r === 'vegano' && recipe.tagDietetico !== 'Vegano') return true;
    if (r === 'halal' && recipe.alcol) return true;
    if (r === 'kosher' && recipe.crostacei) return true;
    if (r === 'niente_maiale' && ingredientsInclude(recipe, 'maiale', 'pork')) return true;
    if (r === 'niente_alcol' && recipe.alcol) return true;
  }
  for (const a of profile.allergie) {
    if (a === 'frutta_guscio' && recipe.fruttaAGuscio) return true;
    if (a === 'crostacei' && recipe.crostacei) return true;
    if (a === 'pesce_allergia' && recipe.tagDietetico === 'Pesce') return true;
    if (a === 'soia' && (ingredientsInclude(recipe, 'soia', 'soy') || ingredientsInclude(recipe, 'tofu') || ingredientsInclude(recipe, 'edamame'))) return true;
    if (a === 'sesamo' && ingredientsInclude(recipe, 'sesamo', 'sesame')) return true;
    if (a === 'molluschi' && ingredientsInclude(recipe, 'mollusch', 'mollusc')) return true;
    if (a === 'sedano' && ingredientsInclude(recipe, 'sedano', 'celery')) return true;
    if (a === 'senape' && ingredientsInclude(recipe, 'senape', 'mustard')) return true;
    if (a === 'lupini' && ingredientsInclude(recipe, 'lupini', 'lupin')) return true;
    if (a === 'arachidi' && ingredientsInclude(recipe, 'arachid', 'peanut')) return true;
  }
  return false;
}

// Le intolleranze mostrano un avviso ma non escludono la ricetta.
// Restituisce id canonici (chiavi di locale.intolerances) invece di label,
// così le schermate possono tradurli nella lingua corrente.
export function intoleranceWarnings(recipe: Recipe, profile: UserProfile): string[] {
  const warnings: string[] = [];
  for (const t of profile.intolleranze) {
    if (t === 'lattosio' && recipe.lattosio) warnings.push('lattosio');
    if (t === 'glutine' && recipe.glutine) warnings.push('glutine');
    if (t === 'uovo_intoll' && ingredientsInclude(recipe, 'uov', 'egg')) warnings.push('uovo_intoll');
    if (t === 'lievito' && ingredientsInclude(recipe, 'lievito', 'yeast')) warnings.push('lievito');
    if (t === 'fruttosio' && ingredientsInclude(recipe, 'miele', 'honey')) warnings.push('fruttosio');
  }
  return warnings;
}

export function visibleRecipes(
  recipes: Recipe[],
  profile: UserProfile,
  options: { mealType?: string; cuisineIds?: string[] }
): Recipe[] {
  return recipes.filter((r) => {
    if (options.mealType && r.tipoPasto !== options.mealType) return false;
    if (options.cuisineIds && options.cuisineIds.length > 0) {
      if (!options.cuisineIds.includes(r.cucina)) return false;
    } else if (profile.cucinePreferite.length > 0) {
      if (!profile.cucinePreferite.includes(r.cucina)) return false;
    }
    if (isExcludedByProfile(r, profile)) return false;
    return true;
  });
}
