# Design: FAQ — Accordion nativo con ancla #faq

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M09 completados y archivados. `index.astro` = `Navbar` + `Hero` + `StackStrip` + `ProblemSolution` + `Services` + `ProofOfWork` + `Process` + `Founder` + `LeadMagnet`. La sección se monta inmediatamente después de `LeadMagnet`.
- Contrato de anclas: `href="#faq"` ×2 (navbar desktop + panel móvil) con `id="faq"` **inexistente** → este change resuelve la cuarta ancla viva. `#servicios`, `#casos` y `#proceso` ya vivas; `#contacto` pendiente de M11.
- Ritmo de secciones: 06 casos (banda blanca `border-y`) → 07 proceso (surface) → 08 fundador (banda blanca) → 09 checklist (surface) → **10 FAQ (banda blanca: continúa la alternancia par)** → 11 cierre (navy invertido).
- Presupuesto vigente: 3 scripts inline (245 + 372 + 4,380 = 4,997 B < 10 KB). El CSS construido trae `summary{display:list-item}` (preflight de Tailwind v4). Tailwind v4 expone la variante `open` = `&:is([open], :popover-open, :open)` (verificado en `node_modules/tailwindcss/dist/lib.mjs`).
- `lucide-astro@0.556.0` ya instalado (`ChevronDown.astro` disponible). 0 dependencias nuevas.
- El repo no tiene ningún `<details>`/`<summary>` previo: este es el primer uso.
- Copy: las 5 respuestas son verbatim del brief §4.7 (líneas 190-196); h2/subcopy no existen en el brief y quedan **"a confirmar por el dueño"**.
- §06 rige la verificación: inspección directa del build, sin levantar dev/preview.

## Goals / Non-Goals

**Goals:**

- Accordion nativo de 5 preguntas (`<details name="faq">` + `<summary>`), exclusividad sin JS, primera abierta.
- Resolver `#faq` (2 enlaces) sin tocar el navbar ni el resto del contrato.
- 0 JS nuevo, 0 dependencias, `global.css` intacto; banda blanca como dispositivo de ritmo.
- Copy verbatim del brief con trazabilidad por línea.

**Non-Goals:**

- Animación de altura, CTA propio, texturas, corner marks, numeración por pregunta, schema `FAQPage`, preguntas o cifras nuevas.

## Decisions

### D1. Markup: sección canónica + lista de 5 filas nativas

Estructura (modelo `Process.astro`: `<section>` → contenedor → `SectionLabel` → h2 → subcopy → contenido `mt-10`):

```astro
<section id="faq" class="border-y border-line bg-white">
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
    <SectionLabel index="10" text="FAQ" />
    <h2 class="mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">Preguntas frecuentes</h2>
    <p class="mt-3 text-steel-500">Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas.</p>

    <div class="mt-10 max-w-3xl">
      {
        faqs.map((faq, index) => (
          <details
            name="faq"
            open={index === 0}
            class:list={['group border-t border-line', index === faqs.length - 1 && 'border-b']}
          >
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <span class="font-semibold text-navy-900">{faq.question}</span>
              <ChevronDown
                class="size-4 shrink-0 text-steel-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p class="pb-4 text-sm text-steel-500">{faq.answer}</p>
          </details>
        ))
      }
    </div>
  </div>
</section>
```

- `class:list` (idiomático de Astro) para el `border-b` solo en la última fila; sin `clsx` (no se necesita merge).
- El `<span>` del summary separa el texto del chevron; el texto NO va en `<h3>` (ver D7).

*Alternativas descartadas:* `Card` por fila (más peso visual que la hairline); `<ul>/<li>` envolviendo los `details` (los `details` ya son hermanos semánticos; el spec HTML pide el grupo dentro de un contenedor, que aquí es el `<div>` de la lista).

### D2. Exclusividad nativa `name="faq"` + primera `open`

