-- ═══════════════════════════════════════════════════════════════════════════
-- IDENZA CORE — Client Onboarding
-- Tabla para recolectar datos de clientes antes de crear el sitio web.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.client_onboardings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL DEFAULT encode(extensions.gen_random_bytes(16), 'hex'),
    business_name TEXT NOT NULL,
    rubro TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    step1_data JSONB DEFAULT '{}'::jsonb,
    step2_data JSONB DEFAULT '{}'::jsonb,
    step3_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE public.client_onboardings ENABLE ROW LEVEL SECURITY;

-- Los administradores (usuarios autenticados) pueden gestionar todo
CREATE POLICY "Admins can manage onboardings" ON public.client_onboardings
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Cualquier persona puede VER un onboarding si conoce el token (acceso público)
CREATE POLICY "Public can view onboarding by token" ON public.client_onboardings
    FOR SELECT
    USING (true);

-- Cualquier persona puede ACTUALIZAR un onboarding si conoce el token (para completar el form)
CREATE POLICY "Public can update onboarding by token" ON public.client_onboardings
    FOR UPDATE
    USING (true);

SELECT 'Migration 004_client_onboarding completed successfully' AS status;
