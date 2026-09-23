# Spec Delta: landing-faq

## Purpose

Sección de objeciones finales (precio, NDA, soporte y traspaso) con un accordion nativo de 5 preguntas en 0 JavaScript, que resuelve el ancla `#faq` del contrato del navbar.

## ADDED Requirements

### Requirement: Sección de objeciones tras el lead magnet

La sección SHALL ser la inmediatamente posterior a la del checklist (lead magnet) y SHALL mostrar, en este orden: la etiqueta "10/ FAQ", un `<h2>` "Preguntas frecuentes", el subcopy "Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas." y las 5 preguntas del brief §4.7 en el orden fijado. La sección SHALL presentarse como una banda blanca delimitada por líneas `line` y NO SHALL incluir texturas, corner marks, numeración por pregunta ni CTA propio.

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del checklist y muestra la etiqueta "10/ FAQ", el h2 "Preguntas frecuentes", el subcopy fijado y las 5 preguntas en orden, sin CTA propio

#### Scenario: Cinco preguntas, sin preguntas extra

- **WHEN** se inspecciona la sección construida
- **THEN** existen exactamente 5 preguntas y coinciden en orden con las del brief §4.7

### Requirement: Ancla viva del contrato

La sección SHALL exponer `id="faq"` exactamente una vez, de modo que los 2 enlaces existentes hacia `#faq` (navbar desktop y panel móvil) tengan destino dentro de la página. Los demás destinos del contrato (`#servicios`, `#casos`, `#proceso`) NO SHALL alterarse y `#contacto` SHALL permanecer sin destino en esta fase (pendiente de M11, documentado como no-regresión).

#### Scenario: Ancla resuelta

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="faq"` y los 2 `href="#faq"` apuntan a un destino existente

#### Scenario: Resto del contrato intacto

- **WHEN** se revisan los demás destinos del navbar
- **THEN** `#servicios`, `#casos` y `#proceso` conservan sus anclas vivas y `#contacto` conserva su valor sin cambios

### Requirement: Accordion nativo sin JavaScript

Las 5 preguntas SHALL implementarse como `<details name="faq">` con `<summary>`, sin islas, scripts ni `client:*`. La primera pregunta SHALL estar `open` al cargar y la exclusividad SHALL ser nativa (`name`): abrir una pregunta cierra la anterior en navegadores con soporte (Baseline 2024); en navegadores sin soporte, cada pregunta SHALL abrirse de forma independiente sin errores. El accordion NO SHALL animar su altura; al abrir/cerrar SHALL cambiar únicamente la orientación del indicador. El contenido de cada respuesta SHALL permanecer en el HTML aunque la pregunta esté cerrada (indexable).

#### Scenario: Estructura nativa y estado inicial

- **WHEN** se inspecciona el HTML construido
- **THEN** existen 5 `<details>` con `name="faq"`, cada uno con su `<summary>`, y solo la primera lleva `open`

#### Scenario: Exclusividad nativa

- **WHEN** el usuario abre una pregunta distinta de la abierta, en un navegador con soporte de `name`
- **THEN** la pregunta anterior se cierra y solo una queda abierta

#### Scenario: Degradación sin soporte

- **WHEN** el navegador no soporta `name` en `<details>`
- **THEN** cada pregunta se abre y cierra de forma independiente, sin errores ni cambios de layout

#### Scenario: Sin animación de altura

- **WHEN** el usuario abre o cierra una pregunta
- **THEN** el contenido aparece o desaparece sin transición de altura y solo cambia la orientación del indicador

#### Scenario: Contenido indexable

- **WHEN** se inspecciona el HTML construido con las preguntas cerradas
- **THEN** las 5 respuestas están presentes en el documento

### Requirement: Indicador visual y marcador nativo

Cada `<summary>` SHALL ocultar el marcador nativo (triángulo) y SHALL mostrar un indicador de despliegue basado en `ChevronDown` de `lucide-astro` que rota al abrir la pregunta, con transición desactivada bajo `prefers-reduced-motion: reduce`. El indicador SHALL ser decorativo y NO SHALL aportar contenido semántico.

#### Scenario: Sin marcador nativo

- **WHEN** se renderiza la sección
- **THEN** los summaries no muestran el triángulo nativo y sí el chevron

#### Scenario: Rotación del chevron

- **WHEN** una pregunta pasa de cerrada a abierta
- **THEN** el chevron rota 180° y el indicador queda marcado como decorativo (`aria-hidden`)

