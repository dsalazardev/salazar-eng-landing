# Design: ProblemSolution — 3 dolores → 3 soluciones

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M03 completados y archivados. `index.astro` = `Navbar` (slot header) + `Hero` + `StackStrip`. La sección se monta inmediatamente después del stackstrip.
- Primitivos: `SectionLabel` (`{ index, text }` → mono xs steel + línea `bg-line`); `Card` (`{ interactive?, class? }`, `border-line bg-white p-6`) — **no se usa aquí** (reservada al bento de Servicios).
- Texturas en `global.css`: `.bg-blueprint-grid` (30 px, líneas navy 5 %) y `.bg-dot-pattern` (16 px, 15 %). Precedente de máscaras y de `<style is:global>` namespaced en StackStrip.
- Contratos vigentes: anclas `#servicios/#casos/#proceso/#faq/#contacto` (ningún enlace apunta a `#problema`); z-scale (header 40 < skip-link 50 < top layer); 0 islas; 0 JS nuevo (solo el inline del navbar, 245 B); paleta estricta; `accent` solo CTAs/hover.
- §06 de AGENTS.md rige la verificación: inspección directa del build; lo no automatizable → verificación humana documentada.

## Goals / Non-Goals

**Goals:**

- Reconocimiento inmediato del decisor con las palabras del brief (3 citas verbatim) y respuestas claras.
- Identidad visual propia de la sección (textura blueprint sutil) sin romper la alternancia ni la legibilidad.
- Cero añadidos: sin iconos, sin badges, sin CTA, sin animación, sin JS, sin dependencias.

**Non-Goals:**

- Animaciones/scroll-reveal (micro-change dedicado), cards (M05), CTA-puente, cambios en otros módulos o contratos.

## Decisions

### D1. Sección `#problema` con textura blueprint sutil

```
<section id="problema" class="relative">
  <div class="problem-texture absolute inset-0 bg-blueprint-grid" aria-hidden="true"></div>
  <div class="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24"> … </div>
</section>
```

```css
.problem-texture {
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
}
```

- **Sin `border-y`**: el `border-b` del stackstrip ya separa; bordes adyacentes duplicarían la línea. La textura es la identidad de la sección en la alternancia: hero (plano) → stack (banda con bordes) → **problema (textura)** → servicios (plano + cards).
- Fallback sin máscara: textura completa al 5 % (ya sutil) — aceptable.

*Alternativas descartadas:* `border-y` + textura (doble línea y ruido); textura solo en una esquina (no da identidad de sección); navy invertido (reservado a CtaFinal).

### D2. Encabezado con copy del brief (cero copy nuevo)

`SectionLabel index="04" text="PROBLEMA"` + fila de encabezado en grid:

- **`<h2>` "El problema que escuchamos"** (encabezado izquierdo del brief): `text-2xl sm:text-3xl font-bold tracking-tight text-navy-900`.
- **Etiqueta derecha "NUESTRA RESPUESTA"** (encabezado derecho del brief): `font-mono text-xs tracking-wider text-steel-500 uppercase`, alineada a la columna de respuestas, **`hidden lg:block`** (en móvil el h2 da contexto).

*Alternativas descartadas:* h2 pequeñito en caps (monotonía con StackStrip); copy nuevo de marketing (prohibido); omitir la etiqueta derecha (perdía el paralelismo de tabla del brief).

### D3. Ledger 3×2 (patrón tabla)

- `<ul>` de 3 `<li>`; cada par: `grid gap-3 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0`.
- Separadores: **cada `li` con `border-t border-line`** (cubre la primera línea y las intermedias) y **el `<ul>` con `border-b border-line`** (cierra la tabla, como el wireframe).
- Padding vertical de cada fila: `py-8`; encabezado con `pb-6` antes de la primera línea.
- Móvil: una columna por par con **dolor → respuesta pegados** (`gap-3`); sin scroll lateral.

*Alternativas descartadas:* cards por par (adelanta M05 y compite con la textura); `<table>` real (semántica de tabla de datos no aporta aquí y complica el apilado responsive).

### D4. Cita de dolor

`<blockquote class="border-l-2 border-line pl-4 text-lg italic text-steel-500">` — **sin comillas literales**: la regla izquierda + italic señalizan la cita (patrón editorial). Sin `<cite>` (no hay fuente). Contraste steel 4.64:1 AA ✓.

*Alternativa registrada:* añadir `«…»` si el dueño lo prefiere más adelante (ajuste de 1 línea, diferible).

### D5. Respuesta

`<p class="text-lg font-semibold text-navy-900">` — jerarquía por peso+color frente a la cita. **Sin conector "→"** (la alineación de columnas y los encabezados mapean; la flecha vive en el nombre de la sección) y **sin badges** (las respuestas son texto, no stack).

### D6. Cero iconos

100 % tipográfico (tono industrial, cero decorativo). `lucide-astro` se queda en el navbar.

*Alternativa descartada:* X/Check o ArrowRight por fila (ruido y adelanta el lenguaje de Servicios).

### D7. Sin animación

Estático (consistente con M03 y D7 del hero). El sistema de scroll-reveal se diseñará como micro-change dedicado (solo CSS, gate `prefers-reduced-motion`, nunca sobre el hero). Regla futura intacta.

*Alternativa descartada (por ahora):* pilotar aquí el fade-up con `@supports (animation-timeline: view())` — beneficio marginal en una sección tipográfica y patrón transversal sin diseñar.

### D8. Puente a servicios: narrativo/posicional

Las 3 respuestas prefiguran exactamente las líneas de servicio (arquitectura moderna → Modernización; automatización/IA → IA aplicada; copilotos/RAG → IA aplicada). **Sin CTA ni copy nuevo**; se documenta como no-elemento intencional.

