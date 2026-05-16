(function () {
  'use strict';

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://yynnhqtcvkxmignbmkha.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bm5ocXRjdmt4bWlnbmJta2hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzE0NjcsImV4cCI6MjA4ODY0NzQ2N30.EKaRumsqdu2zZXBZ_0rCb3-nrQgrlqDMxFUUanvocHY';

  // ─── READ SNIPPET CONFIG ───────────────────────────────────────────────────
  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var TOKEN = script.getAttribute('data-token');
  var ORG_ID = script.getAttribute('data-org');

  if (!TOKEN || !ORG_ID) {
    console.warn('[Idenza Tracker] Falta data-token o data-org.');
    return;
  }

  // ─── SESSION ID ───────────────────────────────────────────────────────────
  var SESSION_KEY = 'idz_session';
  function getSessionId() {
    var sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  }

  // ─── PAGE ENTRY TIME (para time-on-page en leads) ─────────────────────────
  var pageEntryTime = Date.now();

  // ─── DEVICE & BROWSER DETECTION ──────────────────────────────────────────
  function getDevice() {
    var ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  function getBrowser() {
    var ua = navigator.userAgent;
    if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) return 'Chrome';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (/Edge/i.test(ua)) return 'Edge';
    if (/OPR|Opera/i.test(ua)) return 'Opera';
    return 'Other';
  }

  // ─── GEO (IP-based) ───────────────────────────────────────────────────────
  var geoCache = null;
  function getGeo(cb) {
    if (geoCache) { cb(geoCache); return; }
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        geoCache = { city: d.city || null, country: d.country_name || null };
        cb(geoCache);
      })
      .catch(function () { cb({ city: null, country: null }); });
  }

  // ─── SEND TO SUPABASE (con retry) ─────────────────────────────────────────
  function send(table, payload, retries) {
    retries = retries || 0;
    fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function(r) {
      if (!r.ok && r.status >= 500 && retries < 3) {
        setTimeout(function() { send(table, payload, retries + 1); }, 1000 * Math.pow(2, retries));
      }
    }).catch(function () {
      if (retries < 3) {
        setTimeout(function() { send(table, payload, retries + 1); }, 2000);
      }
    });
  }

  // ─── UPSERT TO SUPABASE (para site_snapshots) ─────────────────────────────
  function upsert(table, payload, onConflict) {
    fetch(SUPABASE_URL + '/rest/v1/' + table + '?on_conflict=' + onConflict, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(payload)
    }).catch(function () { /* silencioso */ });
  }

  // ─── TRACK PAGEVIEW ───────────────────────────────────────────────────────
  function trackPageview(geo) {
    send('events', {
      organization_id: ORG_ID,
      token: TOKEN,
      event_type: 'pageview',
      page_url: window.location.href,
      referrer: document.referrer || null,
      city: geo.city,
      country: geo.country,
      device: getDevice(),
      browser: getBrowser(),
      session_id: getSessionId()
    });
  }

  // ─── DOM SNAPSHOT ─────────────────────────────────────────────────────────
  // Extrae la estructura de la página para que la IA pueda analizarla
  function capturePageSnapshot() {
    try {
      // Título y meta description
      var title = document.title || null;
      var metaDesc = null;
      var metaEl = document.querySelector('meta[name="description"]');
      if (metaEl) metaDesc = metaEl.getAttribute('content') || null;

      // H1 principal
      var h1El = document.querySelector('h1');
      var h1 = h1El ? h1El.innerText.trim().slice(0, 200) : null;

      // Todos los headings H2 y H3 (máx 10)
      var headings = [];
      var hEls = document.querySelectorAll('h2, h3');
      for (var i = 0; i < Math.min(hEls.length, 10); i++) {
        var txt = hEls[i].innerText.trim().slice(0, 150);
        if (txt) headings.push({ level: hEls[i].tagName.toLowerCase(), text: txt });
      }

      // CTAs: botones y links prominentes (máx 15)
      var ctas = [];
      var ctaEls = document.querySelectorAll('button, a[href], [role="button"]');
      for (var j = 0; j < ctaEls.length && ctas.length < 15; j++) {
        var ctaTxt = (ctaEls[j].innerText || ctaEls[j].getAttribute('aria-label') || '').trim().slice(0, 80);
        if (ctaTxt && ctaTxt.length > 2 && ctaTxt.length < 80) {
          // Evitar duplicados
          if (ctas.indexOf(ctaTxt) === -1) ctas.push(ctaTxt);
        }
      }

      // Formularios: detectar campos presentes
      var forms = [];
      var formEls = document.querySelectorAll('form');
      for (var k = 0; k < formEls.length; k++) {
        var fields = [];
        var inputs = formEls[k].querySelectorAll('input, textarea, select');
        for (var m = 0; m < inputs.length; m++) {
          var inp = inputs[m];
          var fieldName = inp.getAttribute('name') || inp.getAttribute('placeholder') || inp.getAttribute('type') || 'campo';
          fields.push(fieldName.slice(0, 50));
        }
        if (fields.length > 0) forms.push({ fields: fields });
      }

      // Conteo de palabras aproximado del body (excluye scripts/styles)
      var bodyText = document.body ? (document.body.innerText || '') : '';
      var wordCount = bodyText.split(/\s+/).filter(function (w) { return w.length > 2; }).length;

      // Detectar si hay teléfono o email visible en la página
      // Patrón más estricto: requiere al menos 7 dígitos seguidos (evita matchear precios como $200.000)
      var fullText = bodyText.toLowerCase();
      var hasPhone = /(?:tel[éeef]fono|cel[ue]lar|whatsapp|call|phone|llám[ae]nos)|\btel:\s*[\d+]|\+?[\d]{2,4}[\s\-][\d]{3,4}[\s\-][\d]{3,4}/.test(fullText);
      var hasEmail = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(fullText);
      
      // Detectar promociones, fechas o eventos importantes para la IA
      var promoKeywords = ['oferta', 'descuento', 'lanzamiento', 'evento', 'cyber', 'black friday', 'promoción', 'vence', 'últimos días', 'apertura'];
      var detectedPromos = [];
      promoKeywords.forEach(function(kw) {
        if (fullText.indexOf(kw) > -1) detectedPromos.push(kw);
      });

      // Detectar si tiene chat en vivo
      var hasLiveChat = !!(
        window.Intercom || window.HubSpotConversations ||
        window.zE || document.querySelector('[data-widget="chat"]') ||
        document.getElementById('crisp-chatbox')
      );

      return {
        organization_id: ORG_ID,
        page_url: window.location.href,
        title: title,
        meta_description: metaDesc,
        h1: h1,
        headings: headings,
        ctas: ctas,
        forms: forms,
        word_count: wordCount,
        has_phone: hasPhone,
        has_email: hasEmail,
        has_live_chat: hasLiveChat,
        detected_promos: detectedPromos,
        device: getDevice()
      };
    } catch (e) {
      return null;
    }
  }

  function trackPageSnapshot() {
    // Esperamos 1.5s para que el DOM renderice (útil en SPAs)
    setTimeout(function () {
      var snapshot = capturePageSnapshot();
      if (!snapshot) return;
      upsert('site_snapshots', snapshot, 'organization_id,page_url');
    }, 1500);
  }

  // ─── TRACK LEAD (form submit) ─────────────────────────────────────────────
  function extractField(form, names) {
    for (var i = 0; i < names.length; i++) {
      var el = form.querySelector('[name*="' + names[i] + '"], [placeholder*="' + names[i] + '"], [id*="' + names[i] + '"]');
      if (el && el.value) return el.value;
    }
    return null;
  }

  function trackLead(form, geo) {
    var name    = extractField(form, ['name', 'nombre', 'full', 'cliente', 'user']);
    var email   = extractField(form, ['email', 'correo', 'mail', 'email_address']);
    var phone   = extractField(form, ['phone', 'telefono', 'tel', 'celular', 'movil', 'whatsapp', 'wa']);
    var message = extractField(form, ['message', 'mensaje', 'comentario', 'consulta', 'texto', 'body', 'obs']);
    var company = extractField(form, ['company', 'empresa', 'negocio', 'business']);

    // Solo enviamos si hay al menos email o teléfono
    if (!email && !phone) return;

    // Tiempo en página antes de enviar el formulario (en segundos)
    var timeOnPage = Math.round((Date.now() - pageEntryTime) / 1000);

    send('leads', {
      organization_id: ORG_ID,
      token: TOKEN,
      name: name,
      email: email,
      phone: phone,
      message: (company ? '[' + company + '] ' : '') + (message || ''),
      page_url: window.location.href,
      city: geo.city,
      country: geo.country,
      status: 'new',
      time_on_page: timeOnPage,
      session_id: getSessionId(),
      referrer: document.referrer || null
    });
  }

  // ─── FORM LISTENER (ANTI-TARJETAS & ABANDONOS) ──────────────────────────
  function attachFormListeners(geo) {
    var formStarted = false;
    
    // Capturar inicio de llenado de formulario (Lead Started)
    document.addEventListener('input', function(e) {
      if (e.target.form && !formStarted) {
        formStarted = true;
        send('events', { 
          organization_id: ORG_ID, 
          token: TOKEN, 
          event_type: 'form_started', 
          session_id: getSessionId(), 
          page_url: window.location.href, 
          city: geo.city, 
          country: geo.country,
          metadata: { form_id: e.target.form.id || 'anonymous_form' }
        });
      }
    }, true);

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (form && form.tagName === 'FORM') {
        var formHtml = form.innerHTML.toLowerCase();
        if (formHtml.indexOf('tarjeta') !== -1 || formHtml.indexOf('card') !== -1 || formHtml.indexOf('cvv') !== -1 || formHtml.indexOf('checkout') !== -1) {
          console.log('[Idenza] Formulario ignorado por seguridad.');
          return;
        }
        trackLead(form, geo);
      }
    }, true);
  }

  // ─── WHATSAPP CLICK INTERCEPTOR ───────────────────────────────────────────
  function attachWhatsAppListeners(geo) {
    document.addEventListener('click', function (e) {
      var target = e.target;
      // Subir en el árbol DOM para encontrar si se hizo clic dentro de un enlace <a>
      while (target && target.tagName !== 'A') {
        target = target.parentNode;
      }
      
      if (target && target.href) {
        var href = target.href.toLowerCase();
        // Verificar si el enlace redirige a WhatsApp
        if (href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com/') !== -1) {
          var timeOnPage = Math.round((Date.now() - pageEntryTime) / 1000);
          
          send('leads', {
            organization_id: ORG_ID,
            token: TOKEN,
            name: 'Lead WhatsApp (Automático)',
            email: null,
            phone: 'Capturado en WhatsApp',
            message: 'Clic en botón de WhatsApp detectado (' + href + ')',
            page_url: window.location.href,
            city: geo.city,
            country: geo.country,
            status: 'new',
            time_on_page: timeOnPage,
            session_id: getSessionId(),
            referrer: document.referrer || null
          });
        }
      }
    }, true);
  }

  // ─── E-COMMERCE CLICK INTERCEPTOR ─────────────────────────────────────────
  function attachEcommerceListeners() {
    document.addEventListener('click', function (e) {
      var target = e.target;
      var maxDepth = 5;
      while (target && target.tagName !== 'BODY' && maxDepth > 0) {
        if (target.getAttribute) {
          var productName = target.getAttribute('data-idz-product');
          if (productName) {
            var price = target.getAttribute('data-idz-price');
            var action = target.getAttribute('data-idz-action') || 'click_product';
            if (window.Idenza && window.Idenza.track) {
              window.Idenza.track(action, { product_name: productName, price: price ? parseFloat(price) : null });
            }
            break;
          }
        }
        target = target.parentNode;
        maxDepth--;
      }
    }, true);
  }

  // ─── BEHAVIORAL ANALYTICS: AUTO-CTAS, HEATMAPS & RAGE CLICKS ─────────────
  function attachBehavioralTrackers(geo) {
    // 1. CLICK TRACKER (CTAs & Rage Clicks)
    var clickTimes = [];
    document.addEventListener('click', function(e) {
      var target = e.target;
      var isButton = false;
      var ctaText = '';

      var current = target;
      var maxDepth = 4;
      while (current && current.tagName !== 'BODY' && maxDepth > 0) {
        if (current.tagName === 'A' || current.tagName === 'BUTTON' || current.getAttribute('role') === 'button') {
          isButton = true;
          ctaText = (current.innerText || current.getAttribute('aria-label') || '').trim().slice(0, 50);
          break;
        }
        current = current.parentNode;
        maxDepth--;
      }

      var x = e.clientX;
      var y = e.clientY + window.scrollY;
      var screenW = window.innerWidth;
      
      var now = Date.now();
      clickTimes.push({ time: now, x: x, y: y });
      if (clickTimes.length > 3) clickTimes.shift();
      
      var isRageClick = false;
      if (clickTimes.length === 3) {
        if ((clickTimes[2].time - clickTimes[0].time) < 1500) {
          if (Math.abs(clickTimes[0].x - clickTimes[2].x) < 50 && Math.abs(clickTimes[0].y - clickTimes[2].y) < 50) {
            isRageClick = true;
            clickTimes = [];
          }
        }
      }

      if (isButton || isRageClick) {
        send('events', {
          organization_id: ORG_ID, token: TOKEN, event_type: isRageClick ? 'rage_click' : 'click_cta',
          page_url: window.location.href, city: geo.city, country: geo.country, session_id: getSessionId(),
          metadata: { text: ctaText, x: x, y: y, screen_width: screenW, is_rage_click: isRageClick }
        });
      }
    }, true);

    // 2. SCROLL DEPTH TRACKER
    var scrolled50 = false, scrolled90 = false;
    var scrollTimer;
    window.addEventListener('scroll', function() {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        var h = document.documentElement, b = document.body;
        var st = 'scrollTop', sh = 'scrollHeight';
        var percent = Math.round((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100);

        if (percent >= 50 && !scrolled50) {
          scrolled50 = true;
          send('events', { organization_id: ORG_ID, token: TOKEN, event_type: 'scroll_50', page_url: window.location.href, session_id: getSessionId(), city: geo.city, country: geo.country, metadata: { depth: 50 } });
        }
        if (percent >= 90 && !scrolled90) {
          scrolled90 = true;
          send('events', { organization_id: ORG_ID, token: TOKEN, event_type: 'scroll_90', page_url: window.location.href, session_id: getSessionId(), city: geo.city, country: geo.country, metadata: { depth: 90 } });
        }
      }, 300);
    });

    // 3. ENGAGEMENT & ABANDONMENT
    window.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        var timeActive = Math.round((Date.now() - pageEntryTime) / 1000);
        var payload = {
          organization_id: ORG_ID, token: TOKEN, event_type: 'session_leave',
          page_url: window.location.href, session_id: getSessionId(), city: geo.city, country: geo.country,
          metadata: { time_active_seconds: timeActive }
        };
        
        if (navigator.sendBeacon) {
          var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon(SUPABASE_URL + '/rest/v1/events?apikey=' + SUPABASE_ANON_KEY, blob);
        } else {
          send('events', payload);
        }
      }
    });
  }

  // ─── CONSENT MANAGER & UI ─────────────────────────────────────────────────
  var CONSENT_KEY = 'idz_consent';

  function getConsent() {
    try {
      var c = localStorage.getItem(CONSENT_KEY);
      return c ? JSON.parse(c) : null;
    } catch(e) { return null; }
  }

  function saveConsent(analytics, marketing) {
    var payload = { analytics: analytics, marketing: marketing, date: new Date().toISOString() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));

    send('events', {
      organization_id: ORG_ID,
      token: TOKEN,
      event_type: analytics ? 'consent_granted' : 'consent_necessary_only',
      page_url: window.location.href,
      session_id: getSessionId()
    });

    runTracking(payload);
  }

  function injectBanner() {
    if (document.getElementById('idz-consent-banner')) return;

    var colorPrimary = script.getAttribute('data-color') || '#0f172a';

    var style = document.createElement('style');
    style.innerHTML = `
      #idz-consent-banner {
        position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 2147483647;
        background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
        padding: 24px; font-family: system-ui, -apple-system, sans-serif;
        max-width: 480px; animation: idz-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        color: #1e293b; box-sizing: border-box;
      }
      @keyframes idz-slide-up { from { transform: translateY(120px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      #idz-consent-banner h3 { margin: 0 0 8px 0; font-size: 17px; font-weight: 700; display:flex; align-items:center; gap:8px; }
      #idz-consent-banner p { margin: 0 0 18px 0; font-size: 13.5px; line-height: 1.6; color: #475569; }
      .idz-consent-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
      .idz-btn { border: none; padding: 11px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
      .idz-btn-primary { background: ${colorPrimary}; color: #fff; flex: 1; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .idz-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15); filter: brightness(1.1); }
      .idz-btn-primary:active { transform: translateY(0); }
      .idz-btn-secondary { background: #f1f5f9; color: #475569; }
      .idz-btn-secondary:hover { background: #e2e8f0; color: #1e293b; }
      #idz-consent-banner a { color: ${colorPrimary}; text-decoration: underline; text-underline-offset: 2px; font-weight: 500;}
      @media (max-width: 480px) {
        #idz-consent-banner {
          bottom: 0; left: 0; right: 0;
          border-radius: 20px 20px 0 0;
          max-width: 100%; border: none;
          padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
        }
        #idz-consent-banner h3 { font-size: 16px; margin-bottom: 6px; }
        #idz-consent-banner p { font-size: 13px; margin-bottom: 16px; line-height: 1.5; }
        .idz-consent-buttons { flex-direction: column-reverse; gap: 8px; }
        .idz-btn { width: 100%; padding: 12px; font-size: 14px; }
      }
    `;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'idz-consent-banner';
    banner.innerHTML = `
      <h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:${colorPrimary}"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Respetamos tu privacidad
      </h3>
      <p>Usamos cookies y datos de navegación para mejorar la web, analizar las visitas y ofrecerte una experiencia enriquecida. Puedes aceptar para brindarte el mejor servicio o mantener solo las necesarias. <a>Más información</a>.</p>
      <div class="idz-consent-buttons">
        <button class="idz-btn idz-btn-secondary" id="idz-btn-reject">Solo necesarias</button>
        <button class="idz-btn idz-btn-primary" id="idz-btn-accept">Aceptar todas</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('idz-btn-accept').addEventListener('click', function() {
      saveConsent(true, true);
      banner.remove();
    });

    document.getElementById('idz-btn-reject').addEventListener('click', function() {
      saveConsent(false, false);
      banner.remove();
    });
  }

  // ─── INIT & EXECUTION FLOW ────────────────────────────────────────────────
  function runTracking(consent) {
    
    // EXPOSICIÓN DE API E-COMMERCE
    window.Idenza = {
      track: function(eventName, metadata) {
        if (!consent.analytics) return; // Requiere consentimiento analítico
        
        getGeo(function(geo) {
          send('events', {
            organization_id: ORG_ID,
            token: TOKEN,
            event_type: eventName,
            metadata: metadata || null,
            page_url: window.location.href,
            city: geo.city,
            country: geo.country,
            device: getDevice(),
            browser: getBrowser(),
            session_id: getSessionId(),
            referrer: document.referrer || null
          });
        });
      }
    };

    if (consent.analytics) {
      getGeo(function (geo) {
        trackPageview(geo);
        trackPageSnapshot(); // Captura la estructura de la página
        
        if (consent.marketing) {
          attachFormListeners(geo);
          attachWhatsAppListeners(geo);
          attachEcommerceListeners(); // Auto-Track de Productos
          attachBehavioralTrackers(geo); // Ultimate Analytics
        }
      });
    } else {
      send('events', {
        organization_id: ORG_ID,
        token: TOKEN,
        event_type: 'pageview_anonymous',
        session_id: getSessionId()
      });
    }
  }

  var disableBanner = script.getAttribute('data-no-banner') === 'true';
  var currentConsent = getConsent();

  if (currentConsent) {
    runTracking(currentConsent);
  } else {
    if (!disableBanner) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBanner);
      } else {
        injectBanner();
      }
    }
  }

})();
