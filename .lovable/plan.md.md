## Objetivo

Evolucionar SIEL a **SIEL Pro** con multiusuario, ingesta automática de oportunidades desde **SECOP I/II** y **Google Sheets ("Lista de Privados")**, un **clasificador de Pliego Tipo** y un **motor de recomendación** que cruza oportunidades con el perfil del usuario. Todo integrado al dashboard actual (Panel, Matriz 13, Historial, Metodología).

## Alcance de esta iteración

1. **Auth + Perfil multiusuario** (Lovable Cloud): email/password + Google. Perfil con sectores, palabras clave, CIIU, zonas geográficas, rango de montos.
2. **Ingesta SECOP I/II** vía Socrata (datos abiertos, sin scraping).
3. **Ingesta Google Sheets "Lista de Privados"** vía conector oficial.
4. **Clasificador Pliego Tipo** (reglas + Lovable AI Gateway).
5. **Motor de recomendación** que puntúa oportunidades contra el perfil.
6. **Dashboard**: tabla "Oportunidades Sugeridas", integración con Matriz 13 y veredicto GO/NO GO ya existente.
7. Fuentes de scraping (Bogotá / Revista PH / Propiedad Horizontal) quedan **fuera** por decisión de fase.

## Cambios en la app

### Backend (Lovable Cloud) — nuevas tablas
- `profiles` — datos básicos + FK a `auth.users` (trigger auto-create on signup).
- `user_roles` + enum `app_role` + `has_role()` (patrón obligatorio).
- `user_profile_criteria` — sectores, keywords, CIIU, zonas, monto_min/max, fuentes activas.
- `opportunities` — cache normalizada de oportunidades ingestadas: `source` (secop_i / secop_ii / sheets_privados), `external_id`, `entidad`, `objeto`, `presupuesto`, `modalidad`, `departamento`, `municipio`, `fecha_cierre`, `url`, `raw jsonb`, `pliego_tipo` (nullable), `pliego_tipo_confidence`, `first_seen_at`.
- `opportunity_matches` — `user_id`, `opportunity_id`, `score`, `reasons jsonb`, `dismissed_at`.
- `tenders` (historial actual) — migrar de localStorage a tabla con RLS por usuario, referenciando opcionalmente `opportunity_id`.

Todas con `GRANT` explícitos + RLS scoped a `auth.uid()`.

### Server functions (`createServerFn`)
- `getProfile` / `updateProfile` / `updateCriteria` (auth).
- `listOpportunities({ filters })` — lee `opportunities` + `opportunity_matches` del usuario, ordena por score.
- `dismissOpportunity(id)` / `saveTender(record)` / `listTenders()`.
- `ingestSecop({ source, since })` — llama Socrata (SECOP I: `f789-7hwg`, SECOP II: `p6dx-8zbt`), upsert por `external_id`.
- `ingestSheetsPrivados()` — usa conector `google_sheets` para leer la hoja configurada, upsert.
- `classifyPliegoTipo({ opportunityId | text })` — clasificador híbrido: reglas (keywords Pliegos Tipo CCE: obra pública infraestructura de transporte, interventoría, obra pública de agua potable, etc.) + Lovable AI Gateway (`google/gemini-2.5-flash`) para confirmar y extraer versión.
- `recomputeMatches(userId?)` — recalcula scores para el usuario (o todos si admin) y persiste en `opportunity_matches`.

### Server routes
- `/api/public/cron/ingest` — endpoint programable (protegido por `CRON_SECRET`) que corre `ingestSecop` + `ingestSheetsPrivados` + `recomputeMatches`. El usuario puede llamarlo desde pg_cron o un scheduler externo. Documentar URL estable `project--<id>.lovable.app/api/public/cron/ingest`.

### Motor de recomendación (heurístico transparente)
Score 0–100 sumando:
- +40 si `objeto` contiene alguna keyword del perfil.
- +20 por match de sector/CIIU.
- +15 por match de departamento/municipio.
- +15 si presupuesto está dentro del rango del perfil.
- +10 si `pliego_tipo` está entre los tipos preferidos.
- `reasons` guarda los criterios que sumaron, para mostrarlos como chips.

### UI (rutas TanStack)
- `/auth` — login / signup (email + Google via `lovable.auth.signInWithOAuth`).
- `/_authenticated/` — mueve panel actual bajo layout autenticado gestionado por la integración.
- Nueva sección lateral **"Oportunidades"** con:
  - Tabla ordenada por score, filtros (fuente, tipo, departamento, pliego tipo).
  - Chips de razones del match, badge de fuente, badge de Pliego Tipo.
  - Acciones: "Analizar en Matriz 13" (precarga entidad/objeto/presupuesto en el formulario existente), "Descartar", link al proceso.
- Nueva sección **"Mi Perfil"**: sectores, keywords, CIIU, zonas, rango de montos, fuentes activas, ID de Google Sheet.
- Panel principal: tarjeta "Top 5 oportunidades sugeridas" + KPIs (nuevas hoy, en mi perfil, GO recomendados).
- Historial actual (`tenders`) sigue igual pero leyendo de Cloud.

### Integraciones a habilitar
- **Lovable Cloud** (Auth + DB + storage).
- **Google Sign-In** vía `supabase--configure_social_auth`.
- **Conector Google Sheets** (`standard_connectors--connect` con `google_sheets`) — el usuario autoriza su cuenta y pega el ID del Sheet "Lista de Privados" en su perfil.
- **Lovable AI Gateway** (`LOVABLE_API_KEY`) para el clasificador.
- **Secret `CRON_SECRET`** (generado) para el endpoint de ingesta.
- SECOP no requiere credenciales (API pública Socrata).

## Aspectos técnicos

- Fuentes SECOP: Socrata JSON (`https://www.datos.gov.co/resource/{dataset}.json`), paginación `$limit`/`$offset`, filtro `$where` por `fecha_de_publicacion_del` >= última corrida.
- Sheets: rango `Lista de Privados!A2:Z` con encabezados detectados en fila 1; mapeo configurable en `user_profile_criteria.sheet_mapping jsonb`.
- Clasificador: mantiene tabla en memoria de Pliegos Tipo vigentes (Infraestructura de transporte v3, Agua potable, Interventoría, Obras de edificación pública, Mínima cuantía, etc.); AI solo se llama si las reglas no dan confianza > 0.7.
- RLS: `opportunities` es lectura pública para `authenticated` (dato de contratación pública); `opportunity_matches`, `tenders`, `profiles`, `user_profile_criteria` scoped a `auth.uid()`.
- Cron: no auto-ejecutamos; documentamos URL + secret. Botón "Sincronizar ahora" en Oportunidades para ingesta on-demand del usuario.
- Migración del historial existente: al hacer login por primera vez, un efecto cliente sube los `tenders` de `localStorage` a Cloud y limpia la clave.

## Fuera de alcance (siguiente fase)
- Scraping de Convocatorias Bogotá, Revista Propiedad Horizontal, Propiedad Horizontal (requerirá conector Firecrawl).
- Monitoreo/alertas por email.
- Multi-tenant con organizaciones.
