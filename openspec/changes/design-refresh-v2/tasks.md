# Tasks

## 1. Fixes previos (desbloquean el build)

- [x] 1.1 Migrar los imports de iconos a `@lucide/astro` en `src/components/sections/Navbar.astro` (`Menu`, `X`) y `src/components/sections/Faq.astro` (`ChevronDown`), conservando clases y tamaños; verificar con `pnpm astro check` (0 errores) y `pnpm build` (completa sin el error de resolución de `lucide-astro`)
- [x] 1.2 Actualizar `AGENTS.md` §04: sustituir "Cero librerías de animación" por la política Anime.js (capa única diferida, reduced-motion obligatorio, sin loops, duraciones 150–250 ms, LCP exento, presupuesto) y ajustar la fila de presupuesto JS (módulo diferido fuera de la carga inicial crítica); verificar por lectura del diff

## 2. Base del sistema (utilidades + módulo de motion)

- [x] 2.1 Añadir a `src/styles/global.css` las utilidades del sistema Precision Instrument (reglas full-bleed, retícula de instrumentación, hairlines de métricas, anotación mono) usando solo los 6 tokens, sin `box-shadow` ni gradientes; verificar con `pnpm build` e inspección del CSS construido (utilidades presentes, tokens intactos, sin sombras/gradientes)
- [x] 2.2 Crear el módulo único de animación `src/scripts/motion.ts` (hooks `data-motion`, IntersectionObserver de una pasada, guard `prefers-reduced-motion` con `matchMedia`, duraciones 150–250 ms, solo `transform`/`opacity`, conteo una vez) y montarlo desde `BaseLayout.astro` como script de módulo externo; verificar con `pnpm astro check` (0 errores) y `pnpm build` (chunk externo hasheado, no inline)

## 3. Rediseño por sección (orden narrativo)

- [x] 3.1 Navbar: franja de estado decorativa (`aria-hidden`) y enlaces numerados con índices mono, sin alterar destinos, CTA, sticky ni el menú móvil; verificar con `pnpm astro check` e inspección del HTML (4 destinos intactos, franja oculta para AT, popover intacto)
- [x] 3.2 Hero: panel de instrumentos y franja de métricas con hairlines verticales (`<500 ms`, `F1 0.99`, `<24 h`), con titular, subtítulo, CTAs y micro-prueba intactos y el `h1` sin hooks de motion; verificar por inspección (valores presentes, copy verbatim, `h1` sin `data-motion`)
- [x] 3.3 Stack: sustituir marquee por cuadrícula técnica de celdas (retirar keyframes, máscara y control de pausa), conservando las 16 tecnologías verbatim en una única lista semántica; verificar con `pnpm build` e inspección (sin keyframes de marquee, 16 cadenas exactas, una sola lista, sin JS propio)
- [x] 3.4 Problema/Solución: matriz de diagnóstico con reglas full-bleed y etiquetas de resolución decorativas (`aria-hidden`), conservando los 3 pares cita→respuesta verbatim y sin añadidos de negocio; verificar por inspección (3 pares exactos, etiquetas decorativas, sin iconos/CTA)
- [x] 3.5 Servicios: bento console con jerarquía reforzada, métrica `<500 ms` como lectura y h2 aceptado "Servicios de Ingeniería Especializada", conservando el copy de las 3 tarjetas y el CTA; verificar por inspección (h2 aceptado, 3 tarjetas verbatim, CTA `#casos`)
- [x] 3.6 Evidencia: diagramas C4 como pieza gráfica central con layout alternado ①②③, conservando nombres, retos, métricas verificadas y links; verificar por inspección (3 títulos exactos, `F1 0.99`/`Recall crítico 1.00`/`47 tests`, links confirmados)
- [ ] 3.7 Proceso: nodos conectados de instrumentación sobre el `<ol>` de 4 pasos, conservando numeración y copy; verificar por inspección (un `<ol>` con 4 `<li>`, copy verbatim, sin iconos/imágenes/CTA)
- [ ] 3.8 Fundador: dossier editorial con marco de instrumentación sobre el retrato (grayscale y encuadre 4:5 intactos), conservando bio, cita, cierre y credenciales; verificar por inspección (textos exactos, asset WebP hasheado, sin enlaces sociales)
- [ ] 3.9 Checklist: panel de captación rediseñado con título de sección aceptado "Recurso Técnico Gratuito", conservando contrato del formulario (labels, opciones, `email`/`need`, endpoint) y microcopy; verificar por inspección (título presente, contrato intacto, `noscript` presente)
- [ ] 3.10 FAQ: accordion técnico con reglas full-bleed y hairlines, conservando las 5 preguntas/respuestas y el comportamiento nativo (`details`/`summary`, exclusividad por `name`); verificar por inspección (`details` ×5, `name="faq"` ×5, copy verbatim)
- [ ] 3.11 CTA final: consola oscura de cierre con retícula sutil, conservando copy, fallback de agendamiento, alternativa email/WhatsApp y ancla; verificar por inspección (`id="contacto"` ×1, `cal.com` ausente del HTML inicial, firma presente)
- [ ] 3.12 Footer: colofón técnico con anotaciones decorativas, conservando firma, contacto, enlaces y copyright; verificar por inspección (firma, email/WhatsApp, 4 enlaces, footer tras `</main>`)

