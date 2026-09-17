import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AnalysisValue, ShoppingItem, MealPlanEntry, MealType, DiaryEntry, bi } from '../data/types';
import { generateMockAnalysis, noteForValue } from '../data/analysisParams';
import { generateShoppingList, ShoppingScale } from '../data/shopping';
import { generateMockDiary } from '../data/diary';
import { WEEKDAYS } from '../data/constants';
import { WorkoutLevel } from '../data/types';
import { generateMockWorkoutLog } from '../data/workouts';
import { RECIPES } from '../data/recipes';
import { PlanScale, aggregateMealPlanToShoppingItems, toDateKey } from '../data/mealPlan';
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
  onboardingCompletato: false,
};

type WorkoutSelection = { sportId: string; livello: WorkoutLevel };

type PersistedState = {
  profile: UserProfile;
  shoppingScale: ShoppingScale;
  shoppingItems: ShoppingItem[];
  analysisValues: AnalysisValue[];
  workoutSelection: WorkoutSelection;
  workoutLog: string[];
  mealPlan: MealPlanEntry[];
  diaryEntries: DiaryEntry[];
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
  workoutLog: string[];
  lastWorkoutLog: string | null;
  logWorkoutToday: () => void;

  mealPlan: MealPlanEntry[];
  setMealPlanEntry: (data: string, pasto: MealType, recipeId: string | null) => void;
  generateShoppingListFromPlan: (dates: string[], scale: PlanScale) => number;

  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  removeDiaryEntry: (id: string) => void;

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
  const [workoutLog, setWorkoutLog] = useState<string[]>(() => generateMockWorkoutLog());
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => generateMockDiary());
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
          // Chi aveva già uno stato salvato prima dell'introduzione dell'onboarding
          // non deve rivederlo: il flag manca solo per chi ha già usato l'app.
          const onboardingCompletato = parsed.profile?.onboardingCompletato ?? true;
          setProfile({ ...DEFAULT_PROFILE, ...parsed.profile, onboardingCompletato });
          setShoppingScaleState(parsed.shoppingScale ?? 'settimana');
          setShoppingItems(parsed.shoppingItems ?? generateShoppingList('settimana'));
          setAnalysisValues(parsed.analysisValues ?? generateMockAnalysis());
          setWorkoutSelectionState(parsed.workoutSelection ?? { sportId: 'corsa', livello: 'Intermedio' });
          // Compatibilità con lo stato salvato prima dell'introduzione dello storico allenamenti:
          // chi aveva solo lastWorkoutLog lo eredita come unica voce del nuovo array.
          const legacyLastLog = (parsed as unknown as { lastWorkoutLog?: string | null }).lastWorkoutLog;
          setWorkoutLog(parsed.workoutLog ?? (legacyLastLog ? [toDateKey(new Date(legacyLastLog))] : []));
          setMealPlan(parsed.mealPlan ?? []);
          setDiaryEntries(parsed.diaryEntries ?? generateMockDiary());
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
      profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, workoutLog,
      mealPlan, diaryEntries, shoppingReminderId, language,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [loaded, profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, workoutLog, mealPlan, diaryEntries, shoppingReminderId, language]);

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
        if (value === null) return { ...a, valore: null, stato: 'manuale', nota: bi('', '') };
        // Archivia la lettura precedente nello storico prima di sovrascriverla,
        // così il grafico di andamento mostra anche il valore appena sostituito.
        const history =
          a.valore !== null && a.entryDate ? [...a.history, { data: a.entryDate, valore: a.valore }] : a.history;
        const { stato, nota } = noteForValue(id, value);
        return { ...a, valore: value, stato, nota, entryDate: toDateKey(new Date()), history };
      })
    );
  }, []);

  const setWorkoutSelection = useCallback((sel: WorkoutSelection) => {
    setWorkoutSelectionState(sel);
  }, []);

  const logWorkoutToday = useCallback(() => {
    const today = toDateKey(new Date());
    setWorkoutLog((prev) => (prev.includes(today) ? prev : [...prev, today]));
  }, []);

  const lastWorkoutLog = workoutLog.length ? workoutLog[workoutLog.length - 1] : null;

  const setMealPlanEntry = useCallback((data: string, pasto: MealType, recipeId: string | null) => {
    setMealPlan((prev) => {
      const withoutSlot = prev.filter((e) => !(e.data === data && e.pasto === pasto));
      return recipeId ? [...withoutSlot, { data, pasto, recipeId }] : withoutSlot;
    });
  }, []);

  const addDiaryEntry = useCallback((entry: Omit<DiaryEntry, 'id'>) => {
    const id = `diary-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setDiaryEntries((prev) => [...prev, { ...entry, id }]);
  }, []);

  const removeDiaryEntry = useCallback((id: string) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
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
      workoutLog,
      lastWorkoutLog,
      logWorkoutToday,
      mealPlan,
      setMealPlanEntry,
      generateShoppingListFromPlan,
      diaryEntries,
      addDiaryEntry,
      removeDiaryEntry,
      language,
      setLanguage,
      t,
      locale,
    }),
    [
      loaded, profile, updateProfile, toggleListMember, shoppingScale, setShoppingScale, shoppingItems,
      toggleShoppingItem, resetShoppingListForScale, analysisValues, updateAnalysisValue, workoutSelection,
      setWorkoutSelection, workoutLog, lastWorkoutLog, logWorkoutToday, mealPlan, setMealPlanEntry, generateShoppingListFromPlan,
      diaryEntries, addDiaryEntry, removeDiaryEntry, language, setLanguage, t, locale,
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
