# Design: ProofOfWork — 3 tarjetas de evidencia con C4 inline y ancla #casos

## Context

Ver `proposal.md` — Why. Estado y restricciones que condicionan el diseño:

- M00–M05 completados y archivados. `index.astro` = `Navbar` + `Hero` + `StackStrip` + `ProblemSolution` + `Services`. La sección se monta inmediatamente después de `Services`.
- Primitivos vigentes: `Card` (`{ interactive?, class? }`; base `rounded-md border border-line bg-white p-6`), `Button` (`{ href?, variant?, size?, class? }`; `outline` = borde `navy-900/20` + hover accent), `Badge` (`{ class? }`; mono xs, borde `line`), `SectionLabel` (`{ index, text }`). **Nuevo primitivo `C4Diagram`** (D1).
- Contrato de anclas: `href="#casos"` ×6 (navbar desktop + panel móvil + CTA del hero + 3 CTAs de Services) con `id="casos"` **inexistente** → este change resuelve la segunda ancla viva. `#servicios` ya viva (M05); `#proceso`, `#faq` y `#contacto` pendientes de M07/M10/M11.
- Contratos vigentes: 0 islas; 0 JS nuevo (solo el inline del navbar, 245 B); paleta estricta de 6 tokens; `accent` solo CTAs/hover; §06 rige la verificación (inspección del build, sin preview).
- Material verificado en las dos exploraciones (fuente de todo el copy): ① `telemetry-heart-ai` (métricas reales: F1 0.9879 → `0.99`, recall crítico 1.00, 47 tests; stack Python/LangChain/n8n/IoT); ② DoliGestión (producto público en `doligestion.es`; código y derechos de la empresa; el dueño es el desarrollador; en despliegue a producción; sin repo/arquitectura/métricas propietarias); ③ `ing-sw2-project@development` (5 microservicios NestJS + frontend React + Docker Compose + Jest unit/e2e; comunicación REST síncrona, sin brokers ni websockets; `main` es un stub de 16 B).
- Estética de secciones: Hero (surface + grid + dots), StackStrip (banda `border-y`), ProblemSolution (surface + textura), Services (surface plana + cards). La alternancia disponible para M06 es banda `bg-white` + `border-y`.

## Goals / Non-Goals

**Goals:**

- 3 tarjetas de evidencia con la anatomía §4.5 (h3 "Nombre — Reto" → C4 → métricas/estado → stack → links) sobre material 100 % verificable.
- C4 inline accesible (3 variantes blueprint) sin requests ni JS.
- Resolver `#casos` (6 enlaces) sin tocar el navbar ni el resto del contrato.
- Honestidad editorial: solo métricas verificadas, solo links existentes, cero material propietario, cero copy inventado.

**Non-Goals:**

- Páginas de caso (Fase 2), Loom, caso #0 de dogfooding (M09), animaciones, iconos, dependencias nuevas, cambios en `global.css`/navbar/otras secciones/contrato de anclas.

## Decisions

### D1. `C4Diagram.astro` — SVG inline con 3 variantes

Nuevo primitivo en `src/components/ui/`:

```ts
interface Props {
  variant: 'telemetry' | 'doligestion' | 'microservices';
  title: string; // <title> accesible, único por diagrama
}
```

- Render: `<svg role="img" aria-labelledby={`c4-${variant}-title`} viewBox="0 0 320 200" class="h-auto w-full">` + `<title id={`c4-${variant}-title`}>{title}</title>` (un solo ejemplar por variante → id único en la página).
- Estilo blueprint: cajas `fill="none"` con `stroke="currentColor"`, agrupadas con clases de token (`text-line` para trazos, `text-navy-900`/`text-steel-500` para texto); labels `font-mono` 8–10 px uppercase; flechas con `marker-end`; sin hex hardcodeados (hereda paleta).
- Helpers internos del propio componente (constantes de strings SVG por variante), ~2–4 KB por diagrama; **0 requests**; sin placeholders: los 3 se construyen en este change.
- Diagramas ① y ③ son arquitecturas reales verificadas; ② es **conceptual del proceso** (D9), sin componentes internos.

*Alternativas descartadas:* imágenes raster con `astro:assets` (requests + `sharp` innecesario para vectorial, peor escalado); un diagrama genérico reutilizado (mentiría sobre los casos); placeholder textual (contra brief §3).

