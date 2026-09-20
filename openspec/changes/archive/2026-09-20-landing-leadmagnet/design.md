# Design: LeadMagnet — Checklist 27 puntos con la primera isla React

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M08 completados y archivados. `index.astro` = `Navbar` + `Hero` + `StackStrip` + `ProblemSolution` + `Services` + `ProofOfWork` + `Process` + `Founder`. La sección se monta inmediatamente después de `Founder`.
- **React listo**: `astro.config.mjs` con `react()`; `@astrojs/react@6.0.6`; `react`/`react-dom@19.3.0` (+ types). **`src/components/islands/` no existe** — este change lo crea. El sitio hoy tiene **1 script** (inline del navbar, 245 B) y 0 islas.
- **Runtime medido** (esbuild 0.28.2 minify + gzip sobre los builds de producción reales): `react` 3.4 KB + `react-dom-client` 73.5 KB + `jsx-runtime` 0.4 KB = **~77.2 KB gzip**, más el loader de islas de Astro (≈1–2 KB).
- **Sin backend**: no existe endpoint n8n ni PDF (grep en `src/` = 0); `n8n_repository` era un template. El brief §5.2 define el workflow (recibe → envía PDF → notifica a Daner → agenda) y el lead magnet ("Checklist: 27 puntos…", portada branded).
- **Conflicto de spec detectado**: `landing-base` dice "la carga inicial no incluye JavaScript de islas" — con el loader de la isla deja de ser literal (D11).
- Ritmo de secciones: fundador (banda `bg-white`) → **leadmagnet (surface plana)**; el navy está reservado a M11.
- Contratos vigentes: paleta estricta; `accent` solo CTAs/hover; §06 rige la verificación (inspección del build, sin preview). **El contrato "único script" cambia a 2 scripts medidos.**

## Goals / Non-Goals

**Goals:**

- Sección de captura con el checklist (copy aprobado) y la primera isla del sitio con runtime diferido.
- Base de formulario nativo funcional sin JS + isla React que lo mejora (`client:visible`).
- Endpoint en un único punto configurable y estados honestos (jamás éxito falso).
- Presupuesto de arranque intacto (< 10 KB) y verificación §06 actualizada (2 scripts medidos).

**Non-Goals:**

- Workflow n8n real, credenciales, PDF 27 puntos, analytics, LazyEmbed/Cal.com (M11), footer.

## Decisions

### D1. Hidratación: `client:visible` (confirmada por el dueño)

La sección está al final de la página: el runtime de React (**~77.2 KB gzip medidos**) se descarga solo al acercarse al formulario. La carga inicial mantiene el script inline del navbar (245 B) + el loader de islas (≈1–2 KB) — presupuesto < 10 KB intacto; Lighthouse no scrollea → sin impacto. `client:idle` descartada (cargaría el runtime en todas las visitas, golpeando TBT); `client:load` descartada.

*Política documentada:* el presupuesto < 10 KB aplica a la carga inicial; los runtimes de islas diferidos quedan bajo la exención de "embeds lazy" de §04.

### D2. Isla React + base de formulario nativo (progressive enhancement real)

- El HTML SSR de la isla es un **`<form action={endpoint} method="POST">`** → funciona **sin JavaScript y antes de la hidratación** (submit nativo; comportamiento documentado: navega fuera).
- Con la isla hidratada, el submit se intercepta (`fetch`) y se muestran los estados en la misma página.
- **Alternativa 0-KB registrada** (form 100 % nativo, sin isla): descartada por el dueño al aprobar D2 (la UX de estados + la autorización de React en AGENTS §02 pesan más).

### D3. Endpoint único: `PUBLIC_LEAD_ENDPOINT`

- Un solo punto configurable: `import.meta.env.PUBLIC_LEAD_ENDPOINT` leído en `LeadMagnet.astro` y pasado como prop `endpoint` a la isla; se usa en el `action` del form y en el `fetch`.
- **Payload documentado**: `{ email, necesidad }` (los `name` de los campos).
- Sin endpoint configurado o ante fallo de red/servidor → **estado de error honesto** ("No pudimos enviar tu solicitud. Intenta de nuevo."), **nunca éxito falso**.
- **TODO (dueño, fuera del change)**: workflow n8n (recibe → envía PDF → notifica a Daner → agenda seguimiento) + setear `PUBLIC_LEAD_ENDPOINT` en el entorno de deploy. Se documenta con comentario `TODO` en el código (patrón del proyecto: `Navbar.astro`, `Hero.astro` ya usan TODO comments).

### D4. PDF 27 puntos

No existe → el copy describe el checklist **sin prometer descarga inmediata** ("Recibir checklist →"; entrega por email). **TODO del dueño**: contenido + portada branded.

### D5. Copy (aprobado — fijado)

