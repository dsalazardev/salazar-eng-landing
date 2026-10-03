# Tasks

## 1. Navbar — eliminar metadatos inventados

- [x] 1.1 En `src/components/sections/Navbar.astro`, eliminar los `<span>` con `SYS_STATUS: OPERATIONAL` y `CALIBRATED // SYS_2026`, conservando la franja con `LATAM / UTC-5` y su `aria-hidden`; verificar por inspección que las cadenas `SYS_STATUS` y `CALIBRATED` ya no existen en el archivo

## 2. Hero — limpieza, latencia y accesibilidad

- [x] 2.1 Eliminar la anotación `INSTRUMENT #01 // ISOTIPO SE` del panel visual y verificar que la cadena `INSTRUMENT` no existe en `Hero.astro`
- [x] 2.2 Eliminar la anotación `GRID 30` del panel visual y verificar que la cadena no existe en `Hero.astro`
- [x] 2.3 Eliminar la microcopy `Respuesta en menos de 24 h · Remoto LATAM · Internacional` del hero (se conserva en `CtaFinal.astro`) y verificar que la cadena no aparece en `Hero.astro`
- [x] 2.4 Renombrar la etiqueta `SLA EN PRODUCCIÓN` → `LATENCIA EN PRODUCCIÓN` y verificar que `SLA EN PRODUCCIÓN` ya no existe en el hero
- [x] 2.5 Retirar `aria-hidden="true"` del contenedor de la franja de métricas (conservando el del panel visual) y verificar que `<500 ms`, `F1 0.99` y `<24 h` quedan expuestos al árbol de accesibilidad

## 3. StackStrip — eliminar h2 redundante

- [x] 3.1 Eliminar el `<h2>` `STACK DE PRODUCCIÓN` (conservando la etiqueta `03/ ECOSISTEMA TÉCNICO` y el subtítulo) y verificar que la cadena `STACK DE PRODUCCIÓN` no existe en `StackStrip.astro`

## 4. ProblemSolution — eliminar etiquetas de resolución

- [x] 4.1 Eliminar el `<span>` con `RESOLUCIÓN 0{index + 1}` de cada respuesta y verificar que la cadena `RESOLUCIÓN` no aparece en `ProblemSolution.astro`

## 5. Founder — eliminar PLATE 08

- [x] 5.1 Eliminar la etiqueta `PLATE 08 // RETRATO` (conservando las cruces del marco) y verificar que la cadena `PLATE` no aparece en `Founder.astro`

## 6. Faq — eliminar INDEX // FAQ_05

- [x] 6.1 Eliminar la etiqueta `INDEX // FAQ_05` y verificar que la cadena `FAQ_05` no aparece en `Faq.astro`

## 7. Footer — eliminar COLOPHON

- [x] 7.1 Eliminar la línea `COLOPHON // SOFTWARE & APPLIED AI` y verificar que la cadena `COLOPHON` no aparece en `Footer.astro`

## 8. Verificación integral

- [x] 8.1 `pnpm build` completa sin errores y `pnpm astro check` reporta 0 errores
- [x] 8.2 Inspección directa del build (sin preview): 0 residuos de las 8 cadenas eliminadas, `SLA EN PRODUCCIÓN` y `STACK DE PRODUCCIÓN`; presentes `LATENCIA EN PRODUCCIÓN`, `LATAM / UTC-5` y el microcopy únicamente en el cierre
- [x] 8.3 Confirmar por inspección del HTML construido que la franja de métricas del hero ya no está `aria-hidden` y que el panel visual conserva su `aria-hidden`
- [x] 8.4 Registrar como pendientes humanos: pasada visual (navbar, hero, fundador, FAQ, footer), lectura con lector de pantalla de las 3 métricas y confirmación de las etiquetas de los diagramas C4 (marcadas REVISAR, sin cambios de código)

## 9. Cierre

- [x] 9.1 Commits por bloque (Conventional Commits en español; sin push sin confirmación) y verificación con `git log` de los commits esperados
- [x] 9.2 Reporte final con el formato de §06 de AGENTS.md, incluyendo verificaciones humanas pendientes y la marca REVISAR de los diagramas C4
