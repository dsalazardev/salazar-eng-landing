# landing-stackstrip Specification

## Purpose

Define la franja de validación técnica posterior al hero: encabezado con el stack de producción del brief, cinta continua CSS sin JavaScript con pausas accesibles y las 16 tecnologías del estudio.

## Requirements

### Requirement: Franja de validación tras el hero

La franja SHALL ser la sección inmediatamente posterior al hero y SHALL contener un encabezado con la etiqueta de sección "03/ STACK", un `<h2>` visible "STACK DE PRODUCCIÓN" y la tagline en italic "Tecnología elegida por resultados, no por moda.", seguida de una cinta a ancho completo de la banda (full-bleed) con desvanecido lateral.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la franja es la sección inmediatamente posterior al hero y muestra la etiqueta "03/ STACK", el h2 "STACK DE PRODUCCIÓN" y la tagline en italic

#### Scenario: Cinta full-bleed

- **WHEN** se renderiza a cualquier ancho de viewport
- **THEN** la cinta cruza de borde a borde de la banda con fundido en ambos extremos (o recorte limpio si el navegador no soporta máscaras)

### Requirement: Cinta continua sin salto y sin JavaScript

La cinta SHALL desplazarse en bucle infinito mediante animación CSS que solo SHALL animar `transform`, con dos copias idénticas del contenido y un reinicio en el punto medio de la pista, de forma que el final del ciclo coincida exactamente con el inicio (sin saltos ni huecos en la costura). La duración SHALL ser de aproximadamente 36 segundos lineales. La cinta NO SHALL usar JavaScript.

#### Scenario: Reinicio sin salto

- **WHEN** la animación completa un ciclo y reinicia
- **THEN** el contenido visible coincide exactamente con el inicio, sin salto ni espacio irregular en la costura

#### Scenario: Solo transform

- **WHEN** se inspecciona el CSS construido
- **THEN** la animación mueve la pista únicamente con `translateX` y no anima propiedades de layout

#### Scenario: Sin JavaScript

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** la franja no añade scripts ni islas (el único script del sitio sigue siendo el inline del navbar)

### Requirement: Pausas accesibles

La cinta SHALL poder pausarse y reanudarse al pasar el cursor y al enfocar la región, mediante un control operable por teclado (checkbox con etiqueta "Pausar animación" visible al recibir foco), y SHALL mostrarse estática cuando el usuario prefiere movimiento reducido.

#### Scenario: Pausa con cursor o foco

- **WHEN** el cursor entra en la franja o la región recibe foco
- **THEN** la animación se pausa y se reanuda al salir

#### Scenario: Control de pausa por teclado

- **WHEN** se tabula hasta el control de pausa y se activa con el teclado
- **THEN** la cinta se detiene; al desactivarlo, se reanuda

#### Scenario: Movimiento reducido

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** no hay animación, el duplicado queda oculto y la lista completa se muestra estática envuelta en varias líneas

### Requirement: Contenido del stack

La franja SHALL mostrar exactamente las 16 tecnologías del brief en su orden y verbatim: Angular, React, NestJS, Spring Boot, Node.js, PHP, Python / FastAPI, PostgreSQL, MongoDB, AWS, Docker, Terraform, Pulumi, LangChain, Ollama, n8n. Cada etiqueta SHALL reutilizar el primitivo `Badge`, con espaciado uniforme entre ítems. No SHALL añadirse tecnologías, grupos ni separadores.

#### Scenario: Las 16 exactas en orden

- **WHEN** se inspecciona la primera copia de la lista
- **THEN** contiene exactamente las 16 cadenas del brief, en su orden, sin añadidos

#### Scenario: Primitivo reutilizado

- **WHEN** se inspecciona el HTML
- **THEN** las etiquetas usan el estilo del primitivo `Badge` (mono, mayúsculas, borde `line`) sin colores ni estilos nuevos

### Requirement: Accesibilidad estructural

La primera copia SHALL ser una lista semántica real (`ul`/`li`); la copia duplicada SHALL estar marcada `aria-hidden="true"`; el `<h2>` SHALL etiquetar la sección; el único elemento enfocable añadido SHALL ser el control de pausa; y el contenedor SHALL recortar el desbordamiento sin trampas de foco.

#### Scenario: Anuncio para tecnologías de asistencia

- **WHEN** un lector de pantalla recorre la página
- **THEN** anuncia una lista con las 16 tecnologías y no anuncia la copia duplicada

#### Scenario: Orden de tabulación limpio

- **WHEN** se tabula por la página
- **THEN** el único elemento enfocable añadido por la franja es el control de pausa

### Requirement: Rendimiento y estabilidad visual

La franja SHALL añadir 0 JavaScript, NO SHALL generar scroll horizontal ni cambios de layout (CLS 0) y SHALL ejecutar la animación en el compositor (solo `transform`, con `will-change` en la pista). Si el navegador no soporta máscaras, el recorte duro SHALL mantener intacto el layout.

#### Scenario: Sin scroll horizontal

- **WHEN** se mide el documento a cualquier ancho
- **THEN** no aparece scroll horizontal causado por la cinta

#### Scenario: Animación compuesta

- **WHEN** se inspecciona el CSS
- **THEN** solo `transform` y `will-change` participan de la animación de la pista

#### Scenario: Sin soporte de máscara

- **WHEN** el navegador no soporta `mask-image`
- **THEN** la cinta se recorta limpiamente sin romper la altura ni el layout de la banda

### Requirement: Integración y verificación

La franja SHALL montarse en la página inmediatamente después del hero, exponer `id="stack"` y no alterar el contrato de anclas del navbar. `pnpm astro check` SHALL terminar con 0 errores y el build SHALL verificarse por inspección del CSS resultante (keyframes, transform, máscara y reduced-motion presentes; sin JavaScript nuevo), con la pasada humana del bucle y del modo reducido documentada como verificación pendiente del dueño.

#### Scenario: Integración sin romper contratos

- **WHEN** se inspecciona la página construida
- **THEN** `#stack` aparece inmediatamente después del hero y los destinos del navbar siguen siendo los del contrato de anclas

#### Scenario: Verificaciones automatizadas limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y la inspección del CSS confirma keyframes/transform/máscara/reduced-motion sin JS nuevo

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma que el bucle no salta, que las pausas funcionan y que el modo reducido muestra la lista estática
