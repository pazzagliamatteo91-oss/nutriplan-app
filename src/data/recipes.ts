import { CUISINE_BANKS, CuisineBank } from './recipeBank';
import { Recipe, Ingredient, MealType, Bilingual, bi } from './types';

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function genericSteps(nome: Bilingual, tecnica: Bilingual): { sintetici: Bilingual[]; dettagliati: Bilingual[] } {
  return {
    sintetici: [
      bi('Prepara e taglia gli ingredienti principali.', 'Prepare and chop the main ingredients.'),
      bi(`Cuoci ${tecnica.it} fino a cottura completa.`, `Cook ${tecnica.en} until fully done.`),
      bi('Componi il piatto e servi caldo.', 'Plate the dish and serve hot.'),
    ],
    dettagliati: [
      bi(
        'Lava, monda e taglia a pezzi regolari tutti gli ingredienti freschi previsti dalla ricetta.',
        'Wash, trim and cut into even pieces all the fresh ingredients called for in the recipe.'
      ),
      bi(
        `Scalda una padella o il forno e cuoci l'ingrediente principale ${tecnica.it}, girando a metà cottura per una doratura uniforme.`,
        `Heat a pan or the oven and cook the main ingredient ${tecnica.en}, turning halfway through for even browning.`
      ),
      bi(
        'Nel frattempo prepara la base di accompagnamento seguendo i tempi di cottura indicati sulla confezione.',
        'Meanwhile, prepare the side base following the cooking time on the package.'
      ),
      bi(
        "Unisci le verdure a metà cottura, regola di sale, pepe e olio extravergine d'oliva.",
        'Add the vegetables halfway through, then season with salt, pepper and extra virgin olive oil.'
      ),
      bi(
        `Impiatta ${nome.it.toLowerCase()} disponendo la base sul fondo e l'ingrediente principale sopra, decorando con le verdure.`,
        `Plate the ${nome.en.toLowerCase()}, arranging the base at the bottom and the main ingredient on top, garnished with the vegetables.`
      ),
      bi(
        'Servi subito, aggiungendo eventuali salse o guarnizioni suggerite a piacere.',
        'Serve immediately, adding any suggested sauces or garnishes to taste.'
      ),
    ],
  };
}

const TECNICA_PADELLA: Bilingual = bi('in padella a fuoco medio', 'in a pan over medium heat');

function withDefaults(r: Partial<Recipe> & Pick<Recipe, 'nome' | 'tipoPasto' | 'cucina' | 'tagDietetico' | 'tempoMinuti' | 'kcal' | 'ingredienti'>): Recipe {
  const { sintetici, dettagliati } = genericSteps(r.nome, TECNICA_PADELLA);
  return {
    id: nextId(r.cucina),
    lattosio: false,
    fruttaAGuscio: false,
    crostacei: false,
    glutine: false,
    alcol: false,
    passaggiSintetici: sintetici,
    passaggiDettagliati: dettagliati,
    ...r,
  };
}

function ing(nomeIt: string, nomeEn: string, quantitaIt: string, quantitaEn: string): Ingredient {
  return { nome: bi(nomeIt, nomeEn), quantita: bi(quantitaIt, quantitaEn) };
}

