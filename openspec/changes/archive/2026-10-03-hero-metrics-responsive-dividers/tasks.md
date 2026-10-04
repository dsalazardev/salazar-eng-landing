# Tasks

## 1. Utilidad responsiva

- [x] 1.1 En `src/styles/global.css`, hacer responsiva `.metric-divider`: base `border-top: 1px solid var(--color-line)` y, desde `min-width: 640px`, `border-top: 0` + `border-left: 1px solid var(--color-line)`; actualizar el comentario de la utilidad; verificar por inspección que la regla base y la media query están presentes y que los 6 tokens no se tocan

## 2. Verificación integral

- [x] 2.1 `pnpm build` completa sin errores y `pnpm astro check` reporta 0 errores
- [x] 2.2 Inspección del CSS construido: `.metric-divider` con la regla base (`border-top`) y la media query (`min-width: 640px` con `border-left` y `border-top: 0`); sin cambios en tokens
- [x] 2.3 Medición puntual (si el server local sigue activo): a 375 px los ítems 2-3 con `border-top: 1px` y `border-left: 0`; a 1280 px `border-left: 1px` y `border-top: 0`; browser cerrado en el mismo paso
- [x] 2.4 Registrar pendientes humanos: barrido visual de la banda (móvil apilada con hairlines horizontales; desktop con verticales), sin líneas huérfanas

## 3. Cierre

- [x] 3.1 Commit selectivo (`fix(hero): ...` + artefactos OpenSpec), sin push sin confirmación, y verificación con `git log`
- [x] 3.2 Reporte final §06 con evidencia y pendientes
