# Proposal: Services — Bento Grid con las 3 líneas de servicio

## Why

Tras el reconocimiento dolor→solución, el decisor necesita la oferta concreta: 3 líneas de servicio con promesa, entregables y stack (brief §3: "Oferta clara: 3 líneas, entregables y stack por servicio"). Además, esta sección resuelve la **primera ancla viva del contrato del navbar**: hoy `href="#servicios"` aparece ×2 y `id="servicios"` no existe en ninguna parte.

## What Changes

- **Nuevo `src/components/sections/Services.astro`** (0 JS): sección `#servicios` **plana** (sin textura ni `border-y`), con `SectionLabel 05/ SERVICIOS` + `<h2>` "Servicios" y un **Bento Grid** (`lg:grid-cols-2 lg:gap-8`) donde el servicio ① ocupa la **celda 2x1** (`lg:col-span-2`) y ②③ las celdas 1x1; móvil apila ①②③ (`gap-6`).
- **Anatomía uniforme por servicio**: `S-0N` (mono) → `<h3>` título → promesa → label mono `ENTREGABLES` + `<ul>` real (marcador `·`) → **slot 2 con label propio del brief** (`STACK` / `PRUEBA REAL` / `CASOS`) → **CTA secundario** con `mt-auto`.
- **`Card` como shell** de cada celda (sin `interactive`; `h-full flex flex-col`; ① `lg:p-8`, ②③ `p-6`) — primera sección que la usa como contenedor de contenido.
- **Copy 100 % verbatim del brief §4.4**: promesas, entregables y los 3 slots variables (stack de 4 badges en ①, frase de prueba real en ②, 3 casos en ③). La métrica `<500 ms` se enfatiza inline (`font-mono font-bold text-navy-900 whitespace-nowrap`) sin `accent`.
- **CTA secundario**: reuso exacto de "Ver casos de estudio →" → `#casos` (`Button variant="outline" size="md"`) en las 3 tarjetas — único texto no-verbatim del módulo y es reuso exacto de copy existente.
- **Cero iconos** (100 % tipográfico, consistente con M04).
- **`src/pages/index.astro`**: monta `<Services />` inmediatamente después de `<ProblemSolution />`.
- **`id="servicios"`** resuelve las 2 anclas del navbar (desktop + panel móvil); `<h3>` por servicio; 0 JS nuevo; `global.css` intacto.

## Capabilities

### New Capabilities

- `landing-services`: sección de oferta con bento grid responsive de 3 servicios — promesa, entregables y slot variable (stack/prueba real/casos) por línea, con CTA secundario y ancla `#servicios` del contrato.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip` ni `landing-problemsolution`.

## Fuera de Alcance

- Animaciones/scroll-reveal (micro-change dedicado).
- Iconos por servicio; copy nuevo (salvo el reuso exacto del CTA); métricas o claims nuevos.
- Cambios en `global.css`, navbar, hero, stackstrip, problemsolution o el contrato de anclas (solo se **resuelve** `#servicios`).
- Dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/Services.astro`.
- **Modificados**: `src/pages/index.astro` (montaje tras ProblemSolution).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, stackstrip, problemsolution, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Contrato**: `#servicios` pasa de muerta a viva (2 enlaces del navbar resueltos); `#casos` sigue pendiente de M06.
- **Presupuesto**: 0 JS nuevo; 0 imágenes; sin CLS.
