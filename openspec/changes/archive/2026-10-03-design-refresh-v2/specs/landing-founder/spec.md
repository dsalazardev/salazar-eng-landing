# Spec Delta: landing-founder — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del dossier del fundador

La sección SHALL adoptar el tratamiento de "dossier editorial técnico" del diseño aprobado: retrato tratado con marco de instrumentación (cruces y cotas decorativas aceptadas), bio y cita con jerarquía editorial y credenciales como fichas técnicas. La bio, la cita, el cierre, las credenciales y el retrato NO SHALL alterarse en contenido ni tratamiento base (grayscale, encuadre 4:5).

#### Scenario: Dossier aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** el retrato conserva grayscale y encuadre, y el contenido editorial presenta la jerarquía del dossier

#### Scenario: Contenido intacto

- **WHEN** se revisa la sección
- **THEN** bio, cita, cierre y las 3 credenciales coinciden verbatim con el contenido existente

## MODIFIED Requirements

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript propio (sin islas ni scripts; la capa global de animación puede animar su entrada de forma sutil). `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar. NO SHALL añadirse dependencias nuevas.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Verificación por inspección

El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="fundador"` ×1, lema h2, frase del título, "Sistemas y Computación" (×2: bio y credencial), credenciales, asset WebP hasheado de la foto y el rediseño de dossier aplicado; los 6 tokens conservan sus valores (las utilidades nuevas del sistema Precision Instrument en `global.css` están permitidas). Las comprobaciones visuales (encuadre 4:5, grayscale, marco con cruces, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el hook único, los textos fijados, el asset WebP, el rediseño aplicado y los tokens intactos

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el encuadre del retrato (rostro protegido), el grayscale, el marco con cruces y la ausencia de desbordamientos entre 320 y 1440 px
