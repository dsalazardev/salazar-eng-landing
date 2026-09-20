# Spec Delta: landing-problemsolution

## Purpose

Define la sección de reconocimiento dolor→solución posterior al stack: ledger 3×2 con citas y respuestas verbatim del brief sobre una textura blueprint sutil, apilado en móvil y sin JavaScript.

## ADDED Requirements

### Requirement: Sección de reconocimiento tras el stack

La sección SHALL ser la inmediatamente posterior al stackstrip y SHALL mostrar un encabezado con la etiqueta "04/ PROBLEMA", un `<h2>` "El problema que escuchamos" y una etiqueta mono "NUESTRA RESPUESTA" alineada sobre la columna de respuestas en viewports `lg` o mayores (oculta en móvil, donde el `<h2>` da el contexto).

#### Scenario: Encabezado presente

- **WHEN** se carga la página
- **THEN** la sección sigue al stackstrip y muestra la etiqueta "04/ PROBLEMA", el h2 "El problema que escuchamos" y, en `≥lg`, la etiqueta mono "NUESTRA RESPUESTA"

#### Scenario: Etiqueta mono solo en desktop

- **WHEN** el viewport es menor a `lg`
- **THEN** la etiqueta "NUESTRA RESPUESTA" no se muestra y el contexto lo aporta el h2

### Requirement: Ledger 3×2 dolor→respuesta

La sección SHALL presentar exactamente 3 pares dolor→respuesta como una lista semántica; cada par SHALL distribuirse en dos columnas en `lg` con separadores `border-line` entre filas, y SHALL apilarse en una sola columna en móvil (dolor primero, respuesta después) sin scroll lateral.

#### Scenario: Dos columnas con separadores en desktop

- **WHEN** el viewport es `lg` o mayor
- **THEN** se ven 3 filas de dos columnas (dolor | respuesta) separadas por líneas `line`

#### Scenario: Apilado en móvil

- **WHEN** el viewport es menor a `lg`
- **THEN** cada par apila la cita y debajo su respuesta, sin desbordamiento horizontal

### Requirement: Copy verbatim del brief

La sección SHALL mostrar las 3 citas y las 3 respuestas exactamente como el brief, en su orden: "El sistema va lento y cada cambio rompe algo." → "Arquitectura moderna + métricas antes/después"; "El equipo pierde horas en tareas manuales." → "Automatización e IA aplicada en tu flujo real"; "Nuestros datos están, pero no sirven para decidir." → "Copilotos con RAG sobre tus documentos". Las citas SHALL ser `<blockquote>` en italic `steel` con regla izquierda `line` y sin comillas literales; las respuestas SHALL ser párrafos `navy` semibold.

#### Scenario: Textos exactos en orden

- **WHEN** se inspecciona la sección construida
- **THEN** las 3 citas y las 3 respuestas coinciden verbatim con el brief y respetan su orden

#### Scenario: Jerarquía tipográfica

- **WHEN** se renderiza
- **THEN** las citas aparecen como blockquote italic steel con regla izquierda y las respuestas como párrafos navy semibold

### Requirement: Textura blueprint sutil

La sección SHALL incluir una capa decorativa de rejilla blueprint con desvanecido vertical (o la textura completa como fallback si el navegador no soporta máscaras), marcada como decorativa para tecnologías de asistencia, y NO SHALL añadir bordes superior/inferior propios (el borde inferior del stackstrip ya separa).

#### Scenario: Textura con desvanecido

- **WHEN** se renderiza la sección
- **THEN** la rejilla blueprint aparece atenuada en los extremos superior e inferior y el contenido permanece legible por encima

#### Scenario: Sin bordes propios

- **WHEN** se inspecciona la sección
- **THEN** no define `border-y` y la separación proviene del borde del stackstrip

### Requirement: Sin añadidos fuera del brief

La sección NO SHALL incluir iconos, badges, conector "→" ni CTA; tampoco copy nuevo. El puente hacia servicios SHALL ser narrativo/posicional (las respuestas prefiguran las líneas de servicio) y quedará documentado como no-elemento intencional.

#### Scenario: Cero añadidos

- **WHEN** se revisa el contenido de la sección
- **THEN** solo contiene el encabezado, las 3 citas y las 3 respuestas del brief, sin iconos, badges, flechas ni botones

### Requirement: Sin JavaScript nuevo y estilos aislados

La sección SHALL añadir 0 JavaScript (sin islas ni scripts) y SHALL mantener sus estilos específicos (la máscara de la textura) en un bloque de estilos del propio componente con clases namespaced `problem-*`; `global.css` NO SHALL modificarse.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección (el único script sigue siendo el inline del navbar)

#### Scenario: global.css intacto

- **WHEN** se revisa el CSS construido y el repositorio
- **THEN** la máscara vive en clases `problem-*` del componente y `global.css` no tiene cambios

### Requirement: Integración y verificación

La sección SHALL montarse en la página inmediatamente después del stackstrip y exponer `id="problema"` sin alterar el contrato de anclas del navbar. `pnpm astro check` SHALL terminar con 0 errores y el build SHALL verificarse por inspección del HTML/CSS resultante, con las verificaciones humanas (legibilidad de la textura, apilado móvil y responsive 320→1440) registradas como pendientes del dueño.

#### Scenario: Integración sin romper contratos

- **WHEN** se inspecciona la página construida
- **THEN** `#problema` aparece inmediatamente después del stackstrip y los destinos del navbar siguen intactos

#### Scenario: Verificaciones automatizadas limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y la inspección confirma la máscara y la ausencia de JS nuevo

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma legibilidad sobre la textura, apilado correcto en móvil y ausencia de desbordamientos entre 320 y 1440 px
