# Design

## Context

Ver `proposal.md` para la motivación. Medición instrumentada (spike read-only con el server local del dueño; browser cerrado en el mismo paso):

| Viewport | Ítems 2-3 `border-left` | `border-top` entre filas | Estado |
|---|---|---|---|
| 375 px | 1 px (huérfano) | 0 px | roto |
| 1280 px | 1 px (correcto) | 0 px | OK |

La utilidad `.metric-divider` (`global.css`, L77-80) es `border-left` sin media query; el `dl` del hero (`grid grid-cols-1 sm:grid-cols-3`) ya colapsa. Se usa solo en la banda de métricas del hero (2 usos).

## Goals / Non-Goals

**Goals:**

- Separadores adaptativos: horizontales entre filas apiladas en móvil; verticales desde `sm`.
- Conservar el vocabulario del design system (la utilidad sigue existiendo) y el markup intacto.

**Non-Goals:**

- Cambiar el markup del hero, tokens, copy o motion.
- Variantes A2/B (descartadas en la exploración).

## Decisions

### 1. A1 — utilidad responsiva (elegida)

`.metric-divider`: base `border-top: 1px solid var(--color-line);` + `@media (min-width: 640px) { border-top: 0; border-left: 1px solid var(--color-line); }`. Un solo archivo, markup intacto.

- Alternativa A2 (`divide-y divide-line sm:divide-y-0 sm:divide-x` en el `dl`): idiomática Tailwind, pero toca 4 puntos (dl + 2 ítems + retiro de la utilidad) y añade un patrón no usado en el proyecto. Descartada.
- Alternativa B (sin separadores en móvil): más minimalista pero pierde la lectura de "tabla de instrumento". Descartada.

### 2. Eje superior (`border-top`) en lugar de inferior (`border-b`)

`border-top` en los ítems 2-3 evita la línea colgante del último ítem sobre el cierre de la sección (que exigiría `last:border-b-0`). Coincide además con el patrón de "hairline que abre cada fila".

### 3. Breakpoint 640 (`sm`)

Coincide con el `sm:grid-cols-3` del propio `dl` — el cambio de eje ocurre exactamente cuando la banda pasa de 1 a 3 columnas. (Nota: el valor vive en `global.css`; si el tema cambiara los breakpoints, habría que revisitarlo.)

## Risks / Trade-offs

- [Breakpoint 640 hardcodeado en la utilidad global] → Coincide con el default de Tailwind y con el `sm` del grid; riesgo bajo, documentado.
- [La utilidad cambia de significado (de "vertical" a "adaptativa")] → El comentario se actualiza; el nombre sigue siendo válido y solo la usa esta banda.
- [Regresión en desktop] → La medición de verificación comprueba 1280 px (`border-left` 1 px, `border-top` 0) además del móvil.

## Migration Plan

1. Actualizar `.metric-divider` + comentario en `global.css`.
2. Verificación: build + check + inspección del CSS construido (regla base + media query) + medición puntual (375 → `border-top` 1 px / `border-left` 0; 1280 → `border-left` 1 px / `border-top` 0).
3. Commit selectivo (sin push sin confirmación).
4. Rollback: revertir el commit (1 utilidad).