// ---------------------------------------------------------------------------
// Colazioni: variegate per ciascuna cucina, scritte a mano (non combinatorie).
// ---------------------------------------------------------------------------
const BREAKFASTS: Recipe[] = [
  // Mediterranea
  withDefaults({
    nome: bi('Yogurt greco con miele e noci', 'Greek yogurt with honey and walnuts'),
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 320, lattosio: true, fruttaAGuscio: true,
    ingredienti: [
      ing('Yogurt greco', 'Greek yogurt', '250 g', '250 g'),
      ing('Miele', 'Honey', '1 cucchiaio', '1 tbsp'),
      ing('Noci', 'Walnuts', '20 g', '20 g'),
      ing('Frutti di bosco', 'Mixed berries', '50 g', '50 g'),
    ],
  }),
  withDefaults({
    nome: bi('Uova strapazzate con pomodorini e feta', 'Scrambled eggs with cherry tomatoes and feta'),
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 380, lattosio: true, glutine: false,
    ingredienti: [
      ing('Uova', 'Eggs', '3', '3'),
      ing('Pomodorini', 'Cherry tomatoes', '80 g', '80 g'),
      ing('Feta', 'Feta', '40 g', '40 g'),
      ing("Olio extravergine d'oliva", 'Extra virgin olive oil', '1 cucchiaio', '1 tbsp'),
    ],
  }),
  withDefaults({
    nome: bi('Pane integrale con hummus di ceci e cetriolo', 'Whole wheat bread with chickpea hummus and cucumber'),
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegano',
    tempoMinuti: 8, kcal: 300, glutine: true,
    ingredienti: [
      ing('Pane integrale', 'Whole wheat bread', '2 fette', '2 slices'),
      ing('Hummus di ceci', 'Chickpea hummus', '60 g', '60 g'),
      ing('Cetriolo', 'Cucumber', '50 g', '50 g'),
    ],
  }),
  withDefaults({
    nome: bi('Porridge di farro con fichi e mandorle', 'Farro porridge with figs and almonds'),
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegano',
    tempoMinuti: 15, kcal: 340, glutine: true, fruttaAGuscio: true,
    ingredienti: [
      ing('Farro perlato', 'Pearled farro', '50 g', '50 g'),
      ing('Bevanda di mandorla', 'Almond drink', '200 ml', '200 ml'),
      ing('Fichi', 'Figs', '2', '2'),
      ing('Mandorle a lamelle', 'Sliced almonds', '15 g', '15 g'),
    ],
  }),
  withDefaults({
    nome: bi('Frittatina alle erbe con salmone affumicato', 'Herb frittata with smoked salmon'),
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Pesce',
    tempoMinuti: 10, kcal: 360,
    ingredienti: [
      ing('Uova', 'Eggs', '2', '2'),
      ing('Salmone affumicato', 'Smoked salmon', '60 g', '60 g'),
      ing('Erba cipollina', 'Chives', 'q.b.', 'to taste'),
    ],
  }),
  // Giapponese
  withDefaults({
    nome: bi('Tamagoyaki con riso e alga nori', 'Tamagoyaki with rice and nori seaweed'),
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 340,
    ingredienti: [
      ing('Uova', 'Eggs', '3', '3'),
      ing('Riso', 'Rice', '100 g', '100 g'),
      ing('Alga nori', 'Nori seaweed', '1 foglio', '1 sheet'),
      ing('Salsa di soia', 'Soy sauce', '1 cucchiaino', '1 tsp'),
    ],
  }),
  withDefaults({
    nome: bi('Zuppa di miso con tofu ed edamame', 'Miso soup with tofu and edamame'),
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 220,
    ingredienti: [
      ing('Pasta di miso', 'Miso paste', '1 cucchiaio', '1 tbsp'),
      ing('Tofu', 'Tofu', '80 g', '80 g'),
      ing('Edamame', 'Edamame', '40 g', '40 g'),
      ing('Cipollotto', 'Spring onion', '1', '1'),
    ],
  }),
  withDefaults({
    nome: bi('Onigiri al salmone grigliato', 'Grilled salmon onigiri'),
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Pesce',
    tempoMinuti: 15, kcal: 310,
    ingredienti: [
      ing('Riso per sushi', 'Sushi rice', '120 g', '120 g'),
      ing('Salmone', 'Salmon', '60 g', '60 g'),
      ing('Alga nori', 'Nori seaweed', '1 foglio', '1 sheet'),
    ],
  }),
  withDefaults({
    nome: bi('Yogurt di soia con sesamo tostato e pera', 'Soy yogurt with toasted sesame and pear'),
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegano',
    tempoMinuti: 5, kcal: 260, fruttaAGuscio: true,
    ingredienti: [
      ing('Yogurt di soia', 'Soy yogurt', '200 g', '200 g'),
      ing('Sesamo tostato', 'Toasted sesame seeds', '10 g', '10 g'),
      ing('Pera', 'Pear', '1', '1'),
    ],
  }),
  withDefaults({
    nome: bi('Riso al vapore con uovo marinato in soia', 'Steamed rice with soy-marinated egg'),
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegetariano',
    tempoMinuti: 18, kcal: 350,
    ingredienti: [
      ing('Riso', 'Rice', '120 g', '120 g'),
      ing('Uova', 'Eggs', '2', '2'),
      ing('Salsa di soia', 'Soy sauce', '2 cucchiai', '2 tbsp'),
      ing('Cipollotto', 'Spring onion', '1', '1'),
    ],
  }),
  // Messicana
  withDefaults({
    nome: bi('Huevos rancheros con tortilla di mais', 'Huevos rancheros with corn tortilla'),
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 380,
    ingredienti: [
      ing('Uova', 'Eggs', '2', '2'),
      ing('Tortilla di mais', 'Corn tortilla', '2', '2'),
      ing('Salsa piccante', 'Hot sauce', '30 g', '30 g'),
      ing('Fagioli neri', 'Black beans', '60 g', '60 g'),
    ],
  }),
  withDefaults({
    nome: bi('Burrito di fagioli neri e formaggio', 'Black bean and cheese burrito'),
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 400, lattosio: true, glutine: true,
    ingredienti: [
      ing('Tortilla di farina', 'Flour tortilla', '1', '1'),
      ing('Fagioli neri', 'Black beans', '100 g', '100 g'),
      ing('Formaggio', 'Cheese', '40 g', '40 g'),
      ing('Avocado', 'Avocado', '1/2', '1/2'),
    ],
  }),
  withDefaults({
    nome: bi('Avocado toast con jalapeño e lime', 'Avocado toast with jalapeño and lime'),
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegano',
    tempoMinuti: 8, kcal: 310, glutine: true,
    ingredienti: [
      ing('Pane tostato', 'Toasted bread', '2 fette', '2 slices'),
      ing('Avocado', 'Avocado', '1', '1'),
      ing('Jalapeño', 'Jalapeño', '1', '1'),
      ing('Lime', 'Lime', '1/2', '1/2'),
    ],
  }),
  withDefaults({
    nome: bi('Chilaquiles verdi con pollo sfilacciato', 'Green chilaquiles with shredded chicken'),
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Carne',
    tempoMinuti: 20, kcal: 420,
    ingredienti: [
      ing('Nachos', 'Nachos', '80 g', '80 g'),
      ing('Pollo', 'Chicken', '100 g', '100 g'),
      ing('Salsa verde', 'Green salsa', '80 g', '80 g'),
      ing('Formaggio', 'Cheese', '30 g', '30 g'),
    ],
  }),
  withDefaults({
    nome: bi('Smoothie tropicale con mais e lime', 'Tropical smoothie with corn and lime'),
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegano',
    tempoMinuti: 6, kcal: 240,
    ingredienti: [
      ing('Ananas', 'Pineapple', '100 g', '100 g'),
      ing('Mango', 'Mango', '80 g', '80 g'),
      ing('Lime', 'Lime', '1/2', '1/2'),
      ing('Acqua di cocco', 'Coconut water', '150 ml', '150 ml'),
    ],
  }),
  // Indiana
  withDefaults({
    nome: bi('Chana masala leggero con chapati', 'Light chana masala with chapati'),
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegano',
    tempoMinuti: 18, kcal: 370, glutine: true,
    ingredienti: [
      ing('Ceci', 'Chickpeas', '120 g', '120 g'),
      ing('Chapati', 'Chapati', '1', '1'),
      ing('Pomodoro', 'Tomato', '80 g', '80 g'),
      ing('Spezie miste', 'Mixed spices', 'q.b.', 'to taste'),
    ],
  }),
  withDefaults({
    nome: bi('Paratha ripiena di patate speziate', 'Paratha stuffed with spiced potatoes'),
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 400, glutine: true,
    ingredienti: [
      ing('Chapati', 'Chapati', '2', '2'),
      ing('Patate', 'Potatoes', '150 g', '150 g'),
      ing('Spezie miste', 'Mixed spices', 'q.b.', 'to taste'),
      ing('Yogurt', 'Yogurt', '50 g', '50 g'),
    ],
  }),
  withDefaults({
    nome: bi('Porridge speziato con latte di cocco e anacardi', 'Spiced porridge with coconut milk and cashews'),
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegano',
    tempoMinuti: 12, kcal: 350, fruttaAGuscio: true,
    ingredienti: [
      ing('Semolino', 'Semolina', '50 g', '50 g'),
      ing('Latte di cocco', 'Coconut milk', '150 ml', '150 ml'),
      ing('Anacardi', 'Cashews', '20 g', '20 g'),
      ing('Cardamomo', 'Cardamom', 'q.b.', 'to taste'),
    ],
  }),
  withDefaults({
    nome: bi('Uova al curry con spinaci', 'Curried eggs with spinach'),
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 14, kcal: 330,
    ingredienti: [
      ing('Uova', 'Eggs', '3', '3'),
      ing('Spinaci', 'Spinach', '80 g', '80 g'),
      ing('Curry in polvere', 'Curry powder', 'q.b.', 'to taste'),
      ing('Cipolla', 'Onion', '1/2', '1/2'),
    ],
  }),
  withDefaults({
    nome: bi('Lassi al mango con cardamomo', 'Mango lassi with cardamom'),
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 250, lattosio: true,
    ingredienti: [
      ing('Yogurt', 'Yogurt', '200 g', '200 g'),
      ing('Mango', 'Mango', '100 g', '100 g'),
      ing('Cardamomo', 'Cardamom', 'q.b.', 'to taste'),
    ],
  }),
  // Mediorientale
  withDefaults({
    nome: bi('Shakshuka con pane pita', 'Shakshuka with pita bread'),
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 380, glutine: true,
    ingredienti: [
      ing('Uova', 'Eggs', '2', '2'),
      ing('Pomodoro', 'Tomato', '200 g', '200 g'),
      ing('Pane pita', 'Pita bread', '1', '1'),
      ing('Peperoni', 'Bell peppers', '50 g', '50 g'),
    ],
  }),
  withDefaults({
    nome: bi("Labneh con olio d'oliva e za'atar", "Labneh with olive oil and za'atar"),
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 260, lattosio: true,
    ingredienti: [
      ing('Labneh', 'Labneh', '150 g', '150 g'),
      ing("Za'atar", "Za'atar", '1 cucchiaino', '1 tsp'),
      ing("Olio extravergine d'oliva", 'Extra virgin olive oil', '1 cucchiaio', '1 tbsp'),
      ing('Pane pita', 'Pita bread', '1/2', '1/2'),
    ],
  }),
  withDefaults({
    nome: bi('Foul medames con ceci e limone', 'Foul medames with chickpeas and lemon'),
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegano',
    tempoMinuti: 15, kcal: 340,
    ingredienti: [
      ing('Fave', 'Fava beans', '150 g', '150 g'),
      ing('Ceci', 'Chickpeas', '60 g', '60 g'),
      ing('Limone', 'Lemon', '1/2', '1/2'),
      ing('Prezzemolo', 'Parsley', 'q.b.', 'to taste'),
    ],
  }),
  withDefaults({
    nome: bi("Manakish allo za'atar", "Za'atar manakish"),
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegano',
    tempoMinuti: 18, kcal: 360, glutine: true,
    ingredienti: [
      ing('Impasto per pane', 'Bread dough', '150 g', '150 g'),
      ing("Za'atar", "Za'atar", '2 cucchiai', '2 tbsp'),
      ing("Olio extravergine d'oliva", 'Extra virgin olive oil', '2 cucchiai', '2 tbsp'),
    ],
  }),
  withDefaults({
    nome: bi('Frittata di falafel con yogurt e cetriolo', 'Falafel frittata with yogurt and cucumber'),
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 370, lattosio: true,
    ingredienti: [
      ing('Falafel', 'Falafel', '4', '4'),
      ing('Yogurt', 'Yogurt', '80 g', '80 g'),
      ing('Cetriolo', 'Cucumber', '50 g', '50 g'),
    ],
  }),
  // Sudamericana
  withDefaults({
    nome: bi('Arepas con formaggio filante', 'Arepas with melted cheese'),
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 18, kcal: 400, lattosio: true,
    ingredienti: [
      ing('Farina di mais', 'Corn flour', '100 g', '100 g'),
      ing('Formaggio', 'Cheese', '60 g', '60 g'),
      ing('Burro', 'Butter', '10 g', '10 g'),
    ],
  }),
  withDefaults({
    nome: bi('Pan de yuca con caffè', 'Pan de yuca with coffee'),
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 320, lattosio: true,
    ingredienti: [
      ing('Yuca', 'Cassava', '150 g', '150 g'),
      ing('Formaggio', 'Cheese', '40 g', '40 g'),
      ing('Uova', 'Eggs', '1', '1'),
    ],
  }),
  withDefaults({
    nome: bi('Platano fritto con uova e fagioli neri', 'Fried plantain with eggs and black beans'),
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 410,
    ingredienti: [
      ing('Platano fritto', 'Fried plantain', '100 g', '100 g'),
      ing('Uova', 'Eggs', '2', '2'),
      ing('Fagioli neri', 'Black beans', '80 g', '80 g'),
    ],
  }),
  withDefaults({
    nome: bi('Ceviche leggero di pesce bianco al lime', 'Light white fish ceviche with lime'),
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Pesce',
    tempoMinuti: 20, kcal: 280,
    ingredienti: [
      ing('Pesce bianco', 'White fish', '120 g', '120 g'),
      ing('Lime', 'Lime', '2', '2'),
      ing('Cipolla rossa', 'Red onion', '30 g', '30 g'),
      ing('Coriandolo', 'Cilantro', 'q.b.', 'to taste'),
    ],
  }),
  withDefaults({
    nome: bi('Frullato di papaya e semi di chia', 'Papaya and chia seed smoothie'),
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegano',
    tempoMinuti: 6, kcal: 230,
    ingredienti: [
      ing('Papaya', 'Papaya', '150 g', '150 g'),
      ing('Semi di chia', 'Chia seeds', '15 g', '15 g'),
      ing('Acqua di cocco', 'Coconut water', '150 ml', '150 ml'),
    ],
  }),
  // Varie
  withDefaults({
    nome: bi("Porridge d'avena con noci e frutti di bosco", 'Oat porridge with walnuts and mixed berries'),
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 340, fruttaAGuscio: true,
    ingredienti: [
      ing("Fiocchi d'avena", 'Rolled oats', '60 g', '60 g'),
      ing('Bevanda vegetale', 'Plant-based drink', '200 ml', '200 ml'),
      ing('Noci', 'Walnuts', '20 g', '20 g'),
      ing('Frutti di bosco', 'Mixed berries', '60 g', '60 g'),
    ],
  }),
  withDefaults({
    nome: bi('Pancake integrali con frutta fresca', 'Whole wheat pancakes with fresh fruit'),
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 380, glutine: true, lattosio: true,
    ingredienti: [
      ing('Farina integrale', 'Whole wheat flour', '100 g', '100 g'),
      ing('Uova', 'Eggs', '1', '1'),
      ing('Latte', 'Milk', '150 ml', '150 ml'),
      ing('Banana', 'Banana', '1', '1'),
    ],
  }),
  withDefaults({
    nome: bi('Toast con formaggio fresco e pomodoro', 'Toast with fresh cheese and tomato'),
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 8, kcal: 300, glutine: true, lattosio: true,
    ingredienti: [
      ing('Pane', 'Bread', '2 fette', '2 slices'),
      ing('Formaggio fresco', 'Fresh cheese', '50 g', '50 g'),
      ing('Pomodoro', 'Tomato', '80 g', '80 g'),
    ],
  }),
  withDefaults({
    nome: bi('Smoothie bowl con quinoa soffiata', 'Smoothie bowl with puffed quinoa'),
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 310,
    ingredienti: [
      ing('Frutti di bosco', 'Mixed berries', '150 g', '150 g'),
      ing('Banana', 'Banana', '1', '1'),
      ing('Quinoa soffiata', 'Puffed quinoa', '30 g', '30 g'),
    ],
  }),
  withDefaults({
    nome: bi('Uova sode con avocado e pane tostato', 'Hard-boiled eggs with avocado and toasted bread'),
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 360, glutine: true,
    ingredienti: [
      ing('Uova', 'Eggs', '2', '2'),
      ing('Avocado', 'Avocado', '1/2', '1/2'),
      ing('Pane', 'Bread', '2 fette', '2 slices'),
    ],
  }),
];

