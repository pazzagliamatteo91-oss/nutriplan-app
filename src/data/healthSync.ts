import { Platform } from 'react-native';
import { sportIdFromHealthKitActivity, sportIdFromHealthConnectType } from './healthMapping';

// ---------------------------------------------------------------------------
// Sincronizzazione passiva con lo smartwatch (funzionalità premium).
//
// STACK: React Native + Expo (SDK 57), storage locale (AsyncStorage, nessun
// backend) — coerente con il resto dell'app.
//
// Questo modulo richiede pacchetti nativi NON inclusi in Expo Go, quindi non
// è utilizzabile finché non si passa a una development build:
//   1. npx expo install expo-dev-client
//   2. iOS:     npx expo install react-native-health
//      Android: npx expo install react-native-health-connect
//   3. Aggiungere i plugin di configurazione in app.json (vedi in fondo al file)
//   4. npx expo prebuild && npx expo run:ios / npx expo run:android
//      (oppure una build EAS con "developmentClient": true)
//
// Finché i pacchetti nativi non sono installati, isHealthSyncAvailable()
// ritorna false e il resto dell'app funziona esattamente come oggi: nessuna
// di queste funzioni viene mai invocata con effetto, quindi è sicuro tenerle
// nel codice anche prima di fare il passaggio a una dev build.
// ---------------------------------------------------------------------------

export type DetectedWorkout = {
  sportId: string;
  durationMinutes: number;
  kcal: number;
  timestamp: string; // ISO 8601, fine dell'allenamento
  source: 'healthkit' | 'health-connect';
};

// require() dinamico avvolto in try/catch: se il pacchetto nativo non è
// linkato (Expo Go, o dev build senza il modulo), l'app non crasha — la
// sincronizzazione risulta semplicemente non disponibile.
let AppleHealthKit: any = null;
let HealthConnect: any = null;
if (Platform.OS === 'ios') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AppleHealthKit = require('react-native-health').default;
  } catch {
    AppleHealthKit = null;
  }
} else if (Platform.OS === 'android') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    HealthConnect = require('react-native-health-connect');
  } catch {
    HealthConnect = null;
  }
}

export function isHealthSyncAvailable(): boolean {
  return (Platform.OS === 'ios' && !!AppleHealthKit) || (Platform.OS === 'android' && !!HealthConnect);
}

// --- iOS: HealthKit ---------------------------------------------------------

const HEALTHKIT_PERMISSIONS = {
  permissions: {
    read: ['Workout'],
    write: [],
  },
};

function requestHealthKitPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!AppleHealthKit) return resolve(false);
    AppleHealthKit.initHealthKit(HEALTHKIT_PERMISSIONS, (error: string) => {
      resolve(!error);
    });
  });
}

function fetchLastHealthKitWorkout(): Promise<DetectedWorkout | null> {
  return new Promise((resolve) => {
    if (!AppleHealthKit) return resolve(null);
    const options = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      ascending: false, // più recenti prima
      limit: 1,
    };
    AppleHealthKit.getSamples({ ...options, type: 'Workout' }, (err: string, results: any[]) => {
      if (err || !results || results.length === 0) return resolve(null);
      const w = results[0];
      const sportId = sportIdFromHealthKitActivity(w.activityName ?? w.activityType) ?? 'altro';
      resolve({
        sportId,
        durationMinutes: Math.round((new Date(w.end).getTime() - new Date(w.start).getTime()) / 60000),
        kcal: Math.round(w.calories ?? 0),
        timestamp: w.end,
        source: 'healthkit',
      });
    });
  });
}

// --- Android: Health Connect -------------------------------------------------

async function requestHealthConnectPermission(): Promise<boolean> {
  if (!HealthConnect) return false;
  const isAvailable = await HealthConnect.getSdkStatus?.();
  if (isAvailable === HealthConnect.SdkAvailabilityStatus?.SDK_UNAVAILABLE) return false;
  const granted = await HealthConnect.requestPermission([{ accessType: 'read', recordType: 'ExerciseSession' }]);
  return Array.isArray(granted) && granted.length > 0;
}

async function fetchLastHealthConnectWorkout(): Promise<DetectedWorkout | null> {
  if (!HealthConnect) return null;
  const now = new Date();
  const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const { records } = await HealthConnect.readRecords('ExerciseSession', {
    timeRangeFilter: { operator: 'between', startTime: start.toISOString(), endTime: now.toISOString() },
  });
  if (!records || records.length === 0) return null;
  const sorted = [...records].sort((a: any, b: any) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
  const w = sorted[0];
  const sportId = sportIdFromHealthConnectType(w.exerciseType) ?? 'altro';
  return {
    sportId,
    durationMinutes: Math.round((new Date(w.endTime).getTime() - new Date(w.startTime).getTime()) / 60000),
    // Health Connect espone le calorie in un record separato (TotalCaloriesBurnedRecord),
    // da leggere e correlare per intervallo di tempo con la sessione — omesso qui per brevità.
    kcal: 0,
    timestamp: w.endTime,
    source: 'health-connect',
  };
}

// --- API pubblica, cross-platform --------------------------------------------

export async function requestWorkoutReadPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') return requestHealthKitPermission();
  if (Platform.OS === 'android') return requestHealthConnectPermission();
  return false;
}

export async function fetchLastWorkout(): Promise<DetectedWorkout | null> {
  if (Platform.OS === 'ios') return fetchLastHealthKitWorkout();
  if (Platform.OS === 'android') return fetchLastHealthConnectWorkout();
  return null;
}

// ---------------------------------------------------------------------------
// Configurazione richiesta in app.json una volta installati i pacchetti nativi
// (Expo gestisce Info.plist / AndroidManifest.xml tramite config plugin, non
// vanno editati a mano):
//
// {
//   "expo": {
//     "ios": {
//       "infoPlist": {
//         "NSHealthShareUsageDescription": "NutriPlan legge i tuoi allenamenti da Salute per associarli automaticamente alla scheda giusta.",
//         "NSHealthUpdateUsageDescription": "NutriPlan non scrive dati in Salute, salvo lo richieda in futuro."
//       }
//     },
//     "android": {
//       "permissions": [
//         "android.permission.health.READ_EXERCISE",
//         "android.permission.health.READ_EXERCISE_ROUTE"
//       ]
//     },
//     "plugins": [
//       "react-native-health",
//       "react-native-health-connect"
//     ]
//   }
// }
//
// Note:
// - iOS: NSHealthShareUsageDescription è obbligatoria, senza l'app va in crash
//   alla prima richiesta di permessi HealthKit. HealthKit inoltre richiede la
//   capability "HealthKit" abilitata nel profilo di provisioning (gestita da
//   EAS Build se si aggiunge "healthkit": true sotto ios.entitlements, oppure
//   manualmente in Xcode per un dev client locale).
// - Android: da Android 14 i permessi Health Connect vanno dichiarati anche
//   con l'intent-filter "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE"
//   se l'app deve spiegare perché li richiede; il plugin del pacchetto lo
//   aggiunge automaticamente.
// - Su entrambe le piattaforme l'utente può revocare il permesso in qualsiasi
//   momento dalle impostazioni di sistema: requestWorkoutReadPermission() va
//   quindi richiamato prima di ogni fetchLastWorkout(), non solo una tantum.
// ---------------------------------------------------------------------------
