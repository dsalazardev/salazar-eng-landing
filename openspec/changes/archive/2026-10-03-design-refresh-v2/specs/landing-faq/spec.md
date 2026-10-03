# Spec Delta: landing-faq — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del accordion

La sección SHALL adoptar el tratamiento de "acordeón técnico" del diseño aprobado: banda blanca con reglas full-bleed del sistema Precision Instrument y filas del accordion con hairlines reforzados. La sección NO SHALL incluir texturas, corner marks ni CTA propio, y las 5 preguntas y respuestas NO SHALL alterarse.

#### Scenario: Acordeón técnico aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** las reglas full-bleed y los hairlines del accordion están presentes sin texturas ni CTA

#### Scenario: Copy intacto

- **WHEN** se revisan las 5 filas
- **THEN** preguntas y respuestas coinciden verbatim con el contenido existente

## MODIFIED Requirements

### Requirement: Indicador visual y marcador nativo

Cada `<summary>` SHALL ocultar el marcador nativo (triángulo) y SHALL mostrar un indicador de despliegue basado en `ChevronDown` de `@lucide/astro` (paquete migrado) que rota al abrir la pregunta, con transición desactivada bajo `prefers-reduced-motion: reduce`. El indicador SHALL ser decorativo y NO SHALL aportar contenido semántico.

#### Scenario: Sin marcador nativo

- **WHEN** se renderiza la sección
- **THEN** los summaries no muestran el triángulo nativo y sí el chevron

#### Scenario: Rotación del chevron

- **WHEN** una pregunta pasa de cerrada a abierta
- **THEN** el chevron rota 180° y el indicador queda marcado como decorativo (`aria-hidden`)

#### Scenario: Movimiento reducido

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** el chevron cambia de orientación sin transición

### Requirement: Presupuesto de JavaScript y build

La sección SHALL añadir 0 JavaScript propio: sin islas, sin scripts y sin `client:*`; la capa global de animación puede animar su entrada de forma sutil sin añadir scripts a la sección. La carga inicial SHALL mantener exactamente los 3 scripts inline existentes (navbar, loader de directiva y runtime de islas) que suman menos de 10 KB. NO SHALL añadirse dependencias nuevas (la migración a `@lucide/astro` ya está versionada) y `global.css` PUEDE ganar utilidades del sistema Precision Instrument manteniendo los 6 tokens. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Cero JS nuevo

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay scripts ni islas asociados a la sección y la carga inicial conserva 3 scripts inline que suman menos de 10 KB

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y los 6 tokens conservan sus valores

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar la sección inmediatamente después de la del checklist. El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="faq"` ×1, `href="#faq"` ×2, `<details` ×5, `name="faq"` ×5, `<summary` ×5, 3 scripts inline y CSS construido con la regla de rotación del chevron para `[open]` y las utilidades del rediseño; los 6 tokens conservan sus valores. Las comprobaciones visuales (render del accordion, operación por teclado y foco visible, degradación pre-2024 opcional) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los 2 enlaces resueltos, las 5 filas nativas, el copy, los 3 scripts inline sin cambios y la regla CSS del chevron

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el render del accordion, la operación por teclado con foco visible y, opcionalmente, la degradación independiente en un navegador pre-2024
