import { CUISINE_BANKS, CuisineBank } from './recipeBank';
import { Recipe, Ingredient, DietTag, MealType } from './types';

let counter = 0;
function nextId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

function genericSteps(nome: string, tecnica: string): { sintetici: string[]; dettagliati: string[] } {
  return {
    sintetici: [
      'Prepara e taglia gli ingredienti principali.',
      `Cuoci ${tecnica} fino a cottura completa.`,
      'Componi il piatto e servi caldo.',
    ],
    dettagliati: [
      'Lava, monda e taglia a pezzi regolari tutti gli ingredienti freschi previsti dalla ricetta.',
      `Scalda una padella o il forno e cuoci l'ingrediente principale ${tecnica}, girando a metà cottura per una doratura uniforme.`,
      'Nel frattempo prepara la base di accompagnamento seguendo i tempi di cottura indicati sulla confezione.',
      "Unisci le verdure a metà cottura, regola di sale, pepe e olio extravergine d'oliva.",
      `Impiatta ${nome.toLowerCase()} disponendo la base sul fondo e l'ingrediente principale sopra, decorando con le verdure.`,
      'Servi subito, aggiungendo eventuali salse o guarnizioni suggerite a piacere.',
    ],
  };
}

function withDefaults(r: Partial<Recipe> & Pick<Recipe, 'nome' | 'tipoPasto' | 'cucina' | 'tagDietetico' | 'tempoMinuti' | 'kcal' | 'ingredienti'>): Recipe {
  const { sintetici, dettagliati } = genericSteps(r.nome, 'in padella a fuoco medio');
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

// ---------------------------------------------------------------------------
// Colazioni: variegate per ciascuna cucina, scritte a mano (non combinatorie).
// ---------------------------------------------------------------------------
const BREAKFASTS: Recipe[] = [
  // Mediterranea
  withDefaults({
    nome: 'Yogurt greco con miele e noci',
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 320, lattosio: true, fruttaAGuscio: true,
    ingredienti: [{ nome: 'Yogurt greco', quantita: '250 g' }, { nome: 'Miele', quantita: '1 cucchiaio' }, { nome: 'Noci', quantita: '20 g' }, { nome: 'Frutti di bosco', quantita: '50 g' }],
  }),
  withDefaults({
    nome: 'Uova strapazzate con pomodorini e feta',
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 380, lattosio: true, glutine: false,
    ingredienti: [{ nome: 'Uova', quantita: '3' }, { nome: 'Pomodorini', quantita: '80 g' }, { nome: 'Feta', quantita: '40 g' }, { nome: 'Olio extravergine d\'oliva', quantita: '1 cucchiaio' }],
  }),
  withDefaults({
    nome: 'Pane integrale con hummus di ceci e cetriolo',
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegano',
    tempoMinuti: 8, kcal: 300, glutine: true,
    ingredienti: [{ nome: 'Pane integrale', quantita: '2 fette' }, { nome: 'Hummus di ceci', quantita: '60 g' }, { nome: 'Cetriolo', quantita: '50 g' }],
  }),
  withDefaults({
    nome: 'Porridge di farro con fichi e mandorle',
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Vegano',
    tempoMinuti: 15, kcal: 340, glutine: true, fruttaAGuscio: true,
    ingredienti: [{ nome: 'Farro perlato', quantita: '50 g' }, { nome: 'Bevanda di mandorla', quantita: '200 ml' }, { nome: 'Fichi', quantita: '2' }, { nome: 'Mandorle a lamelle', quantita: '15 g' }],
  }),
  withDefaults({
    nome: 'Frittatina alle erbe con salmone affumicato',
    tipoPasto: 'colazione', cucina: 'mediterranea', tagDietetico: 'Pesce',
    tempoMinuti: 10, kcal: 360,
    ingredienti: [{ nome: 'Uova', quantita: '2' }, { nome: 'Salmone affumicato', quantita: '60 g' }, { nome: 'Erba cipollina', quantita: 'q.b.' }],
  }),
  // Giapponese
  withDefaults({
    nome: 'Tamagoyaki con riso e alga nori',
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 340,
    ingredienti: [{ nome: 'Uova', quantita: '3' }, { nome: 'Riso', quantita: '100 g' }, { nome: 'Alga nori', quantita: '1 foglio' }, { nome: 'Salsa di soia', quantita: '1 cucchiaino' }],
  }),
  withDefaults({
    nome: 'Zuppa di miso con tofu ed edamame',
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 220,
    ingredienti: [{ nome: 'Pasta di miso', quantita: '1 cucchiaio' }, { nome: 'Tofu', quantita: '80 g' }, { nome: 'Edamame', quantita: '40 g' }, { nome: 'Cipollotto', quantita: '1' }],
  }),
  withDefaults({
    nome: 'Onigiri al salmone grigliato',
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Pesce',
    tempoMinuti: 15, kcal: 310,
    ingredienti: [{ nome: 'Riso per sushi', quantita: '120 g' }, { nome: 'Salmone', quantita: '60 g' }, { nome: 'Alga nori', quantita: '1 foglio' }],
  }),
  withDefaults({
    nome: 'Yogurt di soia con sesamo tostato e pera',
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegano',
    tempoMinuti: 5, kcal: 260, fruttaAGuscio: true,
    ingredienti: [{ nome: 'Yogurt di soia', quantita: '200 g' }, { nome: 'Sesamo tostato', quantita: '10 g' }, { nome: 'Pera', quantita: '1' }],
  }),
  withDefaults({
    nome: 'Riso al vapore con uovo marinato in soia',
    tipoPasto: 'colazione', cucina: 'giapponese', tagDietetico: 'Vegetariano',
    tempoMinuti: 18, kcal: 350,
    ingredienti: [{ nome: 'Riso', quantita: '120 g' }, { nome: 'Uova', quantita: '2' }, { nome: 'Salsa di soia', quantita: '2 cucchiai' }, { nome: 'Cipollotto', quantita: '1' }],
  }),
  // Messicana
  withDefaults({
    nome: 'Huevos rancheros con tortilla di mais',
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 380,
    ingredienti: [{ nome: 'Uova', quantita: '2' }, { nome: 'Tortilla di mais', quantita: '2' }, { nome: 'Salsa piccante', quantita: '30 g' }, { nome: 'Fagioli neri', quantita: '60 g' }],
  }),
  withDefaults({
    nome: 'Burrito di fagioli neri e formaggio',
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 400, lattosio: true, glutine: true,
    ingredienti: [{ nome: 'Tortilla di farina', quantita: '1' }, { nome: 'Fagioli neri', quantita: '100 g' }, { nome: 'Formaggio', quantita: '40 g' }, { nome: 'Avocado', quantita: '1/2' }],
  }),
  withDefaults({
    nome: 'Avocado toast con jalapeño e lime',
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegano',
    tempoMinuti: 8, kcal: 310, glutine: true,
    ingredienti: [{ nome: 'Pane tostato', quantita: '2 fette' }, { nome: 'Avocado', quantita: '1' }, { nome: 'Jalapeño', quantita: '1' }, { nome: 'Lime', quantita: '1/2' }],
  }),
  withDefaults({
    nome: 'Chilaquiles verdi con pollo sfilacciato',
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Carne',
    tempoMinuti: 20, kcal: 420,
    ingredienti: [{ nome: 'Nachos', quantita: '80 g' }, { nome: 'Pollo', quantita: '100 g' }, { nome: 'Salsa verde', quantita: '80 g' }, { nome: 'Formaggio', quantita: '30 g' }],
  }),
  withDefaults({
    nome: 'Smoothie tropicale con mais e lime',
    tipoPasto: 'colazione', cucina: 'messicana', tagDietetico: 'Vegano',
    tempoMinuti: 6, kcal: 240,
    ingredienti: [{ nome: 'Ananas', quantita: '100 g' }, { nome: 'Mango', quantita: '80 g' }, { nome: 'Lime', quantita: '1/2' }, { nome: 'Acqua di cocco', quantita: '150 ml' }],
  }),
  // Indiana
  withDefaults({
    nome: 'Chana masala leggero con chapati',
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegano',
    tempoMinuti: 18, kcal: 370, glutine: true,
    ingredienti: [{ nome: 'Ceci', quantita: '120 g' }, { nome: 'Chapati', quantita: '1' }, { nome: 'Pomodoro', quantita: '80 g' }, { nome: 'Spezie miste', quantita: 'q.b.' }],
  }),
  withDefaults({
    nome: 'Paratha ripiena di patate speziate',
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 400, glutine: true,
    ingredienti: [{ nome: 'Chapati', quantita: '2' }, { nome: 'Patate', quantita: '150 g' }, { nome: 'Spezie miste', quantita: 'q.b.' }, { nome: 'Yogurt', quantita: '50 g' }],
  }),
  withDefaults({
    nome: 'Porridge speziato con latte di cocco e anacardi',
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegano',
    tempoMinuti: 12, kcal: 350, fruttaAGuscio: true,
    ingredienti: [{ nome: 'Semolino', quantita: '50 g' }, { nome: 'Latte di cocco', quantita: '150 ml' }, { nome: 'Anacardi', quantita: '20 g' }, { nome: 'Cardamomo', quantita: 'q.b.' }],
  }),
  withDefaults({
    nome: 'Uova al curry con spinaci',
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 14, kcal: 330,
    ingredienti: [{ nome: 'Uova', quantita: '3' }, { nome: 'Spinaci', quantita: '80 g' }, { nome: 'Curry in polvere', quantita: 'q.b.' }, { nome: 'Cipolla', quantita: '1/2' }],
  }),
  withDefaults({
    nome: 'Lassi al mango con cardamomo',
    tipoPasto: 'colazione', cucina: 'indiana', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 250, lattosio: true,
    ingredienti: [{ nome: 'Yogurt', quantita: '200 g' }, { nome: 'Mango', quantita: '100 g' }, { nome: 'Cardamomo', quantita: 'q.b.' }],
  }),
  // Mediorientale
  withDefaults({
    nome: 'Shakshuka con pane pita',
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 380, glutine: true,
    ingredienti: [{ nome: 'Uova', quantita: '2' }, { nome: 'Pomodoro', quantita: '200 g' }, { nome: 'Pane pita', quantita: '1' }, { nome: 'Peperoni', quantita: '50 g' }],
  }),
  withDefaults({
    nome: 'Labneh con olio d\'oliva e za\'atar',
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 5, kcal: 260, lattosio: true,
    ingredienti: [{ nome: 'Labneh', quantita: '150 g' }, { nome: 'Za\'atar', quantita: '1 cucchiaino' }, { nome: 'Olio extravergine d\'oliva', quantita: '1 cucchiaio' }, { nome: 'Pane pita', quantita: '1/2' }],
  }),
  withDefaults({
    nome: 'Foul medames con ceci e limone',
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegano',
    tempoMinuti: 15, kcal: 340,
    ingredienti: [{ nome: 'Fave', quantita: '150 g' }, { nome: 'Ceci', quantita: '60 g' }, { nome: 'Limone', quantita: '1/2' }, { nome: 'Prezzemolo', quantita: 'q.b.' }],
  }),
  withDefaults({
    nome: 'Manakish allo za\'atar',
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegano',
    tempoMinuti: 18, kcal: 360, glutine: true,
    ingredienti: [{ nome: 'Impasto per pane', quantita: '150 g' }, { nome: 'Za\'atar', quantita: '2 cucchiai' }, { nome: 'Olio extravergine d\'oliva', quantita: '2 cucchiai' }],
  }),
  withDefaults({
    nome: 'Frittata di falafel con yogurt e cetriolo',
    tipoPasto: 'colazione', cucina: 'mediorientale', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 370, lattosio: true,
    ingredienti: [{ nome: 'Falafel', quantita: '4' }, { nome: 'Yogurt', quantita: '80 g' }, { nome: 'Cetriolo', quantita: '50 g' }],
  }),
  // Sudamericana
  withDefaults({
    nome: 'Arepas con formaggio filante',
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 18, kcal: 400, lattosio: true,
    ingredienti: [{ nome: 'Farina di mais', quantita: '100 g' }, { nome: 'Formaggio', quantita: '60 g' }, { nome: 'Burro', quantita: '10 g' }],
  }),
  withDefaults({
    nome: 'Pan de yuca con caffè',
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 20, kcal: 320, lattosio: true,
    ingredienti: [{ nome: 'Yuca', quantita: '150 g' }, { nome: 'Formaggio', quantita: '40 g' }, { nome: 'Uova', quantita: '1' }],
  }),
  withDefaults({
    nome: 'Platano fritto con uova e fagioli neri',
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 410,
    ingredienti: [{ nome: 'Platano fritto', quantita: '100 g' }, { nome: 'Uova', quantita: '2' }, { nome: 'Fagioli neri', quantita: '80 g' }],
  }),
  withDefaults({
    nome: 'Ceviche leggero di pesce bianco al lime',
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Pesce',
    tempoMinuti: 20, kcal: 280,
    ingredienti: [{ nome: 'Pesce bianco', quantita: '120 g' }, { nome: 'Lime', quantita: '2' }, { nome: 'Cipolla rossa', quantita: '30 g' }, { nome: 'Coriandolo', quantita: 'q.b.' }],
  }),
  withDefaults({
    nome: 'Frullato di papaya e semi di chia',
    tipoPasto: 'colazione', cucina: 'sudamericana', tagDietetico: 'Vegano',
    tempoMinuti: 6, kcal: 230,
    ingredienti: [{ nome: 'Papaya', quantita: '150 g' }, { nome: 'Semi di chia', quantita: '15 g' }, { nome: 'Acqua di cocco', quantita: '150 ml' }],
  }),
  // Varie
  withDefaults({
    nome: 'Porridge d\'avena con noci e frutti di bosco',
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 340, fruttaAGuscio: true,
    ingredienti: [{ nome: 'Fiocchi d\'avena', quantita: '60 g' }, { nome: 'Bevanda vegetale', quantita: '200 ml' }, { nome: 'Noci', quantita: '20 g' }, { nome: 'Frutti di bosco', quantita: '60 g' }],
  }),
  withDefaults({
    nome: 'Pancake integrali con frutta fresca',
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 15, kcal: 380, glutine: true, lattosio: true,
    ingredienti: [{ nome: 'Farina integrale', quantita: '100 g' }, { nome: 'Uova', quantita: '1' }, { nome: 'Latte', quantita: '150 ml' }, { nome: 'Banana', quantita: '1' }],
  }),
  withDefaults({
    nome: 'Toast con formaggio fresco e pomodoro',
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 8, kcal: 300, glutine: true, lattosio: true,
    ingredienti: [{ nome: 'Pane', quantita: '2 fette' }, { nome: 'Formaggio fresco', quantita: '50 g' }, { nome: 'Pomodoro', quantita: '80 g' }],
  }),
  withDefaults({
    nome: 'Smoothie bowl con quinoa soffiata',
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegano',
    tempoMinuti: 10, kcal: 310,
    ingredienti: [{ nome: 'Frutti di bosco', quantita: '150 g' }, { nome: 'Banana', quantita: '1' }, { nome: 'Quinoa soffiata', quantita: '30 g' }],
  }),
  withDefaults({
    nome: 'Uova sode con avocado e pane tostato',
    tipoPasto: 'colazione', cucina: 'varie', tagDietetico: 'Vegetariano',
    tempoMinuti: 12, kcal: 360, glutine: true,
    ingredienti: [{ nome: 'Uova', quantita: '2' }, { nome: 'Avocado', quantita: '1/2' }, { nome: 'Pane', quantita: '2 fette' }],
  }),
];

// ---------------------------------------------------------------------------
// Pranzo / Cena / Spuntino: generati componendo ingredienti tipici per cucina.
// ---------------------------------------------------------------------------
function comboMain(bank: CuisineBank, tipoPasto: MealType, count: number, kcalBase: number, tempoBase: number): Recipe[] {
  const out: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const protein = bank.proteins[i % bank.proteins.length];
    const base = bank.bases[(i + 1) % bank.bases.length];
    const veggie = bank.veggies[(i + 2) % bank.veggies.length];
    const style = bank.styles[i % bank.styles.length];
    const addNuts = !!bank.fruttaGuscio && i % 3 === 0;
    const nutIngredient = addNuts ? bank.fruttaGuscio![i % bank.fruttaGuscio!.length] : null;

    const nome = `${protein.nome} ${style.label} con ${base.nome.toLowerCase()} e ${veggie.toLowerCase()}`;
    const ingredienti: Ingredient[] = [
      { nome: protein.nome, quantita: '160 g' },
      { nome: base.nome, quantita: '90 g' },
      { nome: veggie, quantita: '100 g' },
      { nome: 'Olio extravergine d\'oliva', quantita: '1 cucchiaio' },
    ];
    if (nutIngredient) ingredienti.push({ nome: nutIngredient, quantita: '15 g' });

    const kcal = kcalBase + (i % 3) * 40;
    const tempo = tempoBase + (i % 4) * 5;

    out.push(
      withDefaults({
        nome: nome.charAt(0).toUpperCase() + nome.slice(1),
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

function comboSnack(bank: CuisineBank, count: number): Recipe[] {
  const out: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const protein = bank.proteins[(i + 2) % bank.proteins.length];
    const veggie = bank.veggies[i % bank.veggies.length];
    const style = bank.styles[(i + 1) % bank.styles.length];
    const nome = `${protein.nome} ${style.label} con ${veggie.toLowerCase()}`;
    out.push(
      withDefaults({
        nome: nome.charAt(0).toUpperCase() + nome.slice(1),
        tipoPasto: 'spuntino',
        cucina: bank.id,
        tagDietetico: protein.tag,
        tempoMinuti: 8 + (i % 3) * 3,
        kcal: 140 + (i % 3) * 30,
        lattosio: !!protein.lattosio,
        crostacei: !!protein.crostacei,
        alcol: !!style.alcol,
        ingredienti: [
          { nome: protein.nome, quantita: '80 g' },
          { nome: veggie, quantita: '60 g' },
        ],
      })
    );
  }
  return out;
}

function generateAllRecipes(): Recipe[] {
  const all: Recipe[] = [...BREAKFASTS];
  for (const bank of CUISINE_BANKS) {
    all.push(...comboMain(bank, 'pranzo', 5, 480, 20));
    all.push(...comboMain(bank, 'cena', 5, 420, 25));
    all.push(...comboSnack(bank, 4));
  }
  return all;
}

export const RECIPES: Recipe[] = generateAllRecipes();
