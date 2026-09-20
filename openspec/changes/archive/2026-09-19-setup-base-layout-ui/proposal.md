# Proposal: Base del proyecto — design tokens, BaseLayout y primitivos UI

## Why

El sitio es la primera prueba de la competencia que vende SALAZAR Eng.: debe rendir Lighthouse 100/100 y entregar la estética blueprint con 0 KB de JS. Hoy el repo tiene solo el starter de Astro: los tokens de marca viven como variables CSS sueltas que Tailwind no expone como utilidades, no existe layout compartido ni primitivos de UI, y las tipografías son del sistema. Las 11 secciones de la landing (módulos siguientes) no pueden construirse de forma consistente sin esta base técnica.

## What Changes

- **Dependencias** (únicas permitidas en este change):
  - Runtime: `@fontsource-variable/manrope` + `@fontsource-variable/jetbrains-mono` — fuentes self-hosted (0 requests a Google Fonts, mejor LCP y privacidad).
  - Dev-only: `@astrojs/check` + `typescript` — habilitan `pnpm astro check` como criterio real de QA de tipos; no afectan el bundle.
- **`src/styles/global.css`**: migración de los 6 tokens de `:root` a `@theme` de Tailwind v4 con nombres canónicos del AGENTS.md; nueva base (`html`, `body`, `::selection`, `:focus-visible`); se conservan sin cambios `.bg-blueprint-grid` y `.bg-dot-pattern`.
- **BREAKING** (interno): se eliminan los nombres antiguos `--color-navy-primary`, `--color-navy-light`, `--color-slate-steel`, `--color-bg-light`, `--color-blueprint-line`, `--color-accent-blue`. Ningún archivo fuera de `global.css` los consume hoy.
- **`src/layouts/BaseLayout.astro`** (nuevo): props `{ title, description, ogImage? }`; SEO básico (title, description, Open Graph, Twitter card, `og:locale=es_CO`, `theme-color=#0B2545`); `lang="es"`; favicons existentes; skip-link accesible; `<main id="contenido">` alrededor del slot.
- **Primitivos UI** (nuevos, `.astro` puros, TS strict, clases fusionadas con `clsx` + `tailwind-merge`): `Button.astro`, `Badge.astro`, `SectionLabel.astro`, `Card.astro`.
- **`src/pages/index.astro`**: reemplazo del starter por un smoke test que verifica tokens/utilidades, tipografías, texturas blueprint, badges, labels y botones (sin secciones reales).
- **Verificación**: `pnpm astro check` → 0 errores; `pnpm build` → build estático sin JS de islas y CSS con tokens; `pnpm preview` → fuentes servidas localmente.

## Capabilities

### New Capabilities

- `landing-base`: base técnica del sitio — tokens de marca expuestos como utilidades Tailwind v4, tipografías self-hosted, layout global con SEO/accesibilidad y primitivos de UI fusionables, con build SSG de 0 KB de JS y type-check limpio como criterios de aceptación.

### Modified Capabilities

Ninguna (el proyecto aún no tiene specs; esta es la primera capacidad).

## Fuera de Alcance

- Las 11 secciones de la landing (módulos siguientes).
- Slots con nombre / composición avanzada del layout (llegan en el Módulo 01, junto con Navbar/CTA final).
- Imagen OG real: `/og-default.png` queda como referencia con TODO hasta que exista el asset (y el `site` en `astro.config.mjs` para URL absoluta).
- Dominio, deploy, analytics y SEO avanzado (sitemap, robots, schema.org) — módulos posteriores.
- `astro.config.mjs` y `tsconfig.json` no se modifican.

## Impact

- **Modificados**: `src/styles/global.css`, `src/pages/index.astro`, `package.json`, `pnpm-lock.yaml`.
- **Nuevos**: `src/layouts/BaseLayout.astro`, `src/components/ui/{Button,Badge,SectionLabel,Card}.astro`.
- **Sin cambios**: `astro.config.mjs`, `tsconfig.json`, integraciones (React queda instalado pero sin islas en este change).
- **Sistemas**: ninguno externo; el build sigue siendo SSG puro.
