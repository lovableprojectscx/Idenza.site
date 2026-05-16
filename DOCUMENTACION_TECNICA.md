# Documentación Técnica — Idenza
**Versión:** 2.0 · **Fecha:** Abril 2026  
**Stack:** React + TypeScript + Vite · Supabase · Gemini 2.5 Flash

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│               SITIOS WEB DE CLIENTES                        │
│  <script src="idenza.site/tracker.js"                       │
│    data-token="..."  data-org="...">                        │
└────────────────────────┬────────────────────────────────────┘
                         │  REST API (anon key)
                         ▼
         ┌─────────────────────────────────────┐
         │         SUPABASE                    │
         │  events · leads · organizations     │
         │  site_snapshots · org_members       │
         │  content_posts · forum_*            │
         └───────────┬─────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        ▼                           ▼
  ClientDashboard             AdminHub
  (usuario final)           (equipo Idenza)
        │
        ├── OrgDashboard
        │     ├── Resumen / Traffic / Leads
        │     ├── Mi Empresa (BusinessBriefPanel)
        │     ├── Auditoría  (WebAuditPanel)
        │     └── Asesor IA  (AIChatPanel)
        │
        └── src/lib/ai.ts → Gemini 2.5 Flash API
```

---

## Base de datos (Supabase)

### Tablas existentes

#### `organizations`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid PK | Identificador único |
| name | text | Nombre del negocio |
| slug | text | URL-friendly name |
| website_url | text | URL del sitio web |
| industry | text | Rubro del negocio |
| city | text | Ciudad base |
| description | text | **Brief JSON** (ver formato abajo) |
| token | text | Token de autenticación del tracker |
| created_at | timestamptz | Fecha de creación |

**Formato del campo `description` (Business Brief):**
```json
{
  "v": 1,
  "summary": "Descripción general del negocio...",
  "audience": "A quién le vendemos...",
  "value_prop": "Propuesta de valor y diferencial...",
  "services": "Productos y servicios ofrecidos...",
  "goals": "Objetivos del sitio web...",
  "challenges": "Desafíos actuales..."
}
```
Si `description` no parsea como JSON o no tiene `v: 1`, se trata como texto plano (retrocompatibilidad).

---

#### `events`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| token | text | Token del tracker |
| event_type | text | `pageview`, `pageview_anonymous`, `consent_granted`, `consent_necessary_only` |
| page_url | text | URL completa |
| referrer | text | Referrer HTTP |
| city | text | Ciudad (IP-based) |
| country | text | País (IP-based) |
| device | text | `mobile`, `tablet`, `desktop` |
| browser | text | `Chrome`, `Firefox`, `Safari`, `Edge`, `Opera`, `Other` |
| session_id | text | ID de sesión de pestaña |
| created_at | timestamptz | |

---

#### `leads`
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| organization_id | uuid FK → organizations | |
| token | text | |
| name | text | Nombre del contacto |
| email | text | Email del contacto |
| phone | text | Teléfono del contacto |
| message | text | Mensaje del formulario |
| page_url | text | Página donde se envió el formulario |
| city | text | Ciudad (IP-based) |
| country | text | País (IP-based) |
| status | text | `new`, `contacted`, `closed` |
| time_on_page | int | Segundos en la página antes de enviar el form (v2) |
| session_id | text | ID de sesión (v2) |
| referrer | text | Referrer HTTP (v2) |
| created_at | timestamptz | |

---

#### `organization_members`
| Campo | Tipo | Descripción |
|---|---|---|
| organization_id | uuid FK | |
| user_id | uuid FK → auth.users | |
| role | text | `owner` |

---

### Tabla nueva requerida: `site_snapshots`

**Esta tabla debe crearse ejecutando el siguiente SQL en Supabase:**

```sql
CREATE TABLE site_snapshots (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  page_url       text NOT NULL,
  title          text,
  meta_description text,
  h1             text,
  headings       jsonb DEFAULT '[]',
  ctas           jsonb DEFAULT '[]',
  forms          jsonb DEFAULT '[]',
  word_count     int  DEFAULT 0,
  has_phone      boolean DEFAULT false,
  has_email      boolean DEFAULT false,
  has_live_chat  boolean DEFAULT false,
  device         text,
  captured_at    timestamptz DEFAULT now(),

  CONSTRAINT site_snapshots_org_url_unique UNIQUE (organization_id, page_url)
);

