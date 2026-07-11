import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface OpportunityRow {
  id: string;
  source: "secop_i" | "secop_ii" | "sheets_privados";
  external_id: string;
  entidad: string | null;
  objeto: string | null;
  modalidad: string | null;
  presupuesto: number | null;
  departamento: string | null;
  municipio: string | null;
  fecha_publicacion: string | null;
  fecha_cierre: string | null;
  url: string | null;
  pliego_tipo: string | null;
  pliego_tipo_confidence: number | null;
  first_seen_at: string;
  score: number;
  reasons: string[];
  dismissed: boolean;
}

export const listOpportunities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    // Trae oportunidades + join con match del usuario. Simple: dos queries.
    const [{ data: matches }, { data: opps }] = await Promise.all([
      supabase.from("opportunity_matches").select("*").eq("user_id", userId),
      supabase.from("opportunities").select("*").order("first_seen_at", { ascending: false }).limit(300),
    ]);
    const byId = new Map((matches ?? []).map((m) => [m.opportunity_id, m]));
    const rows: OpportunityRow[] = (opps ?? []).map((o) => {
      const m = byId.get(o.id);
      return {
        id: o.id,
        source: o.source,
        external_id: o.external_id,
        entidad: o.entidad,
        objeto: o.objeto,
        modalidad: o.modalidad,
        presupuesto: o.presupuesto ? Number(o.presupuesto) : null,
        departamento: o.departamento,
        municipio: o.municipio,
        fecha_publicacion: o.fecha_publicacion,
        fecha_cierre: o.fecha_cierre,
        url: o.url,
        pliego_tipo: o.pliego_tipo,
        pliego_tipo_confidence: o.pliego_tipo_confidence ? Number(o.pliego_tipo_confidence) : null,
        first_seen_at: o.first_seen_at,
        score: m ? Number(m.score) : 0,
        reasons: m ? ((m.reasons as unknown as string[]) ?? []) : [],
        dismissed: !!m?.dismissed_at,
      };
    });
    rows.sort((a, b) => b.score - a.score || (a.dismissed ? 1 : -1));
    return rows;
  });

export const dismissOpportunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { opportunityId: string; dismissed: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("opportunity_matches").upsert({
      user_id: userId,
      opportunity_id: data.opportunityId,
      dismissed_at: data.dismissed ? new Date().toISOString() : null,
    }, { onConflict: "user_id,opportunity_id" });
    return { ok: true };
  });
