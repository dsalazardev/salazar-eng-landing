# Design: Process — Timeline de 4 pasos con ancla #proceso

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M06 completados y archivados. `index.astro` = `Navbar` + `Hero` + `StackStrip` + `ProblemSolution` + `Services` + `ProofOfWork`. La sección se monta inmediatamente después de `ProofOfWork`.
- Primitivos vigentes: `SectionLabel {index, text}` (renderiza `0N/ TEXTO`); `Card`/`Badge`/`Button` no se usan en esta sección (los pasos no son tarjetas). `C4Diagram` (M06) no se reutiliza.
- Contrato de anclas: `href="#proceso"` ×2 (navbar desktop + panel móvil) con `id="proceso"` **inexistente** → este change resuelve la tercera ancla viva. `#servicios` y `#casos` ya vivas; `#faq` y `#contacto` pendientes de M10/M11.
- Ritmo de secciones: hero (surface) → stack (banda `border-y`) → problema (surface + textura con máscara) → servicios (surface plana) → casos (banda `bg-white` + `border-y` + corner marks). M07 es la sección "documento" entre la banda de evidencia y el fundador.
- Contratos vigentes: 0 islas; 0 JS nuevo (solo el inline del navbar, 245 B); paleta estricta de 6 tokens; `accent` solo CTAs/hover; §06 rige la verificación (inspección del build, sin preview).
- Copy: los 4 nombres de paso son fijos (AGENTS §03 fila 07); las descripciones son derivadas del brief (fuente por línea en D5) y quedan **"a confirmar por el dueño"**.
- Precedente de CSS: `style is:global` namespaced (`problem-texture`, `stack-*`, navbar). Esta sección debe resolverse con **Tailwind puro**; el bloque namespaced `process-*` solo se usaría si fuera imprescindible.

## Goals / Non-Goals

**Goals:**

- Timeline de 4 pasos con línea y nodos blueprint, `<ol>` semántico y numeración `01`–`04` mono.
- Resolver `#proceso` (2 enlaces) sin tocar el navbar ni el resto del contrato.
- Copy derivado y trazable al brief; única cifra existente ("20 minutos").
- 0 JS, 0 imágenes, 0 dependencias; superficie plana como único dispositivo visual.

**Non-Goals:**

- CTA propio, iconos, mini-diagramas/C4, texturas, animaciones, cambios en `global.css`/navbar/otras secciones, cifras nuevas.

## Decisions

### D1. Layout: timeline horizontal en `lg` + rail vertical en `<lg` (un solo `<ol>`)

```
lg (>=1024):                              <lg (movil/tablet):
+------+  +------+  +------+  +------+    +----+
| [01] |--| [02] |--| [03] |--| [04] |    | 01 |  Diagnostico
+------+  +------+  +------+  +------+    +--+-+  descripcion...
Titulo    Titulo    Titulo    Titulo        |
desc      desc      desc      desc        +--+-+
                                          | 02 |  Propuesta
                                          +--+-+  descripcion...
```

- **Estructura:** un único `<ol>` `relative grid gap-8 lg:grid-cols-4 lg:gap-10`.
- **Línea horizontal (`lg`):** span absoluto `hidden h-px bg-line lg:block` (posicionado al centro del nodo, `top-3` para nodo de 24 px) de borde a borde del contenedor; los nodos (`bg-surface`) la enmascaran. *Variante registrada:* recortar la línea a los centros de los nodos extremos (12 px por lado); decisión menor para el apply.
- **Nodos:** cuadrados de 24×24 px (`border border-line bg-surface`, mono xs) alineados a la izquierda de su columna, sobre la línea.
- **Rail vertical (`<lg`):** cada `li` es `grid grid-cols-[auto_1fr] gap-x-4`; la columna del nodo (`flex flex-col items-center`) contiene el nodo y un segmento `w-px flex-1 bg-line` que conecta con el siguiente paso; el último `li` no lleva segmento (condicional en el map).
- **Desktop:** `li` en `lg:block`; nodo arriba y contenido con `lg:mt-4`; los segmentos verticales del rail se ocultan (`lg:hidden`).

*Alternativas descartadas:* lista vertical (repite el patrón de filas de M04), grid 2×2 (rompe la secuencia lineal del método).

### D2. Numeración `01`–`04` mono

`code: '01'..'04'` en el array; renderizado dentro del nodo con `font-mono text-xs`. Los nodos llevan `aria-hidden="true"` (el orden lo comunica el `<ol>`; evita el doble anuncio "1. 01."). *Alternativa registrada:* `P-01` (coherente con `S-0N` de M05) — descartada por ambigüedad proceso/paso; la spec fija `01`–`04`.

### D3. Conexión: línea `border-line` + nodos, sin flechas

La línea es de 1 px en `line`; no hay flechas ni marcadores (el orden lo dan la numeración y el `<ol>`). Coherente con el lenguaje blueprint (líneas finas) y sin ruido.

### D4. Estética: surface plana

`<section id="proceso">` sin banda, textura ni corner marks: contraste deliberado con la banda blanca de M06; el único dispositivo es la línea + nodos. *Alternativa descartada:* textura `bg-blueprint-grid` (repetiría M04; la sección debe sentirse "documento de método", no "plano").

### D5. Copy (fijado — **a confirmar por el dueño**)

| Elemento | Texto exacto | Derivación | Estado |
|---|---|---|---|
| `<h2>` | `Cómo trabajamos` | Voz institucional del sitio ("modernizamos", "construimos"); responde el miedo afirmando método | **A confirmar** |
| Tagline | `Diagnóstico primero; cotización por alcance cerrado y fases.` | Brief L192 (§4.7) **verbatim**; refuerzo con la FAQ de M10 aceptado | **A confirmar** |
| 01 · Diagnóstico | `Diagnóstico técnico de 20 minutos, sin costo ni compromiso. Salimos con un plan claro, lo trabajemos o no.` | Brief L201 (§4.8) + L130 (§4.1: "20 min") | **A confirmar** |
| 02 · Propuesta | `Cotización por alcance cerrado y fases: qué se construye, en qué orden y a qué precio, antes de empezar.` | Brief L192 (§4.7) + enumeración neutra del contenido de una cotización | **A confirmar** |
| 03 · Sprints con demos | `Construcción por sprints con demos periódicas del avance, con código testeado en cada entrega.` | AGENTS §03 fila 07 + brief L155 (§4.4: "código testeado") — **variante B**: sin la cláusula de §4.6 (reservada a M08) | **A confirmar** |
| 04 · Entrega + soporte | `Plataforma en producción, con documentación y traspaso al equipo. Todo proyecto incluye un periodo de soporte.` | Brief L155 (§4.4) + L193/L195 (§4.7: traspaso con documentación, periodo de soporte) | **A confirmar** |

- **Duraciones:** solo el paso 01 lleva cifra ("20 minutos", ya existente en el brief). Prohibido inventar cifras.
- Cambios de copy del dueño ⇒ actualización de `design.md`/spec antes o durante el apply (no cambian el enfoque).

### D6. Cero iconos / sin C4Diagram

100 % tipográfico (precedente M04–M06): los iconos exigirían 4 metáforas elegidas (riesgo marketing) y el C4 no aplica (no hay arquitectura). El único gráfico es el dispositivo línea/nodos.

### D7. Sin CTA propio

El navbar sticky ya ofrece "Agendar diagnóstico" y M11 cierra la página. Un CTA aquí compite y alarga la sección. *Alternativa registrada:* reuso exacto del CTA del hero ("Agendar diagnóstico gratuito · 20 min") — descartada.

### D8. Semántica y accesibilidad

`<ol>` + `<li>` con `<h3>` (título del paso) y `<p>` (descripción); `<h2>` de sección; nodos y línea `aria-hidden="true"`; sin elementos interactivos; contraste `steel-500` sobre `surface` cumple AA.

### D9. Integración y verificación

- `<Process />` en `index.astro` inmediatamente después de `<ProofOfWork />`.
- **`id="proceso"` ×1** resuelve los 2 `href` del navbar.
- Verificación §06 en dist: `id="proceso"`=1, `href="#proceso"`=2, textos fijados presentes, numeración 01–04, `scripts`=1 (navbar 245 B), `astro-island`=0, `global.css` intacto, orden casos → proceso.

### Modelo tipado

```ts
interface ProcessStep {
  code: string;         // '01' | '02' | '03' | '04'
  title: string;        // 'Diagnóstico' | 'Propuesta' | 'Sprints con demos' | 'Entrega + soporte'
  description: string;  // copy de D5
}

const steps: ProcessStep[] = [ /* 4 pasos en orden */ ];
```

## Wireframes

**Desktop (≥lg):**

```
+--------------------------------------------------------------------------+
| [PROOF OF WORK · banda blanca + corner marks]                            |
+--------------------------------------------------------------------------+
| section#proceso (surface plana)                                          |
|  container max-w-6xl px-4 py-16 sm:px-6 lg:py-24                         |
|                                                                          |
|   07/ PROCESO --------------------------------------------------         |
|   Cómo trabajamos  (h2 2xl/3xl bold navy)                                |
|   Diagnóstico primero; cotización por alcance cerrado y fases.           |
|                                                                          |
|   +----+       +----+       +----+       +----+                          |
|   | 01 |-------| 02 |-------| 03 |-------| 04 |  <- linea + nodos        |
|   +----+       +----+       +----+       +----+                          |
|   Diagnóstico  Propuesta    Sprints con  Entrega +                       |
|                             demos        soporte                         |
|   Diagnóstico  Cotización   Construcción Plataforma en                   |
|   técnico de   por alcance  por sprints  producción, con                 |
|   20 minutos,  cerrado y    con demos    documentación y                 |
|   sin costo ni fases...     periódicas.. traspaso...                     |
|   compromiso...                                                          |
+--------------------------------------------------------------------------+
```

**Móvil (<lg, rail vertical):**

```
+-----------------------------------+
| [PROOF OF WORK · banda]           |
+-----------------------------------+
| 07/ PROCESO ----------------      |
| Cómo trabajamos                   |
| Diagnóstico primero; cotización   |
| por alcance cerrado y fases.      |
|                                   |
| +----+                            |
| | 01 |  Diagnóstico               |
| +--+--+  Diagnóstico técnico de   |
|    |     20 minutos, sin costo... |
|    |                              |
| +--+--+                           |
| | 02 |  Propuesta                 |
| +--+--+  Cotización por alcance.. |
|    |                              |
| +--+--+                           |
| | 03 |  Sprints con demos         |
| +--+--+  Construcción por sprints.|
|    |                              |
| +----+                            |
| | 04 |  Entrega + soporte         |
| +----+  Plataforma en producción..|
+-----------------------------------+
```

**Anatomía de un paso:**

```
Desktop (columna):                    Móvil (fila con rail):
+---------------------------+         +------+---------------------------+
| [01]                      |         | [01] | Diagnóstico               |
| Diagnóstico   (h3)        |         |  |   | Diagnóstico técnico de    |
| Diagnóstico técnico de 20 |         |  v   | 20 minutos, sin costo ni  |
| minutos, sin costo ni     |         |      | compromiso... (p)         |
| compromiso... (p sm steel)|         +------+---------------------------+
+---------------------------+           ^ segmento vertical (bg-line)
   nodo 24x24: border-line, bg-surface, mono xs
```

## Risks / Trade-offs

- [Densidad en 4 columnas a 1024 px] → descripciones ≤ ~120 chars (las fijadas: 01≈107, 02≈100, 03≈90, 04≈105); verificación humana 1024–1440; fallback: rail vertical hasta `xl` (1 breakpoint).
- [Copy derivado pendiente de confirmación] → fijado en design/spec con trazabilidad por línea del brief; cambios del dueño = actualización de artefactos, sin cambio de enfoque.
- [Línea edge-to-edge vs recortada] → variante recortada a centros registrada; decisión menor en apply.
- [Segmento del rail en el último paso] → condicional `index < steps.length - 1`; el último `li` sin segmento.
- [Nodo debe enmascarar la línea] → clase explícita `bg-surface` en el nodo; sin ella la línea lo cruza.
- [Tagline duplica la FAQ de M10] → aceptado como refuerzo (decisión del dueño); alternativa: quitar tagline.
- [Ancla muerta si falta el `id`] → grep post-build `id="proceso"`=1 y `href="#proceso"`=2.

## Migration Plan

1. Crear `src/components/sections/Process.astro` (array `ProcessStep[]` → encabezado → `<ol>` con nodos/línea → anatomía por paso).
2. Montar `<Process />` en `index.astro` tras `<ProofOfWork />`.
3. Verificar: `pnpm astro check` (0 errores), `pnpm build` + inspección del HTML/CSS (`id="proceso"` ×1, `href="#proceso"` ×2, textos fijados, numeración 01–04, `scripts`=1, `global.css` intacto) y registrar verificaciones humanas.
4. Commit `feat(process): timeline de 4 pasos con ancla #proceso` + commit aparte `docs(openspec): add landing-process change artifacts`.

Rollback: revertir el commit; sin datos ni infraestructura.

## Open Questions

- **Copy final**: el dueño confirma (o ajusta) h2, tagline y las 4 descripciones; cualquier ajuste se refleja en design/spec antes del apply.
- **Línea recortada vs edge-to-edge**: detalle visual diferible al apply (2 clases de diferencia).
