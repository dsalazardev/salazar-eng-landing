# Design: Design Refresh v2 — Precision Instrument

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- **Fuente de verdad visual:** Stitch — proyecto `14368465756738872305`, screen `ec9530dadcf14d0ca39554653a676d96` ("SALAZAR Eng. — Precision Instrument Landing"), con design system "SALAZAR Eng. Blueprint" (asset `49d420c992cd4d8e9ba99b8f704b28e3`) y `DESIGN.md` local en `.stitch/DESIGN.md`. El contenido del screen fue verificado **verbatim** contra `src/components/` (nombres, métricas, textos y FAQ intactos). El HTML generado por Stitch sirve como referencia de lenguaje visual, no como código a copiar.
- **Base actual:** 12 specs activas, 12 secciones `.astro` + navbar/footer, 2 islas React (`client:visible`), build de referencia del 2026-09-22. Tokens estrictos (6), tipografías self-hosted, presupuesto de carga inicial < 10 KB, verificación por inspección del dist (AGENTS.md §06, sin levantar preview).
- **Bloqueadores:** `Navbar.astro` y `Faq.astro` importan `lucide-astro` (paquete eliminado); `@lucide/astro@1.50.0` ya está versionado. `AGENTS.md` §04 prohíbe librerías de animación; Anime.js 4.5.0 está instalada sin usar.

## Goals / Non-Goals

**Goals:**

- Implementar el sistema "Precision Instrument" en las 12 secciones + chrome sin alterar contenido.
- Capa de motion sutil con Anime.js: un módulo, diferido, medido, con `prefers-reduced-motion`.
- Build sano (Lucide resuelto) y constitución actualizada (`AGENTS.md` §04).
- Preservar accesibilidad (foco, contraste, semántica) y presupuesto de carga inicial.

**Non-Goals:**

- No se toca copy/contenido salvo los 2 títulos embellecidos y las anotaciones decorativas aceptadas.
- No se añaden secciones, islas, endpoints ni dependencias nuevas (solo se usan las ya instaladas).
- No entran: swap a SVG del isotipo, OG image, sitemap/robots, deploy ni medición Lighthouse formal.
- No se anima el titular del hero (LCP) ni se usan animaciones en bucle.

## Decisions

### D1. Fuente de verdad visual y traducción a código

El screen de Stitch define el **lenguaje** (composición, jerarquía, densidad, anotaciones); la implementación se traduce a Astro + Tailwind con las utilidades del proyecto. No se copian clases del HTML de Stitch. Criterio de aceptación: sistema visual aplicado + contenido verbatim, no pixel-perfect.

### D2. Utilidades del sistema en `global.css`

Se añaden utilidades mínimas y documentadas: reglas full-bleed (borde que excede el contenedor), retícula de instrumentación, hairlines verticales para franjas de métricas y estilos de anotación mono. Regla dura: **solo los 6 tokens**, sin `box-shadow` ni gradientes decorativos.

### D3. Arquitectura de la capa de animación (Anime.js)

- **Un solo módulo** (`src/scripts/motion.ts`) empaquetado por Astro como **chunk externo** cargado desde `BaseLayout`; nunca inline ni bloqueante.
- **Hooks declarativos** por atributos `data-motion="fade|draw|count|hover"`; los componentes no contienen lógica de animación.
- **Entradas:** `IntersectionObserver` (una pasada, sin re-disparo); **hover** por CSS cuando baste y Anime.js solo si aporta.
- **Política de movimiento:** duraciones 150–250 ms, easing de salida suave; solo `transform`/`opacity`; conteo de métricas una vez; sin loops, sin parallax, sin bounce.
- **`prefers-reduced-motion: reduce`:** `matchMedia` → salida temprana; todo el contenido queda en su estado final visible.
- **Protección LCP:** el titular del hero no recibe animación; el módulo no bloquea el render.
- **Presupuesto:** chunk medido en build (objetivo ≤ 15 KB gzip); si Anime.js v4 lo excede, imports granulares (tree-shaking) y registro del peso real.

### D4. Fix de Lucide

Cambiar los imports de `Navbar.astro` y `Faq.astro` de `lucide-astro` a `@lucide/astro`, conservando iconos, tamaños y clases. Verificación temprana con `pnpm astro check` (si la API del paquete difiere, ajustar el import de los 3 iconos usados: `Menu`, `X`, `ChevronDown`).

### D5. Actualización de `AGENTS.md` §04

