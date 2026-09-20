# Design: Base del proyecto — design tokens, BaseLayout y primitivos UI

## Context

Ver `proposal.md` — Why. Estado actual relevante para el diseño:

- `src/styles/global.css` define 6 tokens como variables CSS sueltas en `@layer base :root` con nombres no canónicos (`--color-navy-primary`, etc.) y estilos de `body` con `#0F172A` (fuera de paleta) y familia del sistema. Contiene además `.bg-blueprint-grid` y `.bg-dot-pattern`, que deben conservarse tal cual.
- Tailwind v4 (`@tailwindcss/vite`) está configurado; no existe `tailwind.config.js` ni debe crearse (CSS-first).
- `src/pages/index.astro` es el starter de Astro (`lang="en"`, título "Astro").
- No existen `src/layouts/` ni `src/components/`.
- `clsx` y `tailwind-merge` ya son dependencias; `lucide-astro` está instalado (no se usa en este change).
- Astro 7.3.3 exige `@astrojs/check` + `typescript` para `astro check`; ninguno está instalado (verificado en `node_modules/astro/dist/cli/check/index.js`).
- `@fontsource-variable/*` v5.3.0 no expone CSS por subset: `index.css` incluye todos los `@font-face` con `unicode-range`, por lo que el navegador descarga solo el subset que el texto necesita (para español: latin, ~24.8 KB para Manrope).

## Goals / Non-Goals

**Goals:**

- Que los 6 tokens de marca existan como utilidades Tailwind (`bg-navy-900`, `text-steel-500`, `border-line`, `bg-surface`, `text-accent`, `bg-navy-700`) sin `tailwind.config.js`.
- Tipografías variables self-hosted con contrato de 0 requests a dominios externos de fuentes.
- Shell de página reutilizable (SEO/OG + accesibilidad) y 4 primitivos de UI fusionables por clase externa.
- Criterios de aceptación verificables por comando: `astro check` (0 errores), `build` (0 JS de islas), `preview` (fuentes locales).

**Non-Goals:**

- Secciones de la landing, slots con nombre, imagen OG real, deploy/analytics/SEO avanzado (ver proposal.md — Fuera de Alcance).
- No se toca `astro.config.mjs` ni `tsconfig.json`; no se crean islas React.
- No se rediseña la estética blueprint: las texturas se conservan idénticas.

## Decisions

### D1. Tokens en `@theme` de Tailwind v4 (CSS-first)

Los 6 tokens se declaran en un bloque `@theme` en `global.css`, junto a `--font-sans` y `--font-mono`. Tailwind emite las variables en `:root` además de generar utilidades, así que el CSS base puede seguir usando `var(--color-surface)` / `var(--color-navy-900)` sin duplicar definiciones.

| Token actual (eliminar) | Token nuevo (canónico @theme) | Valor   |
|-------------------------|-------------------------------|---------|
| `--color-navy-primary`  | `--color-navy-900`            | #0B2545 |
| `--color-navy-light`    | `--color-navy-700`            | #16345E |
| `--color-slate-steel`   | `--color-steel-500`           | #64748B |
| `--color-bg-light`      | `--color-surface`             | #F8FAFC |
| `--color-blueprint-line`| `--color-line`                | #CBD5E1 |
| `--color-accent-blue`   | `--color-accent`              | #1D4ED8 |

Fuentes: `--font-sans: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;` y `--font-mono: "JetBrains Mono Variable", ui-monospace, monospace;`.

*Alternativas descartadas:* mantener `:root` + `theme.extend` en un config JS (rompe la regla CSS-first del AGENTS.md); declarar utilidades a mano en `@layer utilities` (duplica la lógica de Tailwind y no escala).

`@layer base` resultante:

- `html { scroll-behavior: smooth; }` **solo** dentro de `@media (prefers-reduced-motion: no-preference)`.
- `body { background: var(--color-surface); color: var(--color-navy-900); font-family: var(--font-sans); }`.
- `::selection { background-color: var(--color-accent); color: white; }`.
- `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`.

`#0F172A` desaparece (no pertenece a la paleta). Las clases `.bg-blueprint-grid` y `.bg-dot-pattern` se mantienen textualmente iguales.

### D2. Tipografías vía `@fontsource-variable` (import plano)

`pnpm add @fontsource-variable/manrope @fontsource-variable/jetbrains-mono` e import en el frontmatter de `BaseLayout.astro`:

```ts
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
```

El import plano carga `index.css`, que declara los subsets vía `unicode-range`; el navegador descarga únicamente el archivo del subset usado (latin para el contenido en español). No existe `latin.css` en v5.3.0, así que el import plano **es** el mecanismo "solo latin" a nivel de red. Vite procesa y hashea los `.woff2` como assets locales.

*Alternativas descartadas:* `<link>` a Google Fonts (requests externas, incumple Lighthouse/privacidad); Fonts API experimental de Astro (fuera del stack acordado y evita la dependencia explícita); subsetting manual con archivos propios (más mantenimiento sin beneficio medible).

### D3. Verificación de tipos: devDeps explícitos

`pnpm add -D @astrojs/check typescript`. Son dev-only (no llegan al bundle) y habilitan el comando ya documentado en AGENTS.md §05. Sin ellos, `astro check` o falla o lanza un prompt de instalación interactivo; con ellos, el criterio de aceptación es determinista.

*Alternativa descartada:* omitir `astro check` en este módulo (dejaría sin red de seguridad TS estricto a todos los componentes nuevos).

### D4. `BaseLayout.astro`: `<main id="contenido">` desde ya

