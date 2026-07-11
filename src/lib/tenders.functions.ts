import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { TenderRecord } from "./matrix";

export const listTenders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("tenders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      entity: t.entity ?? "",
      amount: t.amount ?? "",
      deadline: t.deadline ?? "",
      fileName: t.file_name,
      scores: (t.scores as Record<number, number>) ?? {},
      weights: (t.weights as Record<number, number>) ?? {},
      itemNotes: (t.item_notes as Record<number, string>) ?? {},
      total: Number(t.total ?? 0),
      average: Number(t.average ?? 0),
      weighted: Number(t.weighted ?? 0),
      riskLevel: (t.risk_level ?? "Medio") as TenderRecord["riskLevel"],
      recommendation: (t.recommendation ?? "REVISIÓN") as TenderRecord["recommendation"],
      notes: t.notes ?? "",
      createdAt: t.created_at,
    } satisfies TenderRecord));
  });

export const saveTender = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: TenderRecord & { opportunityId?: string | null }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase.from("tenders").insert({
      user_id: userId,
      opportunity_id: data.opportunityId ?? null,
      name: data.name,
      entity: data.entity,
      amount: data.amount,
      deadline: data.deadline,
      file_name: data.fileName,
      scores: data.scores,
      weights: data.weights,
      item_notes: data.itemNotes,
      total: data.total,
      average: data.average,
      weighted: data.weighted,
      risk_level: data.riskLevel,
      recommendation: data.recommendation,
      notes: data.notes,
    }).select("id,created_at").single();
    if (error) throw error;
    return { id: row.id, createdAt: row.created_at };
  });

export const deleteTender = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("tenders").delete().eq("id", data.id).eq("user_id", userId);
    return { ok: true };
  });
