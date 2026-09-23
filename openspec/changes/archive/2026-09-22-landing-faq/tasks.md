# Tasks

## 1. Componente y datos

- [x] 1.1 Crear `src/components/sections/Faq.astro` con `FaqItem[]` tipado (`question`, `answer`) y el copy de design.md D6: 5 preguntas y respuestas **verbatim** del brief §4.7 en el orden fijado (precio, equipo interno, boutique vs agencia, post-lanzamiento, NDA) y h2 "Preguntas frecuentes" + subcopy "Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas."; verificar con `pnpm astro check` (0 errores) y revisión del copy contra design.md
- [x] 1.2 Shell de sección: `<section id="faq" class="border-y border-line bg-white">` (banda blanca, sin textura ni corner marks), contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`, `SectionLabel index="10" text="FAQ"` + `<h2>` (`mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl`) + subcopy (`mt-3 text-steel-500`); sin CTA propio; verificar con `pnpm astro check` (0 errores) y revisión de clases/estructura contra design.md D1/D5

## 2. Accordion nativo

- [x] 2.1 Lista `mt-10 max-w-3xl` con 5 `<details name="faq">` (`open={index === 0}`, `class:list` con `border-t border-line` y `border-b` solo en la última fila) y por fila: `<summary>` (`flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden`) con `<span>` de la pregunta (`font-semibold text-navy-900`) + `ChevronDown` de `lucide-astro` (`size-4 shrink-0 text-steel-500 transition-transform group-open:rotate-180 motion-reduce:transition-none`, `aria-hidden="true"`) + respuesta (`pb-4 text-sm text-steel-500`); sin `<style>`, sin isla, sin `client:*`; verificar con `pnpm astro check` (0 errores) y revisión de estructura (5 `<details>`, un solo `open`, sin `role`/`aria-expanded`/`aria-controls` manuales, sin interactivos dentro del summary)
- [x] 2.2 Verificar que la variante `group-open:rotate-180` produce la regla del estado abierto en el CSS construido y que no hay CSS nuevo: tras el build, grep de `dist/_astro/*.css` con la regla `[open]` del chevron; `git diff` de `global.css` vacío y ausencia de bloques `<style>` en `Faq.astro`

## 3. Integración

- [x] 3.1 Montar `<Faq />` en `src/pages/index.astro` (import + inmediatamente después de `<LeadMagnet />`); verificar con `pnpm astro check` (0 errores) y, en el build, `id="faq"` ×1, orden checklist → FAQ y `href="#faq"` ×2 con destino existente; confirmar que `#servicios`, `#casos` y `#proceso` siguen vivos y `#contacto` sin cambios

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar `dist/index.html` y `dist/_astro/*.css`: `id="faq"`=1, `href="#faq"`=2, `<details`=5, `name="faq"`=5, `<summary`=5, un solo `open`, h2/subcopy/5 preguntas/5 respuestas presentes y verbatim, 3 scripts inline = 4,997 B, 0 `client:*`/islas asociadas, CSS con la regla `[open]`+`rotate-180`, `global.css` intacto (git diff)
- [x] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (render del accordion abierto/cerrado, operación por teclado Tab/Enter/Espacio con foco visible y, opcional, degradación independiente en navegador pre-2024) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/Faq.astro`, `src/pages/index.astro`) y commit `feat(faq): accordion nativo de 5 preguntas con ancla #faq`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-faq change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS, verificaciones humanas pendientes, Open Questions (confirmación de h2/subcopy) y problemas encontrados
- [x] 5.3 Ejecutar `openspec validate landing-faq` (4/4) y registrar la salida; el archivado usa el flujo CLI (nunca edición manual de specs)
