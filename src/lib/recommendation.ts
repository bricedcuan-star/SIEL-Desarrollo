// Motor de recomendación: cruza oportunidades con el perfil del usuario y
// produce un puntaje 0-100 + razones legibles.

export interface UserCriteria {
  sectors: string[];
  keywords: string[];
  ciiu: string[];
  departamentos: string[];
  monto_min: number | null;
  monto_max: number | null;
  pliegos_tipo: string[];
}

export interface OpportunityLike {
  objeto: string | null;
  entidad: string | null;
  presupuesto: number | null;
  departamento: string | null;
  municipio: string | null;
  pliego_tipo: string | null;
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

const norm = (s: string | null | undefined) => (s ?? "").toString().toLowerCase();

export function scoreOpportunity(
  opp: OpportunityLike,
  crit: UserCriteria,
): MatchResult {
  let score = 0;
  const reasons: string[] = [];
  const objectText = `${norm(opp.objeto)} ${norm(opp.entidad)}`;

  // +40 keyword match on objeto
  const kwHits = crit.keywords.filter((k) => k && objectText.includes(k.toLowerCase()));
  if (kwHits.length > 0) {
    score += Math.min(40, 15 + kwHits.length * 10);
    reasons.push(`Palabras clave: ${kwHits.slice(0, 3).join(", ")}`);
  }

  // +20 sector match
  const secHits = crit.sectors.filter((s) => s && objectText.includes(s.toLowerCase()));
  if (secHits.length > 0) {
    score += 20;
    reasons.push(`Sector: ${secHits[0]}`);
  }

  // +15 departamento / municipio
  if (crit.departamentos.length > 0) {
    const zone = `${norm(opp.departamento)} ${norm(opp.municipio)}`;
    const geoHit = crit.departamentos.find((d) => zone.includes(d.toLowerCase()));
    if (geoHit) {
      score += 15;
      reasons.push(`Zona: ${geoHit}`);
    }
  }

  // +15 monto in range
  if (opp.presupuesto != null && (crit.monto_min != null || crit.monto_max != null)) {
    const min = crit.monto_min ?? 0;
    const max = crit.monto_max ?? Number.POSITIVE_INFINITY;
    if (opp.presupuesto >= min && opp.presupuesto <= max) {
      score += 15;
      reasons.push("Presupuesto dentro de rango");
    }
  }

  // +10 pliego tipo preferido
  if (opp.pliego_tipo && crit.pliegos_tipo.includes(opp.pliego_tipo)) {
    score += 10;
    reasons.push(`Pliego Tipo: ${opp.pliego_tipo}`);
  }

  return { score: Math.min(100, score), reasons };
}
