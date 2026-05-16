// ─── AI SERVICE (Google Gemini) ────────────────────────────────────────────
// Usa Gemini 2.0 Flash con el contexto real del cliente para dar asesoría.
// API key en .env.local como VITE_GEMINI_KEY

import type { SiteSnapshot, BusinessBrief } from '@/components/dashboard/types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OrgContext {
  orgName: string;
  industry: string | null;
  city: string | null;
  website: string | null;
  totalLeads: number;
  newLeads: number;
  totalVisits: number;
  cities: string[];
  recentLeads: { name: string | null; city: string | null; status: string }[];
  brief: BusinessBrief | null;
  snapshots: SiteSnapshot[];
  leadsByPage: { page: string; count: number }[];
}

// ─── SYSTEM PROMPT PRINCIPAL ──────────────────────────────────────────────
function buildSystemPrompt(ctx: OrgContext): string {
  const citiesList = ctx.cities.length > 0 ? ctx.cities.join(', ') : 'Sin datos aún';
  const recentList = ctx.recentLeads
    .slice(0, 5)
    .map(l => `- ${l.name || 'Sin nombre'} (${l.city || 'ciudad desconocida'}) — ${l.status}`)
    .join('\n');

  const briefSection = ctx.brief
    ? `
═══ PERFIL DEL NEGOCIO ═══
Resumen: ${ctx.brief.summary}
Audiencia objetivo: ${ctx.brief.audience}
Propuesta de valor: ${ctx.brief.value_prop}
Productos/Servicios: ${ctx.brief.services}
Objetivos del sitio: ${ctx.brief.goals}
Desafíos actuales: ${ctx.brief.challenges}
═══════════════════════════`
    : '⚠️ Perfil de negocio incompleto — el cliente no ha completado su brief.';

  const snapshotSection = ctx.snapshots.length > 0
    ? `
═══ ESTRUCTURA DE LA WEB (${ctx.snapshots.length} páginas detectadas) ═══
${ctx.snapshots.map(s => {
  const path = s.page_url.replace(/^https?:\/\/[^/]+/, '') || '/';
  const leadsFromPage = ctx.leadsByPage.find(l => l.page === s.page_url)?.count || 0;
  return `Página: ${path}
  Título: ${s.title || 'Sin título'}
  H1: ${s.h1 || 'Sin H1'}
  Headings: ${s.headings.map(h => h.text).join(' | ') || 'Ninguno'}
  CTAs: ${s.ctas.slice(0, 5).join(' | ') || 'Ninguno detectado'}
  Formularios: ${s.forms.length > 0 ? s.forms.map(f => f.fields.join(', ')).join(' | ') : 'Sin formularios'}
  Tiene teléfono: ${s.has_phone ? 'Sí' : 'No'} | Email: ${s.has_email ? 'Sí' : 'No'} | Chat: ${s.has_live_chat ? 'Sí' : 'No'}
  Palabras aprox: ${s.word_count} | Leads captados desde esta página: ${leadsFromPage}`;
}).join('\n\n')}
═══════════════════════════`
    : '⚠️ Sin snapshots de la web — el tracker aún no ha procesado páginas.';

  const attributionSection = ctx.leadsByPage.length > 0
    ? `
Páginas que más generan leads:
${ctx.leadsByPage.slice(0, 5).map(l => {
  const path = l.page.replace(/^https?:\/\/[^/]+/, '') || '/';
  return `  ${path}: ${l.count} leads`;
}).join('\n')}`
    : '';

  return `Eres el asesor de negocios digitales de Idenza para el cliente "${ctx.orgName}".
Tu rol: analizar los datos reales del cliente y dar recomendaciones concretas, accionables y en español.

═══ DATOS ACTUALES DEL CLIENTE ═══
Empresa: ${ctx.orgName}
Rubro: ${ctx.industry || 'No especificado'}
Ciudad base: ${ctx.city || 'No especificada'}
Sitio web: ${ctx.website || 'No especificado'}

Leads totales: ${ctx.totalLeads}
Leads nuevos (sin atender): ${ctx.newLeads}
Visitas al sitio: ${ctx.totalVisits}
Ciudades de origen de clientes: ${citiesList}
${attributionSection}

Últimos leads:
${recentList || 'Sin leads aún'}
═══════════════════════════════════

${briefSection}

${snapshotSection}

Instrucciones:
- Responde SIEMPRE basándote en los datos reales del cliente.
- Si tienes datos de la web (snapshots), úsalos para dar recomendaciones específicas sobre páginas concretas.
- Sé directo y específico. Nada genérico.
- Usa bullet points cuando sea útil.
- Si no hay datos suficientes, dilo y sugiere qué hacer para obtenerlos.
- Máximo 250 palabras por respuesta salvo que el usuario pida más detalle.
- Responde siempre en español.`;
}

