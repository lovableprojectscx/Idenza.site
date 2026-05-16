import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * QRRedirect — resuelve idenza.site/r/:slug → destino real
 */
export default function QRRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');
  const [destination, setDestination] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!slug) { 
      console.error('[QR] No slug provided in URL');
      setStatus('error'); 
      return; 
    }

    const resolve = async () => {
      try {
        console.log(`[QR] Resolving slug: ${slug}`);
        
        const { data, error } = await supabase
          .from('qr_links')
          .select('id, destination, is_active')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('[QR] Supabase error:', error);
          setErrorMessage(error.message);
          setStatus('error');
          return;
        }

        if (!data) {
          console.error('[QR] No data returned for slug:', slug);
          setStatus('error');
          return;
        }

        if (!data.is_active) {
          console.warn('[QR] Link is inactive:', slug);
          setErrorMessage('Este link ha sido desactivado temporalmente.');
          setStatus('error');
          return;
        }

        console.log('[QR] Found destination:', data.destination);
        setDestination(data.destination);
        setStatus('redirecting');

        // Increment click counter (fire & forget)
        void (async () => {
          const { error: clickError } = await supabase.rpc('increment_qr_click', { link_id: data.id });
          if (clickError) console.error('[QR] Error incrementing click:', clickError);
          else console.log('[QR] Click incremented');
        })();

        // Use a small timeout to ensure the UI updates to "redirecting" before the browser freezes for navigation
        setTimeout(() => {
          console.log('[QR] Navigating to:', data.destination);
          window.location.replace(data.destination);
        }, 800);

      } catch (err) {
        console.error('[QR] Unexpected error:', err);
        setErrorMessage('Ocurrió un error inesperado al procesar el link.');
        setStatus('error');
      }
    };

    resolve();
  }, [slug]);

  // ── Pantalla de carga / Redirección ─────────────────────────────────────────
  if (status === 'loading' || status === 'redirecting') {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '24px',
          padding: '20px',
        }}
      >
        {/* Idenza wordmark */}
        <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '24px', letterSpacing: '-1px' }}>
          IDENZA
        </div>

        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          <div style={{
            width: '100%', height: '100%',
            border: '2px solid rgba(255,255,255,0.05)',
            borderTopColor: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }} />
        </div>

        {destination && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <a 
              href={destination}
              style={{
                display: 'inline-block',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '11px',
                textDecoration: 'none',
              }}
            >
              Redirigiendo...
            </a>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // ── Error — slug no encontrado o inactivo ──────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        gap: '16px',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <div style={{ 
        width: '64px', height: '64px', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        🔗
      </div>

      <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, margin: '8px 0 0' }}>
        Enlace no disponible
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0, maxWidth: '280px', lineHeight: 1.5 }}>
        {errorMessage || 'Este link no existe o ha sido desactivado. Por favor, verifica el código QR.'}
      </p>

      <a
        href="https://idenza.site"
        style={{
          marginTop: '12px',
          padding: '12px 32px',
          background: '#ffffff',
          color: '#0a0a0a',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Ir a Idenza
      </a>
    </div>
  );
}
