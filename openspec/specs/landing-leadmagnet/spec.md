# landing-leadmagnet Specification

## Purpose

Sección de captura con el checklist de 27 puntos y la primera isla React del sitio: formulario con isla `client:visible` y entrega por JavaScript (con aviso `<noscript>` cuando falta JavaScript), endpoint configurable y micro-línea de dogfooding, con el hook `id="recurso"`.

## Requirements

### Requirement: Sección de captura tras el fundador

La sección SHALL ser la inmediatamente posterior a la del fundador y SHALL mostrar: la etiqueta "09/ CHECKLIST", un `<h2>` "Checklist: 27 puntos para modernizar tu sistema legacy", el subcopy "27 puntos concretos para auditar tu sistema actual, directo a tu correo.", el formulario dentro de una `Card` y la micro-línea "Captación automatizada (nuestro caso #0).".

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del fundador y muestra la etiqueta "09/ CHECKLIST", el h2, el subcopy, el formulario y la micro-línea de dogfooding sin referencia a n8n

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

### Requirement: Formulario con entrega por JavaScript

El HTML SSR de la isla SHALL incluir un `<form>` con `method="POST"` (y `action` con el endpoint configurado cuando exista). La entrega del lead SHALL realizarse únicamente con la isla hidratada mediante `fetch` (submit interceptado, sin navegación) y el formulario NO SHALL prometer entrega sin JavaScript. El HTML SHALL incluir un `<noscript>` informativo que indique que el formulario necesita JavaScript para enviarse.

#### Scenario: Interceptación hidratada

- **WHEN** la isla está hidratada y el usuario envía el formulario
- **THEN** el submit se intercepta (sin navegación) y el resultado se muestra en los estados de la isla

#### Scenario: Aviso sin JavaScript

- **WHEN** se inspecciona el HTML construido
- **THEN** el formulario no promete entrega sin JavaScript y existe un `<noscript>` que indica que se necesita JavaScript para enviarlo

### Requirement: Estados del formulario

La isla SHALL manejar los estados `idle` → `submitting` (botón deshabilitado + "Enviando…") → `success` ("Listo. Revisa tu correo en unos minutos.") → `error` (mensaje con posibilidad de reintentar); la validación SHALL ser HTML5 más comprobación en JS con `aria-invalid`. Durante `submitting`: si la petición supera ~8–10 s sin respuesta SHALL mostrarse un aviso progresivo ("El servicio está despertando; puede tardar hasta un minuto."); la petición SHALL abortarse con un timeout holgado (90–120 s) mostrando un mensaje de error propio. Un 429 SHALL mostrar un mensaje específico ("Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.") sin depender de `Retry-After`; 422/500 y fallos de red SHALL mostrar el error genérico ("No pudimos enviar tu solicitud. Intenta de nuevo.").

#### Scenario: Flujo feliz

- **WHEN** el usuario envía con datos válidos y el endpoint responde correctamente
- **THEN** la isla muestra el mensaje de éxito y el formulario deja de ser editable

#### Scenario: Flujo de error con retry

- **WHEN** el envío falla
- **THEN** la isla muestra el mensaje de error y permite reintentar sin recargar

#### Scenario: Rate limit

- **WHEN** el backend responde 429
- **THEN** se muestra el mensaje específico de demasiados intentos y se permite reintentar

#### Scenario: Cold start

- **WHEN** el envío tarda más de ~8–10 s sin respuesta
- **THEN** aparece el aviso de que el servicio está despertando, y si la petición supera el timeout holgado se aborta y se muestra un error propio

### Requirement: Endpoint único y error honesto

El endpoint SHALL configurarse en un único punto (`PUBLIC_LEAD_ENDPOINT`) usado tanto por el `action` del formulario como por el `fetch`. El contrato con el backend `ms-notifier-webhook` SHALL ser `POST` con JSON `{email, need}` (la clave del payload es `need`, nunca `necesidad`), respuesta 202 como aceptación y errores 422/429/500. Sin endpoint configurado o ante fallo de red/servidor, la isla SHALL mostrar el estado de error y NO SHALL mostrar éxito en ningún caso. El backend procesa la entrega en background (descarga del PDF y envío por email); su infraestructura queda fuera de este change.

#### Scenario: Sin endpoint configurado

- **WHEN** el endpoint no está configurado y el usuario envía
- **THEN** se muestra el estado de error (nunca un éxito falso)

#### Scenario: Payload del contrato

- **WHEN** la isla hidratada envía el formulario con datos válidos
- **THEN** el cuerpo de la petición es JSON con las claves `email` y `need` (nunca `necesidad`)

#### Scenario: Aceptación 202

- **WHEN** el backend responde 202 con `{"status":"accepted", ...}`
- **THEN** la isla muestra el estado de éxito sin intentar leer ni descargar el PDF desde el cliente

#### Scenario: Fallo de red o servidor

- **WHEN** el `fetch` falla o el servidor responde con error (422/500)
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

### Requirement: Configuración del endpoint

El proyecto SHALL versionar un `.env.example` (permitido por `.gitignore`) con `PUBLIC_LEAD_ENDPOINT=https://ms-notifier-webhook.onrender.com/api/v1/lead` y una nota de que la variable es de build-time (Astro la inlinea en el bundle; cambiarla exige rebuild). El `.env` local SHALL permanecer sin versionar. La documentación del proyecto SHALL registrar la variable, su naturaleza build-time y el pendiente de despliegue: setearla en el entorno de build del host y agregar el dominio de producción al allowlist CORS del backend antes del deploy.

#### Scenario: Ejemplo versionado

- **WHEN** se inspecciona el repositorio
- **THEN** existe `.env.example` con la variable y el comentario de build-time, y `.env` permanece ignorado por git

#### Scenario: Build con endpoint

- **WHEN** se construye con `PUBLIC_LEAD_ENDPOINT` seteado
- **THEN** el `action` del formulario en el HTML construido y el `fetch` de la isla usan ese endpoint
