import { AnalysisStatus, AnalysisValue, AnalysisHistoryPoint, Bilingual, bi } from './types';
import { toDateKey } from './mealPlan';

type ParamDef = {
  id: string;
  parametro: Bilingual;
  unita: string;
  rangeMin: number;
  rangeMax: number;
  notaBasso: Bilingual;
  notaAlto: Bilingual;
};

const NO_ACTION = bi('Nessuna azione dietetica specifica.', 'No specific dietary action.');

// 19 parametri standard sempre visibili, inclusi gli indicatori di benessere metabolico.
export const ANALYSIS_PARAMS: ParamDef[] = [
  {
    id: 'emoglobina', parametro: bi('Emoglobina', 'Hemoglobin'), unita: 'g/dL', rangeMin: 12, rangeMax: 16,
    notaBasso: bi('Il piano aumenta gli alimenti ricchi di ferro (carne rossa magra, legumi, spinaci).', 'The plan increases iron-rich foods (lean red meat, legumes, spinach).'),
    notaAlto: bi('Il piano modera gli alimenti ricchi di ferro e privilegia idratazione.', 'The plan moderates iron-rich foods and favors hydration.'),
  },
  {
    id: 'ferritina', parametro: bi('Ferritina', 'Ferritin'), unita: 'ng/mL', rangeMin: 20, rangeMax: 200,
    notaBasso: bi("Più ferro con vitamina C nello stesso pasto per favorirne l'assorbimento.", 'More iron paired with vitamin C in the same meal to boost absorption.'),
    notaAlto: bi('Riduzione temporanea di integratori/alimenti fortificati con ferro.', 'Temporary reduction of iron-fortified supplements/foods.'),
  },
  {
    id: 'vitamina_d', parametro: bi('Vitamina D', 'Vitamin D'), unita: 'ng/mL', rangeMin: 30, rangeMax: 100,
    notaBasso: bi('Più pesce grasso, uova e maggiore esposizione solare; valutare integrazione.', 'More fatty fish, eggs and sun exposure; consider supplementation.'),
    notaAlto: bi('Nessuna azione dietetica specifica, monitorare integrazione in corso.', 'No specific dietary action, monitor ongoing supplementation.'),
  },
  {
    id: 'vitamina_b12', parametro: bi('Vitamina B12', 'Vitamin B12'), unita: 'pg/mL', rangeMin: 200, rangeMax: 900,
    notaBasso: bi('Più uova, pesce e carne magra; attenzione se dieta vegana.', 'More eggs, fish and lean meat; pay attention if following a vegan diet.'),
    notaAlto: NO_ACTION,
  },
  {
    id: 'glicemia', parametro: bi('Glicemia a digiuno', 'Fasting blood glucose'), unita: 'mg/dL', rangeMin: 70, rangeMax: 100,
    notaBasso: bi('Pasti più frequenti con carboidrati a basso indice glicemico.', 'More frequent meals with low glycemic index carbohydrates.'),
    notaAlto: bi('Meno zuccheri semplici, più fibre e proteine ad ogni pasto.', 'Fewer simple sugars, more fiber and protein at every meal.'),
  },
  {
    id: 'colesterolo_tot', parametro: bi('Colesterolo totale', 'Total cholesterol'), unita: 'mg/dL', rangeMin: 120, rangeMax: 200,
    notaBasso: NO_ACTION,
    notaAlto: bi('Meno grassi saturi, più fibre solubili (avena, legumi) e omega-3.', 'Less saturated fat, more soluble fiber (oats, legumes) and omega-3.'),
  },
  {
    id: 'colesterolo_ldl', parametro: bi('Colesterolo LDL', 'LDL cholesterol'), unita: 'mg/dL', rangeMin: 0, rangeMax: 130,
    notaBasso: NO_ACTION,
    notaAlto: bi('Riduzione grassi saturi e trans, più fibre e steroli vegetali.', 'Reduce saturated and trans fats, more fiber and plant sterols.'),
  },
  {
    id: 'colesterolo_hdl', parametro: bi('Colesterolo HDL', 'HDL cholesterol'), unita: 'mg/dL', rangeMin: 40, rangeMax: 90,
    notaBasso: bi("Più grassi insaturi (olio d'oliva, frutta secca) e attività fisica regolare.", 'More unsaturated fats (olive oil, nuts) and regular physical activity.'),
    notaAlto: bi('Nessuna azione dietetica specifica, valore protettivo.', 'No specific dietary action, this is a protective value.'),
  },
  {
    id: 'trigliceridi', parametro: bi('Trigliceridi', 'Triglycerides'), unita: 'mg/dL', rangeMin: 0, rangeMax: 150,
    notaBasso: NO_ACTION,
    notaAlto: bi('Meno zuccheri semplici e alcolici, più omega-3 (pesce azzurro).', 'Fewer simple sugars and alcohol, more omega-3 (oily fish).'),
  },
  {
    id: 'tsh', parametro: bi('TSH', 'TSH'), unita: 'µUI/mL', rangeMin: 0.4, rangeMax: 4.0,
    notaBasso: bi('Nessuna azione dietetica specifica, da monitorare con endocrinologo.', 'No specific dietary action, to be monitored with an endocrinologist.'),
    notaAlto: bi("Attenzione all'apporto di iodio (pesce, sale iodato) con supervisione medica.", 'Pay attention to iodine intake (fish, iodized salt) under medical supervision.'),
  },
  {
    id: 'creatinina', parametro: bi('Creatinina', 'Creatinine'), unita: 'mg/dL', rangeMin: 0.6, rangeMax: 1.3,
    notaBasso: NO_ACTION,
    notaAlto: bi('Moderazione delle proteine animali e maggiore idratazione.', 'Moderate animal protein and increase hydration.'),
  },
  {
    id: 'acido_urico', parametro: bi('Acido urico', 'Uric acid'), unita: 'mg/dL', rangeMin: 3.5, rangeMax: 7.2,
    notaBasso: NO_ACTION,
    notaAlto: bi('Meno carni rosse e frattaglie, più idratazione e verdure a foglia verde.', 'Less red meat and organ meats, more hydration and leafy greens.'),
  },
  {
    id: 'hba1c', parametro: bi('HbA1c', 'HbA1c'), unita: '%', rangeMin: 4.0, rangeMax: 5.6,
    notaBasso: NO_ACTION,
    notaAlto: bi('Riduzione carboidrati raffinati, più fibre e distribuzione regolare dei pasti.', 'Reduce refined carbohydrates, more fiber and regular meal timing.'),
  },
  {
    id: 'insulina', parametro: bi('Insulina a digiuno', 'Fasting insulin'), unita: 'µU/mL', rangeMin: 2, rangeMax: 25,
    notaBasso: NO_ACTION,
    notaAlto: bi('Meno zuccheri semplici, più fibre e proteine per migliorare la sensibilità insulinica.', 'Fewer simple sugars, more fiber and protein to improve insulin sensitivity.'),
  },
  {
    id: 'pcr', parametro: bi('PCR (proteina C reattiva)', 'CRP (C-reactive protein)'), unita: 'mg/L', rangeMin: 0, rangeMax: 5,
    notaBasso: NO_ACTION,
    notaAlto: bi('Più alimenti antinfiammatori (omega-3, frutta e verdura), meno cibi ultra-processati.', 'More anti-inflammatory foods (omega-3, fruit and vegetables), fewer ultra-processed foods.'),
  },
  {
    id: 'acido_folico', parametro: bi('Acido folico', 'Folic acid'), unita: 'ng/mL', rangeMin: 3, rangeMax: 20,
    notaBasso: bi('Più verdure a foglia verde, legumi e cereali integrali.', 'More leafy greens, legumes and whole grains.'),
    notaAlto: NO_ACTION,
  },
  {
    id: 'magnesio', parametro: bi('Magnesio', 'Magnesium'), unita: 'mg/dL', rangeMin: 1.7, rangeMax: 2.2,
    notaBasso: bi('Più frutta secca, legumi, cereali integrali e verdure a foglia verde.', 'More nuts, legumes, whole grains and leafy greens.'),
    notaAlto: NO_ACTION,
  },
  {
    id: 'sodio', parametro: bi('Sodio', 'Sodium'), unita: 'mEq/L', rangeMin: 135, rangeMax: 145,
    notaBasso: bi('Maggiore idratazione con soluzioni reidratanti, valutazione medica.', 'Increase hydration with rehydration solutions, seek medical evaluation.'),
    notaAlto: bi('Riduzione del sale aggiunto e degli alimenti conservati.', 'Reduce added salt and preserved foods.'),
  },
  {
    id: 'potassio', parametro: bi('Potassio', 'Potassium'), unita: 'mEq/L', rangeMin: 3.5, rangeMax: 5.1,
    notaBasso: bi('Più banane, patate, legumi e verdure a foglia verde.', 'More bananas, potatoes, legumes and leafy greens.'),
    notaAlto: bi('Moderazione di frutta secca, legumi e sostituti del sale.', 'Moderate nuts, legumes and salt substitutes.'),
  },
];

