# Tasks

## 1. Componente y datos

- [x] 1.1 Crear `src/components/sections/ProblemSolution.astro` con: array tipado `PainPoint[]` con los 3 pares **verbatim del brief** en orden (citas y respuestas exactas), `<section id="problema" class="relative">`, capa decorativa `<div class="problem-texture absolute inset-0 bg-blueprint-grid" aria-hidden="true">`, contenedor `relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24` y `SectionLabel index="04" text="PROBLEMA"`; verificar con `pnpm astro check` (0 errores) y revisión de los 6 textos contra el brief

## 2. Encabezado y ledger

- [x] 2.1 Encabezado: fila en grid con `<h2>` "El problema que escuchamos" (`text-2xl sm:text-3xl font-bold tracking-tight text-navy-900`) y etiqueta mono "NUESTRA RESPUESTA" (`font-mono text-xs tracking-wider text-steel-500 uppercase hidden lg:block`) alineada sobre la columna derecha; verificar con `pnpm astro check` (0 errores) y revisión de clases
- [x] 2.2 Ledger: `<ul>` con `border-b border-line` conteniendo 3 `<li class="grid gap-3 border-t border-line py-8 lg:grid-cols-2 lg:gap-x-12">`; en cada par, dolor `<blockquote class="border-l-2 border-line pl-4 text-lg italic text-steel-500">` y respuesta `<p class="text-lg font-semibold text-navy-900">` (sin comillas literales, sin iconos, sin conector); verificar con `pnpm astro check` (0 errores) y revisión de la estructura

## 3. Textura

- [x] 3.1 Añadir el bloque `<style is:global>` con `.problem-texture { -webkit-mask-image: …; mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent); }`; verificar en el CSS construido tras `pnpm build` que aparecen ambos prefijos y la sección no define `border-y`

## 4. Integración

- [x] 4.1 Montar `<ProblemSolution />` en `src/pages/index.astro` inmediatamente después de `<StackStrip />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido ordena stack → `#problema` (×1) y conserva intactos los destinos del navbar

## 5. Verificación de aceptación

- [x] 5.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 5.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar: máscara de `.problem-texture` con ambos prefijos, sin `border-y` en la sección, 0 `client:*`, único `<script>` = inline del navbar (245 B), `global.css` intacto (git diff), y las 3 citas + 3 respuestas verbatim presentes en el HTML
- [x] 5.3 Documentar la lista de verificaciones humanas pendientes del dueño (legibilidad sobre la textura, apilado dolor→respuesta en móvil, barrido responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 6. Cierre

- [x] 6.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/ProblemSolution.astro`, `src/pages/index.astro`) y commit `feat(problemsolution): ledger 3x2 de dolores y respuestas con textura blueprint`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-problemsolution change artifacts`
- [x] 6.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del CSS/HTML, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
