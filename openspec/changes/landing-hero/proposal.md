# Proposal: Hero — titular, CTAs y panel visual blueprint

## Why

La landing aún no vende nada en su primera pantalla: `index.astro` solo contiene el smoke test del M00. El hero es el bloque que debe vender el resultado en 5 segundos (dual CTA decisor/explorador), es el candidato a **LCP** de la página y es la primera aplicación real de la estética blueprint sobre los cimientos del M00/M01.

## What Changes

- **Nuevo `src/components/sections/Hero.astro`** (0 islas): `<section id="hero">` como primera sección del `<main>`, con `SectionLabel 02/ HERO`, `<h1>` único con el copy del brief §4.1 ("Sistemas que escalan. IA que produce. Sin el overhead de una agencia."), subtítulo verbatim, **dual CTA** con `Button` lg — "Agendar diagnóstico gratuito · 20 min" → `#contacto` (label corto en `<sm`) y "Ver casos de estudio →" → `#casos` —, micro-prueba en línea mono ("Respuesta en menos de 24 h · Remoto LATAM · Internacional") y **panel visual blueprint**: `Card` como shell + `.bg-blueprint-grid` + `.bg-dot-pattern` + 4 cruces y 2 anotaciones reales (`SE-01 / ISOTIPO`, `GRID 30`), con el **isotipo SE real** renderizado vía `astro:assets`.
- **Nuevo `src/assets/isotipo-se.png`**: copia del isotipo transparente existente (557×483, 11.2 KB) — primera imagen del proyecto; `<Image>` genera WebP hasheado con dimensiones explícitas.
- **`src/pages/index.astro`**: monta `<Hero />` tras el slot del navbar y **retira el smoke test del M00** (contenido temporal de verificación, confirmado).
- **Layout responsive**: contenedor `max-w-6xl px-4 sm:px-6` (retícula alineada al navbar), grid 12 columnas (texto 7 / panel 5) en `lg`, stack en móvil, `lg:min-h-[calc(100svh-4rem)]`.
- **Sin JavaScript nuevo**: 0 islas; el único script del sitio sigue siendo el micro-script inline del navbar (245 B).
- **Sin animación** en este módulo (el `h1` es el LCP).
- Contratos vigentes intactos: anclas `#servicios/#casos/#proceso/#faq/#contacto`, z-scale, paleta estricta, presupuesto JS < 10 KB.

## Capabilities

### New Capabilities

- `landing-hero`: primera sección de la landing — propuesta de valor con titular/subtítulo del brief, dual CTA, micro-prueba y panel visual blueprint con isotipo, responsive y optimizada para LCP, sin JavaScript añadido.

### Modified Capabilities

Ninguna: la retirada del smoke test no toca requisitos vigentes de `landing-base` (skip-link, SEO y `<main id="contenido">` se conservan) ni de `landing-navbar`.

## Fuera de Alcance

- Variante A/B del titular (documentada como experimento futuro; sin hook ni analytics).
- StackStrip (Módulo 03) y demás secciones.
- Export SVG definitivo del isotipo (pendiente del dueño; TODO de swap en el componente) y sustitución de favicon/wordmark.
- Imagen OG (`191.png` queda reservada al módulo QA/DEP) y preloads de fuentes (perf global).
- Animaciones de entrada, analytics, Cal.com, dependencias nuevas, islas React.

## Impact

- **Nuevos**: `src/components/sections/Hero.astro`, `src/assets/isotipo-se.png` (nueva carpeta `src/assets/`).
- **Modificados**: `src/pages/index.astro` (montar Hero + retirar smoke test).
- **Sin cambios**: `BaseLayout.astro`, navbar, tokens, primitivos, `astro.config.mjs`, `tsconfig.json`, `package.json`.
- **Presupuesto**: 0 JS nuevo; +1 request local optimizada (isotipo WebP) y texturas CSS (0 requests).