### D2. Métricas: solo verificadas

| Caso | Línea de métricas/estado | Fuente | Render |
|---|---|---|---|
| ① | `F1 0.99` · `Recall crítico 1.00` · `47 tests` | README público de `telemetry-heart-ai` | 3 stat badges mono bold navy con borde `line` (lenguaje "stat badge" del brief §6) |
| ② | `En despliegue a producción` | Confirmación del dueño | 1 badge de estado (borde `navy-900/20`, texto navy) |
| ③ | — | Decisión del dueño (cualitativo) | **Campo preparado, sin renderizar en v1** (sin copy inventado) |

- `F1 0.9879` se muestra como `F1 0.99` (redondeo a 2 decimales, sin exagerar); el valor completo queda en el README enlazado.
- **Prohibido inventar cifras.** Cualquier métrica futura pasa por el mismo filtro de verificabilidad (D9/D10 + spec).

*Nota:* el hueco visual del ③ se cubre con el diagrama + badges (su reto ya contiene "pruebas automatizadas", evidencia cualitativa); si el dueño aporta una línea, se añade al array sin tocar el render.

### D3. Links: solo los existentes

- ① `https://github.com/dsalazardev/telemetry-heart-ai` → "Repo →".
- ② `https://doligestion.es/` → "Producto →".
- ③ `https://github.com/dsalazardev/ing-sw2-project/tree/development` → "Repo →".
- Loom y "Caso completo →": campos `loom?` y `caseUrl?` en el tipo, **no renderizados** cuando son `undefined` (sin links muertos; preparados para Fase 2).
- Fila de links: `flex flex-wrap gap-x-4 gap-y-2`; cada link `target="_blank" rel="noopener noreferrer"` + `focus-visible:outline-2` (patrón de `Button`); subrayado en hover para affordance.

*Alternativas descartadas:* renderizar "Demo Loom"/"Caso completo →" deshabilitados o con `href="#"` (links muertos / affordance falsa); enlazar `onnadigital.com` (contexto de empresa, no el trabajo — descartado en exploración).

### D4. Layout: 3 Cards apiladas con interno 12-col alternado

```
lg (≥1024):                       móvil:
+---------------------------+     +---------------------------+
| Card ① [C4 5/12 | txt 7/12]|    | Card ①                    |
| Card ② [txt 7/12 | C4 5/12]|    |  h3 + reto                |
| Card ③ [C4 5/12 | txt 7/12]|    |  C4 (w-full)              |
+---------------------------+     |  métricas/estado          |
                                  |  stack                    |
                                  |  links                    |
                                  +---------------------------+
```

- `Card` **sin `interactive`** (la tarjeta no navega), `class="grid gap-6 lg:grid-cols-12 lg:gap-10"`.
- Diagrama `lg:col-span-5`; contenido `lg:col-span-7`; espejo ② con `lg:order-2` en el diagrama (orden DOM siempre: h3/contenido → diagrama; el `order` solo cambia lo visual en `lg`).
- Apilado entre tarjetas: `flex flex-col gap-6 lg:gap-8` (el contenedor).
- Móvil: una columna, orden natural ①②③, sin desbordamiento.

*Alternativa descartada:* grid de 3 columnas (con C4 + métricas + badges + links, cada tarjeta quedaría ilegible a ~360 px).

### D5. Header de sección

`SectionLabel index="06" text="EVIDENCIA"` + `<h2>` **"Evidencia > promesas"** (verbatim brief §3) con el estilo vigente: `mt-6 text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl`. Sin subtítulo inventado.

### D6. Estética: banda `bg-white` + `border-y` + marcas de esquina

- `<section id="casos" class="border-y border-line bg-white">`; contenedor `relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24`.
- **Marcas de esquina blueprint**: 4 `<span aria-hidden="true">` absolutos (12×12 px) en las esquinas del contenedor, cada uno con 2 bordes `border-line` (`pointer-events-none`, `hidden lg:block`), offset `-left-px/-top-px`… — chrome tipográfico del lenguaje blueprint (brief §6), sin CSS propio en `global.css`.
- La banda blanca diferencia de Services (surface plana) sin salir de la paleta; `border-y` es eco del StackStrip. El navy invertido queda reservado a CtaFinal (M11).

