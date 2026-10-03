# Spec Delta: landing-process — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del timeline

La sección SHALL adoptar el tratamiento de "nodos conectados" del diseño aprobado: los 4 pasos mantienen su `<ol>` semántico y su numeración 01–04, con nodos y líneas de conexión reforzados como dispositivo de instrumentación (trazo sutil animable por la capa global). La sección sigue siendo 100 % tipográfica (sin iconos, imágenes ni CTA) y el copy de los 4 pasos NO SHALL alterarse.

#### Scenario: Nodos de instrumentación aplicados

- **WHEN** se inspecciona la sección construida
- **THEN** el timeline conserva el `<ol>` con 4 pasos y los nodos y líneas refuerzan el estilo de instrumentación

#### Scenario: Copy y no-añadidos intactos

- **WHEN** se revisa la sección
- **THEN** h2, tagline y las 4 descripciones coinciden verbatim y no aparecen iconos, imágenes ni CTA

## MODIFIED Requirements

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript propio (sin islas ni scripts; la capa global de animación puede animar la entrada y el trazo de nodos de forma sutil). `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar. NO SHALL añadirse dependencias nuevas.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar la sección inmediatamente después de la de casos; el change SHALL verificarse por inspección directa del build (sin levantar preview): `id="proceso"` ×1, `href="#proceso"` ×2, h2/tagline/nombres presentes, numeración 01–04 y el rediseño de nodos aplicado; los 6 tokens conservan sus valores (las utilidades nuevas del sistema Precision Instrument en `global.css` están permitidas). Las comprobaciones visuales (timeline en desktop y móvil, densidad a 1024 px, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los textos, la numeración, el rediseño aplicado y los tokens intactos

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el timeline horizontal y el rail vertical, la densidad en 1024 px y la ausencia de desbordamientos entre 320 y 1440 px
