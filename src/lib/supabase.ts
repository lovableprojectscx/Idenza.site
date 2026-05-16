import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const _raw_sk = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SERVICE_ROLE_KEY || '';
const SERVICE_KEY = _raw_sk && !_raw_sk.startsWith('PEGA_AQUÍ') ? _raw_sk : '';
export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || '';

// Public client — used everywhere
export const supabase = createClient(SUPABASE_URL, ANON_KEY);

// Admin client — only used inside AdminHub (protected route, admin only)
export const isAdminConfigured = !!SERVICE_KEY;
export const supabaseAdmin = isAdminConfigured
  ? createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false, storageKey: 'idenza-admin' },
    })
  : supabase; // fallback to public client when no service key is available

export const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || '';
export const TRACKER_HOST = 'https://idenza.site';
