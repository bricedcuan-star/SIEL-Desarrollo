import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-public-cron/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Autenticación: header `apikey` con la publishable key del proyecto.
        const provided = request.headers.get("apikey");
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!provided || !expected || provided !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401, headers: { "Content-Type": "application/json" },
          });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { _ingestForUser } = await import("@/lib/ingest.functions");
        // Corre ingesta base (sin sheets) + recomputa matches para cada usuario con perfil.
        const { data: users } = await supabaseAdmin.from("user_profile_criteria").select("user_id");
        const summary: Record<string, unknown>[] = [];
        for (const u of users ?? []) {
          try {
            const r = await _ingestForUser(u.user_id as string);
            summary.push({ user_id: u.user_id, ...r });
          } catch (e) {
            summary.push({ user_id: u.user_id, error: (e as Error).message });
          }
        }
        return new Response(JSON.stringify({ ok: true, users: summary.length, summary }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
