-- ═══════════════════════════════════════════════════════════════════════════
-- IDENZA CORE — Corrección de Caché de Esquema y Columnas Faltantes
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Asegurar que las columnas 'token' y 'owner_email' existan en organizations
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS token TEXT,
  ADD COLUMN IF NOT EXISTS owner_email TEXT;

-- 2. Asegurar que la tabla tracking_tokens exista para evitar advertencias secundarias
CREATE TABLE IF NOT EXISTS public.tracking_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT 'Principal',
  token TEXT UNIQUE NOT NULL DEFAULT encode(extensions.gen_random_bytes(16), 'hex'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FORZAR LA RECARGA DE LA CACHÉ DE ESQUEMA DE POSTGREST (Supabase API)
-- Esto soluciona de inmediato el error: "Could not find the 'token' column of 'organizations' in the schema cache"
NOTIFY pgrst, 'reload schema';

SELECT 'Migration 006_fix_org_token_cache completed successfully. Schema cache reloaded.' AS status;
