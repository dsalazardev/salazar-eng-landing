# Tasks

## 1. Columnas responsivas

- [x] 1.1 En `src/components/sections/StackStrip.astro`, cambiar la retícula de grupos a `lg:grid-cols-2` y la de celdas a `grid-cols-1 sm:grid-cols-3`; verificar por inspección que el archivo contiene exactamente esas clases y que ningún otro elemento cambia

## 2. Verificación integral

- [x] 2.1 `pnpm build` completa sin errores y `pnpm astro check` reporta 0 errores
- [x] 2.2 Inspección directa del dist: grupos con `lg:grid-cols-2`, celdas con `grid-cols-1 sm:grid-cols-3`, hook `data-motion` ×1, 12 celdas, 4 etiquetas, 12 símbolos, bordes y copy intactos
- [x] 2.3 Medición puntual (si el server local sigue activo): 0 celdas con desborde en 375/640/768/1024/1280 px; browser cerrado en el mismo paso
- [x] 2.4 Registrar pendientes humanos: barrido visual 320→1440 (distribución 1/3 columnas, grupos apilados en tablet, hover de celdas)

## 3. Cierre

- [x] 3.1 Commit selectivo (`fix(stack): ...` + artefactos OpenSpec), sin push sin confirmación, y verificación con `git log`
- [x] 3.2 Reporte final §06 con evidencia y pendientes
