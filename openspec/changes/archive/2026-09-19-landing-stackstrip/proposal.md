# Proposal: StackStrip — franja de validación técnica (marquee CSS)

## Why

Tras el hero, el visitante técnico necesita validación instantánea de que "hablan su idioma" (brief §3): una franja con las 16 tecnologías de producción comunica stack real sin ocupar media pantalla. Además, el marquee css-only es la primera animación del sitio: demuestra competencia de ejecución (0 JS, solo compositor) exactamente donde la marca promete ingeniería.

## What Changes

- **Nuevo `src/components/sections/StackStrip.astro`** (0 JS): sección `#stack` sobre `surface` con `border-y border-line` (divisor blueprint), encabezado dentro de `max-w-6xl px-4 sm:px-6` (`SectionLabel 03/ STACK` + `<h2>` visible "STACK DE PRODUCCIÓN" + tagline italic steel del brief) y **marquee full-bleed** debajo.
- **Marquee CSS puro sin salto**: track `flex` con `width:max-content` y **dos copias** de la lista; cada copia lleva `gap-x: 40px` + `padding-right: 40px` (el gap final vive dentro de la copia → track = 2W) y la animación mueve solo `transform: translateX(-50%)` (≈36 s, `linear infinite`); `will-change: transform` únicamente en el track.
- **Pausas sin JavaScript**: `:hover`/`:focus-within` → `animation-play-state: paused`, más un **toggle de pausa por teclado** (`checkbox` sr-only + `label` "Pausar animación" visible al foco) para cumplir WCAG 2.2.2; `prefers-reduced-motion: reduce` → versión estática (duplicado oculto, lista completa en `flex-wrap`).
- **Badges**: primitivo `Badge` reutilizado (`class="whitespace-nowrap"`), las **16 tecnologías del brief verbatim** en su orden (Angular, React, NestJS, Spring Boot, Node.js, PHP, Python / FastAPI, PostgreSQL, MongoDB, AWS, Docker, Terraform, Pulumi, LangChain, Ollama, n8n), gap uniforme, sin separadores de grupo.
- **Fade lateral** con `-webkit-mask-image` + `mask-image` (fallback: recorte duro, decorativo).
- **`src/pages/index.astro`**: monta `<StackStrip />` inmediatamente después de `<Hero />`.
- A11y: primera copia como `<ul>/<li>` real, duplicado `aria-hidden="true"`, `<h2>` de sección, único focusable extra = toggle de pausa, wrapper `overflow-hidden`.
- **`src/styles/global.css` no se toca**: todos los estilos del módulo viven en `<style is:global>` de `StackStrip.astro` con clases namespaced `stack-*`.

## Capabilities

### New Capabilities

- `landing-stackstrip`: franja de validación técnica post-hero — encabezado con copy del brief, marquee CSS sin JavaScript con loop continuo y sin salto, pausas accesibles (hover/focus/toggle/reduced-motion) y badges de las 16 tecnologías.

### Modified Capabilities

Ninguna: la franja es aditiva y no altera requisitos de `landing-base`, `landing-navbar` (contrato de anclas y z-scale intactos) ni `landing-hero`.

## Fuera de Alcance

- Banda invertida navy-900 (reservada a `CtaFinal`, M11).
- Separadores de grupos de tecnologías, pausa táctil `:active`, triple copia del track.
- Content Collections o archivo de datos externo para el stack.
- Cambios en `global.css`, navbar, hero, contrato de anclas, dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/StackStrip.astro`.
- **Modificados**: `src/pages/index.astro` (montaje tras el hero).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Presupuesto**: 0 JS nuevo; primera animación del proyecto limitada a `transform` (compositor) + un `will-change`; sin imágenes nuevas; sin CLS.