const NO_NOTE: Bilingual = bi('', '');

function randomInRange(min: number, max: number, biasOutside = false) {
  if (biasOutside && Math.random() < 0.3) {
    const goLow = Math.random() < 0.5;
    return goLow ? min - (max - min) * 0.15 : max + (max - min) * 0.15;
  }
  const margin = (max - min) * 0.2;
  return min + margin + Math.random() * (max - min - margin);
}

function statusFor(value: number, min: number, max: number): AnalysisStatus {
  if (value < min) return 'basso';
  if (value > max) return 'alto';
  return 'normale';
}

function dateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toDateKey(d);
}

// Genera 4 letture passate (150/110/70/35 giorni fa) che convergono verso il
// valore corrente, per dare al grafico di andamento uno storico plausibile.
function seedHistory(min: number, max: number, current: number): AnalysisHistoryPoint[] {
  const offsets = [150, 110, 70, 35];
  const start = randomInRange(min, max, false);
  return offsets.map((daysAgo, idx) => {
    const progress = (idx + 1) / (offsets.length + 1);
    const base = start + (current - start) * progress;
    const noise = (max - min) * 0.05 * (Math.random() - 0.5);
    const valore = Math.round((base + noise) * 10) / 10;
    return { data: dateDaysAgo(daysAgo), valore };
  });
}

