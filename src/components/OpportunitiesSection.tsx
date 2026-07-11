import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw, ExternalLink, XCircle, Sparkles, MapPin, Building2 } from "lucide-react";
import { listOpportunities, dismissOpportunity, type OpportunityRow } from "@/lib/opportunities.functions";
import { ingestForCurrentUser } from "@/lib/ingest.functions";

const SOURCE_LABEL: Record<string, string> = {
  secop_i: "SECOP I",
  secop_ii: "SECOP II",
  sheets_privados: "Privados",
};
const SOURCE_COLOR: Record<string, string> = {
  secop_i: "bg-primary/10 text-primary border-primary/30",
  secop_ii: "bg-accent/25 text-accent-foreground border-accent/50",
  sheets_privados: "bg-secondary text-secondary-foreground border-border",
};

export function OpportunitiesSection({ onAnalyze }: { onAnalyze: (opp: OpportunityRow) => void }) {
  const list = useServerFn(listOpportunities);
  const dismiss = useServerFn(dismissOpportunity);
  const ingest = useServerFn(ingestForCurrentUser);
  const [rows, setRows] = useState<OpportunityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [source, setSource] = useState<string>("Todos");
  const [showDismissed, setShowDismissed] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setRows(await list()); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sync = async () => {
    setSyncing(true); setSyncMsg(null);
    try {
      const r = await ingest({ data: {} });
      const summary = r.results.map((s) => `${SOURCE_LABEL[s.source]}: ${s.fetched}${s.error ? " ⚠" : ""}`).join(" · ");
      setSyncMsg(`Sincronizado — ${summary} · ${r.matches} coincidencias`);
      await refresh();
    } catch (e) {
      setSyncMsg(`Error: ${(e as Error).message}`);
    } finally { setSyncing(false); }
  };

  const filtered = rows
    .filter((r) => source === "Todos" || r.source === source)
    .filter((r) => showDismissed || !r.dismissed);

  return (
    <div className="space-y-5">
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["Todos", "secop_i", "secop_ii", "sheets_privados"].map((s) => (
            <button key={s} onClick={() => setSource(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                source === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/40"
              }`}>
              {s === "Todos" ? "Todas las fuentes" : SOURCE_LABEL[s]}
            </button>
          ))}
          <label className="ml-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <input type="checkbox" checked={showDismissed} onChange={(e) => setShowDismissed(e.target.checked)} />
            Mostrar descartadas
          </label>
        </div>
        <button onClick={sync} disabled={syncing}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-60 flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Sincronizando…" : "Sincronizar ahora"}
        </button>
      </div>

      {syncMsg && (
        <div className="text-xs bg-secondary/60 border border-border rounded-lg p-3">{syncMsg}</div>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Cargando oportunidades…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <div className="font-semibold">Sin oportunidades por ahora</div>
            <div className="text-sm text-muted-foreground mt-1">
              Configura tu perfil (palabras clave, sector, zonas) y presiona <b>Sincronizar ahora</b>.
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className={`p-5 hover:bg-muted/30 transition ${r.dismissed ? "opacity-50" : ""}`}>
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${SOURCE_COLOR[r.source]}`}>
                        {SOURCE_LABEL[r.source]}
                      </span>
                      {r.pliego_tipo && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-accent/50 bg-accent/20 text-accent-foreground font-semibold">
                          {r.pliego_tipo}
                        </span>
                      )}
                      {r.score > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                          Match {Math.round(r.score)}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold mt-1.5 leading-snug">{r.objeto ?? "—"}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{r.entidad ?? "Sin entidad"}</span>
                      {(r.departamento || r.municipio) && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[r.municipio, r.departamento].filter(Boolean).join(", ")}</span>
                      )}
                      {r.presupuesto && <span>${r.presupuesto.toLocaleString("es-CO")}</span>}
                    </div>
                    {r.reasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.reasons.map((rr, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">{rr}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={() => onAnalyze(r)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-accent hover:text-accent-foreground">
                      Analizar en Matriz 13
                    </button>
                    <div className="flex items-center gap-1.5">
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-muted text-muted-foreground" title="Abrir proceso">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button onClick={async () => { await dismiss({ data: { opportunityId: r.id, dismissed: !r.dismissed } }); refresh(); }}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground" title={r.dismissed ? "Restaurar" : "Descartar"}>
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
