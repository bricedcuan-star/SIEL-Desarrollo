import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { scoreOpportunity, type UserCriteria } from "./recommendation";

export type IngestSource = "secop_i" | "secop_ii" | "sheets_privados";

export interface IngestResult {
  source: IngestSource;
  fetched: number;
  inserted: number;
  updated: number;
  error?: string;
}

async function ingestAll(userId: string, options?: { sources?: IngestSource[] }): Promise<{
  results: IngestResult[];
  matches: number;
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { fetchSecopI, fetchSecopII } = await import("./secop.server");
  const { fetchSheetRows, mapSheetRowToOpportunity } = await import("./sheets.server");
  const { classifyPliegoTipoServer } = await import("./classifier.server");

  const { data: criteriaRow } = await supabaseAdmin
    .from("user_profile_criteria").select("*").eq("user_id", userId).maybeSingle();

  const sources = options?.sources ?? (criteriaRow?.sources as IngestSource[] | undefined) ??
    ["secop_i", "secop_ii", "sheets_privados"];

  const results: IngestResult[] = [];

  for (const src of sources) {
    try {
      let items: Array<Awaited<ReturnType<typeof fetchSecopI>>[number] | ReturnType<typeof mapSheetRowToOpportunity>> = [];
      if (src === "secop_i") items = await fetchSecopI(150);
      else if (src === "secop_ii") items = await fetchSecopII(150);
      else if (src === "sheets_privados") {
        const sid = criteriaRow?.sheet_id;
        if (!sid) { results.push({ source: src, fetched: 0, inserted: 0, updated: 0, error: "Sin sheet_id" }); continue; }
        const rows = await fetchSheetRows(sid, criteriaRow.sheet_range ?? "Lista de Privados!A1:Z1000");
        items = rows.map((r, i) => mapSheetRowToOpportunity(r, i));
      }

      // Clasifica Pliego Tipo por objeto
      const enriched = await Promise.all(items.map(async (it) => {
        const text = `${it.objeto ?? ""} ${it.modalidad ?? ""}`.trim();
        const cls = text ? await classifyPliegoTipoServer(text) : { code: null, confidence: 0 };
        return { ...it, pliego_tipo: cls.code, pliego_tipo_confidence: cls.confidence };
      }));

      // Upsert por (source, external_id)
      const { data: upserted, error } = await supabaseAdmin.from("opportunities").upsert(
        enriched.map((it) => ({
          source: it.source,
          external_id: it.external_id,
          entidad: it.entidad,
          objeto: it.objeto,
          modalidad: it.modalidad,
          presupuesto: it.presupuesto,
          departamento: it.departamento,
          municipio: it.municipio,
          fecha_publicacion: it.fecha_publicacion,
          fecha_cierre: it.fecha_cierre,
          url: it.url,
          pliego_tipo: it.pliego_tipo,
          pliego_tipo_confidence: it.pliego_tipo_confidence,
          raw: it.raw as unknown as never,
        })),
        { onConflict: "source,external_id" },
      ).select("id");
      if (error) throw error;
      results.push({ source: src, fetched: items.length, inserted: upserted?.length ?? 0, updated: 0 });
    } catch (e) {
      results.push({ source: src, fetched: 0, inserted: 0, updated: 0, error: (e as Error).message });
    }
  }

  // Recompute matches para el usuario
  const criteria: UserCriteria = {
    sectors: criteriaRow?.sectors ?? [],
    keywords: criteriaRow?.keywords ?? [],
    ciiu: criteriaRow?.ciiu ?? [],
    departamentos: criteriaRow?.departamentos ?? [],
    monto_min: criteriaRow?.monto_min ? Number(criteriaRow.monto_min) : null,
    monto_max: criteriaRow?.monto_max ? Number(criteriaRow.monto_max) : null,
    pliegos_tipo: criteriaRow?.pliegos_tipo ?? [],
  };

  const { data: opps } = await supabaseAdmin.from("opportunities").select("*").limit(500);
  let matches = 0;
  if (opps) {
    const upserts = opps
      .map((o) => {
        const r = scoreOpportunity({
          objeto: o.objeto, entidad: o.entidad, presupuesto: o.presupuesto ? Number(o.presupuesto) : null,
          departamento: o.departamento, municipio: o.municipio, pliego_tipo: o.pliego_tipo,
        }, criteria);
        return { user_id: userId, opportunity_id: o.id, score: r.score, reasons: r.reasons };
      })
      .filter((r) => r.score > 0);
    if (upserts.length > 0) {
      const { error: mErr } = await supabaseAdmin.from("opportunity_matches").upsert(upserts, {
        onConflict: "user_id,opportunity_id",
      });
      if (!mErr) matches = upserts.length;
    }
  }

  return { results, matches };
}

export const ingestForCurrentUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sources?: IngestSource[] } = {}) => data)
  .handler(async ({ data, context }) => {
    return ingestAll(context.userId, data);
  });

export const _ingestForUser = ingestAll; // exportado para el cron
