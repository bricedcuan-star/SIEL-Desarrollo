// Cliente servidor para leer "Lista de Privados" desde Google Sheets vía
// el connector gateway de Lovable.

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

export interface SheetRow {
  [key: string]: string | undefined;
}

function requireEnv() {
  const lovable = process.env.LOVABLE_API_KEY;
  const sheets = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovable || !sheets) throw new Error("Credenciales de Google Sheets no configuradas");
  return { lovable, sheets };
}

export async function fetchSheetRows(spreadsheetId: string, range: string): Promise<SheetRow[]> {
  const { lovable, sheets } = requireEnv();
  const url = `${GATEWAY}/spreadsheets/${spreadsheetId}/values/${range}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": sheets,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google Sheets HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { values?: string[][] };
  const values = data.values ?? [];
  if (values.length < 2) return [];
  const headers = values[0].map((h) => h.trim());
  return values.slice(1).map((row) => {
    const obj: SheetRow = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
    return obj;
  });
}

// Mapea una fila del Sheet a la estructura de oportunidad.
export function mapSheetRowToOpportunity(row: SheetRow, index: number) {
  const pick = (keys: string[]) => {
    for (const k of keys) {
      const found = Object.keys(row).find((h) => h.toLowerCase() === k.toLowerCase());
      if (found && row[found]) return row[found] as string;
    }
    return null;
  };
  const num = (v: string | null) => {
    if (!v) return null;
    const n = Number(v.replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  return {
    source: "sheets_privados" as const,
    external_id: pick(["id", "código", "codigo", "referencia"]) ?? `row-${index}`,
    entidad: pick(["entidad", "cliente", "empresa"]),
    objeto: pick(["objeto", "descripción", "descripcion", "detalle"]),
    modalidad: pick(["modalidad", "tipo"]),
    presupuesto: num(pick(["presupuesto", "valor", "monto"])),
    departamento: pick(["departamento"]),
    municipio: pick(["municipio", "ciudad"]),
    fecha_publicacion: pick(["fecha", "fecha_publicacion", "publicación"]),
    fecha_cierre: pick(["cierre", "fecha_cierre", "vencimiento"]),
    url: pick(["url", "link", "enlace"]),
    raw: row as Record<string, unknown>,
  };
}
