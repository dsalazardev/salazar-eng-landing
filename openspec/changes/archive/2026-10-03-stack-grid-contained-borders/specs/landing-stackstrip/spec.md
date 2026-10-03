# Spec Delta: landing-stackstrip — Cuadrícula contenida y enmarcada

## ADDED Requirements

### Requirement: Franja de validación tras el hero con cuadrícula contenida

La franja SHALL ser la sección inmediatamente posterior al hero y SHALL contener un encabezado con la etiqueta de sección "03/ ECOSISTEMA TÉCNICO" y el subtítulo "Tecnología seleccionada por rendimiento y escalabilidad."; NO SHALL renderizar el `<h2>` "STACK DE PRODUCCIÓN" (redundante con la etiqueta de sección). Le sigue una cuadrícula técnica contenida (`mx-auto max-w-6xl` con padding lateral) y enmarcada con las reglas del sistema Precision Instrument.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la franja es la sección inmediatamente posterior al hero y muestra la etiqueta "03/ ECOSISTEMA TÉCNICO" y el subtítulo, sin el h2 "STACK DE PRODUCCIÓN"

#### Scenario: Sin h2 redundante

- **WHEN** se inspecciona la franja construida
- **THEN** la cadena "STACK DE PRODUCCIÓN" no aparece en la franja

#### Scenario: Cuadrícula contenida y enmarcada

- **WHEN** se renderiza a cualquier ancho de viewport
- **THEN** la cuadrícula vive dentro del contenedor `max-w-6xl` con padding lateral y queda enmarcada por reglas `line` en sus cuatro lados, sin desbordar el contenedor

## MODIFIED Requirements

### Requirement: Cuadrícula técnica de celdas

La franja SHALL presentar una cuadrícula técnica de celdas contenida y enmarcada, coherente con el sistema Precision Instrument: un wrapper externo SHALL aportar únicamente el posicionamiento y el padding lateral (`mx-auto max-w-6xl` con padding), y la retícula interna SHALL aportar la estructura y los bordes `line` (`border-t` y `border-l` en el contenedor de la retícula; `border-r` y `border-b` en bandas de categoría y celdas), cerrando la tabla por sus cuatro lados sin dobles líneas. Las 16 tecnologías SHALL presentarse como celdas de una retícula rígida, con una lista semántica real como base y anotaciones técnicas decorativas ocultas para tecnologías de asistencia. La cuadrícula NO SHALL producir scroll horizontal entre 320 y 1440 px, NO SHALL añadir JavaScript propio (la capa global de animación puede animar su entrada de forma sutil) y SHALL mantener CLS 0.

#### Scenario: Cuadrícula sin scroll horizontal

- **WHEN** se mide el documento a cualquier ancho entre 320 y 1440 px
- **THEN** la cuadrícula no produce scroll horizontal y el layout se mantiene estable

#### Scenario: Lista semántica y anotaciones decorativas

- **WHEN** un lector de pantalla recorre la franja
- **THEN** anuncia una única lista con las 16 tecnologías y no anuncia las anotaciones técnicas decorativas

#### Scenario: Sin JavaScript propio

- **WHEN** se inspecciona el HTML construido
- **THEN** la franja no añade scripts ni islas propias

## REMOVED Requirements

### Requirement: Franja de validación tras el hero

**Reason**: El requisito se reformula para documentar la cuadrícula contenida y enmarcada; el scenario "Cinta full-bleed" queda obsoleto porque la cuadrícula ya no cruza la banda de borde a borde, y el renombre de scenarios no es expresable dentro de un bloque MODIFIED.

**Migration**: El mismo contenido se re-añade en este delta (sección ADDED) bajo el nombre "Franja de validación tras el hero con cuadrícula contenida", con la descripción y los scenarios actualizados; no hay consumidores externos que migrar.
