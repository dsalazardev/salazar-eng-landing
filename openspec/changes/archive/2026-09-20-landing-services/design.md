# Design: Services — Bento Grid con las 3 líneas de servicio

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M04 completados y archivados. `index.astro` = `Navbar` (slot header) + `Hero` + `StackStrip` + `ProblemSolution`. La sección se monta inmediatamente después.
- Primitivos: `Card` (`{ interactive?, class? }`, `rounded-md border border-line bg-white p-6`) — **primera sección que la usa como shell de contenido** (hoy solo el panel del hero, con `p-0`); `Button` (`outline` = `border-navy-900/20` + hover accent, tamaños `md`/`lg`); `Badge` (mono xs, borde `line`); `SectionLabel` (`{ index, text }`).
- Contrato de anclas: `href="#servicios"` ×2 (navbar desktop + panel móvil) con `id="servicios"` **inexistente** → este change resuelve la primera ancla viva. `#casos` (×3) sigue pendiente de M06.
- Contratos vigentes: 0 islas; 0 JS nuevo (solo el inline del navbar, 245 B); paleta estricta de 6 tokens; `accent` solo CTAs/hover; z-scale; §06 rige la verificación (inspección del build, sin preview).
- Masa de contenido por servicio (del brief): ① promesa + 4 entregables + 4 stack ≈ 9 filas · ② promesa + 1 prueba + 3 entregables ≈ 5 · ③ promesa + 3 casos + 3 entregables ≈ 7.

## Goals / Non-Goals

**Goals:**

- Oferta clara de las 3 líneas con la anatomía uniforme del AGENTS (título, promesa, entregables, slot de stack/variantes, CTA).
- Bento responsive estable: celda doble para ①, celdas simples para ②③, apilado ①②③ en móvil, pies alineados.
- Resolver el ancla `#servicios` y mantener copy 100 % verbatim del brief.

**Non-Goals:**

- Animaciones, iconos, copy nuevo (salvo el reuso exacto del CTA), métricas nuevas, cambios en otros módulos o contratos, dependencias.

## Decisions

### D1. Sección `#servicios` plana

`<section id="servicios">` sin textura ni `border-y` (la alternancia es: problema con textura → **servicios plano + cards**; la textura de M04 se desvanece con su máscara y marca la transición). Contenedor `mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24`; `SectionLabel index="05" text="SERVICIOS"` + `<h2>` "Servicios" con el estilo de M04 (`text-2xl sm:text-3xl font-bold tracking-tight text-navy-900`).

*Alternativas descartadas:* textura o `border-y` (competiría con las cards y duplicaría la línea del stackstrip); h2 inventado (el nombre de sección del brief es la única copy disponible).

### D2. Bento 2x1 + 1x1

```
lg:  grid-cols-2  ·  gap-8
+-----------------------------+-----------------------------+
|  ① (lg:col-span-2)          |                             |
+-----------------------------+-----------------------------+
|  ②                          |  ③                          |
+-----------------------------+-----------------------------+
móvil: 1 columna, orden ①②③, gap-6
```

① ocupa la celda doble por **masa de contenido** (≈9 filas) y por orden narrativo (fundacional → prueba → diferenciador), manteniendo orden visual = orden móvil.

*Alternativa registrada:* ③ ancho abajo (crescendo IA) — válida como variante futura; descartada como default por balance de masas.

### D3. `Card` como shell

- **Sin `interactive`** (la tarjeta no navega; el hover de borde mentiría; lo interactivo es el CTA).
- `class="flex h-full flex-col"` + CTA con `mt-auto` → alturas iguales por fila y pies alineados.
- Padding: ① `lg:p-8`; ②③ `p-6` (twMerge respeta el override del primitivo).

### D4. Anatomía uniforme por servicio

| Orden | Elemento | Estilo |
|---|---|---|
| 1 | `S-0N` | `font-mono text-xs tracking-wider text-steel-500 uppercase` |
| 2 | `<h3>` título | `text-lg font-bold text-navy-900` (① `sm:text-xl`) |
| 3 | Promesa (verbatim) | `text-navy-900` (① `text-lg`) |
| 4 | Label `ENTREGABLES` | mono xs steel (misma familia de labels) |
| 5 | Lista de entregables | `<ul>` real, `<li>` con marcador `·` mono (`aria-hidden`) + texto `text-sm text-steel-500` |
| 6 | Label variable + slot 2 | label mono del brief; contenido según tipo (D5) |
| 7 | CTA | `Button variant="outline" size="md"` con `mt-auto` |

*Alternativa descartada:* entregables como línea única separada por `·` (peor escaneo y wraps sucios en móvil).

### D5. Slot 2 con label propio del brief (copy verbatim)

- ① **STACK** → 4 `Badge` (`Angular/React`, `NestJS/FastAPI`, `PostgreSQL/MongoDB`, `AWS`) en `flex flex-wrap gap-2`.
- ② **PRUEBA REAL** → una línea con la frase verbatim y la métrica enfatizada (D6).
- ③ **CASOS** → 3 líneas con el mismo patrón de lista de los entregables.

### D6. Métrica `<500 ms`

`<span class="font-mono font-bold text-navy-900 whitespace-nowrap"><500 ms</span>` inline dentro de la frase verbatim. Sin `accent` (regla), sin badge (el badge es el idioma del stack), sin número gigante (exigiría reescribir la frase del brief).

### D7. CTA secundario

Reuso exacto de **"Ver casos de estudio →"** → `#casos` en las 3 tarjetas (`Button variant="outline" size="md"`). Único texto no-verbatim del módulo y es reuso exacto de copy existente; lógica de siguiente paso hacia la prueba (M06).

*Alternativas descartadas:* "Agendar diagnóstico" ×3 (duplica el CTA primario del sitio); variantes inventadas (prohibido).

### D8. Cero iconos

100 % tipográfico (precedente M04); el `S-0N` + labels mono anclan el escaneo. `lucide-astro` se queda en el navbar.

### D9. Datos tipados

```ts
interface Service {
  code: string;        // 'S-01' | 'S-02' | 'S-03'
  title: string;
  promise: string;
  deliverables: string[];
  extra: {
    label: string;                 // 'Stack' | 'Prueba real' | 'Casos'
    kind: 'badges' | 'lines';
    items: string[];
    metric?: string;               // '<500 ms' (solo ②)
  };
}
```

- ② usa `kind: 'lines'` + `metric: '<500 ms'`: el render parte el ítem en `before + metric + after` y envuelve la métrica en el `<span>` (sin lógica ad hoc en el markup, sin alterar el texto).
- Todo el copy sale del array (una sola fuente).

*Alternativa descartada:* Content Collections (sobredimensionado para 3 servicios).

### D10. Integración y estilos

- `<Services />` en `index.astro` inmediatamente después de `<ProblemSolution />`.
- **`id="servicios"`** resuelve las 2 anclas del navbar; `<h3>` por servicio.
- **Ideal: cero CSS propio** (todo Tailwind). Si alguna regla lo exigiera (no previsto), iría en `<style is:global>` namespaced `service-*` (precedente Navbar/StackStrip/ProblemSolution); `global.css` no se toca; 0 JS; z-scale intacto.

## Wireframes

**Desktop (≥lg):**
```
+--------------------------------------------------------------------------+
| [PROBLEMSOLUTION · textura con fade-out]                                 |
+--------------------------------------------------------------------------+
| section#servicios (plana)                                                |
|  container max-w-6xl px-6 py-16 lg:py-24                                 |
|   05/ SERVICIOS --------------------------------------------------       |
|   Servicios  (h2 2xl/3xl bold navy)                                      |
|                                                                          |
|   +--------------------------------------------------------------+       |
|   | S-01  Desarrollo Fullstack a Medida              (2x1 · p-8)  |       |
|   | Promesa verbatim...                                           |       |
|   | ENTREGABLES                                                   |       |
|   |  · plataforma en producción · arquitectura documentada (C4)...|       |
|   | STACK   [ANGULAR/REACT] [NESTJS/FASTAPI] [POSTGRESQL/MONGODB] [AWS]   |
|   |                                    [Ver casos de estudio ->]  |       |
|   +--------------------------------------------------------------+       |
|   +-----------------------------+   +-----------------------------+      |
|   | S-02 Modernización de       |   | S-03 IA Aplicada en         |      |
|   |      Sistemas Legacy        |   |      Producción             |      |
|   | Promesa verbatim...         |   | Promesa verbatim...         |      |
|   | ENTREGABLES                 |   | ENTREGABLES                 |      |
|   |  · sistema migrado ...      |   |  · integración ...          |      |
|   | PRUEBA REAL                 |   | CASOS                       |      |
|   |  ...segundos a <500 ms en   |   |  · copilotos internos RAG   |      |
|   |  producción.                |   |  · agentes n8n/Python ...   |      |
|   |        [Ver casos ->]       |   |        [Ver casos ->]       |      |
|   +-----------------------------+   +-----------------------------+      |
+--------------------------------------------------------------------------+
```

**Móvil (<lg):**
```
+-----------------------------------+
| [PROBLEMSOLUTION]                 |
+-----------------------------------+
| 05/ SERVICIOS ----------------    |
| Servicios                         |
|                                   |
| +-------------------------------+ |
| | S-01 Fullstack a Medida       | |
| | promesa · entregables · stack | |
| | [Ver casos de estudio ->]     | |
| +-------------------------------+ |
| +-------------------------------+ |
| | S-02 Modernización Legacy     | |
| | promesa · entregables · <500ms| |
| | [Ver casos de estudio ->]     | |
| +-------------------------------+ |
| +-------------------------------+ |
| | S-03 IA Aplicada              | |
| | promesa · entregables · casos | |
| | [Ver casos de estudio ->]     | |
| +-------------------------------+ |
+-----------------------------------+
```

**Anatomía del bloque:**
```
+------------------------------------------+
| S-01            (mono xs, tracking)      |
| Título          (h3, bold navy)          |
| Promesa         (navy)                   |
|                                          |
| ENTREGABLES     (mono xs label steel)    |
| · ítem          (text-sm steel, <ul>)    |
| · ítem                                   |
|                                          |
| STACK | PRUEBA REAL | CASOS (label)      |
| [badges] | línea <500ms | · líneas       |
|                                          |
| [CTA outline md]            (mt-auto)    |
+------------------------------------------+
```

## Risks / Trade-offs

- [CTAs desalineados por contenido desigual (② más corto)] → `h-full flex flex-col` + `mt-auto` en el CTA; el grid estira las filas.
- [Badges del stack desbordan a 320 px] → `flex flex-wrap gap-2` + `whitespace-nowrap` por badge; apilado natural.
- [Celda 2x1 aireada] → ① es la de mayor masa; `lg:p-8` y el ancho completo la equilibran.
- [`<500 ms` con énfasis rompe el verbatim] → el render parte la frase en `before/metric/after`; el texto concatenado es idéntico al brief (verificación por grep del texto completo).
- [Ancla `#servicios` debe quedar viva sin tocar el navbar] → verificación por inspección: `id="servicios"` ×1 y `href="#servicios"` ×2 apuntando a un destino existente.
- [h2 "Servicios" es copy mínimo] → es el nombre de sección del brief; confirmado.
- [Sin animación puede percibirse plano frente a M03] → decisión consciente (consistente con M04); el scroll-reveal llegará como micro-change.

## Migration Plan

1. Crear `src/components/sections/Services.astro` (datos tipados → encabezado → bento con 3 Cards → anatomía → CTA).
2. Montar `<Services />` en `index.astro` tras `<ProblemSolution />`.
3. Verificar: `pnpm astro check` (0), `pnpm build` + inspección del HTML/CSS (`id="servicios"` ×1, textos verbatim, badges, 1 script, `global.css` intacto) y registrar las verificaciones humanas.
4. Commit `feat(services): bento grid con las 3 lineas de servicio y ancla #servicios`.

Rollback: revertir el commit; sin datos ni infraestructura.

## Open Questions

- Variante futura del bento (③ como celda doble, "crescendo IA") — diferible; no cambia specs ni plan.
- ¿Cuándo entra el sistema de scroll-reveal (micro-change transversal)? — diferible.
