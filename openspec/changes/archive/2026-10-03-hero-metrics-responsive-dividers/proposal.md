# Proposal

## Why

La banda de métricas del hero conserva sus separadores verticales en móvil: la utilidad `.metric-divider` (`border-left`) no tiene media query, así que a 375 px los ítems apilados "IA EN PRODUCCIÓN" y "RESPUESTA" muestran líneas verticales huérfanas de 1 px (medido con Playwright: `border-left: 1px` en ambos ítems; `border-top: 0` entre filas) mientras el `dl` sí colapsa a 1 columna (`grid grid-cols-1 sm:grid-cols-3`). Es la última instancia del patrón "divisor incondicional sin breakpoints" del proyecto. El dueño aprobó la variante A1 (utilidad responsiva).

## What Changes

- **`.metric-divider` responsivo en `src/styles/global.css`** (variante A1): base `border-top` (hairline horizontal entre filas apiladas en móvil) y, desde `min-width: 640px`, `border-top: 0` + `border-left` (vertical, como hoy en desktop). Comentario de la utilidad actualizado.
- **Spec `landing-hero`**: "separadas por hairlines verticales" → "separadas por hairlines adaptativos (horizontales en móvil; verticales desde `sm`)" + scenario nuevo "Separadores adaptativos de la franja".
- Sin cambios en: markup (`Hero.astro` intacto — los ítems conservan `metric-divider`), tokens, copy, motion ni presupuesto de JS.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `landing-hero`: la franja de métricas pasa a separadores adaptativos (horizontales en móvil, verticales desde `sm`).

## Impact

- **Estilos**: `src/styles/global.css` (1 utilidad + su comentario). `Hero.astro` no se toca.
- **Spec**: 1 delta (`landing-hero`).
- **Sin cambios**: tokens, markup, contenido, motion y dependencias.
- **Fuera de alcance**: variantes A2 (`divide-*` en el markup) y B (sin separadores en móvil), descartadas en la exploración.
