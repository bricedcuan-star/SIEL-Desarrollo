// Reglas heurísticas para clasificar Pliegos Tipo de Colombia Compra Eficiente.
// Fuente: base de conocimientos vigente de CCE (Pliegos Tipo publicados).
// El clasificador combina estas reglas con IA (Lovable AI) cuando la confianza es baja.

export interface PliegoTipoRule {
  code: string;
  label: string;
  keywords: string[]; // deben aparecer al menos 2 para match fuerte
  strongKeywords?: string[]; // uno solo basta
}

export const PLIEGOS_TIPO: PliegoTipoRule[] = [
  {
    code: "PT-INFRA-TRANSPORTE",
    label: "Obra pública de infraestructura de transporte",
    keywords: ["obra", "vía", "vias", "carretera", "pavimento", "puente", "andén", "malla vial"],
    strongKeywords: ["infraestructura de transporte", "mejoramiento vial", "rehabilitación vial"],
  },
  {
    code: "PT-INTERVENTORIA-INFRA",
    label: "Interventoría de obra de infraestructura de transporte",
    keywords: ["interventoría", "supervisión técnica", "vía", "carretera", "puente"],
    strongKeywords: ["interventoría a obra", "interventoría técnica administrativa"],
  },
  {
    code: "PT-AGUA-POTABLE",
    label: "Obra pública de agua potable y saneamiento básico",
    keywords: ["acueducto", "alcantarillado", "agua potable", "saneamiento", "ptap", "ptar"],
    strongKeywords: ["agua potable y saneamiento básico"],
  },
  {
    code: "PT-EDIFICACION",
    label: "Obra pública de edificación pública",
    keywords: ["edificación", "construcción", "colegio", "hospital", "sede", "adecuación"],
    strongKeywords: ["edificación pública", "construcción de edificación"],
  },
  {
    code: "PT-INTERVENTORIA-EDIFICACION",
    label: "Interventoría de obra de edificación pública",
    keywords: ["interventoría", "edificación"],
    strongKeywords: ["interventoría edificación pública"],
  },
  {
    code: "PT-MINIMA-CUANTIA",
    label: "Mínima cuantía",
    keywords: ["mínima cuantía", "minima cuantia"],
    strongKeywords: ["mínima cuantía"],
  },
  {
    code: "PT-CONSULTORIA-ESTUDIOS",
    label: "Consultoría de estudios de ingeniería",
    keywords: ["consultoría", "estudios y diseños", "ingeniería"],
    strongKeywords: ["consultoría de estudios de ingeniería"],
  },
];

export interface PliegoClassification {
  code: string | null;
  label: string | null;
  confidence: number; // 0..1
  matchedKeywords: string[];
}

export function classifyByRules(text: string): PliegoClassification {
  const lower = text.toLowerCase();
  let best: PliegoClassification = { code: null, label: null, confidence: 0, matchedKeywords: [] };

  for (const rule of PLIEGOS_TIPO) {
    const matched = rule.keywords.filter((k) => lower.includes(k.toLowerCase()));
    const strong = (rule.strongKeywords ?? []).filter((k) => lower.includes(k.toLowerCase()));
    let confidence = 0;
    if (strong.length > 0) confidence = 0.9;
    else if (matched.length >= 3) confidence = 0.8;
    else if (matched.length === 2) confidence = 0.6;
    else if (matched.length === 1) confidence = 0.3;
    if (confidence > best.confidence) {
      best = {
        code: rule.code,
        label: rule.label,
        confidence,
        matchedKeywords: [...new Set([...strong, ...matched])],
      };
    }
  }
  return best;
}
