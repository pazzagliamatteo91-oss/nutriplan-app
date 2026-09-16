export type RecipesStackParamList = {
  RecipesList: { cuisineId?: string; mealType?: string } | undefined;
  RecipeDetail: { recipeId: string };
};

export type RootTabParamList = {
  HomeTab: undefined;
  RicetteTab: undefined;
  SpesaTab: undefined;
  AnalisiTab: undefined;
  AllenamentoTab: undefined;
  ProfiloTab: undefined;
};