// ---------------------------------------------------------------------------
// Pranzo / Cena / Spuntino: generati componendo ingredienti tipici per cucina.
// ---------------------------------------------------------------------------
const OLIO_EVO = ing("Olio extravergine d'oliva", 'Extra virgin olive oil', '1 cucchiaio', '1 tbsp');

function comboName(protein: Bilingual, style: CuisineBank['styles'][number], base: Bilingual, veggie: Bilingual): Bilingual {
  const it = `${protein.it} ${style.label.it} con ${base.it.toLowerCase()} e ${veggie.it.toLowerCase()}`;
  const en = style.enPrefix
    ? `${style.label.en} ${protein.en.toLowerCase()} with ${base.en.toLowerCase()} and ${veggie.en.toLowerCase()}`
    : `${protein.en} ${style.label.en} with ${base.en.toLowerCase()} and ${veggie.en.toLowerCase()}`;
  return bi(capitalize(it), capitalize(en));
}

function comboSnackName(protein: Bilingual, style: CuisineBank['styles'][number], veggie: Bilingual): Bilingual {
  const it = `${protein.it} ${style.label.it} con ${veggie.it.toLowerCase()}`;
  const en = style.enPrefix
    ? `${style.label.en} ${protein.en.toLowerCase()} with ${veggie.en.toLowerCase()}`
    : `${protein.en} ${style.label.en} with ${veggie.en.toLowerCase()}`;
  return bi(capitalize(it), capitalize(en));
}

