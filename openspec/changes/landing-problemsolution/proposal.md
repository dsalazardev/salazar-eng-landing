# Proposal: ProblemSolution — 3 dolores → 3 soluciones

## Why

Tras el hero (que vende) y la franja de stack (que valida), el decisor necesita reconocerse: el objetivo estratégico del bloque 04 del brief es que "el decisor se reconoce en los dolores" y que esa identificación sea el puente a servicios. Esta sección lo hace con las palabras del propio cliente (3 citas verbatim del brief) respondidas por el estudio, sobre una textura blueprint sutil que le da identidad propia en la alternancia de fondos.

## What Changes

- **Nuevo `src/components/sections/ProblemSolution.astro`** (0 JS): sección `#problema` con **textura blueprint sutil** (capa absoluta `problem-texture` con `.bg-blueprint-grid` + máscara vertical; fallback = textura completa al 5 %) y **sin `border-y`** (el `border-b` de StackStrip ya separa).
- **Encabezado (toda la copy es del brief)**: `SectionLabel index="04" text="PROBLEMA"` + `<h2>` "El problema que escuchamos" (`text-2xl sm:text-3xl font-bold tracking-tight`) + etiqueta mono "NUESTRA RESPUESTA" sobre la columna derecha **solo en `≥lg`**.
- **Ledger 3×2**: `<ul>` de 3 pares; cada par `grid lg:grid-cols-2 lg:gap-x-12`; separadores `border-t border-line`; en móvil apila **dolor → respuesta** pegados.
- **Dolor**: `<blockquote>` `text-lg italic text-steel-500` con `border-l-2 border-line pl-4`, **sin comillas literales**. **Respuesta**: `<p>` `text-lg font-semibold text-navy-900`. Sin badges ni conector "→".
- **Datos verbatim del brief** (array tipado de 3 pares): citas "El sistema va lento y cada cambio rompe algo.", "El equipo pierde horas en tareas manuales.", "Nuestros datos están, pero no sirven para decidir." → respuestas "Arquitectura moderna + métricas antes/después", "Automatización e IA aplicada en tu flujo real", "Copilotos con RAG sobre tus documentos".
- **Cero iconos** (100 % tipográfico) y **cero animación** (estático, consistente con M03 y D7 del hero).
- **`src/pages/index.astro`**: monta `<ProblemSolution />` inmediatamente después de `<StackStrip />`.
- **`id="problema"`** como hook de test/QA; contrato de anclas y z-scale intactos; 0 JS nuevo; estilos del módulo (solo la máscara) en `<style is:global>` namespaced `problem-*`; `global.css` no se toca.

## Capabilities

### New Capabilities

- `landing-problemsolution`: sección de reconocimiento dolor→solución posterior al stack — ledger 3×2 con citas y respuestas verbatim del brief sobre textura blueprint sutil, apilado en móvil y sin JavaScript.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero` ni `landing-stackstrip`.

## Fuera de Alcance

- Animaciones de entrada / scroll-reveal (se diseñará como micro-change dedicado).
- Iconos, badges, conector "→" y CTA-puente (el puente a servicios es narrativo/posicional: las respuestas prefiguran las líneas de servicio).
- Cards (reservadas al bento de Servicios, M05).
- Cambios en `global.css`, navbar, hero, stackstrip, contrato de anclas, dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/ProblemSolution.astro`.
- **Modificados**: `src/pages/index.astro` (montaje tras el stackstrip).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, stackstrip, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Presupuesto**: 0 JS nuevo; 0 imágenes nuevas (textura CSS); sin CLS.
