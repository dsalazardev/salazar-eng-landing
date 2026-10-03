# Spec Delta: landing-navbar — Cleanup de anotaciones decorativas

## MODIFIED Requirements

### Requirement: Navbar como barra de instrumentación

El navbar SHALL conservar el tratamiento "barra de instrumentación" del diseño aprobado: la franja superior de estado SHALL mostrar únicamente el dato real de ubicación `LATAM / UTC-5` (decisión de diseño aceptada) y los 4 enlaces de ancla SHALL conservar sus índices mono, manteniendo intactos el wordmark, los destinos `#servicios`/`#casos`/`#proceso`/`#faq`, el CTA a `#contacto`, el comportamiento sticky, el menú móvil nativo y el contrato de accesibilidad. La franja NO SHALL incluir metadatos de instrumento inventados (los textos `SYS_STATUS: OPERATIONAL` y `CALIBRATED // SYS_2026` quedan eliminados) y SHALL permanecer oculta para tecnologías de asistencia.

#### Scenario: Franja de estado con dato real

- **WHEN** se inspecciona el navbar construido
- **THEN** la franja muestra únicamente `LATAM / UTC-5`, y los enlaces numerados, los destinos, el CTA, el sticky y el menú móvil conservan su comportamiento

#### Scenario: Barra de instrumentación sin romper contratos

- **WHEN** se inspecciona el navbar construido
- **THEN** existe la franja de estado decorativa y los enlaces numerados, y los destinos, el CTA, el sticky y el menú móvil conservan su comportamiento

#### Scenario: Sin metadatos inventados

- **WHEN** se busca en el HTML construido
- **THEN** las cadenas `SYS_STATUS` y `CALIBRATED` no aparecen en el navbar

#### Scenario: Anotaciones decorativas ocultas para AT

- **WHEN** un lector de pantalla recorre el navbar
- **THEN** no anuncia la franja de estado ni las anotaciones decorativas
