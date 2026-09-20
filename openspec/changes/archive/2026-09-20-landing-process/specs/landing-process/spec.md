# Spec Delta

## Purpose

Sección de método con un timeline de 4 pasos numerados (línea y nodos blueprint, lista ordenada semántica) inmediatamente posterior a la evidencia, que resuelve el ancla `#proceso` del contrato del navbar.

## ADDED Requirements

### Requirement: Sección de método tras la evidencia

La sección SHALL ser la inmediatamente posterior a la de casos y SHALL mostrar un encabezado con la etiqueta "07/ PROCESO", un `<h2>` "Cómo trabajamos" y el tagline "Diagnóstico primero; cotización por alcance cerrado y fases.", seguido del timeline de los 4 pasos.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la de casos y muestra la etiqueta "07/ PROCESO", el h2 "Cómo trabajamos" y el tagline

### Requirement: Ancla viva del contrato

La sección SHALL exponer `id="proceso"` exactamente una vez, de modo que los enlaces existentes hacia `#proceso` (navbar desktop y panel móvil) tengan destino dentro de la página, sin alterar los demás destinos del contrato de anclas.

#### Scenario: Ancla resuelta

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="proceso"` y los 2 `href="#proceso"` apuntan a un destino existente

#### Scenario: Resto del contrato intacto

- **WHEN** se revisan los demás destinos del navbar
- **THEN** `#servicios` y `#casos` conservan sus anclas vivas y `#faq` y `#contacto` conservan sus valores sin cambios

### Requirement: Timeline de 4 pasos en lista ordenada

La sección SHALL presentar exactamente 4 pasos en un único `<ol>` en el orden 01 Diagnóstico → 02 Propuesta → 03 Sprints con demos → 04 Entrega + soporte, con disposición horizontal de 4 columnas en `lg` (línea horizontal de conexión con nodos) y rail vertical en viewports menores a `lg` (segmento de línea por paso, el último sin segmento), sin desbordamiento horizontal en móvil.

#### Scenario: Cuatro pasos ordenados

- **WHEN** se inspecciona la sección
- **THEN** hay un solo `<ol>` con 4 `<li>` en el orden Diagnóstico → Propuesta → Sprints con demos → Entrega + soporte

#### Scenario: Disposición responsive

- **WHEN** el viewport es `lg` o mayor
- **THEN** los 4 pasos se distribuyen en 4 columnas con la línea horizontal y sus nodos; en móvil se apilan como rail vertical sin scroll lateral

### Requirement: Numeración y dispositivo blueprint

Cada paso SHALL mostrar su número `01`–`04` en mono dentro de un nodo (borde `line`, fondo surface) que enmascara la línea de conexión; la línea SHALL ser de 1px en `line` y NO SHALL usar flechas. Nodos y línea NO SHALL aportar contenido semántico.

#### Scenario: Nodos numerados

- **WHEN** se inspecciona cada paso
- **THEN** muestra su número en mono dentro del nodo y la línea continua conecta los nodos en `lg`

### Requirement: Copy del método

La sección SHALL usar el copy fijado: `<h2>` "Cómo trabajamos"; tagline "Diagnóstico primero; cotización por alcance cerrado y fases."; paso 01 "Diagnóstico técnico de 20 minutos, sin costo ni compromiso. Salimos con un plan claro, lo trabajemos o no."; paso 02 "Cotización por alcance cerrado y fases: qué se construye, en qué orden y a qué precio, antes de empezar."; paso 03 "Construcción por sprints con demos periódicas del avance, con código testeado en cada entrega."; paso 04 "Plataforma en producción, con documentación y traspaso al equipo. Todo proyecto incluye un periodo de soporte.". La única cifra SHALL ser "20 minutos" (paso 01); NO SHALL haber duraciones ni cifras adicionales.

#### Scenario: Textos del método

- **WHEN** se inspecciona la sección construida
- **THEN** h2, tagline y las 4 descripciones coinciden con el copy fijado

#### Scenario: Sin cifras inventadas

- **WHEN** se revisan los 4 pasos
- **THEN** la única cifra presente es "20 minutos" en el paso 01

### Requirement: 100 % tipográfico, sin CTA propio

La sección SHALL ser 100 % tipográfica: NO SHALL incluir iconos, mini-diagramas, imágenes, texturas ni CTA propio; el único elemento gráfico SHALL ser la línea y los nodos del timeline.

#### Scenario: Cero elementos gráficos y CTA

- **WHEN** se revisa la sección construida
- **THEN** no hay iconos, diagramas, imágenes ni CTA; solo texto, línea y nodos

### Requirement: Sin JavaScript nuevo

La sección SHALL añadir 0 JavaScript (sin islas ni scripts); el único script del sitio SHALL seguir siendo el inline del navbar. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar. `global.css` NO SHALL modificarse y NO SHALL añadirse dependencias.

#### Scenario: Sin JS nuevo

- **WHEN** se inspecciona el HTML/JS construido
- **THEN** no hay scripts ni islas asociados a la sección

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores y el build completa sin errores

### Requirement: Accesibilidad semántica

El timeline SHALL ser una lista ordenada nativa (`<ol>`/`<li>`) con un `<h3>` por paso y su descripción en `<p>`; los nodos y la línea de conexión SHALL ser decorativos (`aria-hidden="true"`); la sección SHALL exponer un `<h2>`.

#### Scenario: Semántica de proceso

- **WHEN** se inspecciona el HTML construido
- **THEN** el timeline es un `<ol>` con `<li>` que contienen `<h3>` y `<p>`, y nodos y línea están marcados `aria-hidden="true"`

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar la sección inmediatamente después de la de casos; el change SHALL verificarse por inspección directa del build (sin levantar preview): `id="proceso"` ×1, `href="#proceso"` ×2, h2/tagline/nombres presentes, numeración 01–04, único script inline del navbar y `global.css` sin cambios; las comprobaciones visuales (timeline en desktop y móvil, densidad a 1024 px, responsive 320→1440) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los textos, la numeración, el único script inline y la ausencia de cambios en `global.css`

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el timeline horizontal y el rail vertical, la densidad en 1024 px y la ausencia de desbordamientos entre 320 y 1440 px
