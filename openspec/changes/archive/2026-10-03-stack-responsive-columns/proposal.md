# Proposal

## Why

La cuadrícula de "03/ Ecosistema Técnico" se solapa en viewports estrechos: el `ul` fuerza `grid-cols-3` en todo ancho y, con el chrome fijo de la celda (padding + icono + gap) y el piso de ancho del texto mono, los nombres largos ("RAG Architectures" +34 px, "AWS (Serverless)" +21 px a 375 px) se derraman sobre la celda vecina. Medición instrumentada (Playwright, server local del dueño): 5 celdas desbordadas a 375 px, 7 a 640 px (+49 px, la peor ventana) y 2 a 768 px; 0 desde 1024 px. El dueño aprobó la Opción B (columnas responsivas validadas con 0 desbordes en 375/640/768/1024/1280).

## What Changes

- **Columnas responsivas en `StackStrip.astro`** (Opción B, validada por spike read-only):
  - Retícula de grupos: `sm:grid-cols-2` → **`lg:grid-cols-2`** (los grupos se apilan a ancho completo hasta `lg`).
  - Retícula de celdas: `grid-cols-3` → **`grid-cols-1 sm:grid-cols-3`** (apiladas en móvil; 3 columnas desde `sm`, cuando el grupo ya ocupa el ancho completo).
- **Spec `landing-stackstrip`**: se documenta la distribución responsiva (1/3 columnas y apilado de grupos hasta `lg`) y se añade un scenario de "sin solapamiento entre celdas" entre 320 y 1440 px.
- Sin cambios en: contenido de celdas (nombres, bordes, iconos, enlaces), copy, motion, presupuesto de JS.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `landing-stackstrip`: la retícula pasa de "rígida" a responsiva con columnas explícitas y garantía de no solapamiento.

## Impact

- **Componente**: `src/components/sections/StackStrip.astro` (2 clases).
- **Spec**: 1 delta (`landing-stackstrip`).
- **Sin cambios**: contenido de negocio, bordes/enmarcado, motion, tokens y dependencias.
- **Fuera de alcance**: `min-w-0` en el span (innecesario tras el spike; posible red de seguridad futura), `truncate` (nombres verbatim) y la deriva conocida de "16 tecnologías".