- `name="faq"` en los 5 `<details>`: como máximo una abierta a la vez. Baseline 2024: Chrome/Edge 120+ (2023-12-05/07), Safari 17.2+ (2023-12-11), Firefox 130+ (2024-09-03) (webstatus.dev/features/details-name; MDN).
- Primera pregunta `open` (restricción del spec HTML: un grupo `name` no puede tener más de un `open`): la sección arranca con contenido visible y demuestra el affordance.
- **Degradación** (pre-2024): cada `<details>` se abre/cierra independiente; sin errores, sin polyfill (sería JS, prohibido). Aceptada y documentada.

*Alternativas descartadas:* sin `name` (todas independientes — el spec HTML advierte que la exclusividad puede frustrar a quien compara respuestas; se prioriza compactar la sección de objeciones); todas cerradas (pierde el affordance y el contenido visible al llegar).

### D3. Chevron y marcador: Tailwind puro, sin `<style>` nuevo

- **Marcador nativo:** `list-none` + `[&::-webkit-details-marker]:hidden` en el `<summary>` (el preflight deja `summary{display:list-item}`; `list-none` cubre `::marker` moderno, el pseudo webkit cubre Safari viejo).
- **Chevron:** `ChevronDown` de `lucide-astro`, `size-4`, `text-steel-500`, `aria-hidden="true"`; rotación con `group-open:rotate-180` (variante `open` de Tailwind v4, ya verificada en el paquete); `transition-transform` + `motion-reduce:transition-none`.
- **Sin bloque `<style>`**: todo resuelto con utilidades; `global.css` intacto. Es el primer accordion del repo y no introduce CSS nuevo.

*Alternativas descartadas:* bloque `<style is:global>` namespaced `faq-*` (innecesario); iconos `+`/`−` con swap (dos SVG y CSS extra; el chevron es más claro).

### D4. Sin animación de altura

`interpolate-size: allow-keywords` (Chrome 129+) y `::details-content` (Chrome 131+) no son cross-browser ("limited availability", caniuse/MDN). Animarla exigiría JS (prohibido) o aceptar que solo Chrome la vea. **Decisión: sin animación de altura**; solo rota el chevron (D3). El contenido cerrado permanece en el HTML (indexable).

*Alternativa registrada:* activar la animación solo bajo `@supports (interpolate-size: allow-keywords)` — descartada: mejora marginal y añade CSS condicional que rompe el principio "0 CSS nuevo".

### D5. Fondo y ritmo visual: banda blanca

`border-y border-line bg-white` continúa la alternancia 06/08/10 (ProofOfWork y Founder ya la usan) y separa la sección de la surface de 09 y del navy de 11. Sin textura blueprint (reservada a 04) ni corner marks (reservados a visuales).

*Alternativa descartada:* surface plana como 07/09 — rompería la alternancia par y dejaría tres secciones seguidas sin contraste.

### D6. Copy (h2/subcopy **a confirmar por el dueño**; respuestas verbatim)

| Elemento | Texto exacto | Origen | Estado |
|---|---|---|---|
| `<h2>` | `Preguntas frecuentes` | Propuesta (el brief no lo define); literal y SEO-claro | **A confirmar** |
| Subcopy | `Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas.` | Propuesta derivada del brief §3 (intención: "precio, NDA, soporte, traspaso") | **A confirmar** |
| P1 | `¿Cuánto cuesta un proyecto?` → `Diagnóstico primero; cotización por alcance cerrado y fases.` | Brief L192 (§4.7) | Fijado |
| P2 | `¿Trabajan con mi equipo interno?` → `Sí; integramos o hacemos traspaso completo con documentación.` | Brief L193 (§4.7) | Fijado |
| P3 | `¿Por qué un estudio boutique y no una agencia?` → `Un solo desarrollador, sin intermediarios: menos overhead, más contexto, comunicación directa.` | Brief L194 (§4.7) | Fijado |
| P4 | `¿Qué pasa si algo falla post-lanzamiento?` → `Todo proyecto incluye periodo de soporte; retainer opcional.` | Brief L195 (§4.7) | Fijado |
| P5 | `¿Firman NDA?` → `Sí, antes de cualquier conversación técnica.` | Brief L196 (§4.7) | Fijado |

