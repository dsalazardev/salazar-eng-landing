# Informe de exploración — salazar-eng-landing

> Exploración de solo lectura · 2026-10-02 · Estado del repo: `de6ce33` (rama `main`, working tree limpio)

## 1. Resumen ejecutivo

Landing page B2B de **SALAZAR Eng.** construida en **Astro 7.3.3 + Tailwind CSS 4.3.3 + React 19** (islas) sobre **pnpm**, con TypeScript estricto y deploy previsto en **Cloudflare Workers** (`wrangler.jsonc`). Las 13 secciones (12 componentes + Footer) están implementadas y el build existe (`dist/`, 2026-09-22), con una sola isla activa (`ContactForm`, `client:visible`) y una estética blueprint consistente y tokenizada. El proyecto tiene **disciplina OpenSpec notable** (12 specs vivas, 13 cambios archivados, 0 activos) y buenas prácticas de rendimiento/accesibilidad visibles en código. La brecha principal no es el código sino el **cierre de QA/SEO**: falta la imagen OG (referenciada pero inexistente), `sitemap.xml`, `robots.txt`, schema.org, tests y medición Lighthouse; además, no existe todavía un **proyecto Stitch** asociado al landing — los 2 existentes en la cuenta parecen ser de otros productos (inferencia).

## 2. Stack tecnológico

| Aspecto | Valor | Evidencia (archivo) |
|---|---|---|
| Framework | Astro **7.3.3** (SSG; sin SSR: no hay `prerender = false` en `src/`) | `package.json`, `pnpm-lock.yaml` (línea 1319), `astro.config.mjs` |
| Build tool | Vite embebido en Astro + plugin `@tailwindcss/vite` 4.3.3 | `astro.config.mjs`, `pnpm-lock.yaml` |
| Lenguaje | TypeScript **6.0.3**, modo `strict` + `jsx: react-jsx` | `tsconfig.json`, `pnpm-lock.yaml` (línea 2132) |
| Package manager | **pnpm** (lockfile + workspace + `.npmrc`); sin campo `packageManager` | `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc` |
| Versión Node | `>=22.12.0` (engines) | `package.json` |
| Estilos | **Tailwind CSS v4** (config CSS-first vía `@theme`) | `src/styles/global.css`, `package.json` |
| Islas | React **19.3.0** + React DOM 19.3.0 (`@astrojs/react` 6.0.6) | `pnpm-lock.yaml` (1971, 1980, 178) |
| Adapter / deploy | `@astrojs/cloudflare` **14.3.3** + Wrangler 4.136.3; Worker con assets binding | `astro.config.mjs`, `wrangler.jsonc`, `pnpm-lock.yaml` (79) |
| Testing | **Ninguno** (sin runner, sin tests, sin scripts) | `package.json`; búsqueda `**/*.{test,spec}.*` → 0 resultados |
| Tipografía | `@fontsource-variable/manrope` y `jetbrains-mono` 5.3.0 (self-hosted, woff2) | `package.json`, `src/layouts/BaseLayout.astro` |
| Iconos | `lucide-astro` 0.556.0 (único uso: `Menu`, `X`, `ChevronDown`) | `pnpm-lock.yaml` (1812), `Navbar.astro`, `Faq.astro` |
| Utilidades | `clsx` 2.1.1 + `tailwind-merge` 3.7.0 | `pnpm-lock.yaml` (1380, 2092) |
| Procesamiento de imágenes | `sharp` 0.35.4 (devDependency, usado por `astro:assets`) | `package.json`, `pnpm-lock.yaml` (2041) |

**Inferencia:** el proyecto declara en `AGENTS.md` "Fase 1: Cloudflare Pages/Vercel", pero la configuración real (`wrangler.jsonc` con `main` + `assets.directory: ./dist` + `observability`) apunta a **Cloudflare Workers**, no Pages. Es una divergencia documental, no un error de código.

## 3. Estructura de carpetas

