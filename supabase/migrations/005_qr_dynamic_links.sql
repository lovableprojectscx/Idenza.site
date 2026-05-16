-- ═══════════════════════════════════════════════════════════════════════════
-- QR DINÁMICO — Tabla de links cortos con redirect real
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Tabla qr_links ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.qr_links (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT        NOT NULL UNIQUE,
  destination   TEXT        NOT NULL,
  industry_id   TEXT        NOT NULL DEFAULT 'restaurante',
  template_id   TEXT        NOT NULL DEFAULT 'clasico',
  org_id        UUID        REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  click_count   INTEGER     NOT NULL DEFAULT 0,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  custom_colors JSONB
);

-- ── Índices ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_qr_links_slug      ON public.qr_links (slug);
CREATE INDEX IF NOT EXISTS idx_qr_links_org_id    ON public.qr_links (org_id);
CREATE INDEX IF NOT EXISTS idx_qr_links_created_by ON public.qr_links (created_by);

-- ── Trigger updated_at ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS qr_links_updated_at ON public.qr_links;
CREATE TRIGGER qr_links_updated_at
  BEFORE UPDATE ON public.qr_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.qr_links ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede resolver un slug (para el redirect)
CREATE POLICY "qr_links_public_read"
  ON public.qr_links FOR SELECT
  USING (is_active = TRUE);

-- Escritura/Update/Delete: solo usuarios autenticados
CREATE POLICY "qr_links_auth_insert"
  ON public.qr_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "qr_links_auth_update"
  ON public.qr_links FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "qr_links_auth_delete"
  ON public.qr_links FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── RPC: increment_qr_click (anon safe) ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_qr_click(link_id UUID)
RETURNS VOID LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.qr_links
  SET    click_count = click_count + 1,
         updated_at  = NOW()
  WHERE  id = link_id;
$$;
