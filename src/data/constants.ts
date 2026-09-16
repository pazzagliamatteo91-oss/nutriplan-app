import { Option } from '../components/OptionGroup';

// Cucine: 6 principali (con ricette in libreria) + 12 aggiuntive (solo filtro, in attesa di contenuti).
export const CUISINES: Option[] = [
  { id: 'mediterranea', label: 'Mediterranea' },
  { id: 'giapponese', label: 'Giapponese' },
  { id: 'messicana', label: 'Messicana' },
  { id: 'indiana', label: 'Indiana' },
  { id: 'mediorientale', label: 'Mediorientale' },
  { id: 'sudamericana', label: 'Sudamericana' },
  { id: 'cinese', label: 'Cinese' },
  { id: 'francese', label: 'Francese' },
  { id: 'spagnola', label: 'Spagnola' },
  { id: 'greca', label: 'Greca' },
  { id: 'thailandese', label: 'Thailandese' },
  { id: 'statunitense', label: 'Statunitense' },
  { id: 'peruviana', label: 'Peruviana' },
  { id: 'turca', label: 'Turca' },
  { id: 'libanese', label: 'Libanese' },
  { id: 'coreana', label: 'Coreana' },
  { id: 'texmex', label: 'Tex-Mex' },
  { id: 'vegana', label: 'Vegana' },
];

export const CUISINES_WITH_RECIPES = [
  'mediterranea',
  'giapponese',
  'messicana',
  'indiana',
  'mediorientale',
  'sudamericana',
  'varie',
] as const;

export const RESTRICTIONS: Option[] = [
  { id: 'vegetariano', label: 'Vegetariano' },
  { id: 'vegano', label: 'Vegano' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'niente_maiale', label: 'Niente maiale' },
  { id: 'niente_alcol', label: 'Niente alcol' },
];

export const INTOLERANCES: Option[] = [
  { id: 'lattosio', label: 'Lattosio' },
  { id: 'glutine', label: 'Glutine' },
  { id: 'fruttosio', label: 'Fruttosio' },
  { id: 'istamina', label: 'Istamina' },
  { id: 'nichel', label: 'Nichel' },
  { id: 'solfiti', label: 'Solfiti' },
  { id: 'caffeina', label: 'Caffeina' },
  { id: 'fodmap', label: 'FODMAP' },
  { id: 'uovo_intoll', label: 'Uovo' },
  { id: 'lievito', label: 'Lievito' },
];

export const ALLERGIES: Option[] = [
  { id: 'frutta_guscio', label: 'Frutta a guscio' },
  { id: 'crostacei', label: 'Crostacei' },
  { id: 'arachidi', label: 'Arachidi' },
  { id: 'pesce_allergia', label: 'Pesce' },
  { id: 'soia', label: 'Soia' },
  { id: 'sesamo', label: 'Sesamo' },
  { id: 'sedano', label: 'Sedano' },
  { id: 'senape', label: 'Senape' },
  { id: 'molluschi', label: 'Molluschi' },
  { id: 'lupini', label: 'Lupini' },
];

export const LIFESTYLES = ['Sedentario', 'Leggermente attivo', 'Attivo', 'Molto attivo'];
export const GOALS = ['Perdere peso', 'Mantenere peso', 'Aumentare massa', 'Migliorare salute'];

export const MEAL_TYPES = [
  { id: 'colazione', label: 'Colazione', icon: 'sunrise' as const },
  { id: 'pranzo', label: 'Pranzo', icon: 'sun' as const },
  { id: 'spuntino', label: 'Spuntino', icon: 'apple' as const },
  { id: 'cena', label: 'Cena', icon: 'moon' as const },
];

export const SHOPPING_CATEGORIES = [
  { id: 'verdura', label: 'Verdura', icon: 'basketVegetable' as const },
  { id: 'cereali', label: 'Cereali', icon: 'grain' as const },
  { id: 'proteine', label: 'Proteine', icon: 'protein' as const },
  { id: 'dispensa', label: 'Dispensa', icon: 'pantry' as const },
];

export const WEEKDAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const MAIN_SPORTS: Option[] = [
  { id: 'corsa', label: 'Corsa' },
  { id: 'ciclismo', label: 'Ciclismo' },
  { id: 'nuoto', label: 'Nuoto' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'palestra', label: 'Palestra' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'calcio', label: 'Calcio' },
];

export const EXTENDED_SPORTS: string[] = [
  'Trail Running', 'Adventure Race', 'Triathlon', 'Duathlon', 'Maratona', 'Mezza maratona',
  'Atletica leggera', 'Salto in alto', 'Salto in lungo', 'Lancio del peso', 'Marcia',
  'Ciclismo su strada', 'Mountain bike', 'BMX', 'Ciclocross', 'Spinning',
  'Nuoto in acque libere', 'Tuffi', 'Nuoto sincronizzato', 'Pallanuoto', 'Canottaggio',
  'Canoa', 'Kayak', 'Vela', 'Windsurf', 'Kitesurf', 'Surf', 'Paddleboard', 'Immersioni',
  'Pallavolo', 'Beach volley', 'Basket', 'Pallamano', 'Rugby', 'Football americano',
  'Baseball', 'Softball', 'Cricket', 'Hockey su prato', 'Hockey su ghiaccio',
  'Badminton', 'Squash', 'Padel', 'Ping pong', 'Golf', 'Tiro con l\'arco', 'Tiro a segno',
  'Scherma', 'Boxe', 'Kickboxing', 'Muay Thai', 'MMA', 'Judo', 'Karate', 'Taekwondo',
  'Aikido', 'Jiu jitsu brasiliano', 'Lotta', 'Wrestling', 'Sollevamento pesi',
  'Powerlifting', 'Crossfit', 'Calisthenics', 'Functional training', 'HIIT',
  'Pilates', 'Danza classica', 'Danza moderna', 'Danza hip hop', 'Zumba', 'Danza aerea',
  'Pattinaggio artistico', 'Pattinaggio a rotelle', 'Skateboard', 'Arrampicata sportiva',
  'Boulder', 'Alpinismo', 'Trekking', 'Escursionismo', 'Sci alpino', 'Sci di fondo',
  'Snowboard', 'Freeride', 'Slittino', 'Bob', 'Pattinaggio di velocità', 'Curling',
  'Equitazione', 'Polo', 'Tiro con la fionda', 'Parkour', 'Ginnastica artistica',
  'Ginnastica ritmica', 'Orienteering', 'Mototrial', 'Motocross',
];

export const DEVICE_TYPES: { id: string; label: string }[] = [
  { id: 'garmin', label: 'Garmin Connect' },
  { id: 'apple_watch', label: 'Apple Watch' },
  { id: 'amazfit', label: 'Amazfit / Zepp' },
];

export const AVATAR_ICON_IDS = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'] as const;

export const SUPERMARKET_PARTNERS: { id: string; label: string }[] = [
  { id: 'esselunga', label: 'Esselunga a Casa' },
  { id: 'carrefour', label: 'Carrefour' },
  { id: 'amazon_fresh', label: 'Amazon Fresh' },
];
