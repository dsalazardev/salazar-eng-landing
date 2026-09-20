# Tasks

## 1. Estructura y datos

- [x] 1.1 Crear `src/components/sections/StackStrip.astro` con: array tipado `stack: string[]` con las **16 tecnologías verbatim del brief en su orden** (incluida "Python / FastAPI" con su espaciado exacto), sección `<section id="stack" class="border-y border-line">`, contenedor `mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-12`, `SectionLabel index="03" text="STACK"`, `<h2>` visible "STACK DE PRODUCCIÓN" (`text-sm font-bold uppercase tracking-widest text-navy-900`) y tagline italic "Tecnología elegida por resultados, no por moda." (`text-sm italic text-steel-500`); verificar con `pnpm astro check` (0 errores) y revisión exacta de los 16 strings y del copy

## 2. Marquee CSS

- [x] 2.1 Construir la cinta: wrapper full-bleed con `overflow-hidden`, padding vertical de seguridad y máscara (ver 3.2); track `flex w-max` **sin gap**; **dos copias** `<ul class="stack-copy flex gap-x-10 pr-10">` (40 px interno + 40 px de padding final dentro de la copia) con cada ítem `<li><Badge class="whitespace-nowrap">…</Badge></li>`; la **segunda copia** con `aria-hidden="true"`; verificar estructura en el archivo y `pnpm astro check` (0 errores)
- [x] 2.2 Añadir el bloque `<style is:global>` con `@keyframes stack-marquee { to { transform: translateX(-50%) } }`, `.stack-track { animation: stack-marquee var(--stack-marquee-duration, 36s) linear infinite; will-change: transform }` y `--stack-marquee-duration: 36s` en la sección; verificar en el CSS construido tras `pnpm build` que existen `@keyframes`, `translateX(-50%)`, `36s` y que solo `transform`/`will-change` participan

## 3. Pausas y accesibilidad

- [x] 3.1 Añadir el toggle de pausa sin JS: `<input id="stack-pause" type="checkbox" class="peer sr-only">` + `<label for="stack-pause">` "Pausar animación" (`sr-only` que pasa a visible al foco, arriba a la derecha de la banda) y las reglas de pausa `:hover`, `:focus-within` y `input:checked ~ .stack-track { animation-play-state: paused }`; verificar las reglas en el CSS construido
- [x] 3.2 Máscara lateral `-webkit-mask-image` + `mask-image` (gradiente transparent → negro 6 % → negro 94 % → transparent) y bloque `@media (prefers-reduced-motion: reduce)` con `animation: none`, duplicado oculto y primera copia en `flex-wrap` centrada; verificar ambos en el CSS construido tras el build

## 4. Integración

- [x] 4.1 Montar `<StackStrip />` en `src/pages/index.astro` inmediatamente después de `<Hero />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido ordena hero → `#stack` y conserva intactos los destinos del navbar

## 5. Verificación de aceptación

- [x] 5.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 5.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el CSS construido: `@keyframes` presente, `translateX(-50%)`, `animation-play-state`, `will-change`, máscara con ambos prefijos y `@media (prefers-reduced-motion: reduce)`; verificar 0 `client:*`, que el único `<script>` sigue siendo el inline del navbar (245 B) y que no hay cambios en `global.css`
- [x] 5.3 Documentar la lista de verificaciones humanas pendientes del dueño (bucle sin salto en navegador real, pausas hover/foco/toggle por teclado, modo reducido estático, responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 6. Cierre

- [x] 6.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/StackStrip.astro`, `src/pages/index.astro`) y commit `feat(stackstrip): franja de stack con marquee CSS y pausas accesibles`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-stackstrip change artifacts`
- [x] 6.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del CSS, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
