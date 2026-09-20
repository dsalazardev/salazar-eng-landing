# Design: Navbar sticky con CTA y menú móvil nativo

## Context

Ver `proposal.md` — Why. Estado actual y restricciones que condicionan el diseño:

- `BaseLayout.astro` aún no expone slots con nombre: skip-link (primer elemento enfocable, `focus:z-50`) → `<main id="contenido"><slot /></main>`. La nota de evolución del M00 (`archive/.../design.md:89-91`) ya prevé este cambio para el Módulo 01.
- Tokens y primitivos listos (`global.css`, `Button`, `lucide-astro` con `Menu`/`X`). `Button` ya resuelve `a|button`, variantes y `focus-visible:outline-2`.
- `global.css` no tiene `scroll-padding-top`: sin él, un header sticky ocultaría las anclas.
- Restricciones del proyecto: 0 islas de React, JS inicial < 10 KB, Tailwind v4 CSS-first (sin config), paleta estricta de 6 tokens, iconos solo `lucide-astro`.
- Evidencia de la exploración previa (2026-09, Chromium + CDP/Playwright) que fundamenta D2/D3/D9:
  - El popover en top layer escapa a containing blocks de ancestros con `backdrop-filter`, `filter` y `transform` (rect idéntico al del viewport en los 3 casos).
  - El botón invocador expone `expanded=true/false` **de forma nativa** en el árbol de accesibilidad; el panel se expone como `role=group`.
  - Escape cierra y devuelve el foco al invocador; el clic fuera (light dismiss) funciona; el toggle reabre/cierra.
  - **Click en un enlace interno NO cierra el popover** (el documento scrollea detrás, `scrollY=144`, con el panel abierto) — de ahí el micro-script de D3.
  - `:has(#menu-movil:popover-open)` matchea en `header` y en `html` (habilita icon-swap y scroll-lock sin JS).
  - Soporte de la Popover API: Chrome 114+/Safari 17+/Firefox 125+; Baseline "newly available" (ene-2025), sin ser "widely available" hasta 2027 → el fallback de D9 es obligatorio.

## Goals / Non-Goals

**Goals:**

- Navbar sticky con CTA persistente y menú móvil nativo, íntegramente en HTML/CSS del componente (0 islas), con el micro-script de cierre como único JS.
- Shell preparado para las secciones futuras sin romper skip-link, SEO ni landmarks.
- Comportamiento verificable en preview: sticky, popover, Esc, foco, anclas compensadas.

**Non-Goals:**

- Isotipo SVG real, Blog, ids de secciones futuras, footer/slot footer, animaciones del panel, scroll-driven, analytics, Cal.com, dependencias nuevas.
- No se rediseña nada del M00 (tokens, primitivos, texturas quedan intactos).

## Decisions

### D1. Integración por slot `header`

`BaseLayout` pasa a:

```html
<a href="#contenido" class="... sr-only focus:not-sr-only ...">Saltar al contenido</a>
<slot name="header" />
<main id="contenido"><slot /></main>
```

`Navbar.astro` renderiza su propio `<header>` (la sección es dueña de su markup; el layout queda genérico). `index.astro` monta `<Navbar slot="header" />`. El slot `footer` se difiere a M11.

*Alternativas descartadas:* navbar hardcodeada en BaseLayout (acopla el layout genérico a una sección); navbar en el slot por defecto (quedaría dentro de `<main>`, rompiendo landmark y skip-link).

### D2. Menú móvil con Popover API nativa

- Botón invocador con `popovertarget="menu-movil"`; panel con `popover="auto"` (light dismiss + Escape + foco de retorno nativos).
- Panel anclado bajo el header: `fixed inset-x-0 top-16 bottom-0 m-0 w-auto h-auto border-0 bg-surface` (override de los estilos UA del popover), `overflow-y: auto`, `overscroll-behavior: contain`, `md:hidden`.
- Sin dim en `::backdrop`: el header permanece visible y operable mientras el panel está abierto; el panel es opaco y cubre el resto.
- Icono ☰/✕ con dos iconos `lucide-astro` alternados por CSS: `header:has(#menu-movil:popover-open)` (variantes de Tailwind `group-has-[...]` o el bloque de estilo del componente).
- Scroll-lock sin JS: `html:has(#menu-movil:popover-open) { overflow: hidden }`.

