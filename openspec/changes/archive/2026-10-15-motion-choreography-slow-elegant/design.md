# Design: Choreografía de animación Slow & Elegant

## Context

Ver `proposal.md` para la motivación. Estado y restricciones que condicionan el enfoque:

- **Capa actual** (`src/scripts/motion.ts`, `src/scripts/motion-stack.ts`): un `IntersectionObserver` (`rootMargin: 0 0 -8% 0`, `threshold: 0.12`, `unobserve` al primer disparo) con hooks resueltos por `dataset.motion.includes(...)`; pre-estados con `utils.set`; Anime.js v4 (`animate`, `utils`, y `waapi`/`stagger` solo en el chunk perezoso).
- **Restricciones de spec** (`landing-base`): solo `transform`/`opacity`, sin bucles, `prefers-reduced-motion` desactiva todo, LCP del hero exento, chunk del módulo ≤ 15 KB gzip, y varias specs de sección fijan **exactamente 3 scripts inline** en la carga inicial.
- **Presupuesto**: el módulo de motion se bundlea en `BaseLayout...js` (≈13.3 KB gzip medidos). Añadir elementos `data-motion` no cuesta bytes (el módulo es genérico); lo que cuesta es añadir *tipos de trigger* y lógica de intercepción.
- **Orden de evaluación frágil**: los `else if` del observer usan `includes`, por lo que los triggers nuevos que contienen `fade` deben evaluarse antes que `fade`.
- **Deuda documental**: el `Purpose` de `openspec/specs/landing-stackstrip/spec.md` aún describe un marquee, en contradicción con sus requirements.

## Goals / Non-Goals

**Goals:**
- Ritmo escalonado y "asentado" (lujo B2B) con una escala temporal única y documentada.
- Vocabulario declarativo ampliado que permita coreografiar desde el markup sin tocar JS.
- Cobertura por sección en orden de lectura, sin scripts inline nuevos ni dependencias.
- Mantener LCP, `prefers-reduced-motion`, el presupuesto de JS y el apoyo a `astro check`/`build`.

**Non-Goals:**
- No se cambia la estrategia de carga del módulo (sigue como módulo externo en `BaseLayout`); diferirlo de verdad es un cambio aparte.
- No se migran reveals a CSS scroll-driven ni se parten imports por subpath de Anime.js.
- No se anima el hero por encima del pliegue ni el `<h1>`.
- No se introduce View Transitions, `blur`/`filter`, ni bucles.

## Decisions

### D1 — Escala temporal escalonada en lugar de un único valor "lento"
Sustituir 150–250 ms por una escala por familia: `reveal 560`, `revealLg 640`, `draw 720`, `drawV 820`, `count 1100`, `stagger 90/elemento`.
- **Por qué:** un valor parejo de 800–1200 ms en *toda* entrada hace que el scroll se sienta pesado (el usuario ya hizo scroll y espera contenido); la jerarquía temporal (trazo > conteo > entrada) es lo que produce "revelado" en vez de "corte".
- **Alternativas:** uniforme 800–1200 ms (rechazada: laggy), mantener 150–250 ms (rechazada: es el problema a resolver), spring/overshoot (rechazada: rompe la estética de instrumento y "sin bucles").

### D2 — Set de easings de asentamiento
`outQuart` (entradas), `outExpo` (conteo y trazo), `cubicBezier(0.22, 1, 0.36, 1)` (tarjetas/headings).
- **Por qué:** arranque rápido y frenada larga = sensación de masa y precisión; `outExpo` en cifras hace que el número "asiente".
- **Alternativas:** `inOutSine` (rechazada: arranque perezoso, poco reactivo), `linear` (rechazada: mecánico).

### D3 — Vocabulario declarativo + modificadores en el DOM
Añadir `fade-up-lg`, `fade-scale`, `draw-v`, `stagger-list` y leer `data-motion-delay` / `data-motion-stagger` del dataset.
- **Por qué:** el coste en bytes es del *tipo de trigger*, no del número de elementos; coreografiar por delays desde el markup evita recompilar JS por sección.
- **Alternativas:** clases CSS por elemento (rechazada: fragmenta la lógica), config JS central por sección (rechazada: acopla markup y módulo).

### D4 — `stagger-list` reutiliza el chunk perezoso
Generalizar `motion-stack.ts` a `motion-list.ts` (o añadir export) y disparar el `import()` dinámico al entrar `stagger-list` o `stack-power`.
- **Por qué:** `stagger`/`waapi` solo se descargan cuando hacen falta, manteniendo la carga base estable.
- **Alternativas:** meter `stagger` en el módulo base (rechazada: engorda el chunk principal), duplicar lógica (rechazada).

