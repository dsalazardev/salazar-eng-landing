# Spec Delta: landing-base — Design Refresh v2

## ADDED Requirements

### Requirement: Sistema visual Precision Instrument

La landing SHALL aplicar el sistema visual "Precision Instrument" aprobado en Stitch (screen `ec9530dadcf14d0ca39554653a676d96`): reglas horizontales de 1px que cruzan la banda de borde a borde (full-bleed) separando secciones, retícula técnica visible como elemento de composición, profundidad por capas de superficie (papel → blanco → navy invertido) sin sombras ni gradientes decorativos, y datos y métricas tratados como elementos visuales de primer nivel. El sistema NO SHALL introducir colores fuera de los 6 tokens existentes ni fuentes nuevas, y las anotaciones técnicas decorativas SHALL quedar ocultas para tecnologías de asistencia.

#### Scenario: Reglas full-bleed y retícula

- **WHEN** se inspecciona el HTML/CSS construido de la landing
- **THEN** las secciones aparecen separadas por reglas de 1px que exceden el contenedor `max-w-6xl` y existe al menos una capa de retícula técnica visible como composición

#### Scenario: Layering sin sombras ni gradientes

- **WHEN** se inspecciona el CSS construido
- **THEN** no aparecen `box-shadow` ni gradientes decorativos y la jerarquía visual se resuelve con bordes `line` y cambios de superficie

#### Scenario: Paleta y tipografías intactas

- **WHEN** se revisa el CSS construido
- **THEN** solo existen los 6 tokens de la paleta y las 2 familias self-hosted, sin tokens ni fuentes nuevas

### Requirement: Capa de animación global con Anime.js

La landing SHALL incorporar una única capa de animación global basada en Anime.js (v4, ya instalada), cargada como módulo externo diferido que NO SHALL formar parte de la carga inicial crítica ni bloquear el render. La capa SHALL limitarse a movimiento sutil: entradas fade+rise al entrar en viewport, trazo progresivo de hairlines, hover de cards (cambio de tono de borde y elevación mínima), transiciones de CTAs y conteo de métricas una sola vez. Las animaciones SHALL usar duraciones de 150–250 ms con easing de salida suave, animar solo `transform` y `opacity`, NO SHALL ejecutarse en bucle y NO SHALL aplicarse al titular del hero (LCP). Con `prefers-reduced-motion: reduce`, toda animación SHALL desactivarse y el contenido SHALL quedar visible en su estado final.

#### Scenario: Movimiento reducido respetado

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** no se ejecuta ninguna animación de la capa (ni conteos, ni trazos, ni entradas) y todo el contenido permanece visible en su estado final

#### Scenario: Carga inicial intacta

- **WHEN** se inspecciona el HTML construido
- **THEN** el módulo de animación es un chunk externo diferido y la carga inicial crítica (scripts inline) sigue por debajo de 10 KB

#### Scenario: LCP protegido

- **WHEN** se carga la página
- **THEN** el titular del hero no recibe animación de entrada y el módulo de animación no bloquea el render

#### Scenario: Presupuesto del módulo medido

- **WHEN** se inspecciona el build
- **THEN** el chunk del módulo de animación (Anime.js + wrapper) queda hasheado en `dist/_astro/` y su peso gzip queda registrado (objetivo ≤ 15 KB)

## MODIFIED Requirements

### Requirement: Build estático con presupuesto de JavaScript

`pnpm build` SHALL completar y producir HTML estático cuya carga inicial SHALL mantenerse por debajo de 10 KB de JavaScript — el script inline del navbar más el loader de islas de Astro cuando existan islas — difiriendo cualquier runtime de framework hasta que su isla entre en el viewport (`client:visible`) y difiriendo también la capa de animación global como módulo externo; el CSS construido SHALL incluir los tokens y utilidades generados desde el tema, incluidas las utilidades del sistema Precision Instrument.

#### Scenario: Carga inicial bajo presupuesto

- **WHEN** se inspecciona el HTML construido con islas diferidas
- **THEN** la carga inicial incluye únicamente los scripts inline (navbar y loader de islas) sumando menos de 10 KB

#### Scenario: Runtimes de islas diferidos

- **WHEN** una isla hidratada con `client:visible` está fuera del viewport inicial
- **THEN** el runtime del framework no forma parte de la carga inicial y se descarga solo al acercarse al viewport

#### Scenario: Módulo de animación diferido

- **WHEN** se inspecciona el HTML construido
- **THEN** el módulo de animación no es un script inline ni bloqueante y se carga como chunk externo después de la carga inicial
