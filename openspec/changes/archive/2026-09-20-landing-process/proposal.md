# Proposal: Process — Timeline de 4 pasos con ancla #proceso

## Why

Tras la evidencia (M06), el decisor aún puede dudar "¿y si es un freelance solo?" (brief §3): falta mostrar el método de trabajo. Esta sección responde con un proceso de 4 pasos numerados y resuelve la **tercera ancla viva del contrato del navbar**: hoy `href="#proceso"` aparece ×2 (navbar desktop + panel móvil) e `id="proceso"` no existe en ninguna parte.

## What Changes

- **Nuevo `src/components/sections/Process.astro`** (0 JS): sección `id="proceso"` en surface plana (contraste deliberado con la banda blanca de M06), `SectionLabel 07/ PROCESO` + `<h2>` "Cómo trabajamos" + tagline "Diagnóstico primero; cotización por alcance cerrado y fases." (verbatim §4.7).
- **Timeline de 4 pasos en un único `<ol>`**: horizontal 4-col en `lg` (línea 1px `border-line` continua + nodos `01`–`04` mono que la enmascaran) y rail vertical en `<lg` (segmento `w-px bg-line` por paso). Sin flechas, sin iconos, sin diagramas.
- **Numeración `01`–`04` en mono dentro de los nodos**, `aria-hidden` (el orden lo comunica el `<ol>`).
- **Copy por paso derivado del brief (marcado "a confirmar por el dueño")**: 01 Diagnóstico, 02 Propuesta, 03 Sprints con demos (variante B, sin duplicar §4.6/M08), 04 Entrega + soporte. Única cifra: "20 minutos" del paso 01 (ya existente en el brief).
- **100 % tipográfico**: sin iconos, sin mini-diagramas/C4, sin CTA propio (el navbar sticky y M11 cubren la conversión).
- **`src/pages/index.astro`**: monta `<Process />` inmediatamente después de `<ProofOfWork />`.
- **`id="proceso"`** resuelve las 2 anclas del navbar; `<h3>` por paso; 0 JS nuevo; `global.css` intacto.

## Capabilities

### New Capabilities

- `landing-process`: sección de método con timeline de 4 pasos numerados (línea + nodos blueprint, `<ol>` semántico) y ancla `#proceso` del contrato.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip`, `landing-problemsolution`, `landing-services` ni `landing-proofofwork`.

## Fuera de Alcance

- CTA propio en la sección (alt registrada: reuso exacto del CTA del hero) e iconos/mini-diagramas.
- Texturas, bandas o corner marks (la sección es plana por diseño).
- Animaciones/scroll-reveal (micro-change dedicado).
- Cambios en `global.css`, navbar, otras secciones o el contrato de anclas (solo se **resuelve** `#proceso`).
- Cifras de duración nuevas (prohibido inventar) y cláusulas que dupliquen §4.6 (reservadas a M08).
- Dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/Process.astro`.
- **Modificados**: `src/pages/index.astro` (montaje tras ProofOfWork).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, stackstrip, problemsolution, services, proofofwork, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Contrato**: `#proceso` pasa de muerta a viva (2 enlaces resueltos); `#faq` y `#contacto` siguen pendientes de M10/M11.
- **Presupuesto**: 0 JS nuevo; 0 imágenes; sin CLS.