```
salazar-eng-landing/
├── src/
│   ├── assets/                 # isotipo-se.png, retrato-daner.png
│   ├── components/
│   │   ├── ui/                 # Button, Badge, SectionLabel, Card, C4Diagram
│   │   ├── sections/           # 12 secciones .astro (Navbar..Footer)
│   │   └── islands/            # ContactForm.tsx, LazyEmbed.tsx (React)
│   ├── layouts/BaseLayout.astro
│   ├── pages/index.astro       # única ruta
│   └── styles/global.css       # tokens @theme + base + utilidades blueprint
├── public/                     # favicon.ico (361 KB), favicon.svg
├── tools/pdf/                  # fuente HTML + PDF del checklist (lead magnet) + PNGs
├── openspec/                   # config.yaml, specs/ (12), changes/archive/ (13)
├── .opencode/                  # skills (Stitch, OpenSpec, Playwright...) + commands
├── .claude/ · .agents/ · .github/  # mirrors de skills/prompts para otros harnesses
├── .vscode/extensions.json
├── astro.config.mjs · tsconfig.json · wrangler.jsonc · package.json
├── pnpm-lock.yaml · pnpm-workspace.yaml · .npmrc · .env(.example) · .gitignore
└── AGENTS.md · README.md
```

Ignorados en este árbol (por indicación): `node_modules/`, `.git/`, `dist/`, `.astro/`, `.wrangler/`, `.playwright*/`. Nota: `.wrangler/` **sí está versionado en git** (ver §9 y §11).

## 4. Puntos de entrada y rutas / secciones

- **Única página:** `/` → `src/pages/index.astro` (no hay content collections ni rutas adicionales).
- **Punto de entrada HTML:** `src/layouts/BaseLayout.astro` — `<head>` SEO/OG, skip-link, slots `header`/default/`footer`, `lang="es"`.
- **Composición secuencial** (`src/pages/index.astro`) con anclas internas:

```
Navbar(header)  Hero#hero  StackStrip#stack  ProblemSolution#problema
Services#servicios  ProofOfWork#casos  Process#proceso  Founder#fundador
LeadMagnet#recurso  Faq#faq  CtaFinal#contacto  Footer(footer)
```

- **Navegación:** Navbar y Footer enlazan a `#servicios`, `#casos`, `#proceso`, `#faq`; CTAs a `#contacto` y `#casos`. Todos los anclajes destino existen (verificado en los 12 componentes).
- **OpenSpec:** 12 specs durables (`landing-base`, `landing-hero`, … `landing-ctafinal`; 97 requisitos en total) y 13 cambios archivados entre 2026-09-19 y 2026-09-22. **No hay cambios activos** (`openspec list --json` → `changes: []`).

## 5. Componentes principales

| Componente | Ruta | Responsabilidad | Props clave |
|---|---|---|---|
| Button | `src/components/ui/Button.astro` | CTA polimórfico (`<a>` si `href`, si no `<button>`) | `href?`, `variant: primary\|outline`, `size: md\|lg`, `class?` |
| Badge | `src/components/ui/Badge.astro` | Etiqueta mono técnica (stack/estado) | `class?` |
| SectionLabel | `src/components/ui/SectionLabel.astro` | Etiqueta blueprint `NN/ SECCIÓN` + línea | `index`, `text`, `class?` |
| Card | `src/components/ui/Card.astro` | Contenedor bento (borde línea, fondo blanco) | `interactive?` (**sin uso actual**), `class?` |
| C4Diagram | `src/components/ui/C4Diagram.astro` | Mini-diagramas C4 en SVG inline (3 variantes) | `variant: telemetry\|doligestion\|microservices`, `title` |
| Navbar | `src/components/sections/Navbar.astro` | Sticky + menú móvil nativo (`popover`) + script inline (~0.3 KB) | — (links locales) |
| Hero | `src/components/sections/Hero.astro` | Titular, 2 CTAs, micro-prueba, visual isotipo | — (datos locales) |
| StackStrip | `src/components/sections/StackStrip.astro` | Marquee CSS puro con pausa accesible (checkbox) | — (16 tecnologías locales) |
| ProblemSolution | `src/components/sections/ProblemSolution.astro` | 3 dolores (cita) → 3 respuestas | — |
| Services | `src/components/sections/Services.astro` | Bento 3 servicios con entregables/stack/métrica | — |
| ProofOfWork | `src/components/sections/ProofOfWork.astro` | 3 casos con C4 + métricas + links | — |
| Process | `src/components/sections/Process.astro` | 4 pasos numerados | — |
| Founder | `src/components/sections/Founder.astro` | Foto + bio + credenciales | — |
| LeadMagnet | `src/components/sections/LeadMagnet.astro` | Sección checklist; monta la isla | lee `PUBLIC_LEAD_ENDPOINT` |
| Faq | `src/components/sections/Faq.astro` | Accordion nativo `<details name="faq">` | — (5 preguntas locales) |
| CtaFinal | `src/components/sections/CtaFinal.astro` | Cierre navy; Cal.com lazy o fallback mailto | lee `PUBLIC_BOOKING_URL` |
| Footer | `src/components/sections/Footer.astro` | Firma, nav secundaria, contacto | — |
| ContactForm | `src/components/islands/ContactForm.tsx` | Formulario email+necesidad → POST JSON, estados, timeout 120 s, aviso warmup | `endpoint`; montado `client:visible` |
| LazyEmbed | `src/components/islands/LazyEmbed.tsx` | Click-to-load de iframe (Cal.com) con a11y | `src`, `title`, `ctaLabel`, `height?`; `client:visible` condicional |