### D9. Datos

Array tipado en el frontmatter del componente, verbatim del brief:

```ts
interface PainPoint {
  problem: string;
  answer: string;
}

const pains: PainPoint[] = [
  { problem: 'El sistema va lento y cada cambio rompe algo.', answer: 'Arquitectura moderna + métricas antes/después' },
  { problem: 'El equipo pierde horas en tareas manuales.', answer: 'Automatización e IA aplicada en tu flujo real' },
  { problem: 'Nuestros datos están, pero no sirven para decidir.', answer: 'Copilotos con RAG sobre tus documentos' },
];
```

*Alternativa descartada:* Content Collections (sobredimensionado para 3 pares).

### D10. Integración y estilos

- `<ProblemSolution />` en `index.astro` inmediatamente después de `<StackStrip />`; `id="problema"` como hook de test/QA.
- Estilos específicos (solo la máscara) en `<style is:global>` del componente con clase namespaced `problem-*`; **`global.css` no se toca**; 0 JS; z-scale y contrato de anclas intactos.

## Wireframes

**Desktop (≥lg):**
```
+--------------------------------------------------------------------------+
| [STACKSTRIP · border-y]                                                  |
+--------------------------------------------------------------------------+
| section#problema (relative)                                              |
|   [capa absoluta .bg-blueprint-grid + máscara vertical suave]            |
|   container max-w-6xl px-6 py-16 lg:py-24 (relative)                     |
|                                                                          |
|   04/ PROBLEMA ---------------------------------------------------       |
|                                                                          |
|   El problema que escuchamos          NUESTRA RESPUESTA                  |
|   (h2 2xl/3xl bold navy)              (mono xs steel)                    |
|                                                                          |
|   ------------------------------ border-t line ----------------------    |
|   | "El sistema va lento y cada      |  Arquitectura moderna +         |  |
|   |  cambio rompe algo."            |  métricas antes/después         |  |
|   |  (italic steel · border-l line) |  (navy semibold)                |  |
|   ------------------------------ border-t line ----------------------    |
|   | "El equipo pierde horas en      |  Automatización e IA aplicada   |  |
|   |  tareas manuales."              |  en tu flujo real               |  |
|   ------------------------------ border-t line ----------------------    |
|   | "Nuestros datos están, pero no  |  Copilotos con RAG sobre tus    |  |
|   |  sirven para decidir."          |  documentos                     |  |
|   ------------------------------ border-b line ----------------------    |
+--------------------------------------------------------------------------+
```

**Móvil (<lg):**
```
+-----------------------------------+
| [STACKSTRIP]                      |
+-----------------------------------+
| 04/ PROBLEMA ----------------     |
| El problema que escuchamos        |
|                                   |
| ----------------------------------|
| | "El sistema va lento y cada     |
| |  cambio rompe algo."            |
| |                                 |
| | Arquitectura moderna +          |
| | métricas antes/después          |
| ----------------------------------|
| | "El equipo pierde horas en      |
| |  tareas manuales."              |
| |                                 |
| | Automatización e IA aplicada... |
| ----------------------------------|
| | "Nuestros datos están, pero no  |
| |  sirven para decidir."          |
| |                                 |
| | Copilotos con RAG...            |
| ----------------------------------|
+-----------------------------------+
```

**Textura (detalle):**
```
section#problema (relative, surface)
+----------------------------------------------------+
| capa absoluta inset-0 · .bg-blueprint-grid (30px)  |
|   -webkit-mask-image + mask-image:                 |
|   linear-gradient(to bottom,                       |
|     transparent, #000 12%, #000 88%, transparent)  |
|                                                    |
| contenido (relative) por encima → legibilidad      |
+----------------------------------------------------+
```

## Risks / Trade-offs

- [Textura demasiado presente tras el contenido] → Máscara vertical + líneas al 5 %; el fallback sin máscara sigue siendo sutil; verificación humana de legibilidad registrada.
- [`mask-image` sin soporte] → Doble prefijo; sin máscara = textura completa (aceptable, decorativa).
- [Bordes adyacentes con StackStrip] → Sin `border-y` (D1).
- [Apilar "tablas" en móvil pierde la relación dolor→respuesta] → Orden vertical pegado + línea por par; sin scroll lateral.
- [La etiqueta derecha desaparece en móvil] → Intencional: el h2 da contexto; el paralelismo visual no es necesario en una columna.
- [h2 como decisión de copy] → Es verbatim del brief ("El problema que escuchamos"); confirmado.
- [Sin animación puede percibirse "plano" frente a M03] → Decisión consciente (D7); el micro-change de scroll-reveal cubrirá varias secciones a la vez.

## Migration Plan

1. Crear `src/components/sections/ProblemSolution.astro` (datos → encabezado → ledger → textura → `<style is:global>` con la máscara).
2. Montar `<ProblemSolution />` en `index.astro` tras `<StackStrip />`.
3. Verificar: `pnpm astro check` (0), `pnpm build` + inspección del HTML/CSS (máscara presente, 0 JS nuevo, sin `border-y`, textos verbatim), y registrar las verificaciones humanas.
4. Commit `feat(problemsolution): ledger 3x2 de dolores y respuestas con textura blueprint`.

Rollback: revertir el commit; sin datos ni infraestructura.

## Open Questions

- ¿Añadir comillas literales «» a las citas en el futuro? — diferible (ajuste de 1 línea); hoy sin marcas por decisión.
- ¿Cuándo entra el sistema de scroll-reveal (micro-change)? — diferible; no cambia specs ni plan de esta sección.
