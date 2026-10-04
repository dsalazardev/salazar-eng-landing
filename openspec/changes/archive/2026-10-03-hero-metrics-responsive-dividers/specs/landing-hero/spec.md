# Spec Delta: landing-hero — Separadores adaptativos de la banda de métricas

## MODIFIED Requirements

### Requirement: Rediseño Precision Instrument del hero

El hero SHALL conservar el tratamiento "panel de instrumentos" del diseño aprobado: titular de escala masiva con tracking ajustado, franja inferior de lecturas métricas reales separadas por hairlines adaptativos (horizontales entre las filas apiladas en móvil; verticales entre las 3 columnas desde `sm`; valores ya presentes en el contenido: `<500 ms`, `F1 0.99`, `<24 h`), tarjeta de instrumento con retícula de medición y reglas full-bleed coherentes con el sistema Precision Instrument. La etiqueta de la métrica `<500 ms` SHALL leerse "LATENCIA EN PRODUCCIÓN" (el valor es una latencia, no un acuerdo de nivel de servicio). La franja de métricas SHALL ser contenido real y NO SHALL marcarse como decorativa ni `aria-hidden`: las tecnologías de asistencia SHALL anunciar los valores y sus etiquetas. El titular SHALL quedar exento de la capa de animación (protección de LCP). El copy, el orden de elementos y los destinos de los CTAs NO SHALL alterarse.

#### Scenario: Panel de instrumentos aplicado

- **WHEN** se inspecciona el hero construido
- **THEN** existe la franja de métricas con hairlines y la tarjeta de instrumento, y las reglas full-bleed del sistema están presentes

#### Scenario: Separadores adaptativos de la franja

- **WHEN** se renderiza la franja de métricas a cualquier ancho de viewport
- **THEN** en móvil las filas apiladas se separan con hairlines horizontales y desde `sm` las 3 columnas se separan con hairlines verticales, sin líneas huérfanas en ningún ancho

#### Scenario: Etiqueta de latencia corregida

- **WHEN** se inspecciona la franja de métricas
- **THEN** la etiqueta dice "LATENCIA EN PRODUCCIÓN" y la cadena "SLA EN PRODUCCIÓN" no aparece en el hero

#### Scenario: Métricas anunciadas para AT

- **WHEN** un lector de pantalla recorre el hero
- **THEN** anuncia `<500 ms`, `F1 0.99` y `<24 h` con sus etiquetas, y la franja no está oculta a tecnologías de asistencia

#### Scenario: Titular sin animación

- **WHEN** se carga la página
- **THEN** el `<h1>` no recibe animación de entrada y sigue siendo el candidato a LCP

#### Scenario: Métricas reales sin inventar

- **WHEN** se revisan las lecturas de la franja
- **THEN** sus valores provienen del contenido existente y no se añaden cifras nuevas
