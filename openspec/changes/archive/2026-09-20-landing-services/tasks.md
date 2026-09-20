# Tasks

## 1. Componente y datos

- [x] 1.1 Crear `src/components/sections/Services.astro` con: array tipado `Service[]` con los 3 servicios **verbatim del brief §4.4** (códigos `S-01..S-03`, títulos, promesas, `deliverables`, `extra.label` propio de cada uno — `Stack`/`Prueba real`/`Casos` — con `kind: 'badges' | 'lines'` y `metric: '<500 ms'` solo en ②), `<section id="servicios">`, contenedor `mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24`, `SectionLabel index="05" text="SERVICIOS"` y `<h2>` "Servicios" (`text-2xl sm:text-3xl font-bold tracking-tight text-navy-900`); verificar con `pnpm astro check` (0 errores) y revisión de los textos contra el brief

## 2. Bento y tarjetas

- [x] 2.1 Grid bento: `grid gap-6 lg:grid-cols-2 lg:gap-8`; servicio ① en `<Card class="flex h-full flex-col lg:col-span-2 lg:p-8">`, servicios ②③ en `<Card class="flex h-full flex-col">`; verificar con `pnpm astro check` (0 errores) y revisión de clases (celda doble + alturas)
- [x] 2.2 Anatomía por tarjeta: `S-0N` mono → `<h3>` → promesa → label `ENTREGABLES` + `<ul>` real (ítems con marcador `·` `aria-hidden` y `text-sm text-steel-500`) → label variable + slot 2 (① badges con `Badge` en `flex flex-wrap gap-2`; ② línea con `<500 ms` en `<span class="font-mono font-bold text-navy-900 whitespace-nowrap">` partiendo la frase; ③ líneas) → CTA `Button variant="outline" size="md" href="#casos"` con `mt-auto` y texto exacto "Ver casos de estudio →"; verificar con `pnpm astro check` (0 errores) y revisión de estructura

## 3. Integración

- [x] 3.1 Montar `<Services />` en `src/pages/index.astro` inmediatamente después de `<ProblemSolution />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `id="servicios"` ×1, orden problema → servicios y los destinos del navbar intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el HTML/CSS: `id="servicios"` ×1 y `href="#servicios"` ×2 (ancla viva), textos verbatim presentes (promesas, `<500 ms`, casos), badges del stack (`Angular/React`, `NestJS/FastAPI`, `PostgreSQL/MongoDB`, `AWS`), 0 `client:*`, único `<script>` = inline del navbar (245 B) y `global.css` intacto (git diff)
- [x] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (bento en desktop y móvil, pies/CTAs alineados, barrido responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/Services.astro`, `src/pages/index.astro`) y commit `feat(services): bento grid con las 3 lineas de servicio y ancla #servicios`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-services change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
