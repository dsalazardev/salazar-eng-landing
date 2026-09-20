# Tasks

## 1. Primitivo C4Diagram

- [x] 1.1 Crear `src/components/ui/C4Diagram.astro` con `interface Props { variant: 'telemetry' | 'doligestion' | 'microservices'; title: string }`: SVG inline `role="img"` + `aria-labelledby` + `<title id="c4-{variant}-title">` único, viewBox fijo y `h-auto w-full`, helpers internos (caja/label/flecha) y las 3 variantes blueprint — ① arquitectura real (sensor → API → agente RAG → dashboard + n8n), ② proceso conceptual sin componentes propietarios (deploy manual → pipeline → entregas estables), ③ arquitectura real (frontend React → servicios → notificaciones con marco Docker Compose) — sin hex hardcodeados (tokens vía clases); verificar con `pnpm astro check` (0 errores) y revisión de que cada variante tiene `<title>` y el ② no contiene material propietario

## 2. Sección y datos

- [x] 2.1 Crear `src/components/sections/ProofOfWork.astro` con el array `Case[]` tipado y el copy exacto de design.md (① `Telemetry Heart AI` con métricas `F1 0.99`/`Recall crítico 1.00`/`47 tests`, stack `Python`/`LangChain`/`n8n`/`IoT` y link repo; ② `DoliGestión` con reto exacto, badge estado `En despliegue a producción`, stack `ERP/CRM`/`SaaS`/`España` y link producto, sin mención de Onna Digital; ③ `Ecosistema de microservicios` con reto exacto, stack `NestJS`/`Docker`/`REST`/`React` y link al monorepo `development`; campos `loom`/`caseUrl` preparados y sin renderizar); verificar con `pnpm astro check` (0 errores) y revisión del copy contra design.md
- [x] 2.2 Shell de sección: `<section id="casos" class="border-y border-line bg-white">`, contenedor `relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`, 4 marcas de esquina blueprint (`aria-hidden="true"`, `pointer-events-none`, `hidden lg:block`), `SectionLabel index="06" text="EVIDENCIA"` y `<h2>` "Evidencia > promesas" (`mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl`); verificar con `pnpm astro check` (0 errores) y revisión de clases
- [x] 2.3 3 `Card` apiladas (sin `interactive`) con interno `lg:grid-cols-12` (C4 `lg:col-span-5` / contenido `lg:col-span-7`; espejo ② con `lg:order-2` en el diagrama) y anatomía §4.5: `<h3>` "Nombre — Reto" → `C4Diagram` → línea métricas/estado (label mono + stat badges ① / badge estado ②; ③ sin línea) → label `STACK` + badges → fila de links externos ("Repo →"/"Producto →") con `target="_blank"` `rel="noopener noreferrer"` y focus visible; verificar con `pnpm astro check` (0 errores) y revisión de estructura/clases

## 3. Integración

- [x] 3.1 Montar `<ProofOfWork />` en `src/pages/index.astro` inmediatamente después de `<Services />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `id="casos"` ×1, orden servicios → casos y los destinos del navbar intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el HTML/CSS: `id="casos"` ×1 y `href="#casos"` ×6 (ancla viva), h3 de los 3 casos presentes, métricas ① (`F1 0.99`, `Recall crítico 1.00`, `47 tests`), badge estado ②, badges de stack ①②③, links con `rel="noopener noreferrer"` + `target="_blank"`, 3 SVG con `role="img"` + `<title>`, ausencia de "asíncrona"/"Onna Digital", 0 `client:*`, único `<script>` = inline del navbar (245 B) y `global.css` intacto (git diff); grep tolerante a `>`/`&gt;` en el h2
- [ ] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (layout alternado ①②③, legibilidad de los C4 en móvil, barrido responsive 320→1440 sin overflow) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [ ] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/sections/ProofOfWork.astro`, `src/components/ui/C4Diagram.astro`, `src/pages/index.astro`) y commit `feat(proofofwork): 3 tarjetas de evidencia con C4 inline y ancla #casos`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-proofofwork change artifacts`
- [ ] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS, verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
