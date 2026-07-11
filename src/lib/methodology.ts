import {
  Compass,
  Calculator,
  MapPin,
  Scale,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export interface MethodologyChapter {
  id: number;
  code: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  intro: string;
  bullets: string[];
  quote?: string;
}

export const METHODOLOGY: MethodologyChapter[] = [
  {
    id: 3,
    code: "Cap. 3",
    title: "Evolución hacia la Inteligencia Estratégica",
    tagline: "De evaluador documental a sistema de decisión.",
    icon: Compass,
    intro:
      "SIEL dejó de ser sólo una lista de chequeo para convertirse en una plataforma que responde las preguntas estratégicas del negocio antes de comprometer recursos.",
    bullets: [
      "¿Puedo participar?",
      "¿Tengo posibilidades reales de ganar?",
      "¿La oferta es rentable?",
      "¿Qué riesgos estoy asumiendo?",
      "¿Vale la pena invertir recursos en este proceso?",
    ],
    quote: "SIEL es un sistema de apoyo a la toma de decisiones, no un simple evaluador de pliegos.",
  },
  {
    id: 4,
    code: "Cap. 4",
    title: "Integración del Ecosistema RETENCOL",
    tagline: "Motor tributario inteligente embebido en cada evaluación.",
    icon: Calculator,
    intro:
      "La experiencia con RETENCOL evidenció que muchas empresas ganan contratos sin haber calculado correctamente su carga tributaria real. SIEL integra ese motor para que ningún costo fiscal quede oculto.",
    bullets: [
      "Retenciones en la fuente y a título de renta",
      "Estampillas departamentales y municipales",
      "ICA y contribuciones especiales",
      "Costos tributarios ocultos del contrato",
    ],
  },
  {
    id: 5,
    code: "Cap. 5",
    title: "Descubrimiento del Riesgo Territorial",
    tagline: "Inteligencia Territorial SIEL.",
    icon: MapPin,
    intro:
      "Ganar un contrato en una zona con problemas de acceso, seguridad o logística puede destruir su rentabilidad. SIEL analiza el territorio antes de recomendar participar.",
    bullets: [
      "Ubicación geográfica y distancias",
      "Accesibilidad y estado de vías",
      "Seguridad y orden público",
      "Clima y riesgos operativos",
      "Impacto logístico sobre el presupuesto",
    ],
  },
  {
    id: 6,
    code: "Cap. 6",
    title: "Inteligencia Normativa",
    tagline: "Alertas automáticas sobre cambios regulatorios.",
    icon: Scale,
    intro:
      "La normativa de contratación pública en Colombia cambia constantemente. SIEL monitorea las fuentes oficiales y notifica los cambios relevantes para cada proceso analizado.",
    bullets: [
      "SECOP y Colombia Compra Eficiente",
      "Pliegos Tipo y Documentos Tipo Complementarios",
      "Decretos y circulares aplicables",
      "Actualizaciones jurisprudenciales de impacto",
    ],
  },
  {
    id: 7,
    code: "Cap. 7",
    title: "Visión Anticorrupción",
    tagline: "Transparencia y trazabilidad, no acusación.",
    icon: ShieldAlert,
    intro:
      "SIEL se proyecta como una herramienta de prevención: detecta patrones e inconsistencias para fortalecer las buenas prácticas en la contratación pública y privada.",
    bullets: [
      "Patrones repetitivos de adjudicación",
      "Historiales y comportamiento de oferentes",
      "Inconsistencias documentales",
      "Validación de soportes",
      "Buenas prácticas de contratación",
    ],
  },
];
