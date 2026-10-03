# Spec Delta: landing-founder — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Rediseño Precision Instrument del dossier del fundador

La sección SHALL conservar el tratamiento de "dossier editorial técnico" del diseño aprobado: retrato con marco `border-line` y cruces `+` en las esquinas (marcas de registro), bio y cita con jerarquía editorial y credenciales como fichas técnicas, sin etiquetas de instrumento inventadas (la etiqueta `PLATE 08 // RETRATO` queda eliminada). La bio, la cita, el cierre, las credenciales y el retrato NO SHALL alterarse en contenido ni tratamiento base (grayscale, encuadre 4:5).

#### Scenario: Dossier aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** el retrato conserva grayscale, encuadre y marco con cruces, y el contenido editorial presenta la jerarquía del dossier

#### Scenario: Sin metadatos de instrumento

- **WHEN** se busca en el HTML construido de la sección
- **THEN** la cadena "PLATE 08" no aparece

#### Scenario: Contenido intacto

- **WHEN** se revisa la sección
- **THEN** bio, cita, cierre y las 3 credenciales coinciden verbatim con el contenido existente
