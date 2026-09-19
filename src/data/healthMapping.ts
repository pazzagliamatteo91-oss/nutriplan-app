// ---------------------------------------------------------------------------
// Mappatura sport dell'app <-> tipi di allenamento di Apple HealthKit (iOS) e
// Android Health Connect, per il riconoscimento automatico delle attività
// caricate dallo smartwatch (funzionalità premium di sincronizzazione).
//
// Fonti: HKWorkoutActivityType (HealthKit) e ExerciseSessionRecord.ExerciseType
// (Health Connect, androidx.health.connect.client.records). I nomi qui sotto
// sono quelli ufficiali delle due piattaforme; dove un'attività non ha un tipo
// dedicato viene mappata sul fallback generico "Other"/"OTHER_WORKOUT", che è
// il comportamento corretto raccomandato da entrambe le piattaforme per le
// discipline di nicchia.
//
// NOTA IMPORTANTE: le voci marcate "// verificare" sono quelle per cui la
// corrispondenza esatta è meno consolidata (tipi introdotti in versioni
// recenti dell'SDK, o naming leggermente diverso tra le librerie React
// Native che le espongono). Prima di andare in produzione, verifica questi
// valori contro:
// - HealthKit: https://developer.apple.com/documentation/healthkit/hkworkoutactivitytype
// - Health Connect: https://developer.android.com/reference/androidx/health/connect/client/records/ExerciseSessionRecord
// ---------------------------------------------------------------------------

export type SportHealthMapping = {
  /** Nome del case HKWorkoutActivityType (usato da react-native-health come Constants.Activities.<Nome>). */
  healthKit: string;
  /** Nome della costante ExerciseType di Health Connect (EXERCISE_TYPE_...). */
  healthConnect: string;
  /** true per gli sport di squadra: nell'app determinano la Scheda di Preparazione Atletica + Supporto. */
  teamSport?: boolean;
};

