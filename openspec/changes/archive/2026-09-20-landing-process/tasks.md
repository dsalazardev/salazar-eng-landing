# Tasks

## 1. Componente y datos

- [x] 1.1 Crear `src/components/sections/Process.astro` con `ProcessStep[]` tipado (`code` '01'–'04', `title`, `description`) y el copy exacto de design.md D5 (h2 "Cómo trabajamos"; tagline "Diagnóstico primero; cotización por alcance cerrado y fases."; 01 "Diagnóstico técnico de 20 minutos, sin costo ni compromiso. Salimos con un plan claro, lo trabajemos o no."; 02 "Cotización por alcance cerrado y fases: qué se construye, en qué orden y a qué precio, antes de empezar."; 03 "Construcción por sprints con demos periódicas del avance, con código testeado en cada entrega."; 04 "Plataforma en producción, con documentación y traspaso al equipo. Todo proyecto incluye un periodo de soporte."; única cifra "20 minutos" en 01); verificar con `pnpm astro check` (0 errores) y revisión del copy contra design.md
- [x] 1.2 Shell de sección: `<section id="proceso">` surface plana (sin banda, textura ni corner marks), contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`, `SectionLabel index="07" text="PROCESO"` + `<h2>` (`mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl`) + tagline (`mt-3 text-steel-500`); verificar con `pnpm astro check` (0 errores) y revisión de clases

## 2. Timeline

- [x] 2.1 `<ol>` único `relative grid gap-8 lg:grid-cols-4 lg:gap-10`; cada `li` con `<h3>` (título del paso) + `<p>` (descripción `mt-2 text-sm text-steel-500`); sin iconos, sin CTA propio, sin diagramas; verificar con `pnpm astro check` (0 errores) y revisión de estructura
- [x] 2.2 Dispositivo blueprint: línea horizontal `hidden h-px bg-line lg:block` absoluta al centro del nodo (borde a borde del contenedor) + nodos 24×24 (`border border-line bg-surface font-mono text-xs`, `aria-hidden="true"`) alineados a la izquierda de su columna; en `<lg` rail vertical (`grid grid-cols-[auto_1fr] gap-x-4`, segmento `w-px flex-1 bg-line` por paso, el último sin segmento; segmentos `lg:hidden`); verificar con `pnpm astro check` (0 errores) y revisión de clases/numeración 01–04

## 3. Integración

- [x] 3.1 Montar `<Process />` en `src/pages/index.astro` inmediatamente después de `<ProofOfWork />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `id="proceso"` ×1, orden casos → proceso y los destinos del navbar intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el HTML/CSS: `id="proceso"` ×1 y `href="#proceso"` ×2 (tercera ancla viva), "07/ PROCESO", "Cómo trabajamos", tagline, los 4 títulos de paso, las 4 descripciones, numeración 01–04 en los nodos, única cifra "20 minutos", 0 iconos/CTA/diagramas, `aria-hidden` en nodos y línea, 0 `client:*`, único `<script>` = inline del navbar (245 B) y `global.css` intacto (git diff)
- [x] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (timeline horizontal y rail vertical, densidad en 1024 px, responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/Process.astro`, `src/pages/index.astro`) y commit `feat(process): timeline de 4 pasos con ancla #proceso`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-process change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
