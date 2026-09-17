import { DietTag, Bilingual, bi } from './types';

export type ProteinDef = {
  nome: Bilingual;
  tag: DietTag;
  lattosio?: boolean;
  crostacei?: boolean;
};

export type BaseDef = { nome: Bilingual; glutine?: boolean };
// enPrefix: true => in English the style reads naturally before the protein
// (es. "Grilled chicken"); false => it reads naturally after, like in Italian
// (es. "Chicken in a salad").
export type StyleDef = { label: Bilingual; enPrefix?: boolean; alcol?: boolean };

export type CuisineBank = {
  id: string;
  nome: string;
  proteins: ProteinDef[];
  bases: BaseDef[];
  veggies: Bilingual[];
  styles: StyleDef[];
  fruttaGuscio?: Bilingual[]; // ingredienti extra con frutta a guscio, aggiunti a rotazione
};

export const CUISINE_BANKS: CuisineBank[] = [
  {
    id: 'mediterranea',
    nome: 'Mediterranea',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Salmone', 'Salmon'), tag: 'Pesce' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Tonno', 'Tuna'), tag: 'Pesce' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Feta', 'Feta'), tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: bi('Cous cous', 'Couscous'), glutine: true },
      { nome: bi('Farro', 'Farro'), glutine: true },
      { nome: bi('Pane integrale', 'Whole wheat bread'), glutine: true },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
    ],
    veggies: [bi('Pomodorini', 'Cherry tomatoes'), bi('Zucchine', 'Zucchini'), bi('Melanzane', 'Eggplant'), bi('Peperoni', 'Bell peppers'), bi('Rucola', 'Arugula')],
    styles: [
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in insalata', 'in a salad') },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('al vino bianco', 'in white wine'), alcol: true },
    ],
    fruttaGuscio: [bi('Mandorle a lamelle', 'Sliced almonds'), bi('Pinoli', 'Pine nuts')],
  },
  {
    id: 'giapponese',
    nome: 'Giapponese',
    proteins: [
      { nome: bi('Salmone', 'Salmon'), tag: 'Pesce' },
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Edamame', 'Edamame'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Soba', 'Soba noodles'), glutine: true },
      { nome: bi('Udon', 'Udon noodles'), glutine: true },
      { nome: bi('Riso per sushi', 'Sushi rice'), glutine: false },
    ],
    veggies: [bi('Alga nori', 'Nori seaweed'), bi('Cavolo', 'Cabbage'), bi('Daikon', 'Daikon radish'), bi('Funghi shiitake', 'Shiitake mushrooms'), bi('Cetriolo', 'Cucumber')],
    styles: [
      { label: bi('in stile teriyaki', 'teriyaki-style'), enPrefix: true },
      { label: bi('in tempura', 'tempura-style'), enPrefix: true },
      { label: bi('al vapore', 'steamed'), enPrefix: true },
      { label: bi('marinato in salsa di soia', 'marinated in soy sauce') },
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
    ],
    fruttaGuscio: [bi('Sesamo tostato', 'Toasted sesame seeds')],
  },
  {
    id: 'messicana',
    nome: 'Messicana',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Formaggio', 'Cheese'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
    ],
    bases: [
      { nome: bi('Tortilla di mais', 'Corn tortilla'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Tortilla di farina', 'Flour tortilla'), glutine: true },
      { nome: bi('Nachos', 'Nachos'), glutine: false },
    ],
    veggies: [bi('Jalapeño', 'Jalapeño'), bi('Avocado', 'Avocado'), bi('Pomodoro', 'Tomato'), bi('Mais', 'Corn'), bi('Cipolla rossa', 'Red onion')],
    styles: [
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('speziato', 'spiced'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('in salsa piccante', 'in spicy sauce') },
    ],
  },
  {
    id: 'indiana',
    nome: 'Indiana',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Lenticchie', 'Lentils'), tag: 'Vegano' },
      { nome: bi('Paneer', 'Paneer'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Agnello', 'Lamb'), tag: 'Carne' },
    ],
    bases: [
      { nome: bi('Riso basmati', 'Basmati rice'), glutine: false },
      { nome: bi('Naan', 'Naan'), glutine: true },
      { nome: bi('Riso pilaf', 'Pilaf rice'), glutine: false },
      { nome: bi('Chapati', 'Chapati'), glutine: true },
    ],
    veggies: [bi('Spinaci', 'Spinach'), bi('Cavolfiore', 'Cauliflower'), bi('Piselli', 'Peas'), bi('Melanzane', 'Eggplant'), bi('Pomodoro', 'Tomato')],
    styles: [
      { label: bi('al curry', 'curry-style'), enPrefix: true },
      { label: bi('speziato', 'spiced'), enPrefix: true },
      { label: bi('in stile tandoori', 'tandoori-style'), enPrefix: true },
      { label: bi('in salsa masala', 'in masala sauce') },
      { label: bi('saltato con spezie', 'spiced stir-fry'), enPrefix: true },
    ],
    fruttaGuscio: [bi('Anacardi', 'Cashews'), bi('Mandorle', 'Almonds')],
  },
  {
    id: 'mediorientale',
    nome: 'Mediorientale',
    proteins: [
      { nome: bi('Agnello', 'Lamb'), tag: 'Carne' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Falafel', 'Falafel'), tag: 'Vegano' },
      { nome: bi('Yogurt', 'Yogurt'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
    ],
    bases: [
      { nome: bi('Cous cous', 'Couscous'), glutine: true },
      { nome: bi('Pane pita', 'Pita bread'), glutine: true },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Bulgur', 'Bulgur'), glutine: true },
    ],
    veggies: [bi('Melanzane', 'Eggplant'), bi('Pomodoro', 'Tomato'), bi('Cetriolo', 'Cucumber'), bi('Prezzemolo', 'Parsley'), bi('Peperoni', 'Bell peppers')],
    styles: [
      { label: bi('speziato', 'spiced'), enPrefix: true },
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in salsa tahini', 'in tahini sauce') },
      { label: bi('marinato allo yogurt', 'marinated in yogurt') },
    ],
    fruttaGuscio: [bi('Pistacchi', 'Pistachios'), bi('Pinoli', 'Pine nuts')],
  },
  {
    id: 'sudamericana',
    nome: 'Sudamericana',
    proteins: [
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
      { nome: bi('Pesce bianco', 'White fish'), tag: 'Pesce' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Formaggio', 'Cheese'), tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Yuca', 'Cassava'), glutine: false },
      { nome: bi('Platano fritto', 'Fried plantain'), glutine: false },
      { nome: bi('Polenta', 'Polenta'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
    ],
    veggies: [bi('Mais', 'Corn'), bi('Peperoni', 'Bell peppers'), bi('Pomodoro', 'Tomato'), bi('Avocado', 'Avocado'), bi('Cipolla', 'Onion')],
    styles: [
      { label: bi('alla griglia (churrasco)', 'churrasco-style grilled'), enPrefix: true },
      { label: bi('speziato', 'spiced'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('al vino rosso', 'in red wine'), alcol: true },
    ],
  },
  {
    id: 'cinese',
    nome: 'Cinese',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Maiale', 'Pork'), tag: 'Carne' },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Noodles di riso', 'Rice noodles'), glutine: false },
      { nome: bi('Spaghetti di soia', 'Soy bean noodles'), glutine: false },
      { nome: bi('Riso al vapore', 'Steamed rice'), glutine: false },
    ],
    veggies: [bi('Cavolo cinese', 'Chinese cabbage'), bi('Germogli di soia', 'Bean sprouts'), bi('Peperoni', 'Bell peppers'), bi('Carote', 'Carrots'), bi('Funghi champignon', 'Button mushrooms')],
    styles: [
      { label: bi('in agrodolce', 'sweet and sour'), enPrefix: true },
      { label: bi('alla soia', 'in soy sauce') },
      { label: bi('saltato al wok', 'wok-fried'), enPrefix: true },
      { label: bi('al vapore', 'steamed'), enPrefix: true },
      { label: bi('con zenzero e aglio', 'with ginger and garlic') },
    ],
    fruttaGuscio: [bi('Anacardi', 'Cashews')],
  },
  {
    id: 'francese',
    nome: 'Francese',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Salmone', 'Salmon'), tag: 'Pesce' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Formaggio di capra', 'Goat cheese'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Funghi', 'Mushrooms'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Baguette', 'Baguette'), glutine: true },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Lenticchie', 'Lentils'), glutine: false },
    ],
    veggies: [bi('Porri', 'Leeks'), bi('Carote', 'Carrots'), bi('Funghi champignon', 'Button mushrooms'), bi('Spinaci', 'Spinach'), bi('Cipolla', 'Onion')],
    styles: [
      { label: bi('al vino rosso', 'in red wine'), alcol: true },
      { label: bi('gratinato al forno', 'oven-gratinated'), enPrefix: true },
      { label: bi('in salsa di funghi', 'in mushroom sauce') },
      { label: bi('saltato al burro', 'sauteed in butter'), enPrefix: true },
      { label: bi('alla provenzale', 'Provencal-style'), enPrefix: true },
    ],
  },
  {
    id: 'spagnola',
    nome: 'Spagnola',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Chorizo', 'Chorizo'), tag: 'Carne' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Merluzzo', 'Cod'), tag: 'Pesce' },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Pane', 'Bread'), glutine: true },
      { nome: bi('Fagioli bianchi', 'White beans'), glutine: false },
    ],
    veggies: [bi('Peperoni', 'Bell peppers'), bi('Pomodoro', 'Tomato'), bi('Piselli', 'Peas'), bi('Cipolla', 'Onion'), bi('Zucchine', 'Zucchini')],
    styles: [
      { label: bi('in stile paella', 'paella-style'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in salsa di pomodoro', 'in tomato sauce') },
      { label: bi('alla plancha', 'griddle-grilled'), enPrefix: true },
      { label: bi('al vino bianco', 'in white wine'), alcol: true },
    ],
  },
  {
    id: 'greca',
    nome: 'Greca',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Agnello', 'Lamb'), tag: 'Carne' },
      { nome: bi('Feta', 'Feta'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
    ],
    bases: [
      { nome: bi('Pane pita', 'Pita bread'), glutine: true },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Cous cous', 'Couscous'), glutine: true },
    ],
    veggies: [bi('Pomodoro', 'Tomato'), bi('Cetriolo', 'Cucumber'), bi('Melanzane', 'Eggplant'), bi('Peperoni', 'Bell peppers'), bi('Cipolla rossa', 'Red onion')],
    styles: [
      { label: bi('alla griglia (souvlaki)', 'souvlaki-style grilled'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in salsa tzatziki', 'in tzatziki sauce') },
      { label: bi('marinato al limone', 'lemon-marinated') },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
    ],
  },
  {
    id: 'thailandese',
    nome: 'Thailandese',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Pesce bianco', 'White fish'), tag: 'Pesce' },
    ],
    bases: [
      { nome: bi('Riso al gelsomino', 'Jasmine rice'), glutine: false },
      { nome: bi('Noodles di riso', 'Rice noodles'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Noodles di uovo', 'Egg noodles'), glutine: true },
    ],
    veggies: [bi('Peperoni', 'Bell peppers'), bi('Carote', 'Carrots'), bi('Germogli di soia', 'Bean sprouts'), bi('Basilico thai', 'Thai basil'), bi('Cavolo', 'Cabbage')],
    styles: [
      { label: bi('al curry verde', 'green curry-style'), enPrefix: true },
      { label: bi('al curry rosso', 'red curry-style'), enPrefix: true },
      { label: bi('saltato al wok', 'wok-fried'), enPrefix: true },
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('in salsa di lime e peperoncino', 'in lime and chili sauce') },
    ],
    fruttaGuscio: [bi('Arachidi tritate', 'Crushed peanuts')],
  },
  {
    id: 'statunitense',
    nome: 'Statunitense',
    proteins: [
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Tacchino', 'Turkey'), tag: 'Carne' },
      { nome: bi('Formaggio', 'Cheese'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Pane per burger', 'Burger bun'), glutine: true },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Tortilla di mais', 'Corn tortilla'), glutine: false },
    ],
    veggies: [bi('Lattuga', 'Lettuce'), bi('Pomodoro', 'Tomato'), bi('Cipolla', 'Onion'), bi('Mais', 'Corn'), bi('Peperoni', 'Bell peppers')],
    styles: [
      { label: bi('alla griglia stile BBQ', 'BBQ-style grilled'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in stile burger', 'burger-style'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('affumicato', 'smoked'), enPrefix: true },
    ],
  },
  {
    id: 'peruviana',
    nome: 'Peruviana',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Pesce bianco', 'White fish'), tag: 'Pesce' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Quinoa', 'Quinoa'), glutine: false },
      { nome: bi('Mais', 'Corn'), glutine: false },
    ],
    veggies: [bi('Cipolla rossa', 'Red onion'), bi('Peperoncino', 'Aji chili'), bi('Coriandolo', 'Cilantro'), bi('Pomodoro', 'Tomato'), bi('Avocado', 'Avocado')],
    styles: [
      { label: bi('alla griglia (anticuchos)', 'anticuchos-style grilled'), enPrefix: true },
      { label: bi('al lime (ceviche)', 'ceviche-style with lime'), enPrefix: true },
      { label: bi('saltato al wok (lomo saltado)', 'lomo saltado-style stir-fry'), enPrefix: true },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('in salsa di aji', 'in aji sauce') },
    ],
  },
  {
    id: 'turca',
    nome: 'Turca',
    proteins: [
      { nome: bi('Agnello', 'Lamb'), tag: 'Carne' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Yogurt', 'Yogurt'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Melanzane', 'Eggplant'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Pane pita', 'Pita bread'), glutine: true },
      { nome: bi('Riso pilaf', 'Pilaf rice'), glutine: false },
      { nome: bi('Bulgur', 'Bulgur'), glutine: true },
      { nome: bi('Cous cous', 'Couscous'), glutine: true },
    ],
    veggies: [bi('Melanzane', 'Eggplant'), bi('Pomodoro', 'Tomato'), bi('Peperoni', 'Bell peppers'), bi('Cipolla', 'Onion'), bi('Prezzemolo', 'Parsley')],
    styles: [
      { label: bi('alla griglia (kebab)', 'kebab-style grilled'), enPrefix: true },
      { label: bi('allo spiedo', 'spit-roasted'), enPrefix: true },
      { label: bi('in salsa di yogurt', 'in yogurt sauce') },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
    ],
  },
  {
    id: 'libanese',
    nome: 'Libanese',
    proteins: [
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Agnello', 'Lamb'), tag: 'Carne' },
      { nome: bi('Yogurt', 'Yogurt'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Melanzane', 'Eggplant'), tag: 'Vegano' },
      { nome: bi('Fave', 'Fava beans'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Pane pita', 'Pita bread'), glutine: true },
      { nome: bi('Bulgur', 'Bulgur'), glutine: true },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Cous cous', 'Couscous'), glutine: true },
    ],
    veggies: [bi('Prezzemolo', 'Parsley'), bi('Pomodoro', 'Tomato'), bi('Cetriolo', 'Cucumber'), bi('Melanzane', 'Eggplant'), bi('Cipolla', 'Onion')],
    styles: [
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('in salsa tahini', 'in tahini sauce') },
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('marinato allo yogurt', 'marinated in yogurt') },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
    ],
    fruttaGuscio: [bi('Pinoli', 'Pine nuts')],
  },
  {
    id: 'coreana',
    nome: 'Coreana',
    proteins: [
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Maiale', 'Pork'), tag: 'Carne' },
    ],
    bases: [
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Riso al vapore', 'Steamed rice'), glutine: false },
      { nome: bi('Noodles di grano saraceno', 'Buckwheat noodles'), glutine: true },
      { nome: bi('Riso saltato', 'Fried rice'), glutine: false },
    ],
    veggies: [bi('Cavolo', 'Cabbage'), bi('Germogli di soia', 'Bean sprouts'), bi('Carote', 'Carrots'), bi('Spinaci', 'Spinach'), bi('Cetriolo', 'Cucumber')],
    styles: [
      { label: bi('alla griglia (bulgogi)', 'bulgogi-style grilled'), enPrefix: true },
      { label: bi('piccante (gochujang)', 'gochujang spicy-style'), enPrefix: true },
      { label: bi('al vapore', 'steamed'), enPrefix: true },
      { label: bi('saltato al wok', 'wok-fried'), enPrefix: true },
      { label: bi('marinato in salsa di soia', 'marinated in soy sauce') },
    ],
    fruttaGuscio: [bi('Sesamo tostato', 'Toasted sesame seeds')],
  },
  {
    id: 'texmex',
    nome: 'Tex-Mex',
    proteins: [
      { nome: bi('Manzo', 'Beef'), tag: 'Carne' },
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
      { nome: bi('Formaggio', 'Cheese'), tag: 'Vegetariano', lattosio: true },
      { nome: bi('Gamberi', 'Shrimp'), tag: 'Pesce', crostacei: true },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
    ],
    bases: [
      { nome: bi('Tortilla di mais', 'Corn tortilla'), glutine: false },
      { nome: bi('Tortilla di farina', 'Flour tortilla'), glutine: true },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Nachos', 'Nachos'), glutine: false },
    ],
    veggies: [bi('Peperoni', 'Bell peppers'), bi('Cipolla', 'Onion'), bi('Mais', 'Corn'), bi('Pomodoro', 'Tomato'), bi('Avocado', 'Avocado')],
    styles: [
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('speziato (chili)', 'chili-spiced'), enPrefix: true },
      { label: bi('gratinato al forno', 'oven-gratinated'), enPrefix: true },
      { label: bi('in salsa piccante', 'in spicy sauce') },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
    ],
  },
  {
    id: 'vegana',
    nome: 'Vegana',
    proteins: [
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Tempeh', 'Tempeh'), tag: 'Vegano' },
      { nome: bi('Ceci', 'Chickpeas'), tag: 'Vegano' },
      { nome: bi('Lenticchie', 'Lentils'), tag: 'Vegano' },
      { nome: bi('Seitan', 'Seitan'), tag: 'Vegano' },
      { nome: bi('Fagioli neri', 'Black beans'), tag: 'Vegano' },
    ],
    bases: [
      { nome: bi('Quinoa', 'Quinoa'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Pasta integrale', 'Whole wheat pasta'), glutine: true },
    ],
    veggies: [bi('Broccoli', 'Broccoli'), bi('Zucchine', 'Zucchini'), bi('Carote', 'Carrots'), bi('Spinaci', 'Spinach'), bi('Cavolo', 'Cabbage')],
    styles: [
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('in insalata', 'in a salad') },
      { label: bi('in zuppa', 'in soup') },
    ],
    fruttaGuscio: [bi('Noci', 'Walnuts'), bi('Semi di girasole', 'Sunflower seeds')],
  },
  {
    id: 'varie',
    nome: 'Varie',
    proteins: [
      { nome: bi('Pollo', 'Chicken'), tag: 'Carne' },
      { nome: bi('Tofu', 'Tofu'), tag: 'Vegano' },
      { nome: bi('Uova', 'Eggs'), tag: 'Vegetariano' },
      { nome: bi('Tacchino', 'Turkey'), tag: 'Carne' },
      { nome: bi('Legumi misti', 'Mixed legumes'), tag: 'Vegano' },
      { nome: bi('Formaggio', 'Cheese'), tag: 'Vegetariano', lattosio: true },
    ],
    bases: [
      { nome: bi('Quinoa', 'Quinoa'), glutine: false },
      { nome: bi('Riso', 'Rice'), glutine: false },
      { nome: bi('Pasta integrale', 'Whole wheat pasta'), glutine: true },
      { nome: bi('Patate', 'Potatoes'), glutine: false },
      { nome: bi('Pane', 'Bread'), glutine: true },
    ],
    veggies: [bi('Broccoli', 'Broccoli'), bi('Carote', 'Carrots'), bi('Spinaci', 'Spinach'), bi('Zucchine', 'Zucchini'), bi('Insalata mista', 'Mixed salad')],
    styles: [
      { label: bi('al forno', 'oven-baked'), enPrefix: true },
      { label: bi('saltato in padella', 'pan-fried'), enPrefix: true },
      { label: bi('alla griglia', 'grilled'), enPrefix: true },
      { label: bi('in insalata', 'in a salad') },
      { label: bi('in zuppa', 'in soup') },
    ],
    fruttaGuscio: [bi('Noci', 'Walnuts'), bi('Mandorle', 'Almonds')],
  },
];

export function cuisineBank(id: string): CuisineBank {
  const bank = CUISINE_BANKS.find((c) => c.id === id);
  if (!bank) throw new Error(`Cucina sconosciuta: ${id}`);
  return bank;
}
