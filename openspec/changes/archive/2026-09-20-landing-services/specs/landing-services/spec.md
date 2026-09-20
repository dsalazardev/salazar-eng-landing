# Spec Delta: landing-services

## Purpose

Define la sección de oferta posterior al reconocimiento: bento grid responsive de 3 servicios con promesa, entregables, slot variable (stack/prueba real/casos) y CTA secundario, incluyendo el ancla viva `#servicios` del contrato.

## ADDED Requirements

### Requirement: Sección de oferta tras el reconocimiento

La sección SHALL ser la inmediatamente posterior a la de problema/solución y SHALL mostrar un encabezado con la etiqueta "05/ SERVICIOS" y un `<h2>` "Servicios", seguido del bento de los 3 servicios.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la de problema/solución y muestra la etiqueta "05/ SERVICIOS" y el h2 "Servicios"

### Requirement: Ancla viva del contrato

La sección SHALL exponer `id="servicios"` exactamente una vez, de modo que los enlaces del navbar hacia `#servicios` (desktop y panel móvil) tengan destino dentro de la página, sin alterar los demás destinos del contrato de anclas.

#### Scenario: Ancla resuelta

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="servicios"` y los enlaces `href="#servicios"` del navbar apuntan a un destino existente

#### Scenario: Resto del contrato intacto

- **WHEN** se revisan los demás destinos del navbar
- **THEN** `#casos`, `#proceso`, `#faq` y `#contacto` conservan sus valores sin cambios

### Requirement: Bento responsive de 3 servicios

La sección SHALL distribuir los 3 servicios en un grid de 2 columnas en `lg`, con el servicio ① ocupando la celda doble (2x1) y ②③ las celdas simples (1x1); SHALL apilarse en una sola columna en móvil en el orden ①②③, sin desbordamiento horizontal.

#### Scenario: Celda doble y celdas simples en desktop

- **WHEN** el viewport es `lg` o mayor
- **THEN** el servicio ① cruza las dos columnas y los servicios ② y ③ comparten la fila inferior

#### Scenario: Apilado ordenado en móvil

- **WHEN** el viewport es menor a `lg`
- **THEN** los servicios aparecen apilados en el orden ①②③ sin scroll lateral

### Requirement: Anatomía uniforme por servicio

Cada tarjeta SHALL presentar, en este orden: código `S-0N` en mono, `<h3>` con el título, la promesa, la etiqueta "ENTREGABLES" con una lista real de ítems, una segunda etiqueta con su contenido variable y el CTA secundario al pie. Los CTAs SHALL quedar alineados al pie en tarjetas de una misma fila.

#### Scenario: Estructura por tarjeta

- **WHEN** se inspecciona cada tarjeta
- **THEN** contiene código mono, h3, promesa, lista de entregables con su etiqueta, el slot variable con su etiqueta y el CTA

#### Scenario: Pies alineados

- **WHEN** se renderizan las tarjetas de una misma fila
- **THEN** sus CTAs quedan alineados al pie pese a longitudes de contenido distintas

### Requirement: Copy verbatim, CTA y métrica

La sección SHALL usar el copy del brief §4.4 sin añadidos: promesas, entregables y los slots variables con sus etiquetas propias (STACK con 4 badges, PRUEBA REAL con la frase de métrica, CASOS con 3 líneas). El CTA secundario SHALL reutilizar exactamente "Ver casos de estudio →" hacia `#casos` en las 3 tarjetas. La métrica `<500 ms` SHALL enfatizarse inline en mono bold navy, sin `accent` y sin alterar la frase verbatim.

#### Scenario: Textos verbatim

- **WHEN** se inspecciona la sección construida
- **THEN** promesas, entregables y contenidos de los slots coinciden con el brief §4.4

#### Scenario: CTA reutilizado

- **WHEN** se renderizan las tarjetas
- **THEN** las 3 muestran el CTA con el texto exacto "Ver casos de estudio →" apuntando a `#casos`

#### Scenario: Métrica enfatizada

- **WHEN** se renderiza la prueba real del servicio ②
- **THEN** `<500 ms` aparece en mono bold navy dentro de la frase verbatim, sin color accent

### Requirement: Shell de tarjeta y tono

Las celdas SHALL construirse sobre el primitivo `Card` (borde `line`, fondo blanco) sin estado hover de tarjeta (`interactive` desactivado); la tarjeta del servicio ① SHALL tener mayor padding en `lg`. La sección NO SHALL incluir iconos y NO SHALL usar `accent` como color estático (solo el hover del CTA outline lo emplea).

#### Scenario: Shell sin affordance falsa

- **WHEN** se inspecciona una tarjeta
- **THEN** usa el estilo base de `Card` sin cambio de borde en hover

#### Scenario: Cero iconos y accent estático

- **WHEN** se revisa la sección
- **THEN** no hay iconos y ningún elemento usa `accent` en estado estático

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript (sin islas ni scripts); el único script del sitio SHALL seguir siendo el inline del navbar. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Verificación por inspección

El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="servicios"` exactamente una vez, textos verbatim presentes, badges del stack, único script inline del navbar y `global.css` sin cambios; las comprobaciones visuales (bento en desktop/móvil, alineación de pies, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los textos verbatim, los badges del stack, el único script inline y la ausencia de cambios en `global.css`

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el bento en desktop y móvil, la alineación de los CTAs y la ausencia de desbordamientos entre 320 y 1440 px
