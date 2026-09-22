# Design: LeadMagnet — integración real con `ms-notifier-webhook`

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- Isla actual (`src/components/islands/ContactForm.tsx`): 4 estados (`idle`/`submitting`/`success`/`error`), validación `reportValidity` + `aria-invalid`, `fetch` JSON con `{email, necesidad}`, sin timeout, sin distinción de errores; TODO obsoleto de n8n en las líneas 38-39.
- `LeadMagnet.astro:6` lee `PUBLIC_LEAD_ENDPOINT ?? ''` y lo pasa como prop; micro-línea n8n en la línea 29; `client:visible` (la isla se difiere hasta el viewport).
- Backend real verificado (2026-09-22): `GET /health` → `ok`; `GET /health/ready` → `ready` 6/6; preflight `OPTIONS` → 200 con `Access-Control-Allow-Origin: http://localhost:4321` y `Allow-Headers: content-type`. Contrato: `POST /api/v1/lead` JSON `{email, need}` → 202; 422/429/500; rate limit 5/min por IP; cold start Render ~30–60 s.
- **No existe** `.env` ni `.env.example`; `.gitignore:6` ya permite versionar `!.env.example`. El build actual no emite `action` (React omite `undefined`), verificado en `dist/index.html`.
- La spec vigente promete entrega sin JS (inviable: form-urlencoded ≠ JSON) y atribuye la captación a n8n.
- Restricciones: sin dependencias nuevas (AbortController/`setTimeout` son nativos); React solo en la isla; AGENTS §06 rige la verificación (sin `dev`/`preview`; inspección de `dist/`); **prohibido POST real**; presupuesto JS (< 10 KB inline) y `client:visible` se mantienen; `PUBLIC_*` se inlinea en build (cambiarla exige rebuild).

## Goals / Non-Goals

**Goals:**

- Contrato real `{email, need}` con 202 como aceptación y errores honestos (422/429/500), sin romper los 4 estados actuales.
- UX honesta para rate limit (mensaje específico) y cold start (aviso progresivo + timeout holgado con mensaje propio).
- Configuración del endpoint versionada y documentada (`.env.example` + `AGENTS.md`), con la naturaleza build-time explícita.
- HTML sin promesa falsa de entrega sin JS (`<noscript>` informativo) y copy alineada al stack real (sin n8n).

**Non-Goals:**

- Backend `ms-notifier-webhook` (solo referencia por URL), proxy edge, form-encoded en backend, E2E real automatizado, M11 (`#contacto`, Cal.com), contenido del PDF, dependencias nuevas.

## Decisions

### D1. Contrato: clave `need` en JSON y en el campo

- La clave JSON pasa a `need` (`ContactForm.tsx:54`) y el `name` del `<select>` también (`ContactForm.tsx:110`); el `id`/`label` visibles no cambian. Así el campo y el payload comparten nombre y cualquier inspección del markup/chunk es consistente.
- El éxito es cualquier 2xx: el 202 actual ya pasa `response.ok` (`ContactForm.tsx:58`) — **sin cambio**; no se lee el body de éxito (el PDF lo envía el backend en background).
- *Alternativas descartadas*: traducir `necesidad`→`need` en un adaptador (mantiene deuda de nombres); proxy intermedio (infra nueva sin beneficio).

### D2. Errores: se mantienen 4 estados + mensaje condicional

- **Estado**: se conserva `Status = 'idle' | 'submitting' | 'success' | 'error'` y se añade un `errorMessage` en el estado de React (constantes de copy); la región `role="alert"` muestra `errorMessage ?? genérico`. Se limpia al reintentar y se fija en éxito.
- **429**: rama explícita antes del `throw` genérico → `"Demasiados intentos seguidos. Espera un minuto e intenta de nuevo."` **sin** leer `Retry-After` (CORS no expone el header; verificable en el preflight: sin `Access-Control-Expose-Headers`).
- **422/500/red**: mensaje genérico actual `"No pudimos enviar tu solicitud. Intenta de nuevo."`.
- **Timeout**: `"El servicio tardó demasiado en responder. Intenta de nuevo."` (mensaje propio, distinto del genérico).
- *Alternativas descartadas*: estados nuevos (`rate-limited`, `waking`) — más superficie de markup y a11y sin beneficio; parsear el body de error — el contrato no lo fija y añade fragilidad.

### D3. Cold start: aviso progresivo + `AbortController`

- **Aviso**: `useEffect` sobre `status === 'submitting'` que programa `setTimeout` a **`WARMUP_NOTICE_MS = 9000`** (rango 8–10 s) → `setSlow(true)`; el cleanup limpia el timer y resetea `slow` cuando el estado cambia o la isla se desmonta. Copy: `"El servicio está despertando; puede tardar hasta un minuto."` en un `<p role="status">` (anuncio polite, sin focus). Se descarta cambiar el texto del botón (perdería "Enviando…").
- **Timeout**: en `handleSubmit`, `const controller = new AbortController()` + `setTimeout(() => controller.abort(), TIMEOUT_MS)` con **`TIMEOUT_MS = 120000`** (rango 90–120 s), `signal` en el `fetch` y `clearTimeout` en `finally`. En `catch`: si la señal fue abortada (o `AbortError`) → mensaje de timeout; en cualquier otro caso → genérico.
- **Razón del margen**: el cold start real (~30–60 s) + el procesamiento en background no deben producir falsos errores; 120 s evita abortar una petición que Render aún va a resolver. El aviso a los 9 s comunica la espera.
- *Alternativa descartada*: timeout de 30–60 s (choca con el cold start documentado → falsos errores); sin timeout (la espera queda indefinida y sin escape).

### D4. Fallback sin JS: `<noscript>` en `LeadMagnet.astro`, sin promesa de entrega

