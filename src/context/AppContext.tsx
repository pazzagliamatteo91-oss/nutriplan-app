import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AnalysisValue, ShoppingItem, MealPlanEntry, MealType, DiaryEntry, WorkoutLogEntry, WorkoutSessionLog, SetEntry, WorkoutSessionType, bi } from '../data/types';
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
  giorniSpesa: ['Sabato'],
  dispositivi: { garmin: true, apple_watch: false, amazfit: false },
  onboardingCompletato: false,
  carichiRiferimento: { squatKg: null, panca_kg: null, stacco_kg: null, corpoLibero: true },
  ultimaSessioneSmartwatch: null,
};

type WorkoutSelection = { sportId: string; livello: WorkoutLevel };

type PersistedState = {
  profile: UserProfile;
  shoppingScale: ShoppingScale;
  shoppingItems: ShoppingItem[];
  analysisValues: AnalysisValue[];
  workoutSelection: WorkoutSelection;
  workoutLog: WorkoutLogEntry[];
  workoutSessionLogs: WorkoutSessionLog[];
  mealPlan: MealPlanEntry[];
  diaryEntries: DiaryEntry[];
  shoppingReminderIds: string[];
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
  workoutLog: WorkoutLogEntry[];
  lastWorkoutLog: string | null;
  logWorkoutToday: (sportId: string) => void;
  logExerciseSets: (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string, serie: SetEntry[]) => void;
  getTodayExerciseSets: (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string) => SetEntry[] | null;
  getLastExerciseSets: (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string) => SetEntry[] | null;

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
  const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>(() => generateMockWorkoutLog());
  const [workoutSessionLogs, setWorkoutSessionLogs] = useState<WorkoutSessionLog[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => generateMockDiary());
  const [shoppingReminderIds, setShoppingReminderIds] = useState<string[]>([]);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const reminderIdsRef = useRef<string[]>([]);
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
          // Compatibilità con lo stato salvato prima del passaggio a più giorni spesa:
          // chi aveva solo il vecchio "giornoSpesa" (stringa) lo eredita come primo giorno.
          const legacyGiornoSpesa = (parsed.profile as unknown as { giornoSpesa?: string })?.giornoSpesa;
          const giorniSpesa = parsed.profile?.giorniSpesa ?? (legacyGiornoSpesa ? [legacyGiornoSpesa] : undefined);
          setProfile({ ...DEFAULT_PROFILE, ...parsed.profile, ...(giorniSpesa ? { giorniSpesa } : {}), onboardingCompletato });
          setShoppingScaleState(parsed.shoppingScale ?? 'settimana');
          setShoppingItems(parsed.shoppingItems ?? generateShoppingList('settimana'));
          setAnalysisValues(parsed.analysisValues ?? generateMockAnalysis());
          const restoredSelection = parsed.workoutSelection ?? { sportId: 'corsa', livello: 'Intermedio' };
          setWorkoutSelectionState(restoredSelection);
          // Compatibilità con lo stato salvato prima dell'introduzione dello storico allenamenti
          // e prima dell'associazione di ogni voce a uno sport: chi aveva solo lastWorkoutLog lo
          // eredita come unica voce, chi aveva un array di sole date le associa allo sport corrente.
          const legacyLastLog = (parsed as unknown as { lastWorkoutLog?: string | null }).lastWorkoutLog;
          const legacyWorkoutLog = parsed.workoutLog as unknown as string[] | WorkoutLogEntry[] | undefined;
          const normalizedLog: WorkoutLogEntry[] = Array.isArray(legacyWorkoutLog)
            ? legacyWorkoutLog.map((e) =>
                typeof e === 'string' ? { data: e, sportId: restoredSelection.sportId } : e
              )
            : legacyLastLog
              ? [{ data: toDateKey(new Date(legacyLastLog)), sportId: restoredSelection.sportId }]
              : [];
          setWorkoutLog(normalizedLog);
          setWorkoutSessionLogs(parsed.workoutSessionLogs ?? []);
          setMealPlan(parsed.mealPlan ?? []);
          setDiaryEntries(parsed.diaryEntries ?? generateMockDiary());
          setShoppingReminderIds(parsed.shoppingReminderIds ?? []);
          reminderIdsRef.current = parsed.shoppingReminderIds ?? [];
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
      profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, workoutLog, workoutSessionLogs,
      mealPlan, diaryEntries, shoppingReminderIds, language,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [loaded, profile, shoppingScale, shoppingItems, analysisValues, workoutSelection, workoutLog, workoutSessionLogs, mealPlan, diaryEntries, shoppingReminderIds, language]);

  // Mantiene i promemoria spesa allineati ai giorni scelti nel profilo:
  // ripianifica le notifiche locali ogni volta che i giorni cambiano (incluso al primo avvio).
  useEffect(() => {
    if (!loaded) return;
    scheduleShoppingReminder(profile.giorniSpesa, reminderIdsRef.current).then((ids) => {
      reminderIdsRef.current = ids;
      setShoppingReminderIds(ids);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, profile.giorniSpesa]);

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

  const logWorkoutToday = useCallback((sportId: string) => {
    const today = toDateKey(new Date());
    setWorkoutLog((prev) =>
      prev.some((e) => e.data === today && e.sportId === sportId) ? prev : [...prev, { data: today, sportId }]
    );
  }, []);

  const lastWorkoutLog = workoutLog.length ? workoutLog[workoutLog.length - 1].data : null;

  // Registra le serie (peso/ripetizioni) di un esercizio per la sessione di
  // oggi, sostituendo un eventuale log già salvato oggi per lo stesso
  // esercizio (l'utente può correggere/aggiornare finché è lo stesso giorno).
  const logExerciseSets = useCallback(
    (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string, serie: SetEntry[]) => {
      const today = toDateKey(new Date());
      setWorkoutSessionLogs((prev) => {
        const sessionIdx = prev.findIndex((s) => s.data === today && s.sportId === sportId && s.tipoSessione === tipoSessione);
        if (sessionIdx === -1) {
          return [...prev, { data: today, sportId, tipoSessione, esercizi: [{ esercizio, serie }] }];
        }
        const session = prev[sessionIdx];
        const exIdx = session.esercizi.findIndex((e) => e.esercizio === esercizio);
        const esercizi =
          exIdx === -1
            ? [...session.esercizi, { esercizio, serie }]
            : session.esercizi.map((e, i) => (i === exIdx ? { ...e, serie } : e));
        return prev.map((s, i) => (i === sessionIdx ? { ...s, esercizi } : s));
      });
    },
    []
  );

  const getTodayExerciseSets = useCallback(
    (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string): SetEntry[] | null => {
      const today = toDateKey(new Date());
      const session = workoutSessionLogs.find((s) => s.data === today && s.sportId === sportId && s.tipoSessione === tipoSessione);
      return session?.esercizi.find((e) => e.esercizio === esercizio)?.serie ?? null;
    },
    [workoutSessionLogs]
  );

  // Ultimo log salvato per lo stesso esercizio prima di oggi, usato come
  // riferimento ("l'ultima volta hai fatto...") mentre si registra la serie.
  const getLastExerciseSets = useCallback(
    (sportId: string, tipoSessione: WorkoutSessionType, esercizio: string): SetEntry[] | null => {
      const today = toDateKey(new Date());
      for (let i = workoutSessionLogs.length - 1; i >= 0; i--) {
        const session = workoutSessionLogs[i];
        if (session.sportId !== sportId || session.tipoSessione !== tipoSessione || session.data === today) continue;
        const found = session.esercizi.find((e) => e.esercizio === esercizio);
        if (found) return found.serie;
      }
      return null;
    },
    [workoutSessionLogs]
  );

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
      scheduleShoppingReminder(profile.giorniSpesa, reminderIdsRef.current).then((ids) => {
        reminderIdsRef.current = ids;
        setShoppingReminderIds(ids);
      });
      return items.length;
    },
    [mealPlan, recipesById, profile.giorniSpesa]
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
      workoutSessionLogs,
      lastWorkoutLog,
      logWorkoutToday,
      logExerciseSets,
      getTodayExerciseSets,
      getLastExerciseSets,
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
      setWorkoutSelection, workoutLog, workoutSessionLogs, lastWorkoutLog, logWorkoutToday, logExerciseSets, getTodayExerciseSets, getLastExerciseSets,
      mealPlan, setMealPlanEntry, generateShoppingListFromPlan,
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
