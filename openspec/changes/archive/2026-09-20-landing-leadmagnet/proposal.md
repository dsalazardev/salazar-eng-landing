# Proposal: LeadMagnet — Checklist 27 puntos con la primera isla React

## Why

El embudo necesita capturar a los no-decisores (brief §3: "Captura de no-decisores; inicia la nutrición") con el checklist de 27 puntos (§5.2). Es además la **primera isla del sitio**: el formulario interactivo que el stack reservó desde el día uno (AGENTS §02) y el momento del dogfooding: "nuestra captación la automatiza n8n" (§5.3).

## What Changes

- **Nuevo `src/components/sections/LeadMagnet.astro`**: sección `id="recurso"` en surface plana (tras la banda del fundador), `SectionLabel 09/ CHECKLIST` + `<h2>` verbatim §5.2 + subcopy + formulario en `Card` + micro-línea de dogfooding.
- **Nueva isla `src/components/islands/ContactForm.tsx`** (se crea `src/components/islands/`) con **`client:visible`**: el HTML SSR-renderizado es un **formulario nativo** (`action`/`method` → funciona sin JS y antes de hidratar); al hidratar, React intercepta el submit (fetch + estados `idle`/`submitting`/`success`/`error`).
- **Endpoint único configurable**: `PUBLIC_LEAD_ENDPOINT` (env de Astro) en el `action` y en el `fetch`; **TODO documentado** para el workflow n8n (recibe → envía PDF → notifica a Daner → agenda seguimiento — infra del dueño, fuera del change). Sin endpoint o fetch fallido → **estado de error honesto** ("No pudimos enviar tu solicitud. Intenta de nuevo."), **jamás éxito falso**.
- **Copy aprobado**: h2 "Checklist: 27 puntos para modernizar tu sistema legacy" (verbatim §5.2); select "¿Qué te quita el sueño?" con las 3 frases verbatim de M04 + "Otro / aún no lo sé"; CTA "Recibir checklist →"; microcopy "Sin spam. Solo el checklist."; mensajes de éxito/error fijados; micro-línea "Captación automatizada con n8n (nuestro caso #0).".
- **PDF 27 puntos**: no existe → el copy describe el checklist **sin prometer descarga inmediata** (entrega por email); TODO del dueño (contenido + portada branded).
- **A11y completa**: labels reales y visibles, `autocomplete="email"`, `required`, `aria-live="polite"`, focus management en éxito/error.
- **`src/pages/index.astro`**: monta `<LeadMagnet />` inmediatamente después de `<Founder />`.
- **Delta MODIFIED de `landing-base`**: la spec vigente dice "la carga inicial no incluye JavaScript de islas" — con el loader de la isla deja de ser literal → se sustituye por la política durable: **carga inicial < 10 KB (navbar + loader); runtimes de islas diferidos hasta la visibilidad**.

## Capabilities

### New Capabilities

- `landing-leadmagnet`: sección de captura con checklist, formulario híbrido (nativo + isla React `client:visible`), endpoint configurable y micro-línea de dogfooding, con hook `id="recurso"`.

### Modified Capabilities

- `landing-base`: el requisito "Build estático sin JavaScript de islas" se sustituye por la política de presupuesto de JavaScript con runtimes de islas diferidos (la primera isla del sitio entra en este change).

## Fuera de Alcance

- Workflow n8n real y sus credenciales (infra del dueño; el change solo deja el endpoint configurable y el TODO).
- PDF "27 puntos" (contenido + portada branded) y la secuencia de 3 emails.
- Analytics (Plausible/Umami) y LazyEmbed/Cal.com (→ M11).
- Footer, cambios en navbar/global.css/otras secciones/contrato de anclas.
- Dependencias nuevas (React ya está instalado; la isla no añade paquetes).

## Impact

- **Nuevos**: `src/components/sections/LeadMagnet.astro`, `src/components/islands/ContactForm.tsx`.
- **Modificados**: `src/pages/index.astro` (montaje tras Founder).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, secciones previas, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Presupuesto**: la carga inicial pasa de 1 script (navbar, 245 B) a **2** (navbar + loader de isla ≈1–2 KB) — sigue < 10 KB; el runtime de React (**~77.2 KB gzip medidos**) se difiere hasta el viewport (`client:visible`); 0 imágenes nuevas; sin CLS.
- **Contrato**: sin cambios (todos los destinos del navbar siguen igual; `#recurso` es hook interno).
