# landing-hero Specification

## Purpose

Define la primera sección de la landing: propuesta de valor textual con dual CTA, micro-prueba y panel visual blueprint con isotipo real, responsive y optimizada como candidata a LCP.

## Requirements

### Requirement: Primera sección con propuesta de valor

El hero SHALL ser la primera sección dentro de `<main>` y SHALL mostrar, en este orden: la etiqueta de sección "02/ HERO", un `<h1>` único con el titular del brief, el subtítulo verbatim del brief, los dos CTAs y la micro-prueba. El `<h1>` SHALL ser el único encabezado de nivel 1 de la página.

#### Scenario: Hero como primera sección

- **WHEN** se carga la página
- **THEN** el hero aparece inmediatamente después del navbar, como primera sección del `<main>`, con etiqueta, titular, subtítulo, CTAs y micro-prueba en ese orden

#### Scenario: Titular único y verbatim

- **WHEN** se inspecciona el documento construido
- **THEN** existe exactamente un `<h1>` y su texto corresponde al titular del brief ("Sistemas que escalan. IA que produce. Sin el overhead de una agencia.")

### Requirement: Layout responsive del hero

El hero SHALL usar un contenedor alineado con la retícula del navbar (`max-w-6xl` con padding lateral progresivo), SHALL distribuir texto y panel en un grid de 12 columnas (texto 7 / panel 5) en `lg`, SHALL apilarse en una sola columna en viewports menores y SHALL ocupar al menos el primer viewport en `lg` descontando la altura del navbar.

#### Scenario: Dos columnas en desktop

- **WHEN** el viewport es `lg` o mayor
- **THEN** el texto ocupa 7 columnas y el panel 5, y el hero cubre al menos el primer viewport descontando los 4 rem del navbar

#### Scenario: Una columna en móvil sin overflow

- **WHEN** el viewport es menor a `lg` (hasta 320 px)
- **THEN** el contenido se apila (texto → CTAs → micro-prueba → panel) sin desbordamiento horizontal

### Requirement: Panel visual blueprint

El panel visual SHALL construirse sobre el primitivo `Card` como shell y SHALL contener: rejilla blueprint, patrón de puntos, cuatro cruces y exactamente dos anotaciones reales ("SE-01 / ISOTIPO" y "GRID 30"). No SHALL incluir cifras, coordenadas ni datos decorativos inventados. El panel completo SHALL ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Composición del panel

- **WHEN** se renderiza el panel
- **THEN** muestra la rejilla blueprint, el patrón de puntos, cuatro cruces y exactamente las dos anotaciones definidas

#### Scenario: Oculto para AT

- **WHEN** un lector de pantalla recorre la página
- **THEN** el panel completo (texturas, anotaciones e imagen) no se anuncia

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

El hero SHALL añadir 0 islas hidratadas y ningún script. El único JavaScript del sitio SHALL seguir siendo el micro-script inline del navbar. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay `client:*` ni scripts de islas y el único `<script>` sigue siendo el inline del navbar

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
