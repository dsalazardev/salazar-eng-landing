# Design: Hero — titular, CTAs y panel visual blueprint

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00 (base) y M01 (navbar) completados y archivados. `index.astro` contiene el **smoke test M00** como contenido temporal; el navbar vive en `BaseLayout` vía slot `header`.
- Primitivos disponibles: `Button` (`a|button`, primary/outline, `lg: px-6 py-3 text-base`, clsx+twMerge), `SectionLabel`, `Card` (`rounded-md border-line bg-white p-6`). Texturas `.bg-blueprint-grid` (30 px, rgba navy 5 %) y `.bg-dot-pattern` (16 px, rgba navy 15 %) ya existen en `global.css`.
- Contratos vigentes: anclas `#servicios/#casos/#proceso/#faq/#contacto`; z-scale (header 40 < skip-link 50 < top layer); 0 islas; JS inicial < 10 KB (hoy: solo 245 B inline del navbar); paleta estricta de 6 tokens; `accent` solo CTAs/hover.
- Assets verificados (2026-09): isotipo `Logo sin fondo.png` **557×483 ARGB 11.2 KB**; lockup 1052×702 38.4 KB; banner `191.png` 3500×1167 **846.9 KB** (descartado del hero). Los `.ai` son `%PDF-1.6` pero **no hay convertidor local** (sin Illustrator/Inkscape/ImageMagick/pdftocairo/mutool/Ghostscript/LibreOffice) → el SVG definitivo lo exporta el dueño.
- `sharp` disponible (optionalDependency de Astro resolviada en el store) → `astro:assets` funciona; es la **primera imagen del proyecto** y no existe `src/assets/` todavía.

## Goals / Non-Goals

**Goals:**

- Hero como primera sección del main con copy verbatim del brief, dual CTA y micro-prueba, sobre la estética blueprint.
- Panel visual con el isotipo real, sin inventar marca ni datos, decorativo para AT.
- LCP textual protegido: 0 JS nuevo, 0 animaciones, imagen optimizada y acotada.
- Barrido responsive 320→1440 sin desbordes ni solapamientos.

**Non-Goals:**

- Variante A/B, StackStrip (M03), SVG definitivo (dueño), OG/favicon, preloads globales, animaciones, analytics, deps nuevas.
- No se toca `BaseLayout`, el navbar ni los primitivos; no se rediseñan tokens ni texturas.

## Decisions

### D1. Sección `#hero` y layout responsive

`<section id="hero">` como primera sección del `<main>`, contenedor `mx-auto max-w-6xl px-4 sm:px-6` (retícula alineada al navbar), `py-16 sm:py-20 lg:py-24`; grid `lg:grid-cols-12 lg:items-center lg:gap-16` con texto `lg:col-span-7` y panel `lg:col-span-5`; `lg:min-h-[calc(100svh-4rem)]` (descuenta el navbar, que está en flujo, no `fixed`). `SectionLabel index="02" text="HERO"` sobre el `h1`, dentro de la columna de texto. En móvil: una columna en el orden narrativo (label → h1 → subtítulo → CTAs → micro-prueba → panel).

*Alternativas descartadas:* 2 columnas al 50 % (subtítulo demasiado estrecho); `min-h-screen` global (frágil con barras de móvil / landscape).

### D2. Panel visual blueprint

Shell reutilizando `Card`: `<Card class="relative aspect-[4/3] overflow-hidden p-0">`. Capas internas (todas decorativas):

| Capa | Implementación |
|---|---|
| Rejilla blueprint | `absolute inset-0 .bg-blueprint-grid` |
| Patrón de puntos | `absolute` en una banda/esquina, `.bg-dot-pattern` |
| 4 cruces de registro | Cuatro `<span>` mono `+` (`text-steel-500`) posicionados en las esquinas |
| Anotación superior | `SE-01 / ISOTIPO` (mono `text-xs uppercase tracking-wider text-steel-500`) |
| Anotación inferior | `GRID 30` (misma tipografía) |
| Isotipo | `<Image>` centrado (ver D3) |

**PROHIBIDO inventar cifras/coordenadas decorativas** (la propuesta LAT/LON queda descartada). El panel completo es decorativo: `aria-hidden="true"` y `alt=""` en la imagen.

### D3. Monograma: isotipo PNG real + TODO de swap

Copiar `ARCHIVOS\LOGO\FOTOS\Logo sin fondo.png` (557×483, 11.2 KB) → `src/assets/isotipo-se.png` e importarlo en `Hero.astro`; render con `<Image>`:

