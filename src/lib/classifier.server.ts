// Clasificador de Pliego Tipo: reglas + fallback a Lovable AI Gateway.

import { PLIEGOS_TIPO, classifyByRules, type PliegoClassification } from "./pliego-tipo";

export async function classifyPliegoTipoServer(text: string): Promise<PliegoClassification> {
  const rule = classifyByRules(text);
  if (rule.confidence >= 0.7) return rule;

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return rule;

  const catalog = PLIEGOS_TIPO.map((p) => `- ${p.code}: ${p.label}`).join("\n");
  const prompt = `Eres un experto en contratación pública en Colombia y Pliegos Tipo de Colombia Compra Eficiente.
Dado el siguiente objeto de un proceso, determina cuál Pliego Tipo aplica.
Catálogo:
${catalog}
Si ninguno aplica claramente, responde con code=null.
Responde en JSON: {"code": "PT-...", "label": "...", "confidence": 0.0-1.0}

Objeto: """${text.slice(0, 1500)}"""`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) return rule;
    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return rule;
    const parsed = JSON.parse(content) as { code?: string | null; label?: string | null; confidence?: number };
    if (!parsed.code) return rule;
    const match = PLIEGOS_TIPO.find((p) => p.code === parsed.code);
    return {
      code: parsed.code,
      label: match?.label ?? parsed.label ?? parsed.code,
      confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.75)),
      matchedKeywords: rule.matchedKeywords,
    };
  } catch {
    return rule;
  }
}