function comboMain(bank: CuisineBank, tipoPasto: MealType, count: number, kcalBase: number, tempoBase: number): Recipe[] {
  const out: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const protein = bank.proteins[i % bank.proteins.length];
    const base = bank.bases[(i + 1) % bank.bases.length];
    const veggie = bank.veggies[(i + 2) % bank.veggies.length];
    const style = bank.styles[i % bank.styles.length];
    const addNuts = !!bank.fruttaGuscio && i % 3 === 0;
    const nutIngredient = addNuts ? bank.fruttaGuscio![i % bank.fruttaGuscio!.length] : null;

    const nome = comboName(protein.nome, style, base.nome, veggie);
    const ingredienti: Ingredient[] = [
      { nome: protein.nome, quantita: bi('160 g', '160 g') },
      { nome: base.nome, quantita: bi('90 g', '90 g') },
      { nome: veggie, quantita: bi('100 g', '100 g') },
      OLIO_EVO,
    ];
    if (nutIngredient) ingredienti.push({ nome: nutIngredient, quantita: bi('15 g', '15 g') });

    const kcal = kcalBase + (i % 3) * 40;
    const tempo = tempoBase + (i % 4) * 5;

    out.push(
      withDefaults({
        nome,
        tipoPasto,
        cucina: bank.id,
        tagDietetico: protein.tag,
        tempoMinuti: tempo,
        kcal,
        lattosio: !!protein.lattosio,
        glutine: !!base.glutine,
        crostacei: !!protein.crostacei,
        fruttaAGuscio: !!nutIngredient,
        alcol: !!style.alcol,
        ingredienti,
      })
    );
  }
  return out;
}