- `format="webp"` explícito (no depender del default), `densities={[1, 2]}`, display ≈ **272×236 css px** (2x = 544 ≤ 557 → sin upscaling), `loading="eager"`, explicitar `width`/`height`, **sin** `fetchpriority`.
- Comentario `TODO: reemplazar por el SVG definitivo cuando el dueño lo exporte (.ai → Illustrator)`.

*Alternativas descartadas:* (a) SVG desde `.ai` — inviable en este entorno (sin herramientas; extracción vectorial no fiable); (c) monograma inventado en CSS — riesgo de marca y retrabajo garantizado.

### D4. CTAs con `Button` lg

- Primario: `variant="primary" size="lg" href="#contacto"` con copy completo "Agendar diagnóstico gratuito · 20 min" (≥sm) y etiqueta corta "Agendar diagnóstico · 20 min" (`<sm`) mediante dos spans (precedente del navbar).
- Secundario: `variant="outline" size="lg" href="#casos"`, copy "Ver casos de estudio →" (la flecha es **texto**, sin icono).
- Layout: `mt-8 flex flex-col gap-3 sm:flex-row sm:items-center`; clases `w-full sm:w-auto` en ambos.
- Jerarquía: relleno accent (acción dominante) vs contorno (exploración).

### D5. Micro-prueba

Línea única bajo los CTAs (`mt-6`): `font-mono text-xs uppercase tracking-wider text-steel-500` con el texto "RESPUESTA EN MENOS DE 24 H · REMOTO LATAM · INTERNACIONAL" y separadores `·`. Sin badges (pesarían como "stack"). Claims honestos: compromiso operativo + alcance, sin cifras.

### D6. Tipografía del titular

- `h1`: `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance` y **100 % `text-navy-900`** (regla: `accent` solo CTAs/hover).
- Subtítulo verbatim del brief: `mt-6 max-w-2xl text-lg text-steel-500 text-pretty`.
- Variante A/B ("Tu sistema actual no está roto…"): **solo documentada** como experimento futuro (requiere analytics); sin hook ni código.

*Alternativa considerada y no adoptada:* tercera frase del titular en `steel-500`/`navy-700` (evaluada; se prioriza la contundencia uniforme).

### D7. Sin animación en M02

El `h1` es el candidato a LCP: no se anima opacidad/transform. Regla futura documentada: animaciones de entrada solo CSS, con guard `@media (prefers-reduced-motion: no-preference)`, en secciones below-the-fold (M03+), nunca sobre el hero. Hover de CTAs ya lo aporta `Button`.

### D8. Accesibilidad

- `<h1>` único de la página (el wordmark del navbar es un `<a>`, no heading); futuras secciones usarán `h2`.
- Panel completo `aria-hidden="true"`; imagen `alt=""`.
- Contraste: `h1` ≈ 15:1; subtítulo `steel-500` 4.64:1 (AA); micro-prueba `steel-500` 4.64:1 (AA ajustado — ver riesgos); foco visible global accent (≈6.4:1).
- Orden de tabulación: skip-link → navbar → CTAs del hero (primeros tabbables dentro de `<main>`).

### D9. Performance / LCP

- LCP esperado = titular en Manrope (ya self-hosted desde M00; sin fuentes nuevas).
- Isotipo: 11.2 KB origen → WebP hasheado con variantes 1x/2x; `eager` (above-the-fold en desktop) pero sin `fetchpriority` (no compite con las fuentes).
- Texturas = CSS (0 requests). `191.png` (846.9 KB) queda reservada al módulo QA/DEP para OG.
- Aceptación: medir Lighthouse/LCP en preview y registrarlo (tarea del change).

### D10. Integración

`<Hero />` en `index.astro` inmediatamente después de `<Navbar slot="header" />` (dentro del slot por defecto → primera sección del `<main>`). **Se retira el smoke test del M00** (confirmado). `id="hero"` como hook de test/QA; el contrato de anclas del navbar no cambia. StackStrip (M03) irá después.

## Wireframes

