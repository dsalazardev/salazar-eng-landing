# Tasks

## 1. Configuración del endpoint

- [x] 1.1 Crear `.env.example` versionado con `PUBLIC_LEAD_ENDPOINT=https://ms-notifier-webhook.onrender.com/api/v1/lead` y comentario de build-time (se inlinea; cambiarla exige rebuild); verificar con `git check-ignore .env` (ignorado) y `git check-ignore .env.example` (no ignorado)
- [x] 1.2 Documentar en `AGENTS.md` la variable, su naturaleza build-time y el pendiente de deploy (setearla en el entorno de build del host + agregar el dominio de producción al CORS del backend); verificar por grep de `PUBLIC_LEAD_ENDPOINT` en `AGENTS.md`

## 2. Contrato y errores del formulario

- [x] 2.1 Renombrar la clave del payload a `need` y el `name` del `<select>` a `need` en `ContactForm.tsx` (label visible intacto); verificar con `pnpm build` + grep del chunk de isla: `need` presente y `necesidad` ×0
- [x] 2.2 Añadir la rama explícita de 429 con mensaje estático "Demasiados intentos seguidos. Espera un minuto e intenta de nuevo." (sin leer `Retry-After`); verificar con `pnpm astro check` (0 errores) y grep del string en el chunk compilado
- [x] 2.3 Introducir `errorMessage` condicional (genérico / rate limit / timeout) en la región `role="alert"`, limpiándolo al reintentar y al pasar a éxito; verificar con `pnpm astro check` y grep de los 3 strings en el chunk
- [x] 2.4 Añadir `AbortController` con timeout de 120 s (`signal` en el `fetch`, `clearTimeout` en `finally`) y mensaje propio "El servicio tardó demasiado en responder. Intenta de nuevo." en `catch` cuando la señal fue abortada; verificar con `pnpm astro check` y grep de `AbortController` + el string de timeout en el chunk

## 3. Cold start (aviso progresivo)

- [x] 3.1 Implementar el aviso progresivo: `useEffect` sobre `status === 'submitting'` con timer de 9 s y cleanup (limpia el timer y resetea `slow`), renderizado como `<p role="status">` con "El servicio está despertando; puede tardar hasta un minuto."; verificar con `pnpm astro check` y grep del string en el chunk

## 4. Fallback sin JS y copy

- [x] 4.1 Añadir `<noscript>` con "Este formulario necesita JavaScript para enviarse. Actívalo para recibir el checklist." en `LeadMagnet.astro`, dentro de la `Card` junto a la isla; verificar con grep de `<noscript>` en `dist/index.html` y del texto
- [x] 4.2 Cambiar la micro-línea a "Captación automatizada (nuestro caso #0)." en `LeadMagnet.astro`; verificar con grep en `dist/index.html` del texto nuevo y ausencia de `n8n` en la sección
- [x] 4.3 Reescribir el TODO de `ContactForm.tsx` (líneas ~38-39) sin referencias a n8n, mencionando el backend real y `.env.example`; verificar con grep de `n8n` en `src/` (×0 en los archivos del change; las 4 coincidencias restantes están en otras secciones fuera de alcance — desviación declarada)

## 5. Verificación §06 (sin servidor)

- [x] 5.1 Ejecutar `pnpm astro check` y `pnpm build` (sin env) y confirmar 0 errores y build OK; verificar además que no queda ningún proceso en background
- [x] 5.2 Construir con `PUBLIC_LEAD_ENDPOINT` seteado como variable de proceso y verificar en `dist/index.html`: `action="https://ms-notifier-webhook.onrender.com/api/v1/lead"`, `name="need"`, `<noscript>` presente, `id="recurso"` ×1 y 3 scripts inline que suman < 10 KB
- [x] 5.3 Verificar el chunk de la isla en `dist/_astro/`: `need` presente, `necesidad` ×0, strings de 429/aviso/timeout y `AbortController` presentes, y `client:visible` intacto (runtime de React solo en chunk diferido)
- [x] 5.4 Registrar como verificación humana pendiente del dueño: 1 submit real de prueba (E2E contra `ms-notifier-webhook`, enviando un email de prueba) — prohibido en la verificación automatizada

## 6. Cierre

- [x] 6.1 Commit con conventional commit (`feat(leadmagnet): integrar formulario con ms-notifier-webhook`) sin push; verificar con `git status` que solo se commitearon los archivos del change (código, `.env.example`, `AGENTS.md`, artefactos OpenSpec)
