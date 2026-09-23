# Proposal: FAQ — Accordion nativo con ancla #faq

## Why

Tras el método (M07) y el fundador (M08), al decisor le quedan las objeciones finales del brief §3: precio, NDA, soporte y traspaso. Esta sección las responde con un accordion nativo de 5 preguntas y resuelve la **cuarta ancla viva del contrato del navbar**: hoy `href="#faq"` aparece ×2 (navbar desktop + panel móvil) e `id="faq"` no existe en ninguna parte.

## What Changes

- **Nuevo `src/components/sections/Faq.astro`** (0 JS): sección `id="faq"` en banda blanca (`border-y border-line bg-white`, continúa la alternancia 06/08/10), `SectionLabel 10/ FAQ` + `<h2>` + subcopy + lista de 5 filas en `max-w-3xl`.
- **Accordion nativo `<details>/<summary>`**: 5 `<details name="faq">` (exclusividad nativa, Baseline 2024) con la primera pregunta `open`; marker nativo oculto (`list-none` + `[&::-webkit-details-marker]:hidden`); chevron `ChevronDown` de `lucide-astro` rotando con `group-open:rotate-180` (variante `open` de Tailwind v4) y `motion-reduce:transition-none`.
- **Sin animación de altura**: no es viable cross-browser sin JS (`interpolate-size`/`::details-content` son Chrome-only). Solo rota el chevron; el contenido cerrado permanece en el HTML (indexable).
- **Copy**: h2 "Preguntas frecuentes" y subcopy "Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas." (**marcados "a confirmar por el dueño"**); las 5 respuestas son **verbatim del brief §4.7** (cero invención).
- **`src/pages/index.astro`**: monta `<Faq />` inmediatamente después de `<LeadMagnet />`.
- **`id="faq"`** resuelve las 2 anclas del navbar; 0 JS nuevo (los 3 scripts inline siguen en 4,997 B); `global.css` intacto; sin dependencias nuevas.

## Capabilities

### New Capabilities

- `landing-faq`: sección de objeciones finales con accordion nativo `<details>/<summary>` (5 preguntas verbatim, exclusividad sin JS, chevron CSS) y ancla `#faq` del contrato.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip`, `landing-problemsolution`, `landing-services`, `landing-proofofwork`, `landing-process`, `landing-founder` ni `landing-leadmagnet`.

## Fuera de Alcance

- Preguntas adicionales a las 5 del brief §4.7 (prohibido inventar).
- CTA propio, iconos distintos del chevron, numeración por pregunta, texturas y corner marks.
- Animación de altura del accordion (solo Chrome la soporta sin JS) y cualquier micro-script.
- Schema.org `FAQPage` (el brief solo define `Organization` en el layout).
- Cambios en `global.css`, navbar, otras secciones o el contrato de anclas (solo se **resuelve** `#faq`; `#contacto` sigue pendiente de M11, documentado como no-regresión).
- Dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/Faq.astro`.
- **Modificados**: `src/pages/index.astro` (import + montaje tras LeadMagnet).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, secciones 00–09, tokens, primitivos, `astro.config.mjs`, `package.json`, backend.
- **Contrato**: `#faq` pasa de muerta a viva (2 enlaces resueltos); `#contacto` sigue pendiente de M11.
- **Presupuesto**: 0 JS nuevo (3 scripts inline, 4,997 B < 10 KB); 0 imágenes; crecimiento de HTML ~1.5–2 KB (informativo, no cuenta al presupuesto de JS).
