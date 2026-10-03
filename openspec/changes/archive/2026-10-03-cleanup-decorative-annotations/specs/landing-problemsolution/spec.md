# Spec Delta: landing-problemsolution — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Rediseño Precision Instrument del ledger de diagnóstico

La sección SHALL conservar el tratamiento de "matriz de diagnóstico" del diseño aprobado: reglas full-bleed del sistema Precision Instrument y la textura blueprint existente, sin etiquetas de resolución decorativas (las etiquetas `RESOLUCIÓN 01/02/03` quedan eliminadas). Las 3 citas y las 3 respuestas NO SHALL alterarse y NO SHALL añadirse iconos, badges, flechas ni CTA.

#### Scenario: Matriz de diagnóstico aplicada

- **WHEN** se inspecciona la sección construida
- **THEN** las reglas full-bleed están presentes sobre la estructura de 3 pares y no hay etiquetas de resolución

#### Scenario: Sin etiquetas de resolución

- **WHEN** se busca en el HTML construido de la sección
- **THEN** la cadena "RESOLUCIÓN" no aparece

#### Scenario: Copy y no-añadidos intactos

- **WHEN** se revisa el contenido de la sección
- **THEN** las 3 citas y respuestas coinciden verbatim y no aparecen iconos, badges, flechas ni botones