| Elemento | Texto exacto |
|---|---|
| SectionLabel | `09/ CHECKLIST` |
| `<h2>` | `Checklist: 27 puntos para modernizar tu sistema legacy` |
| Subcopy | `27 puntos concretos para auditar tu sistema actual, directo a tu correo.` |
| Label email | `Email` (+ `placeholder="tu@empresa.com"`, `autocomplete="email"`, `required`) |
| Label select | `¿Qué te quita el sueño?` |
| Placeholder select | `Selecciona una opción` |
| Opciones | `El sistema va lento y cada cambio rompe algo` · `El equipo pierde horas en tareas manuales` · `Nuestros datos están, pero no sirven para decidir` · `Otro / aún no lo sé` |
| CTA | `Recibir checklist →` |
| Microcopy | `Sin spam. Solo el checklist.` |
| Éxito | `Listo. Revisa tu correo en unos minutos.` |
| Error | `No pudimos enviar tu solicitud. Intenta de nuevo.` |
| Dogfooding | `Captación automatizada con n8n (nuestro caso #0).` |

Las 3 primeras opciones son **verbatim de M04** (los 3 dolores); la cuarta es la válvula de escape.

### D6. Micro-línea de dogfooding (confirmada)

`Captación automatizada con n8n (nuestro caso #0).` en mono xs steel, bajo el formulario o al pie del bloque de copy (ubicación exacta en D9: bajo el form). Refuerza la oferta de automatización en el momento en que el visitante la experimenta (§5.3).

### D7. Estados de la isla

```
idle --submit--> submitting --ok----> success (mensaje + focus + aria-live)
  ^                 |
  |                 +--fail----> error (mensaje + retry)
  +-- (sin endpoint configurado --> error honesto al submit)
```

- `submitting`: botón deshabilitado + texto "Enviando…".
- `success`: el formulario se reemplaza por el mensaje (no editable); focus al mensaje; región `role="status"` (`aria-live="polite"`).
- `error`: mensaje con `role="alert"` + el formulario sigue editable para reintentar.
- Validación: HTML5 (`type="email"`, `required`) + comprobación en JS con `aria-invalid`.

### D8. Accesibilidad

Labels reales y visibles (`<label for>`), `autocomplete="email"`, `required`, `aria-live` para el estado, focus management en éxito/error, navegación por teclado, ring global `:focus-visible`, contraste (inputs `border-line` sobre blanco + texto `navy-900`).

### D9. Layout y estética

```
lg (>=1024):                                   movil (<lg):
+----------------------------+  +----------+   +---------------------------+
| h2 + subcopy               |  | [Card]   |   | 09/ CHECKLIST ----------  |
| (col-span-6)               |  | FORM     |   | h2 + subcopy              |
|                            |  | (6)      |   | [Card: FORM]              |
+----------------------------+  +----------+   | micro-linea n8n           |
| micro-linea n8n (bajo el form, mono)         +---------------------------+
```

- `<section id="recurso">` **surface plana** (sin banda/textura; navy → M11); contenedor `mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`.
- Grid `mt-10 grid gap-10 lg:grid-cols-12 lg:items-start`: copy `lg:col-span-6`, formulario `lg:col-span-6` dentro de `Card` (`p-6 lg:p-8`).
- Micro-línea de dogfooding bajo el formulario (mono xs steel).

### D10. Integración

- `<LeadMagnet />` en `index.astro` tras `<Founder />`; **`id="recurso"` ×1** (hook interno, no contrato).
- **`src/components/islands/ContactForm.tsx`** (nomenclatura del AGENTS §03): `interface Props { endpoint: string }`, `useState` para estados, estilos Tailwind directos (la receta accent del `Button` replicada: `bg-accent text-white hover:bg-navy-900` — `Button.astro` no es usable dentro de `.tsx`).
- La sección importa la isla con `client:visible`.

### D11. Delta de `landing-base` (política durable de islas)

- El requisito vigente "Build estático sin JavaScript de islas" (con el escenario "HTML sin scripts de islas") **deja de ser cierto** con el loader de la isla.
- **Implementación del delta: `REMOVED` + `ADDED`** — se intentó primero `RENAMED` + `MODIFIED`, pero `openspec validate` rechaza el MODIFIED por eliminar el escenario obsoleto ("archive refuses to drop them"); REMOVED (con Reason + Migration) + ADDED es la vía documentada y sin ambigüedad.
- Nuevo requisito: **"Build estático con presupuesto de JavaScript"** — carga inicial < 10 KB (navbar + loader), runtimes de islas diferidos hasta el viewport.

### D12. Fuera de alcance

LazyEmbed (Cal.com/Loom → M11) y analytics (Plausible/Umami) quedan fuera; no se añaden dependencias (React ya está instalado).

## Wireframes

**Desktop (≥lg):**

