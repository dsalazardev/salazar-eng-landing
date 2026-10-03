# Spec Delta: landing-leadmagnet — Design Refresh v2

## ADDED Requirements

### Requirement: Rediseño Precision Instrument del panel de captación

La sección SHALL adoptar el tratamiento de "panel de captación de instrumentación" del diseño aprobado: reglas full-bleed del sistema Precision Instrument, la `Card` del formulario con mayor presencia y microcopy de confianza destacado, y motion sutil en los estados del formulario (entrada del panel y transiciones de estado). El copy, los campos, el endpoint y el contrato del formulario NO SHALL alterarse.

#### Scenario: Panel de captación aplicado

- **WHEN** se inspecciona la sección construida
- **THEN** las reglas full-bleed y el tratamiento de instrumentación están presentes sobre la estructura label/h2/subcopy/formulario/micro-línea

#### Scenario: Contrato del formulario intacto

- **WHEN** se revisa el formulario construido
- **THEN** labels, opciones, CTA, microcopy y atributos del contrato (`email`/`need`, endpoint, accesibilidad) permanecen sin cambios

## MODIFIED Requirements

### Requirement: Sección de captura tras el fundador

La sección SHALL ser la inmediatamente posterior a la del fundador y SHALL mostrar: la etiqueta "09/ CHECKLIST", el título de sección "Recurso Técnico Gratuito" (título embellecido aceptado como decisión de diseño), un `<h2>` "Checklist: 27 puntos para modernizar tu sistema legacy", el subcopy "27 puntos concretos para auditar tu sistema actual, directo a tu correo.", el formulario dentro de una `Card` y la micro-línea "Captación automatizada (nuestro caso #0).".

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del fundador y muestra la etiqueta "09/ CHECKLIST", el título de sección, el h2, el subcopy, el formulario y la micro-línea de dogfooding sin referencia a n8n

### Requirement: Presupuesto de JavaScript y build

El build SHALL mantener la carga inicial con únicamente scripts inline — el del navbar, el loader de `client:visible` y el runtime de islas de Astro — que en conjunto SHALL sumar menos de 10 KB, sin runtime de framework en la carga inicial; la capa global de animación SHALL cargarse como chunk externo diferido (fuera de la carga inicial crítica) y NO SHALL contarse en el presupuesto inline. `global.css` PUEDE ganar utilidades del sistema Precision Instrument manteniendo los 6 tokens; la migración a `@lucide/astro` ya está versionada. `pnpm astro check` SHALL terminar con 0 errores y la verificación §06 SHALL hacerse por inspección directa del dist (hook, copy, atributos del formulario, scripts inline medidos, chunk de la isla hasheado y chunk del módulo de animación).

#### Scenario: Scripts inline de la carga inicial bajo presupuesto

- **WHEN** se inspecciona el HTML construido
- **THEN** existen exactamente 3 scripts inline (navbar + loader de directiva + runtime de islas) que suman menos de 10 KB, y el módulo de animación no forma parte de la carga inicial

#### Scenario: Verificación limpia

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y los chunks de la isla y del módulo de animación quedan hasheados en `dist/_astro/`