**Relaciones (árbol real):**

```
index.astro
 └─ BaseLayout(title, description, ogImage?)
     ├─ [header] Navbar ──> Button
     ├─ Hero ──> SectionLabel · Button×2 · Card · Image(isotipo, eager)
     ├─ StackStrip ──> SectionLabel · Badge×2 listas (duplicadas p/ loop)
     ├─ ProblemSolution ──> SectionLabel
     ├─ Services ──> SectionLabel · Card · Badge · Button
     ├─ ProofOfWork ──> SectionLabel · Card · C4Diagram · Badge
     ├─ Process ──> SectionLabel
     ├─ Founder ──> SectionLabel · Image(retrato, lazy, grayscale)
     ├─ LeadMagnet ──> SectionLabel · Card · ContactForm (isla)
     ├─ Faq ──> SectionLabel · ChevronDown
     ├─ CtaFinal ──> SectionLabel · Button · LazyEmbed (isla, solo si hay URL)
     └─ [footer] Footer
```

**Hecho:** en el build actual solo hay **una isla** (`ContactForm`); `LazyEmbed` no aparece porque `PUBLIC_BOOKING_URL` estaba vacío al construir y el CTA cayó al fallback `mailto:` (evidencia: `dist/index.html`, único `<astro-island>` con `client="visible"`).

## 6. Sistema de estilos y design tokens

- **Metodología:** Tailwind CSS v4 con configuración **CSS-first** (`@theme`), sin `tailwind.config.js`. Sin CSS Modules/SCSS/styled-components.
- **Tokens** (`src/styles/global.css`):

| Token | Valor | Uso observado |
|---|---|---|
| `--color-navy-900` | `#0B2545` | Texto principal, fondos invertidos |
| `--color-navy-700` | `#16345E` | **Definido pero sin uso en `src/` (código muerto menor)** |
| `--color-steel-500` | `#64748B` | Texto secundario |
| `--color-surface` | `#F8FAFC` | Fondo general |
| `--color-line` | `#CBD5E1` | Bordes/líneas blueprint |
| `--color-accent` | `#1D4ED8` | CTAs y hover (dosis mínima) |
| `--font-sans` | Manrope Variable | Cuerpo |
| `--font-mono` | JetBrains Mono Variable | Etiquetas `NN/ SECCIÓN`, badges |

- **Base:** `scroll-padding-top: 5rem` (compensa navbar), smooth scroll solo con `prefers-reduced-motion: no-preference`, `::selection` accent, `:focus-visible` con outline accent.
- **Utilidades blueprint:** `.bg-blueprint-grid` (grid 30px), `.bg-dot-pattern` (puntos 16px).
- **Estilos locales por componente** (`<style is:global>`): marquee de StackStrip (con pausa por hover/focus/checkbox y fallback `prefers-reduced-motion`), máscaras de ProblemSolution, y reglas `:has()` del popover del Navbar con `@supports not selector(:popover-open)`.
- **Espaciados/breakpoints:** escala y breakpoints por defecto de Tailwind (se usan `sm`, `md`, `lg`). Sin tokens de spacing propios.
- **Consistencia:** los 5 primitivos `ui/` usan `clsx` + `tailwind-merge`; las secciones usan utilidades directas. Es un sistema pequeño y coherente, no un design system formal (no hay documentación de tokens fuera de `global.css`).

## 7. Assets

