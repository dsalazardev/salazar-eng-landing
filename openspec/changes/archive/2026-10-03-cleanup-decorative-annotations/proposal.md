# Proposal

## Why

La auditoría de textos decorativos de la landing detectó 35 entradas, de las cuales 9 son anotaciones de instrumento inventadas por Stitch/agentes (no documentadas en el design system) que generan ruido sin aportar información al visitante; además hay un bug de accesibilidad (las 3 métricas reales del hero quedan ocultas a lectores de pantalla), un microcopy duplicado entre hero y cierre, y una imprecisión conceptual ("SLA EN PRODUCCIÓN" rotula una latencia). El dueño quiere limpiar el ruido y corregir, sin tocar el contenido de negocio.

## What Changes

- **Eliminar 8 anotaciones inventadas**: `SYS_STATUS: OPERATIONAL` y `CALIBRATED // SYS_2026` (navbar), `INSTRUMENT #01 // ISOTIPO SE` y `GRID 30` (hero), `RESOLUCIÓN 01/02/03` (problema), `PLATE 08 // RETRATO` (fundador), `INDEX // FAQ_05` (FAQ) y `COLOPHON // SOFTWARE & APPLIED AI` (footer).
- **Corregir la etiqueta** `SLA EN PRODUCCIÓN` → `LATENCIA EN PRODUCCIÓN` (hero; el valor `<500 ms` es una latencia, no un acuerdo de nivel de servicio).
- **Consolidar el microcopy** "Respuesta en menos de 24 h · Remoto LATAM · Internacional": se elimina del hero y queda solo en el cierre (CTA final).
- **Eliminar el `<h2>`** "STACK DE PRODUCCIÓN" (redundante con la etiqueta de sección `03/ ECOSISTEMA TÉCNICO`); el encabezado conserva la etiqueta y el subtítulo "Tecnología seleccionada por rendimiento y escalabilidad.".
- **Arreglar el bug de accesibilidad**: retirar `aria-hidden` de la franja de métricas del hero para que `<500 ms`, `F1 0.99` y `<24 h` se anuncien; el diseño visual no cambia.
- **Marcar (sin tocar) las etiquetas de los diagramas C4** de evidencia como REVISAR: el dueño confirmará cuáles describen realidad (`MS-GEO-ROUTING`, `3 WORKFLOWS`, `FRÁGIL`, `REACT 19`, etc.) antes de cualquier cambio.
- **Documentar la política** de "vocabulario de anotación permitido" que faltaba en el sistema.

Fuera de alcance: la deriva previa de la spec `landing-stackstrip` (describe 16 tecnologías y la tagline antigua; el sitio ya usa 12 tecnologías en 4 categorías desde iteraciones anteriores). Esta limpieza no re-sincroniza ese contenido; queda anotado para una futura sincronización.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `landing-base`: se añade la política de vocabulario de anotación decorativa (permitido/prohibido) y el principio de que el contenido real (métricas) nunca se oculta a tecnologías de asistencia.
- `landing-navbar`: la franja de estado conserva solo `LATAM / UTC-5` (dato real); se eliminan los metadatos inventados.
- `landing-hero`: panel sin anotaciones inventadas; métricas anunciadas a AT; etiqueta de latencia corregida; microcopy duplicada eliminada (queda en el cierre).
- `landing-stackstrip`: encabezado sin `<h2>` redundante.
- `landing-problemsolution`: sin etiquetas de resolución decorativas.
- `landing-founder`: sin `PLATE 08` (se conservan las cruces del marco).
- `landing-faq`: sin `INDEX // FAQ_05`.
- `landing-ctafinal`: el footer queda sin `COLOPHON` (contenido exhaustivo).

## Impact

- **Componentes**: `Navbar.astro`, `Hero.astro`, `StackStrip.astro`, `ProblemSolution.astro`, `Founder.astro`, `Faq.astro`, `Footer.astro` (7 archivos; cambios de texto y un atributo ARIA).
- **Specs**: 8 deltas (`landing-base`, `landing-navbar`, `landing-hero`, `landing-stackstrip`, `landing-problemsolution`, `landing-founder`, `landing-faq`, `landing-ctafinal`).
- **Sin cambios**: copy de negocio, CTAs, contratos de anclas, presupuesto de JS, dependencias, tokens. El build y el type-check no se alteran.
- **Riesgo**: bajo; eliminaciones de texto decorativo y un atributo ARIA. Verificación por inspección directa del build (0 residuos de los textos eliminados + métricas anunciadas).