// Simula l'estrazione OCR del referto: alcuni parametri restano da inserire a mano ("manuale").
export function generateMockAnalysis(): AnalysisValue[] {
  return ANALYSIS_PARAMS.map((p, index) => {
    const unextracted = index % 6 === 5;
    if (unextracted) {
      return {
        id: p.id, parametro: p.parametro, unita: p.unita,
        rangeMin: p.rangeMin, rangeMax: p.rangeMax,
        valore: null, stato: 'manuale' as const, nota: NO_NOTE,
        entryDate: null, history: [],
      };
    }
    const raw = randomInRange(p.rangeMin, p.rangeMax, true);
    const valore = Math.round(raw * 10) / 10;
    const stato = statusFor(valore, p.rangeMin, p.rangeMax);
    const nota = stato === 'basso' ? p.notaBasso : stato === 'alto' ? p.notaAlto : NO_NOTE;
    return {
      id: p.id,
      parametro: p.parametro,
      unita: p.unita,
      rangeMin: p.rangeMin,
      rangeMax: p.rangeMax,
      valore,
      stato,
      nota,
      entryDate: dateDaysAgo(3),
      history: seedHistory(p.rangeMin, p.rangeMax, valore),
    };
  });
}

export function noteForValue(id: string, value: number): { stato: AnalysisStatus; nota: Bilingual } {
  const p = ANALYSIS_PARAMS.find((x) => x.id === id)!;
  const stato = statusFor(value, p.rangeMin, p.rangeMax);
  const nota = stato === 'basso' ? p.notaBasso : stato === 'alto' ? p.notaAlto : NO_NOTE;
  return { stato, nota };
}
