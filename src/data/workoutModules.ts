import { Bilingual, bi, Exercise, WorkoutLevel, WorkoutModule, ModulesByLevel, SportWorkoutLibrary } from './types';

// ---------------------------------------------------------------------------
// Motore dei contenuti delle schede di allenamento, in stile preparatore
// atletico: per ogni sport, due macro-schede (Focus e Supporto), ciascuna con
// più moduli tra cui scegliere, ciascun modulo diviso in 3 fasi reali
// (riscaldamento, parte centrale, defaticamento) e con contenuto realmente
// diverso — non solo scalato numericamente — per ognuno dei 4 livelli.
//
// Struttura dimostrativa completa per 2 sport: Calcio (sport di squadra) e
// Corsa (sport individuale). Gli altri sport continuano a usare il motore
// "a pool" esistente in workouts.ts finché non vengono migrati allo stesso
// schema.
// ---------------------------------------------------------------------------

function ex(nomeIt: string, nomeEn: string, dettIt: string, dettEn: string): Exercise {
  return { nome: bi(nomeIt, nomeEn), dettaglio: bi(dettIt, dettEn) };
}

function modulo(
  id: string,
  nome: Bilingual,
  descrizione: Bilingual,
  riscaldamento: Exercise[],
  centrale: Exercise[],
  defaticamento: Exercise[]
): WorkoutModule {
  return { id, nome, descrizione, fasi: { riscaldamento, centrale, defaticamento } };
}

// Per gli sport aggiunti dopo Calcio/Corsa, riscaldamento e defaticamento sono
// condivisi tra i moduli della stessa scheda (realistico: ci si scalda allo
// stesso modo indipendentemente dal modulo scelto quel giorno), mentre la
// parte centrale resta sempre specifica per modulo e livello.
type WarmCooldownByLevel = Record<WorkoutLevel, { riscaldamento: Exercise[]; defaticamento: Exercise[] }>;

function moduloCondiviso(
  id: string,
  nome: Bilingual,
  descrizioni: Record<WorkoutLevel, Bilingual>,
  wc: WarmCooldownByLevel,
  centrale: Record<WorkoutLevel, Exercise[]>
): Record<WorkoutLevel, WorkoutModule> {
  const build = (level: WorkoutLevel): WorkoutModule =>
    modulo(id, nome, descrizioni[level], wc[level].riscaldamento, centrale[level], wc[level].defaticamento);
  return { Base: build('Base'), Intermedio: build('Intermedio'), Avanzato: build('Avanzato'), Agonista: build('Agonista') };
}

// ===========================================================================
// CALCIO — sport di squadra
// ===========================================================================

// --- Scheda Preparatoria (Focus Performance) ---

