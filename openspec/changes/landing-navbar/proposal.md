# Proposal: Navbar sticky con CTA y menú móvil nativo

## Why

La landing no tiene navegación: sin ella, el CTA "Agendar diagnóstico" no está siempre visible y el visitante no puede escanear la oferta (servicios, casos, proceso, FAQ) sin recorrer toda la página. Este es el primer módulo de sección y debe materializar la estética blueprint con **0 islas** y sin frameworks, manteniendo el presupuesto de JS inicial (<10 KB) que el M00 dejó intacto. La exploración previa (2026-09) validó empíricamente que la Popover API nativa cubre el menú móvil sin isla y que el único hueco —cerrar el menú al navegar— se resuelve con un micro-script inline de ~200 B.

## What Changes

- **Nuevo `src/components/sections/Navbar.astro`**: `<header>` sticky (`top-0 z-40`) con capa de blur separada, wordmark textual "SALAZAR Eng." (SALAZAR bold navy + Eng. mono steel; TODO de swap a isotipo SVG), 4 enlaces de ancla (`#servicios`, `#casos`, `#proceso`, `#faq`), CTA `Button primary` → `#contacto` siempre visible (label "Agendar" en `<sm`, "Agendar diagnóstico" en `≥sm`) y menú móvil con Popover API (`popover="auto"` + `popovertarget`), icon-swap ☰/✕ y scroll-lock vía `:has(:popover-open)`.
- **`src/layouts/BaseLayout.astro`**: expone `<slot name="header" />` entre el skip-link y `<main id="contenido">`. Sin cambios a skip-link, SEO ni landmarks. El slot `footer` se difiere al M11.
- **`src/styles/global.css`**: `html { scroll-padding-top: 5rem }` en `@layer base` para que el header sticky no oculte las anclas.
- **`src/pages/index.astro`**: monta `<Navbar slot="header" />`.
- **Único JS del sitio**: micro-script `is:inline` (~200 B) que cierra el popover al activar un enlace del panel (los navegadores no lo hacen solos; verificado en exploración). No es isla ni librería; dentro del presupuesto de AGENTS.md §04.
- **Contrato de anclas** fijado: `#servicios #casos #proceso #faq #contacto` (los ids reales llegan con los módulos 05, 06, 07, 10 y 11).
- **Degradación sin Popover API**: con `@supports not selector(:popover-open)`, el toggle/panel se ocultan y los enlaces se muestran inline — la navegación nunca se pierde.

## Capabilities

### New Capabilities

- `landing-navbar`: navegación principal del sitio — navbar sticky con CTA persistente, anclas desktop, menú móvil nativo sin frameworks (Popover API + micro-script de cierre), integración por slot `header`, accesibilidad y presupuesto de JS controlado.

### Modified Capabilities

Ninguna: la integración es aditiva (el slot `header` no altera los requisitos vigentes de `landing-base`; skip-link, SEO y `<main id="contenido">` se conservan).

## Fuera de Alcance

- Isotipo/logo SVG real (asset pendiente) — el wordmark es textual con TODO.
- Enlace "Blog" del wireframe del brief — Fase 2.
- Ids de las secciones futuras (05/06/07/10/11) — contrato fijado, implementación en sus módulos.
- Slot `footer` y footer — Módulo 11.
- Animaciones del panel, efectos scroll-driven (p. ej. sombra al scrollear), analytics de CTA, Cal.com.
- Dependencias nuevas e islas React (0 islas en este change).

## Impact

- **Nuevos**: `src/components/sections/Navbar.astro`.
- **Modificados**: `src/layouts/BaseLayout.astro` (slot `header`), `src/styles/global.css` (`scroll-padding-top`), `src/pages/index.astro` (montaje).
- **Sin cambios**: `astro.config.mjs`, `tsconfig.json`, tokens, primitivos UI (se reutilizan `Button` y `lucide-astro`).
- **Presupuesto**: 0 islas; único script inline (~200 B) muy por debajo de 10 KB.