Sustituir "Cero librerías de animación. Solo CSS nativo" por la política Anime.js: permitida como **capa única, diferida y con reglas** (reduced-motion, sin loops, duraciones y presupuesto definidos, LCP exento). Actualizar la fila de presupuesto JS para reflejar el módulo diferido fuera de la carga inicial crítica.

### D6. StackStrip: de marquee a cuadrícula

Retirar keyframes, máscara y control de pausa del marquee; construir una **cuadrícula técnica de celdas** (full-bleed) con lista semántica única y anotaciones decorativas `aria-hidden`. La lista de 16 tecnologías se conserva verbatim; sin scroll horizontal ni CLS.

### D7. Mapeo sección a sección

| Sección | Cambios principales | Intocable |
|---|---|---|
| Navbar | Franja de estado decorativa + enlaces numerados | Destinos, CTA, sticky, popover, a11y |
| Hero | Panel de instrumentos + franja de métricas (`<500 ms`, `F1 0.99`, `<24 h`) | Titular, subtítulo, CTAs, micro-prueba |
| Stack | Cuadrícula de celdas técnicas | Las 16 tecnologías verbatim |
| Problema | Matriz de diagnóstico con etiquetas de resolución | 3 pares cita→respuesta |
| Servicios | Bento console; métrica como lectura; h2 aceptado | Copy de las 3 tarjetas, CTA |
| Evidencia | C4 como pieza gráfica central; layout alternado | Nombres, retos, métricas, links |
| Proceso | Nodos conectados de instrumentación | 4 pasos verbatim |
| Fundador | Dossier editorial con marco de instrumentación | Bio, cita, credenciales, retrato |
| Checklist | Panel de captación + motion de estados | Contrato del formulario, copy |
| FAQ | Accordion técnico con hairlines | 5 preguntas/respuestas verbatim |
| CTA final | Consola oscura de cierre + motion | Copy, fallback, contacto |
| Footer | Colofón técnico (anotaciones decorativas) | Firma, contacto, enlaces, © |

### D8. Decisiones aceptadas (documentadas)

- **Títulos embellecidos:** "Servicios de Ingeniería Especializada" (h2 de la sección 05) y "Recurso Técnico Gratuito" (título de sección 09, sobre el h2 del checklist).
- **Anotaciones decorativas:** `CALIBRATED // SYS_2026`, `INSTRUMENT #01 // ISOTIPO SE`, `p95 / LATENCY`, `Async High-p95`, `ISOLATED CLUSTER`, etc. Reglas: decorativas (`aria-hidden`), sin datos de negocio nuevos, sin alterar nombres ni métricas existentes.

## Risks / Trade-offs

- [Anime.js excede el presupuesto de 15 KB gzip] → imports granulares y medición en build; el módulo queda fuera de la carga inicial crítica en cualquier caso.
- [Motion degrada LCP/CLS] → módulo diferido, titular exento, solo `transform`/`opacity`, alturas reservadas.
- [Anotaciones decorativas dañan la accesibilidad] → `aria-hidden` sistemático + revisión semántica.
- [El screen de Stitch no es 1:1 implementable] → traducción fiel del lenguaje visual; criterio: sistema + jerarquía, no pixel-perfect.
- [Pérdida de dinamismo al retirar el marquee] → aceptado; la cuadrícula es decisión aprobada y el motion sutil compensa.
- [`@lucide/astro` con API distinta] → verificación temprana con `astro check` en el primer bloque de tareas.
- [`global.css` crece sin control] → utilidades mínimas, documentadas y limitadas a los 6 tokens.

## Migration Plan

1. **Bloque 1 — Fixes:** Lucide (`Navbar`/`Faq`) + `AGENTS.md` §04 → build sano.
2. **Bloque 2 — Base:** utilidades del sistema en `global.css` + módulo `motion.ts` (sin aplicar aún).
3. **Bloque 3 — Rediseño:** secciones en orden narrativo (02 hero → 12 footer).
4. **Bloque 4 — Motion:** hooks `data-motion` por sección + verificación `reduced-motion`.
5. **Bloque 5 — Verificación:** `astro check`, build, inspección del dist, medición de chunks, barrido responsive y reduced-motion (humano).

Rollback: revertir por bloques (cada bloque es un commit independiente); sin datos ni infraestructura implicados.

## Open Questions

- Peso final real de Anime.js v4 con tree-shaking (se mide en apply; no cambia el plan ni los specs).
- Alcance exacto del motion en el navbar sticky (propuesto: mínimo; diferible sin cambiar specs).
- Ajustes finos del encuadre del dossier del fundador (verificación humana del dueño).
