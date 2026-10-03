# Spec Delta: landing-faq — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Rediseño Precision Instrument del accordion

La sección SHALL conservar el tratamiento de "acordeón técnico" del diseño aprobado: banda blanca con reglas full-bleed del sistema Precision Instrument y filas del accordion con hairlines reforzados. La sección NO SHALL incluir texturas, corner marks, CTA propio ni metadatos de instrumento (la etiqueta `INDEX // FAQ_05` queda eliminada), y las 5 preguntas y respuestas NO SHALL alterarse.

#### Scenario: Acordeón técnico aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** las reglas full-bleed y los hairlines del accordion están presentes sin texturas, corner marks ni CTA

#### Scenario: Sin metadatos de instrumento

- **WHEN** se busca en el HTML construido de la sección
- **THEN** las cadenas `INDEX // FAQ_05` y `FAQ_05` no aparecen

#### Scenario: Copy intacto

- **WHEN** se revisan las 5 filas
- **THEN** preguntas y respuestas coinciden verbatim con el contenido existente
