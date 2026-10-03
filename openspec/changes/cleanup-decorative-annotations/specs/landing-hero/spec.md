# Spec Delta: landing-hero — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Primera sección con propuesta de valor

El hero SHALL ser la primera sección dentro de `<main>` y SHALL mostrar, en este orden: la etiqueta de sección "02/ HERO", un `<h1>` único con el titular del brief, el subtítulo verbatim del brief y los dos CTAs. El `<h1>` SHALL ser el único encabezado de nivel 1 de la página. La microcopy "Respuesta en menos de 24 h · Remoto LATAM · Internacional" NO SHALL renderizarse en el hero (queda consolidada en el cierre, capability `landing-ctafinal`).

#### Scenario: Hero como primera sección

- **WHEN** se carga la página
- **THEN** el hero aparece inmediatamente después del navbar, como primera sección del `<main>`, con etiqueta, titular, subtítulo y CTAs en ese orden

#### Scenario: Titular único y verbatim

- **WHEN** se inspecciona el documento construido
- **THEN** existe exactamente un `<h1>` y su texto corresponde al titular del brief ("Sistemas que escalan. IA que produce. Sin el overhead de una agencia.")

#### Scenario: Microcopy consolidada en el cierre

- **WHEN** se inspecciona el hero construido
- **THEN** la cadena "Respuesta en menos de 24 h · Remoto LATAM · Internacional" no aparece en el hero

### Requirement: Panel visual blueprint

El panel visual SHALL construirse sobre el primitivo `Card` como shell y SHALL contener: rejilla blueprint, patrón de puntos y cuatro cruces (marcas de registro), sin anotaciones de instrumento ni identificadores inventados. NO SHALL incluir cifras, coordenadas ni datos de negocio inventados. El panel completo SHALL ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Composición del panel

- **WHEN** se renderiza el panel
- **THEN** muestra la rejilla blueprint, el patrón de puntos y las cuatro cruces, sin anotaciones de instrumento

#### Scenario: Sin anotaciones inventadas

- **WHEN** se busca en el HTML construido
- **THEN** las cadenas `INSTRUMENT`, `GRID 30` y `SE-01` no aparecen en el panel

#### Scenario: Sin datos de negocio inventados

- **WHEN** se revisan las anotaciones del panel
- **THEN** ninguna introduce métricas, clientes, certificaciones ni cifras de negocio nuevas

#### Scenario: Oculto para AT

- **WHEN** un lector de pantalla recorre la página
- **THEN** el panel completo (texturas, cruces e imagen) no se anuncia

### Requirement: Rediseño Precision Instrument del hero

El hero SHALL conservar el tratamiento "panel de instrumentos" del diseño aprobado: titular de escala masiva con tracking ajustado, franja inferior de lecturas métricas reales separadas por hairlines verticales (valores ya presentes en el contenido: `<500 ms`, `F1 0.99`, `<24 h`), tarjeta de instrumento con retícula de medición y reglas full-bleed coherentes con el sistema Precision Instrument. La etiqueta de la métrica `<500 ms` SHALL leerse "LATENCIA EN PRODUCCIÓN" (el valor es una latencia, no un acuerdo de nivel de servicio). La franja de métricas SHALL ser contenido real y NO SHALL marcarse como decorativa ni `aria-hidden`: las tecnologías de asistencia SHALL anunciar los valores y sus etiquetas. El titular SHALL quedar exento de la capa de animación (protección de LCP). El copy, el orden de elementos y los destinos de los CTAs NO SHALL alterarse.

#### Scenario: Panel de instrumentos aplicado

- **WHEN** se inspecciona el hero construido
- **THEN** existe la franja de métricas con hairlines y la tarjeta de instrumento, y las reglas full-bleed del sistema están presentes

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