| Asset | Ruta | Peso / salida | Uso |
|---|---|---|---|
| Isotipo SE | `src/assets/isotipo-se.png` | 11.2 KB → webp 10.8/5.3 KB (1x/2x) | Hero (`Image`, `densities=[1,2]`, `loading="eager"`) |
| Retrato fundador | `src/assets/retrato-daner.png` | **1.68 MB fuente** → webp 46.2/19.2 KB | Founder (`loading="lazy"`, grayscale) |
| Favicon SVG | `public/favicon.svg` | 1.6 KB | `<link icon>` |
| Favicon ICO | `public/favicon.ico` | **361.4 KB (outlier de peso)** | `<link icon>` fallback |
| Checklist (lead magnet) | `tools/pdf/checklist-27-puntos-salazar-eng.pdf` | 593.4 KB | Servido por backend; no por el sitio |
| Fuentes fuente del PDF | `tools/pdf/*` (HTML + PNGs + JPG) | ~1.9 MB versionados | Workspace de generación |
| OG image | `/og-default.png` (referenciada) | **NO EXISTE** | `og:image` roto en `dist/index.html` |

- **Iconos:** solo `lucide-astro` (Menu, X, ChevronDown). Sin librerías redundantes. ✔
- **Fuentes:** 10 archivos woff2 (153 KB en total; subsets latin/latin-ext/cyrillic/greek/vietnamese). Un visitante latino típico descarga ~64 KB (Manrope latin 24.3 + JetBrains latin 39.5).
- **Vídeos:** ninguno. `LazyEmbed` está listo para Cal.com, no para Loom todavía (el campo `loom` de `ProofOfWork` existe pero ningún caso lo usa).

## 8. Configuración y scripts

**Scripts (`package.json`):**

| Script | Comando | Notas |
|---|---|---|
| `dev` / `build` / `preview` | `astro dev` / `astro build` / `astro preview` | Estándar |
| `astro` | `astro` | CLI |
| `generate-types` | `wrangler types` | Genera `worker-configuration.d.ts` (**hoy ausente**, aunque `tsconfig.json` lo referencia) |

- **No existen scripts** de `check`, `lint`, `format` ni `test`. `@astrojs/check` 0.9.10 está instalado pero no cableado a un script (AGENTS.md usa `pnpm astro check` manual).
- **Linters/formatters:** ninguno configurado (sin ESLint/Prettier/Biome/EditorConfig; `prettier` solo aparece como peer opcional transitivo de `@astrojs/check` en el lockfile).
- **tsconfig:** `astro/tsconfigs/strict`, incluye `./worker-configuration.d.ts` (archivo inexistente hoy), `jsx: react-jsx`.
- **Astro config:** plugin Tailwind, integración React, adapter Cloudflare. **No hay `site` configurado** → sin URLs canónicas/absolutas.
- **Wrangler:** `compatibility_date: 2026-09-21`, `global_fetch_strictly_public`, assets binding `ASSETS`, observability on.
- **Variables de entorno (build-time):** `PUBLIC_LEAD_ENDPOINT` (endpoint Render `ms-notifier-webhook`), `PUBLIC_BOOKING_URL` (Cal.com; vacía en `.env.example`). Documentadas en `.env.example`; `.env` local existe y está ignorado por git.
- **CI:** único workflow `.github/workflows/copilot-setup-steps.yml` (instala OpenSpec CLI para Copilot; no compila ni despliega). **No hay CI de build/deploy.**
- **VSCode:** recomienda `astro-build.astro-vscode`; sin `settings.json`.

## 9. Estado de calidad

**Tests y cobertura:** no hay tests (0 archivos), ni cobertura, ni runner. El formulario e2e figura como pendiente en `AGENTS.md` §05.

**Build existente** (`dist/`, 2026-09-22 21:21; sin rebuild desde entonces):

| Métrica | Valor medido | Comentario |
|---|---|---|
| HTML | 54.7 KB raw / 10.7 KB gzip | Una sola página |
| CSS | 38.1 KB raw / 12 KB gzip | Tailwind purge OK |
| JS inicial (inline: runtime de islas + script menú) | ~13.9 KB raw / **4.4 KB gzip** | ✔ cumple `<10 KB` en gzip; roza el umbral en raw |
| React renderer (`client.CLhIxG29.js`) | 207.9 KB raw / **65 KB gzip** | **Diferido**: se importa solo cuando el formulario entra al viewport (`client:visible`) |
| Islas en build | 1 (`ContactForm`) | `LazyEmbed` no montada (booking URL vacía) |
| Fuentes | 10 woff2 / 153 KB | Carga por subset |
| favicon.ico | 361.4 KB | Anomalía de peso |

**Disciplina OpenSpec:** 12 specs con 97 requisitos + 13 cambios archivados con propuesta/design/tasks/specs. Es el activo de calidad más fuerte del repo. `openspec/config.yaml` no tiene `context` ni `rules` personalizados (todo comentado).

**Accesibilidad (señales observadas, no auditoría):** skip-link, `:focus-visible`, `aria-label`/`aria-labelledby`, menú con `popover` + fallback, accordion nativo, `noscript` en el formulario, `role="status"/"alert"` con focus programático, `prefers-reduced-motion` respetado en marquee/scroll. No hay medición Lighthouse (requiere servidor; queda como **verificación humana pendiente**, conforme a AGENTS.md §06).

**Deuda técnica visible:**
1. **4 TODOs** de marca: favicon (BaseLayout), wordmark navbar, isotipo SVG hero, logo footer — todos dependen de exportar el vectorial desde `ARCHIVOS/LOGO/AI/` (evidencia: comentarios en los 4 archivos).
2. `README.md` es el starter kit de Astro sin editar; `package.json` tiene `"name": ""`.
3. `--color-navy-700` y la prop `interactive` de `Card` sin uso.
4. Duplicación menor de copy/estructura: array de links de nav repetido en Navbar y Footer; email/WhatsApp hardcodeados en CtaFinal y Footer; las 3 opciones del formulario replican los 3 dolores de ProblemSolution.
5. `.wrangler/state/**` (SQLite de miniflare) **versionado en git** — no está en `.gitignore`; es estado local de dev.
6. `tools/pdf/` versiona intermedios pesados (~1.9 MB: PNGs de páginas, preview).
7. `worker-configuration.d.ts` referenciado en tsconfig pero inexistente (no se ha corrido `pnpm generate-types`).
8. `dist/` con ~10 días de antigüedad y sin CI que verifique builds.

## 10. Relación con Stitch

**Consulta en modo lectura realizada** (`list_projects` + `list_screens`). Estado:

| Proyecto Stitch | Tipo | Pantallas | ¿Relacionado con salazar-eng-landing? |
|---|---|---|---|
| `projects/15561930514623885209` — "UI Design Redesign" (2026-09-07) | DESKTOP | 2 (`image.png`; "Líneas del Presupuesto - Rediseño Moderno") | **No** (inferencia: presupuesto/rediseño ajeno al landing) |
| `projects/14660343100659272048` — "Modern Add Line Modal - Product Variant" (2026-08-20) | MOBILE | 5 (modales de variantes) | **No** (inferencia) |

**Hechos:** no existe un proyecto Stitch con título/pantallas del landing SALAZAR Eng. El commit más reciente del repo (`de6ce33`, hoy 2026-10-02) es justamente *"chore(opencode): configurar Stitch MCP y skills de diseño"*: `.opencode/skills/` contiene las skills de Stitch (code-to-design, extract-design-md, generate-design, upload-to-stitch, etc.) y el MCP quedó disponible en esta sesión. Es decir: **la infraestructura para Stitch está lista, el baseline de diseño aún no existe.**

## 11. Hallazgos de seguridad

- **Sin secretos en el repositorio.** Búsqueda de patrones (`api_key`, `secret`, `token`, `password`, `Bearer`) en `src/` → solo falsos positivos (`mask-image`).
- `.env` existe en disco pero **no está versionado** y está ignorado (`git check-ignore` → `.gitignore:4`). `.env.example` solo contiene el endpoint público del backend y una URL vacía. ✔
- **Dato no-secreto pero sensible a higiene:** correo personal y número de WhatsApp del fundador **hardcodeados** en `CtaFinal.astro` y `Footer.astro` (por diseño, es contacto público; conviene centralizarlos en un módulo de constantes).
- **`.wrangler/state/*.sqlite*` versionado** en git (estado local de miniflare, no secreto, pero no debería formar parte del repo; puede arrastrar datos de pruebas locales).
- No se inspeccionó el contenido de `.env` (por política); no hay evidencia de credenciales expuestas en archivos versionados.

## 12. Oportunidades y riesgos

