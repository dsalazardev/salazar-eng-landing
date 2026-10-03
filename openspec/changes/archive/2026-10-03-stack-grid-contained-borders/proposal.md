# Proposal

## Why

La cuadrícula del stack quedó con dos defectos visuales de borde: la línea superior sobresale del contenido (el `border-t` vive en el mismo elemento que el padding de contención, así que se dibuja sobre el border-box mientras las celdas viven en el content-box) y el costado izquierdo está abierto (ninguna pieza tiene `border-l`). Además, el dueño decidió convertir la cuadrícula de full-bleed a contenida (`max-w-6xl`), lo que contradice la directiva "full-bleed" vigente en la spec `landing-stackstrip`; existe un WIP sin commitear en `StackStrip.astro` que formaliza esa decisión.

## What Changes

- **Doble contenedor en `StackStrip.astro`**: wrapper externo solo de posicionamiento y padding (`mx-auto max-w-6xl px-4 sm:px-6`, **sin `w-full`** por ser redundante) y retícula interna con estructura y bordes (`grid border-t border-l border-line sm:grid-cols-2`), cerrando la tabla por sus cuatro lados.
- **Limpieza del componente**: comentario actualizado (ya no describe full-bleed), llave `{` del mapeo restaurada a su propia línea y absorción del WIP actual.
- **Spec `landing-stackstrip`**: se elimina la directiva "full-bleed" y se documenta formalmente que la cuadrícula es **contenida y enmarcada** (wrapper + retícula con bordes). El scenario "Cinta full-bleed" se retira re-emitiendo el requisito de la franja con nombre actualizado ("Franja de validación tras el hero con cuadrícula contenida"), porque el validador de deltas no permite renombrar scenarios dentro de un bloque MODIFIED; el contenido se conserva íntegro.
- Sin cambios en: celdas, bandas de categoría, iconos, enlaces, animación (`data-motion` permanece en la retícula), copy ni contenido de negocio.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `landing-stackstrip`: la cuadrícula pasa de full-bleed a contenida y enmarcada; se retira la directiva "full-bleed" de los requisitos que la describen.

## Impact

- **Componente**: `src/components/sections/StackStrip.astro` (estructura de la cuadrícula + comentario).
- **Spec**: 1 delta (`landing-stackstrip`).
- **Sin cambios**: contenido de negocio, motion, presupuesto de JS, tokens y dependencias.
- **Fuera de alcance (deriva conocida)**: la spec aún describe "16 tecnologías" (el sitio usa 12 desde una iteración anterior); no se sincroniza aquí.
