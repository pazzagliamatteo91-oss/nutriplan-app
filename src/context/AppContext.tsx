import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AnalysisValue, ShoppingItem, MealPlanEntry, MealType } from '../data/types';
import { generateMockAnalysis, noteForValue } from '../data/analysisParams';
import { generateShoppingList, ShoppingScale } from '../data/shopping';
import { WEEKDAYS } from '../data/constants';
import { WorkoutLevel } from '../data/types';
import { RECIPES } from '../data/recipes';
import { PlanScale, aggregateMealPlanToShoppingItems } from '../data/mealPlan';
import { scheduleShoppingReminder } from '../data/shoppingNotifications';
import { LanguageCode, Locale, DEFAULT_LANGUAGE, LOCALES, createTranslator } from '../i18n';

const STORAGE_KEY = '@nutriplan/state/v1';

export const DEFAULT_PROFILE: UserProfile = {
  nome: 'Matteo',
  avatarUri: null,
  avatarIcon: null,
  eta: 32,
  pesoKg: 72,
  altezzaCm: 175,
  kcalGiorno: 2200,
  proteineGiorno: 120,
  stileVita: 'Attivo',
  obiettivo: 'Mantenere peso',
  intolleranze: ['lattosio'],
  allergie: [],
  cucinePreferite: ['mediterranea', 'giapponese'],
  restrizioni: [],
  sportPreferiti: ['corsa', 'palestra'],
  giornoSpesa: 'Sabato',
  dispositivi: { garmin: true, apple_watch: false, amazfit: false },
};

type WorkoutSelection = { sportId: string; livello: WorkoutLevel };

type PersistedState = {
  profile: UserProfile;
  shoppingScale: ShoppingScale;
  shoppingItems: ShoppingItem[];
  analysisValues: AnalysisValue[];
  workoutSelection: WorkoutSelection;
  lastWorkoutLog: string | null;
  mealPlan: MealPlanEntry[];
  shoppingReminderId: string | null;
  language: LanguageCode;
};

