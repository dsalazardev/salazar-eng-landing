# landing-leadmagnet Specification

## Purpose

Sección de captura con el checklist de 27 puntos y la primera isla React del sitio: formulario híbrido (base nativa + isla `client:visible`), endpoint configurable y micro-línea de dogfooding, con el hook `id="recurso"`.

## Requirements

### Requirement: Sección de captura tras el fundador

La sección SHALL ser la inmediatamente posterior a la del fundador y SHALL mostrar: la etiqueta "09/ CHECKLIST", un `<h2>` "Checklist: 27 puntos para modernizar tu sistema legacy", el subcopy "27 puntos concretos para auditar tu sistema actual, directo a tu correo.", el formulario dentro de una `Card` y la micro-línea "Captación automatizada con n8n (nuestro caso #0).".

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del fundador y muestra la etiqueta "09/ CHECKLIST", el h2, el subcopy, el formulario y la micro-línea de dogfooding

### Requirement: Hook `id="recurso"`

La sección SHALL exponer `id="recurso"` exactamente una vez como hook interno, sin alterar los destinos del contrato de anclas del navbar.

#### Scenario: Hook presente

- **WHEN** se inspecciona el HTML construido
- **THEN** existe exactamente un `id="recurso"` y los destinos del navbar (`#servicios`, `#casos`, `#proceso`, `#faq`, `#contacto`) conservan sus valores

### Requirement: Primera isla con carga diferida

La sección SHALL renderizar el formulario como isla React (`ContactForm.tsx`) hidratada con `client:visible`: la carga inicial SHALL mantener únicamente el script inline del navbar (245 B) y el loader de islas de Astro (≈1–2 KB), y el runtime del framework (medido en ~77 KB gzip) NO SHALL formar parte de la carga inicial, descargándose solo cuando el formulario se acerca al viewport.

#### Scenario: Carga inicial intacta

- **WHEN** se inspecciona el HTML construido
- **THEN** la carga inicial contiene el script inline del navbar y el loader de islas, sin el runtime de React

#### Scenario: Runtime diferido hasta el viewport

- **WHEN** la página carga y el formulario está fuera del viewport inicial
- **THEN** el chunk de la isla no se descarga hasta acercarse al formulario (`client:visible`)

### Requirement: Base de formulario nativo

El HTML SSR de la isla SHALL incluir un `<form>` con `action` (el endpoint configurado) y `method="POST"`, de modo que el envío funcione sin JavaScript y antes de la hidratación (submit nativo, comportamiento documentado); con la isla hidratada, el submit SHALL interceptarse mediante `fetch` y mostrar los estados en la misma página.

#### Scenario: Formulario funcional sin JavaScript

- **WHEN** se inspecciona el HTML construido
- **THEN** el `<form>` tiene `action` y `method="POST"` y puede enviarse sin JavaScript

#### Scenario: Interceptación hidratada

- **WHEN** la isla está hidratada y el usuario envía el formulario
- **THEN** el submit se intercepta (sin navegación) y el resultado se muestra en los estados de la isla

### Requirement: Estados del formulario

La isla SHALL manejar los estados `idle` → `submitting` (botón deshabilitado + "Enviando…") → `success` ("Listo. Revisa tu correo en unos minutos.") → `error` ("No pudimos enviar tu solicitud. Intenta de nuevo.", con posibilidad de reintentar); la validación SHALL ser HTML5 más comprobación en JS con `aria-invalid`.

#### Scenario: Flujo feliz

- **WHEN** el usuario envía con datos válidos y el endpoint responde correctamente
- **THEN** la isla muestra el mensaje de éxito y el formulario deja de ser editable

#### Scenario: Flujo de error con retry

- **WHEN** el envío falla
- **THEN** la isla muestra el mensaje de error y permite reintentar sin recargar

### Requirement: Endpoint único y error honesto

El endpoint SHALL configurarse en un único punto (`PUBLIC_LEAD_ENDPOINT`) usado tanto por el `action` del formulario como por el `fetch`; sin endpoint configurado o ante fallo de red/servidor, la isla SHALL mostrar el estado de error y NO SHALL mostrar éxito en ningún caso; el workflow n8n (recibe → envía PDF → notifica a Daner → agenda seguimiento) queda como TODO documentado, fuera del change.

#### Scenario: Sin endpoint configurado

- **WHEN** el endpoint no está configurado y el usuario envía
- **THEN** se muestra el estado de error (nunca un éxito falso)

#### Scenario: Fallo de red o servidor

- **WHEN** el `fetch` falla o el servidor responde con error
- **THEN** se muestra el estado de error con reintento

### Requirement: Copy del checklist

La sección SHALL usar el copy fijado: labels visibles "Email" y "¿Qué te quita el sueño?"; opciones del select "El sistema va lento y cada cambio rompe algo", "El equipo pierde horas en tareas manuales", "Nuestros datos están, pero no sirven para decidir" y "Otro / aún no lo sé", con placeholder "Selecciona una opción"; CTA "Recibir checklist →"; microcopy "Sin spam. Solo el checklist.". El copy NO SHALL prometer descarga inmediata del PDF (entrega por email; contenido del PDF pendiente — TODO del dueño).

#### Scenario: Textos exactos

- **WHEN** se inspecciona la sección construida
- **THEN** h2, subcopy, labels, opciones, CTA y microcopy coinciden con el copy fijado

#### Scenario: Sin promesa de descarga inmediata

- **WHEN** se revisa el copy de la sección
- **THEN** no se promete descarga inmediata del PDF y la entrega se describe por email

### Requirement: Accesibilidad del formulario

El formulario SHALL usar labels reales asociados a cada campo (no placeholders como etiqueta), `autocomplete="email"`, `required`, región de estado con `aria-live="polite"`, focus al mensaje de éxito/error y navegación por teclado; el layout SHALL ser de 2 columnas en `lg` (copy izquierda, formulario derecha) y de una columna en móvil (copy → formulario), sin desbordamiento horizontal entre 320 y 1440 px.

#### Scenario: Etiquetas y estado accesibles

- **WHEN** se inspecciona el HTML construido
- **THEN** cada campo tiene su label asociado y el estado se anuncia en una región `aria-live`

#### Scenario: Disposición responsive

- **WHEN** el viewport es `lg` o mayor
- **THEN** copy y formulario se distribuyen en 2 columnas; en móvil se apilan sin scroll lateral

### Requirement: Presupuesto de JavaScript y build

El build SHALL incluir únicamente scripts inline en la carga inicial — el del navbar, el loader de `client:visible` y el runtime de islas de Astro — que en conjunto SHALL sumar menos de 10 KB, sin scripts externos ni runtime de framework en la carga inicial, sin imágenes nuevas, con `global.css` intacto y sin dependencias nuevas; `pnpm astro check` SHALL terminar con 0 errores; la verificación §06 SHALL hacerse por inspección directa del dist (hook, copy, atributos del formulario, scripts inline medidos y chunk de la isla hasheado).

#### Scenario: Scripts inline de la carga inicial bajo presupuesto

- **WHEN** se inspecciona el HTML construido
- **THEN** existen exactamente 3 scripts inline (navbar + loader de directiva + runtime de islas) que suman menos de 10 KB, y ningún script externo en la carga inicial

#### Scenario: Verificación limpia

- **WHEN** se ejecutan `pnpm astro check` y `pnpm build`
- **THEN** el type-check reporta 0 errores, el build completa y el chunk de la isla queda hasheado en `dist/_astro/`