-- Índices para performance
CREATE INDEX idx_site_snapshots_org ON site_snapshots(organization_id);
CREATE INDEX idx_site_snapshots_captured ON site_snapshots(captured_at DESC);

-- RLS: solo el dueño de la org puede leer sus snapshots
ALTER TABLE site_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their org snapshots"
  ON site_snapshots FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- El tracker inserta con anon key, necesita política de insert
CREATE POLICY "Tracker can insert snapshots"
  ON site_snapshots FOR INSERT
  WITH CHECK (true);

-- El tracker puede actualizar (UPSERT) snapshots existentes
CREATE POLICY "Tracker can update snapshots"
  ON site_snapshots FOR UPDATE
  USING (true);
```

---

### Migración de `leads`: campos nuevos (v2)

Los campos `time_on_page`, `session_id` y `referrer` se agregan en la versión 2. El tracker los envía pero si las columnas no existen, Supabase los ignorará silenciosamente (no rompe nada).

Para activarlos:
```sql
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS time_on_page int,
  ADD COLUMN IF NOT EXISTS session_id   text,
  ADD COLUMN IF NOT EXISTS referrer     text;
```

---

### RLS: permitir que clientes actualicen su propio brief

```sql
CREATE POLICY "Users can update their own org description"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );
```

---

### RPCs existentes (Supabase Functions)

| Nombre | Parámetros | Retorna | Usa en |
|---|---|---|---|
| `get_user_projects` | `p_user_id uuid` | `Project[]` | ClientDashboard |
| `get_project_analytics` | `p_org_id uuid, p_days int` | `Analytics` | OrgDashboard |
| `create_organization` | `p_name, p_slug, p_email, p_admin_secret, p_website, p_industry, p_city, p_description` | `{org_id, token}` | AdminHub |
| `update_organization` | `p_id, p_admin_secret, p_name, p_email, p_website, p_industry, p_city, p_description` | void | AdminHub |
| `delete_organization` | `p_id, p_admin_secret` | void | AdminHub |
| `get_admin_clients` | `p_admin_secret` | clientes[] | AdminHub |

---

## Tracker (public/tracker.js)

Script vanilla JS de ~270 líneas. Se instala en sitios de terceros con un `<script>` tag.

### Flujo de ejecución

```
Script carga
    │
    ├─ Lee data-token y data-org del elemento script
    ├─ Lee consentimiento de localStorage (idz_consent)
    │
    ├─ Si ya hay consentimiento → runTracking()
    └─ Si no hay consentimiento → injectBanner()
                                      │
                            Usuario acepta / rechaza
                                      │
                                 runTracking()

runTracking(consent)
    │
    ├─ consent.analytics = true:
    │     ├─ getGeo() → ipapi.co
    │     ├─ trackPageview()  → INSERT events
    │     ├─ trackPageSnapshot() → UPSERT site_snapshots (con delay 1.5s)
    │     └─ consent.marketing = true:
    │           └─ attachFormListeners() → submit → trackLead() → INSERT leads
    │
    └─ consent.analytics = false:
          └─ INSERT events (event_type: pageview_anonymous)
