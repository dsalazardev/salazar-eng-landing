# Propuesta: Choreografía de animación "Slow & Elegant"

## Why

La capa de animación actual (duraciones 150–250 ms, curva `outQuad`/`out(3)` única, y hooks `data-motion` solo en el wrapper de cada sección) se percibe como un corte rápido y uniforme, no como un revelado. La marca vende "precisión de instrumento" y alto rendimiento percibido; con ~220 ms parejo y sin secuencia, la página pierde la oportunidad de narrar el scroll y de transmitir calma/valor B2B. Este cambio sube la calidad percibida con un ritmo escalonado más lento y elegante, sin añadir dependencias, islas ni scripts inline, y sin degradar LCP.

## What Changes

- **Retiming de la capa global:** se sustituye la banda fija 150–250 ms por una escala escalonada — reveals 560 ms, trazos 720/820 ms y conteo de métricas 1100 ms — con easings `outQuart`, `outExpo` y bezier `cubicBezier(0.22, 1, 0.36, 1)`.
- **Nuevo vocabulario declarativo `data-motion`:** `fade-up-lg`, `fade-scale`, `draw-v` y `stagger-list`, más los modificadores `data-motion-delay` y `data-motion-stagger`. Siguen siendo atributos; no añaden bytes de JS por elemento.
- **Cobertura coreografiada:** se añaden hooks a los hijos de Servicios, ProofOfWork, Process, Founder, FAQ, LeadMagnet, CtaFinal, Footer, ProblemSolution y StackStrip, para que la sección revele en orden de lectura (trazo → etiqueta → titular → contenido) en lugar de aparecer en bloque.
- **"Target pulse" al aterrizar en un ancla:** con `scroll-behavior: smooth` nativo, al llegar a la sección destino se re-traza su hairline (`draw`) y se re-hace fade de su etiqueta de sección (~300 ms), sin tocar el contenido que el usuario va a leer.
- **Presupuesto preservado:** el interceptor de clics de ancla vive dentro del módulo de animación diferido; se mantienen exactamente los 3 scripts inline y no se añade dependencia alguna.
- **Limpieza documental:** se corrige el `Purpose` obsoleto de `landing-stackstrip`, que aún describe "cinta continua CSS … con pausas accesibles" (marquee) cuando sus requirements ya definen una cuadrícula técnica.
- **No-goals (excluido deliberadamente):** `blur-in` (viola la regla de animar solo `transform`/`opacity`), View Transitions API (corte con fundido que rompe la continuidad espacial y exige JS extra), animaciones CSS scroll-driven (se mantiene la orquestación única en Anime.js), animación de entrada del hero por encima del pliegue (protección de LCP) y cualquier bucle decorativo.

## Capabilities

### New Capabilities
<!-- Ninguna: el comportamiento vive en la capa base y en capacidades existentes. -->

### Modified Capabilities

- `landing-base`: se modifica el requirement **"Capa de animación global con Anime.js"** (escala temporal escalonada, vocabulario de triggers ampliado, secuencia por sección y target pulse) y se añade un requirement nuevo **"Pulse de aterrizaje en anclas"** para el comportamiento de navegación interna.

## Impact

- **Código:** `src/scripts/motion.ts`, `src/scripts/motion-stack.ts` (se retima y se generaliza a `motion-list.ts`), 10 componentes en `src/components/sections/`, `src/styles/global.css` (transición de cards).
- **Specs:** `openspec/specs/landing-stackstrip/spec.md` cambia solo en su `Purpose` (edición directa permitida por OpenSpec; no es un delta de requirements).
- **Sin dependencias nuevas.** `BaseLayout.astro` y los 3 scripts inline no cambian; las islas React (`ContactForm`, `LazyEmbed`) no se tocan; `astro.config.mjs` no se toca.
- **Rendimiento:** el chunk del módulo de animación (objetivo ≤ 15 KB gzip) crece marginalmente (~0.3–0.8 KB) por el interceptor; la carga inicial crítica se mantiene por debajo de 10 KB.
- **Riesgo:** LCP/Lighthouse si se animara contenido sobre el pliegue; mitigado excluyendo el hero de nuevas entradas.