// ─── PROMPT DE AUDITORÍA WEB ──────────────────────────────────────────────
function buildAuditPrompt(ctx: OrgContext): string {
  const snapshotsText = ctx.snapshots.length > 0
    ? ctx.snapshots.map(s => {
        const path = s.page_url.replace(/^https?:\/\/[^/]+/, '') || '/';
        const leadsFromPage = ctx.leadsByPage.find(l => l.page === s.page_url)?.count || 0;
        return `PÁGINA: ${path}
Título: ${s.title || 'Sin título'} | H1: ${s.h1 || 'Sin H1'}
Headings: ${s.headings.map(h => `${h.level}: ${h.text}`).join(' | ') || 'Ninguno'}
CTAs detectados: ${s.ctas.join(', ') || 'NINGUNO'}
Formularios: ${s.forms.length > 0 ? s.forms.map(f => '[' + f.fields.join(', ') + ']').join(' | ') : 'SIN FORMULARIOS'}
Contacto visible: teléfono=${s.has_phone}, email=${s.has_email}, chat=${s.has_live_chat}
Palabras: ${s.word_count} | Leads generados: ${leadsFromPage}`;
      }).join('\n\n')
    : 'Sin datos de estructura web.';

  const briefText = ctx.brief
    ? `Negocio: ${ctx.brief.summary}
Audiencia: ${ctx.brief.audience}
Diferencial: ${ctx.brief.value_prop}
Servicios: ${ctx.brief.services}
Objetivos: ${ctx.brief.goals}
Desafíos: ${ctx.brief.challenges}`
    : 'Perfil de negocio no completado.';

  return `Eres un experto en conversión web y UX para PYMES latinoamericanas. Analiza esta web y genera un informe de auditoría estructurado.

DATOS DEL NEGOCIO:
${briefText}

MÉTRICAS:
- Visitas totales: ${ctx.totalVisits}
- Leads captados: ${ctx.totalLeads}
- Tasa de conversión: ${ctx.totalVisits > 0 ? ((ctx.totalLeads / ctx.totalVisits) * 100).toFixed(2) : 0}%

ESTRUCTURA DE LA WEB:
${snapshotsText}

Genera el informe con EXACTAMENTE este formato JSON (sin texto extra, solo JSON):
{
  "score": <número del 1 al 10>,
  "summary": "<resumen ejecutivo en 2-3 oraciones>",
  "critical": [
    {"title": "<problema crítico>", "description": "<explicación específica con nombre de página>", "page": "<ruta>"}
  ],
  "opportunities": [
    {"title": "<oportunidad>", "description": "<cómo aprovecharla>", "impact": "alto|medio|bajo"}
  ],
  "recommendations": [
    {"priority": 1, "action": "<acción concreta>", "why": "<por qué hacerla>", "effort": "bajo|medio|alto"}
  ],
  "strengths": ["<punto fuerte 1>", "<punto fuerte 2>"]
}

Máximo: 3 problemas críticos, 3 oportunidades, 5 recomendaciones, 3 fortalezas.
Sé específico con las páginas y datos reales. Responde SOLO con el JSON válido.`;
}

// ─── ENVÍO A GEMINI (con retry + fallback de modelo) ──────────────────────
const GEMINI_MODELS = [
  'gemini-2.5-flash',        // preferido — más inteligente
  'gemini-2.0-flash',        // fallback rápido
  'gemini-1.5-flash',        // último recurso
];

async function callGeminiModel(
  model: string,
  apiKey: string,
  systemPrompt: string,
  contents: object[],
  maxOutputTokens = 2048
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens, temperature: 0.7 },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `Error IA: ${response.status}`;
    const error = new Error(msg) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta.';
}

