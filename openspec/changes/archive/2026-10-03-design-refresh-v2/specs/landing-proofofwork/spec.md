# Spec Delta: landing-proofofwork — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument de la evidencia

La sección SHALL adoptar el tratamiento "laminas técnicas" del diseño aprobado: los diagramas C4 SHALL pasar a ser piezas gráficas centrales de cada tarjeta (con mayor presencia y trazo de instrumentación), el layout alternado ①②③ se conserva, las métricas verificadas se presentan como lecturas técnicas y los links mantienen su posición con affordance externa clara. Los nombres de caso, retos, métricas y links NO SHALL alterarse.

#### Scenario: Diagramas como pieza central

- **WHEN** se inspecciona cada tarjeta construida
- **THEN** el diagrama C4 ocupa un rol gráfico principal en su columna y el contenido conserva el orden y la alternancia

#### Scenario: Métricas y links intactos

- **WHEN** se revisan las tarjetas
- **THEN** los nombres, retos, métricas verificadas y links coinciden verbatim con el contenido existente

## MODIFIED Requirements

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript propio (sin islas ni scripts; la capa global de animación puede animar entradas y trazos de forma sutil). `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Verificación por inspección

El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="casos"` exactamente una vez, `href="#casos"` ×6, títulos de los 3 casos presentes, links confirmados, SVG con `role="img"` y la sección rediseñada presente; los 6 tokens conservan sus valores (las utilidades nuevas del sistema Precision Instrument en `global.css` están permitidas). Las comprobaciones visuales (layout alternado, diagramas, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los textos y links, los SVG accesibles, el rediseño aplicado y los tokens intactos

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el layout alternado de las 3 tarjetas, la legibilidad de los diagramas y la ausencia de desbordamientos entre 320 y 1440 px
