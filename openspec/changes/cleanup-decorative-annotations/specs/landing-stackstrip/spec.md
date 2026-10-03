# Spec Delta: landing-stackstrip — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Franja de validación tras el hero

La franja SHALL ser la sección inmediatamente posterior al hero y SHALL contener un encabezado con la etiqueta de sección "03/ ECOSISTEMA TÉCNICO" y el subtítulo "Tecnología seleccionada por rendimiento y escalabilidad."; NO SHALL renderizar el `<h2>` "STACK DE PRODUCCIÓN" (redundante con la etiqueta de sección). Le sigue una cuadrícula técnica full-bleed de celdas que cruza la banda con las reglas del sistema Precision Instrument.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la franja es la sección inmediatamente posterior al hero y muestra la etiqueta "03/ ECOSISTEMA TÉCNICO" y el subtítulo, sin el h2 "STACK DE PRODUCCIÓN"

#### Scenario: Sin h2 redundante

- **WHEN** se inspecciona la franja construida
- **THEN** la cadena "STACK DE PRODUCCIÓN" no aparece en la franja

#### Scenario: Cinta full-bleed

- **WHEN** se renderiza a cualquier ancho de viewport
- **THEN** la cuadrícula cruza la banda de borde a borde con las reglas y la retícula del sistema
