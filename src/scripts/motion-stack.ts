/**
 * Precision Instrument — animación de la cuadrícula de Stack (chunk perezoso).
 *
 * Se importa dinámicamente desde `motion.ts` cuando la sección Stack entra
 * al viewport: `waapi` + `spring` + `stagger` solo se descargan a demanda,
 * manteniendo `motion.js` (carga base) dentro del presupuesto ≤ 15 KB gzip.
 *
 * Política (AGENTS.md §04): pulso sutil por celda, 220 ms, spring near-critical,
 * stagger 35 ms, solo `transform`/`opacity`, sin bucles, una sola pasada y
 * `prefers-reduced-motion: reduce` desactiva todo dejando la cuadrícula visible.
 */
import { spring, stagger, utils, waapi } from 'animejs';

export function initStackMotion(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const grids = document.querySelectorAll<HTMLElement>('[data-motion~="stack-power"]');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        observer.unobserve(entry.target);
        const cells = (entry.target as HTMLElement).querySelectorAll<HTMLElement>(':scope > li');
        // Pre-estado idempotente: `motion.ts` ya oculta las celdas al cargar
        // para evitar un flash antes de que llegue este chunk.
        utils.set(cells, { opacity: 0, scale: 0.96 });
        waapi.animate(cells, {
          opacity: [0, 1],
          scale: [0.96, 1],
          duration: 220,
          ease: spring({ stiffness: 170, damping: 18 }),
          delay: stagger(35),
        });
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const grid of grids) {
    observer.observe(grid);
  }
}
