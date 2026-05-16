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
}

export interface DayData {
  date: string;
  label: string;
  leads: number;
  visits: number;
}

export interface Analytics {
  top_pages: { url: string; count: number }[];
  by_hour: { hour: number; count: number }[];
  by_device: { device: string; count: number }[];
  by_country: { country: string; count: number }[];
  unique_sessions: number;
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