#### Scenario: Movimiento reducido

- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** el chevron cambia de orientación sin transición

### Requirement: Accesibilidad nativa

El accordion SHALL usar la semántica nativa de `<details>/<summary>`: cada summary SHALL ser focusable, operable con Tab, Enter y Espacio, y SHALL exponer su estado abierto/cerrado al árbol de accesibilidad sin atributos ARIA manuales (`role`, `aria-expanded`, `aria-controls` prohibidos). El foco SHALL ser visible, NO SHALL haber elementos interactivos dentro del summary y la sección NO SHALL desbordar horizontalmente entre 320 y 1440 px. El texto secundario SHALL cumplir contraste AA sobre el fondo blanco.

#### Scenario: Operación por teclado

- **WHEN** el usuario navega con Tab hasta un summary y pulsa Enter o Espacio
- **THEN** la pregunta se abre o cierra y el foco permanece visible

#### Scenario: Cero ARIA manual

- **WHEN** se inspecciona el HTML construido
- **THEN** los summaries no llevan `role`, `aria-expanded` ni `aria-controls`, y no contienen enlaces, botones ni campos

#### Scenario: Sin desbordamiento

- **WHEN** el viewport varía entre 320 y 1440 px
- **THEN** la sección no produce scroll horizontal

### Requirement: Copy del FAQ

La sección SHALL usar el copy fijado. h2: "Preguntas frecuentes"; subcopy: "Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas."; respuestas verbatim del brief §4.7: 1 "Diagnóstico primero; cotización por alcance cerrado y fases.", 2 "Sí; integramos o hacemos traspaso completo con documentación.", 3 "Un solo ingeniero senior: menos overhead, más contexto, comunicación directa.", 4 "Todo proyecto incluye periodo de soporte; retainer opcional.", 5 "Sí, antes de cualquier conversación técnica.". Las preguntas SHALL ser: "¿Cuánto cuesta un proyecto?", "¿Trabajan con mi equipo interno?", "¿Por qué un estudio boutique y no una agencia?", "¿Qué pasa si algo falla post-lanzamiento?" y "¿Firman NDA?". NO SHALL haber preguntas, respuestas ni cifras adicionales.

#### Scenario: Textos exactos

- **WHEN** se inspecciona la sección construida
- **THEN** h2, subcopy, las 5 preguntas y las 5 respuestas coinciden con el copy fijado

#### Scenario: Sin copy inventado

- **WHEN** se revisan las 5 respuestas
- **THEN** cada una coincide verbatim con el brief §4.7 y no hay cifras ni claims nuevos

### Requirement: Presupuesto de JavaScript y build

La sección SHALL añadir 0 JavaScript: sin islas, sin scripts y sin `client:*`. La carga inicial SHALL mantener exactamente los 3 scripts inline existentes (navbar, loader de directiva y runtime de islas) que suman menos de 10 KB. NO SHALL añadirse dependencias y `global.css` NO SHALL modificarse. `pnpm astro check` SHALL terminar con 0 errores y `pnpm build` SHALL completar.

#### Scenario: Cero JS nuevo

- **WHEN** se inspecciona el HTML construido
- **THEN** no hay scripts ni islas asociados a la sección y la carga inicial conserva 3 scripts inline que suman menos de 10 KB

#### Scenario: Verificaciones limpias

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y `global.css` no tiene cambios

### Requirement: Integración y verificación por inspección

`index.astro` SHALL montar la sección inmediatamente después de la del checklist. El change SHALL verificarse por inspección directa del build (sin levantar preview): `id="faq"` ×1, `href="#faq"` ×2, `<details` ×5, `name="faq"` ×5, `<summary` ×5, 3 scripts inline (4,997 B), CSS construido con la regla de rotación del chevron para `[open]` y `global.css` sin cambios. Las comprobaciones visuales (render del accordion, operación por teclado y foco visible, degradación pre-2024 opcional) SHALL registrarse como verificaciones humanas pendientes del dueño.

#### Scenario: Inspección del dist

- **WHEN** se inspeccionan el HTML y el CSS construidos
- **THEN** se confirman el ancla única, los 2 enlaces resueltos, las 5 filas nativas, el copy, los 3 scripts inline sin cambios y la regla CSS del chevron

#### Scenario: Verificación humana registrada

- **WHEN** el dueño revise la página en un navegador real
- **THEN** confirma el render del accordion, la operación por teclado con foco visible y, opcionalmente, la degradación independiente en un navegador pre-2024
