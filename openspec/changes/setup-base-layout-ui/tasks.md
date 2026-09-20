# Tasks

## 1. Dependencias

- [x] 1.1 Ejecutar `pnpm add @fontsource-variable/manrope @fontsource-variable/jetbrains-mono` y verificar que ambas quedan en `dependencies` de `package.json` con `pnpm-lock.yaml` actualizado
- [x] 1.2 Ejecutar `pnpm add -D @astrojs/check typescript` y verificar que ambas quedan en `devDependencies` y que `pnpm astro check` ya no muestra el mensaje de paquetes requeridos

## 2. Tokens y estilos base

- [x] 2.1 Reescribir `src/styles/global.css`: `@theme` con los 6 colores canónicos (`navy-900`, `navy-700`, `steel-500`, `surface`, `line`, `accent`) y las fuentes (`--font-sans` Manrope Variable, `--font-mono` JetBrains Mono Variable); `@layer base` con `html` (smooth solo bajo `prefers-reduced-motion: no-preference`), `body` (surface/navy-900/`var(--font-sans)`), `::selection` (accent + blanco) y `:focus-visible` (outline accent 2px, offset 2px); verificar que no quedan nombres de token antiguos y que `.bg-blueprint-grid` y `.bg-dot-pattern` permanecen textualmente intactas
- [x] 2.2 Verificar que el CSS no contiene colores fuera de los 6 tokens (revisar `global.css` y buscar hex ajenos como `#0F172A`)

## 3. BaseLayout

- [x] 3.1 Crear `src/layouts/BaseLayout.astro` con `interface Props { title; description; ogImage? }`, imports de las 2 fuentes, `lang="es"`, charset/viewport/`theme-color` #0B2545, title/description, Open Graph completo (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:locale=es_CO`, `og:image` default `/og-default.png`), Twitter `summary_large_image`, favicons con comentario TODO de isotipo, skip-link accesible y `<main id="contenido">` alrededor del slot; verificar con `pnpm astro check` (0 errores)
- [x] 3.2 Verificar en el HTML de un build que el skip-link apunta a `#contenido` y que el `<main>` envuelve el slot (revisión del archivo + salida del build en 6.2)

## 4. Primitivos UI

- [x] 4.1 Crear `src/components/ui/Button.astro` con props `{ href?, variant?: 'primary'|'outline', size?: 'md'|'lg', class? }`, tag dinámico (`<a>` con href, si no `<button type="button">`), variantes/tamaños según design.md D5 y fusión `twMerge(clsx([...]))`; verificar con `pnpm astro check` (0 errores)
- [x] 4.2 Crear `src/components/ui/Badge.astro` con `class?` + slot y estilo mono/uppercase/borde según design.md D5; verificar con `pnpm astro check` (0 errores)
- [x] 4.3 Crear `src/components/ui/SectionLabel.astro` con `{ index: string; text: string }` y render `{index}/ {text}` en mono + línea `bg-line`; verificar con `pnpm astro check` (0 errores)
- [x] 4.4 Crear `src/components/ui/Card.astro` con `{ interactive?: boolean; class? }` + slot y clases base/interactive según design.md D5; verificar con `pnpm astro check` (0 errores)

## 5. Smoke test

- [x] 5.1 Reemplazar `src/pages/index.astro` (starter) por el smoke test: `BaseLayout` con title/description del change, `SectionLabel` (00/ SETUP), `<h1>`, párrafo `text-steel-500`, `<Button variant="primary">` + `<Button variant="outline">`, `<Badge>Astro 7</Badge>` + `<Badge>Tailwind v4</Badge>`, una `Card`, un `div` con `bg-blueprint-grid` y otro con `bg-dot-pattern`, y una tarjeta con "JetBrains Mono OK" (mono) + "Manrope OK" (sans); verificar que no hay islas ni `client:*` y que `pnpm astro check` pasa con 0 errores

## 6. Verificación de aceptación

- [x] 6.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte final
- [x] 6.2 Ejecutar `pnpm build` y registrar la salida; verificar que `dist/` no contiene archivos `.js` de islas, que el HTML no incluye `<script>` de islas, que el CSS construido contiene las utilidades de tokens (`bg-navy-900`, `text-steel-500`, `border-line`, `bg-surface`, `text-accent`, `bg-navy-700`) y que no aparecen los nombres de token antiguos
- [x] 6.3 Ejecutar `pnpm preview` y verificar en DevTools → Network: 0 requests a `fonts.googleapis.com` / `fonts.gstatic.com` y woff2 servidos desde el origen local; verificar visualmente Manrope, JetBrains Mono y las 2 texturas
- [x] 6.4 Verificar que no se añadieron dependencias fuera de las 4 permitidas (diff de `package.json` contra el estado previo al change)

## 7. Commits y cierre

- [x] 7.1 Revisar `git status` y `git diff` para confirmar que solo hay cambios de alcance (`src/styles/global.css`, `src/layouts/`, `src/components/ui/`, `src/pages/index.astro`, `package.json`, `pnpm-lock.yaml`)
- [x] 7.2 Commit 1: `chore(deps): fuentes self-hosted + @astrojs/check/typescript (dev-only, no afecta el bundle)` con `package.json` y `pnpm-lock.yaml`; verificar con `git show --stat HEAD`
- [x] 7.3 Commit 2: `feat(setup): BaseLayout, design tokens y componentes UI base` con los archivos de `src/`; verificar con `git log --oneline -2`
- [x] 7.4 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, decisiones no cubiertas por el prompt y problemas encontrados