- Se mantiene el markup `<form method="post">` (y `action` cuando el endpoint esté configurado) para no tocar la estructura SSR, pero la spec deja de prometer entrega sin JS (era inviable: form-urlencoded → 422 + navegación fuera del sitio).
- `<noscript>` con copy exacto: `"Este formulario necesita JavaScript para enviarse. Actívalo para recibir el checklist."` Se coloca **en `LeadMagnet.astro` dentro de la `Card`, junto a la isla** (markup estático Astro, sin riesgos de hidratación de React). *Alternativa descartada*: `<noscript>` dentro de la isla React (React restringe los hijos de `noscript` a texto y puede generar advertencias/parsing inconsistente).
- *Alternativas futuras registradas*: C) proxy edge (Pages Function/Vercel Function) que traduzca form-encoded → JSON; D) que el backend acepte también form-encoded. Se retoman solo si el no-JS importa comercialmente (hoy: open question del canal).

### D5. Configuración del endpoint: `.env.example` + doc build-time

- Nuevo `.env.example` versionado (`.gitignore:6` ya lo permite) con:
  `PUBLIC_LEAD_ENDPOINT=https://ms-notifier-webhook.onrender.com/api/v1/lead` y comentario de build-time (Astro la inlinea; cambiarla exige rebuild). `.env` local sigue sin versionar.
- Doc en `AGENTS.md` (fuente de verdad del proyecto): variable, naturaleza build-time, y pendiente de deploy (setearla en el entorno de build del host + agregar el dominio de producción al `CORS_ORIGINS` del backend + re-deploy). `README.md` (starter de Astro) queda opcional, sin bloquear.
- El flujo `LeadMagnet.astro:6` → prop `endpoint` no cambia; con la variable seteada, el SSR emite `action` y el `fetch` usa el mismo punto.
- *Alternativa descartada*: default hardcodeado en `LeadMagnet.astro` (`?? 'https://…'`) — oculta la configuración y contradice el diseño de endpoint configurable.

### D6. Copy sin n8n + TODO reescrito

- Micro-línea (`LeadMagnet.astro:29`): `"Captación automatizada (nuestro caso #0)."`.
- TODO (`ContactForm.tsx:38-39`): reescrito para apuntar al backend real y a la variable de build (p. ej. `// La captación la ejecuta ms-notifier-webhook (Render); PUBLIC_LEAD_ENDPOINT se define en build (ver .env.example).`).
- *Riesgo/validación*: si el dueño confirma que n8n participa del stack, revertir a la micro-línea anterior (una línea + delta de spec menor).

### D7. Verificación sin servidor (AGENTS §06)

- `pnpm astro check` (0 errores) + `pnpm build` (dos builds: sin env y con `PUBLIC_LEAD_ENDPOINT` seteado) + inspección regex de `dist/`:
  - chunk de isla: `need` presente, `necesidad` ×0, strings de 429/aviso/timeout presentes;
  - `dist/index.html` con env: `action="https://ms-notifier-webhook.onrender.com/api/v1/lead"`, `name="need"`, `<noscript>` presente, `id="recurso"` ×1, 3 scripts inline < 10 KB.
- **E2E real**: verificación humana pendiente del dueño (1 submit de prueba coordinado; prohibido POST en la verificación automatizada).

## Risks / Trade-offs

- [Cold start excede el timeout de 120 s] → mensaje de timeout honesto y reintento; el aviso progresivo reduce abandono. Si Render empeora, subir `TIMEOUT_MS` (constante única).
- [El aviso a los 9 s inserta un párrafo durante `submitting`] → shift menor sobre el formulario (no afecta CLS de la carga inicial); aceptado.
- [429 sin `Retry-After` legible] → mensaje estático "espera un minuto"; si el backend agrega `Access-Control-Expose-Headers`, se puede mejorar sin romper contrato.
- [Host sin la variable en build] → el form no emite `action` y la isla muestra error honesto (nunca éxito falso); documentado en `.env.example` + `AGENTS.md`.
- [Copy n8n revertida tarde] → costo bajo (una línea + delta), se resuelve con la confirmación del dueño.
- [Rate limit 5/min por IP durante pruebas] → E2E humano único y coordinado; la verificación automatizada no hace POST.
- [CORS de producción pendiente] → nota de deploy; fuera del repo (backend).

## Migration Plan

1. Crear `.env.example` + doc en `AGENTS.md`.
2. Actualizar `ContactForm.tsx`: payload `need`, rama 429, aviso progresivo, `AbortController`/timeout, `<noscript>` no (va en la sección), TODO reescrito.
3. Actualizar `LeadMagnet.astro`: micro-línea sin n8n + `<noscript>`.
4. Verificar §06: `pnpm astro check` + `pnpm build` (sin/con env) + inspección de `dist/`.
5. Registrar la verificación humana E2E (1 submit real coordinado con el dueño).
6. Commit `feat(leadmagnet): integrar formulario con ms-notifier-webhook` (+ commit de artefactos del change si aplica la convención del proyecto).

Rollback: revertir el commit; el formulario vuelve al estado actual (con `necesidad` y sin aviso/timeout), que sin endpoint ya muestra error honesto.

## Open Questions

- Canal exacto del `<noscript>`: M11 (`#contacto`, CtaFinal) aún no existe — ¿se deja el aviso informativo simple (propuesto) o se enlaza al WhatsApp/email del PDF cuando exista?
- Confirmación del dueño de que n8n no participa del stack real (si participa, revertir la micro-línea y el delta de copy).
- Dominio de producción del landing para el allowlist CORS (se resuelve en el DEP; nota de deploy ya documentada).
- ¿El backend expondrá `Retry-After` vía `Access-Control-Expose-Headers`? (mejora futura, no bloquea).
