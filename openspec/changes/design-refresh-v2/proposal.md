# Proposal: Design Refresh v2 — Precision Instrument, motion sutil y build sano

## Why

La landing funciona, pero su presentación es conservadora para el ticket que vende (ingeniería B2B de alto valor). El rediseño **"Precision Instrument"** ya fue explorado y aprobado en Stitch (screen `ec9530dadcf14d0ca39554653a676d96`, proyecto `14368465756738872305`) con el contenido verificado **verbatim**, de modo que la mejor versión visual está lista para implementarse sin reabrir diseño. Además, el build está roto desde la migración de Lucide (2 imports a un paquete inexistente) y `AGENTS.md` §04 prohíbe librerías de animación mientras el diseño aprobado requiere motion sutil (Anime.js 4.5.0 ya está instalado sin usar): es el momento de actualizar la constitución del proyecto y aplicarla con reglas claras.

## What Changes

- **Rediseño visual de las 12 secciones + chrome** (navbar y footer) siguiendo el screen de Stitch como fuente de verdad visual: grid visible como protagonista, hairlines full-bleed que exceden el contenedor, layering de superficies sin sombras ni gradientes, datos y métricas como elementos visuales de primer nivel.
- **Capa de animación global con Anime.js 4.5.0** (un solo módulo, diferido): fade-in al entrar en viewport, hairlines que se dibujan, hover de cards, transiciones de CTAs y conteo sutil de métricas — con política estricta (duraciones, easing, `prefers-reduced-motion`, sin loops decorativos).
- **BREAKING (política interna):** se levanta la garantía "cero librerías de animación / sin JavaScript nuevo". La página incorpora un módulo de motion diferido; los componentes siguen sin frameworks de UI y las islas React siguen con `client:visible`. El presupuesto crítico inicial se mantiene < 10 KB y el módulo de motion se mide y acota.
- **Cambio de comportamiento del StackStrip:** de marquee CSS continuo a **cuadrícula de celdas técnicas** (decisión del diseño aprobado); se retiran los requisitos de marquee y sus pausas accesibles.
- **Fix del bloqueador de build:** imports `lucide-astro` → `@lucide/astro` en `Navbar.astro` y `Faq.astro` (la dependencia ya fue migrada en `package.json`).
- **`AGENTS.md` §04 actualizado:** Anime.js permitida con reglas (dónde sí, dónde no, presupuesto, reduced-motion, sin librerías adicionales).
- **Decisiones conscientes aceptadas** del diseño (documentadas en `design.md`): los 2 headings embellecidos ("Servicios de Ingeniería Especializada", "Recurso Técnico Gratuito") y las anotaciones decorativas de instrumentación (`CALIBRATED // SYS_2026`, `p95 / LATENCY`, etc.).
- **Sin cambios de contenido:** copy, nombres de proyectos, métricas, FAQ y fundador permanecen **verbatim**.

## Capabilities

### New Capabilities

Ninguna: el rediseño no introduce capacidades nuevas; modifica requisitos de presentación y motion de las 12 existentes.

### Modified Capabilities

- `landing-base`: nuevos requisitos del sistema visual Precision Instrument (grid/hairlines/layering), política de animación global con Anime.js y presupuesto de JavaScript revisado.
- `landing-navbar`: barra de instrumentación (status bar superior + enlaces numerados) y participación en la capa de motion; build sano con `@lucide/astro`.
- `landing-hero`: panel de instrumentos con franja de métricas y entrada sutil (el `h1` conserva prioridad LCP).
- `landing-stackstrip`: la franja pasa de marquee continuo a cuadrícula de celdas técnicas (se retiran requisitos de marquee/pausa).
- `landing-problemsolution`: matriz de diagnóstico con etiquetas de resolución.
- `landing-services`: bento console con S-01 destacada y métrica como lectura de instrumento.
- `landing-proofofwork`: casos con diagramas C4 como piezas gráficas centrales.
- `landing-process`: timeline de nodos conectados con numeración de instrumento.
- `landing-founder`: dossier editorial técnico con retrato tratado.
- `landing-leadmagnet`: panel de captación rediseñado y motion en estados del formulario.
- `landing-faq`: acordeón técnico rediseñado; icono migrado a `@lucide/astro`.
- `landing-ctafinal`: consola oscura invertida con motion de cierre.

## Fuera de Alcance

- Cambios de copy, nombres, métricas, FAQ o fundador (contenido verbatim; el diseño aprobado lo preserva).
- Nuevas secciones, nuevas islas React, nuevos endpoints o cambios de backend.
- Deploy, OG image, sitemap/robots y medición Lighthouse formal (quedan como QA/DEP o verificación humana del dueño).
- Swap del isotipo a SVG vectorial (sigue pendiente del dueño).
- Librerías de animación adicionales o animaciones sobre el hero que comprometan el LCP.

## Impact

- **Código:** `src/layouts/BaseLayout.astro` (carga del módulo de motion), `src/styles/global.css` (utilidades del sistema Precision Instrument), los 12 componentes de `src/components/sections/`, ajustes en `src/components/ui/`, `AGENTS.md`.
- **Dependencias:** `animejs ^4.5.0` (ya instalada; pasa a usarse) y `@lucide/astro ^1.50.0` (fix de 2 imports rotos).
- **Contenido:** intacto — se preserva cada palabra, nombre y métrica del sitio actual.
- **Presupuesto:** JS crítico inicial < 10 KB (sin cambios); módulo de motion diferido con objetivo ≤ 15 KB gzip (Anime.js + wrapper), medido y registrado en el build.
- **Verificación:** `pnpm astro check` y `pnpm build` en verde; inspección de `dist/`; barrido responsive; `prefers-reduced-motion`; verificación humana de lo visual.
