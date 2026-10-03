# Spec Delta: landing-services — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del bento de servicios

La sección SHALL adoptar el tratamiento "bento console" del diseño aprobado: reglas full-bleed del sistema Precision Instrument, jerarquía interna reforzada por tarjeta (código → título → promesa), la métrica `<500 ms` presentada como lectura de instrumento y el CTA secundario anclado a una línea base común. El copy de las 3 tarjetas (títulos, promesas, entregables, slots y CTA) NO SHALL alterarse y NO SHALL añadirse iconos.

#### Scenario: Bento console aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** las tarjetas mantienen su anatomía con la jerarquía reforzada, la métrica como lectura destacada y las reglas full-bleed presentes

#### Scenario: Copy intacto

- **WHEN** se revisa el contenido de las 3 tarjetas
- **THEN** títulos, promesas, entregables, slots y CTA coinciden verbatim con el copy existente

## MODIFIED Requirements

### Requirement: Sección de oferta tras el reconocimiento

La sección SHALL ser la inmediatamente posterior a la de problema/solución y SHALL mostrar un encabezado con la etiqueta "05/ SERVICIOS" y un `<h2>` "Servicios de Ingeniería Especializada" (título embellecido aceptado como decisión de diseño), seguido del bento de los 3 servicios.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la de problema/solución y muestra la etiqueta "05/ SERVICIOS" y el h2 "Servicios de Ingeniería Especializada"

### Requirement: Shell de tarjeta y tono

Las celdas SHALL construirse sobre el primitivo `Card` (borde `line`, fondo blanco); la capa global de animación PUEDE aportar el hover de tarjeta (cambio de tono de borde y elevación mínima) como affordance sutil. La tarjeta del servicio ① SHALL tener mayor padding en `lg`. La sección NO SHALL incluir iconos y NO SHALL usar `accent` como color estático (solo el hover del CTA outline y la capa de motion lo emplean).

#### Scenario: Shell sin affordance falsa

- **WHEN** se inspecciona una tarjeta en reposo y en hover
- **THEN** el reposo usa el estilo base de `Card` y el hover aporta únicamente un cambio sutil de borde/tono

#### Scenario: Cero iconos y accent estático

- **WHEN** se revisa la sección
- **THEN** no hay iconos y ningún elemento usa `accent` en estado estático

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript propio (sin islas ni scripts; la capa global de animación puede animar entradas y hovers de forma sutil). `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores
