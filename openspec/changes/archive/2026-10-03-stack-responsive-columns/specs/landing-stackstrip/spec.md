# Spec Delta: landing-stackstrip — Columnas responsivas sin solapamiento

## MODIFIED Requirements

### Requirement: Cuadrícula técnica de celdas

La franja SHALL presentar una cuadrícula técnica de celdas contenida y enmarcada, coherente con el sistema Precision Instrument: un wrapper externo SHALL aportar únicamente el posicionamiento y el padding lateral (`mx-auto max-w-6xl` con padding), y la retícula interna SHALL aportar la estructura y los bordes `line` (`border-t` y `border-l` en el contenedor de la retícula; `border-r` y `border-b` en bandas de categoría y celdas), cerrando la tabla por sus cuatro lados sin dobles líneas. Las 16 tecnologías SHALL presentarse como celdas de una retícula responsiva, con una lista semántica real como base y anotaciones técnicas decorativas ocultas para tecnologías de asistencia: las celdas SHALL apilarse a 1 columna en viewports menores a `sm`, distribuirse a 3 columnas desde `sm`, y los grupos de categoría SHALL apilarse a 1 columna hasta `lg` (2 columnas desde `lg`), de modo que ninguna celda desborde su contenido ni se solape con la vecina entre 320 y 1440 px. La cuadrícula NO SHALL producir scroll horizontal entre 320 y 1440 px, NO SHALL añadir JavaScript propio (la capa global de animación puede animar su entrada de forma sutil) y SHALL mantener CLS 0.

#### Scenario: Cuadrícula sin scroll horizontal

- **WHEN** se mide el documento a cualquier ancho entre 320 y 1440 px
- **THEN** la cuadrícula no produce scroll horizontal y el layout se mantiene estable

#### Scenario: Sin solapamiento entre celdas

- **WHEN** se mide cualquier celda a cualquier ancho entre 320 y 1440 px
- **THEN** el contenido de cada celda (icono + nombre) cabe dentro de su celda sin desbordar ni solaparse con la celda vecina, en las distribuciones de 1 y 3 columnas descritas

#### Scenario: Lista semántica y anotaciones decorativas

- **WHEN** un lector de pantalla recorre la franja
- **THEN** anuncia una única lista con las 16 tecnologías y no anuncia las anotaciones técnicas decorativas

#### Scenario: Sin JavaScript propio

- **WHEN** se inspecciona el HTML construido
- **THEN** la franja no añade scripts ni islas propias
