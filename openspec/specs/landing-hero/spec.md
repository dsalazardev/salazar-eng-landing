# landing-hero Specification

## Purpose

Define la primera sección de la landing: propuesta de valor textual con dual CTA, micro-prueba y panel visual blueprint con isotipo real, responsive y optimizada como candidata a LCP.

## Requirements

### Requirement: Primera sección con propuesta de valor

El hero SHALL ser la primera sección dentro de `<main>` y SHALL mostrar, en este orden: la etiqueta de sección "02/ HERO", un `<h1>` único con el titular del brief, el subtítulo verbatim del brief y los dos CTAs. El `<h1>` SHALL ser el único encabezado de nivel 1 de la página. La microcopy "Respuesta en menos de 24 h · Remoto LATAM · Internacional" NO SHALL renderizarse en el hero (queda consolidada en el cierre, capability `landing-ctafinal`).

#### Scenario: Hero como primera sección

- **WHEN** se carga la página
- **THEN** el hero aparece inmediatamente después del navbar, como primera sección del `<main>`, con etiqueta, titular, subtítulo y CTAs en ese orden

#### Scenario: Titular único y verbatim

- **WHEN** se inspecciona el documento construido
- **THEN** existe exactamente un `<h1>` y su texto corresponde al titular del brief ("Sistemas que escalan. IA que produce. Sin el overhead de una agencia.")

#### Scenario: Microcopy consolidada en el cierre

- **WHEN** se inspecciona el hero construido
- **THEN** la cadena "Respuesta en menos de 24 h · Remoto LATAM · Internacional" no aparece en el hero

### Requirement: Layout responsive del hero

El hero SHALL usar un contenedor alineado con la retícula del navbar (`max-w-6xl` con padding lateral progresivo), SHALL distribuir texto y panel en un grid de 12 columnas (texto 7 / panel 5) en `lg`, SHALL apilarse en una sola columna en viewports menores y SHALL ocupar al menos el primer viewport en `lg` descontando la altura del navbar.

#### Scenario: Dos columnas en desktop

- **WHEN** el viewport es `lg` o mayor
- **THEN** el texto ocupa 7 columnas y el panel 5, y el hero cubre al menos el primer viewport descontando los 4 rem del navbar

#### Scenario: Una columna en móvil sin overflow

- **WHEN** el viewport es menor a `lg` (hasta 320 px)
- **THEN** el contenido se apila (texto → CTAs → micro-prueba → panel) sin desbordamiento horizontal

### Requirement: Panel visual blueprint

El panel visual SHALL construirse sobre el primitivo `Card` como shell y SHALL contener: rejilla blueprint, patrón de puntos y cuatro cruces (marcas de registro), sin anotaciones de instrumento ni identificadores inventados. NO SHALL incluir cifras, coordenadas ni datos de negocio inventados. El panel completo SHALL ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Composición del panel

- **WHEN** se renderiza el panel
- **THEN** muestra la rejilla blueprint, el patrón de puntos y las cuatro cruces, sin anotaciones de instrumento

#### Scenario: Sin anotaciones inventadas

- **WHEN** se busca en el HTML construido
- **THEN** las cadenas `INSTRUMENT`, `GRID 30` y `SE-01` no aparecen en el panel

#### Scenario: Sin datos de negocio inventados

- **WHEN** se revisan las anotaciones del panel
- **THEN** ninguna introduce métricas, clientes, certificaciones ni cifras de negocio nuevas

#### Scenario: Oculto para AT

- **WHEN** un lector de pantalla recorre la página
- **THEN** el panel completo (texturas, cruces e imagen) no se anuncia

### Requirement: Isotipo optimizado

El panel SHALL mostrar el isotipo SE como imagen local procesada por el pipeline de assets del proyecto, con dimensiones explícitas, salida optimizada (WebP hasheado), carga anticipada y sin prioridad alta de fetch. El componente SHALL dejar registrado el TODO de reemplazo por el SVG definitivo cuando se exporte.

#### Scenario: Imagen optimizada y acotada

- **WHEN** se inspecciona el HTML y el asset construido
- **THEN** la imagen es un asset local hasheado con `width`/`height` explícitos, `loading="eager"` y sin `fetchpriority`

#### Scenario: TODO de swap registrado

- **WHEN** se revisa el componente del hero
- **THEN** existe un comentario TODO que indica reemplazar el isotipo optimizado por el SVG definitivo

### Requirement: CTAs del hero

El hero SHALL incluir dos CTAs con el copy del brief: primario "Agendar diagnóstico gratuito · 20 min" hacia `#contacto` (con etiqueta corta "Agendar diagnóstico · 20 min" en viewports menores a `sm`) y secundario "Ver casos de estudio →" hacia `#casos`. Ambos SHALL usar el primitivo `Button` en tamaño grande; en móvil SHALL ocupar el ancho completo en columna y en desktop SHALL mantener la jerarquía relleno (primario) vs contorno (secundario).

#### Scenario: Copy y destinos

- **WHEN** se renderizan los CTAs en desktop
- **THEN** el primario muestra el copy completo del brief y apunta a `#contacto`, y el secundario muestra "Ver casos de estudio →" y apunta a `#casos`

#### Scenario: Etiqueta corta en pantallas pequeñas

- **WHEN** el viewport es menor a `sm`
- **THEN** el CTA primario muestra la etiqueta corta "Agendar diagnóstico · 20 min"

#### Scenario: Full-width y jerarquía

- **WHEN** se renderiza en móvil y en desktop
- **THEN** en móvil ambos CTAs ocupan el ancho completo apilados y en desktop conservan la jerarquía relleno (primario) vs contorno (secundario)

### Requirement: Cero JavaScript nuevo

El hero SHALL seguir añadiendo 0 islas hidratadas y ningún script propio; la única capa de JavaScript que puede animar el hero es el módulo global de animación diferido (sistema Precision Instrument), que NO SHALL aplicarse al titular. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS propio

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay `client:*` ni scripts de islas asociados al hero y su único JavaScript indirecto es el módulo global diferido

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Integración sin romper el shell

El hero SHALL montarse en la página tras el slot del navbar y SHALL retirar el smoke test del M00. La sección SHALL exponer `id="hero"` y el contrato de anclas del navbar (`#servicios`, `#casos`, `#proceso`, `#faq`, `#contacto`) SHALL permanecer intacto.

#### Scenario: Montaje y limpieza

- **WHEN** se inspecciona la página construida
- **THEN** `<section id="hero">` es la primera sección del `<main>` y no queda contenido del smoke test del M00

#### Scenario: Anclas intactas

- **WHEN** se revisan los enlaces del navbar
- **THEN** sus destinos siguen siendo exactamente los del contrato de anclas

### Requirement: Verificación de aceptación del hero

El hero SHALL verificarse en preview: métrica de LCP registrada (el titular como candidato, sin JavaScript nuevo que lo retrase), accesibilidad comprobada (encabezado único, contraste AA, foco visible, panel decorativo oculto) y barrido responsive de 320 a 1440 px sin desbordamientos.

#### Scenario: LCP medido

- **WHEN** se ejecuta la medición de rendimiento en preview
- **THEN** se registra el LCP del titular y no se introduce JavaScript ni recurso bloqueante que lo retrase

#### Scenario: A11y y responsive verificados

- **WHEN** se auditan accesibilidad y responsive
- **THEN** hay un solo `<h1>`, contrastes AA, foco visible en ambos CTAs, panel oculto para AT y ningún desbordamiento horizontal entre 320 y 1440 px

### Requirement: Rediseño Precision Instrument del hero

El hero SHALL conservar el tratamiento "panel de instrumentos" del diseño aprobado: titular de escala masiva con tracking ajustado, franja inferior de lecturas métricas reales separadas por hairlines adaptativos (horizontales entre las filas apiladas en móvil; verticales entre las 3 columnas desde `sm`; valores ya presentes en el contenido: `<500 ms`, `F1 0.99`, `<24 h`), tarjeta de instrumento con retícula de medición y reglas full-bleed coherentes con el sistema Precision Instrument. La etiqueta de la métrica `<500 ms` SHALL leerse "LATENCIA EN PRODUCCIÓN" (el valor es una latencia, no un acuerdo de nivel de servicio). La franja de métricas SHALL ser contenido real y NO SHALL marcarse como decorativa ni `aria-hidden`: las tecnologías de asistencia SHALL anunciar los valores y sus etiquetas. El titular SHALL quedar exento de la capa de animación (protección de LCP). El copy, el orden de elementos y los destinos de los CTAs NO SHALL alterarse.

#### Scenario: Panel de instrumentos aplicado

- **WHEN** se inspecciona el hero construido
- **THEN** existe la franja de métricas con hairlines y la tarjeta de instrumento, y las reglas full-bleed del sistema están presentes

#### Scenario: Separadores adaptativos de la franja

- **WHEN** se renderiza la franja de métricas a cualquier ancho de viewport
- **THEN** en móvil las filas apiladas se separan con hairlines horizontales y desde `sm` las 3 columnas se separan con hairlines verticales, sin líneas huérfanas en ningún ancho

#### Scenario: Etiqueta de latencia corregida

- **WHEN** se inspecciona la franja de métricas
- **THEN** la etiqueta dice "LATENCIA EN PRODUCCIÓN" y la cadena "SLA EN PRODUCCIÓN" no aparece en el hero

#### Scenario: Métricas anunciadas para AT

- **WHEN** un lector de pantalla recorre el hero
- **THEN** anuncia `<500 ms`, `F1 0.99` y `<24 h` con sus etiquetas, y la franja no está oculta a tecnologías de asistencia

#### Scenario: Titular sin animación

- **WHEN** se carga la página
- **THEN** el `<h1>` no recibe animación de entrada y sigue siendo el candidato a LCP

#### Scenario: Métricas reales sin inventar

- **WHEN** se revisan las lecturas de la franja
- **THEN** sus valores provienen del contenido existente y no se añaden cifras nuevas
