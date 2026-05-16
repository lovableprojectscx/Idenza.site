# Manual de Usuario — Idenza Dashboard
**Versión:** 2.0 · **Fecha:** Abril 2026

---

## ¿Qué es Idenza?

Idenza es tu asesor digital inteligente. Combina tres cosas que ninguna herramienta por separado hace: **capta los leads de tu web automáticamente**, **analiza el comportamiento de tus visitantes** y **te dice exactamente qué mejorar** usando inteligencia artificial que conoce tu negocio.

No necesitas saber de marketing digital. Idenza traduce los datos en acciones concretas.

---

## Primeros pasos

### 1. Instalar el tracker en tu sitio web

El tracker es un pequeño código que pegas en tu sitio. Es lo que le permite a Idenza "ver" lo que pasa en tu web.

**Cómo instalarlo:**
1. En tu dashboard verás la pantalla de configuración con el código listo.
2. Copiá el código haciendo clic en **Copiar**.
3. Pegalo dentro del `<head>` de tu sitio web, en **todas las páginas**.
4. Si usás WordPress, podés usar un plugin como "Insert Headers and Footers" y pegarlo ahí.
5. Guardá los cambios y publicá.

**El código se ve así:**
```html
<script
  src="https://idenza.site/tracker.js"
  data-token="tu-token-aquí"
  data-org="tu-org-id-aquí"
></script>
```

**¿Cuándo sé que está funcionando?**  
Después de instalar el código, abrí tu sitio web en otro navegador. Volvé al dashboard y hacé clic en **Verificar estado**. Si el tracker detectó la visita, el indicador cambiará a verde.

---

### 2. Completar el perfil de tu empresa

El perfil es lo que le permite al Asesor IA darte recomendaciones específicas para tu negocio, no consejos genéricos.

**Para completarlo:**
1. Andá a la pestaña **Mi Empresa** en el dashboard.
2. Completá los 6 campos:
   - **Resumen del negocio** — Qué hacés, dónde estás, cuánto tiempo llevás.
   - **Audiencia objetivo** — A quién le vendés. Sé específico con edad, ciudad, necesidades.
   - **Propuesta de valor** — Por qué te eligen a vos y no a la competencia.
   - **Productos y servicios** — Qué ofrecés y rangos de precio si podés.
   - **Objetivos del sitio** — Qué querés que haga el visitante cuando entra a tu web.
   - **Desafíos actuales** — Qué no está funcionando hoy. Sé honesto.
3. Hacé clic en **Guardar perfil**.

> **Tip:** Cuanto más detallado seas, mejores serán las recomendaciones de la IA. No te preocupes por la redacción, lo importante es la información.

---

## El dashboard explicado

### Pestaña Resumen

La vista principal de tu negocio digital. Muestra:

- **Leads totales** — Todas las personas que completaron un formulario en tu web.
- **Visitas (30d)** — Cantidad de veces que entraron a tu web en los últimos 30 días.
- **Conversión** — Qué porcentaje de visitantes se convirtieron en un lead. (Leads ÷ Visitas × 100).
- **Sin responder** — Leads nuevos que todavía no contactaste. Cuanto más bajo, mejor.
- **Gráfico de actividad** — Evolución día a día de leads y visitas.
- **Estado de leads** — Distribución entre Nuevos, En seguimiento y Cerrados.
- **Leads por ciudad** — De qué ciudades vienen tus contactos.
- **Páginas que más generan leads** — Qué páginas de tu web atraen más formularios completados. Muy útil para saber dónde invertir.

---

### Pestaña Tráfico

Análisis del comportamiento de los visitantes:

- **Sesiones únicas** — Cantidad de personas distintas que visitaron tu web.
- **Páginas únicas** — Cuántas páginas diferentes se visitaron.
- **Países detectados** — De cuántos países llegan visitantes.
- **Visitas por hora** — A qué hora del día hay más tráfico. Útil para publicar contenido o lanzar campañas.
- **Páginas más visitadas** — Cuáles son los destinos más populares dentro de tu web.
- **Dispositivos** — Qué porcentaje visita desde celular vs computadora.
- **Países** — Distribución geográfica de tu audiencia.

---

### Pestaña Leads

Lista completa de todos tus contactos. Para cada lead podés ver:
- Nombre y email.
- Ciudad de origen.
- Página desde donde envió el formulario.
- **Tiempo en página** — Cuántos segundos o minutos estuvo leyendo antes de contactarte (una señal de interés).
- Fecha y hora del contacto.

**Cambiar el estado de un lead:**  
Hacé clic en un lead para expandirlo y verás los botones de estado:
- 🔵 **Nuevo** — Aún no lo contactaste.
- 🟡 **En seguimiento** — Estás en conversación.
- 🟢 **Cerrado** — Se convirtió en cliente (o se descartó).