*Alternativas descartadas:* textura `bg-blueprint-grid` (repetiría Hero/ProblemSolution; la sección debe sentirse "documento/prueba"); fondo navy (reservado a M11).

### D7. Sin caso #0 de dogfooding

No entra: `n8n_repository` resultó ser un template de deploy de Render (sin workflows propios). El argumento de dogfooding pertenece a M09 (cuando el embudo corra sobre n8n); n8n ya aparece como badge verificado en el stack del caso ①.

### D8. `id="casos"` obligatorio

`<section id="casos">` exactamente ×1. Verificación post-build: `id="casos"` = 1 y `href="#casos"` = 6 (navbar desktop + panel móvil + hero + 3 CTAs de Services). No se toca ningún `href`.

### D9. Caso ② — marco, copy y confidencialidad

- **Marco** (crédito al producto): nombre `DoliGestión` (h3) + badges de producto `ERP/CRM` `SaaS` `España`; el rol de desarrollo lo aporta la propia sección (Proof of Work). **Sin mención de Onna Digital.**
- **Reto (exacto)**: "de deploys manuales frágiles hacia entregas estables (modernización en curso)".
- **Estado**: badge `En despliegue a producción` (no "en producción" terminado).
- **Link**: `doligestion.es` ("Producto →") — confirmado por el dueño; el copy no describe el contenido del sitio (hoy muestra la versión vieja), por lo que el enlace sigue siendo válido cuando cambie.
- **Prohibido**: mención corporativa, repo, arquitectura interna, métricas propietarias, logo/imágenes de la empresa. El **C4 ② es conceptual del proceso** (deploy manual → pipeline → entregas estables).
- **Nota**: código y derechos de la empresa; el dueño es el desarrollador y aprobó la exposición pública del producto en la exploración.

### D10. Caso ③ — ajuste verificado

- **Reto (exacto)**: "5 servicios NestJS orquestados con Docker y pruebas automatizadas".
- **"Comunicación asíncrona" retirada**: el `docker-compose.yml` verificado muestra REST síncrona por URLs entre servicios; sin brokers, websockets ni bus de eventos. No publicable.
- **Badges**: `NestJS` `Docker` `REST` `React` (**Spring Boot fuera**: no pertenece a este ecosistema verificado; vive en un repo aparte).
- **Link**: monorepo en rama `development` (la `main` es un stub).

### D11. Nota operativa (fuera del change)

El link ③ apunta a `.../tree/development`. Tarea futura del dueño (**no de este change**): poner `development` como default branch o mergear a `main`, y entonces actualizar el `href` al root del repo. Registrado en Open Questions.

## Datos y anatomía

### Modelo tipado (una sola fuente de copy)

```ts
type DiagramVariant = 'telemetry' | 'doligestion' | 'microservices';

interface CaseLink {
  label: string; // 'Repo →' | 'Producto →'
  href: string;
}

interface CaseMetric {
  label: string;                 // 'Métrica' | 'Estado'
  kind: 'stats' | 'status';
  items: string[];
}

interface Case {
  id: DiagramVariant;
  name: string;                  // 'Telemetry Heart AI' | 'DoliGestión' | 'Ecosistema de microservicios'
  challenge: string;             // reto (1 línea, exacto)
  diagramTitle: string;          // <title> accesible del SVG
  metric?: CaseMetric;           // ③ undefined (campo preparado)
  stack: string[];
  links: CaseLink[];
  loom?: string;                 // preparado, no renderizado
  caseUrl?: string;              // preparado, no renderizado
}
```

### Copy exacto por caso (verbatim confirmado)

| Caso | h3 "Nombre — Reto" | Métrica/Estado | Stack | Link |
|---|---|---|---|---|
| ① | `Telemetry Heart AI — de datos dispersos a agente clínico con RAG` | `F1 0.99` · `Recall crítico 1.00` · `47 tests` | `Python` `LangChain` `n8n` `IoT` | `Repo →` |
| ② | `DoliGestión — de deploys manuales frágiles hacia entregas estables (modernización en curso)` | `En despliegue a producción` | `ERP/CRM` `SaaS` `España` | `Producto →` |
| ③ | `Ecosistema de microservicios — 5 servicios NestJS orquestados con Docker y pruebas automatizadas` | — (campo preparado) | `NestJS` `Docker` `REST` `React` | `Repo →` |

### Anatomía por tarjeta (§4.5)

| Orden | Elemento | Estilo |
|---|---|---|
| 1 | `<h3>` "Nombre — Reto" | `text-lg font-bold text-navy-900 sm:text-xl` (separador " — ") |
| 2 | Diagrama C4 | `C4Diagram` (`variant`/`title`), `text-line`/`text-steel-500`, `lg:col-span-5` |
| 3 | Métricas/estado (si aplica) | label mono (`MÉTRICA`/`ESTADO`) + stat badges ① / badge de estado ② |
| 4 | Stack | label mono `STACK` + fila de `Badge` (`flex flex-wrap gap-2`) |
| 5 | Links | fila de links externos ("Repo →" / "Producto →") |

Labels mono con la familia vigente de Services: `font-mono text-xs tracking-wider text-steel-500 uppercase`.

### Integración

- `<ProofOfWork />` en `index.astro` inmediatamente después de `<Services />`.
- `id="casos"` ×1; `<h3>` por caso; 0 JS; `global.css` intacto; `accent` solo en hover de links (no estático).

## Wireframes

**Desktop (≥lg):**

```
+--------------------------------------------------------------------------+
| [SERVICES · surface plana + bento]                                       |
+--------------------------------------------------------------------------+
| section#casos (bg-white · border-y · marcas de esquina)                  |
|  container max-w-6xl px-6 py-16 lg:py-24                                 |
|   06/ EVIDENCIA --------------------------------------------------       |
|   Evidencia > promesas  (h2 2xl/3xl bold navy)                           |
|                                                                          |
|   +--------------------------------------------------------------+       |
|   | +---------------------+   Telemetry Heart AI — de datos      |       |
|   | |  C4 ① (5/12)        |   dispersos a agente clínico con RAG |       |
|   | |  sensor → api →     |   MÉTRICA  [F1 0.99][Recall 1.00][47]|       |
|   | |  agente+rag → dash  |   STACK    [Python][LangChain][n8n]  |       |
|   | |                     |            [IoT]                    |       |
|   | +---------------------+   [Repo →]                           |       |
|   +--------------------------------------------------------------+       |
|   +--------------------------------------------------------------+       |
|   | DoliGestión — de deploys manuales frágiles hacia entregas    |       |
|   | estables (modernización en curso)      [C4 ② (5/12, espejo)] |       |
|   | ESTADO  [En despliegue a producción]                         |       |
|   | STACK   [ERP/CRM][SaaS][España]                              |       |
|   | [Producto →]                                                 |       |
|   +--------------------------------------------------------------+       |
|   +--------------------------------------------------------------+       |
|   | +---------------------+   Ecosistema de microservicios —     |       |
|   | |  C4 ③ (5/12)        |   5 servicios NestJS orquestados...  |       |
|   | +---------------------+   STACK [NestJS][Docker][REST][React]|       |
|   |                           [Repo →]                           |       |
|   +--------------------------------------------------------------+       |
+--------------------------------------------------------------------------+
```

**Móvil (<lg):**

```
+-----------------------------------+
| [SERVICES]                        |
+-----------------------------------+
| 06/ EVIDENCIA ----------------    |
| Evidencia > promesas              |
|                                   |
| +-------------------------------+ |
| | Telemetry Heart AI — ...      | |
| | [C4 ①]                        | |
| | MÉTRICA [F1][Recall][47 tests]| |
| | STACK [Python][LangChain]...  | |
| | [Repo →]                      | |
| +-------------------------------+ |
| +-------------------------------+ |
| | DoliGestión — ...             | |
| | [C4 ②] · ESTADO · STACK       | |
| | [Producto →]                  | |
| +-------------------------------+ |
| +-------------------------------+ |
| | Ecosistema de microservicios  | |
| | [C4 ③] · STACK · [Repo →]     | |
| +-------------------------------+ |
+-----------------------------------+
```

**Bocetos C4 (ASCII de referencia para el SVG):**

```
① telemetry (arquitectura real)      ② doligestion (proceso, conceptual)
+--------------------+               +----------------------+
| SENSOR WEAR OS     |               | DEPLOY MANUAL        |
+---------+----------+               | (frágil)             |
          v telemetría               +----------+-----------+
+--------------------+                          v
| API FASTAPI        |               +----------------------+
+---------+----------+               | PIPELINE DE ENTREGA  |
          v                          +----------+-----------+
+--------------------+                          v
| AGENTE RAG         |               +----------------------+
| LangGraph · ChromaDB|              | ENTREGAS ESTABLES    |
+---------+----------+               +----------------------+
          v                          (sin componentes internos)
+--------------------+
| DASHBOARD ANGULAR  |
+--------------------+
  + n8n · 3 workflows (dashed)

③ microservices (arquitectura real)
+----------------------------------+
| FRONTEND REACT 19                |
+----------------+-----------------+
                 v REST · JWT
+----------------+-----------------+
| ms-geo-routing    ms-orders      |
+----------------+-----------------+
                 v
+----------------+-----------------+
| ms-inventory      ms-security    |
+----------------+-----------------+
                 v
+----------------------------------+
| ms-notifications (email · SMS)   |
+----------------------------------+
  Docker Compose · bridge (marco dashed)
```

## Risks / Trade-offs

- [SVG artesanal verboso y difícil de mantener] → aislado en `C4Diagram` con helpers internos y viewBox fijo; la sección solo pasa `variant`/`title`; legibilidad validada por verificación humana.
- [③ sin línea de métrica deja hueco visual] → el diagrama + badges + reto mantienen el peso; campo `metric` preparado para cuando el dueño aporte contenido.
- [Espejo en `lg` con `order` desordena el DOM] → orden DOM natural (h3/contenido primero) y `lg:order-2` solo visual; verificación humana del alternado.
- [Link a `doligestion.es` con versión vieja del sitio] → el copy no describe el sitio; href estable (dominio del producto); re-verificación post-deploy si el dominio cambiara.
- [Riesgo de filtrar material propietario del caso ②] → reglas D9 + spec (sin Onna, sin repo, sin arquitectura interna, sin métricas); revisión explícita en el apply.
- [Marcas de esquina absolutas] → `pointer-events-none` + `aria-hidden="true"`; sin impacto en layout.
- [Ancla muerta si el `id` se escribe mal] → grep post-build `id="casos"` = 1 y `href="#casos"` = 6.
- [`>` en "Evidencia > promesas" puede aparecer escapado en el HTML] → la verificación por grep tolera `>` y `&gt;`; el texto visible debe ser el verbatim.
- [3 SVG inline suman HTML] → ~2–4 KB c/u (gzip ~1–2 KB c/u); sin requests ni CLS; presupuesto JS intacto (0).

## Migration Plan

1. Crear `src/components/ui/C4Diagram.astro` (3 variantes SVG + `<title>` único + helpers internos).
2. Crear `src/components/sections/ProofOfWork.astro` (array `Case[]` → encabezado → 3 Cards con anatomía §4.5 → links).
3. Montar `<ProofOfWork />` en `index.astro` tras `<Services />`.
4. Verificar: `pnpm astro check` (0 errores), `pnpm build` + inspección del HTML/CSS (`id="casos"` ×1, `href="#casos"` ×6, h3 de los 3 casos, métricas ①, badge estado ②, badges de stack, links con `rel`/`target`, `role="img"` + `<title>`, 0 `client:*`, único `<script>` inline 245 B, `global.css` intacto) y registrar verificaciones humanas.
5. Commit `feat(proofofwork): 3 tarjetas de evidencia con C4 inline y ancla #casos` + commit aparte `docs(openspec): add landing-proofofwork change artifacts`.

Rollback: revertir el commit; sin datos ni infraestructura.

## Open Questions

- **③ métrica**: si el dueño aporta una línea cualitativa o cifras verificables, se añade al array `metric` sin tocar el render (campo preparado).
- **D11 rama del link ③**: set-default/merge `development` → `main` y actualización del `href` al root del repo (tarea futura del dueño, fuera de este change).
- **Legibilidad de los C4 en móvil** (labels 8–10 px): verificación humana; si falla, subir tamaño de label dentro del viewBox sin cambiar layout.