```ts
interface Props {
  title: string;
  description: string;
  ogImage?: string; // default '/og-default.png'
}
```

Estructura: `<!doctype html>` → `<html lang="es">` → head (charset, viewport, `theme-color` #0B2545, title, description, OG con `og:locale=es_CO`, Twitter `summary_large_image`, favicons existentes con TODO de reemplazo por isotipo SE) → `<body class="min-h-screen bg-surface font-sans text-navy-900 antialiased">` → skip-link `sr-only focus:not-sr-only` estilizado → `<main id="contenido"><slot /></main>`.

*Alternativas descartadas:* `<div id="contenido">` (el prompt lo descartó por ambigüedad semántica); slots con nombre `header`/`footer` ahora (no hay navbar/footer aún; se abordará en el Módulo 01 sin romper este contrato).

*Nota de evolución:* cuando llegue el Módulo 01, Navbar y footer no deberían vivir dentro de `<main>`; la evolución prevista es que BaseLayout exponga slots con nombre y el default siga siendo el contenido principal. No afecta a la API de este change.

### D5. API exacta de los primitivos

Todos: `.astro` puros, `interface Props` explícita, `class` externa fusionada con `twMerge(clsx([...]))`, sin JavaScript de cliente.

| Componente | Props | Clases base |
|---|---|---|
| `Button` | `href?: string; variant?: 'primary'\|'outline'; size?: 'md'\|'lg'; class?: string` | `inline-flex items-center justify-center gap-2 rounded-md font-semibold focus-visible:outline-2` + `primary: bg-accent text-white hover:bg-navy-900 transition-colors` + `outline: border border-navy-900/20 text-navy-900 hover:border-accent hover:text-accent transition-colors` + `md: px-5 py-2.5 text-sm` + `lg: px-6 py-3 text-base` |
| `Badge` | `class?: string` + slot | `font-mono text-xs uppercase tracking-wider text-steel-500 border border-line rounded-sm px-2.5 py-1` |
| `SectionLabel` | `index: string; text: string` | Fila flex: `{index}/ {text}` en `font-mono text-xs uppercase tracking-[0.2em] text-steel-500` + línea `h-px flex-1 bg-line` |
| `Card` | `interactive?: boolean; class?: string` + slot | `rounded-md border border-line bg-white p-6`; si `interactive`: `transition-colors hover:border-navy-900/30` |

`Button` usa tag dinámico: `<a href>` si `href` existe, si no `<button type="button">`. Defaults: `variant='primary'`, `size='md'`.

*Alternativa descartada:* `class:list` nativo de Astro (no resuelve conflictos entre utilidades; el AGENTS.md exige clsx + tailwind-merge).

### D6. Smoke test como reemplazo del starter

`index.astro` usa `BaseLayout` y monta: `SectionLabel` (00/ SETUP), `<h1>`, párrafo `text-steel-500`, los dos botones, badges, una `Card`, texturas `bg-blueprint-grid` / `bg-dot-pattern` y una tarjeta que muestra "JetBrains Mono OK" (mono) y "Manrope OK" (sans). Sin secciones reales, sin islas.

### D7. Estrategia de commits

Dos commits convencionales, en este orden:

1. `chore(deps): fuentes self-hosted + @astrojs/check/typescript (dev-only, no afecta el bundle)`
2. `feat(setup): BaseLayout, design tokens y componentes UI base`

*Alternativa descartada:* un solo commit `feat(setup)` con la justificación de deps en el cuerpo (válido, pero separa mejor la revisión de dependencias del código).

## Risks / Trade-offs

- [OG `og:image` apunta a `/og-default.png` inexistente y en URL relativa] → Aceptado en este change; se deja comentario TODO. Los previews sociales no renderizan imagen hasta que exista el asset y `site` en `astro.config.mjs` (módulo de QA/DEP).
- [Renombrar tokens rompe cualquier consumidor de los nombres viejos] → Verificado que solo `global.css` los usa; la verificación incluye ausencia de nombres antiguos en el CSS construido.
- [`index.css` de fontsource declara los 6 subsets aunque solo se use latin] → Coste en CSS mínimo; la descarga real queda limitada por `unicode-range`. Es el único mecanismo disponible en v5.3.0.
- [`hover:border-navy-900/30` y opacidades usan `color-mix()` en Tailwind v4] → Soportado en navegadores modernos objetivo; no se requiere fallback para el público B2B.
- [El criterio "0 KB JS" podría erosionarse si módulos futuros añaden islas sin medir] → El criterio de aceptación se verifica en este change; la medición de JS inicial sigue listada en el QA del AGENTS.md.
- [Doble fuente de verdad de estilos del `body` (clases del layout + `@layer base`)] → Se acepta: el prompt lo especifica así y el resultado es idéntico; sin coste de rendimiento relevante.

## Migration Plan

1. Instalar dependencias (fuentes runtime; check/typescript dev).
2. Migrar `global.css` (tokens `@theme` + base; texturas intactas).
3. Crear `BaseLayout.astro`; crear los 4 primitivos.
4. Reemplazar `index.astro` por el smoke test.
5. Verificar (`pnpm astro check`, `pnpm build`, `pnpm preview`) y commitear en dos pasos.

Rollback: revertir los commits; no hay datos, migraciones ni infraestructura implicados.

## Open Questions

- Estructura final de slots de `BaseLayout` cuando lleguen Navbar/footer (Módulo 01). Es diferible: no cambia las specs ni la API de este change.
- Momento de creación de `/og-default.png` (¿módulo de QA o asset de marca previo?). Diferible; el TODO queda en el código.
