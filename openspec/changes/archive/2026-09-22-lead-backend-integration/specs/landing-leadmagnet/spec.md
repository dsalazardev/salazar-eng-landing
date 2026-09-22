# Spec Delta

## MODIFIED Requirements

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

### Requirement: Sección de captura tras el fundador

La sección SHALL ser la inmediatamente posterior a la del fundador y SHALL mostrar: la etiqueta "09/ CHECKLIST", un `<h2>` "Checklist: 27 puntos para modernizar tu sistema legacy", el subcopy "27 puntos concretos para auditar tu sistema actual, directo a tu correo.", el formulario dentro de una `Card` y la micro-línea "Captación automatizada (nuestro caso #0).".

#### Scenario: Posición y encabezado

- **WHEN** se carga la página
- **THEN** la sección sigue a la del fundador y muestra la etiqueta "09/ CHECKLIST", el h2, el subcopy, el formulario y la micro-línea de dogfooding sin referencia a n8n

## REMOVED Requirements

### Requirement: Base de formulario nativo

**Reason**: La promesa de entrega sin JavaScript era inviable contra el backend real: el submit nativo envía `form-urlencoded` (no JSON `{email, need}`), recibe 422 y navega fuera del sitio, sin entregar el lead.

**Migration**: El markup `<form method="POST">` se mantiene (con `action` cuando el endpoint esté configurado) y la entrega del lead queda especificada en el nuevo requirement "Formulario con entrega por JavaScript" (isla hidratada + `<noscript>` informativo).

## ADDED Requirements

### Requirement: Formulario con entrega por JavaScript

El HTML SSR de la isla SHALL incluir un `<form>` con `method="POST"` (y `action` con el endpoint configurado cuando exista). La entrega del lead SHALL realizarse únicamente con la isla hidratada mediante `fetch` (submit interceptado, sin navegación) y el formulario NO SHALL prometer entrega sin JavaScript. El HTML SHALL incluir un `<noscript>` informativo que indique que el formulario necesita JavaScript para enviarse.

#### Scenario: Interceptación hidratada

- **WHEN** la isla está hidratada y el usuario envía el formulario
- **THEN** el submit se intercepta (sin navegación) y el resultado se muestra en los estados de la isla

#### Scenario: Aviso sin JavaScript

- **WHEN** se inspecciona el HTML construido
- **THEN** el formulario no promete entrega sin JavaScript y existe un `<noscript>` que indica que se necesita JavaScript para enviarlo

### Requirement: Configuración del endpoint

El proyecto SHALL versionar un `.env.example` (permitido por `.gitignore`) con `PUBLIC_LEAD_ENDPOINT=https://ms-notifier-webhook.onrender.com/api/v1/lead` y una nota de que la variable es de build-time (Astro la inlinea en el bundle; cambiarla exige rebuild). El `.env` local SHALL permanecer sin versionar. La documentación del proyecto SHALL registrar la variable, su naturaleza build-time y el pendiente de despliegue: setearla en el entorno de build del host y agregar el dominio de producción al allowlist CORS del backend antes del deploy.

#### Scenario: Ejemplo versionado

- **WHEN** se inspecciona el repositorio
- **THEN** existe `.env.example` con la variable y el comentario de build-time, y `.env` permanece ignorado por git

#### Scenario: Build con endpoint

- **WHEN** se construye con `PUBLIC_LEAD_ENDPOINT` seteado
- **THEN** el `action` del formulario en el HTML construido y el `fetch` de la isla usan ese endpoint
