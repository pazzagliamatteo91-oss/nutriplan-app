export type LanguageCode = 'it' | 'en';

export type OptionDict = Record<string, string>;

// Contenuto dati (nomi ricette/ingredienti, esercizi, parametri di analisi, ecc.)
// portato in entrambe le lingue supportate, a differenza delle stringhe di
// interfaccia che passano dal dizionario Locale.
export type Bilingual = { it: string; en: string };

// Forma completa delle stringhe traducibili dell'interfaccia. I contenuti mock
// (nomi/ingredienti/passaggi delle ricette, esercizi di allenamento, parametri
// e note dell'analisi del sangue) restano in italiano in ogni lingua: sono dati
// da sostituire con contenuti reali in produzione, non testo dell'interfaccia.
export type Locale = {
  common: {
    cancel: string;
    confirm: string;
    save: string;
    other: string;
    less: string;
    all: string;
  };
  nav: {
    home: string;
    recipes: string;
    shopping: string;
    analysis: string;
    workout: string;
    profile: string;
  };
  home: {
    shoppingReminderTitle: string;
    shoppingReminderBody: string; // {day}
    recipesAvailable: string; // {count}
    itemsInList: string; // {count}
    valuesEntered: string; // {filled}/{total}
    lastWorkout: string; // {date}
    never: string;
  };
  profile: {
    editNameHint: string;
    editNameTitle: string;
    namePlaceholder: string;
    parameters: string;
    age: string;
    ageUnit: string; // {n} anni
    weight: string;
    height: string;
    kcalDay: string;
    proteinDay: string;
    lifestyle: string;
    goal: string;
    intolerances: string;
    allergies: string;
    favoriteCuisine: string;
    restrictions: string;
    language: string;
    chooseAvatarTitle: string;
    uploadPhoto: string;
    orChooseIcon: string;
  };
  recipes: {
    title: string;
    planButton: string;
    filterByCuisine: string;
    misc: string;
    ingredientsFor2: string;
    preparation: string;
    synthetic: string;
    detailed: string;
    buyIngredientsOn: string;
    buyOn: string;
    warning: string; // {list}
    containsLactose: string;
    videoTitle: string;
    videoWebFallback: string;
    mostViewedOnYoutube: string;
    noRecipesFound: string;
    pickForMeal: string; // {meal}
    noRecipesForMeal: string;
    exportSelectListTitle: string;
  };
  shopping: {
    title: string;
    interval: string;
    scaleDay: string;
    scaleWeek: string;
    scaleMonth: string;
    shoppingDayReminder: string;
    reminderActiveFor: string; // {day}
    saveList: string;
    saveListDone: string;
    saveListDoneBody: string;
    exportFullList: string;
  };
  analysis: {
    title: string;
    uploadTitle: string;
    uploadProcessing: string;
    uploadSubtitle: string;
    paramsSectionTitle: string; // 19 parametri...
    statusLow: string;
    statusNormal: string;
    statusHigh: string;
    statusManual: string;
    notInserted: string;
    range: string; // {min}-{max}
    processedTitle: string;
    processedBody: string;
  };
  workout: {
    title: string;
    sport: string;
    other: string;
    selectedDiscipline: string; // {sport}
    level: string;
    specific: string;
    support: string;
    weekPlanTitle: string; // {sport} · {level}
    weekPlanSubtitle: string;
    rest: string;
    restDescription: string;
    logToday: string;
    logAnother: string;
    connectedDevices: string;
    connected: string;
    notConnected: string;
    suggestionTitle: string;
    suggestionBody: string;
    otherDisciplinesTitle: string;
    consistencyTitle: string;
    streakLabel: string; // {n}
  };
  mealPlan: {
    title: string;
    interval: string;
    plannedMeals: string; // {filled}/{total}
    noRecipe: string;
    generateButton: string;
    noneAlertTitle: string;
    noneAlertBody: string;
    doneAlertTitle: string;
    doneAlertBody: string; // {count}
    stayHere: string;
    goToShopping: string;
  };
  avatar: {
    chooseAvatar: string;
    uploadPhoto: string;
    orChooseIcon: string;
  };
  partnerSheet: {
    exportedTitle: string;
    exportedBody: string; // {label}
  };
  onboarding: {
    stepOf: string; // {n} {t}
    continueButton: string;
    backButton: string;
    skipAll: string;
    startButton: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    nameQuestion: string;
    namePlaceholder: string;
    goalTitle: string;
    goalSubtitle: string;
    lifestyleTitle: string;
    lifestyleSubtitle: string;
    cuisinesTitle: string;
    cuisinesSubtitle: string;
    restrictionsTitle: string;
    restrictionsSubtitle: string;
    intolerancesTitle: string;
    intolerancesSubtitle: string;
    allergiesTitle: string;
    allergiesSubtitle: string;
    sportsTitle: string;
    sportsSubtitle: string;
    shoppingDayTitle: string;
    shoppingDaySubtitle: string;
    summaryTitle: string; // {n}
    summarySubtitle: string;
    summaryGoalLabel: string;
    summaryLifestyleLabel: string;
    summaryCuisinesLabel: string;
    summarySportsLabel: string;
    summaryShoppingDayLabel: string;
    noneSelected: string;
  };
  weekdays: OptionDict;
  cuisines: OptionDict;
  dietTags: OptionDict;
  restrictions: OptionDict;
  intolerances: OptionDict;
  allergies: OptionDict;
  mealTypes: OptionDict;
  shoppingCategories: OptionDict;
  mainSports: OptionDict;
  lifestyles: OptionDict;
  goals: OptionDict;
  workoutLevels: OptionDict;
  languages: OptionDict;
};