```

### Captura de snapshot DOM

`capturePageSnapshot()` extrae:
- `document.title`, `meta[name=description]`
- `h1` (primer H1), `h2`/`h3` (hasta 10)
- Textos únicos de `button`, `a[href]`, `[role=button]` (hasta 15)
- Formularios: campos `input`, `textarea`, `select` (nombre/placeholder/type)
- `body.innerText` word count
- Detecta teléfono/email en texto visible con regex
- Detecta chats live (Intercom, HubSpot, Zendesk, Crisp)

El snapshot se envía con `Prefer: resolution=merge-duplicates` para UPSERT por `(organization_id, page_url)`.

### Atributos del script

| Atributo | Requerido | Descripción |
|---|---|---|
| `data-token` | ✅ | Token de autenticación |
| `data-org` | ✅ | UUID de la organización |
| `data-color` | Opcional | Color primario del banner (hex) |
| `data-no-banner` | Opcional | `"true"` para ocultar el banner de cookies |

### Almacenamiento del cliente (browser)
- `localStorage.idz_consent` — Preferencias de consentimiento `{analytics, marketing, date}`
- `sessionStorage.idz_session` — ID de sesión por pestaña (`sess_xxxxx`)

---

## Sistema de IA (src/lib/ai.ts)

### OrgContext

Objeto que se pasa al sistema de IA con todo el contexto del cliente:

```typescript
interface OrgContext {
  orgName: string;
  industry: string | null;
  city: string | null;
  website: string | null;
  totalLeads: number;
  newLeads: number;
  totalVisits: number;
  cities: string[];
  recentLeads: { name: string | null; city: string | null; status: string }[];
  brief: BusinessBrief | null;        // Perfil del negocio (v2)
  snapshots: SiteSnapshot[];          // Estructura de páginas (v2)
  leadsByPage: { page: string; count: number }[]; // Atribución (v2)
}
```

### Funciones exportadas

#### `sendChatMessage(messages, ctx)`
Chat conversacional. Mantiene historial de hasta 18 mensajes. Usa `buildSystemPrompt()` que inyecta todos los datos del contexto.

#### `runWebAudit(ctx)`
Genera un informe estructurado. Usa `buildAuditPrompt()` que produce un prompt de análisis y espera respuesta JSON. Limpia bloques de markdown antes de parsear.

Retorna `WebAuditResult`:
```typescript
interface WebAuditResult {
  score: number;                    // 1-10
  summary: string;                  // Resumen ejecutivo
  critical: {                       // Problemas que frenan conversiones
    title: string;
    description: string;
    page: string;
  }[];
  opportunities: {                  // Qué aprovechar
    title: string;
    description: string;
    impact: 'alto' | 'medio' | 'bajo';
  }[];
  recommendations: {                // Plan de acción priorizado
    priority: number;
    action: string;
    why: string;
    effort: 'bajo' | 'medio' | 'alto';
  }[];
  strengths: string[];              // Lo que está bien
}
```

### Modelo: Gemini 2.5 Flash
- Endpoint: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- maxOutputTokens: 2048
- temperature: 0.7
- API key: `VITE_GEMINI_KEY` en `.env.local`

---

## Componentes del dashboard

### BusinessBriefPanel
**Path:** `src/components/dashboard/BusinessBriefPanel.tsx`

- Parsea `organizations.description` como JSON con `parseBrief()`
- 6 campos textarea con validación de completitud
- Guarda con `supabase.from('organizations').update()` (requiere RLS policy)
- Callback `onSaved(desc)` para actualizar estado local sin refetch

### WebAuditPanel
**Path:** `src/components/dashboard/WebAuditPanel.tsx`

- Requiere `ctx.snapshots.length > 0` para mostrar el CTA de auditoría
- Llama `runWebAudit(ctx)` de `src/lib/ai.ts`
- Muestra estado vacío si no hay snapshots
- ScoreRing: animación SVG stroke-dashoffset
- Secciones colapsables con AnimatePresence

### OrgDashboard (actualizado)
**Path:** `src/components/dashboard/OrgDashboard.tsx`

Tabs disponibles: `overview | traffic | leads | empresa | audit | ai`

Nuevas cargas en `loadAnalytics()`:
```typescript
supabase.from('site_snapshots')
  .select('*')
  .eq('organization_id', p.id)
  .order('captured_at', { ascending: false })
