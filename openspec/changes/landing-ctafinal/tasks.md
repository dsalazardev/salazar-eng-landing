# Tasks

## 1. Primitivos y shell

- [x] 1.1 `SectionLabel`: añadir prop opcional `class` y fusionar con `twMerge` (patrón de `Button`/`Card`), sin cambiar el markup ni el estilo por defecto; verificar con `pnpm astro check` (0 errores) y revisión de que una clase externa en conflicto prevalece
- [x] 1.2 `BaseLayout`: añadir `<slot name="footer" />` inmediatamente después de `</main>` (el slot `header`, el `<main>` y el skip-link no cambian); verificar con `pnpm astro check` (0 errores) y revisión de la estructura del layout
- [x] 1.3 `.env.example`: añadir `PUBLIC_BOOKING_URL=` con comentario de variable build-time y nota de que la URL/link de Cal.com la define el dueño (**sin valor inventado**); verificar por lectura y `git status` (`.env` sigue ignorado, `.env.example` versionado)

## 2. LazyEmbed (isla React)

- [x] 2.1 Crear `src/components/islands/LazyEmbed.tsx`: props tipadas (`src`, `title`, `ctaLabel`, `height?`), estados `idle` → `loading` → `loaded`, fachada `<button type="button">` con clases del Button primario replicadas en TSX, iframe montado **solo tras el click** (`src` normalizado al patrón `/embed`, `title`, `allow="payment"`, `loading="lazy"`, altura reservada ~640–720 px), `aria-live="polite"` durante la carga, `focus()` al iframe al cargar, sin estado de error (la alternativa externa permanece visible), sin dependencias ni scripts de terceros; verificar con `pnpm astro check` (0 errores) y revisión de código (ningún import `@calcom/*`, ninguna URL hardcodeada, `src` derivado de la prop)
- [x] 2.2 Verificar el comportamiento de carga diferida por inspección del build: chunk `LazyEmbed.*.js` hasheado en `dist/_astro/` y `cal.com` ausente del HTML inicial (solo dentro del chunk); verificar con `pnpm build` (con `PUBLIC_BOOKING_URL` de prueba local, no versionada) + grep del dist

## 3. CtaFinal y Footer

- [x] 3.1 Crear `src/components/sections/CtaFinal.astro`: `<section id="contacto" class="bg-navy-900 text-white">` (sin `border-y`), contenedor canónico, `SectionLabel index="11" text="CTA"` con clase clara del consumidor (nunca `steel-500` sobre navy), h2 y párrafo **verbatim del brief §4.8**, CTA primario condicional (`LazyEmbed client:visible` si `PUBLIC_BOOKING_URL`, si no `Button` con enlace `mailto:`/WhatsApp), alternativa email + microcopy en `white/60-70`, hairlines `white/10-15`; verificar con `pnpm astro check` (0 errores) y revisión de clases/copy contra design.md D1/D2/D9
- [x] 3.2 Crear `src/components/sections/Footer.astro`: landmark `<footer>` sobre navy con hairline `white/10`, firma `— SALAZAR Eng. · Software & Applied AI`, contacto (email + WhatsApp), nav (`#servicios`, `#casos`, `#proceso`, `#faq`) y `© <año>` con `new Date().getFullYear()`; logo condicional: si `src/assets/isotipo-white.png` existe, **verificarlo por muestreo de píxeles** (script sharp .cjs: píxeles claros del trazo ≥ 3:1 contra navy-900) antes de usarlo; si no existe o no pasa, footer solo con firma textual + TODO del logo; verificar con `pnpm astro check` (0 errores), revisión de estructura y (si aplica) la salida del script de píxeles
- [x] 3.3 Montar en `src/pages/index.astro`: import + `<CtaFinal />` inmediatamente después de `<Faq />` y `<Footer slot="footer" />`; verificar con `pnpm astro check` (0 errores) y, en el build, `<footer>` de página **tras `</main>`** (contar por posición), `id="contacto"` ×1, `href="#contacto"` ×2 con destino y `#servicios`/`#casos`/`#proceso`/`#faq` intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Build con `PUBLIC_BOOKING_URL` de prueba (local, no versionada) + inspección de `dist/index.html` y `dist/_astro/`: `id="contacto"`=1, `href="#contacto"`=2, firma `SALAZAR Eng. · Software & Applied AI`, footer tras `</main>`, `astro-island`=2, chunk `LazyEmbed.*.js` hasheado, `cal.com` **ausente del HTML inicial**, 3 scripts inline = 4,997 B, `global.css` intacto (`git diff`)
- [x] 4.3 Build sin `PUBLIC_BOOKING_URL` + inspección: `astro-island`=1 (solo ContactForm), sin iframe del embed, CTA primario con enlace directo (`mailto:`/WhatsApp) presente y **0 JS nuevo** por la sección
- [x] 4.4 Documentar la lista de verificaciones humanas pendientes del dueño (banda navy y contrastes AA, footer con/sin logo, operación por teclado de la fachada, y con URL real de Cal.com: carga solo al click y agenda correctamente) para el reporte final (§06: no se levanta preview)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (nuevos: `CtaFinal.astro`, `Footer.astro`, `LazyEmbed.tsx`; modificados: `index.astro`, `BaseLayout.astro`, `SectionLabel.astro`, `.env.example`) y commit `feat(ctafinal): cierre navy con Cal.com lazy, footer y ancla #contacto`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-ctafinal change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build` (con y sin URL), hallazgos de la inspección del HTML/CSS/chunks, verificaciones humanas pendientes, Open Questions (confirmaciones de copy y ruta del isotipo) y problemas encontrados
- [x] 5.3 Ejecutar `openspec validate landing-ctafinal` (4/4) y registrar la salida; el archivado usa el flujo CLI (nunca edición manual de specs)