async function callGemini(systemPrompt: string, userMessage: string, history: ChatMessage[] = []): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_KEY || '';

  const contents = [
    ...history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const RETRYABLE = new Set([429, 500, 503, 529]);
  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    // Hasta 3 intentos por modelo en errores temporales
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await callGeminiModel(model, apiKey, systemPrompt, contents);
      } catch (e) {
        const err = e as Error & { status?: number };
        lastError = err;

        const isRetryable = err.status != null && RETRYABLE.has(err.status);
        if (!isRetryable) throw err; // Error definitivo (401, 400, etc.)

        if (attempt < 2) {
          // Backoff exponencial: 1s, 2s, 4s…
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }
    }
    // Todos los intentos para este modelo fallaron → probar el siguiente modelo
  }

  throw lastError ?? new Error('No se pudo conectar con la IA. Intenta en unos segundos.');
}


// ─── CHAT PRINCIPAL ───────────────────────────────────────────────────────
export async function sendChatMessage(
  messages: ChatMessage[],
  ctx: OrgContext
): Promise<string> {
  const history = messages.slice(0, -1);
  const last = messages[messages.length - 1];
  return callGemini(buildSystemPrompt(ctx), last.content, history.slice(-18));
}

// ─── AUDITORÍA WEB ────────────────────────────────────────────────────────
export interface WebAuditResult {
  score: number;
  summary: string;
  critical: { title: string; description: string; page: string }[];
  opportunities: { title: string; description: string; impact: 'alto' | 'medio' | 'bajo' }[];
  recommendations: { priority: number; action: string; why: string; effort: 'bajo' | 'medio' | 'alto' }[];
  strengths: string[];
}

// Normaliza valores que Gemini puede devolver en inglés o con mayúsculas
function normalizeLevel(val: string, map: Record<string, string>, fallback: string): string {
  return map[val?.toLowerCase?.()?.trim()] ?? fallback;
}

const EFFORT_MAP: Record<string, string> = { bajo: 'bajo', low: 'bajo', medio: 'medio', medium: 'medio', alto: 'alto', high: 'alto' };
const IMPACT_MAP: Record<string, string> = { alto: 'alto', high: 'alto', medio: 'medio', medium: 'medio', bajo: 'bajo', low: 'bajo' };

export async function runWebAudit(ctx: OrgContext): Promise<WebAuditResult> {
  const raw = await callGemini(
    'Eres un experto en auditoría web para PYMES. Responde SOLO con JSON válido, sin markdown ni texto extra.',
    buildAuditPrompt(ctx)
  );

  // Limpiar posibles bloques markdown de la respuesta
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  const parsed = JSON.parse(cleaned) as WebAuditResult;

  // Normalizar valores de effort e impact para robustez ante variaciones de Gemini
  return {
    ...parsed,
    score: Math.min(10, Math.max(1, Math.round(Number(parsed.score) || 5))),
    critical: (parsed.critical || []).slice(0, 3),
    opportunities: (parsed.opportunities || []).slice(0, 3).map(o => ({
      ...o,
      impact: normalizeLevel(o.impact, IMPACT_MAP, 'medio') as WebAuditResult['opportunities'][0]['impact'],
    })),
    recommendations: (parsed.recommendations || []).slice(0, 5).map((r, i) => ({
      ...r,
      priority: r.priority ?? i + 1,
      effort: normalizeLevel(r.effort, EFFORT_MAP, 'medio') as WebAuditResult['recommendations'][0]['effort'],
    })),
    strengths: (parsed.strengths || []).slice(0, 3),
  };
}

// ─── REPORTE MENSUAL CRM ──────────────────────────────────────────────────
export interface MonthlyReport {
  healthScore: number;           // 1-10
  summary: string;               // resumen ejecutivo para el cliente
  metrics: {
    visits: number;
    leads: number;
    conversionRate: number;      // %
    mrr: number;                 // Soles (S/)
  };
  highlights: string[];          // logros del mes
  opportunities: string[];       // nuevas oportunidades detectadas (cuantificadas)
  risks: string[];               // alertas y riesgos detectados
  importantDates: { date: string; event: string; action: string }[]; // Fechas clave próximas
  actionPlan: {
    priority: number;
    action: string;
    impact: 'alto' | 'medio' | 'bajo';
    effort: 'bajo' | 'medio' | 'alto';
  }[];
  whatsappMessage: string;       // mensaje corto listo para enviar por WhatsApp
}

