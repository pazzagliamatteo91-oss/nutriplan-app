import { Recipe, UserProfile } from './types';

function ingredientsInclude(recipe: Recipe, keyword: string) {
  return recipe.ingredienti.some((i) => i.nome.toLowerCase().includes(keyword));
}

// Restrizioni ed allergeni escludono in modo "hard" la ricetta dai risultati.
export function isExcludedByProfile(recipe: Recipe, profile: UserProfile): boolean {
  for (const r of profile.restrizioni) {
    if (r === 'vegetariano' && (recipe.tagDietetico === 'Carne' || recipe.tagDietetico === 'Pesce')) return true;
    if (r === 'vegano' && recipe.tagDietetico !== 'Vegano') return true;
    if (r === 'halal' && recipe.alcol) return true;
    if (r === 'kosher' && recipe.crostacei) return true;
    if (r === 'niente_maiale' && ingredientsInclude(recipe, 'maiale')) return true;
    if (r === 'niente_alcol' && recipe.alcol) return true;
  }
  for (const a of profile.allergie) {
    if (a === 'frutta_guscio' && recipe.fruttaAGuscio) return true;
    if (a === 'crostacei' && recipe.crostacei) return true;
    if (a === 'pesce_allergia' && recipe.tagDietetico === 'Pesce') return true;
    if (a === 'soia' && (ingredientsInclude(recipe, 'soia') || ingredientsInclude(recipe, 'tofu') || ingredientsInclude(recipe, 'edamame'))) return true;
    if (a === 'sesamo' && ingredientsInclude(recipe, 'sesamo')) return true;
    if (a === 'molluschi' && ingredientsInclude(recipe, 'mollusch')) return true;
    if (a === 'sedano' && ingredientsInclude(recipe, 'sedano')) return true;
    if (a === 'senape' && ingredientsInclude(recipe, 'senape')) return true;
    if (a === 'lupini' && ingredientsInclude(recipe, 'lupini')) return true;
    if (a === 'arachidi' && ingredientsInclude(recipe, 'arachid')) return true;
  }
  return false;
}

// Le intolleranze mostrano un avviso ma non escludono la ricetta.
export function intoleranceWarnings(recipe: Recipe, profile: UserProfile): string[] {
  const warnings: string[] = [];
  for (const t of profile.intolleranze) {
    if (t === 'lattosio' && recipe.lattosio) warnings.push('Lattosio');
    if (t === 'glutine' && recipe.glutine) warnings.push('Glutine');
    if (t === 'uovo_intoll' && ingredientsInclude(recipe, 'uov')) warnings.push('Uovo');
    if (t === 'lievito' && ingredientsInclude(recipe, 'lievito')) warnings.push('Lievito');
    if (t === 'fruttosio' && ingredientsInclude(recipe, 'miele')) warnings.push('Fruttosio');
  }
  return warnings;
}

export function visibleRecipes(
  recipes: Recipe[],
  profile: UserProfile,
  options: { mealType?: string; cuisineId?: string }
): Recipe[] {
  return recipes.filter((r) => {
    if (options.mealType && r.tipoPasto !== options.mealType) return false;
    if (options.cuisineId) {
      if (r.cucina !== options.cuisineId) return false;
    } else if (profile.cucinePreferite.length > 0) {
      if (!profile.cucinePreferite.includes(r.cucina)) return false;
    }
    if (isExcludedByProfile(r, profile)) return false;
    return true;
  });
}
