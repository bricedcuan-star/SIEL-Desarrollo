// Cliente servidor para SECOP I y II vía datos abiertos Socrata.
// Sin credenciales: endpoints públicos.
// - SECOP I: dataset `f789-7hwg`
// - SECOP II: dataset `p6dx-8zbt`

export interface NormalizedOpportunity {
  source: "secop_i" | "secop_ii";
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
  raw: Record<string, unknown>;
}

const BASE = "https://www.datos.gov.co/resource";

async function fetchSocrata(dataset: string, params: Record<string, string>): Promise<Record<string, unknown>[]> {
  const url = new URL(`${BASE}/${dataset}.json`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Socrata ${dataset} HTTP ${res.status}`);
  return (await res.json()) as Record<string, unknown>[];
}

const toNum = (v: unknown): number | null => {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const toStr = (v: unknown): string | null => (v == null ? null : String(v));

export async function fetchSecopI(limit = 100): Promise<NormalizedOpportunity[]> {
  const rows = await fetchSocrata("f789-7hwg", {
    $limit: String(limit),
    $order: "fecha_de_cargue_en_el_secop DESC",
  });
  return rows.map((r) => ({
    source: "secop_i",
    external_id: toStr(r.uid ?? r.id_objeto ?? r.numero_de_proceso ?? crypto.randomUUID())!,
    entidad: toStr(r.nombre_de_la_entidad),
    objeto: toStr(r.detalle_del_objeto_a_contratar ?? r.objeto_a_contratar),
    modalidad: toStr(r.tipo_de_proceso ?? r.regimen_de_contratacion),
    presupuesto: toNum(r.cuantia_proceso ?? r.cuantia_contrato),
    departamento: toStr(r.departamento_entidad),
    municipio: toStr(r.municipio_entidad),
    fecha_publicacion: toStr(r.fecha_de_cargue_en_el_secop),
    fecha_cierre: toStr(r.fecha_de_firma_del_contrato),
    url: toStr(r.ruta_proceso_en_secop),
    raw: r,
  }));
}

export async function fetchSecopII(limit = 100): Promise<NormalizedOpportunity[]> {
  const rows = await fetchSocrata("p6dx-8zbt", {
    $limit: String(limit),
    $order: "fecha_de_publicacion_del_proceso DESC",
  });
  return rows.map((r) => ({
    source: "secop_ii",
    external_id: toStr(r.id_del_proceso ?? r.referencia_del_proceso ?? crypto.randomUUID())!,
    entidad: toStr(r.entidad),
    objeto: toStr(r.descripci_n_del_procedimiento ?? r.nombre_del_procedimiento),
    modalidad: toStr(r.modalidad_de_contratacion),
    presupuesto: toNum(r.precio_base),
    departamento: toStr(r.departamento_entidad ?? r.ubicaci_n_de_la_entidad),
    municipio: toStr(r.ciudad_de_la_unidad),
    fecha_publicacion: toStr(r.fecha_de_publicacion_del_proceso),
    fecha_cierre: toStr(r.fecha_de_recepcion_de_respuestas),
    url: toStr(typeof r.urlproceso === "object" && r.urlproceso ? (r.urlproceso as { url?: string }).url : r.urlproceso),
    raw: r,
  }));
}