*Alternativas descartadas:* `<details>/<summary>` (sin Esc, sin light dismiss, panel in-flow → CLS); checkbox-hack (semántica y foco pobres); isla React (react-dom ~40+ KB rompe el presupuesto <10 KB y la promesa de 0 islas).

### D3. Cierre al navegar: micro-script inline (DECIDIDO)

El micro-script (~200 B, `is:inline`) cierra el popover cuando el clic proviene de un enlace del panel:

```html
<script is:inline>
  document.getElementById('menu-movil')?.addEventListener('click', (e) => {
    if (e.target instanceof Element && e.target.closest('a')) {
      e.currentTarget.hidePopover();
    }
  });
</script>
```

Racional: el popover no se cierra solo al activar un enlace (verificado); el presupuesto de AGENTS.md §04 es **JS inicial < 10 KB**, no 0 absoluto; el script no es isla ni librería y es el único JS del sitio en este módulo. El estado expandido ya lo cubre la plataforma (no se necesita sincronizar `aria-expanded`).

*Alternativa descartada:* aceptar el quirk (el panel queda abierto tapando la sección destino — inaceptable en el 100 % de las navegaciones móviles por ancla).

### D4. Tratamiento sticky + estética blueprint

- `<header class="sticky top-0 z-40">`; el blur va en una **capa absoluta separada** (`absolute inset-0 bg-surface/80 backdrop-blur-sm border-b border-line`) y el contenido de la nav en una capa `relative`. Defensa en profundidad: aunque el test no reprodujo recortes, evita cualquier efecto de ancestro filtrado sobre el panel.
- Fallback sin `backdrop-filter`: `supports-[backdrop-filter]:bg-surface/80 bg-surface` (si no hay soporte, fondo sólido).
- Borde inferior estático (`border-b border-line`), sin sombra ni `animation-timeline`: a sep-2026 las scroll-driven animations no son Baseline (Firefox tras flag, ~85 % global) y nunca deben ser load-bearing.
- Sin animación de apertura del panel en M01; si se añade en el futuro, gate con `prefers-reduced-motion`.

*Alternativas descartadas:* blur en el `<header>` completo (funciona en Chromium, pero la capa separada es más robusta); sombra al scrollear con scroll-driven (`@supports` + fallback no justificado para M01).

### D5. Z-scale documentado

`header z-40` < `skip-link z-50` (ya existente en BaseLayout) < capas nativas (popover/dialog, sin `z-index`). Con ambos en 50, el header taparía el skip-link por orden de DOM.

```
top layer  [popover #menu-movil · futuros <dialog>]
z-50       [skip-link "Saltar al contenido" al foco]
z-40       [header sticky navbar]
z-auto     [<main>: secciones, texturas, cards]
```

### D6. Contrato de anclas y offset

- Destinos fijos: `#servicios`, `#casos`, `#proceso`, `#faq` (orden narrativa: qué hacemos → prueba → método → objeciones) y CTA → `#contacto`. Los ids los implementan los módulos 05, 06, 07, 10 y 11; aquí solo se fija el contrato.
- `global.css` (`@layer base`): `html { scroll-padding-top: 5rem }` para que el header (h-16 = 4 rem) no oculte los destinos.
- "Blog" del wireframe del brief queda fuera (Fase 2) — documentado como deuda consciente.

*Alternativa descartada:* `scroll-margin-top` por sección en cada módulo (disperso; el offset es una consecuencia del header, así que vive con el header/base).

### D7. Marca, enlaces y CTA

- Wordmark textual: `<a href="/">` con `SALAZAR` (Manrope bold navy) + `Eng.` (`font-mono` steel); comentario TODO para swap a isotipo SVG cuando se exporte desde `ARCHIVOS/LOGO/AI/`.
- Enlaces desktop: `text-sm font-semibold text-navy-900 hover:text-accent transition-colors` (contraste navy-900 sobre surface ≈ 13:1; `steel-500` daría 4.64:1, pasa AA pero ajustado).
- CTA: `Button variant="primary" href="#contacto"` siempre visible (barra desktop y móvil); etiqueta "Agendar" en `<sm` y "Agendar diagnóstico" en `≥sm` mediante dos spans con `sm:hidden`/`hidden sm:inline`. El panel móvil no repite CTA (ya vive en la barra).

