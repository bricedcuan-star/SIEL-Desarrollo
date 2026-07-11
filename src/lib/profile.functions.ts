import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ProfileCriteria {
  sectors: string[];
  keywords: string[];
  ciiu: string[];
  departamentos: string[];
  monto_min: number | null;
  monto_max: number | null;
  pliegos_tipo: string[];
  sources: string[];
  sheet_id: string | null;
  sheet_range: string | null;
}

export interface FullProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  criteria: ProfileCriteria;
}

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: criteria }] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,company").eq("id", userId).maybeSingle(),
      supabase.from("user_profile_criteria").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    // Asegura fila de criterios si el trigger aún no la creó (usuarios previos).
    if (!criteria) {
      await supabase.from("user_profile_criteria").insert({ user_id: userId });
    }

    return {
      id: userId,
      email: profile?.email ?? null,
      full_name: profile?.full_name ?? null,
      company: profile?.company ?? null,
      criteria: {
        sectors: criteria?.sectors ?? [],
        keywords: criteria?.keywords ?? [],
        ciiu: criteria?.ciiu ?? [],
        departamentos: criteria?.departamentos ?? [],
        monto_min: criteria?.monto_min ? Number(criteria.monto_min) : null,
        monto_max: criteria?.monto_max ? Number(criteria.monto_max) : null,
        pliegos_tipo: criteria?.pliegos_tipo ?? [],
        sources: criteria?.sources ?? ["secop_i", "secop_ii", "sheets_privados"],
        sheet_id: criteria?.sheet_id ?? null,
        sheet_range: criteria?.sheet_range ?? "Lista de Privados!A1:Z1000",
      },
    } satisfies FullProfile;
  });

export interface UpdateProfileInput {
  full_name?: string | null;
  company?: string | null;
  criteria?: Partial<ProfileCriteria>;
}

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: UpdateProfileInput) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.full_name !== undefined || data.company !== undefined) {
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: data.full_name ?? null,
        company: data.company ?? null,
      });
    }
    if (data.criteria) {
      const c = data.criteria;
      await supabase.from("user_profile_criteria").upsert({
        user_id: userId,
        ...(c.sectors !== undefined && { sectors: c.sectors }),
        ...(c.keywords !== undefined && { keywords: c.keywords }),
        ...(c.ciiu !== undefined && { ciiu: c.ciiu }),
        ...(c.departamentos !== undefined && { departamentos: c.departamentos }),
        ...(c.monto_min !== undefined && { monto_min: c.monto_min }),
        ...(c.monto_max !== undefined && { monto_max: c.monto_max }),
        ...(c.pliegos_tipo !== undefined && { pliegos_tipo: c.pliegos_tipo }),
        ...(c.sources !== undefined && { sources: c.sources }),
        ...(c.sheet_id !== undefined && { sheet_id: c.sheet_id }),
        ...(c.sheet_range !== undefined && { sheet_range: c.sheet_range }),
      });
    }
    return { ok: true };
  });