const CALCIO_ESPLOSIVITA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'esplosivita-scatti',
    bi('Esplosività e Scatti', 'Explosiveness and Sprints'),
    bi('Introduzione al lavoro di velocità pura', 'Introduction to pure speed work'),
    [
      ex('Corsa leggera di attivazione', 'Light activation run', '8 min', '8 min'),
      ex('Skip basso e allunghi', 'Low skip and strides', '2x20m', '2x20m'),
    ],
    [
      ex('Scatti brevi', 'Short sprints', '4x10m', '4x10m'),
      ex('Scatti medi', 'Medium sprints', '3x20m, rec. 60s', '3x20m, 60s rest'),
      ex('Salti alla funicella', 'Jump rope', '2x30s', '2x30s'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching quadricipiti e polpacci', 'Quad and calf stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'esplosivita-scatti',
    bi('Esplosività e Scatti', 'Explosiveness and Sprints'),
    bi('Sviluppo della velocità di reazione e accelerazione', 'Developing reaction speed and acceleration'),
    [
      ex('Corsa di attivazione con skip A/B', 'Activation run with A/B skips', '10 min', '10 min'),
      ex('Allunghi progressivi', 'Progressive strides', '3x30m', '3x30m'),
    ],
    [
      ex('Scatti da fermo', 'Sprints from standstill', '6x15m, rec. 45s', '6x15m, 45s rest'),
      ex('Scatti con partenza in movimento', 'Flying sprints', '4x30m', '4x30m'),
      ex('Balzi in cadenza', 'Rhythmic bounds', '3x10', '3x10'),
    ],
    [
      ex('Jog leggero', 'Light jog', '5 min', '5 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'esplosivita-scatti',
    bi('Esplosività e Scatti', 'Explosiveness and Sprints'),
    bi('Accelerazione con sovraccarico e cambi di ritmo', 'Overload acceleration and pace changes'),
    [
      ex('Attivazione dinamica completa', 'Full dynamic activation', '10 min', '10 min'),
      ex('Skip A/B con cambio direzione', 'A/B skips with direction change', '3x20m', '3x20m'),
    ],
    [
      ex('Scatti con resistenza elastica', 'Resisted sprints (band)', '5x20m', '5x20m'),
      ex('Scatti massimali', 'Maximal sprints', '5x40m, rec. 90s', '5x40m, 90s rest'),
      ex('Balzi pliometrici in cadenza', 'Plyometric rhythmic bounds', '4x10', '4x10'),
    ],
    [
      ex('Jog di scarico', 'Cool-down jog', '6 min', '6 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'esplosivita-scatti',
    bi('Esplosività e Scatti', 'Explosiveness and Sprints'),
    bi('Massima velocità e potenza di reattività da gara', 'Peak speed and match-level reactive power'),
    [
      ex('Attivazione neuromuscolare completa', 'Full neuromuscular activation', '12 min', '12 min'),
      ex('Skip A/B/C', 'A/B/C skips', '3x25m', '3x25m'),
    ],
    [
      ex('Piramide di scatti 10-20-30m', 'Sprint pyramid 10-20-30m', '3 serie, rec. 2 min', '3 sets, 2 min rest'),
      ex('Sprint massimali', 'Maximal sprints', '6x40m, rec. 2 min', '6x40m, 2 min rest'),
      ex('Pliometria a contropiede', 'Reactive counter-jump plyometrics', '5x8', '5x8'),
    ],
    [
      ex('Jog e mobilità dinamica', 'Jog and dynamic mobility', '8 min', '8 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

const CALCIO_AGILITA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'agilita-cod',
    bi('Agilità e Cambi di Direzione', 'Agility and Change of Direction'),
    bi('Coordinazione di base e primi cambi di senso', 'Basic coordination and first direction changes'),
    [
      ex('Corsa laterale di attivazione', 'Lateral activation run', '2x15m', '2x15m'),
      ex('Skip e passo incrociato', 'Skip and crossover step', '2x15m', '2x15m'),
    ],
    [
      ex('Slalom tra coni', 'Cone slalom', '4 ripetizioni', '4 reps'),
      ex('Cambio di direzione a T', 'T-drill direction change', '3 ripetizioni', '3 reps'),
      ex('Scaletta di agilità', 'Agility ladder', '3x2 passaggi', '3x2 patterns'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching anche e caviglie', 'Hip and ankle stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'agilita-cod',
    bi('Agilità e Cambi di Direzione', 'Agility and Change of Direction'),
    bi('Cambi di direzione a velocità di gioco', 'Direction changes at match speed'),
    [
      ex('Corsa laterale e incrociata', 'Lateral and crossover run', '3x20m', '3x20m'),
      ex('Skip A con cambio ritmo', 'A-skip with pace change', '3x15m', '3x15m'),
    ],
    [
      ex('Slalom stretto tra coni', 'Tight cone slalom', '5 ripetizioni', '5 reps'),
      ex('Drill a T con sprint finale', 'T-drill with final sprint', '4 ripetizioni', '4 reps'),
      ex('Scaletta con reattività su segnale', 'Ladder with reaction cue', '4x2 passaggi', '4x2 patterns'),
    ],
    [
      ex('Jog leggero', 'Light jog', '5 min', '5 min'),
      ex('Stretching anche e caviglie', 'Hip and ankle stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'agilita-cod',
    bi('Agilità e Cambi di Direzione', 'Agility and Change of Direction'),
    bi('Agilità reattiva con stimolo visivo', 'Reactive agility with visual cue'),
    [
      ex('Attivazione multidirezionale', 'Multidirectional activation', '8 min', '8 min'),
      ex('Skip incrociato con affondo', 'Crossover skip with lunge', '3x20m', '3x20m'),
    ],
    [
      ex('Drill a 5 coni con cambio senso', '5-cone drill with reversal', '5 ripetizioni', '5 reps'),
      ex('Cambio di direzione reattivo su segnale', 'Reactive direction change on cue', '6 ripetizioni', '6 reps'),
      ex('Scaletta + sprint di uscita', 'Ladder + exit sprint', '4x2 passaggi', '4x2 patterns'),
    ],
    [
      ex('Jog di scarico', 'Cool-down jog', '6 min', '6 min'),
      ex('Stretching PNF anche', 'PNF hip stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'agilita-cod',
    bi('Agilità e Cambi di Direzione', 'Agility and Change of Direction'),
    bi('Agilità da gara con decisione sotto pressione', 'Match-level agility with decision-making under pressure'),
    [
      ex('Attivazione multidirezionale completa', 'Full multidirectional activation', '10 min', '10 min'),
      ex('Skip A/B con cambio senso', 'A/B skip with reversal', '3x25m', '3x25m'),
    ],
    [
      ex('Circuito reattivo a coni con stimolo del compagno', 'Cone reactive circuit with partner cue', '6 ripetizioni', '6 reps'),
      ex('1v1 in spazio ridotto', '1v1 in tight space', '6x15s', '6x15s'),
      ex('Scaletta + sprint + cambio di direzione', 'Ladder + sprint + direction change', '5x2 passaggi', '5x2 patterns'),
    ],
    [
      ex('Jog e mobilità dinamica', 'Jog and dynamic mobility', '8 min', '8 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

const CALCIO_RESISTENZA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'resistenza-velocita',
    bi('Resistenza alla Velocità', 'Speed Endurance'),
    bi('Base aerobica generale per reggere la partita', 'General aerobic base to hold up through a match'),
    [
      ex('Corsa leggera', 'Light jog', '8 min', '8 min'),
      ex('Mobilità dinamica gambe', 'Dynamic leg mobility', '5 min', '5 min'),
    ],
    [
      ex('Corsa a ritmo costante', 'Steady-pace run', '15 min', '15 min'),
      ex('Fartlek leggero (alternanza ritmo)', 'Light fartlek (pace alternation)', '4x2 min', '4x2 min'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'resistenza-velocita',
    bi('Resistenza alla Velocità', 'Speed Endurance'),
    bi('Ripetute intermittenti tipo navetta', 'Shuttle-run style interval work'),
    [
      ex('Corsa di attivazione', 'Activation run', '10 min', '10 min'),
      ex('Allunghi progressivi', 'Progressive strides', '3x20m', '3x20m'),
    ],
    [
      ex('Navetta 30-15 Intermittent', '30-15 Intermittent Fitness Test drill', '8 blocchi', '8 blocks'),
      ex('Corsa a soglia', 'Threshold run', '10 min', '10 min'),
    ],
    [
      ex('Jog leggero', 'Light jog', '5 min', '5 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'resistenza-velocita',
    bi('Resistenza alla Velocità', 'Speed Endurance'),
    bi('Intermittente ad alta intensità specifico per il ruolo', 'High-intensity role-specific interval work'),
    [
      ex('Attivazione dinamica completa', 'Full dynamic activation', '10 min', '10 min'),
      ex('Allunghi con cambio ritmo', 'Strides with pace change', '4x25m', '4x25m'),
    ],
    [
      ex('Intermittente 15-15 ad alta intensità', 'High-intensity 15-15 intermittent', '10 blocchi', '10 blocks'),
      ex('Ripetute a soglia con recupero attivo', 'Threshold repeats with active recovery', '4x4 min', '4x4 min'),
    ],
    [
      ex('Jog di scarico', 'Cool-down jog', '6 min', '6 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'resistenza-velocita',
    bi('Resistenza alla Velocità', 'Speed Endurance'),
    bi('Simulazione del carico metabolico di una partita', 'Simulating the metabolic load of a match'),
    [
      ex('Attivazione neuromuscolare completa', 'Full neuromuscular activation', '12 min', '12 min'),
      ex('Allunghi e scatti brevi', 'Strides and short sprints', '4x30m', '4x30m'),
    ],
    [
      ex('Intermittente 15-15 su 2 tempi', 'Two-half 15-15 intermittent', '2x10 blocchi', '2x10 blocks'),
      ex('Ripetute alla massima velocità sostenibile', 'Repeats at maximum sustainable speed', '6x3 min', '6x3 min'),
    ],
    [
      ex('Jog e mobilità dinamica', 'Jog and dynamic mobility', '8 min', '8 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

// --- Scheda di Supporto (Forza, Muscoli e Core) ---

const CALCIO_PREVENZIONE: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'prevenzione-infortuni',
    bi('Prevenzione Infortuni', 'Injury Prevention'),
    bi('Stabilità di base per caviglie e ginocchia', 'Basic stability for ankles and knees'),
    [
      ex('Mobilità caviglia', 'Ankle mobility', '2 min per lato', '2 min per side'),
      ex('Camminata sulle punte e sui talloni', 'Toe and heel walk', '2x15m', '2x15m'),
    ],
    [
      ex('Equilibrio monopodalico', 'Single-leg balance', '3x20s per lato', '3x20s per side'),
      ex('Squat su una gamba assistito', 'Assisted single-leg squat', '2x8 per lato', '2x8 per side'),
      ex('Ponte glutei', 'Glute bridge', '3x12', '3x12'),
    ],
    [
      ex('Stretching polpacci', 'Calf stretching', '2x30s', '2x30s'),
      ex('Respirazione e rilassamento', 'Breathing and relaxation', '3 min', '3 min'),
    ]
  ),
  Intermedio: modulo(
    'prevenzione-infortuni',
    bi('Prevenzione Infortuni', 'Injury Prevention'),
    bi('Protocollo tipo Nordic/FIFA 11+ per caviglie e ginocchia', 'Nordic/FIFA 11+ style protocol for ankles and knees'),
    [
      ex('Mobilità caviglia e anca', 'Ankle and hip mobility', '4 min', '4 min'),
      ex('Skip su tavoletta propriocettiva', 'Skip on wobble board', '2x30s', '2x30s'),
    ],
    [
      ex('Equilibrio su tavoletta propriocettiva', 'Wobble board balance', '3x30s per lato', '3x30s per side'),
      ex('Nordic hamstring (eccentrico)', 'Nordic hamstring curl (eccentric)', '3x6', '3x6'),
      ex('Squat bulgaro', 'Bulgarian split squat', '3x10 per lato', '3x10 per side'),
    ],
    [
      ex('Stretching gambe completo', 'Full leg stretching', '3x30s', '3x30s'),
      ex('Foam roller polpacci e quadricipiti', 'Foam rolling calves and quads', '4 min', '4 min'),
    ]
  ),
  Avanzato: modulo(
    'prevenzione-infortuni',
    bi('Prevenzione Infortuni', 'Injury Prevention'),
    bi('Stabilità dinamica sotto carico e in atterraggio', 'Dynamic stability under load and on landing'),
    [
      ex('Mobilità dinamica completa', 'Full dynamic mobility', '6 min', '6 min'),
      ex('Skip propriocettivo con instabilità', 'Proprioceptive skip on unstable surface', '2x30s', '2x30s'),
    ],
    [
      ex('Atterraggio da salto controllato', 'Controlled jump-landing drill', '4x6', '4x6'),
      ex('Nordic hamstring completo', 'Full Nordic hamstring curl', '4x6', '4x6'),
      ex('Squat monopodalico su rialzo', 'Single-leg box squat', '3x10 per lato', '3x10 per side'),
    ],
    [
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
      ex('Foam roller completo', 'Full foam rolling', '5 min', '5 min'),
    ]
  ),
  Agonista: modulo(
    'prevenzione-infortuni',
    bi('Prevenzione Infortuni', 'Injury Prevention'),
    bi('Protocollo completo pre-gara per resistere ai contatti', 'Full pre-match protocol to withstand contact'),
    [
      ex('Attivazione articolare completa', 'Full joint activation', '8 min', '8 min'),
      ex('Skip propriocettivo avanzato', 'Advanced proprioceptive skip', '3x30s', '3x30s'),
    ],
    [
      ex('Atterraggio da salto con cambio direzione', 'Jump-landing with direction change', '5x6', '5x6'),
      ex('Nordic hamstring con resistenza', 'Resisted Nordic hamstring curl', '4x8', '4x8'),
      ex('Squat monopodalico dinamico', 'Dynamic single-leg squat', '4x10 per lato', '4x10 per side'),
    ],
    [
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
      ex('Foam roller e crioterapia leggera', 'Foam rolling and light cold therapy', '6 min', '6 min'),
    ]
  ),
};

const CALCIO_CORE: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'core-stability-avanzato',
    bi('Core Stability', 'Core Stability'),
    bi('Attivazione del core in isometria', 'Isometric core activation'),
    [
      ex('Cat-cow mobilità lombare', 'Cat-cow lumbar mobility', '2 min', '2 min'),
      ex('Attivazione trasverso addominale', 'Transverse abdominis activation', '2x10 respiri', '2x10 breaths'),
    ],
    [
      ex('Plank', 'Plank', '3x25s', '3x25s'),
      ex('Plank laterale', 'Side plank', '2x20s per lato', '2x20s per side'),
      ex('Dead bug', 'Dead bug', '3x10', '3x10'),
    ],
    [
      ex('Stretching lombare', 'Lower back stretching', '2x30s', '2x30s'),
      ex('Respirazione diaframmatica', 'Diaphragmatic breathing', '3 min', '3 min'),
    ]
  ),
  Intermedio: modulo(
    'core-stability-avanzato',
    bi('Core Stability Avanzato', 'Advanced Core Stability'),
    bi('Stabilità anti-rotazione e anti-estensione', 'Anti-rotation and anti-extension stability'),
    [
      ex('Cat-cow e mobilità toracica', 'Cat-cow and thoracic mobility', '3 min', '3 min'),
      ex('Attivazione core con elastico', 'Core activation with band', '2x10', '2x10'),
    ],
    [
      ex('Plank con tocco spalla', 'Plank with shoulder taps', '3x30s', '3x30s'),
      ex('Pallof press (anti-rotazione)', 'Pallof press (anti-rotation)', '3x12 per lato', '3x12 per side'),
      ex('Russian twist con peso', 'Weighted Russian twist', '3x16', '3x16'),
    ],
    [
      ex('Stretching lombare e obliqui', 'Lower back and oblique stretching', '3x30s', '3x30s'),
      ex('Respirazione diaframmatica', 'Diaphragmatic breathing', '3 min', '3 min'),
    ]
  ),
  Avanzato: modulo(
    'core-stability-avanzato',
    bi('Core Stability Avanzato', 'Advanced Core Stability'),
    bi('Stabilità dinamica sotto perturbazione', 'Dynamic stability under perturbation'),
    [
      ex('Mobilità toracica e lombare', 'Thoracic and lumbar mobility', '4 min', '4 min'),
      ex('Attivazione core con instabilità', 'Core activation on unstable surface', '2x30s', '2x30s'),
    ],
    [
      ex('Plank con spinta su TRX/anelli', 'Plank with TRX/rings push', '4x30s', '4x30s'),
      ex('Pallof press dinamico', 'Dynamic Pallof press', '4x12 per lato', '4x12 per side'),
      ex('Hollow body hold', 'Hollow body hold', '3x30s', '3x30s'),
    ],
    [
      ex('Stretching PNF lombare', 'PNF lower back stretching', '3x30s', '3x30s'),
      ex('Foam roller schiena', 'Foam rolling back', '4 min', '4 min'),
    ]
  ),
  Agonista: modulo(
    'core-stability-avanzato',
    bi('Core Stability Avanzato', 'Advanced Core Stability'),
    bi('Trasferimento di forza dal core agli arti in movimento', 'Force transfer from core to moving limbs'),
    [
      ex('Mobilità dinamica tronco', 'Dynamic trunk mobility', '5 min', '5 min'),
      ex('Attivazione core esplosiva', 'Explosive core activation', '2x8', '2x8'),
    ],
    [
      ex('Plank dinamico con trascinamento pesi', 'Dynamic plank with weight drag', '4x30s', '4x30s'),
      ex('Rotazione con palla medica', 'Medicine ball rotational throw', '4x10 per lato', '4x10 per side'),
      ex('Hollow body con oscillazione gambe', 'Hollow body with leg flutter', '4x30s', '4x30s'),
    ],
    [
      ex('Stretching PNF completo tronco', 'Full PNF trunk stretching', '4x30s', '4x30s'),
      ex('Foam roller e respirazione', 'Foam rolling and breathing', '5 min', '5 min'),
    ]
  ),
};

const CALCIO_IPERTROFIA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'ipertrofia-funzionale',
    bi('Ipertrofia Funzionale', 'Functional Hypertrophy'),
    bi('Forza generale a corpo libero', 'General bodyweight strength'),
    [
      ex('Mobilità articolare generale', 'General joint mobility', '5 min', '5 min'),
      ex('Attivazione glutei e core', 'Glute and core activation', '2x10', '2x10'),
    ],
    [
      ex('Squat a corpo libero', 'Bodyweight squat', '3x15', '3x15'),
      ex('Affondi alternati', 'Alternating lunges', '3x10 per lato', '3x10 per side'),
      ex('Piegamenti sulle braccia', 'Push-ups', '3x10', '3x10'),
    ],
    [
      ex('Stretching gambe e spalle', 'Leg and shoulder stretching', '2x30s', '2x30s'),
      ex('Respirazione di recupero', 'Recovery breathing', '3 min', '3 min'),
    ]
  ),
  Intermedio: modulo(
    'ipertrofia-funzionale',
    bi('Ipertrofia Funzionale/Forza Generale', 'Functional Hypertrophy / General Strength'),
    bi('Forza generale con sovraccarichi moderati', 'General strength with moderate loads'),
    [
      ex('Mobilità articolare dinamica', 'Dynamic joint mobility', '6 min', '6 min'),
      ex('Attivazione con elastico', 'Band activation', '2x12', '2x12'),
    ],
    [
      ex('Squat con bilanciere/manubri', 'Barbell/dumbbell squat', '4x10', '4x10'),
      ex('Stacco rumeno', 'Romanian deadlift', '3x10', '3x10'),
      ex('Panca piana o piegamenti zavorrati', 'Bench press or weighted push-ups', '3x10', '3x10'),
      ex('Trazioni assistite o lat machine', 'Assisted pull-ups or lat pulldown', '3x10', '3x10'),
    ],
    [
      ex('Stretching gambe e schiena', 'Leg and back stretching', '3x30s', '3x30s'),
      ex('Foam roller quadricipiti', 'Foam rolling quads', '4 min', '4 min'),
    ]
  ),
  Avanzato: modulo(
    'ipertrofia-funzionale',
    bi('Ipertrofia Funzionale/Forza Generale', 'Functional Hypertrophy / General Strength'),
    bi('Forza con carichi progressivi e componente esplosiva', 'Strength with progressive loads and explosive component'),
    [
      ex('Mobilità articolare completa', 'Full joint mobility', '8 min', '8 min'),
      ex('Attivazione con salti leggeri', 'Light jump activation', '2x8', '2x8'),
    ],
    [
      ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'),
      ex('Stacco da terra', 'Deadlift', '4x6', '4x6'),
      ex('Panca piana', 'Bench press', '4x8', '4x8'),
      ex('Trazioni zavorrate', 'Weighted pull-ups', '3x8', '3x8'),
      ex('Squat jump con manubri leggeri', 'Dumbbell squat jump', '3x8', '3x8'),
    ],
    [
      ex('Stretching PNF gambe e schiena', 'PNF leg and back stretching', '3x30s', '3x30s'),
      ex('Foam roller completo', 'Full foam rolling', '5 min', '5 min'),
    ]
  ),
  Agonista: modulo(
    'ipertrofia-funzionale',
    bi('Ipertrofia Funzionale/Forza Generale', 'Functional Hypertrophy / General Strength'),
    bi('Forza massimale e potenza da trasferire al campo', 'Maximal strength and power to transfer to the pitch'),
    [
      ex('Mobilità articolare e attivazione neurale', 'Joint mobility and neural activation', '10 min', '10 min'),
      ex('Salti con contromovimento', 'Countermovement jumps', '3x6', '3x6'),
    ],
    [
      ex('Squat con bilanciere pesante', 'Heavy barbell squat', '5x5', '5x5'),
      ex('Stacco da terra pesante', 'Heavy deadlift', '4x5', '4x5'),
      ex('Panca piana con sovraccarico progressivo', 'Bench press with progressive overload', '4x6', '4x6'),
      ex('Girata o strappo semplificato', 'Simplified clean or snatch', '4x4', '4x4'),
      ex('Trazioni zavorrate', 'Weighted pull-ups', '4x6', '4x6'),
    ],
    [
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
      ex('Foam roller e mobilità di scarico', 'Foam rolling and recovery mobility', '6 min', '6 min'),
    ]
  ),
};

function modulesByLevel(mods: Record<WorkoutLevel, WorkoutModule>[]): ModulesByLevel {
  return {
    Base: mods.map((m) => m.Base),
    Intermedio: mods.map((m) => m.Intermedio),
    Avanzato: mods.map((m) => m.Avanzato),
    Agonista: mods.map((m) => m.Agonista),
  };
}

export const CALCIO_LIBRARY: SportWorkoutLibrary = {
  sportId: 'calcio',
  isSportDiSquadra: true,
  focusLabel: bi('Scheda Preparatoria', 'Preparatory Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([CALCIO_ESPLOSIVITA, CALCIO_AGILITA, CALCIO_RESISTENZA]),
  supporto: modulesByLevel([CALCIO_PREVENZIONE, CALCIO_CORE, CALCIO_IPERTROFIA]),
};

// ===========================================================================
// CORSA — sport individuale
// ===========================================================================

// --- Scheda Specifica (Focus Tecnica/Performance) ---

const CORSA_VO2MAX: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'ripetute-vo2max',
    bi('Ripetute/VO2Max', 'Intervals / VO2Max'),
    bi('Prime ripetute brevi a ritmo sostenuto', 'First short repeats at a strong pace'),
    [
      ex('Corsa leggera', 'Light jog', '10 min', '10 min'),
      ex('Allunghi', 'Strides', '3x50m', '3x50m'),
    ],
    [
      ex('Ripetute 300m a ritmo sostenuto', '300m repeats at strong pace', '5x, rec. 2 min camminata', '5x, 2 min walk rest'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '8 min', '8 min'),
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'ripetute-vo2max',
    bi('Ripetute/VO2Max', 'Intervals / VO2Max'),
    bi('Ripetute medie a ritmo gara 5km', '5k race-pace repeats'),
    [
      ex('Corsa di attivazione', 'Activation run', '12 min', '12 min'),
      ex('Allunghi progressivi', 'Progressive strides', '4x80m', '4x80m'),
    ],
    [
      ex('Ripetute 400m a ritmo gara', '400m repeats at race pace', '6x, rec. 90s', '6x, 90s rest'),
      ex('Ripetuta lunga a soglia', 'Long threshold repeat', '1x8 min', '1x8 min'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '10 min', '10 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'ripetute-vo2max',
    bi('Ripetute/VO2Max', 'Intervals / VO2Max'),
    bi('Lavoro intervallato al massimo consumo di ossigeno', 'Interval work at maximal oxygen uptake'),
    [
      ex('Corsa di attivazione con variazioni', 'Activation run with surges', '12 min', '12 min'),
      ex('Allunghi in leggera salita', 'Strides on a slight incline', '4x80m', '4x80m'),
    ],
    [
      ex('Ripetute 800m a ritmo VO2Max', '800m repeats at VO2Max pace', '5x, rec. 3 min jog', '5x, 3 min jog rest'),
      ex('Ripetute brevi a velocità 3km', 'Short repeats at 3k pace', '4x400m, rec. 90s', '4x400m, 90s rest'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '10 min', '10 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'ripetute-vo2max',
    bi('Ripetute/VO2Max', 'Intervals / VO2Max'),
    bi('Sedute di qualità a intensità di gara sui 3-5km', 'Quality sessions at 3-5k race intensity'),
    [
      ex('Corsa di attivazione con variazioni', 'Activation run with surges', '15 min', '15 min'),
      ex('Allunghi progressivi', 'Progressive strides', '5x100m', '5x100m'),
    ],
    [
      ex('Ripetute 1000m a ritmo gara 5km', '1000m repeats at 5k race pace', '6x, rec. 2 min jog', '6x, 2 min jog rest'),
      ex('Ripetute brevi alla massima velocità sostenibile', 'Short repeats at max sustainable speed', '6x300m, rec. 2 min', '6x300m, 2 min rest'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '12 min', '12 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

const CORSA_FONDO: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'fondo-lento',
    bi('Fondo Lento/Resistenza', 'Easy Long Run / Endurance'),
    bi('Costruzione della base aerobica a ritmo confortevole', 'Building the aerobic base at a comfortable pace'),
    [
      ex('Camminata veloce', 'Brisk walk', '5 min', '5 min'),
    ],
    [
      ex('Corsa a ritmo confortevole', 'Comfortable-pace run', '25 min', '25 min'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'fondo-lento',
    bi('Fondo Lento/Resistenza', 'Easy Long Run / Endurance'),
    bi('Fondo medio con finale in progressione', 'Medium-long run with a progressive finish'),
    [
      ex('Corsa leggera di attivazione', 'Light activation run', '5 min', '5 min'),
    ],
    [
      ex('Corsa a ritmo blando', 'Easy-pace run', '40 min', '40 min'),
      ex('Ultimi minuti in leggera progressione', 'Last minutes with a slight pickup', '10 min', '10 min'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'fondo-lento',
    bi('Fondo Lento/Resistenza', 'Easy Long Run / Endurance'),
    bi('Fondo lungo per consolidare la resistenza aerobica', 'Long run to build aerobic endurance'),
    [
      ex('Corsa leggera di attivazione', 'Light activation run', '5 min', '5 min'),
    ],
    [
      ex('Corsa a ritmo blando costante', 'Steady easy-pace run', '70 min', '70 min'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'fondo-lento',
    bi('Fondo Lento/Resistenza', 'Easy Long Run / Endurance'),
    bi('Fondo lungo con tratti a ritmo maratona', 'Long run with marathon-pace segments'),
    [
      ex('Corsa leggera di attivazione', 'Light activation run', '10 min', '10 min'),
    ],
    [
      ex('Corsa a ritmo blando', 'Easy-pace run', '80 min', '80 min'),
      ex('Tratti a ritmo maratona', 'Marathon-pace segments', '3x10 min', '3x10 min'),
    ],
    [
      ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

const CORSA_POTENZA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'potenza-specifica',
    bi('Potenza Specifica', 'Specific Power'),
    bi('Introduzione al lavoro in salita e agli allunghi', 'Introduction to hill work and strides'),
    [
      ex('Corsa leggera di attivazione', 'Light activation run', '10 min', '10 min'),
    ],
    [
      ex('Salite brevi a ritmo sostenuto', 'Short hill repeats at strong effort', '5x40m, rec. discesa camminando', '5x40m, walk-down rest'),
      ex('Allunghi in piano', 'Flat strides', '4x60m', '4x60m'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '8 min', '8 min'),
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'potenza-specifica',
    bi('Potenza Specifica', 'Specific Power'),
    bi('Salite più lunghe per la forza specifica di corsa', 'Longer hills for running-specific strength'),
    [
      ex('Corsa di attivazione', 'Activation run', '12 min', '12 min'),
    ],
    [
      ex('Salite medie a ritmo sostenuto', 'Medium hill repeats at strong effort', '6x60m, rec. discesa camminando', '6x60m, walk-down rest'),
      ex('Balzi in cadenza in piano', 'Flat rhythmic bounds', '3x10', '3x10'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '10 min', '10 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'potenza-specifica',
    bi('Potenza Specifica', 'Specific Power'),
    bi('Salite lunghe e balzi per la potenza muscolare specifica', 'Long hills and bounds for running-specific power'),
    [
      ex('Corsa di attivazione con allunghi', 'Activation run with strides', '12 min', '12 min'),
    ],
    [
      ex('Salite lunghe a ritmo sostenuto', 'Long hill repeats at strong effort', '6x100m, rec. discesa camminando', '6x100m, walk-down rest'),
      ex('Balzi pliometrici in cadenza', 'Plyometric rhythmic bounds', '4x10', '4x10'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '10 min', '10 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'potenza-specifica',
    bi('Potenza Specifica', 'Specific Power'),
    bi('Salite massimali e potenza esplosiva da trasferire in piano', 'Maximal hills and explosive power to transfer to flat running'),
    [
      ex('Corsa di attivazione con allunghi', 'Activation run with strides', '15 min', '15 min'),
    ],
    [
      ex('Salite massimali', 'Maximal hill sprints', '8x100m, rec. discesa camminando', '8x100m, walk-down rest'),
      ex('Balzi pliometrici con sovraccarico leggero', 'Lightly loaded plyometric bounds', '5x10', '5x10'),
    ],
    [
      ex('Corsa lenta di scarico', 'Slow cool-down run', '12 min', '12 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ]
  ),
};

// --- Scheda di Supporto (Compensazione e Rinforzo) ---

const CORSA_RINFORZO: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'rinforzo-palestra',
    bi('Rinforzo Muscolare in Palestra', 'Gym Strength Training'),
    bi('Forza generale a corpo libero per runner', 'General bodyweight strength for runners'),
    [
      ex('Mobilità articolare generale', 'General joint mobility', '5 min', '5 min'),
    ],
    [
      ex('Squat a corpo libero', 'Bodyweight squat', '3x15', '3x15'),
      ex('Affondi alternati', 'Alternating lunges', '3x10 per lato', '3x10 per side'),
      ex('Ponte glutei', 'Glute bridge', '3x15', '3x15'),
    ],
    [
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'rinforzo-palestra',
    bi('Rinforzo Muscolare in Palestra', 'Gym Strength Training'),
    bi('Forza con sovraccarichi moderati per l\'economia di corsa', 'Moderate-load strength for running economy'),
    [
      ex('Mobilità articolare dinamica', 'Dynamic joint mobility', '6 min', '6 min'),
    ],
    [
      ex('Squat con manubri', 'Dumbbell squat', '4x10', '4x10'),
      ex('Affondi in cammino con manubri', 'Walking lunges with dumbbells', '3x12 per lato', '3x12 per side'),
      ex('Stacco rumeno monopodalico', 'Single-leg Romanian deadlift', '3x10 per lato', '3x10 per side'),
      ex('Calf raise', 'Calf raise', '3x15', '3x15'),
    ],
    [
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
      ex('Foam roller quadricipiti e polpacci', 'Foam rolling quads and calves', '4 min', '4 min'),
    ]
  ),
  Avanzato: modulo(
    'rinforzo-palestra',
    bi('Rinforzo Muscolare in Palestra', 'Gym Strength Training'),
    bi('Forza pesante a bassa velocità per la potenza muscolare', 'Heavy low-velocity strength for muscular power'),
    [
      ex('Mobilità articolare completa', 'Full joint mobility', '8 min', '8 min'),
    ],
    [
      ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'),
      ex('Stacco rumeno con bilanciere', 'Barbell Romanian deadlift', '4x8', '4x8'),
      ex('Affondi bulgari con manubri', 'Bulgarian split squats with dumbbells', '3x10 per lato', '3x10 per side'),
      ex('Calf raise monopodalico', 'Single-leg calf raise', '3x15 per lato', '3x15 per side'),
    ],
    [
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
      ex('Foam roller completo', 'Full foam rolling', '5 min', '5 min'),
    ]
  ),
  Agonista: modulo(
    'rinforzo-palestra',
    bi('Rinforzo Muscolare in Palestra', 'Gym Strength Training'),
    bi('Forza massimale e pliometria per la performance di gara', 'Maximal strength and plyometrics for race performance'),
    [
      ex('Mobilità articolare e attivazione neurale', 'Joint mobility and neural activation', '10 min', '10 min'),
    ],
    [
      ex('Squat pesante', 'Heavy squat', '5x5', '5x5'),
      ex('Stacco rumeno pesante', 'Heavy Romanian deadlift', '4x6', '4x6'),
      ex('Balzi in cadenza con sovraccarico', 'Loaded rhythmic bounds', '4x8', '4x8'),
      ex('Calf raise esplosivo', 'Explosive calf raise', '4x12', '4x12'),
    ],
    [
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
      ex('Foam roller e mobilità di scarico', 'Foam rolling and recovery mobility', '6 min', '6 min'),
    ]
  ),
};

const CORSA_MOBILITA: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'mobilita-flessibilita',
    bi('Mobilità Articolare e Flessibilità', 'Joint Mobility and Flexibility'),
    bi('Mobilità di base per anche e caviglie', 'Basic mobility for hips and ankles'),
    [
      ex('Respirazione e attivazione leggera', 'Breathing and light activation', '3 min', '3 min'),
    ],
    [
      ex('Mobilità anca in appoggio', 'Supported hip mobility', '2x10 per lato', '2x10 per side'),
      ex('Mobilità caviglia', 'Ankle mobility', '2x10 per lato', '2x10 per side'),
      ex('Stretching gambe da fermo', 'Static leg stretching', '3x30s', '3x30s'),
    ],
    [
      ex('Respirazione di rilassamento', 'Relaxation breathing', '3 min', '3 min'),
    ]
  ),
  Intermedio: modulo(
    'mobilita-flessibilita',
    bi('Mobilità Articolare e Flessibilità', 'Joint Mobility and Flexibility'),
    bi('Mobilità dinamica pre-corsa e stretching mirato', 'Pre-run dynamic mobility and targeted stretching'),
    [
      ex('Mobilità dinamica anca e caviglia', 'Dynamic hip and ankle mobility', '5 min', '5 min'),
    ],
    [
      ex('Leg swing anteriore e laterale', 'Front and lateral leg swings', '2x12 per lato', '2x12 per side'),
      ex('Affondo con rotazione', 'Lunge with rotation', '2x10 per lato', '2x10 per side'),
      ex('Stretching gambe e anche', 'Leg and hip stretching', '3x30s', '3x30s'),
    ],
    [
      ex('Respirazione di rilassamento', 'Relaxation breathing', '4 min', '4 min'),
    ]
  ),
  Avanzato: modulo(
    'mobilita-flessibilita',
    bi('Mobilità Articolare e Flessibilità', 'Joint Mobility and Flexibility'),
    bi('Mobilità attiva completa e stretching PNF', 'Full active mobility and PNF stretching'),
    [
      ex('Mobilità dinamica completa', 'Full dynamic mobility', '6 min', '6 min'),
    ],
    [
      ex('Leg swing multidirezionale', 'Multidirectional leg swings', '3x12 per lato', '3x12 per side'),
      ex('Affondo profondo con rotazione', 'Deep lunge with rotation', '3x10 per lato', '3x10 per side'),
      ex('Stretching PNF anche e ischiocrurali', 'PNF hip and hamstring stretching', '3x30s', '3x30s'),
    ],
    [
      ex('Foam roller gambe', 'Foam rolling legs', '5 min', '5 min'),
    ]
  ),
  Agonista: modulo(
    'mobilita-flessibilita',
    bi('Mobilità Articolare e Flessibilità', 'Joint Mobility and Flexibility'),
    bi('Protocollo completo di mobilità per l\'ampiezza del passo', 'Full mobility protocol for stride amplitude'),
    [
      ex('Mobilità dinamica completa avanzata', 'Advanced full dynamic mobility', '8 min', '8 min'),
    ],
    [
      ex('Leg swing multidirezionale ampio', 'Wide-range multidirectional leg swings', '3x15 per lato', '3x15 per side'),
      ex('Affondo profondo con reach', 'Deep lunge with overhead reach', '3x12 per lato', '3x12 per side'),
      ex('Stretching PNF completo gambe', 'Full PNF leg stretching', '4x30s', '4x30s'),
    ],
    [
      ex('Foam roller completo e respirazione', 'Full foam rolling and breathing', '6 min', '6 min'),
    ]
  ),
};

const CORSA_CORE_UPPER: Record<WorkoutLevel, WorkoutModule> = {
  Base: modulo(
    'core-upper-runner',
    bi('Core & Upper Body per Runner', 'Core & Upper Body for Runners'),
    bi('Postura e core per sostenere l\'assetto di corsa', 'Posture and core to support running form'),
    [
      ex('Attivazione core leggera', 'Light core activation', '2x10 respiri', '2x10 breaths'),
    ],
    [
      ex('Plank', 'Plank', '3x25s', '3x25s'),
      ex('Superman', 'Superman', '3x12', '3x12'),
      ex('Piegamenti sulle ginocchia', 'Knee push-ups', '2x10', '2x10'),
    ],
    [
      ex('Stretching spalle e schiena', 'Shoulder and back stretching', '2x30s', '2x30s'),
    ]
  ),
  Intermedio: modulo(
    'core-upper-runner',
    bi('Core & Upper Body per Runner', 'Core & Upper Body for Runners'),
    bi('Stabilità del busto per mantenere l\'assetto nel finale di gara', 'Trunk stability to hold form late in a race'),
    [
      ex('Attivazione core con elastico', 'Core activation with band', '2x12', '2x12'),
    ],
    [
      ex('Plank con tocco spalla', 'Plank with shoulder taps', '3x30s', '3x30s'),
      ex('Superman con estensione alternata', 'Superman with alternating extension', '3x14', '3x14'),
      ex('Piegamenti sulle braccia', 'Push-ups', '3x12', '3x12'),
      ex('Trazione con elastico (rematore)', 'Band row', '3x15', '3x15'),
    ],
    [
      ex('Stretching spalle e schiena', 'Shoulder and back stretching', '3x30s', '3x30s'),
    ]
  ),
  Avanzato: modulo(
    'core-upper-runner',
    bi('Core & Upper Body per Runner', 'Core & Upper Body for Runners'),
    bi('Resistenza del core specifica per il ritmo gara sostenuto', 'Core endurance specific to sustained race pace'),
    [
      ex('Attivazione core dinamica', 'Dynamic core activation', '2x12', '2x12'),
    ],
    [
      ex('Plank con spinta su TRX', 'Plank with TRX push', '4x30s', '4x30s'),
      ex('Hollow body hold', 'Hollow body hold', '3x30s', '3x30s'),
      ex('Piegamenti con tocco spalla', 'Push-ups with shoulder tap', '3x12', '3x12'),
      ex('Trazioni assistite', 'Assisted pull-ups', '3x8', '3x8'),
    ],
    [
      ex('Stretching PNF spalle e schiena', 'PNF shoulder and back stretching', '3x30s', '3x30s'),
    ]
  ),
  Agonista: modulo(
    'core-upper-runner',
    bi('Core & Upper Body per Runner', 'Core & Upper Body for Runners'),
    bi('Trasferimento di forza dal busto al ritmo di braccia in gara', 'Force transfer from trunk to race-pace arm drive'),
    [
      ex('Attivazione core esplosiva', 'Explosive core activation', '2x10', '2x10'),
    ],
    [
      ex('Plank dinamico con trascinamento pesi', 'Dynamic plank with weight drag', '4x30s', '4x30s'),
      ex('Hollow body con oscillazione gambe', 'Hollow body with leg flutter', '4x30s', '4x30s'),
      ex('Piegamenti esplosivi', 'Explosive push-ups', '4x10', '4x10'),
      ex('Trazioni complete', 'Full pull-ups', '4x8', '4x8'),
    ],
    [
      ex('Stretching PNF completo spalle e schiena', 'Full PNF shoulder and back stretching', '4x30s', '4x30s'),
    ]
  ),
};

export const CORSA_LIBRARY: SportWorkoutLibrary = {
  sportId: 'corsa',
  isSportDiSquadra: false,
  focusLabel: bi('Scheda Specifica', 'Specific Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([CORSA_VO2MAX, CORSA_FONDO, CORSA_POTENZA]),
  supporto: modulesByLevel([CORSA_RINFORZO, CORSA_MOBILITA, CORSA_CORE_UPPER]),
};

// ===========================================================================
// CICLISMO — sport individuale
// ===========================================================================

const CICLISMO_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Pedalata leggera di attivazione', 'Light activation ride', '10 min', '10 min')],
    defaticamento: [
      ex('Pedalata leggera di scarico', 'Light cool-down ride', '8 min', '8 min'),
      ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s'),
    ],
  },
  Intermedio: {
    riscaldamento: [
      ex('Pedalata di attivazione con cadenza', 'Activation ride with cadence work', '12 min', '12 min'),
      ex('Allunghi in sella', 'In-saddle strides', '3x30s', '3x30s'),
    ],
    defaticamento: [
      ex('Pedalata leggera di scarico', 'Light cool-down ride', '10 min', '10 min'),
      ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s'),
    ],
  },
  Avanzato: {
    riscaldamento: [
      ex('Attivazione dinamica con progressioni', 'Dynamic activation with build-ups', '12 min', '12 min'),
      ex('Allunghi progressivi', 'Progressive strides', '4x30s', '4x30s'),
    ],
    defaticamento: [
      ex('Pedalata leggera di scarico', 'Light cool-down ride', '10 min', '10 min'),
      ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s'),
    ],
  },
  Agonista: {
    riscaldamento: [
      ex('Attivazione dinamica completa', 'Full dynamic activation', '15 min', '15 min'),
      ex('Allunghi ad alta cadenza', 'High-cadence strides', '4x30s', '4x30s'),
    ],
    defaticamento: [
      ex('Pedalata leggera di scarico', 'Light cool-down ride', '12 min', '12 min'),
      ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'),
    ],
  },
};

const CICLISMO_SALITE = moduloCondiviso(
  'salite-soglia',
  bi('Salite e Soglia', 'Hills and Threshold'),
  {
    Base: bi('Prime salite brevi a ritmo sostenuto', 'First short hills at a strong effort'),
    Intermedio: bi('Salite medie a ritmo soglia', 'Medium hills at threshold pace'),
    Avanzato: bi('Salite lunghe a soglia con cambio ritmo', 'Long threshold hills with pace changes'),
    Agonista: bi('Salite da gara con progressione finale', 'Race-style hills with a final surge'),
  },
  CICLISMO_WC,
  {
    Base: [ex('Salita breve a ritmo sostenuto', 'Short hill at strong effort', '4x3 min, rec. 2 min discesa', '4x3 min, 2 min descent rest')],
    Intermedio: [ex('Salita media a soglia', 'Medium hill at threshold', '5x5 min, rec. 3 min', '5x5 min, 3 min rest')],
    Avanzato: [ex('Salita lunga a soglia', 'Long hill at threshold', '4x8 min, rec. 4 min', '4x8 min, 4 min rest')],
    Agonista: [
      ex('Salita lunga a soglia con cambio ritmo', 'Long threshold hill with pace changes', '3x12 min, rec. 5 min', '3x12 min, 5 min rest'),
      ex('Sprint finale in salita', 'Final hill sprint', '30s', '30s'),
    ],
  }
);

const CICLISMO_FONDO = moduloCondiviso(
  'fondo-lungo',
  bi('Fondo Lungo/Resistenza', 'Long Ride / Endurance'),
  {
    Base: bi('Base aerobica a ritmo confortevole', 'Aerobic base at a comfortable pace'),
    Intermedio: bi('Uscita media per consolidare la resistenza', 'Medium ride to build endurance'),
    Avanzato: bi('Uscita lunga a ritmo costante', 'Long ride at a steady pace'),
    Agonista: bi('Fondo lungo con tratti a ritmo gara', 'Long ride with race-pace segments'),
  },
  CICLISMO_WC,
  {
    Base: [ex('Uscita a ritmo blando', 'Easy-pace ride', '40 min', '40 min')],
    Intermedio: [ex('Uscita a ritmo blando', 'Easy-pace ride', '70 min', '70 min')],
    Avanzato: [ex('Uscita a ritmo blando costante', 'Steady easy-pace ride', '100 min', '100 min')],
    Agonista: [
      ex('Uscita a ritmo blando', 'Easy-pace ride', '150 min', '150 min'),
      ex('Tratti a ritmo gara', 'Race-pace segments', '3x15 min', '3x15 min'),
    ],
  }
);

const CICLISMO_SPRINT = moduloCondiviso(
  'sprint-potenza',
  bi('Sprint e Potenza', 'Sprint and Power'),
  {
    Base: bi('Primi sprint da fermo', 'First standing-start sprints'),
    Intermedio: bi('Sprint lanciati per la potenza', 'Flying sprints for power'),
    Avanzato: bi('Sprint massimali e salite esplosive', 'Maximal sprints and explosive hills'),
    Agonista: bi('Potenza massimale ripetuta da gara', 'Repeated race-level maximal power'),
  },
  CICLISMO_WC,
  {
    Base: [ex('Sprint da fermo', 'Standing-start sprint', '4x15s, rec. 3 min', '4x15s, 3 min rest')],
    Intermedio: [ex('Sprint lanciati', 'Flying sprints', '6x20s, rec. 3 min', '6x20s, 3 min rest')],
    Avanzato: [
      ex('Sprint massimali', 'Maximal sprints', '8x20s, rec. 4 min', '8x20s, 4 min rest'),
      ex('Salita esplosiva', 'Explosive hill sprint', '4x100m', '4x100m'),
    ],
    Agonista: [
      ex('Sprint massimali ripetuti', 'Repeated maximal sprints', '10x20s, rec. 4 min', '10x20s, 4 min rest'),
      ex('Salita esplosiva con rapporto pesante', 'Explosive hill with heavy gear', '5x150m', '5x150m'),
    ],
  }
);

const CICLISMO_RINFORZO = moduloCondiviso(
  'rinforzo-gambe-core',
  bi('Rinforzo Gambe e Core', 'Leg and Core Strengthening'),
  {
    Base: bi('Forza generale a corpo libero', 'General bodyweight strength'),
    Intermedio: bi('Forza con sovraccarichi moderati', 'Moderate-load strength'),
    Avanzato: bi('Forza con bilanciere per la potenza in sella', 'Barbell strength for in-saddle power'),
    Agonista: bi('Forza massimale per il gesto del pedale', 'Maximal strength for the pedal stroke'),
  },
  { Base: CICLISMO_WC.Base, Intermedio: CICLISMO_WC.Intermedio, Avanzato: CICLISMO_WC.Avanzato, Agonista: CICLISMO_WC.Agonista },
  {
    Base: [ex('Squat a corpo libero', 'Bodyweight squat', '3x12', '3x12'), ex('Plank', 'Plank', '3x25s', '3x25s')],
    Intermedio: [
      ex('Squat con manubri', 'Dumbbell squat', '4x10', '4x10'),
      ex('Affondi con manubri', 'Dumbbell lunges', '3x12 per lato', '3x12 per side'),
    ],
    Avanzato: [
      ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'),
      ex('Stacco rumeno', 'Romanian deadlift', '3x8', '3x8'),
    ],
    Agonista: [
      ex('Squat pesante', 'Heavy squat', '5x5', '5x5'),
      ex('Stacco rumeno pesante', 'Heavy Romanian deadlift', '4x6', '4x6'),
    ],
  }
);

const CICLISMO_MOBILITA = moduloCondiviso(
  'mobilita-ciclista',
  bi('Mobilità Articolare (Anca/Schiena)', 'Joint Mobility (Hip/Back)'),
  {
    Base: bi('Mobilità di base per compensare la posizione in sella', 'Basic mobility to offset the riding position'),
    Intermedio: bi('Mobilità dinamica anca e colonna', 'Dynamic hip and spine mobility'),
    Avanzato: bi('Mobilità profonda per l\'assetto aerodinamico', 'Deep mobility for an aerodynamic position'),
    Agonista: bi('Protocollo completo di mobilità pre/post gara', 'Full pre/post-race mobility protocol'),
  },
  CICLISMO_WC,
  {
    Base: [ex('Mobilità anca', 'Hip mobility', '2x10 per lato', '2x10 per side'), ex('Stretching lombare', 'Lower back stretching', '2x30s', '2x30s')],
    Intermedio: [
      ex('Mobilità anca dinamica', 'Dynamic hip mobility', '3x10 per lato', '3x10 per side'),
      ex('Cat-cow mobilità lombare', 'Cat-cow lumbar mobility', '3 min', '3 min'),
    ],
    Avanzato: [
      ex('Mobilità anca profonda', 'Deep hip mobility', '3x12 per lato', '3x12 per side'),
      ex('Stretching PNF lombare', 'PNF lower back stretching', '3x30s', '3x30s'),
    ],
    Agonista: [
      ex('Mobilità anca avanzata', 'Advanced hip mobility', '4x12 per lato', '4x12 per side'),
      ex('Stretching PNF completo schiena', 'Full PNF back stretching', '4x30s', '4x30s'),
    ],
  }
);

const CICLISMO_CORE_UPPER = moduloCondiviso(
  'core-upper-ciclista',
  bi('Core & Upper Body per Ciclisti', 'Core & Upper Body for Cyclists'),
  {
    Base: bi('Stabilità di base per reggere la posizione in sella', 'Basic stability to hold the riding position'),
    Intermedio: bi('Resistenza del core per le uscite lunghe', 'Core endurance for long rides'),
    Avanzato: bi('Stabilità dinamica sotto sforzo', 'Dynamic stability under effort'),
    Agonista: bi('Trasferimento di forza dal busto alle braccia in fuga', 'Force transfer from trunk to arms during an attack'),
  },
  CICLISMO_WC,
  {
    Base: [ex('Plank', 'Plank', '3x25s', '3x25s'), ex('Piegamenti sulle ginocchia', 'Knee push-ups', '2x10', '2x10')],
    Intermedio: [
      ex('Plank con tocco spalla', 'Plank with shoulder taps', '3x30s', '3x30s'),
      ex('Piegamenti sulle braccia', 'Push-ups', '3x12', '3x12'),
    ],
    Avanzato: [
      ex('Plank dinamico', 'Dynamic plank', '4x30s', '4x30s'),
      ex('Trazioni assistite', 'Assisted pull-ups', '3x8', '3x8'),
    ],
    Agonista: [
      ex('Plank con trascinamento pesi', 'Plank with weight drag', '4x30s', '4x30s'),
      ex('Trazioni complete', 'Full pull-ups', '4x8', '4x8'),
    ],
  }
);

export const CICLISMO_LIBRARY: SportWorkoutLibrary = {
  sportId: 'ciclismo',
  isSportDiSquadra: false,
  focusLabel: bi('Scheda Specifica', 'Specific Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([CICLISMO_SALITE, CICLISMO_FONDO, CICLISMO_SPRINT]),
  supporto: modulesByLevel([CICLISMO_RINFORZO, CICLISMO_MOBILITA, CICLISMO_CORE_UPPER]),
};

// ===========================================================================
// NUOTO — sport individuale
// ===========================================================================

const NUOTO_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Riscaldamento misti', 'Warm-up medley', '300m', '300m')],
    defaticamento: [ex('Defaticamento a nuoto lento', 'Slow cool-down swim', '150m', '150m')],
  },
  Intermedio: {
    riscaldamento: [ex('Riscaldamento misti', 'Warm-up medley', '400m', '400m')],
    defaticamento: [ex('Defaticamento a nuoto lento', 'Slow cool-down swim', '200m', '200m')],
  },
  Avanzato: {
    riscaldamento: [
      ex('Riscaldamento misti', 'Warm-up medley', '500m', '500m'),
      ex('Tecnica bracciata con tavoletta', 'Kickboard stroke technique', '4x50m', '4x50m'),
    ],
    defaticamento: [ex('Defaticamento a nuoto lento', 'Slow cool-down swim', '250m', '250m')],
  },
  Agonista: {
    riscaldamento: [
      ex('Riscaldamento misti', 'Warm-up medley', '600m', '600m'),
      ex('Tecnica bracciata con tavoletta', 'Kickboard stroke technique', '4x50m', '4x50m'),
    ],
    defaticamento: [ex('Defaticamento a nuoto lento', 'Slow cool-down swim', '300m', '300m')],
  },
};

const NUOTO_VELOCITA = moduloCondiviso(
  'serie-velocita',
  bi('Serie di Velocità/Sprint', 'Speed / Sprint Sets'),
  {
    Base: bi('Prime serie brevi a ritmo sostenuto', 'First short sets at a strong pace'),
    Intermedio: bi('Serie di velocità a ritmo gara', 'Speed sets at race pace'),
    Avanzato: bi('Sprint ripetuti ad alta intensità', 'High-intensity repeated sprints'),
    Agonista: bi('Massima velocità con recupero incompleto', 'Maximum speed with incomplete recovery'),
  },
  NUOTO_WC,
  {
    Base: [ex('Sprint vasca corta', 'Short-course sprint', '6x25m, rec. 30s', '6x25m, 30s rest')],
    Intermedio: [ex('Serie stile libero a ritmo gara', 'Freestyle set at race pace', '8x50m, rec. 30s', '8x50m, 30s rest')],
    Avanzato: [ex('Serie di sprint', 'Sprint set', '10x50m, rec. 20s', '10x50m, 20s rest')],
    Agonista: [ex('Sprint massimali', 'Maximal sprints', '12x50m, rec. 15s', '12x50m, 15s rest')],
  }
);

const NUOTO_FONDO = moduloCondiviso(
  'fondo-nuoto',
  bi('Fondo/Resistenza Aerobica', 'Distance / Aerobic Endurance'),
  {
    Base: bi('Base aerobica a ritmo confortevole', 'Aerobic base at a comfortable pace'),
    Intermedio: bi('Serie media per consolidare la resistenza', 'Medium set to build endurance'),
    Avanzato: bi('Fondo lungo a ritmo costante', 'Long steady-pace swim'),
    Agonista: bi('Fondo con tratti a ritmo gara', 'Distance swim with race-pace segments'),
  },
  NUOTO_WC,
  {
    Base: [ex('Nuoto continuo a ritmo blando', 'Continuous easy-pace swim', '600m', '600m')],
    Intermedio: [ex('Nuoto continuo a ritmo blando', 'Continuous easy-pace swim', '1000m', '1000m')],
    Avanzato: [ex('Nuoto continuo a ritmo costante', 'Continuous steady-pace swim', '1500m', '1500m')],
    Agonista: [
      ex('Nuoto continuo a ritmo blando', 'Continuous easy-pace swim', '1500m', '1500m'),
      ex('Tratti a ritmo gara', 'Race-pace segments', '4x100m', '4x100m'),
    ],
  }
);

const NUOTO_TECNICA = moduloCondiviso(
  'tecnica-bracciata',
  bi('Tecnica e Bracciata', 'Technique and Stroke'),
  {
    Base: bi('Correzione dei fondamentali di bracciata', 'Fine-tuning basic stroke fundamentals'),
    Intermedio: bi('Rifinitura della tecnica con esercizi mirati', 'Refining technique with targeted drills'),
    Avanzato: bi('Efficienza della bracciata ad alta velocità', 'Stroke efficiency at high speed'),
    Agonista: bi('Ottimizzazione tecnica per la performance di gara', 'Technical optimization for race performance'),
  },
  NUOTO_WC,
  {
    Base: [ex('Tecnica bracciata con tavoletta', 'Kickboard stroke technique', '6x50m', '6x50m')],
    Intermedio: [
      ex('Drill di bracciata (catch-up)', 'Catch-up drill', '6x50m', '6x50m'),
      ex('Nuoto a tratti alternati stile/drill', 'Swim-drill alternating set', '4x100m', '4x100m'),
    ],
    Avanzato: [
      ex('Drill di bracciata avanzati', 'Advanced stroke drills', '8x50m', '8x50m'),
      ex('Nuoto con paddle', 'Swim with paddles', '4x100m', '4x100m'),
    ],
    Agonista: [
      ex('Drill di bracciata a ritmo gara', 'Race-pace stroke drills', '8x50m', '8x50m'),
      ex('Nuoto con paddle e pull buoy', 'Swim with paddles and pull buoy', '6x100m', '6x100m'),
    ],
  }
);

const NUOTO_RINFORZO = moduloCondiviso(
  'rinforzo-spalle-schiena',
  bi('Rinforzo Spalle e Schiena (a secco)', 'Shoulder and Back Strengthening (dryland)'),
  {
    Base: bi('Attivazione base dei muscoli della bracciata', 'Basic activation of stroke muscles'),
    Intermedio: bi('Rinforzo con elastici per la propulsione', 'Band strengthening for propulsion'),
    Avanzato: bi('Forza specifica per la fase di trazione', 'Specific strength for the pull phase'),
    Agonista: bi('Potenza muscolare massimale a secco', 'Maximal dryland muscular power'),
  },
  { Base: { riscaldamento: [ex('Mobilità spalle', 'Shoulder mobility', '5 min', '5 min')], defaticamento: [ex('Stretching spalle', 'Shoulder stretching', '2x30s', '2x30s')] },
    Intermedio: { riscaldamento: [ex('Mobilità spalle dinamica', 'Dynamic shoulder mobility', '6 min', '6 min')], defaticamento: [ex('Stretching spalle', 'Shoulder stretching', '3x30s', '3x30s')] },
    Avanzato: { riscaldamento: [ex('Mobilità spalle completa', 'Full shoulder mobility', '8 min', '8 min')], defaticamento: [ex('Stretching PNF spalle', 'PNF shoulder stretching', '3x30s', '3x30s')] },
    Agonista: { riscaldamento: [ex('Attivazione neuromuscolare spalle', 'Shoulder neuromuscular activation', '10 min', '10 min')], defaticamento: [ex('Stretching PNF completo spalle', 'Full PNF shoulder stretching', '4x30s', '4x30s')] } },
  {
    Base: [ex('Elastici per spalle', 'Shoulder resistance bands', '3x15', '3x15')],
    Intermedio: [ex('Elastici per spalle', 'Shoulder resistance bands', '3x15', '3x15'), ex('Rematore con manubri', 'Dumbbell row', '3x12', '3x12')],
    Avanzato: [ex('Trazioni presa larga', 'Wide-grip pull-ups', '4x8', '4x8'), ex('Rematore con bilanciere', 'Barbell row', '4x10', '4x10')],
    Agonista: [ex('Trazioni zavorrate', 'Weighted pull-ups', '4x8', '4x8'), ex('Panca con manubri per la trazione', 'Dumbbell press for pull power', '4x8', '4x8')],
  }
);

const NUOTO_MOBILITA = moduloCondiviso(
  'mobilita-nuotatore',
  bi('Mobilità Spalle e Caviglie', 'Shoulder and Ankle Mobility'),
  {
    Base: bi('Mobilità di base per l\'ampiezza della bracciata', 'Basic mobility for stroke range of motion'),
    Intermedio: bi('Mobilità dinamica spalle e caviglie', 'Dynamic shoulder and ankle mobility'),
    Avanzato: bi('Mobilità profonda per la posizione idrodinamica', 'Deep mobility for a hydrodynamic position'),
    Agonista: bi('Protocollo completo di mobilità pre-gara', 'Full pre-race mobility protocol'),
  },
  { Base: { riscaldamento: [ex('Respirazione e attivazione', 'Breathing and activation', '3 min', '3 min')], defaticamento: [ex('Stretching caviglie', 'Ankle stretching', '2x30s', '2x30s')] },
    Intermedio: { riscaldamento: [ex('Mobilità dinamica leggera', 'Light dynamic mobility', '5 min', '5 min')], defaticamento: [ex('Stretching caviglie e spalle', 'Ankle and shoulder stretching', '3x30s', '3x30s')] },
    Avanzato: { riscaldamento: [ex('Mobilità dinamica completa', 'Full dynamic mobility', '6 min', '6 min')], defaticamento: [ex('Stretching PNF caviglie', 'PNF ankle stretching', '3x30s', '3x30s')] },
    Agonista: { riscaldamento: [ex('Mobilità dinamica avanzata', 'Advanced dynamic mobility', '8 min', '8 min')], defaticamento: [ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')] } },
  {
    Base: [ex('Mobilità spalle in appoggio', 'Supported shoulder mobility', '2x10 per lato', '2x10 per side')],
    Intermedio: [ex('Mobilità spalle con bastone', 'Stick shoulder mobility', '2x10', '2x10'), ex('Mobilità caviglia', 'Ankle mobility', '2x10 per lato', '2x10 per side')],
    Avanzato: [ex('Mobilità spalle con bastone', 'Stick shoulder mobility', '3x10', '3x10'), ex('Mobilità caviglia dinamica', 'Dynamic ankle mobility', '3x10 per lato', '3x10 per side')],
    Agonista: [ex('Mobilità spalle avanzata', 'Advanced shoulder mobility', '4x10', '4x10'), ex('Mobilità caviglia avanzata', 'Advanced ankle mobility', '4x10 per lato', '4x10 per side')],
  }
);

const NUOTO_CORE = moduloCondiviso(
  'core-nuotatore',
  bi('Core Stability per Nuotatori', 'Core Stability for Swimmers'),
  {
    Base: bi('Attivazione del core per il galleggiamento', 'Core activation for body position'),
    Intermedio: bi('Stabilità del core per l\'assetto in acqua', 'Core stability for in-water alignment'),
    Avanzato: bi('Core dinamico per la propulsione', 'Dynamic core for propulsion'),
    Agonista: bi('Trasferimento di forza dal core alla bracciata', 'Force transfer from core to stroke'),
  },
  { Base: { riscaldamento: [ex('Attivazione core leggera', 'Light core activation', '2x10 respiri', '2x10 breaths')], defaticamento: [ex('Stretching lombare', 'Lower back stretching', '2x30s', '2x30s')] },
    Intermedio: { riscaldamento: [ex('Attivazione core', 'Core activation', '2x12', '2x12')], defaticamento: [ex('Stretching lombare', 'Lower back stretching', '3x30s', '3x30s')] },
    Avanzato: { riscaldamento: [ex('Attivazione core dinamica', 'Dynamic core activation', '2x12', '2x12')], defaticamento: [ex('Stretching PNF lombare', 'PNF lower back stretching', '3x30s', '3x30s')] },
    Agonista: { riscaldamento: [ex('Attivazione core esplosiva', 'Explosive core activation', '2x10', '2x10')], defaticamento: [ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')] } },
  {
    Base: [ex('Plank', 'Plank', '3x25s', '3x25s'), ex('Russian twist', 'Russian twist', '3x16', '3x16')],
    Intermedio: [ex('Plank laterale', 'Side plank', '3x30s per lato', '3x30s per side'), ex('Russian twist con peso', 'Weighted Russian twist', '3x18', '3x18')],
    Avanzato: [ex('Hollow body hold', 'Hollow body hold', '3x30s', '3x30s'), ex('Plank con spinta', 'Plank with push', '4x30s', '4x30s')],
    Agonista: [ex('Hollow body con oscillazione gambe', 'Hollow body with leg flutter', '4x30s', '4x30s'), ex('Plank dinamico', 'Dynamic plank', '4x30s', '4x30s')],
  }
);

export const NUOTO_LIBRARY: SportWorkoutLibrary = {
  sportId: 'nuoto',
  isSportDiSquadra: false,
  focusLabel: bi('Scheda Specifica', 'Specific Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([NUOTO_VELOCITA, NUOTO_FONDO, NUOTO_TECNICA]),
  supporto: modulesByLevel([NUOTO_RINFORZO, NUOTO_MOBILITA, NUOTO_CORE]),
};

// ===========================================================================
// TENNIS — sport individuale
// ===========================================================================

const TENNIS_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Riscaldamento palleggi', 'Warm-up rallies', '10 min', '10 min')],
    defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'), ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s')],
  },
  Intermedio: {
    riscaldamento: [ex('Riscaldamento palleggi', 'Warm-up rallies', '10 min', '10 min'), ex('Footwork leggero', 'Light footwork', '5 min', '5 min')],
    defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'), ex('Stretching spalle e polsi', 'Shoulder and wrist stretching', '3x30s', '3x30s')],
  },
  Avanzato: {
    riscaldamento: [ex('Riscaldamento palleggi con variazioni', 'Warm-up rallies with variations', '12 min', '12 min'), ex('Footwork a scaletta', 'Ladder footwork', '6 min', '6 min')],
    defaticamento: [ex('Jog leggero', 'Light jog', '5 min', '5 min'), ex('Stretching PNF spalle', 'PNF shoulder stretching', '3x30s', '3x30s')],
  },
  Agonista: {
    riscaldamento: [ex('Riscaldamento completo con punti simulati', 'Full warm-up with simulated points', '15 min', '15 min'), ex('Footwork a scaletta avanzato', 'Advanced ladder footwork', '8 min', '8 min')],
    defaticamento: [ex('Jog leggero', 'Light jog', '6 min', '6 min'), ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')],
  },
};

const TENNIS_FOOTWORK = moduloCondiviso(
  'footwork-reattivita',
  bi('Footwork e Reattività', 'Footwork and Reactivity'),
  {
    Base: bi('Spostamenti di base sul campo', 'Basic on-court movement'),
    Intermedio: bi('Reattività con cambi di direzione', 'Reactivity with direction changes'),
    Avanzato: bi('Footwork ad alta intensità su stimolo', 'High-intensity cue-based footwork'),
    Agonista: bi('Reattività da match ad alta velocità', 'High-speed match-level reactivity'),
  },
  TENNIS_WC,
  {
    Base: [ex('Spostamenti laterali a rimbalzo', 'Lateral split-step movements', '4x30s', '4x30s')],
    Intermedio: [ex('Scatti laterali con recupero al centro', 'Lateral sprints with recovery to center', '5x30s', '5x30s')],
    Avanzato: [ex('Footwork a scaletta con uscita sprint', 'Ladder footwork with sprint exit', '6x20s', '6x20s')],
    Agonista: [ex('Circuito reattivo su segnale', 'Reactive circuit on cue', '8x20s', '8x20s')],
  }
);

const TENNIS_POTENZA = moduloCondiviso(
  'potenza-colpi',
  bi('Potenza nei Colpi', 'Shot Power'),
  {
    Base: bi('Consolidamento tecnico di dritto e rovescio', 'Building forehand and backhand technique'),
    Intermedio: bi('Potenza nei colpi da fondo campo', 'Power in baseline shots'),
    Avanzato: bi('Potenza su servizio e colpi offensivi', 'Power on serve and offensive shots'),
    Agonista: bi('Massima potenza sotto pressione di gara', 'Maximum power under match pressure'),
  },
  TENNIS_WC,
  {
    Base: [ex('Dritto e rovescio cross court', 'Cross-court forehand and backhand', '15 min', '15 min')],
    Intermedio: [ex('Colpi da fondo campo a piena potenza', 'Full-power baseline shots', '20 min', '20 min')],
    Avanzato: [ex('Servizio e risposta a piena potenza', 'Full-power serve and return', '20 min', '20 min')],
    Agonista: [ex('Punti simulati ad alta intensità', 'High-intensity simulated points', '25 min', '25 min')],
  }
);

const TENNIS_RESISTENZA = moduloCondiviso(
  'resistenza-match',
  bi('Resistenza da Match', 'Match Endurance'),
  {
    Base: bi('Base aerobica per reggere lo scambio', 'Aerobic base to hold up in rallies'),
    Intermedio: bi('Resistenza intermittente tipo scambio lungo', 'Interval endurance mimicking long rallies'),
    Avanzato: bi('Simulazione del carico di un set', 'Simulating the load of a set'),
    Agonista: bi('Simulazione del carico metabolico di un match', 'Simulating the metabolic load of a match'),
  },
  TENNIS_WC,
  {
    Base: [ex('Corsa a ritmo costante', 'Steady-pace run', '15 min', '15 min')],
    Intermedio: [ex('Intermittente 20-10', '20-10 intermittent', '8 blocchi', '8 blocks')],
    Avanzato: [ex('Intermittente 20-10 ad alta intensità', 'High-intensity 20-10 intermittent', '10 blocchi', '10 blocks')],
    Agonista: [ex('Intermittente su 2 set simulati', 'Intermittent over 2 simulated sets', '2x10 blocchi', '2x10 blocks')],
  }
);

const TENNIS_PREVENZIONE = moduloCondiviso(
  'prevenzione-spalla-gomito',
  bi('Prevenzione Infortuni (Spalla/Gomito)', 'Injury Prevention (Shoulder/Elbow)'),
  {
    Base: bi('Stabilità di base per spalla e gomito', 'Basic stability for shoulder and elbow'),
    Intermedio: bi('Rinforzo della cuffia dei rotatori', 'Rotator cuff strengthening'),
    Avanzato: bi('Stabilità dinamica sotto carico di gioco', 'Dynamic stability under playing load'),
    Agonista: bi('Protocollo completo pre-match per spalla e gomito', 'Full pre-match protocol for shoulder and elbow'),
  },
  { Base: { riscaldamento: [ex('Mobilità spalla', 'Shoulder mobility', '4 min', '4 min')], defaticamento: [ex('Stretching avambraccio', 'Forearm stretching', '2x30s', '2x30s')] },
    Intermedio: { riscaldamento: [ex('Mobilità spalla dinamica', 'Dynamic shoulder mobility', '5 min', '5 min')], defaticamento: [ex('Stretching avambraccio e spalla', 'Forearm and shoulder stretching', '3x30s', '3x30s')] },
    Avanzato: { riscaldamento: [ex('Mobilità spalla completa', 'Full shoulder mobility', '6 min', '6 min')], defaticamento: [ex('Stretching PNF spalla', 'PNF shoulder stretching', '3x30s', '3x30s')] },
    Agonista: { riscaldamento: [ex('Attivazione neuromuscolare spalla', 'Shoulder neuromuscular activation', '8 min', '8 min')], defaticamento: [ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')] } },
  {
    Base: [ex('Elastici cuffia dei rotatori', 'Rotator cuff band exercises', '2x15', '2x15')],
    Intermedio: [ex('Elastici cuffia dei rotatori', 'Rotator cuff band exercises', '3x15', '3x15'), ex('Polso con manubrio leggero', 'Light dumbbell wrist curl', '3x15', '3x15')],
    Avanzato: [ex('Elastici cuffia con movimento dinamico', 'Dynamic rotator cuff band work', '3x15', '3x15'), ex('Eccentrico avambraccio', 'Eccentric forearm work', '3x12', '3x12')],
    Agonista: [ex('Cuffia dei rotatori sotto carico', 'Loaded rotator cuff work', '4x15', '4x15'), ex('Eccentrico avambraccio avanzato', 'Advanced eccentric forearm work', '4x12', '4x12')],
  }
);

const TENNIS_CORE_ROT = moduloCondiviso(
  'core-rotazionale',
  bi('Core Rotazionale', 'Rotational Core'),
  {
    Base: bi('Attivazione base della rotazione del busto', 'Basic activation of trunk rotation'),
    Intermedio: bi('Potenza rotazionale per il colpo', 'Rotational power for the stroke'),
    Avanzato: bi('Core dinamico ad alta velocità di rotazione', 'Dynamic core at high rotation speed'),
    Agonista: bi('Trasferimento massimale di forza rotazionale', 'Maximal rotational force transfer'),
  },
  TENNIS_WC,
  {
    Base: [ex('Russian twist', 'Russian twist', '3x16', '3x16')],
    Intermedio: [ex('Rotazione con palla medica', 'Medicine ball rotational throw', '3x10 per lato', '3x10 per side')],
    Avanzato: [ex('Rotazione esplosiva con palla medica', 'Explosive medicine ball rotation', '4x10 per lato', '4x10 per side')],
    Agonista: [ex('Rotazione esplosiva a piena velocità', 'Full-speed explosive rotation', '5x10 per lato', '5x10 per side')],
  }
);

const TENNIS_FORZA_GENERALE = moduloCondiviso(
  'forza-generale-tennis',
  bi('Forza Generale/Esplosività', 'General Strength / Explosiveness'),
  {
    Base: bi('Forza generale a corpo libero', 'General bodyweight strength'),
    Intermedio: bi('Forza con sovraccarichi moderati', 'Moderate-load strength'),
    Avanzato: bi('Forza esplosiva per il primo passo', 'Explosive strength for the first step'),
    Agonista: bi('Potenza massimale trasferita al campo', 'Maximal power transferred to the court'),
  },
  TENNIS_WC,
  {
    Base: [ex('Squat a corpo libero', 'Bodyweight squat', '3x15', '3x15'), ex('Piegamenti sulle braccia', 'Push-ups', '3x10', '3x10')],
    Intermedio: [ex('Squat con manubri', 'Dumbbell squat', '4x10', '4x10'), ex('Squat jump', 'Squat jump', '3x10', '3x10')],
    Avanzato: [ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'), ex('Balzi in cadenza', 'Rhythmic bounds', '4x10', '4x10')],
    Agonista: [ex('Squat pesante', 'Heavy squat', '5x5', '5x5'), ex('Balzi pliometrici', 'Plyometric bounds', '4x10', '4x10')],
  }
);

export const TENNIS_LIBRARY: SportWorkoutLibrary = {
  sportId: 'tennis',
  isSportDiSquadra: false,
  focusLabel: bi('Scheda Specifica', 'Specific Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([TENNIS_FOOTWORK, TENNIS_POTENZA, TENNIS_RESISTENZA]),
  supporto: modulesByLevel([TENNIS_PREVENZIONE, TENNIS_CORE_ROT, TENNIS_FORZA_GENERALE]),
};

// ===========================================================================
// PALESTRA — sport individuale (allenamento in sala pesi)
// ===========================================================================

const PALESTRA_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Mobilità articolare generale', 'General joint mobility', '5 min', '5 min')],
    defaticamento: [ex('Stretching generale', 'General stretching', '2x30s', '2x30s')],
  },
  Intermedio: {
    riscaldamento: [ex('Mobilità articolare dinamica', 'Dynamic joint mobility', '6 min', '6 min'), ex('Serie di avvicinamento leggere', 'Light warm-up sets', '2x10', '2x10')],
    defaticamento: [ex('Stretching generale', 'General stretching', '3x30s', '3x30s')],
  },
  Avanzato: {
    riscaldamento: [ex('Mobilità articolare completa', 'Full joint mobility', '8 min', '8 min'), ex('Serie di avvicinamento progressive', 'Progressive warm-up sets', '3x8', '3x8')],
    defaticamento: [ex('Stretching PNF generale', 'General PNF stretching', '3x30s', '3x30s'), ex('Foam roller', 'Foam rolling', '4 min', '4 min')],
  },
  Agonista: {
    riscaldamento: [ex('Mobilità articolare e attivazione neurale', 'Joint mobility and neural activation', '10 min', '10 min'), ex('Serie di avvicinamento pesanti', 'Heavy warm-up sets', '4x5', '4x5')],
    defaticamento: [ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s'), ex('Foam roller completo', 'Full foam rolling', '5 min', '5 min')],
  },
};

const PALESTRA_FORZA_MAX = moduloCondiviso(
  'forza-massimale',
  bi('Forza Massimale', 'Maximal Strength'),
  {
    Base: bi('Introduzione ai fondamentali con carichi leggeri', 'Introduction to the fundamentals with light loads'),
    Intermedio: bi('Forza sui fondamentali con carichi moderati', 'Fundamental lift strength with moderate loads'),
    Avanzato: bi('Forza pesante sui grandi fondamentali', 'Heavy strength on the big compound lifts'),
    Agonista: bi('Forza massimale con carichi vicini al massimale', 'Maximal strength near-1RM loads'),
  },
  PALESTRA_WC,
  {
    Base: [ex('Squat', 'Squat', '3x10', '3x10'), ex('Panca piana', 'Bench press', '3x10', '3x10')],
    Intermedio: [ex('Squat', 'Squat', '4x8', '4x8'), ex('Panca piana', 'Bench press', '4x8', '4x8'), ex('Stacco da terra', 'Deadlift', '3x6', '3x6')],
    Avanzato: [ex('Squat', 'Squat', '5x5', '5x5'), ex('Panca piana', 'Bench press', '5x5', '5x5'), ex('Stacco da terra', 'Deadlift', '4x5', '4x5')],
    Agonista: [ex('Squat', 'Squat', '5x3', '5x3'), ex('Panca piana', 'Bench press', '5x3', '5x3'), ex('Stacco da terra', 'Deadlift', '5x3', '5x3')],
  }
);

const PALESTRA_IPERTROFIA = moduloCondiviso(
  'ipertrofia',
  bi('Ipertrofia', 'Hypertrophy'),
  {
    Base: bi('Volume moderato per l\'adattamento muscolare', 'Moderate volume for muscular adaptation'),
    Intermedio: bi('Volume crescente su multi e mono articolari', 'Growing volume on compound and isolation lifts'),
    Avanzato: bi('Alto volume con tecniche di intensità', 'High volume with intensity techniques'),
    Agonista: bi('Volume massimo con periodizzazione avanzata', 'Maximum volume with advanced periodization'),
  },
  PALESTRA_WC,
  {
    Base: [ex('Squat', 'Squat', '3x12', '3x12'), ex('Lat machine', 'Lat pulldown', '3x12', '3x12'), ex('Curl bicipiti', 'Bicep curl', '3x12', '3x12')],
    Intermedio: [ex('Affondi con manubri', 'Dumbbell lunges', '3x12 per lato', '3x12 per side'), ex('Trazioni', 'Pull-ups', '4x10', '4x10'), ex('Military press', 'Military press', '3x10', '3x10')],
    Avanzato: [ex('Leg press', 'Leg press', '4x10', '4x10'), ex('Rematore con bilanciere', 'Barbell row', '4x10', '4x10'), ex('Serie con drop-set finale', 'Set with final drop-set', '3x10+drop', '3x10+drop')],
    Agonista: [ex('Squat con pausa', 'Pause squat', '5x8', '5x8'), ex('Trazioni zavorrate', 'Weighted pull-ups', '5x8', '5x8'), ex('Superserie petto/schiena', 'Chest/back superset', '4x10+10', '4x10+10')],
  }
);

const PALESTRA_RESISTENZA_MUSC = moduloCondiviso(
  'resistenza-muscolare',
  bi('Resistenza Muscolare/Circuito', 'Muscular Endurance / Circuit'),
  {
    Base: bi('Primo circuito a corpo libero', 'First bodyweight circuit'),
    Intermedio: bi('Circuito con sovraccarichi leggeri', 'Circuit with light loads'),
    Avanzato: bi('Circuito metabolico ad alta densità', 'High-density metabolic circuit'),
    Agonista: bi('Circuito competitivo a tempo', 'Timed competitive circuit'),
  },
  PALESTRA_WC,
  {
    Base: [ex('Circuito: squat, piegamenti, plank', 'Circuit: squat, push-ups, plank', '3 giri', '3 rounds')],
    Intermedio: [ex('Circuito con kettlebell', 'Kettlebell circuit', '4 giri', '4 rounds')],
    Avanzato: [ex('Circuito metabolico misto', 'Mixed metabolic circuit', '5 giri', '5 rounds')],
    Agonista: [ex('Circuito a tempo (AMRAP)', 'Timed circuit (AMRAP)', '15 min', '15 min')],
  }
);

const PALESTRA_MOBILITA_GEN = moduloCondiviso(
  'mobilita-generale',
  bi('Mobilità Generale', 'General Mobility'),
  {
    Base: bi('Mobilità di base per le principali articolazioni', 'Basic mobility for the main joints'),
    Intermedio: bi('Mobilità dinamica pre-allenamento', 'Dynamic pre-workout mobility'),
    Avanzato: bi('Mobilità attiva completa', 'Full active mobility'),
    Agonista: bi('Protocollo completo di mobilità e attivazione', 'Full mobility and activation protocol'),
  },
  { Base: { riscaldamento: [ex('Respirazione e attivazione', 'Breathing and activation', '3 min', '3 min')], defaticamento: [ex('Stretching generale', 'General stretching', '2x30s', '2x30s')] },
    Intermedio: { riscaldamento: [ex('Mobilità dinamica leggera', 'Light dynamic mobility', '5 min', '5 min')], defaticamento: [ex('Stretching generale', 'General stretching', '3x30s', '3x30s')] },
    Avanzato: { riscaldamento: [ex('Mobilità dinamica completa', 'Full dynamic mobility', '6 min', '6 min')], defaticamento: [ex('Stretching PNF generale', 'General PNF stretching', '3x30s', '3x30s')] },
    Agonista: { riscaldamento: [ex('Mobilità dinamica avanzata', 'Advanced dynamic mobility', '8 min', '8 min')], defaticamento: [ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')] } },
  {
    Base: [ex('Mobilità anca e spalle', 'Hip and shoulder mobility', '10 min', '10 min')],
    Intermedio: [ex('Mobilità anca, spalle e caviglie', 'Hip, shoulder and ankle mobility', '10 min', '10 min')],
    Avanzato: [ex('Mobilità articolare completa', 'Full joint mobility', '12 min', '12 min')],
    Agonista: [ex('Mobilità articolare avanzata con CARs', 'Advanced mobility with CARs', '15 min', '15 min')],
  }
);

const PALESTRA_CORE_STAB = moduloCondiviso(
  'core-stability-palestra',
  bi('Core Stability', 'Core Stability'),
  {
    Base: bi('Attivazione core in isometria', 'Isometric core activation'),
    Intermedio: bi('Stabilità anti-rotazione e anti-estensione', 'Anti-rotation and anti-extension stability'),
    Avanzato: bi('Core dinamico sotto carico', 'Dynamic core under load'),
    Agonista: bi('Core ad alta intensità per il sollevamento', 'High-intensity core for lifting'),
  },
  PALESTRA_WC,
  {
    Base: [ex('Plank', 'Plank', '3x25s', '3x25s'), ex('Dead bug', 'Dead bug', '3x10', '3x10')],
    Intermedio: [ex('Pallof press', 'Pallof press', '3x12 per lato', '3x12 per side'), ex('Plank laterale', 'Side plank', '3x25s per lato', '3x25s per side')],
    Avanzato: [ex('Plank con sovraccarico', 'Loaded plank', '4x30s', '4x30s'), ex('Hollow body hold', 'Hollow body hold', '3x30s', '3x30s')],
    Agonista: [ex('Farmer\'s walk', 'Farmer\'s walk', '4x30m', '4x30m'), ex('Hollow body con sovraccarico', 'Loaded hollow body hold', '4x30s', '4x30s')],
  }
);

const PALESTRA_CARDIO = moduloCondiviso(
  'cardio-complementare',
  bi('Cardio Complementare', 'Complementary Cardio'),
  {
    Base: bi('Cardio leggero per il recupero attivo', 'Light cardio for active recovery'),
    Intermedio: bi('Cardio moderato per la capacità aerobica', 'Moderate cardio for aerobic capacity'),
    Avanzato: bi('Cardio a intervalli per la condizione generale', 'Interval cardio for general conditioning'),
    Agonista: bi('Cardio ad alta intensità complementare alla forza', 'High-intensity cardio to complement strength work'),
  },
  { Base: { riscaldamento: [ex('Camminata di attivazione', 'Activation walk', '3 min', '3 min')], defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min')] },
    Intermedio: { riscaldamento: [ex('Camminata veloce di attivazione', 'Brisk activation walk', '4 min', '4 min')], defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min')] },
    Avanzato: { riscaldamento: [ex('Jog leggero di attivazione', 'Light activation jog', '5 min', '5 min')], defaticamento: [ex('Camminata di recupero', 'Recovery walk', '6 min', '6 min')] },
    Agonista: { riscaldamento: [ex('Jog di attivazione', 'Activation jog', '6 min', '6 min')], defaticamento: [ex('Camminata di recupero', 'Recovery walk', '8 min', '8 min')] } },
  {
    Base: [ex('Tapis roulant o cyclette moderato', 'Moderate treadmill or stationary bike', '15 min', '15 min')],
    Intermedio: [ex('Tapis roulant o cyclette moderato', 'Moderate treadmill or stationary bike', '20 min', '20 min')],
    Avanzato: [ex('Intervalli su tapis roulant/vogatore', 'Treadmill/rower intervals', '8x1 min, rec. 1 min', '8x1 min, 1 min rest')],
    Agonista: [ex('Intervalli ad alta intensità', 'High-intensity intervals', '10x1 min, rec. 1 min', '10x1 min, 1 min rest')],
  }
);

export const PALESTRA_LIBRARY: SportWorkoutLibrary = {
  sportId: 'palestra',
  isSportDiSquadra: false,
  focusLabel: bi('Scheda di Forza', 'Strength Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([PALESTRA_FORZA_MAX, PALESTRA_IPERTROFIA, PALESTRA_RESISTENZA_MUSC]),
  supporto: modulesByLevel([PALESTRA_MOBILITA_GEN, PALESTRA_CORE_STAB, PALESTRA_CARDIO]),
};

// ===========================================================================
// YOGA — sport individuale (pratica a bassa intensità)
// ===========================================================================

const YOGA_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Respirazione e centratura', 'Breathing and centering', '3 min', '3 min')],
    defaticamento: [ex('Rilassamento finale (savasana)', 'Final relaxation (savasana)', '5 min', '5 min')],
  },
  Intermedio: {
    riscaldamento: [ex('Respirazione e mobilità articolare leggera', 'Breathing and light joint mobility', '5 min', '5 min')],
    defaticamento: [ex('Rilassamento finale (savasana)', 'Final relaxation (savasana)', '7 min', '7 min')],
  },
  Avanzato: {
    riscaldamento: [ex('Saluto al sole leggero', 'Light sun salutation', '5 min', '5 min')],
    defaticamento: [ex('Rilassamento finale (savasana)', 'Final relaxation (savasana)', '8 min', '8 min')],
  },
  Agonista: {
    riscaldamento: [ex('Saluto al sole dinamico', 'Dynamic sun salutation', '8 min', '8 min')],
    defaticamento: [ex('Rilassamento finale esteso (savasana)', 'Extended final relaxation (savasana)', '10 min', '10 min')],
  },
};

const YOGA_VINYASA = moduloCondiviso(
  'vinyasa-flow',
  bi('Vinyasa Flow/Dinamico', 'Vinyasa Flow / Dynamic'),
  {
    Base: bi('Primo flow dolce di collegamento tra posizioni', 'First gentle flow linking poses'),
    Intermedio: bi('Flow dinamico con sequenze fluide', 'Dynamic flow with fluid sequences'),
    Avanzato: bi('Flow intenso con transizioni rapide', 'Intense flow with fast transitions'),
    Agonista: bi('Flow avanzato ad alta intensità fisica', 'Advanced physically intense flow'),
  },
  YOGA_WC,
  {
    Base: [ex('Sequenza dolce guerriero I-II', 'Gentle warrior I-II sequence', '10 min', '10 min')],
    Intermedio: [ex('Flow guerriero I-II-III', 'Warrior I-II-III flow', '15 min', '15 min')],
    Avanzato: [ex('Flow con posizioni di equilibrio', 'Flow with balance poses', '20 min', '20 min')],
    Agonista: [ex('Flow dinamico continuo', 'Continuous dynamic flow', '25 min', '25 min')],
  }
);

const YOGA_HATHA = moduloCondiviso(
  'hatha-base',
  bi('Hatha/Posizioni Base', 'Hatha / Basic Poses'),
  {
    Base: bi('Introduzione alle posizioni fondamentali', 'Introduction to the fundamental poses'),
    Intermedio: bi('Consolidamento delle posizioni con tempi più lunghi', 'Consolidating poses with longer holds'),
    Avanzato: bi('Posizioni tenute a lungo per la resistenza posturale', 'Long holds for postural endurance'),
    Agonista: bi('Sequenza completa con tenute prolungate', 'Full sequence with extended holds'),
  },
  YOGA_WC,
  {
    Base: [ex('Posizioni base tenute', 'Held basic poses', '5x30s', '5x30s')],
    Intermedio: [ex('Posizioni base tenute più a lungo', 'Longer held basic poses', '5x45s', '5x45s')],
    Avanzato: [ex('Posizioni intermedie tenute', 'Held intermediate poses', '6x45s', '6x45s')],
    Agonista: [ex('Posizioni avanzate tenute', 'Held advanced poses', '6x60s', '6x60s')],
  }
);

const YOGA_EQUILIBRIO = moduloCondiviso(
  'equilibrio-forza',
  bi('Equilibrio e Forza (Arm Balance)', 'Balance and Strength (Arm Balance)'),
  {
    Base: bi('Primi esercizi di equilibrio su una gamba', 'First single-leg balance exercises'),
    Intermedio: bi('Posizioni di equilibrio più complesse', 'More complex balance poses'),
    Avanzato: bi('Introduzione alle posizioni di forza sulle braccia', 'Introduction to arm balance poses'),
    Agonista: bi('Arm balance avanzate e transizioni fluide', 'Advanced arm balances and fluid transitions'),
  },
  YOGA_WC,
  {
    Base: [ex('Albero e sedia', 'Tree and chair pose', '4x30s', '4x30s')],
    Intermedio: [ex('Guerriero III e mezzaluna', 'Warrior III and half moon', '4x30s', '4x30s')],
    Avanzato: [ex('Corvo (bakasana)', 'Crow pose (bakasana)', '4x20s', '4x20s')],
    Agonista: [ex('Corvo e transizioni ad arm balance', 'Crow pose and arm balance transitions', '5x20s', '5x20s')],
  }
);

const YOGA_MOBILITA_PROF = moduloCondiviso(
  'mobilita-profonda',
  bi('Mobilità Profonda/Stretching', 'Deep Mobility / Stretching'),
  {
    Base: bi('Stretching dolce per la flessibilità generale', 'Gentle stretching for general flexibility'),
    Intermedio: bi('Stretching mirato con tenute più lunghe', 'Targeted stretching with longer holds'),
    Avanzato: bi('Mobilità profonda su anche e colonna', 'Deep mobility for hips and spine'),
    Agonista: bi('Stretching avanzato tipo yin per la massima ampiezza', 'Advanced yin-style stretching for maximum range'),
  },
  { Base: { riscaldamento: [ex('Respirazione', 'Breathing', '2 min', '2 min')], defaticamento: [ex('Rilassamento', 'Relaxation', '3 min', '3 min')] },
    Intermedio: { riscaldamento: [ex('Respirazione e mobilità leggera', 'Breathing and light mobility', '3 min', '3 min')], defaticamento: [ex('Rilassamento', 'Relaxation', '4 min', '4 min')] },
    Avanzato: { riscaldamento: [ex('Respirazione e mobilità dinamica', 'Breathing and dynamic mobility', '4 min', '4 min')], defaticamento: [ex('Rilassamento esteso', 'Extended relaxation', '5 min', '5 min')] },
    Agonista: { riscaldamento: [ex('Respirazione e mobilità completa', 'Breathing and full mobility', '5 min', '5 min')], defaticamento: [ex('Rilassamento esteso', 'Extended relaxation', '6 min', '6 min')] } },
  {
    Base: [ex('Stretching gambe e schiena', 'Leg and back stretching', '4x30s', '4x30s')],
    Intermedio: [ex('Stretching anche e ischiocrurali', 'Hip and hamstring stretching', '5x45s', '5x45s')],
    Avanzato: [ex('Stretching profondo anche e colonna', 'Deep hip and spine stretching', '5x60s', '5x60s')],
    Agonista: [ex('Stretching yin prolungato', 'Extended yin stretching', '6x90s', '6x90s')],
  }
);

const YOGA_RESPIRAZIONE = moduloCondiviso(
  'respirazione-rilassamento',
  bi('Respirazione e Rilassamento (Pranayama)', 'Breathing and Relaxation (Pranayama)'),
  {
    Base: bi('Introduzione alla respirazione diaframmatica', 'Introduction to diaphragmatic breathing'),
    Intermedio: bi('Tecniche di respirazione per la calma mentale', 'Breathing techniques for mental calm'),
    Avanzato: bi('Pranayama avanzato per il controllo del respiro', 'Advanced pranayama for breath control'),
    Agonista: bi('Pratica completa di pranayama e meditazione', 'Full pranayama and meditation practice'),
  },
  { Base: { riscaldamento: [ex('Posizione comoda seduta', 'Comfortable seated position', '2 min', '2 min')], defaticamento: [ex('Rilassamento', 'Relaxation', '3 min', '3 min')] },
    Intermedio: { riscaldamento: [ex('Posizione comoda e centratura', 'Comfortable position and centering', '3 min', '3 min')], defaticamento: [ex('Rilassamento', 'Relaxation', '4 min', '4 min')] },
    Avanzato: { riscaldamento: [ex('Centratura e respirazione lenta', 'Centering and slow breathing', '4 min', '4 min')], defaticamento: [ex('Rilassamento esteso', 'Extended relaxation', '5 min', '5 min')] },
    Agonista: { riscaldamento: [ex('Centratura completa', 'Full centering', '5 min', '5 min')], defaticamento: [ex('Rilassamento esteso', 'Extended relaxation', '8 min', '8 min')] } },
  {
    Base: [ex('Respirazione diaframmatica', 'Diaphragmatic breathing', '5 min', '5 min')],
    Intermedio: [ex('Respirazione a narici alternate (nadi shodhana)', 'Alternate nostril breathing (nadi shodhana)', '8 min', '8 min')],
    Avanzato: [ex('Respirazione ujjayi', 'Ujjayi breathing', '10 min', '10 min')],
    Agonista: [ex('Pranayama avanzato e meditazione guidata', 'Advanced pranayama and guided meditation', '15 min', '15 min')],
  }
);

const YOGA_CORE = moduloCondiviso(
  'core-yoga',
  bi('Core e Stabilità del Bacino', 'Core and Pelvic Stability'),
  {
    Base: bi('Attivazione base del core in posizioni statiche', 'Basic core activation in static poses'),
    Intermedio: bi('Core dinamico nelle transizioni', 'Dynamic core through transitions'),
    Avanzato: bi('Core avanzato per le posizioni di equilibrio', 'Advanced core for balance poses'),
    Agonista: bi('Core ad alta intensità per arm balance e inversioni', 'High-intensity core for arm balances and inversions'),
  },
  YOGA_WC,
  {
    Base: [ex('Plank su ginocchia', 'Knee plank', '3x20s', '3x20s')],
    Intermedio: [ex('Plank', 'Plank', '3x30s', '3x30s'), ex('Barca (navasana)', 'Boat pose (navasana)', '3x20s', '3x20s')],
    Avanzato: [ex('Plank con variazioni', 'Plank variations', '4x30s', '4x30s'), ex('Barca tenuta', 'Held boat pose', '4x25s', '4x25s')],
    Agonista: [ex('Plank dinamico avanzato', 'Advanced dynamic plank', '4x40s', '4x40s'), ex('Barca con torsione', 'Boat pose with twist', '4x30s', '4x30s')],
  }
);

export const YOGA_LIBRARY: SportWorkoutLibrary = {
  sportId: 'yoga',
  isSportDiSquadra: false,
  focusLabel: bi('Pratica Principale', 'Main Practice'),
  supportoLabel: bi('Recupero e Mobilità', 'Recovery & Mobility'),
  focus: modulesByLevel([YOGA_VINYASA, YOGA_HATHA, YOGA_EQUILIBRIO]),
  supporto: modulesByLevel([YOGA_MOBILITA_PROF, YOGA_RESPIRAZIONE, YOGA_CORE]),
};

// ===========================================================================
// BASKET — sport di squadra
// ===========================================================================

const BASKET_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Corsa leggera con palla', 'Light run with the ball', '8 min', '8 min')],
    defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'), ex('Stretching gambe', 'Leg stretching', '2x30s', '2x30s')],
  },
  Intermedio: {
    riscaldamento: [ex('Corsa di attivazione con palleggio', 'Activation run with dribbling', '10 min', '10 min')],
    defaticamento: [ex('Jog leggero', 'Light jog', '5 min', '5 min'), ex('Stretching gambe', 'Leg stretching', '3x30s', '3x30s')],
  },
  Avanzato: {
    riscaldamento: [ex('Attivazione dinamica con palla', 'Dynamic activation with the ball', '10 min', '10 min'), ex('Skip e allunghi', 'Skip and strides', '3x20m', '3x20m')],
    defaticamento: [ex('Jog di scarico', 'Cool-down jog', '6 min', '6 min'), ex('Stretching PNF gambe', 'PNF leg stretching', '3x30s', '3x30s')],
  },
  Agonista: {
    riscaldamento: [ex('Attivazione neuromuscolare completa', 'Full neuromuscular activation', '12 min', '12 min'), ex('Skip A/B con palla', 'A/B skip with the ball', '3x25m', '3x25m')],
    defaticamento: [ex('Jog e mobilità dinamica', 'Jog and dynamic mobility', '8 min', '8 min'), ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')],
  },
};

const BASKET_ESPLOSIVITA = moduloCondiviso(
  'esplosivita-salto',
  bi('Esplosività e Elevazione', 'Explosiveness and Vertical Jump'),
  {
    Base: bi('Introduzione al lavoro di salto', 'Introduction to jump training'),
    Intermedio: bi('Sviluppo della potenza di elevazione', 'Developing vertical power'),
    Avanzato: bi('Pliometria per il salto sotto canestro', 'Plyometrics for under-the-basket jumping'),
    Agonista: bi('Massima potenza esplosiva da gara', 'Maximum match-level explosive power'),
  },
  BASKET_WC,
  {
    Base: [ex('Salti verticali da fermo', 'Standing vertical jumps', '3x8', '3x8')],
    Intermedio: [ex('Salti con contromovimento', 'Countermovement jumps', '4x8', '4x8')],
    Avanzato: [ex('Salti pliometrici con rimbalzo', 'Rebound plyometric jumps', '4x10', '4x10')],
    Agonista: [ex('Salti pliometrici a contropiede su canestro', 'Reactive rebound jumps at the basket', '5x10', '5x10')],
  }
);

const BASKET_AGILITA = moduloCondiviso(
  'agilita-cod-basket',
  bi('Agilità e Cambi di Direzione', 'Agility and Change of Direction'),
  {
    Base: bi('Coordinazione di base sul campo', 'Basic on-court coordination'),
    Intermedio: bi('Cambi di direzione a velocità di gioco', 'Direction changes at match speed'),
    Avanzato: bi('Agilità reattiva su stimolo visivo', 'Reactive agility with visual cue'),
    Agonista: bi('Agilità da gara con decisione sotto pressione', 'Match-level agility with decision-making under pressure'),
  },
  BASKET_WC,
  {
    Base: [ex('Slalom tra coni con palleggio', 'Cone slalom with dribbling', '4 ripetizioni', '4 reps')],
    Intermedio: [ex('Difensivo laterale con cambio senso', 'Lateral defensive slide with reversal', '5 ripetizioni', '5 reps')],
    Avanzato: [ex('Drill a T con sprint e palleggio', 'T-drill with sprint and dribbling', '5 ripetizioni', '5 reps')],
    Agonista: [ex('1v1 in spazio ridotto', '1v1 in tight space', '6x15s', '6x15s')],
  }
);

const BASKET_RESISTENZA = moduloCondiviso(
  'resistenza-intermittente',
  bi('Resistenza Intermittente', 'Intermittent Endurance'),
  {
    Base: bi('Base aerobica per reggere la partita', 'Aerobic base to hold up through a game'),
    Intermedio: bi('Ripetute intermittenti tipo azione di gioco', 'Intermittent repeats mimicking game actions'),
    Avanzato: bi('Intermittente ad alta intensità specifico per il ruolo', 'High-intensity role-specific interval work'),
    Agonista: bi('Simulazione del carico metabolico di una partita', 'Simulating the metabolic load of a game'),
  },
  BASKET_WC,
  {
    Base: [ex('Corsa a ritmo costante', 'Steady-pace run', '15 min', '15 min')],
    Intermedio: [ex('Navetta da campo (linee)', 'Baseline suicide runs', '8 blocchi', '8 blocks')],
    Avanzato: [ex('Intermittente 15-15 ad alta intensità', 'High-intensity 15-15 intermittent', '10 blocchi', '10 blocks')],
    Agonista: [ex('Intermittente su 2 tempi simulati', 'Intermittent over 2 simulated halves', '2x10 blocchi', '2x10 blocks')],
  }
);

const BASKET_PREVENZIONE = moduloCondiviso(
  'prevenzione-caviglie-ginocchia',
  bi('Prevenzione Infortuni (Caviglie/Ginocchia)', 'Injury Prevention (Ankles/Knees)'),
  {
    Base: bi('Stabilità di base per caviglie e ginocchia', 'Basic stability for ankles and knees'),
    Intermedio: bi('Propriocezione per l\'atterraggio dal salto', 'Proprioception for jump landing'),
    Avanzato: bi('Stabilità dinamica sotto atterraggio da salto', 'Dynamic stability under jump landing'),
    Agonista: bi('Protocollo completo pre-gara', 'Full pre-match protocol'),
  },
  BASKET_WC,
  {
    Base: [ex('Equilibrio monopodalico', 'Single-leg balance', '3x20s per lato', '3x20s per side')],
    Intermedio: [ex('Equilibrio su tavoletta propriocettiva', 'Wobble board balance', '3x30s per lato', '3x30s per side')],
    Avanzato: [ex('Atterraggio da salto controllato', 'Controlled jump-landing drill', '4x6', '4x6')],
    Agonista: [ex('Atterraggio da salto con cambio direzione', 'Jump-landing with direction change', '5x6', '5x6')],
  }
);

const BASKET_CORE = moduloCondiviso(
  'core-stability-basket',
  bi('Core Stability', 'Core Stability'),
  {
    Base: bi('Attivazione del core in isometria', 'Isometric core activation'),
    Intermedio: bi('Stabilità anti-rotazione per il contatto', 'Anti-rotation stability for contact play'),
    Avanzato: bi('Core dinamico sotto perturbazione', 'Dynamic core under perturbation'),
    Agonista: bi('Trasferimento di forza dal core al salto', 'Force transfer from core to jump'),
  },
  BASKET_WC,
  {
    Base: [ex('Plank', 'Plank', '3x25s', '3x25s')],
    Intermedio: [ex('Pallof press', 'Pallof press', '3x12 per lato', '3x12 per side')],
    Avanzato: [ex('Plank con spinta su TRX', 'Plank with TRX push', '4x30s', '4x30s')],
    Agonista: [ex('Rotazione con palla medica', 'Medicine ball rotational throw', '4x10 per lato', '4x10 per side')],
  }
);

const BASKET_FORZA_GEN = moduloCondiviso(
  'forza-generale-basket',
  bi('Forza Generale/Ipertrofia Funzionale', 'General Strength / Functional Hypertrophy'),
  {
    Base: bi('Forza generale a corpo libero', 'General bodyweight strength'),
    Intermedio: bi('Forza generale con sovraccarichi moderati', 'General strength with moderate loads'),
    Avanzato: bi('Forza con carichi progressivi e componente esplosiva', 'Strength with progressive loads and explosive component'),
    Agonista: bi('Forza massimale e potenza da trasferire al campo', 'Maximal strength and power to transfer to the court'),
  },
  BASKET_WC,
  {
    Base: [ex('Squat a corpo libero', 'Bodyweight squat', '3x15', '3x15')],
    Intermedio: [ex('Squat con manubri', 'Dumbbell squat', '4x10', '4x10'), ex('Panca piana', 'Bench press', '3x10', '3x10')],
    Avanzato: [ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'), ex('Trazioni', 'Pull-ups', '3x8', '3x8')],
    Agonista: [ex('Squat pesante', 'Heavy squat', '5x5', '5x5'), ex('Girata semplificata', 'Simplified clean', '4x4', '4x4')],
  }
);

export const BASKET_LIBRARY: SportWorkoutLibrary = {
  sportId: 'basket',
  isSportDiSquadra: true,
  focusLabel: bi('Scheda Preparatoria', 'Preparatory Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([BASKET_ESPLOSIVITA, BASKET_AGILITA, BASKET_RESISTENZA]),
  supporto: modulesByLevel([BASKET_PREVENZIONE, BASKET_CORE, BASKET_FORZA_GEN]),
};

// ===========================================================================
// PALLAVOLO — sport di squadra
// ===========================================================================

const PALLAVOLO_WC: WarmCooldownByLevel = {
  Base: {
    riscaldamento: [ex('Corsa leggera di attivazione', 'Light activation run', '8 min', '8 min')],
    defaticamento: [ex('Camminata di recupero', 'Recovery walk', '5 min', '5 min'), ex('Stretching spalle', 'Shoulder stretching', '2x30s', '2x30s')],
  },
  Intermedio: {
    riscaldamento: [ex('Corsa di attivazione con palleggi', 'Activation run with sets', '10 min', '10 min')],
    defaticamento: [ex('Jog leggero', 'Light jog', '5 min', '5 min'), ex('Stretching spalle e ginocchia', 'Shoulder and knee stretching', '3x30s', '3x30s')],
  },
  Avanzato: {
    riscaldamento: [ex('Attivazione dinamica con salti leggeri', 'Dynamic activation with light jumps', '10 min', '10 min')],
    defaticamento: [ex('Jog di scarico', 'Cool-down jog', '6 min', '6 min'), ex('Stretching PNF spalle', 'PNF shoulder stretching', '3x30s', '3x30s')],
  },
  Agonista: {
    riscaldamento: [ex('Attivazione neuromuscolare completa con salti', 'Full neuromuscular activation with jumps', '12 min', '12 min')],
    defaticamento: [ex('Jog e mobilità dinamica', 'Jog and dynamic mobility', '8 min', '8 min'), ex('Stretching PNF completo', 'Full PNF stretching', '4x30s', '4x30s')],
  },
};

const PALLAVOLO_ELEVAZIONE = moduloCondiviso(
  'elevazione-salto',
  bi('Elevazione e Salto (Attacco/Muro)', 'Vertical Jump (Attack/Block)'),
  {
    Base: bi('Introduzione al lavoro di salto per attacco e muro', 'Introduction to jump training for attack and block'),
    Intermedio: bi('Sviluppo della potenza di elevazione', 'Developing vertical power'),
    Avanzato: bi('Pliometria specifica per attacco e muro', 'Attack- and block-specific plyometrics'),
    Agonista: bi('Massima potenza esplosiva da gara', 'Maximum match-level explosive power'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Salti verticali da fermo', 'Standing vertical jumps', '3x8', '3x8')],
    Intermedio: [ex('Salti con rincorsa da attacco', 'Approach jumps for attack', '4x8', '4x8')],
    Avanzato: [ex('Salti pliometrici con rimbalzo', 'Rebound plyometric jumps', '4x10', '4x10')],
    Agonista: [ex('Salti ripetuti attacco-muro', 'Repeated attack-block jumps', '5x10', '5x10')],
  }
);

const PALLAVOLO_REATTIVITA = moduloCondiviso(
  'reattivita-difesa',
  bi('Reattività e Difesa', 'Reactivity and Defense'),
  {
    Base: bi('Coordinazione di base per gli spostamenti difensivi', 'Basic coordination for defensive movement'),
    Intermedio: bi('Reattività su stimolo con spostamenti laterali', 'Cue-based reactivity with lateral movement'),
    Avanzato: bi('Difesa reattiva ad alta intensità', 'High-intensity reactive defense'),
    Agonista: bi('Reattività da gara con decisione sotto pressione', 'Match-level reactivity with decision-making under pressure'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Spostamenti laterali con bagher', 'Lateral movement with forearm pass', '4x30s', '4x30s')],
    Intermedio: [ex('Difesa reattiva su segnale', 'Reactive defense on cue', '5x20s', '5x20s')],
    Avanzato: [ex('Circuito difensivo ad alta intensità', 'High-intensity defensive circuit', '6x20s', '6x20s')],
    Agonista: [ex('Difesa e transizione rapida in attacco', 'Defense and fast transition to attack', '8x20s', '8x20s')],
  }
);

const PALLAVOLO_RESISTENZA = moduloCondiviso(
  'resistenza-partita',
  bi('Resistenza da Partita', 'Match Endurance'),
  {
    Base: bi('Base aerobica per reggere la partita', 'Aerobic base to hold up through a match'),
    Intermedio: bi('Ripetute intermittenti tipo scambio', 'Intermittent repeats mimicking a rally'),
    Avanzato: bi('Intermittente ad alta intensità per set lunghi', 'High-intensity intermittent for long sets'),
    Agonista: bi('Simulazione del carico metabolico di una partita', 'Simulating the metabolic load of a match'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Corsa a ritmo costante', 'Steady-pace run', '15 min', '15 min')],
    Intermedio: [ex('Intermittente 20-10', '20-10 intermittent', '8 blocchi', '8 blocks')],
    Avanzato: [ex('Intermittente 15-15 ad alta intensità', 'High-intensity 15-15 intermittent', '10 blocchi', '10 blocks')],
    Agonista: [ex('Intermittente su 3 set simulati', 'Intermittent over 3 simulated sets', '3x8 blocchi', '3x8 blocks')],
  }
);

const PALLAVOLO_PREVENZIONE = moduloCondiviso(
  'prevenzione-spalla-ginocchio',
  bi('Prevenzione Infortuni (Spalla/Ginocchio)', 'Injury Prevention (Shoulder/Knee)'),
  {
    Base: bi('Stabilità di base per spalla e ginocchio', 'Basic stability for shoulder and knee'),
    Intermedio: bi('Propriocezione per l\'atterraggio e la cuffia dei rotatori', 'Proprioception for landing and rotator cuff'),
    Avanzato: bi('Stabilità dinamica sotto carico di gioco', 'Dynamic stability under playing load'),
    Agonista: bi('Protocollo completo pre-gara', 'Full pre-match protocol'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Equilibrio monopodalico', 'Single-leg balance', '3x20s per lato', '3x20s per side')],
    Intermedio: [ex('Elastici cuffia dei rotatori', 'Rotator cuff band exercises', '3x15', '3x15')],
    Avanzato: [ex('Atterraggio da salto controllato', 'Controlled jump-landing drill', '4x6', '4x6')],
    Agonista: [ex('Atterraggio da salto con cambio direzione', 'Jump-landing with direction change', '5x6', '5x6')],
  }
);

const PALLAVOLO_CORE = moduloCondiviso(
  'core-stability-pallavolo',
  bi('Core Stability', 'Core Stability'),
  {
    Base: bi('Attivazione del core in isometria', 'Isometric core activation'),
    Intermedio: bi('Stabilità anti-estensione per il gesto d\'attacco', 'Anti-extension stability for the attack motion'),
    Avanzato: bi('Core dinamico sotto perturbazione', 'Dynamic core under perturbation'),
    Agonista: bi('Trasferimento di forza dal core al salto', 'Force transfer from core to jump'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Plank', 'Plank', '3x25s', '3x25s')],
    Intermedio: [ex('Superman', 'Superman', '3x14', '3x14')],
    Avanzato: [ex('Plank con spinta su TRX', 'Plank with TRX push', '4x30s', '4x30s')],
    Agonista: [ex('Hollow body con oscillazione gambe', 'Hollow body with leg flutter', '4x30s', '4x30s')],
  }
);

const PALLAVOLO_FORZA_GEN = moduloCondiviso(
  'forza-generale-pallavolo',
  bi('Forza Generale/Ipertrofia Funzionale', 'General Strength / Functional Hypertrophy'),
  {
    Base: bi('Forza generale a corpo libero', 'General bodyweight strength'),
    Intermedio: bi('Forza generale con sovraccarichi moderati', 'General strength with moderate loads'),
    Avanzato: bi('Forza con carichi progressivi e componente esplosiva', 'Strength with progressive loads and explosive component'),
    Agonista: bi('Forza massimale e potenza da trasferire al campo', 'Maximal strength and power to transfer to the court'),
  },
  PALLAVOLO_WC,
  {
    Base: [ex('Squat a corpo libero', 'Bodyweight squat', '3x15', '3x15')],
    Intermedio: [ex('Squat con manubri', 'Dumbbell squat', '4x10', '4x10'), ex('Military press', 'Military press', '3x10', '3x10')],
    Avanzato: [ex('Squat con bilanciere', 'Barbell squat', '4x8', '4x8'), ex('Trazioni', 'Pull-ups', '3x8', '3x8')],
    Agonista: [ex('Squat pesante', 'Heavy squat', '5x5', '5x5'), ex('Girata semplificata', 'Simplified clean', '4x4', '4x4')],
  }
);

export const PALLAVOLO_LIBRARY: SportWorkoutLibrary = {
  sportId: 'pallavolo',
  isSportDiSquadra: true,
  focusLabel: bi('Scheda Preparatoria', 'Preparatory Plan'),
  supportoLabel: bi('Scheda di Supporto', 'Support Plan'),
  focus: modulesByLevel([PALLAVOLO_ELEVAZIONE, PALLAVOLO_REATTIVITA, PALLAVOLO_RESISTENZA]),
  supporto: modulesByLevel([PALLAVOLO_PREVENZIONE, PALLAVOLO_CORE, PALLAVOLO_FORZA_GEN]),
};

// ===========================================================================
// Registro delle librerie disponibili
// ===========================================================================

export const SPORT_WORKOUT_LIBRARIES: Record<string, SportWorkoutLibrary> = {
  calcio: CALCIO_LIBRARY,
  corsa: CORSA_LIBRARY,
  ciclismo: CICLISMO_LIBRARY,
  nuoto: NUOTO_LIBRARY,
  tennis: TENNIS_LIBRARY,
  palestra: PALESTRA_LIBRARY,
  yoga: YOGA_LIBRARY,
  basket: BASKET_LIBRARY,
  pallavolo: PALLAVOLO_LIBRARY,
};

export function getSportWorkoutLibrary(sportId: string): SportWorkoutLibrary | null {
  return SPORT_WORKOUT_LIBRARIES[sportId] ?? null;
}
