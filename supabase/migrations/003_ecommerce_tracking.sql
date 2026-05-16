-- ═══════════════════════════════════════════════════════════════════════════
-- IDENZA CORE — E-Commerce Tracking Migration
-- Añade soporte para guardar detalles de productos y metadatos en eventos.
-- ═══════════════════════════════════════════════════════════════════════════

-- Añadir columna metadata de tipo JSONB a la tabla events (si no existe)
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Verificación
SELECT 'Migration 003_ecommerce_tracking completed successfully' AS status;
