# Tasks

## 1. Asset y componente

- [x] 1.1 Copiar `C:\Users\USUARIO\Downloads\15_jun_2026_10_19_36.png` → `src/assets/retrato-daner.png` **sin modificar el original**; verificar con `sharp` que la copia existe y conserva 1023×1537 y formato PNG
- [x] 1.2 Crear `src/components/sections/Founder.astro` con el copy exacto de design.md: `<h2>` "Ingeniería primero. Marketing después."; bio con `<strong>Daner Salazar</strong>`, "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación" (carrera completa) y experiencia internacional; cita en `<blockquote>` + `<cite>Daner Salazar</cite>`; cierre "Sin intermediarios, sin juniors rotando."; `const credentials: string[]` con los 3 ítems fijados; verificar con `pnpm astro check` (0 errores) y revisión del copy contra design.md

## 2. Retrato y layout

- [x] 2.1 Retrato: import del asset + `<Image>` de `astro:assets` (`format="webp"`, `densities={[1, 2]}`, `width`/`height` explícitos, `loading="lazy"`, `alt="Daner Salazar, fundador de SALAZAR Eng."`), slot `aspect-[4/5] object-cover object-top`, escala de grises y marco `overflow-hidden rounded-md border border-line` con cruces `+` en las 4 esquinas (`aria-hidden="true"`); verificar con `pnpm astro check` (0 errores) y revisión de clases
- [x] 2.2 Layout y estética: `<section id="fundador" class="border-y border-line bg-white">`, contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`, grid `gap-10 lg:grid-cols-12 lg:items-center` (foto `lg:col-span-5` izquierda · contenido `lg:col-span-7` derecha) y **foto arriba en móvil**; `SectionLabel index="08" text="FUNDADOR"` + label `CREDENCIALES` con lista `·` (marcador mono `text-line`, `aria-hidden`); verificar con `pnpm astro check` (0 errores) y revisión de estructura

## 3. Integración

- [x] 3.1 Montar `<Founder />` en `src/pages/index.astro` inmediatamente después de `<Process />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `id="fundador"` ×1, orden proceso → fundador y los destinos del navbar intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el HTML/CSS: `id="fundador"` ×1, h2 lema, "desarrollador de software y estudiante de último año de Ingeniería de Sistemas y Computación", "Sistemas y Computación" ×2 (bio + credencial), las 3 credenciales, asset WebP hasheado de la foto con `srcset` de 2 densidades + `loading="lazy"` + `alt`, ausencia de "ingeniero de software"/"ingeniero senior", 0 enlaces sociales/CTA en la sección, 0 `client:*`, único `<script>` = inline del navbar (245 B) y `global.css` intacto (git diff)
- [x] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (encuadre 4:5 con rostro protegido, grayscale, marco con cruces, responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/Founder.astro`, `src/assets/retrato-daner.png`, `src/pages/index.astro`) y commit `feat(founder): retrato, bio ejecutiva y credenciales verificables`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-founder change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