| Tipo | Descripción | Prioridad |
|---|---|---|
| Oportunidad | **Crear el baseline Stitch del landing** (proyecto nuevo + pantalla subiendo el build o vía `code-to-design` + `extract-design-md` para DESIGN.md) — la infraestructura ya está configurada (commit de hoy) | Alta |
| Oportunidad | **Cerrar brecha SEO/OG**: generar `og-default.png`, definir `site` en Astro, sitemap, `robots.txt`, schema.org `Organization`, OG absoluta | Alta |
| Oportunidad | Medir **Lighthouse real** y e2e del formulario (Playwright ya instalado como skill; hoy no hay tests) | Media |
| Oportunidad | Sustituir PNGs por **SVG vectoriales** al recibir los archivos de `ARCHIVOS/LOGO/AI/` (resuelve los 4 TODOs) | Media |
| Oportunidad | Limpieza: README real, `name` del package, token `navy-700`/prop `interactive` muertos, `.wrangler` fuera de git, intermedios de `tools/pdf` | Baja |
| Riesgo | **`og:image` roto** (`/og-default.png` no existe): al compartir el link en LinkedIn/WhatsApp no habrá preview — crítico para prospección B2B | Alta |
| Riesgo | Sin tests, lint ni CI de build: regresiones silenciosas; el "QA" de `AGENTS.md` sigue 100% pendiente | Alta |
| Riesgo | favicon.ico de 361 KB + PNG fuente de 1.68 MB en repo sincronizado por OneDrive: peso innecesario y fricción de sincronización | Media |
| Riesgo | Deploy real (Cloudflare **Workers**) difiere de lo documentado en AGENTS.md (Pages/Vercel): puede confundir el checklist DEP | Media |
| Riesgo | `.wrangler/state` versionado: conflictos/ruido en git y posible filtración de estado local de pruebas | Media |
| Riesgo | `PUBLIC_BOOKING_URL` vacía → el CTA principal cae a `mailto:`; y el dominio de producción debe añadirse al allowlist CORS del backend antes del deploy | Media |
| Riesgo | Contenido 100% hardcodeado en componentes (arrays locales): sin Content Collections (fase 2) cualquier edición de copy toca 12 archivos | Baja |

## 13. Siguiente paso recomendado

**Crear el proyecto Stitch baseline de SALAZAR Eng.** — sin tocar el repositorio: (1) crear un proyecto nuevo "SALAZAR Eng. Landing" en Stitch, (2) subir el estado actual como pantalla usando `upload-to-stitch`/`code-to-design` sobre el build existente (`dist/index.html`), y (3) extraer el `DESIGN.md` con `extract-design-md` para fijar los tokens reales (navy/surface/line/accent, Manrope + JetBrains Mono, estética blueprint).

Justificación: es la única acción que desbloquea tu objetivo declarado ("generar nuevos diseños con Stitch") sin riesgo alguno sobre el código, y llega justo después del commit que configuró el MCP y las skills. El cierre de QA/SEO (OG, sitemap, tests) es importante pero no depende del diseño; cuando quieras ejecutarlo en el repo, ese es un cambio para `/opsx-propose` (p. ej. `qa-seo-closeout`), no para modo exploración.

## 14. Preguntas abiertas

1. **Stitch:** ¿los proyectos "UI Design Redesign" y "Modern Add Line Modal" son de otros productos tuyos? ¿Confirmas que el landing no tiene aún proyecto Stitch?
2. **Deploy:** ¿el destino real es Cloudflare Workers (como indica `wrangler.jsonc`) y hay que actualizar AGENTS.md, o se migrará a Pages/Vercel?
3. **Booking:** ¿existe ya la cuenta Cal.com y la URL para `PUBLIC_BOOKING_URL`, o el `mailto:` es el CTA definitivo por ahora?
4. **Dominio de producción:** ¿cuál será? (necesario para `site`, OG absoluta, sitemap y allowlist CORS del backend).
5. **Lighthouse:** ¿hay mediciones previas? No puedo levantar servidores para medir (regla de AGENTS.md §06); queda como verificación humana pendiente.
6. **`.wrangler/state` en git:** ¿fue intencional o se puede agregar a `.gitignore` y remover del índice?
7. **Tests:** ¿quieres suite e2e del formulario con Playwright (la skill ya está instalada) como parte del QA?
8. **Contenido:** ¿los claims (métricas de casos, bio, "F1 0.99", "47 tests") siguen aprobados para producción?

---

*Exploración realizada en solo lectura (sin servidores, sin modificar el repositorio). Este informe fue guardado a petición del dueño.*
