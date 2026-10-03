# Tasks

## 1. Refactor del componente

- [x] 1.1 En `src/components/sections/StackStrip.astro`, envolver la cuadrícula en un wrapper `mx-auto max-w-6xl px-4 sm:px-6` (sin `w-full`) y dejar la retícula interna con `grid border-t border-l border-line sm:grid-cols-2`; actualizar el comentario para describir la estructura contenida y enmarcada, restaurar la llave `{` del mapeo en su propia línea y absorber el WIP; verificar por inspección que el div de la retícula ya no lleva `mx-auto`/`px-4` y que el wrapper no lleva `w-full`

## 2. Verificación integral

- [x] 2.1 `pnpm build` completa sin errores y `pnpm astro check` reporta 0 errores
- [x] 2.2 Inspección directa del build (sin preview): wrapper presente, retícula con `border-t border-l`, hook `data-motion="stack-power"` ×1, 12 celdas, 4 etiquetas de categoría, 12 símbolos, copy intacto y ausencia de `w-full` en el wrapper
- [x] 2.3 Registrar pendientes humanos: pasada visual (bordes cerrados en los 4 lados, alineación con el header, responsive 320→1440, hover de celdas)

## 3. Cierre

- [x] 3.1 Commit selectivo (`fix(stack): ...` + artefactos OpenSpec), sin push sin confirmación, y verificación con `git log`
- [x] 3.2 Reporte final §06 con evidencia y pendientes
