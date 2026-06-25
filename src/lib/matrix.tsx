export type RiskLevel = "Bajo" | "Medio" | "Alto" | "Crítico";

export interface MatrixItem {
  id: number;
  title: string;
  description: string;
  weight: number; // default weight, in % (sum of defaults = 100)
}

export interface TenderRecord {
  id: string;
  name: string;
  entity: string;
  amount: string;
  deadline: string;
  fileName: string | null;
  scores: Record<number, number>;
  weights: Record<number, number>;
  itemNotes: Record<number, string>;
  total: number;
  average: number;
  weighted: number; // 0-100
  riskLevel: RiskLevel;
  recommendation: "GO" | "NO GO" | "REVISIÓN";
  notes: string;
  createdAt: string;
}

export const MATRIX_ITEMS: MatrixItem[] = [
  { id: 1,  title: "Información General del Proceso", description: "Entidad, objeto, presupuesto, modalidad, plazos y datos clave del proceso.", weight: 3 },
  { id: 2,  title: "Compatibilidad Empresarial", description: "Alineación del objeto con la actividad económica, CIIU y portafolio de la empresa.", weight: 7 },
  { id: 3,  title: "Experiencia Requerida", description: "Cumplimiento de experiencia general y específica acreditable exigida en el pliego.", weight: 12 },
  { id: 4,  title: "Capacidad Financiera", description: "Indicadores financieros (liquidez, endeudamiento, capital de trabajo, patrimonio) vs. exigidos.", weight: 10 },
  { id: 5,  title: "Capacidad Organizacional", description: "Indicadores de rentabilidad (ROA, ROE) y capacidad organizacional requerida.", weight: 6 },
  { id: 6,  title: "Personal Mínimo Exigido", description: "Perfiles, dedicación y disponibilidad del personal clave solicitado.", weight: 7 },
  { id: 7,  title: "Certificaciones y Habilitantes", description: "RUP, ISO, SST, ambientales, RUT y demás documentos habilitantes.", weight: 8 },
  { id: 8,  title: "Riesgo Jurídico y Contractual", description: "Cláusulas, garantías, multas, sanciones y régimen jurídico aplicable.", weight: 10 },
  { id: 9,  title: "Riesgo Territorial y Logístico", description: "Ubicación, accesos, orden público, transporte y logística de ejecución.", weight: 7 },
  { id: 10, title: "Costos, APU y Rentabilidad", description: "Análisis de precios unitarios, estructura de costos y margen esperado.", weight: 12 },
  { id: 11, title: "Impuestos y Tributos (RETENCOL)", description: "Retenciones, estampillas, ICA, IVA y demás cargas tributarias del contrato.", weight: 5 },
  { id: 12, title: "Factores de Puntuación", description: "Criterios de evaluación, fórmulas y factores de calificación del proceso.", weight: 8 },
  { id: 13, title: "Viabilidad Integral GO / NO GO", description: "Conclusión integral: viabilidad para participar y recomendación final.", weight: 5 },
];

export const TOTAL_WEIGHT = MATRIX_ITEMS.reduce((s, i) => s + i.weight, 0);

export function defaultWeights(): Record<number, number> {
  return Object.fromEntries(MATRIX_ITEMS.map((i) => [i.id, i.weight])) as Record<number, number>;
}

export function defaultScores(): Record<number, number> {
  return Object.fromEntries(MATRIX_ITEMS.map((i) => [i.id, 3])) as Record<number, number>;
}

export function defaultItemNotes(): Record<number, string> {
  return Object.fromEntries(MATRIX_ITEMS.map((i) => [i.id, ""])) as Record<number, string>;
}

// Weighted score 0-100: sum(score_i / 5 * weight_i)
export function computeWeighted(
  scores: Record<number, number>,
  weights: Record<number, number>,
): number {
  return MATRIX_ITEMS.reduce((acc, it) => {
    const s = scores[it.id] ?? 0;
    const w = weights[it.id] ?? 0;
    return acc + (s / 5) * w;
  }, 0);
}

// Higher weighted = more favorable / lower risk
export function classifyRisk(weighted: number): RiskLevel {
  if (weighted >= 84) return "Bajo";
  if (weighted >= 66) return "Medio";
  if (weighted >= 46) return "Alto";
  return "Crítico";
}

export function recommendation(weighted: number): "GO" | "NO GO" | "REVISIÓN" {
  if (weighted >= 75) return "GO";
  if (weighted >= 55) return "REVISIÓN";
  return "NO GO";
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case "Bajo": return "text-success bg-success/10 border-success/30";
    case "Medio": return "text-primary bg-primary/10 border-primary/30";
    case "Alto": return "text-warning-foreground bg-warning/30 border-warning/50";
    case "Crítico": return "text-destructive bg-destructive/10 border-destructive/30";
  }
}

const STORAGE_KEY = "siel.tenders.v2";

export function loadTenders(): TenderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TenderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveTenders(items: TenderRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