type AppContextValue = {
  loaded: boolean;
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
  toggleListMember: (field: 'intolleranze' | 'allergie' | 'cucinePreferite' | 'restrizioni' | 'sportPreferiti', id: string) => void;

  shoppingScale: ShoppingScale;
  setShoppingScale: (s: ShoppingScale) => void;
  shoppingItems: ShoppingItem[];
  toggleShoppingItem: (id: string) => void;
  resetShoppingListForScale: (s: ShoppingScale) => void;

  analysisValues: AnalysisValue[];
  updateAnalysisValue: (id: string, value: number | null) => void;

  workoutSelection: WorkoutSelection;
  setWorkoutSelection: (sel: WorkoutSelection) => void;
  lastWorkoutLog: string | null;
  logWorkoutToday: () => void;

  mealPlan: MealPlanEntry[];
  setMealPlanEntry: (data: string, pasto: MealType, recipeId: string | null) => void;
  generateShoppingListFromPlan: (dates: string[], scale: PlanScale) => number;

  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [shoppingScale, setShoppingScaleState] = useState<ShoppingScale>('settimana');
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => generateShoppingList('settimana'));
  const [analysisValues, setAnalysisValues] = useState<AnalysisValue[]>(() => generateMockAnalysis());
  const [workoutSelection, setWorkoutSelectionState] = useState<WorkoutSelection>({ sportId: 'corsa', livello: 'Intermedio' });
  const [lastWorkoutLog, setLastWorkoutLog] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [shoppingReminderId, setShoppingReminderId] = useState<string | null>(null);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const reminderIdRef = useRef<string | null>(null);
  const recipesById = useMemo(() => new Map(RECIPES.map((r) => [r.id, r])), []);
  const t = useMemo(() => createTranslator(language), [language]);
  const locale = useMemo(() => LOCALES[language] ?? LOCALES[DEFAULT_LANGUAGE], [language]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: PersistedState = JSON.parse(raw);
          setProfile({ ...DEFAULT_PROFILE, ...parsed.profile });
          setShoppingScaleState(parsed.shoppingScale ?? 'settimana');
          setShoppingItems(parsed.shoppingItems ?? generateShoppingList('settimana'));
          setAnalysisValues(parsed.analysisValues ?? generateMockAnalysis());
          setWorkoutSelectionState(parsed.workoutSelection ?? { sportId: 'corsa', livello: 'Intermedio' });
          setLastWorkoutLog(parsed.lastWorkoutLog ?? null);
          setMealPlan(parsed.mealPlan ?? []);
          setShoppingReminderId(parsed.shoppingReminderId ?? null);
          reminderIdRef.current = parsed.shoppingReminderId ?? null;
          setLanguageState(parsed.language ?? DEFAULT_LANGUAGE);
        }
      } catch {
        // dati mock: se la lettura fallisce si riparte dai default
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const state: PersistedState = {
      profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, lastWorkoutLog,
      mealPlan, shoppingReminderId, language,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [loaded, profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, lastWorkoutLog, mealPlan, shoppingReminderId, language]);

  // Mantiene il promemoria spesa allineato al giorno scelto nel profilo:
  // ripianifica la notifica locale ogni volta che il giorno cambia (incluso al primo avvio).
  useEffect(() => {
    if (!loaded) return;
    scheduleShoppingReminder(profile.giornoSpesa, reminderIdRef.current).then((id) => {
      reminderIdRef.current = id;
      setShoppingReminderId(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, profile.giornoSpesa]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const toggleListMember = useCallback(
    (field: 'intolleranze' | 'allergie' | 'cucinePreferite' | 'restrizioni' | 'sportPreferiti', id: string) => {
      setProfile((p) => {
        const list = p[field];
        const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
        return { ...p, [field]: next };
      });
    },
    []
  );

  const setShoppingScale = useCallback((s: ShoppingScale) => {
    setShoppingScaleState(s);
    setShoppingItems((prev) => {
      const fresh = generateShoppingList(s);
      const checkedIds = new Set(prev.filter((i) => i.spuntato).map((i) => i.id));
      return fresh.map((i) => (checkedIds.has(i.id) ? { ...i, spuntato: true } : i));
    });
  }, []);

  const resetShoppingListForScale = useCallback((s: ShoppingScale) => {
    setShoppingItems(generateShoppingList(s));
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingItems((prev) => prev.map((i) => (i.id === id ? { ...i, spuntato: !i.spuntato } : i)));
  }, []);

  const updateAnalysisValue = useCallback((id: string, value: number | null) => {
    setAnalysisValues((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (value === null) return { ...a, valore: null, stato: 'manuale', nota: '' };
        const { stato, nota } = noteForValue(id, value);
        return { ...a, valore: value, stato, nota };
      })
    );
  }, []);

  const setWorkoutSelection = useCallback((sel: WorkoutSelection) => {
    setWorkoutSelectionState(sel);
  }, []);

  const logWorkoutToday = useCallback(() => {
    setLastWorkoutLog(new Date().toISOString());
  }, []);

  const setMealPlanEntry = useCallback((data: string, pasto: MealType, recipeId: string | null) => {
    setMealPlan((prev) => {
      const withoutSlot = prev.filter((e) => !(e.data === data && e.pasto === pasto));
      return recipeId ? [...withoutSlot, { data, pasto, recipeId }] : withoutSlot;
    });
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  const generateShoppingListFromPlan = useCallback(
    (dates: string[], scale: PlanScale) => {
      const items = aggregateMealPlanToShoppingItems(mealPlan, dates, recipesById);
      setShoppingItems(items);
      setShoppingScaleState(scale);
      scheduleShoppingReminder(profile.giornoSpesa, reminderIdRef.current).then((id) => {
        reminderIdRef.current = id;
        setShoppingReminderId(id);
      });
      return items.length;
    },
    [mealPlan, recipesById, profile.giornoSpesa]
  );

  const value = useMemo(
    () => ({
      loaded,
      profile,
      updateProfile,
      toggleListMember,
      shoppingScale,
      setShoppingScale,
      shoppingItems,
      toggleShoppingItem,
      resetShoppingListForScale,
      analysisValues,
      updateAnalysisValue,
      workoutSelection,
      setWorkoutSelection,
      lastWorkoutLog,
      logWorkoutToday,
      mealPlan,
      setMealPlanEntry,
      generateShoppingListFromPlan,
      language,
      setLanguage,
      t,
      locale,
    }),
    [
      loaded, profile, updateProfile, toggleListMember, shoppingScale, setShoppingScale, shoppingItems,
      toggleShoppingItem, resetShoppingListForScale, analysisValues, updateAnalysisValue, workoutSelection,
      setWorkoutSelection, lastWorkoutLog, logWorkoutToday, mealPlan, setMealPlanEntry, generateShoppingListFromPlan,
      language, setLanguage, t, locale,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve essere usato dentro AppProvider');
  return ctx;
}

export { WEEKDAYS };