Mantener los estados actualizados le permite al Asesor IA darte consejos más precisos sobre tu embudo de ventas.

---

### Pestaña Mi Empresa

Acá completás y editás el perfil de tu negocio. Ver sección "Completar el perfil de tu empresa" más arriba.

La barra de progreso te muestra cuántos campos completaste. El Asesor IA mejora notablemente cuando el perfil está al 100%.

---

### Pestaña Auditoría

La auditoría es un análisis automático de tu web realizado por IA. A diferencia del chat, no es una conversación: es un **diagnóstico estructurado** con problemas concretos, oportunidades y un plan de acción.

**¿Cuándo está disponible?**  
Cuando el tracker haya visitado al menos una página de tu sitio y capturado su estructura. Verás un indicador con la cantidad de páginas analizadas.

**Para generar una auditoría:**
1. Asegurate de tener el perfil de empresa completo (mejora mucho la calidad del análisis).
2. Hacé clic en **Iniciar auditoría**.
3. Esperá 15-20 segundos mientras la IA analiza tu web.

**El informe incluye:**
- **Puntuación** (1 a 10) — Calificación global de tu web.
- **Resumen ejecutivo** — Diagnóstico general en 2-3 oraciones.
- **Problemas críticos** — Lo que está frenando tus conversiones ahora mismo.
- **Oportunidades** — Qué podés aprovechar con impacto alto/medio/bajo.
- **Plan de acción** — Recomendaciones ordenadas por prioridad con esfuerzo estimado.
- **Puntos fuertes** — Lo que ya estás haciendo bien.

> **Tip:** Podés volver a auditar cuando hagas cambios en tu web para ver cómo mejoró la puntuación.

---

### Pestaña Asesor IA

Chat en tiempo real con la IA de Idenza. El Asesor tiene acceso a:
- Todos tus datos de leads y visitas.
- Tu perfil de empresa.
- La estructura de tus páginas web.

Podés preguntarle cualquier cosa sobre tu negocio digital:
- *"¿Por qué no convierten los visitantes de mi página de servicios?"*
- *"¿En qué ciudad debería enfocar mi próxima campaña?"*
- *"Dame ideas para mejorar mi tasa de conversión."*
- *"¿Qué debería hacer con mis 12 leads sin responder?"*

Las sugerencias pre-cargadas son un buen punto de partida si no sabés por dónde empezar.

---

## El banner de privacidad

Cuando alguien visita tu web por primera vez, verá un banner de consentimiento de cookies. Esto es requerido por las regulaciones de privacidad.

- **Aceptar todas** — El tracker captura todo: visitas, formularios, geolocalización. Más datos = mejores análisis.
- **Solo necesarias** — Solo se registra una visita anónima básica. Sin formularios ni datos personales.

El usuario puede cambiar su preferencia borrando las cookies del sitio.

**Para ocultar el banner** (si ya tenés tu propio sistema de consentimiento), podés agregar `data-no-banner="true"` al script:
```html
<script
  src="https://idenza.site/tracker.js"
  data-token="..."
  data-org="..."
  data-no-banner="true"
></script>
```

**Para personalizar el color del banner** (que combine con tu marca):
```html
<script
  src="https://idenza.site/tracker.js"
  data-token="..."
  data-org="..."
  data-color="#7B2CBF"
></script>
```

---

## Preguntas frecuentes

**¿El tracker afecta la velocidad de mi web?**  
No. El script es asíncrono (no bloquea la carga) y pesa menos de 10KB.

**¿Cuándo aparecen los datos en el dashboard?**  
Los eventos aparecen en tiempo real. Los leads aparecen inmediatamente después de que alguien envía un formulario.

**¿Qué formularios captura el tracker?**  
Cualquier `<form>` estándar de HTML. Captura automáticamente nombre, email, teléfono y mensaje si los campos están correctamente etiquetados. Si tu formulario usa un sistema externo (como Typeform), podría no capturar los datos.

**¿Los datos son privados?**  
Sí. Los datos de tu empresa y tus leads solo son visibles para vos desde tu cuenta. Idenza no comparte datos entre clientes.

**¿Qué pasa si instalo el tracker en varias páginas de mi web?**  
Perfecto, así debe ser. El tracker registra cada página por separado, lo que le permite a la IA identificar cuáles convierten más y cuáles necesitan mejoras.

**¿Puedo tener varios proyectos?**  
Sí. Si tenés múltiples negocios o sitios web, cada uno tiene su propio proyecto con su propio tracker, datos y panel.

---

## Soporte

¿Tenés alguna duda o encontraste un error?  
Contactanos a través de nuestra web o por WhatsApp. El equipo de Idenza está disponible para ayudarte.
