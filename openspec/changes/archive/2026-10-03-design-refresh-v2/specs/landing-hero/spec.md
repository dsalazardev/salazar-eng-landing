# Spec Delta: landing-hero — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del hero

El hero SHALL adoptar el tratamiento "panel de instrumentos" del diseño aprobado: titular de escala masiva con tracking ajustado, franja inferior de lecturas métricas reales separadas por hairlines verticales (valores ya presentes en el contenido: `<500 ms`, `F1 0.99`, `<24 h`), tarjeta de instrumento con retícula de medición y anotaciones técnicas decorativas, y reglas full-bleed coherentes con el sistema Precision Instrument. El titular SHALL quedar exento de la capa de animación (protección de LCP). El copy, el orden de elementos y los destinos de los CTAs NO SHALL alterarse.

#### Scenario: Panel de instrumentos aplicado

- **WHEN** se inspecciona el hero construido
- **THEN** existe la franja de métricas con hairlines y la tarjeta de instrumento, y las reglas full-bleed del sistema están presentes

#### Scenario: Titular sin animación

- **WHEN** se carga la página
- **THEN** el `<h1>` no recibe animación de entrada y sigue siendo el candidato a LCP

#### Scenario: Métricas reales sin inventar

- **WHEN** se revisan las lecturas de la franja
- **THEN** sus valores provienen del contenido existente y no se añaden cifras nuevas

## MODIFIED Requirements

### Requirement: Panel visual blueprint

El panel visual SHALL construirse sobre el primitivo `Card` como shell y SHALL contener: rejilla blueprint, patrón de puntos, cuatro cruces y anotaciones técnicas decorativas propias del estilo de instrumentación (incluidas cotas de calibración e identificadores como "SE-01 / ISOTIPO" o "GRID 30"), aceptadas como decisión de diseño. NO SHALL incluir cifras, coordenadas ni datos de negocio inventados. El panel completo SHALL ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Composición del panel

- **WHEN** se renderiza el panel
- **THEN** muestra la rejilla blueprint, el patrón de puntos, cuatro cruces y las anotaciones técnicas decorativas del estilo de instrumentación

#### Scenario: Oculto para AT

- **WHEN** un lector de pantalla recorre la página
- **THEN** el panel completo (texturas, anotaciones e imagen) no se anuncia

#### Scenario: Sin datos de negocio inventados

- **WHEN** se revisan las anotaciones del panel
- **THEN** ninguna introduce métricas, clientes, certificaciones ni cifras de negocio nuevas

### Requirement: Cero JavaScript nuevo

El hero SHALL seguir añadiendo 0 islas hidratadas y ningún script propio; la única capa de JavaScript que puede animar el hero es el módulo global de animación diferido (sistema Precision Instrument), que NO SHALL aplicarse al titular. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay `client:*` ni scripts de islas asociados al hero y su único JavaScript indirecto es el módulo global diferido

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores
