# Design: StackStrip — franja de validación técnica (marquee CSS)

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M02 completados y archivados. `index.astro` = `Navbar` (slot header) + `Hero`. La franja se monta inmediatamente después del hero.
- `Badge` (API real): `Props { class?: string }` + slot; clases `font-mono text-xs uppercase tracking-wider text-steel-500 border border-line rounded-sm px-2.5 py-1` fusionadas con twMerge → admite `whitespace-nowrap` externo.
- Baseline construido: **0 `@keyframes`, 0 `animation`, 0 `mask-image`** en `dist/_astro/index.*.css` → es la primera animación del proyecto.
- Contratos vigentes: anclas `#servicios/#casos/#proceso/#faq/#contacto` (ningún enlace apunta a la franja); z-scale (header 40 < skip-link 50 < top layer); 0 islas; 0 JS nuevo (hoy solo el micro-script inline del navbar, 245 B); paleta estricta de 6 tokens.
- §06 de AGENTS.md rige la verificación: inspección directa del build; lo no automatizable → verificación humana documentada.

## Goals / Non-Goals

**Goals:**

- Franja sobria con encabezado del brief y cinta full-bleed continua, sin JS y con loop exacto (sin salto).
- Accesibilidad de movimiento real: pausa con cursor/foco, toggle por teclado y modo reducido estático.
- Cero impacto en presupuesto (0 JS, 0 imágenes, CLS 0, sin scroll horizontal).

**Non-Goals:**

- Banda navy, separadores de grupos, pausa táctil, triple copia, datos externos.
- No se toca `global.css`, navbar, hero ni el contrato de anclas.

## Decisions

### D1. Sección, banda y ritmo

`<section id="stack" class="border-y border-line">` sobre `surface` (divisor blueprint entre hero y la futura ProblemSolution; la inversión navy queda reservada a `CtaFinal`). Encabezado en `mx-auto max-w-6xl px-4 sm:px-6` con `py-8 lg:py-12`; la cinta es **full-bleed** (fuera del contenedor, dentro de la banda).

*Alternativas descartadas:* banda navy (roba el golpe del cierre), cinta dentro del contenedor (pierde fuerza y recorta el ritmo).

### D2. Copy del encabezado

`SectionLabel index="03" text="STACK"` + `<h2>` visible "STACK DE PRODUCCIÓN" (`text-sm font-bold uppercase tracking-widest text-navy-900`) + tagline **en italic** "Tecnología elegida por resultados, no por moda." (`text-sm italic text-steel-500`), en una fila `flex flex-wrap items-baseline gap-x-3 gap-y-1`. El `<h2>` mantiene el outline del documento (h1 del hero → h2 de secciones).

### D3. Técnica del marquee (anti-salto, la decisión núcleo)

```
Pista (track):  display:flex; width:max-content; SIN gap
Copia 1:        display:flex; gap-x:40px; padding-right:40px   <- el gap final vive DENTRO
Copia 2:        idéntica (aria-hidden="true")
=> ancho del track = 2 × W  =>  translateX(-50%) = −W exacto  =>  reinicio sin salto
```

- `@keyframes stack-marquee { to { transform: translateX(-50%) } }` — **solo `transform`** (compositor, cero layout thrash).
- `animation: stack-marquee var(--stack-marquee-duration, 36s) linear infinite;` con `--stack-marquee-duration: 36s` (≈49 px/s con una copia estimada de ≈1 772 px; rango sano 30–40 s).
- `will-change: transform` **solo** en el track (una capa compuesta).
- Wrapper `overflow-hidden` + `py-2` (evita recortar bordes/foco de los badges).

*Alternativas descartadas:* gap entre copias en el track (track = 2W + G → `translateX(-50%)` salta G/2, error clásico); JS con `requestAnimationFrame` (rompe el presupuesto 0 JS); triple copia (innecesaria con la resta exacta).

### D4. Pausas sin JavaScript (WCAG 2.2.2 estricto)

- `.stack-marquee:hover .stack-track`, `.stack-marquee:focus-within .stack-track` → `animation-play-state: paused`.
- **Toggle por teclado**: `<input id="stack-pause" type="checkbox" class="peer sr-only">` + `<label for="stack-pause" class="... sr-only focus:not-sr-only ...">Pausar animación</label>`; el track pausa con `input:checked ~ .stack-track { animation-play-state: paused }`. El label se hace visible al recibir foco (arriba a la derecha de la banda, con `bg-surface` y borde `line`).
- Distinción: hover/`focus-within` cubren ratón; el toggle es el mecanismo operables por teclado que exige 2.2.2.

*Alternativa descartada:* confiar solo en hover + reduced-motion (deja fuera a usuarios de teclado; área gris de cumplimiento).

### D5. Movimiento reducido

`@media (prefers-reduced-motion: reduce)`: `animation: none`; duplicado `display: none`; la primera copia pasa a `flex-wrap` centrada (lista completa estática y legible). La banda crece en alto si hace falta (contenido manda).

### D6. Máscara lateral

`-webkit-mask-image` + `mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)` en el wrapper. Sin soporte de máscara (o si falla), el `overflow-hidden` produce recorte duro: decorativo y aceptable, sin romper el layout.

### D7. Badges y datos

- `Badge class="whitespace-nowrap"` reutilizado tal cual (sin tocar su API ni sus clases base).
- Array tipado en el frontmatter del componente con las **16 tecnologías verbatim del brief en su orden** (Angular, React, NestJS, Spring Boot, Node.js, PHP, Python / FastAPI, PostgreSQL, MongoDB, AWS, Docker, Terraform, Pulumi, LangChain, Ollama, n8n). Ojo al espaciado exacto de `Python / FastAPI`.
- Una sola constante `stack: string[]` renderizada dos veces (dos `<ul>`); gap uniforme de 40 px; sin separadores ni agrupaciones.

*Alternativas descartadas:* Content Collections o archivo de datos (sobredimensionado para 16 strings), separadores de grupo (rompen la cadencia y ensucian).

### D8. Accesibilidad estructural

- Primera copia: `<ul>`/`<li>` reales (lista de tecnologías en el DOM y en AT).
- Duplicado: `aria-hidden="true"` (no se anuncia).
- `<h2>` etiqueta la sección; el único elemento enfocable añadido es el toggle de pausa.
- Wrapper `overflow-hidden` sin elementos enfocables dentro (no hay trampas de foco ni scroll de teclado).

### D9. Ubicación de estilos

Todos los estilos del módulo (keyframes, máscara, pausas, `reduced-motion`, layout de la cinta) en **`<style is:global>` de `StackStrip.astro`** con clases namespaced `stack-*` (precedente Navbar). `global.css` **no se toca**: la animación es un concern local del módulo.

*Alternativa descartada:* token `--animate-marquee` en `@theme` de `global.css` (válido, pero ensucia el CSS global con una animación de un solo uso).

### D10. Integración

`<StackStrip />` en `index.astro` inmediatamente después de `<Hero />`; `id="stack"` como hook de test/QA; 0 JS nuevo; z-scale y contrato de anclas intactos; la lista no se enlaza desde el navbar (no aplica).

## Wireframes

**Desktop (banda full-bleed):**
```
+==============================================================================+
|  [HERO ...]                                                                  |
+------------------------------------------------------------------------------+ <- border-t (line)
|                                                                              |
|   03/ STACK -----------                                                      |
|   STACK DE PRODUCCION   *Tecnologia elegida por resultados, no por moda.*    |
|                                                                              |
|   ,--fade------------------- cinta full-bleed ----------------fade--,        |
|   |  [ANGULAR] [REACT] [NESTJS] ... [OLLAMA] [N8N] [ANGULAR] ...    |        |
|   '-----------------------------------------------------------------'        |
|                                                                              |
+------------------------------------------------------------------------------+ <- border-b (line)
```

**Móvil:**
```
+---------------------------------+
| [HERO]                          |
+---------------------------------+
| 03/ STACK ------                |
| STACK DE PRODUCCION             |
| *Tecnologia elegida por...*     |
| ,-fade---------------------fade-,
| | [ANGULAR] [REACT] ...      |  |
| '----------------------------'  |
+---------------------------------+
```

**Mecánica del loop (correcta vs incorrecta):**
```
CORRECTA: el gap final vive DENTRO de cada copia (gap-x:40 + pr:40)
track (w-max, flex, SIN gap)  <----------------- 2W ----------------->

+------------------------------+------------------------------+
| copia 1  (W)                 | copia 2 (W, aria-hidden)     |
|[ANGULAR][REACT]...[N8N]  |>40|[ANGULAR][REACT]...[N8N]  |>40|
+------------------------------+------------------------------+
                               ^ costura = 40 = gap interno => ritmo uniforme

keyframes:  translateX(0)  -->  translateX(-50%)  =  -W

t=0    |<-- viewport ve desde aqui
t=fin                    |<-- viewport ve desde aqui (-W)
                          ^ misma imagen pixel a pixel => reinicio invisible

INCORRECTA (gap entre copias en el track):
track = 2W + 40 ; translateX(-50%) = -(W+20) => SALTO de 20px por ciclo
```

## Risks / Trade-offs

- [Salto en la costura por gap mal colocado] → Receta D3 exacta + verificación por inspección del CSS (`translateX(-50%)`, `pr` en la copia, track sin gap) + pasada humana del bucle.
- [`mask-image` sin soporte] → Doble prefijo; sin máscara el recorte duro es aceptable (decorativo).
- [El toggle de pausa añade un tab-stop] → `sr-only` hasta foco; es el precio de cumplir 2.2.2 estricto; documentado en la spec.
- [Velocidad subjetiva] → Default 36 s en variable CSS; ajuste fino tras la pasada humana (open question diferible).
- [Reduced-motion cambia la altura de la banda] → Aceptable (contenido manda); no hay CLS porque no hay layout animado.
- [Fuente mono con fallback] → El loop no depende de anchos fijos: `translateX(-50%)` es relativo ✓.
- [Badge "PYTHON / FASTAPI" más largo] → `whitespace-nowrap` + gap uniforme lo absorben.
- [Interacción hover vs toggle] → Independientes: cualquiera pausa; al desactivar el toggle, hover/foco siguen mandando.

## Migration Plan

1. Crear `src/components/sections/StackStrip.astro` (array de 16 → estructura de banda → cinta con 2 copias → toggle de pausa → `<style is:global>` con keyframes/máscara/pausas/reduced-motion).
2. Montar `<StackStrip />` en `index.astro` tras `<Hero />`.
3. Verificar: `pnpm astro check` (0), `pnpm build` + inspección del CSS construido (keyframes/transform/máscara/@media presentes; sin JS nuevo; sin overflow), y pasada humana del bucle y reduced-motion.
4. Commit `feat(stackstrip): franja de stack con marquee CSS y pausas accesibles`.

Rollback: revertir el commit; sin datos ni infraestructura.

## Open Questions

- Ajuste fino de la velocidad (36 s) tras la pasada humana — diferible; no cambia specs ni plan.
- ¿El hook `#stack` se usará en algún enlace futuro? — diferible; hoy no altera el contrato de anclas.
