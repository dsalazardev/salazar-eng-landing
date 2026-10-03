# Spec Delta: landing-stackstrip — Design Refresh v2

## ADDED Requirements

### Requirement: Cuadrícula técnica de celdas

La franja SHALL sustituir la cinta animada por una cuadrícula técnica de celdas (full-bleed) coherente con el sistema Precision Instrument: las 16 tecnologías SHALL presentarse como celdas de una retícula rígida, con una lista semántica real como base y anotaciones técnicas decorativas ocultas para tecnologías de asistencia. La cuadrícula NO SHALL producir scroll horizontal entre 320 y 1440 px, NO SHALL añadir JavaScript propio (la capa global de animación puede animar su entrada de forma sutil) y SHALL mantener CLS 0.

#### Scenario: Cuadrícula sin scroll horizontal

- **WHEN** se mide el documento a cualquier ancho entre 320 y 1440 px
- **THEN** la cuadrícula no produce scroll horizontal y el layout se mantiene estable

#### Scenario: Lista semántica y anotaciones decorativas

- **WHEN** un lector de pantalla recorre la franja
- **THEN** anuncia una única lista con las 16 tecnologías y no anuncia las anotaciones técnicas decorativas

#### Scenario: Sin JavaScript propio

- **WHEN** se inspecciona el HTML construido
- **THEN** la franja no añade scripts ni islas propias

## MODIFIED Requirements

### Requirement: Franja de validación tras el hero

La franja SHALL ser la sección inmediatamente posterior al hero y SHALL contener un encabezado con la etiqueta de sección "03/ STACK", un `<h2>` visible "STACK DE PRODUCCIÓN" y la tagline en italic "Tecnología elegida por resultados, no por moda.", seguida de una cuadrícula técnica full-bleed de celdas que cruza la banda con las reglas del sistema Precision Instrument.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la franja es la sección inmediatamente posterior al hero y muestra la etiqueta "03/ STACK", el h2 "STACK DE PRODUCCIÓN" y la tagline en italic

#### Scenario: Cinta full-bleed

- **WHEN** se renderiza a cualquier ancho de viewport
- **THEN** la cuadrícula cruza la banda de borde a borde con las reglas y la retícula del sistema

### Requirement: Contenido del stack

La franja SHALL mostrar exactamente las 16 tecnologías del brief en su orden y verbatim: Angular, React, NestJS, Spring Boot, Node.js, PHP, Python / FastAPI, PostgreSQL, MongoDB, AWS, Docker, Terraform, Pulumi, LangChain, Ollama, n8n. Las celdas PUEDEN incluir anotaciones técnicas de grupo o rol (decisión de diseño aceptada) siempre que sean decorativas y no alteren los nombres. No SHALL añadirse tecnologías nuevas.

#### Scenario: Las 16 exactas en orden

- **WHEN** se inspecciona la lista de la cuadrícula
- **THEN** contiene exactamente las 16 cadenas del brief, en su orden, sin tecnologías añadidas

#### Scenario: Primitivo reutilizado

- **WHEN** se revisan las celdas
- **THEN** cada tecnología conserva su nombre verbatim y las celdas mantienen el lenguaje visual de etiquetas mono con borde `line` sin colores ni estilos nuevos

### Requirement: Integración y verificación

La franja SHALL montarse en la página inmediatamente después del hero, exponer `id="stack"` y no alterar el contrato de anclas del navbar. `pnpm astro check` SHALL terminar con 0 errores y el build SHALL verificarse por inspección del HTML/CSS resultante (cuadrícula presente, sin keyframes de marquee, sin JavaScript propio de la franja), con la pasada humana de la cuadrícula y del responsive documentada como verificación pendiente del dueño.

#### Scenario: Integración sin romper contratos

- **WHEN** se inspecciona la página construida
- **THEN** `#stack` aparece inmediatamente después del hero y los destinos del navbar siguen siendo los del contrato de anclas

#### Scenario: Verificaciones automatizadas limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y la inspección confirma la cuadrícula sin keyframes de marquee y sin JS propio

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma la cuadrícula en desktop y móvil y la ausencia de desbordamientos entre 320 y 1440 px

## REMOVED Requirements

### Requirement: Cinta continua sin salto y sin JavaScript

**Reason**: El rediseño aprobado (Precision Instrument) sustituye la cinta animada por una cuadrícula técnica estática; ya no existe bucle infinito que reiniciar.

**Migration**: La lista de las 16 tecnologías se conserva íntegra en la cuadrícula; no hay migración de datos ni de contratos.

### Requirement: Pausas accesibles

**Reason**: Al desaparecer la animación continua de la cinta, el control de pausa y las pausas por cursor/foco dejan de tener objeto.

**Migration**: `prefers-reduced-motion` se mantiene cubierto por la política global de animación de `landing-base`; la cuadrícula es estática por defecto.

### Requirement: Accesibilidad estructural

**Reason**: La estructura de dos copias (original + duplicada) y el control de pausa desaparecen con la cinta; la nueva cuadrícula define su propia semántica.

**Migration**: La cuadrícula usa una única lista semántica real; el requisito "Cuadrícula técnica de celdas" cubre la semántica y las anotaciones decorativas.

### Requirement: Rendimiento y estabilidad visual

**Reason**: Los requisitos de animación en compositor, máscaras y copias de la cinta ya no aplican a una cuadrícula estática.

**Migration**: El requisito "Cuadrícula técnica de celdas" conserva las garantías equivalentes (sin scroll horizontal, CLS 0, sin JS propio).