function comboBreakfastName(protein: Bilingual, style: CuisineBank['styles'][number], base: Bilingual): Bilingual {
  const it = `${protein.it} ${style.label.it} con ${base.it.toLowerCase()}`;
  const en = style.enPrefix
    ? `${style.label.en} ${protein.en.toLowerCase()} with ${base.en.toLowerCase()}`
    : `${protein.en} ${style.label.en} with ${base.en.toLowerCase()}`;
  return bi(capitalize(it), capitalize(en));
}

// Colazioni generate a partire dalla banca ingredienti: usate per integrare le
// colazioni scritte a mano (cucine esistenti) e per coprire le nuove cucine.
function comboBreakfast(bank: CuisineBank, count: number): Recipe[] {
  const out: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const protein = bank.proteins[(i + 1) % bank.proteins.length];
    const base = bank.bases[i % bank.bases.length];
    const style = bank.styles[(i + 2) % bank.styles.length];
    const nome = comboBreakfastName(protein.nome, style, base.nome);
    out.push(
      withDefaults({
        nome,
        tipoPasto: 'colazione',
        cucina: bank.id,
        tagDietetico: protein.tag,
        tempoMinuti: 8 + (i % 3) * 4,
        kcal: 300 + (i % 3) * 30,
        lattosio: !!protein.lattosio,
        glutine: !!base.glutine,
        crostacei: !!protein.crostacei,
        alcol: false,
        ingredienti: [
          { nome: protein.nome, quantita: bi('100 g', '100 g') },
          { nome: base.nome, quantita: bi('60 g', '60 g') },
        ],
      })
    );
  }
  return out;
}

