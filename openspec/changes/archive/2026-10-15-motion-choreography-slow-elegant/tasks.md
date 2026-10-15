# Tasks

> Verificación sin servidor (AGENTS.md §06): inspección directa de `dist/client/` tras `pnpm build`. No levantar `dev`/`preview`.

## 1. Retiming de la capa base

- [x] 1.1 En `src/scripts/motion.ts`, sustituir las duraciones 220/240/250 por la escala escalonada (`fade` 560, `fade-up-lg`/`fade-scale` 640, `draw` 720, `draw-v` 820, `count` 1100, stagger 90) y aplicar easings `outQuart`/`outExpo`/`cubicBezier(0.22, 1, 0.36, 1)`. Verificar por inspección del bundle construido que el chunk de motion contiene los nuevos valores y ninguno de los antiguos 220/240/250.
- [x] 1.2 Mantener exclusivamente `opacity`/`transform` (sin `filter`/`blur`) y sin bucles en todo el módulo. Verificar con `grep -i "filter\|blur" dist/client/_astro/*.js` sobre el chunk de motion → sin coincidencias.
- [x] 1.3 Preservar el guard `prefers-reduced-motion` abarcando también `stagger-list` y el pulse de anclas. Verificar por inspección de que el bloque de inicialización sigue condicionado a `!reduceMotion.matches`.

## 2. Vocabulario y triggers nuevos

- [x] 2.1 Añadir los pre-estados y animaciones de `fade-up-lg` (translateY 32) y `fade-scale` (translateY 20 + scale 0.985) en `motion.ts`. Verificar que el HTML construido conserva los atributos y que el módulo registra ambos tokens.
- [x] 2.2 Añadir el trigger `draw-v` (scaleY 0→1, origen superior). Verificar que `data-motion="draw-v"` se resuelve en el módulo y que no se confunde con `draw`.
- [x] 2.3 Añadir `stagger-list` (stagger de hijos directos) leyendo `data-motion-stagger` (fallback 90 ms) y `data-motion-delay` para delays por elemento. Verificar que un contenedor con `data-motion="stagger-list"` anima sus hijos en secuencia.
- [x] 2.4 Ordenar los `else if` para evaluar `fade-up-lg` y `fade-scale` antes que `fade` (evitar que `includes('fade')` los capture). Verificar por revisión del módulo y prueba de que una sección con `fade-up-lg` usa la duración de 640 ms.

## 3. Chunk perezoso generalizado

- [x] 3.1 En `src/scripts/motion-stack.ts`, retimar el stagger a 520 ms / `out(4)` / `stagger(90)` y exponer un `initListMotion(target, stagger)` reutilizable (conservar el nombre de archivo para minimizar churn). Verificar que `stack-power` sigue animando sus celdas y que `stagger-list` reutiliza el mismo `import()` dinámico.
- [x] 3.2 Mantener el `fallback` que muestra el contenido en estado final si el chunk no carga. Verificar por revisión del `catch`.

## 4. Cobertura declarativa por sección

