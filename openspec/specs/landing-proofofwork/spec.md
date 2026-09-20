# landing-proofofwork Specification

## Purpose

Sección de evidencia con 3 tarjetas de caso verificables (C4 inline, métricas/estado, stack y links) inmediatamente posterior a la oferta, que resuelve el ancla `#casos` del contrato del navbar.

## Requirements

### Requirement: Sección de evidencia tras la oferta

La sección SHALL ser la inmediatamente posterior a la de servicios y SHALL mostrar un encabezado con la etiqueta "06/ EVIDENCIA" y un `<h2>` "Evidencia > promesas" (verbatim brief §3), seguido de las 3 tarjetas de caso.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la de servicios y muestra la etiqueta "06/ EVIDENCIA" y el h2 "Evidencia > promesas"

### Requirement: Ancla viva del contrato

La sección SHALL exponer `id="casos"` exactamente una vez, de modo que los enlaces existentes hacia `#casos` (navbar desktop y panel móvil, CTA del hero y CTAs de servicios) tengan destino dentro de la página, sin alterar los demás destinos del contrato de anclas.

#### Scenario: Ancla resuelta

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="casos"` y los 6 `href="#casos"` apuntan a un destino existente

#### Scenario: Resto del contrato intacto

- **WHEN** se revisan los demás destinos del navbar
- **THEN** `#servicios` conserva su ancla viva y `#proceso`, `#faq` y `#contacto` conservan sus valores sin cambios

### Requirement: Tres tarjetas de caso con anatomía §4.5

La sección SHALL presentar exactamente 3 tarjetas apiladas (una columna) construidas sobre `Card`, cada una con layout interno de 2 columnas en `lg` (diagrama 5/12 y contenido 7/12) alternando el lado del diagrama (①②③ espejo), y apiladas en móvil en el orden ①②③ sin desbordamiento. Cada tarjeta SHALL presentar, en este orden: `<h3>` "Nombre — Reto", el diagrama C4, la línea de métricas/estado (cuando el caso la defina), los badges de stack y la fila de links.

#### Scenario: Estructura por tarjeta

- **WHEN** se inspecciona cada tarjeta
- **THEN** contiene h3 "Nombre — Reto", diagrama C4, métricas/estado, badges de stack y links, en ese orden

#### Scenario: Alternancia y responsive

- **WHEN** el viewport es `lg` o mayor
- **THEN** el diagrama y el contenido alternan de lado en ①②③ y, en móvil, las tarjetas se apilan en orden ①②③ sin scroll lateral

### Requirement: Diagramas C4 inline

Cada tarjeta SHALL incluir un diagrama C4 en SVG inline (primitivo `C4Diagram.astro`, 3 variantes) en estilo blueprint (cajas, líneas y labels mono sobre tokens), con `role="img"` y `<title>` único por diagrama, sin requests adicionales de red. El diagrama del caso ② SHALL ser conceptual del proceso (deploy manual → pipeline → entregas estables) y NO SHALL contener componentes internos propietarios.

#### Scenario: SVG accesible y sin requests

- **WHEN** se inspecciona el HTML construido
- **THEN** cada diagrama es SVG inline con `role="img"` y `<title>` propio, sin peticiones de imagen

#### Scenario: Diagrama ② sin material propietario

- **WHEN** se revisa el diagrama del caso ②
- **THEN** representa el proceso (deploy manual → pipeline → entregas estables) sin componentes internos de la empresa

### Requirement: Copy por caso (verbatim confirmado)

La sección SHALL usar por caso el copy confirmado: ① "Telemetry Heart AI — de datos dispersos a agente clínico con RAG"; ② "DoliGestión — de deploys manuales frágiles hacia entregas estables (modernización en curso)"; ③ "Ecosistema de microservicios — 5 servicios NestJS orquestados con Docker y pruebas automatizadas". El caso ② SHALL presentar el marco de producto (ERP/CRM SaaS, España) sin mención de Onna Digital. El caso ③ NO SHALL afirmar comunicación asíncrona.

#### Scenario: Textos verbatim

- **WHEN** se inspecciona la sección construida
- **THEN** los 3 h3 coinciden con el copy confirmado

#### Scenario: Caso ② sin mención corporativa

- **WHEN** se revisa el contenido del caso ②
- **THEN** no aparece "Onna Digital" ni detalles propietarios, y sí el marco de producto con badge de estado "En despliegue a producción"

#### Scenario: Caso ③ sin claim asíncrono

- **WHEN** se revisa el contenido del caso ③
- **THEN** no aparece "asíncrona"/"asíncrono" y los badges son NestJS, Docker, REST y React

### Requirement: Métricas solo verificadas

Las métricas mostradas SHALL ser únicamente verificables: el caso ① SHALL mostrar `F1 0.99`, `Recall crítico 1.00` y `47 tests`; el caso ② SHALL mostrar el badge de estado `En despliegue a producción` y ningún dato propietario; el caso ③ NO SHALL mostrar cifras (campo de métrica preparado, sin renderizar en v1). La sección NO SHALL inventar cifras ni claims no verificados.

#### Scenario: Métricas del caso ①

- **WHEN** se inspecciona la tarjeta ①
- **THEN** muestra F1 0.99, Recall crítico 1.00 y 47 tests

#### Scenario: Sin cifras no verificadas

- **WHEN** se revisan las 3 tarjetas
- **THEN** no hay métricas fuera de las verificadas, el caso ② solo usa el badge de estado y el caso ③ no muestra cifras

### Requirement: Regla "solo links existentes"

La sección SHALL renderizar únicamente los links existentes: ① repo `https://github.com/dsalazardev/telemetry-heart-ai` ("Repo →"); ② producto `https://doligestion.es/` ("Producto →"); ③ repo `https://github.com/dsalazardev/ing-sw2-project/tree/development` ("Repo →"). Los campos Loom y "Caso completo →" NO SHALL renderizarse (campos preparados en los datos, sin links muertos). Todo link externo SHALL usar `target="_blank"` y `rel="noopener noreferrer"` con focus visible.

#### Scenario: Links existentes renderizados

- **WHEN** se inspeccionan las filas de links
- **THEN** aparecen exactamente los 3 links confirmados con sus etiquetas y atributos de seguridad

#### Scenario: Sin links muertos

- **WHEN** se revisa el HTML construido
- **THEN** no hay enlaces a Loom ni a páginas de caso inexistentes

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript (sin islas ni scripts); el único script del sitio SHALL seguir siendo el inline del navbar. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Verificación por inspección

El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="casos"` exactamente una vez, `href="#casos"` ×6, títulos de los 3 casos presentes, links confirmados, SVG con `role="img"`, único script inline del navbar y `global.css` sin cambios; las comprobaciones visuales (layout alternado, diagramas, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los textos y links, los SVG accesibles, el único script inline y la ausencia de cambios en `global.css`

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el layout alternado de las 3 tarjetas, la legibilidad de los diagramas y la ausencia de desbordamientos entre 320 y 1440 px
