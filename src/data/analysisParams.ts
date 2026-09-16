import { AnalysisStatus, AnalysisValue } from './types';

type ParamDef = {
  id: string;
  parametro: string;
  unita: string;
  rangeMin: number;
  rangeMax: number;
  notaBasso: string;
  notaAlto: string;
};

// 19 parametri standard sempre visibili, inclusi gli indicatori di benessere metabolico.
export const ANALYSIS_PARAMS: ParamDef[] = [
  { id: 'emoglobina', parametro: 'Emoglobina', unita: 'g/dL', rangeMin: 12, rangeMax: 16, notaBasso: 'Il piano aumenta gli alimenti ricchi di ferro (carne rossa magra, legumi, spinaci).', notaAlto: 'Il piano modera gli alimenti ricchi di ferro e privilegia idratazione.' },
  { id: 'ferritina', parametro: 'Ferritina', unita: 'ng/mL', rangeMin: 20, rangeMax: 200, notaBasso: 'Più ferro con vitamina C nello stesso pasto per favorirne l\'assorbimento.', notaAlto: 'Riduzione temporanea di integratori/alimenti fortificati con ferro.' },
  { id: 'vitamina_d', parametro: 'Vitamina D', unita: 'ng/mL', rangeMin: 30, rangeMax: 100, notaBasso: 'Più pesce grasso, uova e maggiore esposizione solare; valutare integrazione.', notaAlto: 'Nessuna azione dietetica specifica, monitorare integrazione in corso.' },
  { id: 'vitamina_b12', parametro: 'Vitamina B12', unita: 'pg/mL', rangeMin: 200, rangeMax: 900, notaBasso: 'Più uova, pesce e carne magra; attenzione se dieta vegana.', notaAlto: 'Nessuna azione dietetica specifica.' },
  { id: 'glicemia', parametro: 'Glicemia a digiuno', unita: 'mg/dL', rangeMin: 70, rangeMax: 100, notaBasso: 'Pasti più frequenti con carboidrati a basso indice glicemico.', notaAlto: 'Meno zuccheri semplici, più fibre e proteine ad ogni pasto.' },
  { id: 'colesterolo_tot', parametro: 'Colesterolo totale', unita: 'mg/dL', rangeMin: 120, rangeMax: 200, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Meno grassi saturi, più fibre solubili (avena, legumi) e omega-3.' },
  { id: 'colesterolo_ldl', parametro: 'Colesterolo LDL', unita: 'mg/dL', rangeMin: 0, rangeMax: 130, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Riduzione grassi saturi e trans, più fibre e steroli vegetali.' },
  { id: 'colesterolo_hdl', parametro: 'Colesterolo HDL', unita: 'mg/dL', rangeMin: 40, rangeMax: 90, notaBasso: 'Più grassi insaturi (olio d\'oliva, frutta secca) e attività fisica regolare.', notaAlto: 'Nessuna azione dietetica specifica, valore protettivo.' },
  { id: 'trigliceridi', parametro: 'Trigliceridi', unita: 'mg/dL', rangeMin: 0, rangeMax: 150, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Meno zuccheri semplici e alcolici, più omega-3 (pesce azzurro).' },
  { id: 'tsh', parametro: 'TSH', unita: 'µUI/mL', rangeMin: 0.4, rangeMax: 4.0, notaBasso: 'Nessuna azione dietetica specifica, da monitorare con endocrinologo.', notaAlto: 'Attenzione all\'apporto di iodio (pesce, sale iodato) con supervisione medica.' },
  { id: 'creatinina', parametro: 'Creatinina', unita: 'mg/dL', rangeMin: 0.6, rangeMax: 1.3, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Moderazione delle proteine animali e maggiore idratazione.' },
  { id: 'acido_urico', parametro: 'Acido urico', unita: 'mg/dL', rangeMin: 3.5, rangeMax: 7.2, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Meno carni rosse e frattaglie, più idratazione e verdure a foglia verde.' },
  { id: 'hba1c', parametro: 'HbA1c', unita: '%', rangeMin: 4.0, rangeMax: 5.6, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Riduzione carboidrati raffinati, più fibre e distribuzione regolare dei pasti.' },
  { id: 'insulina', parametro: 'Insulina a digiuno', unita: 'µU/mL', rangeMin: 2, rangeMax: 25, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Meno zuccheri semplici, più fibre e proteine per migliorare la sensibilità insulinica.' },
  { id: 'pcr', parametro: 'PCR (proteina C reattiva)', unita: 'mg/L', rangeMin: 0, rangeMax: 5, notaBasso: 'Nessuna azione dietetica specifica.', notaAlto: 'Più alimenti antinfiammatori (omega-3, frutta e verdura), meno cibi ultra-processati.' },
  { id: 'acido_folico', parametro: 'Acido folico', unita: 'ng/mL', rangeMin: 3, rangeMax: 20, notaBasso: 'Più verdure a foglia verde, legumi e cereali integrali.', notaAlto: 'Nessuna azione dietetica specifica.' },
  { id: 'magnesio', parametro: 'Magnesio', unita: 'mg/dL', rangeMin: 1.7, rangeMax: 2.2, notaBasso: 'Più frutta secca, legumi, cereali integrali e verdure a foglia verde.', notaAlto: 'Nessuna azione dietetica specifica.' },
  { id: 'sodio', parametro: 'Sodio', unita: 'mEq/L', rangeMin: 135, rangeMax: 145, notaBasso: 'Maggiore idratazione con soluzioni reidratanti, valutazione medica.', notaAlto: 'Riduzione del sale aggiunto e degli alimenti conservati.' },
  { id: 'potassio', parametro: 'Potassio', unita: 'mEq/L', rangeMin: 3.5, rangeMax: 5.1, notaBasso: 'Più banane, patate, legumi e verdure a foglia verde.', notaAlto: 'Moderazione di frutta secca, legumi e sostituti del sale.' },
];

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

// Simula l'estrazione OCR del referto: alcuni parametri restano da inserire a mano ("manuale").
export function generateMockAnalysis(): AnalysisValue[] {
  return ANALYSIS_PARAMS.map((p, index) => {
    const unextracted = index % 6 === 5;
    if (unextracted) {
      return {
        id: p.id, parametro: p.parametro, unita: p.unita,
        rangeMin: p.rangeMin, rangeMax: p.rangeMax,
        valore: null, stato: 'manuale' as const, nota: '',
      };
    }
    const raw = randomInRange(p.rangeMin, p.rangeMax, true);
    const valore = Math.round(raw * 10) / 10;
    const stato = statusFor(valore, p.rangeMin, p.rangeMax);
    const nota = stato === 'basso' ? p.notaBasso : stato === 'alto' ? p.notaAlto : '';
    return {
      id: p.id,
      parametro: p.parametro,
      unita: p.unita,
      rangeMin: p.rangeMin,
      rangeMax: p.rangeMax,
      valore,
      stato,
      nota,
    };
  });
}

export function noteForValue(id: string, value: number): { stato: AnalysisStatus; nota: string } {
  const p = ANALYSIS_PARAMS.find((x) => x.id === id)!;
  const stato = statusFor(value, p.rangeMin, p.rangeMax);
  const nota = stato === 'basso' ? p.notaBasso : stato === 'alto' ? p.notaAlto : '';
  return { stato, nota };
}
