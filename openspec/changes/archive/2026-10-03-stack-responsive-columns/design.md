# Design

## Context

Ver `proposal.md` para la motivación. Medición instrumentada (spike read-only sobre el DOM con el server local del dueño; browser cerrado en el mismo paso):

| Viewport | Celdas con desborde (actual) | Con la Opción B |
|---|---|---|
| 375 px | 5 (máx +34 px) | 0 |
| 640 px | 7 (máx +49 px) | 0 |
| 768 px | 2 (máx +28 px) | 0 |
| 1024 px | 0 | 0 |
| 1280 px | 0 | 0 |

Mecánica del defecto: `grid-cols-3` fijo + chrome de celda (62 px: padding 32 + icono 20 + gap 10) + piso `min-content` del texto mono (p. ej. "ARCHITECTURES" ≈ 86 px) sin guardas de recorte; y `sm:grid-cols-2` en los grupos estrecha el grupo a la mitad desde 640 px (la peor ventana).

## Goals / Non-Goals

**Goals:**

- Cero solapamiento entre celdas entre 320 y 1440 px con breakpoints estándar.
- Documentar la distribución responsiva en la spec (scenario nuevo).

**Non-Goals:**

- `min-w-0`/`truncate` (descartados: el spike da 0 desbordes sin ellos; los nombres son verbatim).
- Rediseñar celdas, bordes, copy o motion.
- Sincronizar la deriva "16 tecnologías" (fuera de alcance).

## Decisions

### 1. Opción B: grupos a 1 columna hasta `lg` + celdas 3-across desde `sm`

- `<640 px`: celdas apiladas (ancho completo) — sin desborde posible.
- `640–1023 px`: grupos a ancho completo con 3 celdas (~197–325 px por celda) — la ventana que hoy se rompe.
- `≥1024 px`: 2×2 grupos con 3 celdas (~162 px) — como hoy.

Alternativa A (`grid-cols-1 lg:grid-cols-3`): igual de segura pero sección más alta en tablet; descartada por densidad. Alternativa "solo celdas `sm:grid-cols-3`": insuficiente — a 640 px los grupos pasan a 2 columnas y las celdas vuelven a ~97 px (medido: +49 px).

### 2. Sin guardas de recorte

No se añade `truncate`/`break-words`: con la Opción B el texto cabe; truncar nombres verbatim sería peor. `min-w-0` queda como posible red de seguridad futura (no incluida en este cambio).

### 3. Verificación con la misma instrumentación

La re-verificación repite la medición del spike (medición puntual con el server del dueño, browser cerrado en el mismo paso) + inspección del dist + build/check.

## Risks / Trade-offs

- [Cambio de densidad en 640–1023 px (grupos full-width)] → Es el comportamiento aprobado (Opción B); el barrido visual humano lo valida.
- [Nombres futuros más largos que "ARCHITECTURES"] → Margen actual: celda mínima 162 px vs umbral medido ~148 px; si se excede, `min-w-0` es la siguiente palanca.
- [Deriva "16 tecnologías" no resuelta] → Non-goal anotado.

## Migration Plan

1. Aplicar las 2 clases en `StackStrip.astro`.
2. Verificación: build + check + inspección del dist + medición puntual (375/640/768/1024/1280 → 0 desbordes).
3. Commit selectivo (sin push sin confirmación).
4. Rollback: revertir el commit (cambio de 2 clases).
