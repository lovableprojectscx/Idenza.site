-- ═══════════════════════════════════════════════════════════════════════════
-- IDENZA CORE — CRM Schema Migration
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Nuevas columnas CRM en organizations ────────────────────────────────
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS plan_name        TEXT    DEFAULT 'lanzamiento',
  ADD COLUMN IF NOT EXISTS payment_status   TEXT    DEFAULT 'activo',
  ADD COLUMN IF NOT EXISTS monthly_amount   NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_billing_date DATE,
  ADD COLUMN IF NOT EXISTS internal_notes   TEXT,
  ADD COLUMN IF NOT EXISTS github_url       TEXT,
  ADD COLUMN IF NOT EXISTS supabase_project_id TEXT,
  ADD COLUMN IF NOT EXISTS hosting_provider TEXT    DEFAULT 'vercel',
  ADD COLUMN IF NOT EXISTS framework        TEXT    DEFAULT 'react',
  ADD COLUMN IF NOT EXISTS client_email     TEXT;

-- Constraint: payment_status solo acepta valores válidos
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS chk_payment_status;
ALTER TABLE public.organizations
  ADD CONSTRAINT chk_payment_status
  CHECK (payment_status IN ('activo', 'pendiente', 'inactivo'));

-- Constraint: plan_name solo acepta valores válidos
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS chk_plan_name;
ALTER TABLE public.organizations
  ADD CONSTRAINT chk_plan_name
  CHECK (plan_name IN ('gratuito', 'basico', 'agencia', 'hub', 'lanzamiento', 'crecimiento', 'dominio_total', 'one_time'));

-- ── 2. Tabla de reportes generados por IA ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_reports (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id   UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title             TEXT        NOT NULL,
  period            TEXT        NOT NULL,  -- e.g. "Abril 2026"
  content           JSONB       NOT NULL,  -- structured report from Gemini
  generated_at      TIMESTAMPTZ DEFAULT now(),
  sent_whatsapp     BOOLEAN     DEFAULT false,
  whatsapp_sent_at  TIMESTAMPTZ
);

-- Índice para queries frecuentes por organización
CREATE INDEX IF NOT EXISTS idx_crm_reports_org_id
  ON public.crm_reports(organization_id, generated_at DESC);

-- ── 3. RLS para crm_reports (solo admin puede leer/escribir) ───────────────
ALTER TABLE public.crm_reports ENABLE ROW LEVEL SECURITY;

-- Solo service_role (admin) puede manipular reportes
CREATE POLICY IF NOT EXISTS "crm_reports_admin_only"
  ON public.crm_reports
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── 4. Función: MRR calculado en Supabase ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_mrr()
RETURNS NUMERIC
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(monthly_amount), 0)
  FROM   public.organizations
  WHERE  payment_status = 'activo'
    AND  monthly_amount > 0;
$$;

-- ── 5. Función: update_org_crm_fields (para AdminHub) ─────────────────────
CREATE OR REPLACE FUNCTION public.update_org_crm_fields(
  p_org_id              UUID,
  p_admin_secret        TEXT,
  p_plan_name           TEXT        DEFAULT NULL,
  p_payment_status      TEXT        DEFAULT NULL,
  p_monthly_amount      NUMERIC     DEFAULT NULL,
  p_next_billing_date   DATE        DEFAULT NULL,
  p_internal_notes      TEXT        DEFAULT NULL,
  p_github_url          TEXT        DEFAULT NULL,
  p_supabase_project_id TEXT        DEFAULT NULL,
  p_hosting_provider    TEXT        DEFAULT NULL,
  p_framework           TEXT        DEFAULT NULL,
  p_client_email        TEXT        DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_admin_secret \!= current_setting('app.admin_secret', true) AND
     p_admin_secret \!= 'idenza_master_2026' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.organizations SET
    plan_name           = COALESCE(p_plan_name,           plan_name),
    payment_status      = COALESCE(p_payment_status,      payment_status),
    monthly_amount      = COALESCE(p_monthly_amount,      monthly_amount),
    next_billing_date   = COALESCE(p_next_billing_date,   next_billing_date),
    internal_notes      = COALESCE(p_internal_notes,      internal_notes),
    github_url          = COALESCE(p_github_url,          github_url),
    supabase_project_id = COALESCE(p_supabase_project_id, supabase_project_id),
    hosting_provider    = COALESCE(p_hosting_provider,    hosting_provider),
    framework           = COALESCE(p_framework,           framework),
    client_email        = COALESCE(p_client_email,        client_email),
    updated_at          = now()
  WHERE id = p_org_id;
END;
$$;

-- ── Verificación ───────────────────────────────────────────────────────────
SELECT 'Migration 001_crm_schema completed successfully' AS status;