- **Cero invención**: las respuestas van verbatim; no se añaden cifras, plazos ni claims nuevos.
- **Nota de consistencia:** P1 y P4 refuerzan claims ya presentes en `Process.astro` (paso 02: "cotización por alcance cerrado y fases"; paso 04: "Todo proyecto incluye un periodo de soporte"). Es refuerzo deliberado, no contradicción; los specs fijan ambos textos.
- Cambios de copy del dueño ⇒ actualización de `design.md`/spec antes o durante el apply (no cambian el enfoque).

### D7. Medida, densidad y semántica del summary

- **Lista en `max-w-3xl`** (768 px): a 1152 px la línea de lectura de las respuestas sería excesiva. El encabezado conserva el ancho del contenedor.
- **`<summary>` con solo texto** (sin `<h3>` interno): el elemento nativo ya es navegable y anunciado como botón con estado; un heading dentro duplicaría el anuncio. El outline queda: h2 de sección + 5 botones nativos.
- **Sin numeración `Q.01`–`Q.05`**: la numeración de sección (`10/ FAQ`) ya aporta el dispositivo blueprint; añadir contadores sobrecarga.
- Respuesta `text-sm text-steel-500` (precedente de `Process.astro`); pregunta `font-semibold text-navy-900`.

### D8. Integración y ancla

- `index.astro`: `import Faq from '../components/sections/Faq.astro';` + `<Faq />` inmediatamente después de `<LeadMagnet />`. Nada más cambia.
- `id="faq"` ×1 resuelve los 2 `href` del navbar (desktop + panel móvil). El script del menú móvil (`Navbar.astro:91-100`) ya cierra el popover al pulsar cualquier ancla; no se toca. `scroll-padding-top: 5rem` (`global.css:17-18`) compensa el navbar sticky.
- `#contacto` sigue sin destino hasta M11: **no-regresión documentada**, fuera de alcance.

### D9. Verificación §06 y presupuesto

Sin servidor. Secuencia: `pnpm astro check` (0 errores) → `pnpm build` → inspección de `dist/index.html` y `dist/_astro/*.css`:

| Comprobación | Comando/criterio |
|---|---|
| Ancla única | `id="faq"` = 1 |
| Enlaces resueltos | `href="#faq"` = 2 |
| Filas nativas | `<details` = 5; `name="faq"` = 5; `<summary` = 5 |
| Primera abierta | 1 solo `open` en el grupo |
| Copy | h2, subcopy, 5 preguntas y 5 respuestas presentes |
| JS intacto | 3 scripts inline; bytes = 4,997 |
| CSS del chevron | regla `[open]` + `rotate-180` presente en `dist/_astro/*.css` |
| CSS global | `git diff` sin cambios en `global.css`; sin `<style>` nuevo |

Verificación humana pendiente (listar en el reporte): render del accordion (abierto/cerrado), teclado (Tab, Enter/Espacio, foco visible), degradación pre-2024 opcional.

### D10. Rollback

Revertir el commit del apply: la sección es independiente (cero acoplamiento; solo import + montaje en `index.astro` y un componente nuevo). Sin datos ni infraestructura.

### Modelo tipado

```ts
interface FaqItem {
  question: string; // 5 preguntas verbatim del brief §4.7
  answer: string;   // 5 respuestas verbatim del brief §4.7
}

const faqs: FaqItem[] = [ /* orden fijado: precio, equipo, boutique, soporte, NDA */ ];
```

## Wireframes

**Desktop y móvil (misma estructura de 1 columna; la lista se limita a `max-w-3xl`):**

```
+--------------------------------------------------------------------------+
| [LEAD MAGNET · surface]                                                  |
+--------------------------------------------------------------------------+
| section#faq (banda blanca border-y)                                      |
|  container max-w-6xl px-4 py-16 sm:px-6 lg:py-24                         |
|                                                                          |
|   10/ FAQ --------------------------------------------------------       |
|   Preguntas frecuentes  (h2)                                             |
|   Precio, NDA, soporte y traspaso: las ultimas objeciones, resueltas.    |
|                                                                          |
|   +--------------------------------------------------+  (max-w-3xl)     |
|   | ¿Cuanto cuesta un proyecto?                   [v] |  <- open         |
|   | Diagnostico primero; cotizacion por alcance       |                 |
|   | cerrado y fases.                                  |                 |
|   +--------------------------------------------------+                 |
|   | ¿Trabajan con mi equipo interno?              [>] |                 |
|   +--------------------------------------------------+                 |
|   | ¿Por que un estudio boutique y no una agencia?[>] |                 |
|   +--------------------------------------------------+                 |
|   | ¿Que pasa si algo falla post-lanzamiento?     [>] |                 |
|   +--------------------------------------------------+                 |
|   | ¿Firman NDA?                                  [>] |                 |
|   +--------------------------------------------------+                 |
+--------------------------------------------------------------------------+
```

**Estados y exclusividad (D2):**

```
inicial                     click en P3 (navegador con name)
+---------------+           +---------------+
| P1  open      |           | P1  closed    |
| P2  closed    |  ------>  | P2  closed    |
| P3  closed    |           | P3  open      |   <- solo una abierta
| P4  closed    |           | P4  closed    |
| P5  closed    |           | P5  closed    |
+---------------+           +---------------+
```

**Anatomía de una fila:**

```
+---------------------------------------------------------------+
| <summary>  flex justify-between, py-4, cursor-pointer         |
|   <span> pregunta (semibold navy-900)          [ChevronDown]  |
|                                                 size-4 steel  |
|                                                 group-open:   |
|                                                 rotate-180    |
| </summary>                                                    |
| <p> respuesta (sm steel-500, pb-4)                            |
+---------------------------------------------------------------+
  border-t border-line (la ultima fila ademas border-b)
```

## Risks / Trade-offs

- [Degradación pre-2024: sin exclusividad] → aceptada; sin polyfill (JS prohibido); el escenario queda cubierto en la spec y la verificación humana opcional lo registra.
- [Anuncio real de lectores de pantalla no probado] → se usa semántica nativa (rol botón + estado) y cero ARIA manual; verificación humana en el reporte.
- [Marcador nativo cross-browser] → doble mecanismo (`list-none` + `::-webkit-details-marker`); verificación visual humana.
- [Sin animación de altura] → decisión explícita (D4); alternativa Chrome-only descartada.
- [Crecimiento del HTML ~1.5–2 KB (5 respuestas + 5 SVG)] → informativo; no cuenta al presupuesto de JS (solo scripts).
- [h2/subcopy pendientes de confirmación del dueño] → Open Question; cualquier ajuste actualiza design/spec sin cambiar el enfoque.
- [Restricción del spec HTML: un solo `open` por grupo `name`] → solo la primera lleva `open`; verificado por grep en el apply.
- [`#contacto` sigue muerto hasta M11] → no-regresión documentada; fuera de alcance.
- [Contraste de `steel-500` sobre blanco ≈ 4.76:1] → cumple AA; no aclarar el tono de las respuestas.

## Migration Plan

1. Crear `src/components/sections/Faq.astro` (`FaqItem[]` → encabezado → lista de 5 `<details>` con el markup de D1).
2. Montar `<Faq />` en `src/pages/index.astro` tras `<LeadMagnet />`.
3. Verificar: `pnpm astro check` (0 errores), `pnpm build` + inspección del HTML/CSS según D9, y registrar las verificaciones humanas.
4. Commit `feat(faq): accordion nativo de 5 preguntas con ancla #faq` + commit aparte `docs(openspec): add landing-faq change artifacts`.

Rollback: revertir el commit (ver D10).

## Open Questions

- **h2/subcopy**: el dueño confirma o ajusta "Preguntas frecuentes" y "Precio, NDA, soporte y traspaso: las últimas objeciones, resueltas." antes del apply; cualquier ajuste se refleja en design/spec.
- **Desarrollo de respuestas**: se adoptan verbatim del brief (recomendado). Si el dueño prefiere 1–2 frases adicionales, se fijan antes del apply sin cambiar el enfoque.