## 4. Animaciones Anime.js (por tipo)

- [ ] 4.1 Entradas fade+rise: añadir hooks `data-motion="fade"` a los bloques below-the-fold (nunca al `h1` del hero); verificar con `pnpm build` e inspección (hooks presentes, `h1` sin hook) y pasada humana del efecto
- [ ] 4.2 Trazo de hairlines: hooks `data-motion="draw"` en reglas/retícula decorativas; verificar por inspección (hooks en elementos decorativos, no en contenido) y pasada humana
- [ ] 4.3 Hover de cards y CTAs: hover sutil (tono de borde/elevación mínima, transición de CTA) sin layout shift; verificar por inspección del CSS y pasada humana de hover
- [ ] 4.4 Conteo de métricas: conteo único al entrar en viewport, terminando exactamente en los valores reales; verificar con pasada humana (métricas cuentan una vez y aterrizan en los valores verbatim)
- [ ] 4.5 Movimiento reducido: verificar el guard `prefers-reduced-motion` (matchMedia → estado final visible, sin animaciones); verificar por inspección del módulo y pasada humana con la preferencia activada

## 5. Verificación de aceptación

- [ ] 5.1 Ejecutar `pnpm astro check` y `pnpm build` y registrar las salidas completas (0 errores; build completa)
- [ ] 5.2 Inspeccionar el dist: anclas del contrato (`#hero`→`#contacto`), 3 scripts inline < 10 KB, chunk del módulo de motion externo y hasheado, utilidades del sistema presentes y 6 tokens intactos
- [ ] 5.3 Medir y registrar el peso del chunk de motion (objetivo ≤ 15 KB gzip); si lo excede, aplicar imports granulares de Anime.js, volver a medir y registrar el peso final
- [ ] 5.4 Barrido responsive 320→1440 px, verificación de `prefers-reduced-motion` y del LCP del titular (candidato sin animación); registrar como verificación humana pendiente del dueño
- [ ] 5.5 Verificación de contenido verbatim por grep del dist: "Telemetry Heart AI", "DoliGestión", "Ecosistema de microservicios", "F1 0.99", "Recall crítico 1.00", "47 tests", las 5 preguntas del FAQ y la bio del fundador; comprobar ausencia de contenido inventado ("Legacy Core", "Migración de Core", "Strangler", "ZERO-DOWNTIME", "PROD-READY")
- [ ] 5.6 Condicional: si durante la implementación cambian los tokens (no previsto), actualizar `.stitch/DESIGN.md`, `.stitch/metadata.json` y el design system de Stitch; si no cambian (esperado), registrar la decisión de no tocar artefactos de diseño

## 6. Cierre

- [ ] 6.1 Revisar `git status`/`git diff` por bloques y commitear con mensajes convencionales (`fix(lucide)`, `docs(agents)`, `feat(design)`, `feat(motion)`, `docs(openspec)`); verificar el alcance con `git show --stat` por commit
- [ ] 6.2 Redactar el reporte final del apply: salidas de `astro check`/`build`, pesos medidos, resultado del grep verbatim, pendientes humanos y problemas encontrados