const OTHER: SportHealthMapping = { healthKit: 'Other', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' };

export const SPORT_HEALTH_MAPPING: Record<string, SportHealthMapping> = {
  // --- Sport principali (MAIN_SPORTS) ---
  corsa: { healthKit: 'Running', healthConnect: 'EXERCISE_TYPE_RUNNING' },
  ciclismo: { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING' },
  nuoto: { healthKit: 'Swimming', healthConnect: 'EXERCISE_TYPE_SWIMMING_POOL' },

  // --- Voci storiche, non più tra i MAIN_SPORTS ma utili come riferimento
  // per il riconoscimento automatico di attività rilevate dallo smartwatch ---
  tennis: { healthKit: 'Tennis', healthConnect: 'EXERCISE_TYPE_TENNIS' },
  palestra: { healthKit: 'TraditionalStrengthTraining', healthConnect: 'EXERCISE_TYPE_STRENGTH_TRAINING' },
  yoga: { healthKit: 'Yoga', healthConnect: 'EXERCISE_TYPE_YOGA' },
  calcio: { healthKit: 'Soccer', healthConnect: 'EXERCISE_TYPE_SOCCER', teamSport: true },

  // --- Corsa / atletica estesa ---
  'trail-running': { healthKit: 'Running', healthConnect: 'EXERCISE_TYPE_RUNNING' },
  'adventure-race': OTHER,
  triathlon: { healthKit: 'Triathlon', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare: HC non ha un tipo composito dedicato
  duathlon: OTHER,
  maratona: { healthKit: 'Running', healthConnect: 'EXERCISE_TYPE_RUNNING' },
  'mezza-maratona': { healthKit: 'Running', healthConnect: 'EXERCISE_TYPE_RUNNING' },
  'atletica-leggera': { healthKit: 'TrackAndField', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare
  'salto-in-alto': { healthKit: 'TrackAndField', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' },
  'salto-in-lungo': { healthKit: 'TrackAndField', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' },
  'lancio-del-peso': { healthKit: 'TrackAndField', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' },
  marcia: { healthKit: 'Walking', healthConnect: 'EXERCISE_TYPE_WALKING' },

  // --- Ciclismo esteso ---
  'ciclismo-su-strada': { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING' },
  'mountain-bike': { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING' },
  bmx: { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING' },
  ciclocross: { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING' },
  spinning: { healthKit: 'Cycling', healthConnect: 'EXERCISE_TYPE_BIKING_STATIONARY' },

  // --- Nuoto / sport acquatici estesi ---
  'nuoto-acque-libere': { healthKit: 'Swimming', healthConnect: 'EXERCISE_TYPE_SWIMMING_OPEN_WATER' },
  tuffi: OTHER,
  'nuoto-sincronizzato': { healthKit: 'Swimming', healthConnect: 'EXERCISE_TYPE_SWIMMING_POOL' },
  pallanuoto: { healthKit: 'WaterPolo', healthConnect: 'EXERCISE_TYPE_WATER_POLO', teamSport: true },
  canottaggio: { healthKit: 'Rowing', healthConnect: 'EXERCISE_TYPE_ROWING' },
  canoa: { healthKit: 'Rowing', healthConnect: 'EXERCISE_TYPE_ROWING' },
  kayak: { healthKit: 'Rowing', healthConnect: 'EXERCISE_TYPE_ROWING' },
  vela: { healthKit: 'Sailing', healthConnect: 'EXERCISE_TYPE_SAILING' },
  windsurf: { healthKit: 'SurfingSports', healthConnect: 'EXERCISE_TYPE_SURFING' },
  kitesurf: { healthKit: 'SurfingSports', healthConnect: 'EXERCISE_TYPE_SURFING' },
  surf: { healthKit: 'SurfingSports', healthConnect: 'EXERCISE_TYPE_SURFING' },
  paddleboard: { healthKit: 'PaddleSports', healthConnect: 'EXERCISE_TYPE_PADDLING' }, // verificare nome esatto HC
  immersioni: OTHER, // verificare: HealthKit ha "UnderwaterDiving" in versioni recenti

  // --- Sport di squadra estesi ---
  pallavolo: { healthKit: 'Volleyball', healthConnect: 'EXERCISE_TYPE_VOLLEYBALL', teamSport: true },
  'beach-volley': { healthKit: 'Volleyball', healthConnect: 'EXERCISE_TYPE_VOLLEYBALL', teamSport: true },
  basket: { healthKit: 'Basketball', healthConnect: 'EXERCISE_TYPE_BASKETBALL', teamSport: true },
  pallamano: { healthKit: 'Handball', healthConnect: 'EXERCISE_TYPE_HANDBALL', teamSport: true },
  rugby: { healthKit: 'Rugby', healthConnect: 'EXERCISE_TYPE_RUGBY', teamSport: true },
  'football-americano': { healthKit: 'AmericanFootball', healthConnect: 'EXERCISE_TYPE_FOOTBALL_AMERICAN', teamSport: true },
  baseball: { healthKit: 'Baseball', healthConnect: 'EXERCISE_TYPE_BASEBALL', teamSport: true },
  softball: { healthKit: 'Softball', healthConnect: 'EXERCISE_TYPE_SOFTBALL', teamSport: true },
  cricket: { healthKit: 'Cricket', healthConnect: 'EXERCISE_TYPE_CRICKET', teamSport: true },
  'hockey-prato': { healthKit: 'FieldHockey', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT', teamSport: true }, // verificare HC
  'hockey-ghiaccio': { healthKit: 'IceHockey', healthConnect: 'EXERCISE_TYPE_ICE_HOCKEY', teamSport: true },

  // --- Racchette ---
  badminton: { healthKit: 'Badminton', healthConnect: 'EXERCISE_TYPE_BADMINTON' },
  squash: { healthKit: 'Squash', healthConnect: 'EXERCISE_TYPE_SQUASH' },
  padel: { healthKit: 'Padel', healthConnect: 'EXERCISE_TYPE_PADDLE_TENNIS' }, // verificare: tipi recenti, controllare disponibilità SDK
  'ping-pong': { healthKit: 'TableTennis', healthConnect: 'EXERCISE_TYPE_TABLE_TENNIS' },
  golf: { healthKit: 'Golf', healthConnect: 'EXERCISE_TYPE_GOLF' },

  // --- Tiro / precisione ---
  'tiro-con-arco': { healthKit: 'Archery', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare HC
  'tiro-a-segno': OTHER,
  scherma: { healthKit: 'Fencing', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare HC

  // --- Combattimento ---
  boxe: { healthKit: 'Boxing', healthConnect: 'EXERCISE_TYPE_BOXING' },
  kickboxing: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  'muay-thai': { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  mma: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  judo: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  karate: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  taekwondo: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  aikido: { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  'jiu-jitsu-brasiliano': { healthKit: 'MartialArts', healthConnect: 'EXERCISE_TYPE_MARTIAL_ARTS' },
  lotta: { healthKit: 'Wrestling', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare HC
  wrestling: { healthKit: 'Wrestling', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' },

  // --- Palestra / fitness ---
  'sollevamento-pesi': { healthKit: 'TraditionalStrengthTraining', healthConnect: 'EXERCISE_TYPE_WEIGHTLIFTING' },
  powerlifting: { healthKit: 'TraditionalStrengthTraining', healthConnect: 'EXERCISE_TYPE_WEIGHTLIFTING' },
  crossfit: { healthKit: 'HighIntensityIntervalTraining', healthConnect: 'EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING' },
  calisthenics: { healthKit: 'FunctionalStrengthTraining', healthConnect: 'EXERCISE_TYPE_CALISTHENICS' },
  'functional-training': { healthKit: 'FunctionalStrengthTraining', healthConnect: 'EXERCISE_TYPE_STRENGTH_TRAINING' },
  hiit: { healthKit: 'HighIntensityIntervalTraining', healthConnect: 'EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING' },
  hyrox: { healthKit: 'CrossTraining', healthConnect: 'EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING' }, // verificare: nessun tipo dedicato su nessuna delle due piattaforme
  pilates: { healthKit: 'Pilates', healthConnect: 'EXERCISE_TYPE_PILATES' },

  // --- Danza ---
  'danza-classica': { healthKit: 'Dance', healthConnect: 'EXERCISE_TYPE_DANCING' },
  'danza-moderna': { healthKit: 'Dance', healthConnect: 'EXERCISE_TYPE_DANCING' },
  'danza-hip-hop': { healthKit: 'Dance', healthConnect: 'EXERCISE_TYPE_DANCING' },
  zumba: { healthKit: 'Dance', healthConnect: 'EXERCISE_TYPE_DANCING' },
  'danza-aerea': { healthKit: 'Dance', healthConnect: 'EXERCISE_TYPE_DANCING' },

  // --- Pattinaggio / ruote ---
  'pattinaggio-artistico': OTHER, // verificare: possibile "SkatingSports" (HK) recente
  'pattinaggio-rotelle': OTHER,
  skateboard: OTHER,

  // --- Arrampicata / montagna ---
  'arrampicata-sportiva': { healthKit: 'ClimbingSport', healthConnect: 'EXERCISE_TYPE_ROCK_CLIMBING' },
  boulder: { healthKit: 'ClimbingSport', healthConnect: 'EXERCISE_TYPE_ROCK_CLIMBING' },
  alpinismo: { healthKit: 'ClimbingSport', healthConnect: 'EXERCISE_TYPE_ROCK_CLIMBING' },
  trekking: { healthKit: 'Hiking', healthConnect: 'EXERCISE_TYPE_HIKING' },
  escursionismo: { healthKit: 'Hiking', healthConnect: 'EXERCISE_TYPE_HIKING' },

  // --- Sport invernali ---
  'sci-alpino': { healthKit: 'DownhillSkiing', healthConnect: 'EXERCISE_TYPE_SKIING' },
  'sci-fondo': { healthKit: 'CrossCountrySkiing', healthConnect: 'EXERCISE_TYPE_SKIING' },
  snowboard: { healthKit: 'Snowboarding', healthConnect: 'EXERCISE_TYPE_SNOWBOARDING' },
  freeride: { healthKit: 'DownhillSkiing', healthConnect: 'EXERCISE_TYPE_SKIING' },
  slittino: OTHER,
  bob: OTHER,
  'pattinaggio-velocita': OTHER,
  curling: { healthKit: 'Curling', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare HC

  // --- Altri ---
  equitazione: { healthKit: 'EquestrianSports', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT' }, // verificare HC
  polo: { healthKit: 'EquestrianSports', healthConnect: 'EXERCISE_TYPE_OTHER_WORKOUT', teamSport: true },
  'tiro-fionda': OTHER,
  parkour: OTHER,
  'ginnastica-artistica': { healthKit: 'Gymnastics', healthConnect: 'EXERCISE_TYPE_GYMNASTICS' },
  'ginnastica-ritmica': { healthKit: 'Gymnastics', healthConnect: 'EXERCISE_TYPE_GYMNASTICS' },
  orienteering: OTHER,
  mototrial: OTHER,
  motocross: OTHER,
};

/** Fallback per qualunque sportId non presente nella tabella. */
export function healthMappingFor(sportId: string): SportHealthMapping {
  return SPORT_HEALTH_MAPPING[sportId] ?? OTHER;
}

/** Ricerca inversa: da un nome di attività HealthKit rilevata allo sportId dell'app. */
export function sportIdFromHealthKitActivity(activity: string): string | null {
  const entry = Object.entries(SPORT_HEALTH_MAPPING).find(([, m]) => m.healthKit === activity);
  return entry ? entry[0] : null;
}

/** Ricerca inversa: da una costante ExerciseType di Health Connect rilevata allo sportId dell'app. */
export function sportIdFromHealthConnectType(exerciseType: string): string | null {
  const entry = Object.entries(SPORT_HEALTH_MAPPING).find(([, m]) => m.healthConnect === exerciseType);
  return entry ? entry[0] : null;
}