```

Nueva sección en Overview: **Páginas que más generan leads** — agrupa leads por `page_url`.

El `aiCtx` ahora incluye `brief`, `snapshots` y `leadsByPage`.

---

## Variables de entorno

| Variable | Descripción | Fallback hardcodeado |
|---|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | `https://yynnhqtcvkxmignbmkha.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clave pública anon | Incluida en código |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Clave admin (solo AdminHub) | Incluida en código |
| `VITE_GEMINI_KEY` | API key de Google Gemini | Incluida en código |
| `VITE_ADMIN_SECRET` | Contraseña del panel admin | `idenza_master_2026` |

> ⚠️ **Importante:** Las claves de Supabase están hardcodeadas como fallback. En producción, siempre usar variables de entorno. La `SERVICE_ROLE_KEY` nunca debe estar en el frontend en un entorno público.

---

## Estructura de archivos relevantes

```
src/
├── components/
│   ├── dashboard/
│   │   ├── types.ts              # Lead, Project, Analytics, SiteSnapshot, BusinessBrief
│   │   ├── utils.ts              # statusConfig, timeAgo, shortDate, PRIMARY
│   │   ├── OrgDashboard.tsx      # Dashboard principal (6 tabs)
│   │   ├── BusinessBriefPanel.tsx # Formulario de perfil (NUEVO)
│   │   ├── WebAuditPanel.tsx     # Auditoría IA (NUEVO)
│   │   ├── SetupScreen.tsx       # Pantalla de configuración inicial
│   │   ├── LeadCard.tsx          # Card expandible de lead
│   │   ├── ChartTooltip.tsx      # Tooltip de gráficas
│   │   └── ProjectPicker.tsx     # Selector de proyectos
│   └── hub/
│       └── AIChatPanel.tsx       # Chat conversacional con IA
├── lib/
│   ├── ai.ts                     # OrgContext, sendChatMessage, runWebAudit
│   ├── supabase.ts               # Clientes Supabase (public + admin)
│   ├── auth.tsx                  # Contexto de autenticación
│   └── utils.ts                  # cn() helper
├── pages/
│   ├── ClientDashboard.tsx       # Entry point del dashboard de cliente
│   └── AdminHub.tsx              # Panel de administración Idenza
└── ...

public/
└── tracker.js                    # Script del tracker (vanilla JS)

MANUAL_USUARIO.md                 # Manual para clientes finales
DOCUMENTACION_TECNICA.md          # Este archivo
```

---

## Checklist de despliegue (feature v2)

Para que todas las funcionalidades nuevas estén activas en producción:

- [ ] Ejecutar migración SQL `site_snapshots` en Supabase
- [ ] Ejecutar migración SQL columnas nuevas en `leads`
- [ ] Configurar RLS policy para update en `organizations`
- [ ] Publicar `public/tracker.js` actualizado en `https://idenza.site/tracker.js`
- [ ] Copiar `tracker.js` a `dist/tracker.js` (si se usa como build asset)
- [ ] Verificar que `VITE_GEMINI_KEY` esté en `.env.local` de producción
- [ ] Rebuild y redeploy del frontend

---

## Decisiones de diseño

**¿Por qué almacenar el brief en `description` (JSON) en vez de columnas separadas?**  
Para no requerir una migración de schema adicional. El campo `description` ya existe y tiene la política de update necesaria. La función `parseBrief()` es retrocompatible con texto plano.

**¿Por qué UPSERT en site_snapshots con unique(org_id, page_url)?**  
El tracker puede visitar la misma página múltiples veces. Solo necesitamos el snapshot más reciente por página. El UPSERT con `resolution=merge-duplicates` actualiza el registro existente en vez de duplicar.

**¿Por qué el snapshot espera 1.5 segundos?**  
Para dar tiempo al DOM a renderizarse completamente, especialmente en SPAs (React, Vue, etc.) donde el contenido se monta después del script.

**¿Por qué Gemini y no GPT-4?**  
Google Gemini tiene un tier gratuito generoso y Gemini 2.5 Flash ofrece excelente relación velocidad/calidad para casos de uso de análisis de negocio. La API key está expuesta en el cliente (riesgo conocido y aceptado para este MVP).
