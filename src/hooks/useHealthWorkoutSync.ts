import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { DetectedWorkout, fetchLastWorkout, isHealthSyncAvailable, requestWorkoutReadPermission } from '../data/healthSync';

// Logica UX del "controllo in foreground": quando l'app torna in primo piano
// (o al primo avvio utile), legge passivamente l'ultimo allenamento registrato
// dallo smartwatch e lo confronta con l'ultimo salvato nel diario allenamenti
// dell'app. Se è più recente, espone i dati pronti per il pop-up di conferma
// ("Abbiamo rilevato un allenamento di ... Vuoi associarlo alla tua scheda?").
//
// Non fa nulla finché isHealthSyncAvailable() è false, cioè finché i pacchetti
// nativi di HealthKit/Health Connect non sono installati in una dev build
// (vedi src/data/healthSync.ts) — sicuro da montare anche oggi, su Expo Go.
export function useHealthWorkoutSync(lastSavedWorkoutTimestamp: string | null) {
  const [pendingWorkout, setPendingWorkout] = useState<DetectedWorkout | null>(null);
  const appState = useRef(AppState.currentState);
  const checking = useRef(false);

  const checkForNewWorkout = useCallback(async () => {
    if (checking.current || !isHealthSyncAvailable()) return;
    checking.current = true;
    try {
      const granted = await requestWorkoutReadPermission();
      if (!granted) return;
      const detected = await fetchLastWorkout();
      if (!detected) return;
      const isNewer = !lastSavedWorkoutTimestamp || new Date(detected.timestamp) > new Date(lastSavedWorkoutTimestamp);
      if (isNewer) setPendingWorkout(detected);
    } finally {
      checking.current = false;
    }
  }, [lastSavedWorkoutTimestamp]);

  useEffect(() => {
    checkForNewWorkout();
    const subscription = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        checkForNewWorkout();
      }
      appState.current = next;
    });
    return () => subscription.remove();
  }, [checkForNewWorkout]);

  return { pendingWorkout, dismissPendingWorkout: () => setPendingWorkout(null) };
}
