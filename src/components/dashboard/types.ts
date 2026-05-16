// ─── Plan Tiers ───────────────────────────────────────────────────────────────
export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface PlanConfig {
  tier: PlanTier;
  label: string;
  color: string;
  features: {
    leads: boolean;
    traffic: boolean;
    behavior: boolean;        // scroll depth, rage clicks, time on page
    referrers: boolean;       // where traffic comes from
    browsers: boolean;        // browser breakdown
    heatmapData: boolean;     // click coordinates
    funnelEvents: boolean;    // form_started, session_leave
    aiAdvisor: boolean;
    aiLeadInvestigator: boolean;
    audit: boolean;
    exportCSV: boolean;
    realtimeAlerts: boolean;
  };
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    tier: 'free', label: 'Free', color: '#6b7280',
    features: {
      leads: false, traffic: false, behavior: false,
      referrers: false, browsers: false, heatmapData: false,
      funnelEvents: false, aiAdvisor: false, aiLeadInvestigator: false,
      audit: false, exportCSV: false, realtimeAlerts: false,
    },
  },
  starter: {
    tier: 'starter', label: 'Starter', color: '#3b82f6',
    features: {
      leads: true, traffic: true, behavior: false,
      referrers: true, browsers: false, heatmapData: false,
      funnelEvents: false, aiAdvisor: false, aiLeadInvestigator: false,
      audit: false, exportCSV: false, realtimeAlerts: true,
    },
  },
  professional: {
    tier: 'professional', label: 'Professional', color: '#7B2CBF',
    features: {
      leads: true, traffic: true, behavior: true,
      referrers: true, browsers: true, heatmapData: true,
      funnelEvents: true, aiAdvisor: false, aiLeadInvestigator: true,
      audit: true, exportCSV: true, realtimeAlerts: true,
    },
  },
  enterprise: {
    tier: 'enterprise', label: 'Enterprise', color: '#CCFF00',
    features: {
      leads: true, traffic: true, behavior: true,
      referrers: true, browsers: true, heatmapData: true,
      funnelEvents: true, aiAdvisor: true, aiLeadInvestigator: true,
      audit: true, exportCSV: true, realtimeAlerts: true,
    },
  },
};

export function resolvePlan(planName: string | null | undefined): PlanTier {
  const normalized = (planName ?? '').toLowerCase();
  if (normalized.includes('enterprise') || normalized.includes('dominio')) return 'enterprise';
  if (normalized.includes('professional') || normalized.includes('pro') || normalized.includes('crecimiento')) return 'professional';
  if (normalized.includes('starter') || normalized.includes('basico') || normalized.includes('básico')) return 'starter';
  return 'free';
}

// ─── Lead ─────────────────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  page_url: string | null;
  city: string | null;
  country: string | null;
  status: 'new' | 'contacted' | 'closed';
  time_on_page: number | null;
  session_id: string | null;
  referrer: string | null;
  created_at: string;
}

// ─── Event (raw tracker event) ────────────────────────────────────────────────
export interface TrackerEvent {
  id: string;
  event_type: string;  // pageview, scroll_50, scroll_90, click_cta, rage_click, form_started, session_leave, consent_granted, pageview_anonymous
  page_url: string | null;
  referrer: string | null;
  city: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  session_id: string | null;
  metadata: {
    text?: string;
    x?: number;
    y?: number;
    screen_width?: number;
    is_rage_click?: boolean;
    depth?: number;
    time_active_seconds?: number;
    form_id?: string;
  } | null;
  created_at: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  industry: string | null;
  city: string | null;
  description: string | null;
  token: string;
  leads_count: number;
  events_count: number;
  plan_name: string | null;
}

export interface DayData {
  date: string;
  label: string;
  leads: number;
  visits: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface Analytics {
  top_pages: { url: string; count: number }[];
  by_hour: { hour: number; count: number }[];
  by_device: { device: string; count: number }[];
  by_country: { country: string; count: number }[];
  unique_sessions: number;
  // ── New enriched fields from tracker events ──
  by_browser: { browser: string; count: number }[];
  by_event_type: { event_type: string; count: number }[];
  by_referrer: { referrer: string; count: number }[];
  scroll_50_rate: number;    // % of sessions that scrolled 50%
  scroll_90_rate: number;    // % of sessions that scrolled 90%
  rage_click_count: number;
  form_started_count: number;
  avg_time_on_page: number;  // seconds
  consent_rate: number;      // % of visitors who accepted cookies
}

export interface SiteSnapshot {
  id: string;
  organization_id: string;
  page_url: string;
  title: string | null;
  meta_description: string | null;
  h1: string | null;
  headings: { level: string; text: string }[];
  ctas: string[];
  forms: { fields: string[] }[];
  word_count: number;
  has_phone: boolean;
  has_email: boolean;
  has_live_chat: boolean;
  detected_promos: string[] | null;
  device: string | null;
  captured_at: string;
}

// Brief de negocio almacenado como JSON en organizations.description
export interface BusinessBrief {
  v: number;
  summary: string;
  audience: string;
  value_prop: string;
  services: string;
  goals: string;
  challenges: string;
}

export function parseBrief(description: string | null): BusinessBrief | null {
  if (!description) return null;
  try {
    const parsed = JSON.parse(description);
    if (parsed && parsed.v === 1) return parsed as BusinessBrief;
    return null;
  } catch {
    return null;
  }
}

export function briefToText(brief: BusinessBrief): string {
  return `
Resumen del negocio: ${brief.summary}
Audiencia objetivo: ${brief.audience}
Propuesta de valor / diferencial: ${brief.value_prop}
Productos y servicios: ${brief.services}
Objetivos del sitio web: ${brief.goals}
Desafíos actuales: ${brief.challenges}
  `.trim();
}