- [x] 4.1 `ProblemSolution.astro`: `data-motion="stagger-list"` en el `<ul>` de dolores. Verificar que los 3 ítems quedan en el HTML con el hook y se animan escalonados.
- [x] 4.2 `Services.astro`: `data-motion="fade-scale"` por cada `Card` (3). Verificar los 3 hooks en el HTML construido.
- [x] 4.3 `ProofOfWork.astro`: `data-motion="fade-scale"` por cada caso (3) y `data-motion="draw"` en los divisores internos. Verificar los hooks en el HTML construido. — **N/A aceptado:** `fade-scale` aplicado en los 3 casos; `draw` no aplica porque la tarjeta no tiene divisores internos (no se añaden elementos visuales nuevos).
- [x] 4.4 `Process.astro`: `data-motion="stagger-list"` en el `<ol>`, `data-motion="draw-v"` en el rail vertical de desktop y `fade-up-lg` por paso. Verificar hooks y que el rail vertical no rompe en móvil. — **N/A aceptado:** `stagger-list` aplicado en el `<ol>` y `draw-v` en los conectores verticales móviles (el rail de desktop es horizontal y conserva `draw`); el `fade-up-lg` por paso se sustituye por el stagger de la lista, que aporta el mismo revelado en orden de lectura sin doble animación.
- [x] 4.5 `Founder.astro`: `data-motion="fade"` en retrato/bio y `data-motion="stagger-list"` en credenciales. Verificar hooks en el HTML construido.
- [x] 4.6 `LeadMagnet.astro`: `data-motion="fade-scale"` en la `Card` del formulario. Verificar que el hook no envuelve la isla React de forma que afecte su hidratación (`client:visible`).
- [x] 4.7 `Faq.astro`: `data-motion="stagger-list"` en el contenedor de `<details>`. Verificar que el accordion nativo (`<details name="faq">`) sigue funcionando sin JS y que el stagger no altera su altura.
- [x] 4.8 `CtaFinal.astro`: `data-motion="draw"` + `data-motion="fade-up-lg"` en el heading y `data-motion="fade"` en el bloque de CTA/email. Verificar hooks en el HTML construido. — **N/A aceptado:** `fade-up-lg` en el heading y `fade` en el bloque de CTA/email aplicados; `draw` no aplica porque la sección no tiene hairline propia (no se añaden elementos visuales nuevos).
- [x] 4.9 `Footer.astro`: `data-motion="stagger-list"` en la lista de `navLinks`. Verificar hook en el HTML construido.
- [x] 4.10 `StackStrip.astro`: `data-motion="fade"` en la etiqueta/subtítulo (mantener `stack-power` en la cuadrícula). Verificar hooks en el HTML construido.
- [x] 4.11 `Hero.astro`: NO añadir hooks nuevos; solo verificar que `draw`/`count` siguen presentes y que el `<h1>` y el contenido sobre el pliegue no tienen `data-motion`. Verificar con `grep` sobre el hero construido.

## 5. Target pulse en anclas

- [x] 5.1 En `motion.ts`, añadir un `document.addEventListener('click', …)` delegado que detecte `a[href^="#"]`, registre el destino y, al entrar en viewport, re-ejecute `draw` del hairline + `fade` de la etiqueta de la sección. Verificar que no se añade ningún `<script>` inline nuevo (siguen exactamente 3).
- [x] 5.2 Garantizar que el pulse NO re-oculta ni re-anima el contenido de la sección, y que no hay duplicación con la entrada inicial. Verificar por revisión del guard de "ya revelada".
- [x] 5.3 Desactivar el pulse con `prefers-reduced-motion: reduce`. Verificar por revisión del guard y que el smooth scroll nativo permanece intacto.
- [x] 5.4 Eliminar cualquier rastro de View Transitions API (`startViewTransition`) en el módulo. Verificar con `grep -i "startViewTransition" src/ dist/` → sin coincidencias. — **Nota:** `src/` y el módulo de motion no contienen la API; el único match en `dist/` vive dentro del renderer vendored de React (`client.*.js`), ajeno a este change.

## 6. Estilos

- [x] 6.1 En `src/styles/global.css`, subir la transición de `.card-instrument` a ~220 ms `ease-out` (coherente con la nueva escala). Verificar que el CSS construido (`dist/client/_astro/*.css`) contiene la nueva duración.

## 7. Limpieza documental

- [x] 7.1 Editar directamente `openspec/specs/landing-stackstrip/spec.md`: reemplazar el `Purpose` que menciona "cinta continua CSS sin JavaScript con pausas accesibles"/marquee por la descripción de la cuadrícula técnica de 4 categorías. Verificar que el `Purpose` ya no contiene "cinta" ni "marquee".

## 8. Verificación de aceptación

- [x] 8.1 `pnpm astro check` termina con 0 errores. Verificar salida del comando.
- [x] 8.2 `pnpm build` completa y emite `dist/client/index.html` + `dist/client/_astro/*.js` hasheados. Verificar existencia de los artefactos.
- [x] 8.3 Inspeccionar `dist/client/index.html`: confirmar que existen exactamente 3 scripts inline y que el módulo de animación no es uno de ellos. Verificar conteo con `grep`.
- [x] 8.4 Medir el peso gzip del chunk del módulo de animación y registrarlo (objetivo ≤ 15 KB). Verificar con `gzip -c dist/client/_astro/<motion>.js | wc -c`.
- [x] 8.5 Confirmar que las anclas del navbar (`#servicios`, `#casos`, `#proceso`, `#faq`, `#contacto`) siguen existiendo y que `scroll-behavior: smooth` sigue condicionado a `prefers-reduced-motion: no-preference`. Verificar por `grep` sobre el dist y `global.css`.
- [x] 8.6 Registrar como verificación humana pendiente del dueño: percepción del ritmo (slow & elegant) y del target pulse en navegador real, y ausencia de jank en scroll (AGENTS.md §06).
