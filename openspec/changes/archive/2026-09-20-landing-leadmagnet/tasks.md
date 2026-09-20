# Tasks

## 1. Isla ContactForm

- [x] 1.1 Crear `src/components/islands/ContactForm.tsx` (primera isla; se crea `islands/`): `interface Props { endpoint: string }`; `<form action={endpoint || undefined} method="post">` (base nativa SSR) con labels reales "Email" y "¿Qué te quita el sueño?", `autocomplete="email"`, `required`, placeholder `tu@empresa.com` y select con las 4 opciones + placeholder "Selecciona una opción"; estados `idle`/`submitting`/`success`/`error` con los mensajes exactos de design.md D5/D7 (botón deshabilitado + "Enviando…"; éxito reemplaza el form + focus + `role="status"`; error `role="alert"` + retry); submit hidratado interceptado con `fetch` (payload `{ email, necesidad }`); validación HTML5 + JS con `aria-invalid`; estilos Tailwind directos (receta accent del `Button`); verificar con `pnpm astro check` (0 errores) y revisión del copy contra design.md
- [x] 1.2 Endpoint y TODO: `endpoint` llega como prop (desde `PUBLIC_LEAD_ENDPOINT` en la sección); sin endpoint o fallo de red/servidor → estado de error honesto (jamás éxito); comentario `TODO` del workflow n8n (recibe → envía PDF → notifica → agenda) y de setear `PUBLIC_LEAD_ENDPOINT` en deploy (patrón TODO de Navbar/Hero); verificar con `pnpm astro check` (0 errores) y revisión de la lógica de estados

## 2. Sección LeadMagnet

- [x] 2.1 Crear `src/components/sections/LeadMagnet.astro`: `<section id="recurso">` surface plana; contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`; `SectionLabel index="09" text="CHECKLIST"`; `<h2>` "Checklist: 27 puntos para modernizar tu sistema legacy" (`mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl`); subcopy "27 puntos concretos para auditar tu sistema actual, directo a tu correo."; import de la isla con `client:visible` pasando `endpoint={import.meta.env.PUBLIC_LEAD_ENDPOINT ?? ''}`; verificar con `pnpm astro check` (0 errores) y revisión del copy
- [x] 2.2 Layout y cierre de sección: grid `mt-10 grid gap-10 lg:grid-cols-12 lg:items-start` (copy `lg:col-span-6` · formulario en `Card` `lg:col-span-6` con `p-6 lg:p-8`) y micro-línea de dogfooding "Captación automatizada con n8n (nuestro caso #0)." en mono xs steel bajo el formulario; verificar con `pnpm astro check` (0 errores) y revisión de estructura/clases

## 3. Integración

- [x] 3.1 Montar `<LeadMagnet />` en `src/pages/index.astro` inmediatamente después de `<Founder />`; verificar con `pnpm astro check` (0 errores) y que el HTML construido tiene `id="recurso"` ×1, orden fundador → recurso y los destinos del navbar intactos

## 4. Verificación de aceptación

- [x] 4.1 Ejecutar `pnpm astro check` y registrar la salida completa (0 errores) para el reporte
- [x] 4.2 Ejecutar `pnpm build` y registrar la salida; inspeccionar el HTML/CSS: `id="recurso"` ×1, h2/subcopy/labels/opciones/CTA/microcopy exactos, `<form>` con `action`/`method="post"`, **exactamente 2 scripts** (inline del navbar + loader de islas) con sus tamaños medidos (suma < 10 KB), chunk de la isla hasheado en `dist/_astro/` (tamaño gzip medido), ausencia de éxito falso, 0 imágenes nuevas y `global.css` intacto (git diff)
- [x] 4.3 Documentar la lista de verificaciones humanas pendientes del dueño (formulario en vivo: submit con/sin endpoint, estados y focus, select y validación, layout 2 col/móvil, responsive 320→1440, y que el runtime de la isla solo se descarga al llegar a la sección) para el reporte final (§06: no se levanta preview para verificar)

## 5. Cierre

- [x] 5.1 Revisar `git status`/`git diff` para confirmar el alcance (`src/components/islands/ContactForm.tsx`, `src/components/sections/LeadMagnet.astro`, `src/pages/index.astro`) y commit `feat(leadmagnet): checklist 27 puntos con la primera isla React`; verificar con `git show --stat HEAD`; los artefactos del change van en commit aparte `docs(openspec): add landing-leadmagnet change artifacts`
- [x] 5.2 Redactar el reporte final del módulo: archivos creados/modificados, salidas completas de `pnpm astro check` y `pnpm build`, hallazgos de la inspección del HTML/CSS (2 scripts medidos + chunk de isla), verificaciones humanas pendientes, decisiones no cubiertas y problemas encontrados
