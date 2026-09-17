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
// Registro delle librerie disponibili
// ===========================================================================

export const SPORT_WORKOUT_LIBRARIES: Record<string, SportWorkoutLibrary> = {
  calcio: CALCIO_LIBRARY,
  corsa: CORSA_LIBRARY,
};

export function getSportWorkoutLibrary(sportId: string): SportWorkoutLibrary | null {
  return SPORT_WORKOUT_LIBRARIES[sportId] ?? null;
}
