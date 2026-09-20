# Proposal: Founder — Retrato, bio ejecutiva y credenciales verificables

## Why

Tras el método (M07), el decisor quiere saber quién está detrás: el brief §3 pide "confianza humana: trabajarás directo con el ingeniero" y §4.6 entrega el copy. Además, esta sección **fija el precedente del título del fundador**: el brief dice "ingeniero de software", no sostenible hoy (cero claims no verificables) → se sustituye por "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación".

## What Changes

- **Nuevo `src/components/sections/Founder.astro`** (0 JS): sección `id="fundador"` en banda `bg-white` + `border-y` (alternancia tras el proceso plano), `SectionLabel 08/ FUNDADOR` + `<h2>` "Ingeniería primero. Marketing después." + bio + cita + cierre + credenciales.
- **Retrato**: copia de la foto elegida a `src/assets/retrato-daner.png` (en el apply) y render con `astro:assets` (WebP, `densities={[1, 2]}`, dimensiones explícitas, `loading="lazy"`); slot `aspect-[4/5]` + `object-cover object-top`; escala de grises; marco `border-line` con cruces `+` en esquinas (patrón del panel del Hero).
- **Layout**: 2 columnas en `lg` (foto 5/12 izquierda · contenido 7/12 derecha); móvil: foto arriba.
- **Copy final (fijado)**: bio con el título confirmado — "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación" (carrera completa, sin omitir "Computación") — con `<strong>Daner Salazar</strong>; cita en `<blockquote>` + `<cite>` (patrón M04); cierre "Sin intermediarios, sin juniors rotando."; credenciales: ① Ingeniería de Sistemas y Computación — Universidad de Caldas (en curso) · ② Experiencia comercial en equipos internacionales · ③ Portafolio de proyectos públicos verificables.
- **100 % verificable**: sin certificaciones ni empresas no listadas; sin enlaces sociales (→ M11); sin CTA (M09 sigue inmediatamente).
- **`src/pages/index.astro`**: monta `<Founder />` inmediatamente después de `<Process />`.
- **FLAG M10 (documentado en design)**: la FAQ del brief dice "un solo ingeniero senior" (§4.7 L194) — segundo claim no verificable a resolver cuando se construya la FAQ; no se toca aquí.

## Capabilities

### New Capabilities

- `landing-founder`: sección de confianza con retrato tratado (grayscale + marco blueprint), bio ejecutiva, cita, cierre y credenciales verificables, con hook `id="fundador"`.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip`, `landing-problemsolution`, `landing-services`, `landing-proofofwork` ni `landing-process`.

## Fuera de Alcance

- CTA propio (M09/M11 cubren la conversión) y enlaces sociales (el footer M11 centraliza GitHub/LinkedIn).
- Ajustes a la FAQ del brief (→ M10, solo el flag de D1).
- Color natural de la foto o ratio nativo 2:3 (alternativas registradas; decisión: grayscale + 4:5).
- Animaciones/scroll-reveal (micro-change dedicado).
- Cambios en `global.css`, navbar, otras secciones o el contrato de anclas (`#fundador` es hook, no contrato).
- Dependencias nuevas o islas React.

## Impact

- **Nuevos**: `src/components/sections/Founder.astro`, `src/assets/retrato-daner.png` (copia en el apply).
- **Modificados**: `src/pages/index.astro` (montaje tras Process).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, stackstrip, problemsolution, services, proofofwork, process, tokens, primitivos, `astro.config.mjs`, `package.json`.
- **Contrato**: sin cambios (todos los destinos del navbar siguen igual; `#fundador` es hook interno).
- **Presupuesto**: 0 JS nuevo; 1 imagen optimizada vía `astro:assets` (WebP, 2 densidades); sin CLS (dimensiones explícitas).
