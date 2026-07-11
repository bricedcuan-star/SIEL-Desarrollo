import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Save, User } from "lucide-react";
import { getProfile, updateProfile, type FullProfile } from "@/lib/profile.functions";
import { PLIEGOS_TIPO } from "@/lib/pliego-tipo";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition";

const csv = (a: string[]) => a.join(", ");
const parseCsv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function ProfileSection() {
  const load = useServerFn(getProfile);
  const save = useServerFn(updateProfile);
  const [p, setP] = useState<FullProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => { load().then(setP); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) return <div className="p-10 text-center text-sm text-muted-foreground">Cargando perfil…</div>;

  const c = p.criteria;
  const update = (patch: Partial<FullProfile>) => setP({ ...p, ...patch });
  const updateC = (patch: Partial<FullProfile["criteria"]>) => setP({ ...p, criteria: { ...c, ...patch } });

  const submit = async () => {
    setBusy(true); setMsg(null);
    try {
      await save({ data: { full_name: p.full_name, company: p.company, criteria: c } });
      setMsg("Perfil actualizado ✓");
    } catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><User className="h-5 w-5" /></div>
          <div>
            <h3 className="font-display font-semibold">Datos generales</h3>
            <p className="text-xs text-muted-foreground">Se usan como firma en tus evaluaciones.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Nombre completo</span>
            <input className={inputCls} value={p.full_name ?? ""} onChange={(e) => update({ full_name: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Empresa</span>
            <input className={inputCls} value={p.company ?? ""} onChange={(e) => update({ company: e.target.value })} />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Correo</span>
            <input className={inputCls} value={p.email ?? ""} disabled />
          </label>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-display font-semibold">Perfil de licitaciones</h3>
          <p className="text-xs text-muted-foreground">SIEL usa estos criterios para puntuar oportunidades de SECOP y tu Sheet privado.</p>
        </div>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Palabras clave (separadas por coma)</span>
          <input className={inputCls} value={csv(c.keywords)} onChange={(e) => updateC({ keywords: parseCsv(e.target.value) })}
            placeholder="calderas, vapor, lavandería, mantenimiento" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Sectores</span>
          <input className={inputCls} value={csv(c.sectors)} onChange={(e) => updateC({ sectors: parseCsv(e.target.value) })}
            placeholder="salud, hotelería, industrial" />
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Departamentos</span>
            <input className={inputCls} value={csv(c.departamentos)} onChange={(e) => updateC({ departamentos: parseCsv(e.target.value) })}
              placeholder="Bogotá, Cundinamarca, Antioquia" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Códigos CIIU</span>
            <input className={inputCls} value={csv(c.ciiu)} onChange={(e) => updateC({ ciiu: parseCsv(e.target.value) })}
              placeholder="3311, 3312" />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Presupuesto mínimo (COP)</span>
            <input type="number" className={inputCls} value={c.monto_min ?? ""} onChange={(e) => updateC({ monto_min: e.target.value ? Number(e.target.value) : null })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Presupuesto máximo (COP)</span>
            <input type="number" className={inputCls} value={c.monto_max ?? ""} onChange={(e) => updateC({ monto_max: e.target.value ? Number(e.target.value) : null })} />
          </label>
        </div>

        <div>
          <span className="block text-xs font-semibold text-muted-foreground mb-2">Pliegos Tipo de interés</span>
          <div className="flex flex-wrap gap-2">
            {PLIEGOS_TIPO.map((pt) => {
              const on = c.pliegos_tipo.includes(pt.code);
              return (
                <button key={pt.code} type="button"
                  onClick={() => updateC({ pliegos_tipo: on ? c.pliegos_tipo.filter((x) => x !== pt.code) : [...c.pliegos_tipo, pt.code] })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    on ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/40"
                  }`}>
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-display font-semibold">Lista de Privados (Google Sheets)</h3>
          <p className="text-xs text-muted-foreground">
            Pega el ID del Sheet (en la URL después de <code>/d/</code>). SIEL leerá la primera fila como encabezados
            (entidad, objeto, presupuesto, departamento, municipio, url…).
          </p>
        </div>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Sheet ID</span>
          <input className={inputCls} value={c.sheet_id ?? ""} onChange={(e) => updateC({ sheet_id: e.target.value || null })}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Rango</span>
          <input className={inputCls} value={c.sheet_range ?? ""} onChange={(e) => updateC({ sheet_range: e.target.value || null })} />
        </label>
      </div>

      {msg && <div className="text-xs bg-secondary/60 border border-border rounded-lg p-3">{msg}</div>}

      <button onClick={submit} disabled={busy}
        className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-60 flex items-center gap-2">
        <Save className="h-4 w-4" /> {busy ? "Guardando…" : "Guardar perfil"}
      </button>
    </div>
  );
}
