# Spec Delta: landing-base — Choreografía de animación Slow & Elegant

## MODIFIED Requirements

### Requirement: Capa de animación global con Anime.js

La landing SHALL incorporar una única capa de animación global basada en Anime.js (v4, ya instalada), cargada como módulo externo diferido que NO SHALL formar parte de la carga inicial crítica ni bloquear el render. La capa SHALL limitarse a movimiento sutil: entradas fade+rise al entrar en viewport, asentamiento de tarjetas, trazo progresivo de hairlines (horizontales y verticales), hover de cards (cambio de tono de borde y elevación mínima), transiciones de CTAs y conteo de métricas una sola vez. Las animaciones SHALL usar una escala temporal escalonada — entradas de 560 ms (`fade`) y 640 ms (`fade-up-lg`/`fade-scale`), trazos de 720 ms (`draw`) y 820 ms (`draw-v`), conteo de 1100 ms, y listas con paso de 90 ms por elemento — con easings de salida suave (`outQuart`, `outExpo` o `cubicBezier(0.22, 1, 0.36, 1)`). La capa SHALL exponer el vocabulario declarativo `fade`, `fade-up-lg`, `fade-scale`, `draw`, `draw-v`, `count`, `stagger-list` y `stack-power`, y SHALL leer sus modificadores `data-motion-delay` y `data-motion-stagger` directamente del DOM. Las animaciones SHALL animar solo `transform` y `opacity`, NO SHALL animar `filter`/`blur`, NO SHALL ejecutarse en bucle y NO SHALL aplicarse al titular del hero ni a contenido del hero situado por encima del pliegue (protección de LCP). Con `prefers-reduced-motion: reduce`, toda animación SHALL desactivarse y el contenido SHALL quedar visible en su estado final.

#### Scenario: Movimiento reducido respetado

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** no se ejecuta ninguna animación de la capa (ni conteos, ni trazos, ni entradas, ni stagger) y todo el contenido permanece visible en su estado final

#### Scenario: Carga inicial intacta

- **WHEN** se inspecciona el HTML construido
- **THEN** el módulo de animación es un chunk externo y la carga inicial crítica (scripts inline) sigue por debajo de 10 KB

#### Scenario: LCP protegido

- **WHEN** se carga la página
- **THEN** el titular del hero y el contenido del hero por encima del pliegue no reciben animación de entrada, y el módulo de animación no bloquea el render

#### Scenario: Presupuesto del módulo medido

- **WHEN** se inspecciona el build
- **THEN** el chunk del módulo de animación (Anime.js + wrapper) queda hasheado en `dist/_astro/` y su peso gzip queda registrado (objetivo ≤ 15 KB)

#### Scenario: Escala temporal escalonada aplicada

- **WHEN** se inspecciona el build y se revisan las constantes de tiempo del módulo de animación
- **THEN** las entradas usan 560/640 ms, los trazos 720/820 ms, el conteo 1100 ms y el stagger de listas 90 ms por elemento, con easings de salida suave

#### Scenario: Cobertura declarativa por sección

- **WHEN** se inspecciona el HTML construido
- **THEN** las secciones de Servicios, ProofOfWork, Process, Founder, LeadMagnet, FAQ, CtaFinal, Footer, ProblemSolution y la cuadrícula de Stack exponen hooks `data-motion` en su contenido (no solo en el wrapper), de modo que la entrada se revele en orden de lectura

#### Scenario: Sin bucles ni filtros costosos

- **WHEN** se inspecciona el módulo de animación
- **THEN** no existen animaciones en bucle ni propiedades distintas de `transform` y `opacity`

## ADDED Requirements

### Requirement: Pulse de aterrizaje en anclas

La navegación por anclas internas del navbar SHALL conservar el desplazamiento suave nativo (`scroll-behavior: smooth`, ya condicionado a `prefers-reduced-motion: no-preference`) y NO SHALL usar la View Transitions API. Al activar un enlace de ancla, la capa de animación SHALL registrar el destino y, cuando la sección destino entre en el viewport, SHALL reproducir un "pulse" de aterrizaje que re-traza su hairline (`draw`) y re-hace el fade de su etiqueta de sección, sin volver a ocultar ni re-animar el contenido de la sección. El interceptor de clics SHALL vivir dentro del módulo de animación diferido y NO SHALL añadir un script inline nuevo: la carga inicial SHALL conservar exactamente los 3 scripts inline existentes. Con `prefers-reduced-motion: reduce`, el pulse SHALL desactivarse.

#### Scenario: Aterrizaje sin transición de página

- **WHEN** el usuario activa un enlace del navbar hacia `#servicios`, `#casos`, `#proceso`, `#faq` o `#contacto`
- **THEN** el desplazamiento es el smooth scroll nativo y, al llegar, el hairline de la sección destino se re-traza y su etiqueta hace fade una sola vez, sin transición de página completa

#### Scenario: Sin scripts inline nuevos

- **WHEN** se inspecciona el HTML construido
- **THEN** existen exactamente los 3 scripts inline de siempre (navbar, loader de directiva y runtime de islas) y el interceptor de anclas no forma parte de ellos

#### Scenario: Contenido no se re-anima

- **WHEN** el pulse de aterrizaje se dispara en una sección ya revelada
- **THEN** solo se re-traza el hairline y se re-hace el fade de la etiqueta; el contenido de la sección permanece visible y legible

#### Scenario: Pulse desactivado con movimiento reducido

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** no se registra ni se reproduce el pulse de aterrizaje
