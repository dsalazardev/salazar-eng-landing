# Spec Delta: landing-navbar — Design Refresh v2

## ADDED Requirements

### Requirement: Navbar como barra de instrumentación

El navbar SHALL adoptar el tratamiento "barra de instrumentación" del diseño aprobado: una franja superior de estado con anotaciones técnicas decorativas (decisión de diseño aceptada) y los 4 enlaces de ancla numerados con índices mono, manteniendo intactos el wordmark, los destinos `#servicios`/`#casos`/`#proceso`/`#faq`, el CTA a `#contacto`, el comportamiento sticky, el menú móvil nativo y el contrato de accesibilidad. Las anotaciones decorativas SHALL ser decorativas para tecnologías de asistencia y NO SHALL aportar información de negocio.

#### Scenario: Barra de instrumentación sin romper contratos

- **WHEN** se inspecciona el navbar construido
- **THEN** existe la franja de estado decorativa y los enlaces numerados, y los destinos, el CTA, el sticky y el menú móvil conservan su comportamiento

#### Scenario: Anotaciones decorativas ocultas para AT

- **WHEN** un lector de pantalla recorre el navbar
- **THEN** no anuncia las anotaciones técnicas decorativas

## MODIFIED Requirements

### Requirement: Accesibilidad y marca

El navbar SHALL exponer landmarks de navegación con nombres accesibles distintos para desktop y móvil (excluyentes por breakpoint), un botón de menú con nombre accesible cuyo estado expandido/colapsado se anuncie de forma nativa, áreas táctiles de al menos 44×44 px y foco visible en todos los elementos interactivos. SHALL reutilizar los tokens y primitivos existentes (incluido `Button` y los iconos de `@lucide/astro`), sin colores fuera de los 6 tokens ni dependencias nuevas.

#### Scenario: Landmarks y estado del botón

- **WHEN** un lector de pantalla recorre la página
- **THEN** encuentra una navegación principal en desktop y una navegación de menú móvil cuando el panel está disponible, y el botón de menú anuncia su estado expandido/colapsado

#### Scenario: Área táctil y foco visible

- **WHEN** se mide el botón de menú y se navega con teclado
- **THEN** el área táctil es al menos 44×44 px y cada elemento interactivo del navbar muestra indicador de foco visible

#### Scenario: Solo tokens y sin dependencias nuevas

- **WHEN** se inspecciona el CSS construido y `package.json`
- **THEN** no aparecen colores fuera de los 6 tokens y no se añaden dependencias nuevas (la migración a `@lucide/astro` ya está versionada)

### Requirement: Presupuesto de JS y build limpio

El navbar SHALL seguir añadiendo 0 islas hidratadas; su JavaScript propio SHALL ser únicamente el micro-script inline de cierre del menú móvil. La capa de animación global (módulo diferido del sistema Precision Instrument) PUEDE animar el navbar sin añadir scripts propios. `pnpm build` SHALL completar (con los imports resueltos vía `@lucide/astro`) y `pnpm astro check` SHALL terminar con 0 errores.

#### Scenario: HTML sin islas

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay `client:*` ni scripts de islas y el único script inline propio del navbar sigue siendo el de cierre del menú

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores
