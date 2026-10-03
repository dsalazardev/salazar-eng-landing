# Spec Delta: landing-problemsolution — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del ledger de diagnóstico

La sección SHALL adoptar el tratamiento de "matriz de diagnóstico" del diseño aprobado: reglas full-bleed del sistema Precision Instrument, etiquetas técnicas de resolución en las respuestas (anotaciones decorativas aceptadas) y la textura blueprint existente conservada. Las 3 citas y las 3 respuestas NO SHALL alterarse y NO SHALL añadirse iconos, badges, flechas ni CTA.

#### Scenario: Matriz de diagnóstico aplicada

- **WHEN** se inspecciona la sección construida
- **THEN** las reglas full-bleed y las etiquetas técnicas decorativas de resolución están presentes sobre la estructura de 3 pares

#### Scenario: Copy y no-añadidos intactos

- **WHEN** se revisa el contenido de la sección
- **THEN** las 3 citas y respuestas coinciden verbatim y no aparecen iconos, badges, flechas ni botones

## MODIFIED Requirements

### Requirement: Sin JavaScript nuevo y estilos aislados

La sección SHALL añadir 0 JavaScript propio (sin islas ni scripts; la capa global de animación puede animar su entrada de forma sutil) y SHALL mantener sus estilos específicos (la máscara de la textura) en un bloque de estilos del propio componente con clases namespaced `problem-*`. `global.css` PUEDE ganar utilidades del sistema Precision Instrument, pero los tokens existentes NO SHALL alterarse.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección y su único JavaScript indirecto es el módulo global diferido

#### Scenario: global.css intacto

- **WHEN** se revisa el CSS construido y el repositorio
- **THEN** la máscara vive en clases `problem-*` del componente, `global.css` conserva sus definiciones existentes (las utilidades del sistema son aditivas) y los 6 tokens mantienen sus valores