```
+--------------------------------------------------------------------------+
| [FOUNDER · banda blanca]                                                 |
+--------------------------------------------------------------------------+
| section#recurso (surface plana)                                          |
|  container max-w-6xl px-6 py-16 lg:py-24                                 |
|   09/ CHECKLIST ------------------------------------------------         |
|   Checklist: 27 puntos para modernizar tu sistema legacy  (h2)           |
|                                                                          |
|   +----------------------------+  +----------------------------------+   |
|   | 27 puntos concretos para   |  | [Card · FORM]                    |   |
|   | auditar tu sistema actual, |  | Email *                          |   |
|   | directo a tu correo.       |  | [_______________________]        |   |
|   |                            |  | Que te quita el sueno? *         |   |
|   |                            |  | [Selecciona una opcion      v]   |   |
|   |                            |  | [ Recibir checklist -> ]         |   |
|   |                            |  | Sin spam. Solo el checklist.     |   |
|   +----------------------------+  +----------------------------------+   |
|                                  Captacion automatizada con n8n          |
|                                  (nuestro caso #0).                      |
+--------------------------------------------------------------------------+
```

**Móvil (<lg):**

```
+-----------------------------------+
| [FOUNDER · banda]                 |
+-----------------------------------+
| 09/ CHECKLIST ----------------    |
| Checklist: 27 puntos para...      |
| 27 puntos concretos para...       |
| +-------------------------------+ |
| | [Card: FORM]                  | |
| | Email *                       | |
| | [_______________]             | |
| | Que te quita el sueno? *      | |
| | [Selecciona... v]             | |
| | [ Recibir checklist -> ]      | |
| | Sin spam. Solo el checklist.  | |
| +-------------------------------+ |
| Captacion automatizada con n8n    |
| (nuestro caso #0).                |
+-----------------------------------+
```

**Flujo submit:**

```
[Visitante]
    |
    v
[Form SSR: <form action={ENDPOINT} method="POST">]
    |                                   |
    | (sin JS / pre-hidratacion)        | (isla hidratada, client:visible)
    v                                   v
[native POST -> n8n responde]      [fetch POST -> PUBLIC_LEAD_ENDPOINT]
  (TODO infra del dueno)                    |
                                            +--> [envia PDF por email]
                                            +--> [notifica a Daner]
                                            +--> [agenda seguimiento]
                                            v
                                      [estado: exito | error]
```

**Estados de la isla:**

```
idle --submit--> submitting --ok----> success (mensaje + focus + aria-live)
  ^                 |
  |                 +--fail----> error (mensaje + retry)
  +-- (sin endpoint configurado --> error honesto al submit)
```

## Risks / Trade-offs

- [~77.2 KB gzip vs promesa de rendimiento] → `client:visible` + medición post-build; la carga inicial y Lighthouse quedan intactos; alternativa 0-KB registrada (descartada por decisión del dueño).
- [Endpoint inexistente en v1] → estado de error honesto + TODO documentado; jamás éxito falso.
- [PDF inexistente] → copy "recibir", nunca "descargar"; TODO del dueño.
- [Contrato "único script" cambia a 2] → verificación actualizada: 2 scripts, ambos medidos, suma < 10 KB.
- [`Button.astro` no usable en `.tsx`] → receta accent replicada con Tailwind directo en la isla.
- [Submit nativo pre-hidratación navega fuera] → comportamiento documentado del progressive enhancement.
- [`PUBLIC_LEAD_ENDPOINT` sin setear en deploy] → el form muestra error honesto; documentar la variable en las notas de deploy (TODO del dueño).
- [Doble envío] → botón deshabilitado durante `submitting`.

## Migration Plan

1. Crear `src/components/islands/ContactForm.tsx` (form nativo + estados + a11y + copy de campos).
2. Crear `src/components/sections/LeadMagnet.astro` (shell + copy + `Card` + isla `client:visible` con prop `endpoint` desde `PUBLIC_LEAD_ENDPOINT` + micro-línea).
3. Montar `<LeadMagnet />` en `index.astro` tras `<Founder />`.
4. Verificar: `pnpm astro check` (0 errores), `pnpm build` + inspección del dist (`id="recurso"` ×1, copy, `action`/`method`, **2 scripts medidos**, chunk de isla hasheado, `global.css` intacto) y registrar verificaciones humanas.
5. Commit `feat(leadmagnet): checklist 27 puntos con la primera isla React` + commit aparte `docs(openspec): add landing-leadmagnet change artifacts`.

Rollback: revertir el commit; la sección y la isla desaparecen y el sitio vuelve a 1 script.

## Open Questions

- Ninguna bloqueante (D1–D12 resueltas). Pendientes del dueño fuera del change: workflow n8n + `PUBLIC_LEAD_ENDPOINT`, contenido del PDF, y (si algún día se prioriza) la alternativa 0-KB.
