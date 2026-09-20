# Proposal: ProofOfWork — 3 tarjetas de evidencia con C4 inline y ancla #casos

## Why

Tras la oferta (M05), el decisor necesita prueba antes de agendar: 3 casos con arquitectura, métricas y links verificables (brief §3: "Evidencia > promesas: C4 + repo + demo + métrica"). Además, esta sección resuelve la **segunda ancla viva del contrato del navbar**: hoy `href="#casos"` aparece ×6 (navbar desktop + panel móvil + CTA del hero + CTAs de servicios) e `id="casos"` no existe en ninguna parte.

## What Changes

- **Nuevo `src/components/sections/ProofOfWork.astro`** (0 JS): sección `id="casos"` en banda `bg-white` con `border-y border-line` + marcas de esquina blueprint (se diferencia de Services sin romper paleta), `SectionLabel 06/ EVIDENCIA` + `<h2>` "Evidencia > promesas" (verbatim brief §3).
- **Nuevo `src/components/ui/C4Diagram.astro`** (primitivo): SVG inline con 3 variantes en estilo blueprint (cajas + líneas + labels mono, hereda tokens), `role="img"` + `<title>` único por diagrama, ~2–4 KB c/u, 0 requests. Sin placeholders.
- **3 tarjetas** (`Card` apiladas — contenido denso, no grid 3-col) con interno `lg:grid-cols-12` (diagrama 5 / contenido 7) y **lados alternados** (espejo ①②③); anatomía §4.5: `<h3>` "Nombre — Reto" → C4 → métricas/estado → stack badges → fila de links.
- **Caso ① Telemetry Heart AI**: reto "de datos dispersos a agente clínico con RAG"; métricas reales verificadas (`F1 0.99` · `Recall crítico 1.00` · `47 tests`); stack `Python` `LangChain` `n8n` `IoT`; link al repo.
- **Caso ② DoliGestión**: marco de producto "Desarrollo de ERP/CRM SaaS (DoliGestión) — España" (sin mención de Onna Digital, sin repo, sin arquitectura interna ni métricas propietarias); reto "de deploys manuales frágiles hacia entregas estables (modernización en curso)"; badge de estado `En despliegue a producción`; badges `ERP/CRM` `SaaS` `España`; link `doligestion.es` ("Producto →"); C4 conceptual del proceso (deploy manual → pipeline → entregas estables), sin componentes propietarios.
- **Caso ③ Ecosistema de microservicios**: reto "5 servicios NestJS orquestados con Docker y pruebas automatizadas" ("comunicación asíncrona" **retirada**: verificado REST síncrona entre servicios); badges `NestJS` `Docker` `REST` `React` (Spring Boot fuera: no pertenece a este ecosistema verificado); link al monorepo en rama `development`.
- **Regla "solo links existentes"**: Loom y "Caso completo →" NO se renderizan (campos preparados en los datos, sin links muertos); externos con `target="_blank" rel="noopener noreferrer"` y focus visible.
- **`src/pages/index.astro`**: monta `<ProofOfWork />` inmediatamente después de `<Services />`.
- **`id="casos"`** resuelve las 6 anclas del contrato; `<h3>` por caso; 0 JS nuevo; `global.css` intacto.

## Capabilities

### New Capabilities

- `landing-proofofwork`: sección de evidencia con 3 tarjetas de caso (C4 inline, métricas/estado, stack, links verificables) y ancla `#casos` del contrato.

### Modified Capabilities

Ninguna: la sección es aditiva y no altera requisitos de `landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip`, `landing-problemsolution` ni `landing-services`.

## Fuera de Alcance

- Páginas de caso (Fase 2, Content Collections), embeds Loom y caso #0 de dogfooding (→ M09).
- Detalles propietarios del caso ② (repo, arquitectura interna, métricas de la empresa) y mención de Onna Digital.
- Métricas inventadas o no verificadas; badge Spring Boot en ③.
- Cambios en `global.css`, navbar, hero, stackstrip, problemsolution, services o el contrato de anclas (solo se **resuelve** `#casos`).
- Dependencias nuevas, islas React o imágenes raster (todo SVG inline).
- Animaciones/scroll-reveal (micro-change dedicado).

## Impact

- **Nuevos**: `src/components/sections/ProofOfWork.astro`, `src/components/ui/C4Diagram.astro`.
- **Modificados**: `src/pages/index.astro` (montaje tras Services).
- **Sin cambios**: `global.css`, `BaseLayout.astro`, navbar, hero, stackstrip, problemsolution, services, tokens, primitivos existentes, `astro.config.mjs`, `package.json`.
- **Contrato**: `#casos` pasa de muerta a viva (6 enlaces resueltos); `#proceso`, `#faq` y `#contacto` siguen pendientes de M07/M10/M11.
- **Presupuesto**: 0 JS nuevo; 0 requests de imágenes; sin CLS.
