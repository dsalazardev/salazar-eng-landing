# Design

## Context

Ver `proposal.md` para la motivación. Estado relevante que condiciona el approach:

- La auditoría de textos decorativos (35 entradas) separó el vocabulario documentado en `.stitch/DESIGN.md` (índices `NN/`, marcas de registro `+`, voz mono, diagramas C4) de 9 cadenas inventadas por Stitch/agentes que NO aparecen en el design system (`SYS_STATUS`, `CALIBRATED`, `INSTRUMENT #`, `GRID 30`, `RESOLUCIÓN 0N`, `PLATE 08`, `INDEX // FAQ_05`, `COLOPHON`).
- La franja de métricas del Hero está marcada `aria-hidden="true"` — aplicación excesiva del principio "anotaciones decorativas ocultas a AT": las 3 métricas son contenido real.
- `SLA EN PRODUCCIÓN` rotula `<500 ms` (una latencia, no un acuerdo de nivel de servicio).
- El microcopy "Respuesta en menos de 24 h · Remoto LATAM · Internacional" está duplicado (Hero y CTA final).
- Las specs `landing-*` se sincronizaron en `design-refresh-v2`; `landing-stackstrip` conserva deriva previa (describe 16 tecnologías y la tagline antigua).

## Goals / Non-Goals

**Goals:**

- Eliminar las 8 anotaciones inventadas conservando el vocabulario documentado (índices, marcas `+`, etiquetas funcionales, diagramas C4).
- Corregir la etiqueta de latencia y consolidar el microcopy duplicado en el cierre.
- Exponer las métricas reales a tecnologías de asistencia sin cambios visuales.
- Codificar la política de vocabulario como requisito durable (`landing-base`).

**Non-Goals:**

- Re-sincronizar el contenido del stack (16→12 tecnologías y tagline): deriva previa; sincronización aparte.
- Modificar las etiquetas de los diagramas C4: solo se marcan como REVISAR para confirmación del dueño.
- Tocar copy de negocio, CTAs, anclas, tokens, JS o dependencias.

## Decisions

### 1. Eliminación directa, no ocultamiento

Las anotaciones inventadas se eliminan del marcado (no se ocultan con CSS/ARIA). Eran ruido para todo visitante y el dueño las señaló como no autorizadas. Alternativa descartada: conservarlas ocultas a AT (ya lo estaban; el problema es visual).

### 2. `LATENCIA EN PRODUCCIÓN`

El valor `<500 ms` es una medición de latencia; "SLA" implica un compromiso de nivel de servicio y sería un claim impreciso. Alternativa descartada: dejar solo el valor — rompe la simetría con las otras dos métricas etiquetadas.

### 3. Microcopy solo en el cierre

"Respuesta en menos de 24 h · Remoto LATAM · Internacional" queda únicamente en `landing-ctafinal`, junto al CTA de conversión. Alternativa descartada: conservarlo en el Hero — el cierre ya lo especifica y la repetición exacta es el duplicado detectado.

### 4. Fix de a11y por atributo

Se retira `aria-hidden` del contenedor de la franja de métricas del Hero; el diseño visual no cambia. La regla se generaliza en `landing-base`: anotaciones decorativas ocultas; contenido real (métricas) siempre expuesto. Alternativa descartada: `aria-label` por métrica — innecesario: el contenido ya es semántico (`dl`/`dt`/`dd`).

### 5. Política en `landing-base` (requisito añadido)

El vocabulario permitido/prohibido se codifica como requisito durable (validable por inspección del build), no solo como nota de design. Permitido: índices `NN/`, marcas `+`, etiquetas funcionales, etiquetas de diagramas C4 (tras verificación). Prohibido: metadatos de instrumento inventados y notas editoriales.

### 6. Diagramas C4: marca de revisión, cero cambios

Las etiquetas internas (`MS-GEO-ROUTING`, `3 WORKFLOWS`, `FRÁGIL`, `REACT 19`, etc.) describen los casos reales, pero su autoría no está confirmada; se listan para confirmación del dueño y no se tocan en este change.

### 7. Tabla de eliminaciones (aprobada)

| Texto | Archivo | Acción |
|---|---|---|
| `SYS_STATUS: OPERATIONAL` | `Navbar.astro` | Eliminar |
| `CALIBRATED // SYS_2026` | `Navbar.astro` | Eliminar |
| `INSTRUMENT #01 // ISOTIPO SE` | `Hero.astro` | Eliminar |
| `GRID 30` | `Hero.astro` | Eliminar |
| `RESOLUCIÓN 01/02/03` | `ProblemSolution.astro` | Eliminar |
| `PLATE 08 // RETRATO` | `Founder.astro` | Eliminar |
| `INDEX // FAQ_05` | `Faq.astro` | Eliminar |
| `COLOPHON // SOFTWARE & APPLIED AI` | `Footer.astro` | Eliminar |
| `SLA EN PRODUCCIÓN` | `Hero.astro` | Cambiar a `LATENCIA EN PRODUCCIÓN` |
| `STACK DE PRODUCCIÓN` | `StackStrip.astro` | Eliminar (redundante con `03/ ECOSISTEMA TÉCNICO`) |
| Microcopy "24 h · LATAM · Internacional" (Hero) | `Hero.astro` | Eliminar (se conserva en el cierre) |

### 8. Decisiones aceptadas (conservar)

- `LATAM / UTC-5` (Navbar): dato real de ubicación.
- `NUESTRA RESPUESTA` (ProblemSolution): encabezado de columna funcional.
- `S-01` / `S-02` / `S-03` (Services): códigos con tono de ficha técnica.
- `Captación automatizada (nuestro caso #0).` (LeadMagnet): copy de marketing real.
- Índices `NN/` (todo el sitio): firma documentada del sistema.

## Risks / Trade-offs

- [Eliminar texto visible altera el equilibrio visual de franjas/paneles] → Se conservan contenedores, clases y espaciados; solo cambia el texto interior. Verificación por inspección + pasada visual humana registrada.
- [El retiro de `aria-hidden` puede duplicar lecturas si algún ancestro sigue oculto] → La franja de métricas es hermana del panel decorativo (que conserva su `aria-hidden`); verificación del árbol accesible en la pasada humana.
- [Deriva de `landing-stackstrip` no resuelta] → Documentada como Non-Goal; se abordará en una sincronización futura.
- [Etiquetas de diagramas C4 posiblemente inexactas] → Marcadas REVISAR; sin cambios de código hasta confirmación del dueño.

## Migration Plan

1. Aplicar los bloques de `tasks.md` (7 componentes + verificación + cierre) en orden.
2. Verificación por inspección directa del build (sin preview): 0 residuos de los textos eliminados, copy nuevo presente, métricas sin `aria-hidden`.
3. `pnpm build` y `pnpm astro check` limpios.
4. Commits por bloque (Conventional Commits en español); sin push sin confirmación.
5. Rollback: revertir los commits por bloque; los cambios son de texto/atributo, sin migraciones.