**Desktop (≥lg):**
```
+------------------------------------------------------------------------------+
| [NAVBAR sticky z-40 · h-16]                                                  |
+------------------------------------------------------------------------------+
| main                                                                         |
|  section#hero · max-w-6xl · px-6 · lg:min-h-[calc(100svh-4rem)] · items-center|
|  +-----------------------------+   +------------------------------------+    |
|  | TEXT · lg:col-span-7        |   | PANEL · lg:col-span-5              |    |
|  |                             |   | +--------------------------------+ |    |
|  | 02/ HERO ------------------ |   | | +   SE-01 / ISOTIPO   GRID 30 + | |    |
|  |                             |   | |                                | |    |
|  | Sistemas que escalan.       |   | |          [ ISOTIPO SE ]        | |    |
|  | IA que produce.             |   | |          272x236 css           | |    |
|  | Sin el overhead de una      |   | |   (.bg-blueprint-grid full)    | |    |
|  | agencia.                    |   | |   (.bg-dot-pattern esquina)    | |    |
|  |                             |   | | +                            + | |    |
|  | Subtítulo steel · max-w-2xl |   | +--------------------------------+ |    |
|  |                             |   |   Card p-0 · aspect-[4/3]          |    |
|  | [Agendar diagnóstico · 20]  |   |   aria-hidden="true"               |    |
|  | [Ver casos de estudio ->]   |   |                                    |    |
|  |                             |   |                                    |    |
|  | RESP. <24H · LATAM · INTL   |   |                                    |    |
|  +-----------------------------+   +------------------------------------+    |
+------------------------------------------------------------------------------+
```

**Móvil (<lg):**
```
+-------------------------------+
| [NAVBAR]                      |
+-------------------------------+
| main                          |
| 02/ HERO -------------------  |
|                               |
| Sistemas que escalan.         |
| IA que produce.               |
| Sin el overhead de una        |
| agencia.                      |
|                               |
| Subtítulo steel (max-w-2xl)   |
|                               |
| [ Agendar diagnóstico · 20m ] |  <- full width
| [ Ver casos de estudio ->   ] |  <- full width
|                               |
| RESP. <24H · LATAM · INTL     |
|                               |
| +---------------------------+ |
| | PANEL (aspect-[4/3])      | |
| |  grid + [SE] + cruces     | |
| +---------------------------+ |
+-------------------------------+
```

**Composición del panel (detalle):**
```
+------------------------------------------------------------+
| +                                                          + |  <- cruces (mono "+")
| |  SE-01 / ISOTIPO                    GRID 30              | |
| |                                                          | |
| |                  +------------------+                    | |
| |                  |                  |                    | |
| |                  |   [ ISOTIPO SE ] |                    | |
| |                  |   272x236 css    |                    | |
| |                  +------------------+                    | |
| |                                                          | |
| |          .bg-dot-pattern (banda esquina inferior)        | |
| +                                                          + |
+------------------------------------------------------------+
   Card shell · relative · overflow-hidden · p-0 · aria-hidden
```

## Risks / Trade-offs

- [PNG 557 px sin margen para 2x a display grande] → display 272×236 css con `densities=[1,2]` (2x = 544 ≤ 557, sin upscaling); el swap a SVG lo elimina.
- [Export SVG pendiente del dueño (`.ai` sin convertidor local)] → TODO puntual en un solo lugar del componente; el PNG real evita retrabajo de diseño.
- [Label primario largo en pantallas pequeñas] → etiqueta corta `<sm` (precedente navbar) preservando el copy completo en ≥sm.
- [`steel-500` ajustado (4.64:1) en micro-prueba `text-xs`] → AA cumplido; si QA de contraste quiere margen, `navy-700` (registrado como alternativa lista).
- [`aspect-[4/3]` con isotipo 1.15:1 deja aire vertical] → aire blueprint intencional; alternativa `aspect-[5/4]` si se ve vacío en revisión.
- [Retiro del smoke test M00] → contenido temporal sin cobertura de spec; los checks de `landing-base` siguen vigentes por sus propios escenarios.
- [LCP real desconocido hasta medir] → tarea de aceptación con Lighthouse/LCP en preview; sin JS ni animación que lo retrase.
- [`100svh` con soporte moderno] → soportado en navegadores objetivo 2026; el `min-h` crece con el contenido (nunca recorta).

## Migration Plan

1. Copiar el isotipo a `src/assets/isotipo-se.png` (557×483, 11.2 KB).
2. Crear `src/components/sections/Hero.astro` (estructura → panel → CTAs → TODO SVG).
3. `index.astro`: montar `<Hero />` y retirar la sección del smoke test.
4. Verificar: `pnpm astro check` (0), `pnpm build` (sin JS nuevo, asset hasheado), `pnpm preview` (LCP/Lighthouse, a11y, barrido 320→1440).
5. Commit `feat(hero): hero con titular, CTAs y panel visual blueprint`.

Rollback: revertir el commit; sin datos ni infraestructura implicados.

## Open Questions

- Momento del export SVG del isotipo (dueño) — diferible; no cambia el plan.
- ¿`191.png` como imagen OG por defecto en el módulo QA/DEP? — diferible.
- ¿Preload de Manrope latin como optimización global de LCP? — diferible, fuera de M02.
