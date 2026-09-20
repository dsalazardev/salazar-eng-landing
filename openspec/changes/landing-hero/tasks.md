# Tasks

## 1. Asset del isotipo

- [x] 1.1 Copiar `ARCHIVOS\LOGO\FOTOS\Logo sin fondo.png` (557×483, ARGB, 11.2 KB) a `src/assets/isotipo-se.png`; verificar con inspección de dimensiones/formato (557×483, canal alfa) y peso (~11 KB) que el asset quedó íntegro

## 2. Hero.astro

- [x] 2.1 Crear `src/components/sections/Hero.astro` con la estructura base: `<section id="hero">`, contenedor `mx-auto max-w-6xl px-4 sm:px-6`, `py-16 sm:py-20 lg:py-24`, grid `lg:grid-cols-12 lg:items-center lg:gap-16` con `lg:min-h-[calc(100svh-4rem)]`, `SectionLabel index="02" text="HERO"`, `<h1>` único con el titular del brief (`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance text-navy-900`) y subtítulo verbatim (`mt-6 max-w-2xl text-lg text-steel-500 text-pretty`); verificar con `pnpm astro check` (0 errores) y revisión de la estructura
- [x] 2.2 Añadir los CTAs y la micro-prueba: `Button` lg primario con doble label ("Agendar diagnóstico · 20 min" en `<sm` / "Agendar diagnóstico gratuito · 20 min" en `≥sm`) hacia `#contacto`, `Button` lg outline "Ver casos de estudio →" hacia `#casos`, layout `mt-8 flex flex-col gap-3 sm:flex-row sm:items-center` con `w-full sm:w-auto`, y línea mono `mt-6 font-mono text-xs uppercase tracking-wider text-steel-500` con "RESPUESTA EN MENOS DE 24 H · REMOTO LATAM · INTERNACIONAL"; verificar con `pnpm astro check` (0 errores) y revisión de copy/destinos
- [x] 2.3 Construir el panel visual: `Card` shell (`relative aspect-[4/3] overflow-hidden p-0`) con capas `.bg-blueprint-grid` (full), `.bg-dot-pattern` (banda/esquina), 4 cruces `+` mono en las esquinas, exactamente 2 anotaciones ("SE-01 / ISOTIPO", "GRID 30"), e isotipo con `<Image>` importado de `src/assets` (`format="webp"`, `densities={[1, 2]}`, display 272×236, `width`/`height` explícitos, `loading="eager"`, sin `fetchpriority`); panel `aria-hidden="true"` con `alt=""` e TODO de swap al SVG definitivo; verificar con `pnpm astro check` (0 errores) y `pnpm build` (asset WebP hasheado generado en `dist/`)

## 3. Integración

- [x] 3.1 En `src/pages/index.astro`: montar `<Hero />` inmediatamente después de `<Navbar slot="header" />` y **retirar la sección del smoke test M00**; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `<section id="hero">` como primera sección del `<main>` y sin rastros del smoke test

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; verificar que no hay `client:*` ni scripts de islas, que el único `<script>` sigue siendo el inline del navbar (245 B), que el asset del isotipo sale hasheado con `width`/`height` y sin `fetchpriority`, y que no aparecen colores fuera de los 6 tokens
- [x] 4.3 En `pnpm preview`: medir y registrar el LCP (Lighthouse si está disponible; si no, captura del LCP vía PerformanceObserver/browser) y verificar accesibilidad: `<h1>` único, contraste AA del subtítulo y micro-prueba, foco visible en ambos CTAs, panel oculto para AT (inspección del DOM + verificación humana de lo visual)
- [x] 4.4 Barrido responsive en preview a 320, 375, 768, 1024 y 1440 px: sin desbordamiento horizontal, CTAs a ancho completo y con label corto en `<sm`, panel sin solapamientos (registrar hallazgos; los aspectos visuales finos quedan como verificación humana del dueño)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/Hero.astro`, `src/assets/isotipo-se.png`, `src/pages/index.astro`) y commit `feat(hero): hero con titular, CTAs y panel visual blueprint`; verificar con `git show --stat HEAD`. Los artefactos del change van en commit aparte `docs(openspec): add landing-hero change artifacts` (consistente con M00/M01); los pendientes de higiene previos (M00/M01 y `.playwright-mcp/`) no entran
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, LCP medido, resultado del barrido responsive y de la a11y, decisiones no cubiertas y problemas encontrados