function comboSnack(bank: CuisineBank, count: number): Recipe[] {
  const out: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const protein = bank.proteins[(i + 2) % bank.proteins.length];
    const veggie = bank.veggies[i % bank.veggies.length];
    const style = bank.styles[(i + 1) % bank.styles.length];
    const nome = comboSnackName(protein.nome, style, veggie);
    out.push(
      withDefaults({
        nome,
        tipoPasto: 'spuntino',
        cucina: bank.id,
        tagDietetico: protein.tag,
        tempoMinuti: 8 + (i % 3) * 3,
        kcal: 140 + (i % 3) * 30,
        lattosio: !!protein.lattosio,
        crostacei: !!protein.crostacei,
        alcol: !!style.alcol,
        ingredienti: [
          { nome: protein.nome, quantita: bi('80 g', '80 g') },
          { nome: veggie, quantita: bi('60 g', '60 g') },
        ],
      })
    );
  }
  return out;
}

const HANDWRITTEN_BREAKFAST_CUISINES = new Set(BREAKFASTS.map((r) => r.cucina));

function generateAllRecipes(): Recipe[] {
  const all: Recipe[] = [...BREAKFASTS];
  for (const bank of CUISINE_BANKS) {
    // Le cucine con colazioni scritte a mano ricevono 3 colazioni extra generate
    // per aumentare la varieta'; le nuove cucine (senza colazioni scritte a mano)
    // ne ricevono 4 per coprire comunque il pasto.
    all.push(...comboBreakfast(bank, HANDWRITTEN_BREAKFAST_CUISINES.has(bank.id) ? 3 : 4));
    all.push(...comboMain(bank, 'pranzo', 7, 480, 20));
    all.push(...comboMain(bank, 'cena', 7, 420, 25));
    all.push(...comboSnack(bank, 6));
  }
  return all;
}

export const RECIPES: Recipe[] = generateAllRecipes();