### D5 — "Target pulse" con listener delegado en el módulo diferido
Un único `document.addEventListener('click', …)` dentro de `motion.ts` detecta `a[href^="#"]`, registra el destino y, al entrar la sección en viewport, re-ejecuta `draw` del hairline + `fade` de la etiqueta.
- **Por qué:** no añade script inline (respeta "exactamente 3 scripts inline"), conserva el smooth scroll nativo (mejor continuidad espacial que un fundido) y reutiliza la maquinaria existente.
- **Alternativas:** View Transitions API (rechazada: cross-fade rompe la continuidad, coste de snapshot, soporte parcial), keyframes CSS con `:target` (rechazada: fragmenta la orquestación en CSS, decisión 5 del dueño), no hacer nada (rechazada: se pierde la sensación de aterrizaje).

### D6 — Hero fuera de las nuevas entradas
El hero no recibe `fade`/`stagger-list`; solo se retiman sus `draw`/`count` (por debajo del pliegue).
- **Por qué:** el hero es candidato a LCP y la marca promete Lighthouse alto; animar sobre el pliegue arriesga LCP y CLS percibido.
- **Alternativas:** animar el subtítulo (rechazada por LCP), animar toda la franja de métricas (rechazada: ya usa `count`; el stagger+count se pisan).

### D7 — Sin `blur`, sin CSS scroll-driven, imports de Anime.js sin cambios
- **Por qué:** `blur` viola "solo transform/opacity" y es costoso; el scroll-driven en CSS fragmentaría la orquestación; partir imports por subpath es una optimización ortogonal que añade riesgo sin necesidad ahora.
- **Alternativas:** `blur-in` (rechazada), `animation-timeline: view()` (rechazada), `animejs/animation`+`utils` subpaths (diferida a un change de presupuesto).

### D8 — Limpieza del `Purpose` de `landing-stackstrip` en el apply
El CLI de OpenSpec no acepta `## Purpose` en deltas de capacidades existentes: la limpieza se hace editando directamente `openspec/specs/landing-stackstrip/spec.md` durante el apply (queda como tarea), no como delta.
- **Por qué:** el `Purpose` es metadato de la spec, no un requirement testeable.
- **Alternativas:** delta con `## Purpose` (ignorada por OpenSpec), spec nueva (innecesaria).

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Entradas demasiado lentas percibidas como "laggy" | Escala escalonada (D1) y no uniforme; reveals en 560–640 ms |
| LCP/Lighthouse degradado por animar sobre el pliegue | Hero excluido de nuevas entradas (D6); h1 nunca animado |
| El orden de `else if` con `includes` captura `fade-up-lg`/`fade-scale` como `fade` | Evaluar los triggers específicos antes que `fade`; conservar el patrón existente |
| `opacity: 0` pre-estado anuncia a AT contenido aún invisible | Se mantiene el patrón actual (progressive enhancement); el contenido no se oculta con `aria-hidden`; con JS desactivado queda visible |
| Chunk del módulo supera 15 KB gzip con el interceptor | Interceptor mínimo (~0.3–0.8 KB); medir gzip en build y registrar; si excede, mover el pulse a un `import()` |
| Pulse re-anima contenido que el usuario va a leer | El pulse solo re-traza hairline + etiqueta, nunca el contenido (requirement) |
| Apagado de `prefers-reduced-motion` evaluado una sola vez al cargar | Se mantiene el comportamiento actual (sin listener de cambio); aceptado |

## Migration Plan

1. Retimar `motion.ts` y generalizar el chunk perezoso.
2. Añadir el vocabulario y el interceptor de anclas en `motion.ts`.
3. Sembrar `data-motion` en las secciones (sin tocar `BaseLayout`, islas ni config).
4. Ajustar la transición de cards en `global.css`.
5. Editar el `Purpose` de `landing-stackstrip`.
6. Verificar por inspección del build (`dist/client/index.html`, `dist/client/_astro/*.js` hasheados, peso gzip, 3 scripts inline) y `pnpm astro check` / `pnpm build`.
- **Rollback:** revertir el commit del change; no hay migración de datos ni estado persistente.

## Open Questions

- ¿Delay y stagger exactos por sección (p. ej. `ProblemSolution` 0/90/180 ms)? Se ajustan en el apply mirando el viewport real, sin cambiar specs.
- ¿Se renombra `motion-stack.ts` a `motion-list.ts` o se conserva el nombre con un export nuevo? Decisión cosmética, no afecta specs ni tareas.
