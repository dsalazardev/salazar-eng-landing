# Proposal: LeadMagnet — integración real con `ms-notifier-webhook`

## Why

El formulario del lead (09/ LeadMagnet) está desplegado y con estados, pero **no captura leads**: envía `{email, necesidad}` a un `PUBLIC_LEAD_ENDPOINT` sin configurar, y el backend real (`ms-notifier-webhook` en Render, ya operativo: health `ok`, ready 6/6, CORS permite `http://localhost:4321`) exige `{email, need}` (JSON) con respuestas 202/422/429/500. Además, la promesa vigente de "funciona sin JavaScript" es inviable contra un API JSON: el submit nativo envía form-urlencoded, recibe 422 y navega fuera del sitio. Es el único paso que falta para cerrar el embudo del lead magnet: sin este change, quien deja su email no recibe el checklist ni queda registrado.

## What Changes

- **Contrato real del backend**: payload `{email, need}` — renombrar la clave JSON **y** el `name` del `<select>` (`necesidad` → `need`; el label visible "¿Qué te quita el sueño?" no cambia). **BREAKING** del contrato interno del formulario (sin consumidores externos conocidos).
- **Endpoint configurable y documentado**: `.env.example` versionado (`.gitignore:6` ya lo permite) con `PUBLIC_LEAD_ENDPOINT=https://ms-notifier-webhook.onrender.com/api/v1/lead` + comentario de que es variable **build-time** (se inlinea; cambiarla exige rebuild); `.env` local sin versionar para dev; documentación en `AGENTS.md` (y/o `README.md`).
- **Errores honestos del backend**: 429 con mensaje estático específico ("Demasiados intentos seguidos. Espera un minuto e intenta de nuevo."), **sin** depender de `Retry-After` (CORS no expone el header); 422/500 con el mensaje genérico actual.
- **Cold start de Render**: aviso progresivo a los ~8–10 s ("El servicio está despertando; puede tardar hasta un minuto.") + `AbortController` con timeout holgado (90–120 s) y mensaje de error propio, sin falsos errores por debajo del cold start real (~30–60 s).
- **Fallback sin JS**: se retira la promesa de entrega sin JavaScript del requirement "Base de formulario nativo" (inviable: form-urlencoded ≠ JSON) y se añade un `<noscript>` informativo ("Este formulario necesita JavaScript para enviarse. Actívalo para recibir el checklist."); el markup `<form>` se mantiene.
- **Copy alineada al stack real**: micro-línea "Captación automatizada (nuestro caso #0)." (sin n8n) y TODO obsoleto de `ContactForm.tsx:38-39` reescrito (el workflow ya existe: este backend).
- **Delta de spec `landing-leadmagnet`**: MODIFIED en "Endpoint único y error honesto", "Base de formulario nativo", "Estados del formulario" y "Copy del checklist"; ADDED en "Configuración del endpoint".

## Capabilities

### New Capabilities

Ninguna — este change modifica una capacidad existente; no introduce capacidades nuevas.

### Modified Capabilities

- `landing-leadmagnet`: se actualiza el contrato del formulario (payload `{email, need}` y respuestas 202/422/429/500 del `ms-notifier-webhook`), el manejo de errores (429 explícito, timeout/cold start con aviso progresivo), el fallback sin JS (sin promesa de entrega + `<noscript>`), la configuración del endpoint (`.env.example` versionado, naturaleza build-time, nota de CORS de producción) y la micro-línea de dogfooding (sin n8n).

## Impact

- **Código**: `src/components/islands/ContactForm.tsx` (payload `need`, rama 429, aviso/timeout con `AbortController`, TODO reescrito), `src/components/sections/LeadMagnet.astro` (micro-línea sin n8n, `<noscript>`), `.env.example` (nuevo), `AGENTS.md` y/o `README.md` (doc de la variable).
- **Specs**: delta sobre `openspec/specs/landing-leadmagnet/spec.md` (se aplica al archivar el change; no se edita a mano).
- **Deploy**: setear `PUBLIC_LEAD_ENDPOINT` en el entorno de build del host; al definir el dominio de producción, agregarlo a `CORS_ORIGINS` del backend (fuera de este repo) + re-deploy.
- **Fuera de alcance**: el backend `ms-notifier-webhook` (solo referencia por URL), contenido del PDF (ya existe en `tools/pdf/`), analytics, M11 (`#contacto`, Cal.com/LazyEmbed), dependencias nuevas.
- **Presupuesto**: sin cambios esperados — los handlers nuevos viven en el chunk diferido de la isla; la carga inicial (< 10 KB) y `client:visible` se mantienen; el E2E real de submit queda como verificación humana pendiente del dueño (prohibido POST real en verificación).