interface ReportContext {
  orgName: string;
  industry: string | null;
  city: string | null;
  website: string | null;
  period: string;
  totalLeads: number;
  newLeads: number;
  totalVisits: number;
  leadsByStatus: Record<string, number>;
  topPages: { page: string; count: number }[];
  plan: string | null;
  mrr: number;
  snapshots: SiteSnapshot[]; // Para detectar promociones y fechas
}

function buildReportPrompt(ctx: ReportContext): string {
  const conversion = ctx.totalVisits > 0
    ? ((ctx.totalLeads / ctx.totalVisits) * 100).toFixed(2)
    : '0';

  const topPagesText = ctx.topPages.length > 0
    ? ctx.topPages.map(p => `  ${p.page.replace(/^https?:\/\/[^/]+/, '') || '/'}: ${p.count} leads`).join('\n')
    : '  Sin datos de paginas aun';

  const snapshotsText = ctx.snapshots.length > 0
    ? ctx.snapshots.map(s => `  - ${s.page_url}: Promos detectadas: ${s.detected_promos?.join(', ') || 'Ninguna'}`).join('\n')
    : '  Sin datos de promociones';

  return `Eres el sistema analítico de IDENZA. Genera el informe mensual para "${ctx.orgName}" (${ctx.period}).
Tu objetivo es dar valor estratégico mezclando datos cuantitativos (métricas) y cualitativos (comportamiento y contenido).

DATOS CLAVE:
- Visitas: ${ctx.totalVisits} | Leads: ${ctx.totalLeads} | Conversión: ${conversion}%
- MRR: S/${ctx.mrr} | Plan: ${ctx.plan ?? 'hub'}
- Páginas Top:
${topPagesText}

PROMOCIONES Y EVENTOS DETECTADOS EN LA WEB:
${snapshotsText}

Genera el informe con este JSON exacto:
{
  "healthScore": <1-10>,
  "summary": "<resumen ejecutivo profesional>",
  "metrics": { "visits": ${ctx.totalVisits}, "leads": ${ctx.totalLeads}, "conversionRate": ${conversion}, "mrr": ${ctx.mrr} },
  "highlights": ["<logro 1>", "<logro 2>"],
  "opportunities": [
    "<oportunidad basada en una página con visitas pero pocos leads>",
    "<oportunidad basada en una promoción detectada>"
  ],
  "risks": [
    "<riesgo: ej. alta tasa de abandono en X página>",
    "<riesgo: ej. falta de CTAs en páginas populares>"
  ],
  "importantDates": [
    {"date": "<YYYY-MM-DD>", "event": "<evento detectado o sugerido>", "action": "<qué debe hacer la empresa>"}
  ],
  "actionPlan": [
    {"priority": 1, "action": "<acción>", "impact": "alto|medio|bajo", "effort": "bajo|medio|alto"}
  ],
  "whatsappMessage": "<resumen muy corto para WhatsApp>"
}

Reglas:
- Sé específico. No uses frases genéricas.
- Si detectas una promoción en los snapshots, úsala para definir una 'Fecha Importante'.
- Identifica riesgos si las páginas top no tienen una buena tasa de conversión.`;
}

export async function generateMonthlyReport(ctx: ReportContext): Promise<MonthlyReport> {
  const raw = await callGemini(
    'Eres el analista digital de IDENZA. Responde SOLO con JSON valido, sin markdown ni texto extra.',
    buildReportPrompt(ctx)
  );

  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  const parsed = JSON.parse(cleaned) as MonthlyReport;

  return {
    ...parsed,
    healthScore: Math.min(10, Math.max(1, Math.round(Number(parsed.healthScore) || 5))),
    highlights:  (parsed.highlights  || []).slice(0, 3),
    risks:       (parsed.risks       || []).slice(0, 3),
    actionPlan:  (parsed.actionPlan  || []).slice(0, 5).map((a, i) => ({
      ...a,
      priority: a.priority ?? i + 1,
      impact:   normalizeLevel(String(a.impact), IMPACT_MAP, 'medio') as MonthlyReport['actionPlan'][0]['impact'],
      effort:   normalizeLevel(String(a.effort), EFFORT_MAP, 'medio') as MonthlyReport['actionPlan'][0]['effort'],
    })),
  };
}