### D8. Accesibilidad

- `<nav aria-label="Principal">` para desktop (`hidden md:flex`) y `<nav aria-label="Menú móvil">` dentro del panel (`md:hidden`): landmarks excluyentes por breakpoint (lo `display:none` no se expone).
- Botón de menú: `aria-label="Menú"`, `md:hidden`, área táctil `min-h-11 min-w-11` (44 px) con iconos `size-5`. El estado expandido/colapsado lo anuncia la plataforma (evidencia CDP).
- Foco: skip-link primero (z-50 > z-40); Escape devuelve foco al botón (nativo); `:focus-visible` global del M00 sin cambios.
- El panel se expone como `role=group`; el `<nav>` interno con label lo nombra.

### D9. Degradación sin Popover API

Bloque `@supports not selector(:popover-open)` en el estilo del componente:

- Se ocultan toggle móvil y panel; se muestra una fila de enlaces inline (siempre navegable) bajo la barra en móvil; el CTA se conserva.
- Requisito de la spec: "sin soporte de popover el usuario sigue pudiendo navegar".

*Alternativas descartadas:* dejar solo el CTA (pierde navegación); panel siempre visible sin toggle (layout roto/basura visual en todos los viewports móviles).

### D10. Dónde vive cada estilo

- `global.css`: solo `scroll-padding-top` (concern de layout global).
- `Navbar.astro`: el resto (posicionamiento del panel, override de estilos UA, `html:has(...)` del scroll-lock y bloque `@supports` del fallback) en un `<style is:global>` del componente — cohesión del navbar sin ensuciar el CSS global. La mayoría del estilado va en utilidades Tailwind en el markup.

## Risks / Trade-offs

- [El micro-script es el único JS del sitio; si crece pierde el espíritu "0 KB"] → Presupuesto verificado en tasks (inline ≤ ~1 KB; sigue muy por debajo de 10 KB) y documentado como el único script.
- [Anclas sin destino hasta que existan los módulos 05/06/07/10/11] → Contrato fijado en D6; verificación real en esos módulos; navegación de ancla inerte mientras tanto (no rompe la página).
- [Soporte de Popover API no universal ("newly available", no "widely")] → Fallback D9 garantiza navegación; audiencia B2B en navegadores modernos.
- [Reflujo/edge case al redimensionar de móvil a `md` con el panel abierto] → `md:hidden` oculta el panel; el popover queda abierto sin UI visible hasta el próximo toggle. Aceptado y documentado (sin JS adicional).
- [Blur + top layer en Safari/Firefox no verificados en esta máquina] → Spot-check Safari/Firefox como tarea de verificación del apply; la capa separada reduce el riesgo.
- [Foco a `BODY` tras Escape en el flujo "clic en enlace → Escape"] → Con D3 el flujo normal cierra el panel al navegar; el caso residual (Escape tras clic sin navegar) no bloquea.
- [`html:has(...)` como scroll-lock es imperfecto en iOS Safari] → Aceptado; mejora opcional futura; no afecta la funcionalidad del menú.
- [Header sticky subido a `z-40` podría quedar bajo contenido futuro mal capado] → Z-scale documentado (D5); los overlays usan top layer nativo, no z-index.

## Migration Plan

1. `BaseLayout`: añadir `<slot name="header" />` (sin tocar skip-link ni `<main>`).
2. `global.css`: añadir `scroll-padding-top: 5rem` en `@layer base`.
3. Crear `Navbar.astro` (estructura desktop → panel popover → micro-script → fallback → estilos del componente).
4. Montar `<Navbar slot="header" />` en `index.astro`.
5. Verificar (`pnpm astro check`, `pnpm build` sin islas, `pnpm preview`: sticky, popover, Esc, cierre al navegar, anclas compensadas; spot-check Safari/Firefox) y commit `feat(navbar): ...`.

Rollback: revertir el commit; no hay datos ni infraestructura implicados.

## Open Questions

- Momento del swap del wordmark textual por el isotipo/logo SVG (asset pendiente de exportar) — diferible; el TODO queda en el código.
- Destino final de `#contacto` (¿sección LeadMagnet 09 o CtaFinal 11?) — contrato provisional; no cambia la implementación del navbar y se confirma en M11.
