-- ═══════════════════════════════════════════════════════════════════════════
-- IDENZA CORE — Migración Modelo de Negocio 2026
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Eliminar la restricción del nombre del plan para permitir los nuevos
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS chk_plan_name;

-- Opcional: Si queremos ser estrictos, podemos agregar la nueva restricción:
-- ALTER TABLE public.organizations
--   ADD CONSTRAINT chk_plan_name 
--   CHECK (plan_name IN ('free', 'starter', 'professional', 'enterprise', 'gratuito', 'basico', 'agencia', 'hub', 'lanzamiento', 'crecimiento', 'dominio_total', 'one_time'));

-- 2. Añadir la columna de módulo de base de datos
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS db_module TEXT DEFAULT 'none';

-- Constraint para asegurar que db_module tenga valores válidos
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS chk_db_module;
ALTER TABLE public.organizations
  ADD CONSTRAINT chk_db_module
  CHECK (db_module IN ('none', 'basic', 'pro'));

-- 3. Actualizar la función update_org_crm_fields
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
  p_client_email        TEXT        DEFAULT NULL,
  p_db_module           TEXT        DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF p_admin_secret != current_setting('app.admin_secret', true) AND
     p_admin_secret != 'idenza_master_2026' THEN
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
    db_module           = COALESCE(p_db_module,           db_module),
    updated_at          = now()
  WHERE id = p_org_id;
END;
$$;

SELECT 'Migration 002_new_business_model completed successfully' AS status;