// ─── INVESTIGADOR DE LEADS (Estudio de casos individuales) ──────────────────
export interface LeadAnalysis {
  intent: string;               // Intención detectada
  probability: 'alta' | 'media' | 'baja'; // Probabilidad de cierre
  insights: string[];           // Hallazgos clave
  recommendation: string;       // Qué decirle al cliente
}

function buildLeadAnalysisPrompt(lead: any, ctx: OrgContext): string {
  const brief = ctx.brief;
  const companyProfile = brief 
    ? `
PERFIL ESPECÍFICO DE LA EMPRESA:
- Actividad: ${brief.summary}
- Público Objetivo: ${brief.audience}
- Propuesta de Valor: ${brief.value_prop}
- Servicios/Productos: ${brief.services}
- Metas de Venta: ${brief.goals}
- Desafíos: ${brief.challenges}`
    : 'Perfil de negocio no disponible. Usa solo la información del sitio web.';

  const pagePath = lead.page_url?.replace(/^https?:\/\/[^/]+/, '') || '/';
  const pageSnapshot = ctx.snapshots.find(s => s.page_url === lead.page_url);
  const snapshotContext = pageSnapshot
    ? `
CONTEXTO DE LA PÁGINA DE CONVERSIÓN (${pagePath}):
- Título: ${pageSnapshot.title}
- Oferta Principal (H1): ${pageSnapshot.h1}
- Secciones Visitadas: ${pageSnapshot.headings.map(h => h.text).join(', ')}
- CTAs Disponibles: ${pageSnapshot.ctas.join(', ')}`
    : `El usuario convirtió en la ruta: ${pagePath}`;
  
  return `Eres el Investigador Comercial Senior de "${ctx.orgName}". Tu misión NO es dar consejos genéricos, sino analizar este CASO ESPECÍFICO basándote EXCLUSIVAMENTE en el ADN de esta empresa y los datos de navegación del usuario.

${companyProfile}

${snapshotContext}

DATOS DEL LEAD (EL CASO A ESTUDIAR):
- Nombre: ${lead.name || 'Anónimo'}
- Email: ${lead.email || 'No provisto'}
- Teléfono: ${lead.phone || 'No provisto'}
- Mensaje del usuario: "${lead.message || 'Sin mensaje'}"
- Tiempo de maduración (tiempo en página): ${lead.time_on_page || '—'} segundos
- Origen (Referrer): ${lead.referrer || 'Directo'}
- Ubicación: ${lead.city || 'Desconocida'}, ${lead.country || 'Desconocida'}

TAREAS DE INVESTIGACIÓN:
1. Análisis de ADN: Cruza la propuesta de valor de la empresa con el mensaje del usuario. ¿Cómo encaja lo que ofrecemos con lo que él pide?
2. Estudio de Comportamiento: Basado en el tiempo en página y la sección donde convirtió (${pagePath}), ¿qué tan decidido está?
3. Estrategia Personalizada: Define el ángulo de venta exacto que el vendedor debe usar.

RESPONDE ÚNICAMENTE CON ESTE JSON:
{
  "intent": "<análisis profundo de la intención real del usuario>",
  "probability": "alta|media|baja",
  "insights": [
    "<insight sobre el encaje con la empresa>",
    "<insight sobre el comportamiento en la web>"
  ],
  "recommendation": "<recomendación táctica basada en el ADN de la empresa y el contexto del lead>"
}`;
}

export async function analyzeLeadCase(lead: any, ctx: OrgContext): Promise<LeadAnalysis> {
  const raw = await callGemini(
    'Eres un Investigador Comercial experto. Responde SOLO con JSON.',
    buildLeadAnalysisPrompt(lead, ctx)
  );

  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    ...parsed,
    probability: normalizeLevel(String(parsed.probability), IMPACT_MAP, 'media') as LeadAnalysis['probability'],
  };
}
