# Tasks

## 1. Shell (BaseLayout + base CSS)

- [x] 1.1 Añadir `<slot name="header" />` en `src/layouts/BaseLayout.astro` entre el skip-link y `<main id="contenido">` (sin tocar skip-link, SEO ni landmarks); verificar con `pnpm astro check` (0 errores) y revisión del archivo
- [x] 1.2 Añadir `html { scroll-padding-top: 5rem; }` en `@layer base` de `src/styles/global.css`; verificar que tokens, `:focus-visible`, `::selection` y las texturas `.bg-blueprint-grid`/`.bg-dot-pattern` quedan intactos (diff del archivo)

## 2. Navbar.astro

- [x] 2.1 Crear `src/components/sections/Navbar.astro` con la estructura desktop: `<header class="sticky top-0 z-40">` + capa blur absoluta separada (`absolute inset-0 bg-surface/80 backdrop-blur-sm border-b border-line`, fallback `supports-[backdrop-filter]:bg-surface/80 bg-surface`) + `<nav aria-label="Principal">` con wordmark textual (`SALAZAR` bold navy + `Eng.` mono steel, TODO de isotipo SVG), 4 anclas (`#servicios`, `#casos`, `#proceso`, `#faq`) y CTA `Button variant="primary" href="#contacto"` con doble label (`Agendar` en `<sm` / `Agendar diagnóstico` en `≥sm`); verificar con `pnpm astro check` (0 errores)
- [x] 2.2 Añadir el menú móvil: botón `popovertarget="menu-movil"` con `aria-label="Menú"`, `md:hidden`, área táctil ≥44×44 (`min-h-11 min-w-11`) e iconos `Menu`/`X` de `lucide-astro`; panel `<div id="menu-movil" popover="auto">` anclado bajo el header (`fixed inset-x-0 top-16 bottom-0 m-0 w-auto h-auto border-0 bg-surface`, `overflow-y-auto`, `overscroll-behavior-contain`) con `<nav aria-label="Menú móvil">` y los 4 enlaces; verificar con `pnpm astro check` (0 errores) y revisión de la estructura en el HTML construido
- [x] 2.3 Añadir el bloque `<style is:global>` del componente: icon-swap ☰/✕ vía `header:has(#menu-movil:popover-open)` (o variantes Tailwind equivalentes), scroll-lock `html:has(#menu-movil:popover-open) { overflow: hidden }` y overrides de estilos UA del popover que no cubran las utilidades; verificar en `pnpm preview` que el icono cambia al abrir/cerrar y que el scroll queda bloqueado con el panel abierto *(interacción → humana pendiente, ver reporte 5.2)*
- [x] 2.4 Añadir el micro-script `is:inline` (~200 B) que cierra el panel al activar un enlace (`hidePopover()` cuando `e.target.closest('a')`); verificar que no genera bundle JS (en el build, el único script presente es este inline y pesa ≲1 KB)
- [x] 2.5 Añadir el fallback `@supports not selector(:popover-open)` que oculta toggle/panel y muestra los enlaces inline en móvil (CTA intacto); verificar por inspección del CSS construido y prueba manual en DevTools aplicando/forzando el bloque (documentar el resultado) *(forzado en DevTools → humana pendiente, ver reporte 5.2)*

## 3. Integración

- [x] 3.1 Montar `<Navbar slot="header" />` en `src/pages/index.astro` (conservando el smoke test actual como contenido); verificar con `pnpm astro check` (0 errores) y que el HTML construido ordena skip-link → header → `<main id="contenido">`

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; verificar que no hay `client:*` ni scripts de islas, que el único `<script>` es el inline de cierre, que el CSS construido incluye `scroll-padding-top` y que no aparecen colores fuera de los 6 tokens
- [x] 4.3 Ejecutar `pnpm preview` y verificar manualmente: sticky al scrollear; CTA visible en móvil y desktop con sus etiquetas; orden de foco con skip-link; anclas compensadas (inyectar un destino temporal en DevTools y comprobar que no queda oculto por el header) *(inspección ✓; interacción → humana pendiente, ver reporte 5.2)*
- [x] 4.4 Verificar manualmente el menú móvil en preview: abre/cierra por botón, cierra con Escape con foco de retorno al botón, cierra con clic fuera (light dismiss), cierra y navega al activar un enlace, y el panel bloquea el scroll *(inspección ✓; interacción → humana pendiente, ver reporte 5.2)*
- [x] 4.5 Spot-check del navbar (sticky + popover + Esc + cierre al navegar) en Safari y Firefox actuales; registrar diferencias y, si alguna bloquea, pausar y reportar *(sin acceso directo: Playwright solo Chromium, sin Firefox nativo; Safari no verificable en Windows → humana pendiente, ver reporte 5.2)*
- [x] 4.6 Confirmar que `package.json` no gana dependencias nuevas y que solo se usan tokens existentes (diff contra el estado previo al change)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` (solo archivos del alcance: `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `src/components/sections/Navbar.astro`, `src/pages/index.astro`) y commit `feat(navbar): navbar sticky con CTA y menú móvil nativo`; verificar con `git show --stat HEAD` (los cambios pendientes del M00 y el artefacto `.playwright-mcp/` NO entran en este commit)
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, resultado de las pruebas manuales y del spot-check, tamaño del JS inline, decisiones no cubiertas y problemas encontrados
