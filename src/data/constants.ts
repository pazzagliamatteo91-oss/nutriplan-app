import { Option } from '../components/OptionGroup';
import { Bilingual } from './types';
import { LOCALES } from '../i18n';

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

export type ExtendedSport = { id: string; it: string; en: string };

export const EXTENDED_SPORTS: ExtendedSport[] = [
  { id: 'trail-running', it: 'Trail Running', en: 'Trail Running' },
  { id: 'adventure-race', it: 'Adventure Race', en: 'Adventure Race' },
  { id: 'triathlon', it: 'Triathlon', en: 'Triathlon' },
  { id: 'duathlon', it: 'Duathlon', en: 'Duathlon' },
  { id: 'maratona', it: 'Maratona', en: 'Marathon' },
  { id: 'mezza-maratona', it: 'Mezza maratona', en: 'Half marathon' },
  { id: 'atletica-leggera', it: 'Atletica leggera', en: 'Track and field' },
  { id: 'salto-in-alto', it: 'Salto in alto', en: 'High jump' },
  { id: 'salto-in-lungo', it: 'Salto in lungo', en: 'Long jump' },
  { id: 'lancio-del-peso', it: 'Lancio del peso', en: 'Shot put' },
  { id: 'marcia', it: 'Marcia', en: 'Race walking' },
  { id: 'ciclismo-su-strada', it: 'Ciclismo su strada', en: 'Road cycling' },
  { id: 'mountain-bike', it: 'Mountain bike', en: 'Mountain biking' },
  { id: 'bmx', it: 'BMX', en: 'BMX' },
  { id: 'ciclocross', it: 'Ciclocross', en: 'Cyclocross' },
  { id: 'spinning', it: 'Spinning', en: 'Spinning' },
  { id: 'nuoto-acque-libere', it: 'Nuoto in acque libere', en: 'Open water swimming' },
  { id: 'tuffi', it: 'Tuffi', en: 'Diving' },
  { id: 'nuoto-sincronizzato', it: 'Nuoto sincronizzato', en: 'Synchronized swimming' },
  { id: 'pallanuoto', it: 'Pallanuoto', en: 'Water polo' },
  { id: 'canottaggio', it: 'Canottaggio', en: 'Rowing' },
  { id: 'canoa', it: 'Canoa', en: 'Canoeing' },
  { id: 'kayak', it: 'Kayak', en: 'Kayaking' },
  { id: 'vela', it: 'Vela', en: 'Sailing' },
  { id: 'windsurf', it: 'Windsurf', en: 'Windsurfing' },
  { id: 'kitesurf', it: 'Kitesurf', en: 'Kitesurfing' },
  { id: 'surf', it: 'Surf', en: 'Surfing' },
  { id: 'paddleboard', it: 'Paddleboard', en: 'Paddleboarding' },
  { id: 'immersioni', it: 'Immersioni', en: 'Scuba diving' },
  { id: 'pallavolo', it: 'Pallavolo', en: 'Volleyball' },
  { id: 'beach-volley', it: 'Beach volley', en: 'Beach volleyball' },
  { id: 'basket', it: 'Basket', en: 'Basketball' },
  { id: 'pallamano', it: 'Pallamano', en: 'Handball' },
  { id: 'rugby', it: 'Rugby', en: 'Rugby' },
  { id: 'football-americano', it: 'Football americano', en: 'American football' },
  { id: 'baseball', it: 'Baseball', en: 'Baseball' },
  { id: 'softball', it: 'Softball', en: 'Softball' },
  { id: 'cricket', it: 'Cricket', en: 'Cricket' },
  { id: 'hockey-prato', it: 'Hockey su prato', en: 'Field hockey' },
  { id: 'hockey-ghiaccio', it: 'Hockey su ghiaccio', en: 'Ice hockey' },
  { id: 'badminton', it: 'Badminton', en: 'Badminton' },
  { id: 'squash', it: 'Squash', en: 'Squash' },
  { id: 'padel', it: 'Padel', en: 'Padel' },
  { id: 'ping-pong', it: 'Ping pong', en: 'Table tennis' },
  { id: 'golf', it: 'Golf', en: 'Golf' },
  { id: 'tiro-con-arco', it: "Tiro con l'arco", en: 'Archery' },
  { id: 'tiro-a-segno', it: 'Tiro a segno', en: 'Shooting' },
  { id: 'scherma', it: 'Scherma', en: 'Fencing' },
  { id: 'boxe', it: 'Boxe', en: 'Boxing' },
  { id: 'kickboxing', it: 'Kickboxing', en: 'Kickboxing' },
  { id: 'muay-thai', it: 'Muay Thai', en: 'Muay Thai' },
  { id: 'mma', it: 'MMA', en: 'MMA' },
  { id: 'judo', it: 'Judo', en: 'Judo' },
  { id: 'karate', it: 'Karate', en: 'Karate' },
  { id: 'taekwondo', it: 'Taekwondo', en: 'Taekwondo' },
  { id: 'aikido', it: 'Aikido', en: 'Aikido' },
  { id: 'jiu-jitsu-brasiliano', it: 'Jiu jitsu brasiliano', en: 'Brazilian jiu-jitsu' },
  { id: 'lotta', it: 'Lotta', en: 'Wrestling' },
  { id: 'wrestling', it: 'Wrestling', en: 'Pro wrestling' },
  { id: 'sollevamento-pesi', it: 'Sollevamento pesi', en: 'Weightlifting' },
  { id: 'powerlifting', it: 'Powerlifting', en: 'Powerlifting' },
  { id: 'crossfit', it: 'Crossfit', en: 'CrossFit' },
  { id: 'calisthenics', it: 'Calisthenics', en: 'Calisthenics' },
  { id: 'functional-training', it: 'Functional training', en: 'Functional training' },
  { id: 'hiit', it: 'HIIT', en: 'HIIT' },
  { id: 'pilates', it: 'Pilates', en: 'Pilates' },
  { id: 'danza-classica', it: 'Danza classica', en: 'Classical ballet' },
  { id: 'danza-moderna', it: 'Danza moderna', en: 'Modern dance' },
  { id: 'danza-hip-hop', it: 'Danza hip hop', en: 'Hip hop dance' },
  { id: 'zumba', it: 'Zumba', en: 'Zumba' },
  { id: 'danza-aerea', it: 'Danza aerea', en: 'Aerial dance' },
  { id: 'pattinaggio-artistico', it: 'Pattinaggio artistico', en: 'Figure skating' },
  { id: 'pattinaggio-rotelle', it: 'Pattinaggio a rotelle', en: 'Roller skating' },
  { id: 'skateboard', it: 'Skateboard', en: 'Skateboarding' },
  { id: 'arrampicata-sportiva', it: 'Arrampicata sportiva', en: 'Sport climbing' },
  { id: 'boulder', it: 'Boulder', en: 'Bouldering' },
  { id: 'alpinismo', it: 'Alpinismo', en: 'Mountaineering' },
  { id: 'trekking', it: 'Trekking', en: 'Trekking' },
  { id: 'escursionismo', it: 'Escursionismo', en: 'Hiking' },
  { id: 'sci-alpino', it: 'Sci alpino', en: 'Alpine skiing' },
  { id: 'sci-fondo', it: 'Sci di fondo', en: 'Cross-country skiing' },
  { id: 'snowboard', it: 'Snowboard', en: 'Snowboarding' },
  { id: 'freeride', it: 'Freeride', en: 'Freeride' },
  { id: 'slittino', it: 'Slittino', en: 'Luge' },
  { id: 'bob', it: 'Bob', en: 'Bobsled' },
  { id: 'pattinaggio-velocita', it: 'Pattinaggio di velocità', en: 'Speed skating' },
  { id: 'curling', it: 'Curling', en: 'Curling' },
  { id: 'equitazione', it: 'Equitazione', en: 'Horseback riding' },
  { id: 'polo', it: 'Polo', en: 'Polo' },
  { id: 'tiro-fionda', it: 'Tiro con la fionda', en: 'Slingshot shooting' },
  { id: 'parkour', it: 'Parkour', en: 'Parkour' },
  { id: 'ginnastica-artistica', it: 'Ginnastica artistica', en: 'Artistic gymnastics' },
  { id: 'ginnastica-ritmica', it: 'Ginnastica ritmica', en: 'Rhythmic gymnastics' },
  { id: 'orienteering', it: 'Orienteering', en: 'Orienteering' },
  { id: 'mototrial', it: 'Mototrial', en: 'Moto trial' },
  { id: 'motocross', it: 'Motocross', en: 'Motocross' },
];

// Nome visualizzato di uno sport (principale o esteso) in entrambe le lingue.
export function sportDisplayName(sportId: string): Bilingual {
  const extended = EXTENDED_SPORTS.find((s) => s.id === sportId);
  if (extended) return { it: extended.it, en: extended.en };
  return { it: LOCALES.it.mainSports[sportId] ?? sportId, en: LOCALES.en.mainSports[sportId] ?? sportId };
}

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
